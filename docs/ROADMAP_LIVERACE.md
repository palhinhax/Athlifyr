# LiveRace — Roadmap Completo

> Inscrições · Pagamentos · Check-in · Tracking em tempo real · Leaderboard · **Staff Live Streams**

---

## 1. Visão Geral

O **LiveRace** é a funcionalidade que transforma o Athlifyr numa plataforma completa para eventos desportivos ao vivo. Permite que atletas se inscrevam, paguem, façam check-in no dia da prova e sejam tracked em tempo real — com resultados, leaderboard e partilha social.

### Princípios

- **Inscrição obrigatória** — só atletas com `Registration.status = CONFIRMED` podem participar (check-in, tracking, leaderboard).
- **Pagamento via Stripe** — checkout seguro com confirmação via webhooks.
- **Privacidade por design** — tracking público apenas com opt-in do atleta ou conforme os termos do evento.
- **Mobile-first** — a experiência de corrida (tracking, check-in) é pensada para a app; a web serve para inscrições, gestão e visualização.
- **Evento digital ao vivo** — membros do staff podem transmitir vídeo em direto (multi-câmara) a partir da app mobile, transformando cada prova num "evento TV-like" acessível ao público. Isto aumenta o engagement, gera partilhas e acrescenta valor para patrocinadores.
- **Features opcionais por evento** — inscrições e live race são funcionalidades opt-in. A maioria dos eventos no Athlifyr são informativos (listagem de eventos de terceiros); apenas os que aderiram ao LiveRace têm inscrições e/ou tracking ativo.

---

### 1.1 Modelo de Features por Evento (Opt-in)

> **Ponto crítico de arquitetura**: Os eventos no Athlifyr existem em três níveis de funcionalidade. Um evento pode evoluir de nível ao longo do tempo.

#### Níveis de funcionalidade

| Nível | Nome               | Descrição                                                                                              | Flags no `Event`                                   |
| ----- | ------------------ | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| 0     | **Informativo**    | Evento de terceiros listado na plataforma (maioria dos eventos). Sem inscrições, sem tracking.         | `hasRegistrations = false` · `hasLiveRace = false` |
| 1     | **Com Inscrições** | Evento com inscrições geridas pelo Athlifyr (pagamento via Stripe). Sem tracking em tempo real.        | `hasRegistrations = true` · `hasLiveRace = false`  |
| 2     | **LiveRace**       | Evento completo: inscrições + check-in + tracking em tempo real + leaderboard + live streams de staff. | `hasRegistrations = true` · `hasLiveRace = true`   |

> ⚠️ Um evento com `hasLiveRace = true` implica sempre `hasRegistrations = true` (não faz sentido tracking sem inscrição confirmada).

#### Consequências por nível

| Feature                         | Nível 0 — Informativo  | Nível 1 — Inscrições | Nível 2 — LiveRace |
| ------------------------------- | :--------------------: | :------------------: | :----------------: |
| Página pública do evento        |           ✅           |          ✅          |         ✅         |
| Botão "Inscrever-me"            | ❌ (link externo opt)  |          ✅          |         ✅         |
| Checkout Stripe                 |           ❌           |          ✅          |         ✅         |
| "Minhas Inscrições"             |           ❌           |          ✅          |         ✅         |
| Check-in (QR / código)          |           ❌           |          ✅          |         ✅         |
| Tracking GPS em tempo real      |           ❌           |          ❌          |         ✅         |
| Leaderboard ao vivo             |           ❌           |          ❌          |         ✅         |
| Live Streams de staff           |           ❌           |          ❌          |         ✅         |
| Resultados finais na plataforma | ❌ (import manual opt) |          ✅          |         ✅         |
| Exportar lista de inscritos     |           ❌           |          ✅          |         ✅         |

#### Validação de gating (exemplo)

```typescript
// hasRegistrations é derivado do estado Stripe — não é um toggle manual
// É true quando stripeOnboardingStatus === 'COMPLETE'

// Antes de abrir checkout — verificar se o evento tem inscrições ativadas
if (!event.hasRegistrations) {
  // O organizador ainda não configurou o Stripe Connect
  throw new Error("Este evento não tem inscrições no Athlifyr.");
}

// Antes de iniciar tracking — verificar se o evento tem LiveRace ativado (só Admin ativa)
if (!event.hasLiveRace) {
  throw new Error("Este evento não tem LiveRace ativo.");
}
```

#### UI — o que muda por nível

- **Nível 0 (Informativo)**: página do evento mostra detalhes. Se `externalUrl` preenchido → botão "Inscrever no site oficial". Sem secção de inscrições, sem preços.
- **Nível 1 (Com Inscrições)**: sidebar mostra variantes, preços e botão "Inscrever-me". Sem separador "Ao Vivo".
- **Nível 2 (LiveRace)**: tudo do Nível 1 + separador "Ao Vivo" com tracking, leaderboard e live streams.

> **Como evoluir de nível**:
>
> - Nível 0 → 1: Organizador (`OWNER`) completa onboarding Stripe Connect → `hasRegistrations` ativa automaticamente
> - Nível 1 → 2: Admin da plataforma ativa `hasLiveRace` manualmente

---

## 2. Personas e Fluxos (User Journeys)

> **Nota**: Os fluxos abaixo aplicam-se apenas a eventos com as respetivas features ativas. Ver secção 1.1 para o modelo de opt-in.

### 2.1 Atleta (Web ou App)

> Requer `event.hasRegistrations = true` (passos 2–7) e `event.hasLiveRace = true` (passos 8–9).

| Passo | Ação                                                              | Estado                                 |
| ----- | ----------------------------------------------------------------- | -------------------------------------- |
| 1     | Ver evento (página pública)                                       | —                                      |
| 2     | Ver variantes disponíveis (distância, preço, limite, regras)      | —                                      |
| 3     | Selecionar variante                                               | —                                      |
| 4     | Checkout Stripe (pagamento)                                       | `Registration.status = PENDING`        |
| 5     | Pagamento confirmado (webhook `checkout.session.completed`)       | `Registration.status = CONFIRMED`      |
| 6     | Consultar "Minhas Inscrições" (QR/código, detalhes)               | —                                      |
| 7     | No dia: check-in (QR / código / botão) dentro da janela do evento | `Registration.checkedInAt = timestamp` |
| 8     | Iniciar corrida → tracking em tempo real                          | `RaceSession.status = RUNNING`         |
| 9     | Terminar corrida → resultado registado                            | `RaceSession.status = FINISHED`        |

**Pré-condições para iniciar corrida:**

- `Registration.status = CONFIRMED`
- `Registration.checkedInAt != null`
- Evento/variante em estado `LIVE`
- Permissões de localização concedidas no dispositivo

### 2.2 Staff (App — modo staff)

> Requer `event.hasLiveRace = true`.

| Passo | Ação                                                         | Detalhe                                                |
| ----- | ------------------------------------------------------------ | ------------------------------------------------------ |
| 1     | Login + seleção de evento                                    | Autenticado como `STAFF` ou superior                   |
| 2     | Ver painel de staff (check-in, streams)                      | Dashboard simplificado                                 |
| 3     | Iniciar Live Stream                                          | Botão "Iniciar Live" → preencher título + tag/local    |
| 4     | Monitorizar estado do stream                                 | Live / Offline / Reconnecting + indicador de qualidade |
| 5     | Terminar Live Stream                                         | Botão "Terminar Live"                                  |
| 6     | (Opcional V2) Alternar câmara, microfone, chat interno staff | Funcionalidades avançadas                              |

**Pré-condições para streaming:**

- `EventStaffMember` com `role = STAFF` (ou superior) e `isActive = true`
- Evento em estado `LIVE` ou `CHECK_IN_OPEN`
- Permissões de câmara e microfone concedidas no dispositivo
- Conectividade de rede (4G/Wi-Fi) — reconexão automática em caso de falha

### 2.3 Organizador (Web)

> Passos 1–0 disponíveis para qualquer evento. Passos 2–8 requerem `event.hasRegistrations = true`; passos 6–8 marcados com ⚡ requerem adicionalmente `event.hasLiveRace = true`.

