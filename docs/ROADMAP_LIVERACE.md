# LiveRace — Roadmap Completo

> Inscrições · Pagamentos · Check-in · Tracking em tempo real · Leaderboard

---

## 1. Visão Geral

O **LiveRace** é a funcionalidade que transforma o Athlifyr numa plataforma completa para eventos desportivos ao vivo. Permite que atletas se inscrevam, paguem, façam check-in no dia da prova e sejam tracked em tempo real — com resultados, leaderboard e partilha social.

### Princípios

- **Inscrição obrigatória** — só atletas com `Registration.status = CONFIRMED` podem participar (check-in, tracking, leaderboard).
- **Pagamento via Stripe** — checkout seguro com confirmação via webhooks.
- **Privacidade por design** — tracking público apenas com opt-in do atleta ou conforme os termos do evento.
- **Mobile-first** — a experiência de corrida (tracking, check-in) é pensada para a app; a web serve para inscrições, gestão e visualização.

---

## 2. Personas e Fluxos (User Journeys)

### 2.1 Atleta (Web ou App)

| Passo | Ação | Estado |
|-------|------|--------|
| 1 | Ver evento (página pública) | — |
| 2 | Ver variantes disponíveis (distância, preço, limite, regras) | — |
| 3 | Selecionar variante | — |
| 4 | Checkout Stripe (pagamento) | `Registration.status = PENDING` |
| 5 | Pagamento confirmado (webhook `checkout.session.completed`) | `Registration.status = CONFIRMED` |
| 6 | Consultar "Minhas Inscrições" (QR/código, detalhes) | — |
| 7 | No dia: check-in (QR / código / botão) dentro da janela do evento | `Registration.checkedInAt = timestamp` |
| 8 | Iniciar corrida → tracking em tempo real | `RaceSession.status = RUNNING` |
| 9 | Terminar corrida → resultado registado | `RaceSession.status = FINISHED` |

**Pré-condições para iniciar corrida:**

- `Registration.status = CONFIRMED`
- `Registration.checkedInAt != null`
- Evento/variante em estado `LIVE`
- Permissões de localização concedidas no dispositivo

### 2.2 Organizador (Web)

| Passo | Ação | Detalhe |
|-------|------|---------|
| 1 | Criar evento + variantes (distâncias/categorias) | Admin UI |
| 2 | Definir preços, limites, datas de cutoff | `PricingPhase`, `EventVariant.maxParticipants` |
| 3 | Abrir inscrições | Publicar evento |
| 4 | Acompanhar inscritos/pagamentos | Dashboard com filtros |
| 5 | Exportar lista de inscritos (CSV) para staff | Export por variante |
| 6 | No dia: check-in + validações | Scan QR / check-in manual |
| 7 | Fechar inscrições / fechar prova | Alterar estado do evento |
| 8 | Exportar resultados | CSV / API |

---

## 3. Modelo de Dados (PostgreSQL / Prisma)

> Nota: O schema atual já contém `Event`, `EventVariant`, `PricingPhase`, `Participation` e `Result`. Abaixo estão as alterações e novos modelos necessários.

### 3.1 Alterações a modelos existentes

#### `Event` — novos campos

```prisma
model Event {
  // ... campos existentes ...

  // LiveRace — novos campos
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

### 3.3 Diagrama de relações

```
User ──< Registration >── EventVariant
              │                  │
              │                  └── Event
              │
              └── RaceSession (1:1)
                       │
                       └──< TrackingPoint
