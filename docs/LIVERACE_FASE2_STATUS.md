# LiveRace — Estado da Fase 2: Check-in e Controlo de Acesso

> **Documento de validação** — criado em março de 2026  
> Valida o estado real de implementação face ao plano da Fase 2 definido em `ROADMAP_LIVERACE.md`.

---

## Resumo Executivo

A **Fase 2 (Check-in e Controlo de Acesso)** está **parcialmente implementada**. A infraestrutura de dados e os endpoints principais de check-in existem e funcionam. O que falta é o **enforcement da janela de check-in no backend**, a **transição automática de `liveStatus`**, a **página "Minhas Inscrições" para o atleta**, e o **gating real do modo corrida** (que depende da Fase 3 — modelos `RaceSession` e `TrackingPoint`).

| Área | Estado | Notas |
|------|--------|-------|
| Schema DB (campos) | ✅ Completo | Todos os campos existem na migração `feat_liverace_fase0` |
| API check-in manual (staff) | ✅ Funcional | Sem validação da janela |
| API QR ticket (atleta) | ✅ Funcional | JWT sem expiração, revogação por nonce |
| API verify-ticket (QR scan + check-in) | ✅ Funcional | Sem validação da janela |
| UI organizer — config janela check-in | ✅ Funcional | `checkInOpensAt` / `checkInClosesAt` editáveis |
| UI organizer — toggle check-in por inscrição | ✅ Funcional | Tab "Inscritos" no dashboard |
| UI atleta — ticket / QR code | ✅ Funcional | `EventTicketModal` com `checkedInAt` |
| Validação da janela de check-in (backend) | ❌ Ausente | Nenhum endpoint valida `checkInOpensAt ≤ now ≤ checkInClosesAt` |
| `CHECK_IN_OPEN` como estado de `liveStatus` | ❌ Ausente | Enum real não tem este valor (ver secção 4) |
| Endpoint de transição de `liveStatus` | ❌ Ausente | Só via PATCH genérico do evento |
| "Minhas Inscrições" (página atleta) | ❌ Ausente | Sem rota `/me/registrations` |
| Botão check-in self-service (atleta) | ❌ Ausente | Check-in só por staff via dashboard |
| UI scan QR (staff mobile) | ❌ Ausente | Só via dashboard toggle ou API direta |
| Gating "Start Race" | ❌ Ausente | Depende da Fase 3 (RaceSession) |
| Testes | ❌ Ausente | Sem testes para check-in ou verify-ticket |

---

## 1. O Que Está Implementado

### 1.1 Schema da Base de Dados

Todos os campos planeados para a Fase 2 existem no schema Prisma (migração `20260226141108_feat_liverace_fase0`):

```prisma
model Event {
  checkInOpensAt   DateTime?
  checkInClosesAt  DateTime?
  liveStatus       EventLiveStatus  @default(SCHEDULED)
  // ...
}

model Registration {
  checkedInAt  DateTime?   // null = não fez check-in
  ticketNonce  String      // rotated on revocation
  // ...
}

enum EventLiveStatus {
  SCHEDULED
  LIVE
  PAUSED
  FINISHED
  CANCELLED
}
```

> ⚠️ **Divergência vs Roadmap**: O enum `EventLiveStatus` **não inclui `CHECK_IN_OPEN`** (ver secção 4.1).

### 1.2 Endpoints de Check-in

#### `PATCH /api/events/[id]/registrations/[registrationId]/checkin`
- **Quem pode usar**: Plataforma admin, organizador (OWNER/ADMIN), qualquer staff
- **O que faz**: Toggle `checkedInAt` (set/unset)
- **Validações implementadas**:
  - ✅ Só inscrições `CONFIRMED` podem ser checked-in
  - ✅ Idempotente (retorna sucesso se já no estado pretendido)
  - ✅ Audit log via `console.log`
- **Validações em falta**:
  - ❌ Não verifica se `now` está dentro de `checkInOpensAt ≤ now ≤ checkInClosesAt`

#### `POST /api/events/[id]/registration/verify-ticket`
- **Quem pode usar**: Plataforma admin, organizador, staff
- **O que faz**: Verifica JWT do QR code e faz check-in automático se válido
- **Validações implementadas**:
  - ✅ Verifica assinatura JWT
  - ✅ Verifica `payload.eventId === eventId`
  - ✅ Verifica `registration.status === CONFIRMED`
  - ✅ Verifica nonce (revogação de tickets)
  - ✅ Retorna `alreadyCheckedIn` + dados da inscrição para UI de confirmação