| Passo | Ação                                         | Detalhe                                               |
| ----- | -------------------------------------------- | ----------------------------------------------------- |
| 1     | Criar evento + ativar features (flags)       | Admin UI — definir `hasRegistrations` / `hasLiveRace` |
| 2     | Definir variantes + preços, limites, cutoff  | `PricingPhase`, `EventVariant.maxParticipants`        |
| 3     | Abrir inscrições                             | Publicar evento                                       |
| 4     | Acompanhar inscritos/pagamentos              | Dashboard com filtros                                 |
| 5     | Exportar lista de inscritos (CSV) para staff | Export por variante                                   |
| 6 ⚡  | No dia: check-in + validações                | Scan QR / check-in manual                             |
| 7 ⚡  | Fechar inscrições / fechar prova             | Alterar estado do evento                              |
| 8 ⚡  | Exportar resultados                          | CSV / API                                             |

---

## 3. Modelo de Dados (PostgreSQL / Prisma)

> Nota: O schema atual já contém `Event`, `EventVariant`, `PricingPhase`, `Participation` e `Result`. Abaixo estão as alterações e novos modelos necessários.

### 3.1 Alterações a modelos existentes

#### `Event` — novos campos

```prisma
model Event {
  // ... campos existentes ...

  // ── Feature flags (opt-in) ──────────────────────────────────────────────
  // A maioria dos eventos é informativa (nível 0): ambas as flags = false.
  // Nível 1 (inscrições): hasRegistrations = true, hasLiveRace = false.
  // Nível 2 (LiveRace completo): ambas = true.
  // ⚠️ hasLiveRace = true implica hasRegistrations = true.
  hasRegistrations  Boolean     @default(false)  // Inscrições geridas no Athlifyr
  hasLiveRace       Boolean     @default(false)  // Tracking, leaderboard, live streams

  // ── LiveRace — campos operacionais ─────────────────────────────────────
  checkInOpensAt    DateTime?   // Início da janela de check-in
  checkInClosesAt   DateTime?   // Fim da janela de check-in
  liveStatus        EventLiveStatus @default(SCHEDULED)
  // SCHEDULED | CHECK_IN_OPEN | LIVE | FINISHED | CANCELLED
}
```

#### `EventVariant` — novos campos

```prisma
model EventVariant {
  // ... campos existentes (name, distanceKm, price, maxParticipants, startDate, startTime, currency, ...) ...

  // LiveRace — novos campos
  isActive          Boolean     @default(true)
  startsAt          DateTime?   // Gun time desta variante
  endsAt            DateTime?   // Cutoff time desta variante
  rulesText         String?     // Regulamento específico
  mandatoryGear     String?     // Equipamento obrigatório

  // Relações
  registrations     Registration[]
  raceSessions      RaceSession[]
}
```

#### `Participation` — manter como está

O modelo `Participation` existente (com status `going`) representa a intenção social de participar. O novo modelo `Registration` é separado e representa a inscrição formal com pagamento.

### 3.2 Novos modelos

#### `Registration`

```prisma
model Registration {
  id                        String             @id @default(cuid())
  userId                    String
  eventId                   String
  variantId                 String
  status                    RegistrationStatus  @default(PENDING)
  // PENDING | CONFIRMED | CANCELLED | REFUNDED
  bibNumber                 String?             // Dorsal (opcional, atribuído pelo organizador)
  checkedInAt               DateTime?           // Timestamp do check-in

  // Stripe
  paymentProvider           String              @default("STRIPE")
  stripeCheckoutSessionId   String?
  stripePaymentIntentId     String?
  amountCents               Int                 // Valor pago (cêntimos)
  feeCents                  Int?                // Taxa de serviço (opcional)
  netCents                  Int?                // Valor líquido (opcional)
  currency                  Currency            @default(EUR)

  createdAt                 DateTime            @default(now())
  updatedAt                 DateTime            @updatedAt

  // Relações
  user                      User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  event                     Event               @relation(fields: [eventId], references: [id], onDelete: Cascade)
  variant                   EventVariant        @relation(fields: [variantId], references: [id])
  raceSession               RaceSession?        // 1:1

  @@unique([userId, eventId, variantId])
  @@index([userId])
  @@index([eventId])
  @@index([variantId])
  @@index([status])
  @@index([stripeCheckoutSessionId])
}

enum RegistrationStatus {
  PENDING
  CONFIRMED
  CANCELLED
  REFUNDED
}
```

#### `RaceSession`

```prisma
model RaceSession {
  id               String            @id @default(cuid())
  registrationId   String            @unique // 1:1 com Registration
  status           RaceSessionStatus @default(NOT_STARTED)
  // NOT_STARTED | RUNNING | FINISHED | DISQUALIFIED
  startedAt        DateTime?
  finishedAt       DateTime?
  lastPingAt       DateTime?         // Último sinal de tracking recebido
  deviceInfo       String?           // Info do dispositivo (OS, modelo)
  privacyMode      PrivacyMode       @default(PUBLIC)
  // PUBLIC | FRIENDS | ORGANIZER_ONLY

  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt

  // Relações
  registration     Registration      @relation(fields: [registrationId], references: [id], onDelete: Cascade)
  trackingPoints   TrackingPoint[]

  @@index([registrationId])
  @@index([status])
}

enum RaceSessionStatus {
  NOT_STARTED
  RUNNING
  FINISHED
  DISQUALIFIED
}

enum PrivacyMode {
  PUBLIC
  FRIENDS
  ORGANIZER_ONLY
}
```

#### `TrackingPoint`

```prisma
model TrackingPoint {
  id              String      @id @default(cuid())
  raceSessionId   String
  latitude        Float
  longitude       Float
  altitude        Float?
  speed           Float?      // m/s
  accuracy        Float?      // metros
  heartRate       Int?        // BPM (opcional, se integrado com wearable)
  timestamp       DateTime    @default(now())

  raceSession     RaceSession @relation(fields: [raceSessionId], references: [id], onDelete: Cascade)

  @@index([raceSessionId])
  @@index([timestamp])
}
```

#### `EventLiveStatus` (enum)

```prisma
enum EventLiveStatus {
  SCHEDULED
  CHECK_IN_OPEN
  LIVE
  FINISHED
  CANCELLED
}
```

### 3.3 Novos modelos — Organizadores, Staff & Live Streams

> **Modelo de acesso — como funciona**:
>
> 1. O **Admin da plataforma Athlifyr** cria o evento (no painel de admin existente).
> 2. O Admin atribui um ou mais utilizadores como **Organizadores** do evento (`EventOrganizer`).
> 3. Os **Organizadores** acedem ao painel do evento (`/events/[slug]/manage`) onde podem:
>    - Editar os dados do evento
>    - Configurar o Stripe Connect (= ativar inscrições no Athlifyr)
>    - Gerir variantes, preços, fases de preço
>    - Ver e gerir inscrições e pagamentos
>    - Adicionar/remover outros organizadores e staff
> 4. O **Staff operacional** (`EventStaffMember`) é adicionado pelo organizador e só atua no dia (check-in, live streams).
>
> **Configurar Stripe = ativar inscrições**: quando o organizador completa o onboarding Stripe Connect, as inscrições ficam automaticamente disponíveis no site (`hasRegistrations` é gerido pela plataforma com base no `stripeOnboardingStatus`).

---

#### `EventOrganizer` — acesso de gestão ao evento

```prisma
model EventOrganizer {
  id        String              @id @default(cuid())
  eventId   String
  userId    String
  role      EventOrganizerRole
  // OWNER   — atribuído pelo Admin da plataforma; pode gerir outros organizadores,
  //           configurar Stripe, editar evento, transferir ownership
  // ADMIN   — atribuído pelo OWNER ou Admin da plataforma; pode editar evento,
  //           gerir inscrições e staff; NÃO pode tocar em Stripe nem outros organizadores
  // FINANCE — acesso apenas a dados financeiros e exportações; sem edição de evento
  isActive  Boolean             @default(true)
  assignedBy String             // userId do Admin da plataforma (ou OWNER que convidou)
  createdAt DateTime            @default(now())
  updatedAt DateTime            @updatedAt

  event     Event               @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user      User                @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([eventId, userId])
  @@index([eventId])
  @@index([userId])
}

enum EventOrganizerRole {
  OWNER    // Responsável principal — atribuído pelo Admin da plataforma
  ADMIN    // Co-organizador — atribuído pelo OWNER ou Admin
  FINANCE  // Acesso financeiro apenas
}
```