```

---

## 4. Regras de Acesso (Gating)

### 4.1 Quem pode fazer o quê

| Ação | Requisito |
|------|-----------|
| Ver evento / variantes | Público (qualquer utilizador) |
| Inscrever-se (checkout) | Autenticado + variante ativa + capacidade disponível |
| Check-in | `Registration.status = CONFIRMED` + dentro da janela (`checkInOpensAt` → `checkInClosesAt`) |
| Iniciar corrida (tracking) | `Registration.status = CONFIRMED` + `checkedInAt != null` + evento/variante em estado `LIVE` + permissões de localização |
| Aparecer no leaderboard oficial | `Registration.status = CONFIRMED` + `RaceSession.status = RUNNING` ou `FINISHED` |
| Ver tracking de outro atleta | `RaceSession.privacyMode = PUBLIC` **ou** relação de amizade (se `FRIENDS`) **ou** organizador (se `ORGANIZER_ONLY`) |

### 4.2 Estados bloqueantes

| Estado | Bloqueio |
|--------|----------|
| `Registration.status = PENDING` | Sem acesso ao modo corrida. Pagamento ainda não confirmado. |
| `Registration.status = CANCELLED` | Inscrição cancelada. Sem acesso. |
| `Registration.status = REFUNDED` | Reembolso processado. Sem acesso. |
| `checkedInAt = null` | Não fez check-in. Não pode iniciar corrida. |
| Evento não está `LIVE` | Corrida ainda não começou ou já terminou. |
| Localização não concedida | App bloqueia início da corrida. |

### 4.3 Nota sobre privacidade

- **LiveRace público** (leaderboard/tracking) pode mostrar atletas **apenas se** o atleta aceitar (opt-in via `privacyMode`) ou se os termos do evento o definirem.
- **Participar na prova** (tracking/resultado) requer sempre inscrição confirmada (`CONFIRMED`).
- O campo `RaceSession.privacyMode` é controlado pelo atleta e pode ser alterado a qualquer momento durante a corrida.

---

## 5. Pagamentos — Stripe

### 5.1 Checkout

```
Atleta seleciona variante
       │
       ▼
POST /api/events/[eventId]/register
       │
       ├── Validar: variante ativa, capacidade, deadline
       ├── Criar Registration (status=PENDING)
       ├── Criar Stripe Checkout Session
       │     metadata: { eventId, variantId, userId, registrationId }
       │     line_items: [{ price_data: { unit_amount: amountCents, currency } }]
       │     success_url: /events/[slug]/registration/success
       │     cancel_url: /events/[slug]
       │
       └── Redirect para Stripe Checkout
```

**Campos opcionais v1:**
- Cupões/descontos via Stripe Coupons
- Campos personalizados no checkout (ex: tamanho t-shirt, clube)

### 5.2 Webhooks

| Evento Stripe | Ação no Athlifyr |
|----------------|-----------------|
| `checkout.session.completed` | Marcar `Registration.status = CONFIRMED`, guardar `stripePaymentIntentId` |
| `payment_intent.payment_failed` | Manter `Registration.status = PENDING`, enviar notificação ao utilizador |
| `charge.refunded` / `refund.updated` | Marcar `Registration.status = REFUNDED` |

**Implementação:**

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

| Cenário | Regra |
|---------|-------|
| Cancelamento pelo atleta antes da data X | Reembolso automático via Stripe Refund API |
| Cancelamento pelo atleta após a data X | Sem reembolso (política do evento) |
| Cancelamento pelo organizador/admin | Reembolso manual + atualizar `Registration.status = CANCELLED` |
| Evento cancelado | Reembolso de todas as inscrições `CONFIRMED` |

A data de cutoff para reembolso pode ser configurada no `Event` (ex: `refundDeadline: DateTime?`).

---

## 6. API Endpoints

### 6.1 Inscrições

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/events/[eventId]/register` | Criar inscrição + Stripe Checkout Session |
| `GET` | `/api/events/[eventId]/registrations` | Listar inscrições (organizador) |
| `GET` | `/api/me/registrations` | "Minhas Inscrições" (atleta) |
| `PATCH` | `/api/registrations/[id]/check-in` | Check-in (QR / código) |
| `PATCH` | `/api/registrations/[id]/cancel` | Cancelar inscrição |
| `GET` | `/api/events/[eventId]/registrations/export` | Exportar inscritos (CSV) |

### 6.2 Corrida (LiveRace)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/race/start` | Iniciar corrida (criar `RaceSession`) |
| `POST` | `/api/race/tracking` | Enviar ponto de tracking (batch) |
| `POST` | `/api/race/finish` | Terminar corrida |
| `GET` | `/api/events/[eventId]/leaderboard` | Leaderboard em tempo real |
| `GET` | `/api/race/[sessionId]/track` | Track de um atleta (respeita `privacyMode`) |