- **Validações em falta**:
  - ❌ Não verifica janela de check-in (`checkInOpensAt` / `checkInClosesAt`)

#### `GET /api/events/[id]/registration/ticket`
- **Quem pode usar**: Atleta autenticado (própria inscrição ou guest com o mesmo email)
- **O que faz**: Gera e devolve JWT para o QR code do ticket
- **Notas**:
  - ✅ `noTimestamp: true` — o QR code é sempre idêntico para a mesma inscrição
  - ✅ Suporte a inscrições de convidados (guest in team)
  - ✅ Inclui `checkedInAt` na resposta para UI

#### `POST /api/events/[id]/registrations/[registrationId]/revoke-ticket`
- **Quem pode usar**: Plataforma admin, organizador (OWNER/ADMIN)
- **O que faz**: Roda o `ticketNonce` — invalida todos os JWTs antigos

### 1.3 Cancelamento de Inscrição

#### `POST /api/events/[id]/registration/cancel`
- **Quem pode usar**: Atleta autenticado (própria inscrição)
- **O que faz**: Cancela inscrição em estado `PENDING` e expira a sessão Stripe
- ⚠️ **Atenção**: só cancela `PENDING`. Cancelamento de `CONFIRMED` com reembolso **não está implementado** (ver secção 4.2).

### 1.4 Interface do Organizador

**Tab "Configurações"** (`tab-config.tsx`):
- ✅ Pickers de data/hora para `checkInOpensAt` e `checkInClosesAt`
- ✅ Toggle `hasLiveRace` (on/off)
- ✅ Salvaguarda via PATCH do evento

**Tab "Inscritos"** (`tab-inscritos.tsx`):
- ✅ Toggle manual de check-in por linha da tabela
- ✅ Filtro por "checked-in / não checked-in"
- ✅ Contador de inscrições checked-in no cabeçalho
- ✅ Coluna `checkedInAt` no CSV de exportação
- ✅ Mostra hora do check-in na linha

### 1.5 Interface do Atleta

**`EventTicketModal`**:
- ✅ Mostra QR code (JWT assinado)
- ✅ Mostra `checkedInAt` se check-in já foi feito
- ✅ Informação do evento, variante, bib number

---

## 2. O Que Falta Implementar

### 2.1 Validação da Janela de Check-in (Backend — CRÍTICO)

Nenhum endpoint valida atualmente se o check-in é feito dentro da janela configurada. Para cumprir o plano da Fase 2, é necessário adicionar esta validação em:

**`verify-ticket/route.ts`** (QR scan):
```typescript
// Adicionar após encontrar a registration
const now = new Date();
const windowOpen = event.checkInOpensAt ? now >= event.checkInOpensAt : true;
const windowClosed = event.checkInClosesAt ? now > event.checkInClosesAt : false;

if (!windowOpen) {
  return NextResponse.json(
    { valid: false, error: "Check-in window is not open yet" },
    { status: 422 }
  );
}
if (windowClosed) {
  return NextResponse.json(
    { valid: false, error: "Check-in window has closed" },
    { status: 422 }
  );
}
```

**Nota sobre check-in manual por staff**: O toggle manual no dashboard (`checkin/route.ts`) pode propositadamente não ter esta validação, para permitir que staff faça check-in fora de janela em situações excecionais. Decisão de produto a confirmar.

### 2.2 Estado `liveStatus` — Transição e Visibilidade

Atualmente, `liveStatus` só é atualizado via PATCH genérico do evento. Para os atletas e staff saberem em que estado está o evento, é necessário:

1. **Endpoint dedicado** (ou lógica no PATCH existente) para transições válidas:
   - `SCHEDULED → LIVE` (organizador abre a prova)
   - `LIVE → PAUSED` (pausa temporária)
   - `PAUSED → LIVE` (retomar)
   - `LIVE → FINISHED` (fechar prova)
   - Qualquer → `CANCELLED`

2. **UI de controlo** no dashboard do organizador (botão "Abrir Prova", "Encerrar Prova")

3. **Display do estado** na página pública do evento e na interface do atleta

### 2.3 "Minhas Inscrições" — Página do Atleta

Não existe nenhuma rota dedicada `/me/registrations` ou `/[locale]/profile/my-registrations`. O atleta vê inscrições futuras em `profile-upcoming-events.tsx`, mas sem:
- Lista completa (historial + futuras)
- Botão de check-in self-service dentro da janela
- Estado visual claro (janela fechada / janela aberta / já checked-in)
- CTA para "Iniciar Corrida" (fase 3)