> **Regras de ownership**:
>
> - **Eventos são criados pelo Admin da plataforma** — o Admin é sempre quem inicia o evento.
> - O Admin atribui um utilizador como `OWNER`. Pode ser o próprio organizador do evento real ou uma pessoa de confiança.
> - Um evento pode não ter `OWNER` (evento informativo sem organizador na plataforma).
> - O `OWNER` pode convidar `ADMIN` e `FINANCE` adicionais.
> - O `OWNER` é o único que pode configurar Stripe Connect — ao fazê-lo, está a dizer "aceito receber inscrições no Athlifyr".
> - O Admin da plataforma sobrepõe-se a tudo e pode gerir qualquer evento diretamente.

---

#### Stripe Connect — ativar inscrições no Athlifyr

**Configurar Stripe = decisão de aceitar inscrições no site.**

O organizador (`OWNER`) não ativa `hasRegistrations` manualmente — isso acontece automaticamente quando completa o onboarding Stripe:

```
hasRegistrations = (stripeOnboardingStatus === 'COMPLETE')
```

Ou seja:

- Enquanto não há Stripe configurado → evento é **Informativo** (nível 0), só mostra link externo
- Quando Stripe completo → evento passa a **Com Inscrições** (nível 1) automaticamente
- Para ativar **LiveRace** (nível 2) → o Admin da plataforma ativa `hasLiveRace` manualmente

Estes campos ficam no modelo `Event`:

```prisma
model Event {
  // ... campos existentes + hasLiveRace + liveStatus ...

  // ── Inscrições — gerido automaticamente via Stripe ──────────────────────
  // hasRegistrations = true quando stripeOnboardingStatus = COMPLETE
  // NÃO é um campo editável pelo organizador — é derivado do estado Stripe
  hasRegistrations         Boolean   @default(false)

  // ── LiveRace — ativado pelo Admin da plataforma ──────────────────────────
  hasLiveRace              Boolean   @default(false)

  // ── Stripe Connect (configurado pelo OWNER do evento) ───────────────────
  stripeAccountId          String?   // ID da conta Stripe Connect do organizador
  stripeChargesEnabled     Boolean   @default(false)
  stripeDetailsSubmitted   Boolean   @default(false)
  stripeOnboardingStatus   EventStripeOnboardingStatus @default(NOT_STARTED)
  // NOT_STARTED | IN_PROGRESS | COMPLETE | RESTRICTED

  // Comissão da plataforma sobre inscrições (configurável pelo Admin)
  commissionPercent        Float     @default(5.0)
  commissionFixed          Int       @default(0)   // cêntimos por inscrição

  // Prazo para reembolsos automáticos
  refundDeadline           DateTime?
}

enum EventStripeOnboardingStatus {
  NOT_STARTED  // Organizador ainda não iniciou
  IN_PROGRESS  // Onboarding iniciado mas não concluído
  COMPLETE     // Stripe ativo — inscrições abertas automaticamente
  RESTRICTED   // Conta com restrições — inscrições suspensas
}
```

> **Fluxo de pagamento** (Stripe Connect destination charges):
>
> ```
> Atleta paga €20
>        │
>        ▼  Stripe Checkout Session
>        │    stripe_account: event.stripeAccountId
>        │    application_fee_amount: 100 (€1 = 5% de €20)
>        │
>        ├── €19 → conta Stripe do organizador
>        └──  €1 → conta Stripe da plataforma Athlifyr
> ```

---

#### `EventStaffMember` — staff operacional (check-in, live streams)

```prisma
model EventStaffMember {
  id          String           @id @default(cuid())
  eventId     String
  userId      String
  role        EventStaffRole   @default(STAFF)
  // STAFF         — check-in de atletas + live streams
  // STREAM_ONLY   — apenas live streams (ex: equipa de vídeo)
  // CHECKIN_ONLY  — apenas check-in (ex: voluntários)
  isActive    Boolean          @default(true)
  addedBy     String           // userId do organizador que adicionou
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  event       Event            @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  liveStreams  LiveStream[]

  @@unique([eventId, userId])
  @@index([eventId])
  @@index([userId])
}

enum EventStaffRole {
  STAFF          // Check-in + live streams
  STREAM_ONLY    // Apenas live streams
  CHECKIN_ONLY   // Apenas check-in
}
```

> - Adicionado por `OWNER` ou `ADMIN` no painel do evento.
> - Staff não tem acesso ao painel de gestão — só à app no dia da prova.
> - Staff não vê dados financeiros, não edita o evento.

---

#### `EventInvite` — convites por email para organizadores e staff

```prisma
model EventInvite {
  id              String              @id @default(cuid())
  eventId         String
  invitedEmail    String              // Email do convidado (pode não ter conta ainda)
  invitedUserId   String?             // Preenchido quando o convite é aceite
  invitedBy       String              // userId de quem convidou (Admin ou OWNER)
  type            EventInviteType     // ORGANIZER ou STAFF
  organizerRole   EventOrganizerRole? // Preenchido se type = ORGANIZER
  staffRole       EventStaffRole?     // Preenchido se type = STAFF
  token           String              @unique
  status          InviteStatus        @default(PENDING)
  expiresAt       DateTime
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt

  event           Event               @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@index([eventId])
  @@index([invitedEmail])
  @@index([token])
  @@index([status])
}

enum EventInviteType {
  ORGANIZER
  STAFF
}
```

---

#### `LiveStream`

```prisma
model LiveStream {
  id              String             @id @default(cuid())
  eventId         String
  staffMemberId   String
  title           String
  category        LiveStreamCategory @default(OTHER)
  status          LiveStreamStatus   @default(CREATED)
  isPublic        Boolean            @default(true)
  startedAt       DateTime?
  endedAt         DateTime?
  provider        StreamProvider     @default(MUX)
  providerStreamId String?
  playbackUrl     String?            // HLS URL (público)
  ingestUrl       String?            // RTMP ingest (NUNCA expor publicamente)
  streamKey       String?            // (NUNCA expor publicamente)
  latitude        Float?
  longitude       Float?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  event           Event              @relation(fields: [eventId], references: [id], onDelete: Cascade)
  staffMember     EventStaffMember   @relation(fields: [staffMemberId], references: [id], onDelete: Cascade)

  @@index([eventId])
  @@index([staffMemberId])
  @@index([status])
  @@index([eventId, status])
}

enum LiveStreamCategory {
  PODIUM
  AID_STATION
  RIVER
  INTERVIEW
  START_LINE
  FINISH_LINE
  OTHER
}

enum LiveStreamStatus {
  CREATED
  LIVE
  ENDED
  ERROR
}

enum StreamProvider {
  MUX
  LIVEKIT
  AGORA
  CLOUDFLARE
  AWS_IVS
}
```

### 3.4 Diagrama de relações

```
Admin da plataforma
       │
       ├── cria ──────────────────────────────────► Event
       │                                              │
       └── atribui OWNER ──► EventOrganizer ──────────┤
                                   │                  │
                         OWNER convida                │
                         ADMIN/FINANCE/Staff           │
                                   │                  │
                                   ▼                  ▼
                            EventInvite        EventStaffMember ──► LiveStream
                                                      │
                                               (check-in, streams)

OWNER configura Stripe Connect
       │
       ▼
Event.stripeOnboardingStatus = COMPLETE
       │
       ▼ (automático)
Event.hasRegistrations = true
       │
       ▼
Atleta pode inscrever-se ──► Registration ──► RaceSession ──► TrackingPoint
```

---

## 4. Regras de Acesso (Gating)

### 4.1 Quem é quem — visão completa

| Role           | Modelo              | Quem atribui              | Descrição                                                   |
| -------------- | ------------------- | ------------------------- | ----------------------------------------------------------- |
| `OWNER`        | `EventOrganizer`    | Admin da plataforma       | Organizador principal — Stripe, editar evento, gerir equipa |
| `ADMIN`        | `EventOrganizer`    | Admin plataforma ou OWNER | Co-organizador — gerir evento e inscrições, adicionar staff |
| `FINANCE`      | `EventOrganizer`    | Admin plataforma ou OWNER | Acesso só a dados financeiros e exportações                 |
| `STAFF`        | `EventStaffMember`  | OWNER ou ADMIN            | Check-in + live streams no dia                              |
| `STREAM_ONLY`  | `EventStaffMember`  | OWNER ou ADMIN            | Só live streams                                             |
| `CHECKIN_ONLY` | `EventStaffMember`  | OWNER ou ADMIN            | Só check-in                                                 |
| `ATHLETE`      | _(implícito)_       | —                         | Utilizador com `Registration.status = CONFIRMED`            |
| `PUBLIC`       | _(implícito)_       | —                         | Qualquer visitante                                          |
| Platform Admin | `User.role = ADMIN` | —                         | Sobrepõe-se a tudo em qualquer evento                       |