### 6.3 Webhooks

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/webhooks/stripe` | Receber eventos Stripe |

---

## 7. UI/UX — Web + App

### 7.1 Página do Evento (Web + App)

**Componentes:**

- **Lista de variantes** — cards com: nome, distância, preço, vagas disponíveis, data de início
- **Botão "Inscrever"** — por variante
- **Estados visuais:**

| Estado | UI |
|--------|----|
| Variante disponível | Botão "Inscrever" ativo |
| Inscrito (CONFIRMED) | Badge "✅ Inscrito" + link para "Minhas Inscrições" |
| Pagamento pendente (PENDING) | Badge "⏳ Pagamento pendente" + link para tentar de novo |
| Inscrições encerradas | Botão desativado + texto "Inscrições encerradas" |
| Lotado | Botão desativado + texto "Lotado" |
| Evento cancelado | Banner de aviso |

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

### 8.3 Considerações

- **Bateria** — na app, usar `expo-location` com `Accuracy.Balanced` e intervalo de 5–10s para equilibrar precisão e consumo.
- **Offline** — se o atleta perder rede, acumular pontos localmente e enviar quando recuperar ligação.
- **Rate limiting** — proteger endpoint de tracking contra abuso (max 1 request/s por sessão).

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

---

## 10. Runbook — Dia da Prova

### 10.1 Antes da prova (T-1h)

1. Organizador abre check-in no admin → `Event.liveStatus = CHECK_IN_OPEN`
2. Staff posiciona-se nos pontos de check-in com app/tablet
3. Atletas chegam e fazem check-in (QR scan ou código manual)
4. Sistema valida: `Registration.status = CONFIRMED` + janela aberta
5. Se válido → `checkedInAt = now()`

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

---

## 11. Fases de Implementação

### Fase 1 — Inscrições e Pagamentos (MVP)

- Novos campos em `Event` e `EventVariant`
- Modelo `Registration` + enums
- Stripe Checkout + webhooks
- Página de inscrição (web)
- "Minhas Inscrições" (web + app)
- Dashboard do organizador (lista de inscritos + export)

### Fase 2 — Check-in e Controlo de Acesso

- Janela de check-in (`checkInOpensAt` / `checkInClosesAt`)
- QR Code por inscrição
- Scan de QR na app (staff)
- Check-in manual (fallback)
- Gating completo (só CONFIRMED + check-in para corrida)

### Fase 3 — LiveRace (Tracking + Leaderboard)

- Modelo `RaceSession` + `TrackingPoint`
- Tracking em background na app (expo-location)
- Envio de pontos em batch
- Leaderboard em tempo real (Socket.io)
- Privacy mode (PUBLIC / FRIENDS / ORGANIZER_ONLY)

### Fase 4 — Resultados e Pós-corrida

- Cálculo automático de resultados
- Posições por variante e categoria
- Integração com modelo `Result` existente
- Perfil do atleta com histórico
- Partilha social de resultados

### Fase 5 — Melhorias Pós-MVP

- Cupões/descontos Stripe
- Campos personalizados no checkout (tamanho t-shirt, clube, etc.)
- Checkpoints intermédios (split times)
- Integração com wearables (heart rate)
- Notificações push (confirmação, lembrete, resultado)
- Alertas de segurança (atleta parado há muito tempo)
- Replay do percurso no mapa

---

## 12. Stack Técnica

| Componente | Tecnologia |
|------------|------------|
| Frontend Web | Next.js 16 + React 19 |
| Mobile | React Native / Expo |
| Base de dados | PostgreSQL + Prisma |
| Pagamentos | Stripe (Checkout + Webhooks) |
| Tempo real | Socket.io (já integrado no projeto) |
| Mapas | Mapbox (já integrado no projeto) |
| Localização (app) | expo-location |
| Autenticação | NextAuth 5 (já integrado) |
| Notificações | Push notifications (já integrado) |

---

**Status**: 📋 **Roadmap definido — pronto para implementação por fases**