### 2.4 Check-in Self-Service pelo Atleta

O check-in via QR é desenhado para staff (staff escaneia o QR do atleta). O atleta não tem forma de fazer o próprio check-in sem intervençao do staff. Para eventos sem staff físico, pode ser necessário um fluxo de "auto check-in" (atleta faz scan do QR do evento, ou clica num botão dentro da janela).

### 2.5 UI de Scan QR para Staff (Mobile)

Não existe UI de scan de QR dedicada para staff mobile. O endpoint `verify-ticket` está pronto, mas falta a interface (câmara + parse de QR + ecrã de confirmação com nome, variante, status do atleta).

### 2.6 Gating "Start Race" (Fase 3)

O gating completo — só atletas `CONFIRMED` + `checkedInAt != null` + evento em `LIVE` podem iniciar corrida — **depende da Fase 3** (modelos `RaceSession` e `TrackingPoint` ainda não existem). As condições de gating definidas no roadmap são:

```
Registration.status === "CONFIRMED"         ← ✅ campo existe
Registration.checkedInAt !== null           ← ✅ campo existe
Event.liveStatus === "LIVE"                 ← ✅ campo existe (sem enforcement)
permissões de localização concedidas (app)  ← ❌ mobile apenas, fase 3
```

### 2.7 Testes

Não existem testes automatizados para:
- Validação da janela de check-in
- Fluxo `verify-ticket` (QR scan)
- Revogação de tickets (nonce rotation)
- Gating de liveStatus

---

## 3. Endpoints Implementados vs Planeados

### Endpoints Existentes (Fase 2 relevantes)

| Método | Path | Estado | Notas |
|--------|------|--------|-------|
| `GET` | `/api/events/[id]/registration/ticket` | ✅ | Gera JWT para QR |
| `POST` | `/api/events/[id]/registration/verify-ticket` | ✅ | Scan QR + check-in (sem validação janela) |
| `POST` | `/api/events/[id]/registrations/[id]/revoke-ticket` | ✅ | Rotação de nonce |
| `PATCH` | `/api/events/[id]/registrations/[id]/checkin` | ✅ | Toggle manual por staff (sem validação janela) |
| `POST` | `/api/events/[id]/registration/cancel` | ✅ | Só cancela PENDING (checkout abortado) |

### Endpoints em Falta (Fase 2 + transição para Fase 3)

| Método | Path | Prioridade | Notas |
|--------|------|-----------|-------|
| `PATCH` | `/api/events/[id]/live-status` | 🔴 Alta | Transição de liveStatus com validação |
| `GET` | `/api/events/[id]/checkin-stats` | 🟡 Média | % checked-in por variante (dashboard em tempo real) |
| `PATCH` | `/api/registrations/[id]/cancel` (CONFIRMED) | 🟡 Média | Cancelamento com reembolso Stripe |
| `POST` | `/api/events/[id]/race-sessions/start` | 🔵 Fase 3 | Gating + início de tracking |

---

## 4. Divergências entre Roadmap e Implementação

### 4.1 `CHECK_IN_OPEN` em `EventLiveStatus`

O `ROADMAP_LIVERACE.md` menciona `CHECK_IN_OPEN` como estado intermédio:
```
SCHEDULED → CHECK_IN_OPEN → LIVE → FINISHED
```

No entanto, o enum atual no schema Prisma é:
```prisma
enum EventLiveStatus {
  SCHEDULED
  LIVE
  PAUSED
  FINISHED
  CANCELLED
}
```

**`CHECK_IN_OPEN` não existe**. Há duas opções para resolver:

**Opção A — Adicionar `CHECK_IN_OPEN`** (recomendado se o produto quiser estado explícito):
```prisma
enum EventLiveStatus {
  SCHEDULED
  CHECK_IN_OPEN   // ← adicionar
  LIVE
  PAUSED
  FINISHED
  CANCELLED
}
```
Implica migration Prisma + atualizar lógica de verificação (UI + API).

**Opção B — Derivar o estado da janela de check-in** (sem alterar o enum):
```typescript
// Estado derivado — sem campo extra na DB
function getEffectiveLiveStatus(event: Event): string {
  const now = new Date();
  if (event.liveStatus === "SCHEDULED") {
    if (event.checkInOpensAt && now >= event.checkInOpensAt) {
      if (!event.checkInClosesAt || now <= event.checkInClosesAt) {
        return "CHECK_IN_OPEN"; // estado virtual, não persiste
      }
    }
  }
  return event.liveStatus;
}
```
Não requer migration mas o estado não fica visível em queries simples.