### 4.2 Quem pode fazer o quê

#### Painel de admin da plataforma (só Athlifyr Admin)

| Ação                                      | Athlifyr Admin |
| ----------------------------------------- | :------------: |
| Criar evento                              |       ✅       |
| Atribuir/remover `OWNER` a um evento      |       ✅       |
| Ativar `hasLiveRace` (LiveRace completo)  |       ✅       |
| Definir comissão da plataforma por evento |       ✅       |
| Gerir qualquer evento (override total)    |       ✅       |
| Eliminar evento                           |       ✅       |

#### Painel do evento `/events/[slug]/manage` (organizadores)

| Ação                                           | OWNER | ADMIN | FINANCE |
| ---------------------------------------------- | :---: | :---: | :-----: |
| Ver painel do evento                           |  ✅   |  ✅   |   ✅    |
| Editar dados do evento (título, datas, etc.)   |  ✅   |  ✅   |   ❌    |
| Gerir variantes e preços                       |  ✅   |  ✅   |   ❌    |
| Configurar Stripe Connect (= abrir inscrições) |  ✅   |  ❌   |   ❌    |
| Ver inscrições + pagamentos                    |  ✅   |  ✅   |   ✅    |
| Exportar inscritos (CSV)                       |  ✅   |  ✅   |   ✅    |
| Cancelar / reembolsar inscrição                |  ✅   |  ✅   |   ❌    |
| Atribuir dorsais                               |  ✅   |  ✅   |   ❌    |
| Convidar / remover `ADMIN` ou `FINANCE`        |  ✅   |  ❌   |   ❌    |
| Convidar / remover staff operacional           |  ✅   |  ✅   |   ❌    |
| Abrir / fechar janela de check-in              |  ✅   |  ✅   |   ❌    |
| Marcar evento como `LIVE` / `FINISHED`         |  ✅   |  ✅   |   ❌    |
| Ver live streams + kill switch                 |  ✅   |  ✅   |   ❌    |
| Transferir ownership a outro utilizador        |  ✅   |  ❌   |   ❌    |

> ℹ️ **`hasRegistrations` não é configurável pelo organizador** — é ativado automaticamente quando o Stripe Connect fica completo (`stripeOnboardingStatus = COMPLETE`). O organizador decide ao configurar o Stripe, não ao clicar num toggle.

#### App no dia da prova (staff operacional)

| Ação                        | STAFF | STREAM_ONLY | CHECKIN_ONLY |
| --------------------------- | :---: | :---------: | :----------: |
| Fazer check-in de atletas   |  ✅   |     ❌      |      ✅      |
| Iniciar / parar live stream |  ✅   |     ✅      |      ❌      |
| Ver lista de inscritos      |  ❌   |     ❌      |      ❌      |
| Ver dados financeiros       |  ❌   |     ❌      |      ❌      |
| Aceder ao painel `/manage`  |  ❌   |     ❌      |      ❌      |

#### Público e atletas

| Ação                         | Requisito                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------- |
| Ver evento / variantes       | Público                                                                                     |
| Inscrever-se                 | Autenticado + `event.hasRegistrations = true` + variante ativa + capacidade disponível      |
| Check-in                     | `Registration.status = CONFIRMED` + dentro da janela de check-in                            |
| Iniciar corrida              | `Registration.status = CONFIRMED` + check-in feito + `liveStatus = LIVE` + GPS concedido    |
| Ver tracking de outro atleta | `privacyMode = PUBLIC` **ou** amigo (se `FRIENDS`) **ou** organizador (se `ORGANIZER_ONLY`) |
| Ver leaderboard              | Público (respeita `privacyMode` por atleta)                                                 |
| Ver streams públicos         | Público                                                                                     |

### 4.3 Estados bloqueantes

| Estado                                       | Bloqueio                                                                |
| -------------------------------------------- | ----------------------------------------------------------------------- |
| `hasRegistrations = false`                   | Sem botão de inscrição; mostra link externo se `externalUrl` preenchido |
| `stripeOnboardingStatus != COMPLETE`         | Organizador ainda não configurou Stripe — inscrições não disponíveis    |
| `hasLiveRace = false`                        | Sem tracking, sem leaderboard, sem live streams                         |
| `Registration.status = PENDING`              | Pagamento não confirmado — sem acesso ao modo corrida                   |
| `Registration.status = CANCELLED / REFUNDED` | Inscrição inválida — sem acesso                                         |
| `checkedInAt = null`                         | Check-in não feito — não pode iniciar corrida                           |
| `liveStatus != LIVE`                         | Evento não está em corrida — botão "Começar" desativado                 |
| GPS não concedido                            | App bloqueia início da corrida                                          |

### 4.4 Nota sobre privacidade

- O campo `RaceSession.privacyMode` é controlado pelo atleta e pode ser alterado a qualquer momento durante a corrida.
- Leaderboard e tracking públicos só mostram atletas com `privacyMode = PUBLIC`.

### 5.0 Modelo de pagamento

O dinheiro das inscrições vai **diretamente para a conta Stripe do organizador** via **Stripe Connect** (destination charges). A plataforma Athlifyr retém uma comissão configurável por evento.

```
Atleta paga €20
       │
       ▼ Stripe Checkout Session (payment_intent_data.transfer_data.destination = event.stripeAccountId)
       │
       ├── €19.00 → Conta Stripe do organizador  (ex: 5% comissão → 100% - 5% = 95%)
       └──  €1.00 → Conta Stripe da plataforma Athlifyr
```

**Pré-condições para abrir inscrições**:

- `event.stripeOnboardingStatus = COMPLETE` (`stripeChargesEnabled = true`)
- `event.hasRegistrations = true`

**Onboarding do organizador** (tal como já existe para Venues):

1. OWNER vai a "Configurações → Pagamentos" no painel do evento
2. Clica "Configurar pagamentos" → redirect para Stripe Connect onboarding
3. Stripe redireciona de volta → webhook `account.updated` confirma `charges_enabled`
4. `stripeOnboardingStatus` atualizado para `COMPLETE`

### 5.1 Checkout

```
Atleta seleciona variante
       │
       ▼
POST /api/events/[eventId]/register
       │
       ├── Validar: event.hasRegistrations = true
       ├── Validar: event.stripeOnboardingStatus = COMPLETE
       ├── Validar: variante ativa, capacidade, deadline
       ├── Criar Registration (status = PENDING)
       ├── Criar Stripe Checkout Session
       │     stripe_account: event.stripeAccountId  (Connect)
       │     payment_intent_data.application_fee_amount: feeCents  (comissão Athlifyr)
       │     metadata: { eventId, variantId, userId, registrationId }
       │     success_url: /events/[slug]/registration/success
       │     cancel_url: /events/[slug]
       │
       └── Redirect para Stripe Checkout
```

### 5.2 Webhooks

| Evento Stripe                        | Ação no Athlifyr                                                          |
| ------------------------------------ | ------------------------------------------------------------------------- |
| `checkout.session.completed`         | Marcar `Registration.status = CONFIRMED`, guardar `stripePaymentIntentId` |
| `payment_intent.payment_failed`      | Manter `Registration.status = PENDING`, notificar utilizador              |
| `charge.refunded` / `refund.updated` | Marcar `Registration.status = REFUNDED`                                   |
| `account.updated`                    | Atualizar `stripeChargesEnabled`, `stripeOnboardingStatus` do evento      |

```typescript
// app/api/webhooks/stripe/route.ts

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  const event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);

  switch (event.type) {
    case "checkout.session.completed":
      // Extrair metadata: registrationId
      // UPDATE Registration SET status = 'CONFIRMED'
      // Enviar email/notificação de confirmação
      break;

    case "payment_intent.payment_failed":
      // Notificar utilizador
      break;

    case "charge.refunded":
      // UPDATE Registration SET status = 'REFUNDED'
      break;
  }
}
```

**Auditoria:**

- Guardar todos os eventos Stripe numa tabela de log (`StripeWebhookLog`) para reconciliação.
- Campos: `id`, `stripeEventId`, `type`, `payload` (JSON), `processedAt`, `error`.

### 5.3 Cancelamentos e reembolsos

| Cenário                                  | Regra                                                          |
| ---------------------------------------- | -------------------------------------------------------------- |
| Cancelamento pelo atleta antes da data X | Reembolso automático via Stripe Refund API                     |
| Cancelamento pelo atleta após a data X   | Sem reembolso (política do evento)                             |
| Cancelamento pelo organizador/admin      | Reembolso manual + atualizar `Registration.status = CANCELLED` |
| Evento cancelado                         | Reembolso de todas as inscrições `CONFIRMED`                   |

A data de cutoff para reembolso pode ser configurada no `Event` (ex: `refundDeadline: DateTime?`).

---

## 6. API Endpoints

### 6.1 Inscrições

| Método  | Endpoint                                     | Descrição                                 |
| ------- | -------------------------------------------- | ----------------------------------------- |
| `POST`  | `/api/events/[eventId]/register`             | Criar inscrição + Stripe Checkout Session |
| `GET`   | `/api/events/[eventId]/registrations`        | Listar inscrições (organizador)           |
| `GET`   | `/api/me/registrations`                      | "Minhas Inscrições" (atleta)              |
| `PATCH` | `/api/registrations/[id]/check-in`           | Check-in (QR / código)                    |
| `PATCH` | `/api/registrations/[id]/cancel`             | Cancelar inscrição                        |
| `GET`   | `/api/events/[eventId]/registrations/export` | Exportar inscritos (CSV)                  |

### 6.2 Corrida (LiveRace)

| Método | Endpoint                            | Descrição                                   |
| ------ | ----------------------------------- | ------------------------------------------- |
| `POST` | `/api/race/start`                   | Iniciar corrida (criar `RaceSession`)       |
| `POST` | `/api/race/tracking`                | Enviar ponto de tracking (batch)            |
| `POST` | `/api/race/finish`                  | Terminar corrida                            |
| `GET`  | `/api/events/[eventId]/leaderboard` | Leaderboard em tempo real                   |
| `GET`  | `/api/race/[sessionId]/track`       | Track de um atleta (respeita `privacyMode`) |

### 6.3 Staff & Live Streams

| Método   | Endpoint                                               | Descrição                                        | Acesso                                     |
| -------- | ------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------ |
| `POST`   | `/api/events/[eventId]/staff`                          | Credenciar membro de staff                       | `ORGANIZER_OWNER` / `ORGANIZER_ADMIN`      |
| `GET`    | `/api/events/[eventId]/staff`                          | Listar staff do evento                           | `ORGANIZER_OWNER` / `ORGANIZER_ADMIN`      |
| `PATCH`  | `/api/events/[eventId]/staff/[staffId]`                | Atualizar role / desativar staff                 | `ORGANIZER_OWNER` / `ORGANIZER_ADMIN`      |
| `DELETE` | `/api/events/[eventId]/staff/[staffId]`                | Remover membro de staff                          | `ORGANIZER_OWNER` / `ORGANIZER_ADMIN`      |
| `POST`   | `/api/events/[eventId]/staff/streams`                  | Criar stream (devolve `ingestUrl` + `streamKey`) | `STAFF`+                                   |
| `POST`   | `/api/events/[eventId]/staff/streams/[streamId]/start` | Marcar stream como `LIVE`                        | `STAFF`+ (dono do stream)                  |
| `POST`   | `/api/events/[eventId]/staff/streams/[streamId]/end`   | Marcar stream como `ENDED`                       | `STAFF`+ (dono do stream)                  |
| `GET`    | `/api/events/[eventId]/streams`                        | Listar streams ativos + `playbackUrl`            | **Público** (só streams `isPublic = true`) |
| `GET`    | `/api/events/[eventId]/streams/[streamId]`             | Detalhe de um stream (playback)                  | **Público** (se `isPublic`)                |

**Segurança crítica:**

- `ingestUrl` e `streamKey` são devolvidos **apenas** ao staff autenticado que criou o stream
- Endpoints públicos devolvem **apenas** `playbackUrl`, `title`, `category`, `status`
- Nunca expor `ingestUrl` / `streamKey` no frontend público

### 6.4 Webhooks do Provider de Streaming

| Método | Endpoint                        | Descrição                                                    |
| ------ | ------------------------------- | ------------------------------------------------------------ |
| `POST` | `/api/webhooks/stream-provider` | Receber eventos do provider (ex: stream started/ended/error) |

**Eventos a processar:**

| Evento do provider                 | Ação no Athlifyr                                |
| ---------------------------------- | ----------------------------------------------- |
| `stream.active` / `stream.started` | `LiveStream.status = LIVE`, `startedAt = now()` |
| `stream.idle` / `stream.ended`     | `LiveStream.status = ENDED`, `endedAt = now()`  |
| `stream.error`                     | `LiveStream.status = ERROR`, log de erro        |

### 6.5 Webhooks Stripe

| Método | Endpoint               | Descrição              |
| ------ | ---------------------- | ---------------------- |
| `POST` | `/api/webhooks/stripe` | Receber eventos Stripe |

---

## 7. UI/UX — Web + App

### 7.1 Página do Evento (Web + App)

**Componentes:**

- **Lista de variantes** — cards com: nome, distância, preço, vagas disponíveis, data de início
- **Botão "Inscrever"** — por variante
- **Secção "Live"** — streams em direto _(ver 7.5)_
- **Estados visuais:**

| Estado                       | UI                                                       |
| ---------------------------- | -------------------------------------------------------- |
| Variante disponível          | Botão "Inscrever" ativo                                  |
| Inscrito (CONFIRMED)         | Badge "✅ Inscrito" + link para "Minhas Inscrições"      |
| Pagamento pendente (PENDING) | Badge "⏳ Pagamento pendente" + link para tentar de novo |
| Inscrições encerradas        | Botão desativado + texto "Inscrições encerradas"         |
| Lotado                       | Botão desativado + texto "Lotado"                        |
| Evento cancelado             | Banner de aviso                                          |

### 7.2 Página "Minhas Inscrições" (Web + App)

**Por inscrição:**

- Nome do evento + variante
- Data e local
- Estado: CONFIRMED / PENDING / CANCELLED / REFUNDED
- QR Code / código de check-in
- Botão "Check-in" (habilitado só dentro da janela)
- Botão "Começar corrida" (habilitado só se: CONFIRMED + check-in feito + evento LIVE)
- Botão "Cancelar inscrição" (se dentro do prazo)

### 7.3 Dashboard do Organizador (Web)

**Tabela de inscritos por variante:**

- Colunas: nome, email, variante, status, dorsal, check-in, data de inscrição
- Filtros: confirmado / pendente / cancelado / reembolsado
- Pesquisa por nome/email
- Paginação
- **Ações:**
  - Marcar check-in manual (fallback para problemas com QR)
  - Exportar CSV (filtrado)
  - Atribuir dorsal
- **Resumo:**
  - Total inscritos por variante
  - Total confirmados vs pendentes
  - Receita total

### 7.4 Leaderboard (Web + App)

- Tabela/lista em tempo real
- Filtros por variante
- Posição, nome, tempo decorrido, último checkpoint
- Refresh automático (WebSocket via Socket.io)
- Respeita `privacyMode` dos atletas

### 7.5 Live Streams — Página Pública do Evento (Web)

Adicionar secção **"Live"** à página pública do evento quando existem streams ativos:

**Layout:**

- **Grid de streams ativos** — cada card mostra: título, categoria (badge), thumbnail/player, indicador "🔴 LIVE"
- **Filtros por categoria** — tabs/chips: Todos · Pódio · Abastecimento · Rio · Entrevista · Largada · Meta
- **Stream em destaque** (opcional V1) — 1 stream principal em tamanho grande + restantes em miniaturas abaixo
- **Player HLS responsivo** — ao clicar num stream, expande para player grande (ou modal/overlay)
- **Contagem de viewers** (opcional) — mostrar nº de espectadores por stream
- **DVR/Replay curto** (opcional V2) — últimos 30-60 segundos para catch-up

**Estados visuais:**

| Estado              | UI                                                        |
| ------------------- | --------------------------------------------------------- |
| Nenhum stream ativo | Secção "Live" não aparece                                 |
| 1+ streams ativos   | Secção "Live" visível com grid                            |
| Stream terminou     | Remove do grid (ou badge "Ended" com replay se DVR ativo) |
| Reconexão           | Indicador "Reconnecting..." no player                     |

**Comportamento:**

- Secção "Live" aparece automaticamente quando há streams com `status = LIVE`
- Atualização em tempo real via Socket.io (novo stream, stream ended)
- Player HLS com qualidade adaptativa (auto)
- Funciona em mobile (responsivo) e desktop

### 7.6 Live Streams — Staff Mobile (App)

Ecrã de staff na app mobile com modo de streaming:

**Fluxo:**

```
Login → Selecionar evento → Painel Staff
    │
    ├── Botão "Iniciar Live"
    │     ├── Campo: Título (ex: "Pódio")
    │     ├── Campo: Tag/Local (dropdown: PODIUM, AID_STATION, RIVER, INTERVIEW, ...)
    │     ├── (Opcional) Geolocalização do stream
    │     └── Confirmar → Stream criado, ingest inicia
    │
    ├── Ecrã de streaming ativo:
    │     ├── Preview da câmara
    │     ├── Indicador: Live / Offline / Reconnecting
    │     ├── Indicador de qualidade (rede)
    │     ├── Tempo de streaming (duração)
    │     └── Botão "Terminar Live"
    │
    └── (V2) Controlos adicionais:
          ├── Alternar câmara frontal/traseira
          ├── Mute/unmute microfone
          └── Chat interno staff
```

**Requisitos críticos:**

- **Reconexão automática** — se a rede falha (4G → WiFi, perda momentânea), o stream tenta reconectar automaticamente sem intervenção do staff
- **Indicador de estado claro** — o staff sabe sempre se está a transmitir ou não
- **Baixo consumo de bateria** — otimizar encoding para não drenar o dispositivo
- **Qualidade adaptativa** — reduz bitrate automaticamente em redes lentas

### 7.7 Live Streams — Dashboard do Organizador (Web)

No painel do organizador, adicionar gestão de streams:

- **Lista de streams** — ativos + histórico (com filtros por estado)
- **Por stream:** título, categoria, staff member, estado, duração, viewers
- **Ações:**
  - Forçar encerrar stream (kill switch)
  - Alterar visibilidade (público ↔ só organizador)
  - Definir stream em destaque na página pública
- **Staff management:**
  - Credenciar novos membros de staff
  - Ativar/desativar staff
  - Ver atividade do staff (streams iniciados, duração)

---

## 8. Infraestrutura de Tempo Real

### 8.1 Tracking (App → Servidor)

```
App (React Native / Expo)
    │
    ├── expo-location (foreground + background)
    │     └── Enviar batch de pontos a cada N segundos
    │
    └── POST /api/race/tracking
          body: { sessionId, points: [{ lat, lng, alt, speed, timestamp }] }
```

### 8.2 Leaderboard (Servidor → Clientes)

```
Servidor (Next.js + Socket.io)
    │
    ├── Recebe tracking points
    ├── Calcula posições (distância percorrida / tempo)
    ├── Emite via Socket.io para room do evento
    │
    └── Clientes (web/app) recebem atualização em tempo real
```

### 8.3 Considerações (Tracking)

- **Bateria** — na app, usar `expo-location` com `Accuracy.Balanced` e intervalo de 5–10s para equilibrar precisão e consumo.
- **Offline** — se o atleta perder rede, acumular pontos localmente e enviar quando recuperar ligação.
- **Rate limiting** — proteger endpoint de tracking contra abuso (max 1 request/s por sessão).

### 8.4 Live Streaming — Arquitetura

#### Abordagem MVP (Recomendada): Serviço gerido de live streaming

Usar um **provider externo** para evitar reinventar infraestrutura de streaming (transcoding, HLS, escalabilidade, CDN):

| Provider          | Ingest        | Player       | Escalabilidade    | Gravação | Notas                                        |
| ----------------- | ------------- | ------------ | ----------------- | -------- | -------------------------------------------- |
| **Mux Live** ⭐   | RTMP / SRT    | HLS          | Alta (CDN global) | Sim      | API excelente, pricing por minuto, SDK React |
| LiveKit Cloud     | WebRTC        | WebRTC / HLS | Alta              | Sim      | Bom para baixa latência, open-source core    |
| Agora             | WebRTC        | WebRTC / HLS | Alta              | Sim      | Bom SDK mobile, pricing por minuto           |
| Cloudflare Stream | RTMP / WebRTC | HLS / DASH   | Muito alta        | Sim      | Bom preço, integra com Workers               |
| AWS IVS           | RTMP          | HLS          | Muito alta        | Sim      | Integração AWS, pricing competitivo          |

**Recomendação MVP: Mux Live** — API simples, SDK para React, boa documentação, playback HLS escalável.

#### Fluxo de streaming (MVP)

```
Staff (App Mobile)
    │
    ├── POST /api/events/:eventId/staff/streams
    │     └── Servidor cria stream no Mux → devolve ingestUrl + streamKey
    │
    ├── App inicia transmissão RTMP para ingestUrl
    │     └── Mux faz transcoding + gera HLS
    │
    ├── Webhook Mux → POST /api/webhooks/stream-provider
    │     └── "stream.active" → LiveStream.status = LIVE
    │
    └── End stream → POST .../streams/:id/end
          └── Mux para ingest → "stream.idle" → LiveStream.status = ENDED

Público (Web)
    │
    ├── GET /api/events/:eventId/streams
    │     └── Lista streams com status = LIVE + playbackUrl
    │
    └── Player HLS (Mux Player / hls.js / video.js)
          └── Playback adaptativo (qualidade auto)
```

#### Considerações de streaming

- **Latência** — HLS tem ~10-30s de latência (aceitável para eventos desportivos). Para < 5s, usar Low-Latency HLS ou WebRTC.
- **Reconexão** — a app mobile deve implementar reconexão automática do stream RTMP. Se a rede falha, pausar e retomar automaticamente.
- **Multi-stream** — cada staff member tem o seu stream independente. O provider gere o transcoding de cada um separadamente.
- **Custos** — estimar custo por minuto de streaming × nº de streams × duração. Para MVP, limitar a 5-10 streams simultâneos.
- **Gravação** — ativar gravação opcional no provider para highlights pós-evento.
- **CDN** — o provider trata da distribuição global. Não precisamos de CDN próprio.

#### Abordagem V2: Self-hosted (para escala ou controlo total)

Para uma fase posterior, considerar:

- **LiveKit self-hosted** — open-source, WebRTC, bom controlo, mas requer infra (media servers, TURN, escalabilidade horizontal)
- **mediasoup** — SFU open-source, muito performante, mas mais complexo de operar

> **Nota importante**: O MVP **deve evitar reinventar streaming**. Usar um provider gerido reduz risco significativamente e permite focar na integração UX.

---

## 9. Critérios de Aceitação — MVP

### 9.1 Atleta

- [ ] Consegue ver variantes disponíveis num evento (com preço, distância, vagas)
- [ ] Consegue selecionar uma variante e pagar via Stripe
- [ ] Após pagamento confirmado (webhook), fica com `status = CONFIRMED`
- [ ] Consegue ver inscrição em "Minhas Inscrições" (com QR/código)
- [ ] Consegue fazer check-in dentro da janela definida pelo organizador
- [ ] Apenas se `CONFIRMED` + check-in feito, consegue iniciar corrida/tracking
- [ ] Tracking em tempo real envia posição para o servidor
- [ ] Ao terminar, resultado é registado e visível no leaderboard
- [ ] Consegue controlar privacidade do tracking (`PUBLIC` / `FRIENDS` / `ORGANIZER_ONLY`)

### 9.2 Organizador

- [ ] Consegue criar evento com variantes (nome, distância, preço, limite, datas)
- [ ] Consegue definir fases de preço (`PricingPhase`)
- [ ] Consegue ver lista de inscritos com filtros (confirmado/pendente/cancelado)
- [ ] Consegue exportar lista de inscritos em CSV
- [ ] Consegue fazer check-in manual de um atleta (fallback)
- [ ] Consegue ver leaderboard em tempo real durante a prova
- [ ] Consegue fechar inscrições / marcar evento como terminado

### 9.3 Sistema

- [ ] Webhook Stripe processa `checkout.session.completed` → `CONFIRMED`
- [ ] Webhook Stripe processa `payment_intent.payment_failed` → mantém `PENDING` + notifica
- [ ] Webhook Stripe processa `charge.refunded` → `REFUNDED`
- [ ] Eventos Stripe guardados em log de auditoria
- [ ] Gating: apenas `CONFIRMED` + check-in pode iniciar corrida
- [ ] Tracking respeita `privacyMode` do atleta
- [ ] Leaderboard atualiza em tempo real via Socket.io

### 9.4 Staff Live Streams