**Recomendação**: Opção B para MVP (sem alterar o enum); Opção A numa iteração posterior se houver necessidade de filtrar/notificar por este estado.

### 4.2 Cancelamento de Inscrições CONFIRMED

O roadmap prevê: `PATCH /api/registrations/[id]/cancel` respeitando a política de reembolso do evento (`refundDeadline`).

A implementação atual (`POST /api/events/[id]/registration/cancel`) apenas cancela inscrições `PENDING` (abortar checkout). Inscrições `CONFIRMED` **não podem ser canceladas pelo atleta** via API.

Para implementar o cancelamento CONFIRMED:
1. Verificar `refundDeadline` do evento
2. Calcular se reembolso total, parcial ou nenhum
3. Criar `Stripe.refund` via API
4. Atualizar `Registration.status = CANCELLED` (+ `Registration.status = REFUNDED` se aplicável)

### 4.3 URL do Endpoint de Check-in

O issue de origem menciona `PATCH /api/registrations/[id]/check-in`, mas o endpoint real é:
```
PATCH /api/events/[id]/registrations/[registrationId]/checkin
```
A URL está aninhada sob `/events/[id]/` (contexto do evento), o que é mais correto arquiteturalmente.

---

## 5. Próximos Passos Recomendados

### Fase 2 — Completar

**Alta prioridade** (completam a Fase 2 como definida):

1. **Validação da janela de check-in em `verify-ticket`**
   - Adicionar verificação `checkInOpensAt ≤ now ≤ checkInClosesAt` no endpoint
   - Erro claro: "Janela de check-in não está aberta"

2. **Endpoint `PATCH /api/events/[id]/live-status`**
   - Transições válidas com validação de estado anterior
   - Protegido por role (OWNER/ADMIN ou plataforma admin)

3. **UI de controlo de `liveStatus` no dashboard do organizador**
   - Botão "Abrir Prova" (SCHEDULED → LIVE)
   - Botão "Encerrar Prova" (LIVE → FINISHED)
   - Indicador de estado atual

4. **Display do estado da prova na página do evento**
   - Badge: "Inscrições abertas" / "Check-in aberto" / "A decorrer" / "Terminado"

**Média prioridade**:

5. **Página "Minhas Inscrições"** (`/[locale]/me/registrations`)
   - Lista de todas as inscrições (futuras + historial)
   - Estado visual do check-in (aberto/fechado/feito)
   - Botão check-in self-service dentro da janela (se o produto o suportar)

6. **UI de scan QR para staff** (mobile-first)
   - Câmara → decode QR → POST `verify-ticket` → ecrã de confirmação
   - Campos: nome, variante, bib, status (✅ / ⚠️ já checked-in / ❌ não confirmado)

7. **Testes para check-in e verify-ticket**

### Fase 3 — Desbloqueios necessários

Após completar a Fase 2, a Fase 3 (tracking GPS + leaderboard) requer:

- Migration Prisma: `RaceSession` + `TrackingPoint`
- API: `POST /api/events/[id]/race-sessions/start` (com gating real)
- App mobile: permissões de localização + background tracking
- Socket.io: broadcasting de pontos GPS + leaderboard updates

---

## 6. Decisões de Produto a Confirmar

| # | Questão | Opções | Recomendação |
|---|---------|--------|-------------|
| 1 | Adicionar `CHECK_IN_OPEN` ao `EventLiveStatus`? | Adicionar ao enum vs. derivar em runtime | Derivar em runtime (sem migration) para MVP |
| 2 | Check-in manual por staff valida janela? | Sim (segue regra) vs. Não (override de staff) | Não validar janela para staff — permite situações excecionais |
| 3 | Atleta pode fazer auto check-in (sem staff)? | Sim (botão app/web) vs. Não (só staff ou QR scan) | Sim para eventos sem staff físico |
| 4 | Cancelamento de CONFIRMED com reembolso? | Implementar agora vs. adiar | Adiar para após Milestone 1 consolidado |
| 5 | Janela de check-in obrigatória? | Sim (erro se não configurada) vs. Não (sem janela = sempre aberta) | Sem janela = sempre aberta (configuração opcional) |

---

*Documento gerado com base na análise do código em `/app/api/events/`, `/prisma/schema.prisma`, `/components/event-ticket-modal.tsx`, `/app/[locale]/events/[slug]/manage/_components/` e `docs/ROADMAP_LIVERACE.md`.*