- [ ] Staff autenticado (role `STAFF`+) consegue criar um live stream para o evento
- [ ] Staff recebe `ingestUrl` + `streamKey` após criar stream
- [ ] Staff consegue iniciar transmissão e o stream aparece no site em **< 10 segundos** (target)
- [ ] Público consegue ver lista de streams ativos na página do evento
- [ ] Público consegue ver múltiplos streams em simultâneo e alternar entre eles
- [ ] Filtros por categoria (Pódio, Abastecimento, Rio, Entrevista) funcionam corretamente
- [ ] Streams recuperam automaticamente de falha de rede (reconexão sem intervenção)
- [ ] `ingestUrl` e `streamKey` **nunca** são expostos no frontend público
- [ ] Apenas `playbackUrl` é devolvido nos endpoints públicos
- [ ] Webhook do provider atualiza `LiveStream.status` automaticamente (LIVE → ENDED)
- [ ] Organizador consegue forçar encerrar um stream (kill switch)
- [ ] Organizador consegue alterar visibilidade de um stream (público ↔ só organizador)
- [ ] Streams com `isPublic = false` não aparecem para o público
- [ ] Staff credenciado aparece em `EventStaffMember` com role e estado corretos

---

## 10. Runbook — Dia da Prova

### 10.1 Antes da prova (T-1h)

1. Organizador abre check-in no admin → `Event.liveStatus = CHECK_IN_OPEN`
2. Staff posiciona-se nos pontos de check-in com app/tablet
3. Atletas chegam e fazem check-in (QR scan ou código manual)
4. Sistema valida: `Registration.status = CONFIRMED` + janela aberta
5. Se válido → `checkedInAt = now()`
6. **🎥 Staff de streaming:** credenciar membros no painel do organizador
7. **🎥 Teste de stream:** cada staff de vídeo faz 1 teste de live stream (< 1 min) para confirmar conectividade e player
8. **🎥 Confirmar player:** verificar que a secção "Live" aparece corretamente na página do evento

### 10.2 Início da prova (Gun time)

1. Organizador marca evento como `LIVE` no admin
2. Atletas com check-in feito veem botão "Começar corrida" na app
3. Ao pressionar → `RaceSession` criado com `status = RUNNING`
4. App começa a enviar tracking points

### 10.3 Durante a prova

1. Tracking points recebidos e processados
2. Leaderboard atualiza em tempo real
3. Organizador acompanha no dashboard
4. Suporte: check-in manual para casos excecionais
5. Monitorização: alertas se atleta não envia tracking há > 15 min
6. **🎥 Abrir secção "Live"** no site — verificar que streams aparecem
7. **🎥 Destacar stream principal** — organizador seleciona qual stream fica em destaque
8. **🎥 Rotação de staff** — se necessário, alternar quem está a transmitir
9. **🎥 Monitorizar streams** — verificar reconexões, qualidade, estado no dashboard

### 10.4 Fim da prova

1. Atleta termina → `RaceSession.status = FINISHED`, `finishedAt = now()`
2. Resultado calculado (tempo total: `finishedAt - startedAt`)
3. Posições recalculadas no leaderboard
4. Organizador pode marcar cutoff (tempo máximo)
5. Atletas que excedem cutoff → `RaceSession.status = DISQUALIFIED`

### 10.5 Pós-prova

1. Organizador marca evento como `FINISHED`
2. Resultados finais publicados
3. Atletas veem resultado no perfil + "Minhas Inscrições"
4. Organizador exporta resultados (CSV)
5. Dados de tracking ficam disponíveis para o atleta rever o percurso
6. **🎥 Encerrar todos os streams** — confirmar que nenhum stream ficou ativo
7. **🎥 (Opcional) Export de highlights** — se gravação ativa, extrair momentos-chave
8. **🎥 Análise de métricas** — rever nº de viewers, pico de audiência, duração dos streams, erros/reconexões

---

## 11. Fases de Implementação

### Fase 0 — Organizadores e Stripe Connect (PRÉ-REQUISITO de tudo)

> ⚠️ **Esta fase desbloqueia todas as outras.** Sem organizador atribuído e sem Stripe Connect, não é possível abrir inscrições.

**Schema (migrations)**:

- `EventOrganizer` + `EventInvite` + enums (`EventOrganizerRole`, `EventInviteType`, `EventStaffRole`)
- Novos campos no `Event`: Stripe Connect fields (`stripeAccountId`, `stripeOnboardingStatus`, etc.), `hasRegistrations`, `hasLiveRace`, `commissionPercent`, `refundDeadline`
- `EventStaffMember` com roles novos (`STAFF`, `STREAM_ONLY`, `CHECKIN_ONLY`)

**Painel de admin da plataforma** (extensão do admin existente):

- Ao criar/editar evento → campo "Atribuir organizador (OWNER)" — pesquisa de utilizador por nome/email
- Lista de eventos com coluna "Organizador" e estado do Stripe

**Painel do evento** `/events/[slug]/manage` (novo — para organizadores):

- Tab **"Visão Geral"** — estado do evento, métricas rápidas (inscrições, receita)
- Tab **"Evento"** — editar dados, variantes, preços (OWNER e ADMIN)
- Tab **"Equipa"** — lista de organizadores + staff; botão "Convidar" por email; gestão de roles
- Tab **"Pagamentos"** — onboarding Stripe Connect; estado da conta; histórico de pagamentos (só OWNER)

**APIs**:

- `GET/POST/DELETE /api/events/[eventId]/organizers` — gerir organizadores
- `GET/POST/DELETE /api/events/[eventId]/staff` — gerir staff operacional
- `GET/POST /api/events/[eventId]/invites` — enviar e aceitar convites por email
- `POST /api/events/[eventId]/stripe/onboarding` — iniciar Stripe Connect (gera link de onboarding)
- Webhook `account.updated` → atualiza `stripeChargesEnabled`, `stripeOnboardingStatus`, `hasRegistrations`

**Lógica automática**:

```typescript
// Quando Stripe onboarding completo:
// event.stripeOnboardingStatus = COMPLETE → event.hasRegistrations = true (automático)
// Organizador não tem toggle manual — configurar Stripe É a decisão de aceitar inscrições
```

### Fase 1 — Inscrições e Pagamentos (MVP)

- Novos campos em `EventVariant` (`isActive`, `startsAt`, `endsAt`)
- Stripe Checkout com Stripe Connect (`transfer_data.destination`, `application_fee_amount`)
- API `POST /api/events/[eventId]/register` com gating completo
- Webhook `checkout.session.completed` → `Registration.status = CONFIRMED`
- Página de inscrição na página do evento (condicionada a `hasRegistrations`)
- "Minhas Inscrições" — `/me/registrations` (web + app)
- Dashboard do organizador: Tab "Inscrições" (lista, filtros, export CSV)
- Cancelamentos e reembolsos via Stripe Refund API

### Fase 2 — Check-in e Controlo de Acesso

- Janela de check-in (`checkInOpensAt` / `checkInClosesAt`)
- QR Code único por inscrição (gerado no `Registration`)
- App: scan de QR pelo staff (`STAFF` ou `CHECKIN_ONLY`)
- Check-in manual (fallback — busca por nome/dorsal)
- Gating completo: só `CONFIRMED` + check-in feito pode entrar no modo corrida

### Fase 3 — LiveRace (Tracking + Leaderboard)

- Schema: `RaceSession` + `TrackingPoint`
- App: tracking GPS em background (`expo-location`)
- Envio de pontos em batch para API
- Leaderboard em tempo real via Socket.io
- `liveStatus` no evento (`SCHEDULED → CHECK_IN_OPEN → LIVE → FINISHED`)
- Privacy mode por atleta (`PUBLIC / FRIENDS / ORGANIZER_ONLY`)

### Fase 4 — Resultados e Pós-corrida

- Cálculo automático de resultado (tempo total, posição por variante)
- Integração com modelo `Result` existente
- Perfil do atleta com histórico de corridas
- Partilha social de resultados

### Fase 5 — Melhorias Pós-MVP

- Cupões/descontos Stripe
- Campos personalizados no checkout (t-shirt, clube, etc.)
- Checkpoints intermédios (split times)
- Integração com wearables (heart rate)
- Notificações push (confirmação, lembrete, resultado)
- Alertas de segurança (atleta parado há muito tempo)
- Replay do percurso no mapa

### Fase 6 — Staff Live Streams (MVP Streams)

> Pode ser piloto separado ou integrada com Fase 3/4.

- Schema: `LiveStream` + enums
- Credenciamento de staff no painel de organizador (Tab "Equipa")
- Integração com **Mux Live** (RTMP ingest + HLS playback)
- App mobile: modo staff — criar, iniciar, monitorizar, terminar stream
- Reconexão automática de stream
- Página pública: secção "Live" com grid de streams, player HLS
- API streams + webhooks do provider (Mux)
- Dashboard organizador: gestão de streams + kill switch
- Testes: rede fraca, multi-stream, permissões, load do player

### Fase 7 — Live Streams Avançados (V2)

- Stream em destaque (featured) com miniaturas
- DVR / replay curto (últimos 30-60 segundos)
- Contagem de viewers em tempo real
- Câmara frontal/traseira toggle
- Chat interno staff
- (Opcional) Migração para self-hosted (LiveKit) para maior controlo
- Geolocalização de streams no mapa do evento
- Highlights automáticos pós-evento

---

## 12. Stack Técnica

| Componente                          | Tecnologia                                        |
| ----------------------------------- | ------------------------------------------------- |
| Frontend Web                        | Next.js 16 + React 19                             |
| Mobile                              | React Native / Expo                               |
| Base de dados                       | PostgreSQL + Prisma                               |
| Pagamentos                          | Stripe (Checkout + Webhooks)                      |
| Tempo real                          | Socket.io (já integrado no projeto)               |
| Mapas                               | Mapbox (já integrado no projeto)                  |
| Localização (app)                   | expo-location                                     |
| Autenticação                        | NextAuth 5 (já integrado)                         |
| Notificações                        | Push notifications (já integrado)                 |
| **Live Streaming (provider)**       | **Mux Live (MVP) — RTMP ingest + HLS playback**   |
| **Live Streaming (player web)**     | **Mux Player React / hls.js**                     |
| **Live Streaming (mobile)**         | **react-native-live-stream (RTMP) / expo-camera** |
| **Live Streaming (V2 self-hosted)** | **LiveKit (WebRTC SFU)**                          |

---

## 13. Privacidade e Questões Legais — Live Streams

### 13.1 Consentimento e termos

| Requisito                       | Implementação                                                                                            |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Staff aceita termos de captação | Checkbox obrigatório ao credenciar staff: "Aceito os termos de captação de vídeo em nome da organização" |
| Aviso ao público/atletas        | Banner no evento (físico + digital): "Este evento inclui captação de vídeo em direto"                    |
| Entrevistas flash               | Consentimento verbal mínimo antes de entrevistar; evitar filmar menores sem autorização do tutor         |
| Menores de idade                | Staff instruído para não focar câmara em menores de forma identificável sem consentimento parental       |

### 13.2 Política de retenção de gravações

| Decisão                   | Opções                                                                   |
| ------------------------- | ------------------------------------------------------------------------ |
| Gravação ativa?           | Configurável por evento: sim/não                                         |
| Se sim, tempo de retenção | 30 dias (default) / 90 dias / permanente (configurável pelo organizador) |
| Acesso às gravações       | Apenas organizador (download) — não publicado automaticamente            |
| Eliminação                | Automática após período de retenção, ou manual pelo organizador          |

### 13.3 RGPD / Proteção de dados

- Streams são conteúdo público (se `isPublic = true`) — tratar como imagem captada em evento público
- `ingestUrl` e `streamKey` são dados sensíveis — encriptar em trânsito e em repouso
- Direito ao esquecimento: organizador pode eliminar gravações a pedido
- Privacy policy do Athlifyr deve mencionar a funcionalidade de live streaming

---

## 14. Plano de Testes — Live Streams

### 14.1 Testes funcionais

| Teste                        | Critério de sucesso                                                |
| ---------------------------- | ------------------------------------------------------------------ |
| Staff cria stream            | Stream criado com `status = CREATED`, `ingestUrl` devolvido        |
| Staff inicia live            | Stream transiciona para `LIVE` em < 10s, aparece na página pública |
| Staff termina live           | Stream transiciona para `ENDED`, desaparece da secção "Live"       |
| Público vê stream            | Player HLS carrega e reproduz sem erros                            |
| Multi-stream simultâneo (3+) | 3 streams ativos em simultâneo, todos visíveis e reproduzíveis     |
| Filtros por categoria        | Filtrar por "Pódio" mostra apenas streams com `category = PODIUM`  |
| Kill switch                  | Organizador força encerramento, stream para imediatamente          |

### 14.2 Testes de resiliência

| Teste                     | Critério de sucesso                                     |
| ------------------------- | ------------------------------------------------------- |
| Rede fraca (3G)           | Stream continua com qualidade reduzida, sem crash       |
| Alternância 4G ↔ WiFi     | Reconexão automática em < 15s, sem intervenção do staff |
| Perda total de rede (30s) | App mostra "Reconnecting...", retoma quando rede volta  |
| App em background         | Stream mantém-se ativo (iOS/Android background modes)   |

### 14.3 Testes de segurança

| Teste                               | Critério de sucesso                           |
| ----------------------------------- | --------------------------------------------- |
| Público não vê `ingestUrl`          | Endpoint público devolve apenas `playbackUrl` |
| Público não vê `streamKey`          | Inspecionar response — chave nunca presente   |
| Staff sem role não cria stream      | `403 Forbidden`                               |
| Staff desativado não cria stream    | `403 Forbidden` (`isActive = false`)          |
| Stream `isPublic = false` invisível | Público não vê stream na lista                |

### 14.4 Testes de carga

| Teste                        | Critério de sucesso                             |
| ---------------------------- | ----------------------------------------------- |
| 100 viewers simultâneos      | Player carrega em < 3s, sem buffering excessivo |
| 500 viewers simultâneos      | Provider escala automaticamente, latência < 30s |
| 5 streams + 200 viewers cada | Todos os streams reproduzem sem erros           |

### 14.5 Observabilidade

- **Logs**: stream created/started/ended/error, com `eventId`, `staffUserId`, `streamId`
- **Métricas**: streams ativos, viewers por stream, erros, reconexões, latência média
- **Alertas**: stream em `ERROR` há > 2 min, 0 streams ativos durante evento `LIVE`
- **Dashboard**: painel de monitoring com métricas em tempo real (Grafana / Vercel Analytics)

---

## 15. KPIs — Live Streams

| KPI                   | Descrição                                          | Target MVP     |
| --------------------- | -------------------------------------------------- | -------------- |
| **Streams ativos**    | Nº de streams simultâneos durante evento           | ≥ 2 por evento |
| **Viewers totais**    | Nº total de espectadores únicos                    | Medir baseline |
| **Pico de viewers**   | Máximo de viewers simultâneos num stream           | Medir baseline |
| **Latência média**    | Tempo entre captação e visualização (HLS)          | < 30 segundos  |
| **Taxa de reconexão** | % de streams com reconexão automática bem-sucedida | > 90%          |
| **Taxa de erro**      | % de streams que terminam em `ERROR`               | < 5%           |
| **Tempo até LIVE**    | Tempo entre criar stream e aparecer no site        | < 10 segundos  |
| **Duração média**     | Tempo médio de duração de um stream                | Medir baseline |
| **Engagement**        | Tempo médio de visualização por viewer             | Medir baseline |
| **Partilhas**         | Nº de partilhas da secção Live (social)            | Medir baseline |

---

## 16. Milestones

| Milestone                                | Scope                                                                              | Dependências                                           |
| ---------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Milestone 0** — Organizadores + Stripe | Painel de organizador, ownership, convites, Stripe Connect por evento (Fase 0)     | Schema migration, Stripe Connect                       |
| **Milestone 1** — MVP Inscrições         | Inscrições, pagamentos com Stripe Connect, "Minhas Inscrições", dashboard (Fase 1) | Milestone 0 concluído                                  |
| **Milestone 2** — Check-in + LiveRace    | Check-in QR, tracking GPS, leaderboard ao vivo, resultados (Fases 2-4)             | Milestone 1 concluído, Socket.io, expo-location        |
| **Milestone 3** — MVP Live Streams       | Staff credenciamento, streaming multi-câmara, página pública (Fase 6)              | Milestone 0 concluído, Mux Live, app mobile staff mode |
| **Milestone 4** — Live Streams V2        | DVR, viewers, featured stream, highlights (Fase 7)                                 | Milestone 3 concluído                                  |

> **Nota**: Milestone 3 (Live Streams) pode ser desenvolvido em paralelo com Milestone 2 (LiveRace), pois ambos dependem apenas de Milestone 0.

---

**Status**: 📋 **Roadmap definido — próximo passo: Milestone 0 (Fase 0 — Organizadores + Stripe Connect)**
