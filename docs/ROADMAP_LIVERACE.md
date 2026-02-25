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

---

## 2. Personas e Fluxos (User Journeys)

### 2.1 Atleta (Web ou App)

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

| Passo | Ação                                             | Detalhe                                        |
| ----- | ------------------------------------------------ | ---------------------------------------------- |
| 1     | Criar evento + variantes (distâncias/categorias) | Admin UI                                       |
| 2     | Definir preços, limites, datas de cutoff         | `PricingPhase`, `EventVariant.maxParticipants` |
| 3     | Abrir inscrições                                 | Publicar evento                                |
| 4     | Acompanhar inscritos/pagamentos                  | Dashboard com filtros                          |
| 5     | Exportar lista de inscritos (CSV) para staff     | Export por variante                            |
| 6     | No dia: check-in + validações                    | Scan QR / check-in manual                      |
| 7     | Fechar inscrições / fechar prova                 | Alterar estado do evento                       |
| 8     | Exportar resultados                              | CSV / API                                      |

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

### 3.3 Novos modelos — Staff & Live Streams

#### `EventStaffMember`

```prisma
model EventStaffMember {
  id          String           @id @default(cuid())
  eventId     String
  userId      String
  role        EventStaffRole   @default(STAFF)
  // ORGANIZER_OWNER | ORGANIZER_ADMIN | STAFF
  isActive    Boolean          @default(true)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  // Relações
  event       Event            @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  liveStreams LiveStream[]

  @@unique([eventId, userId])
  @@index([eventId])
  @@index([userId])
}

enum EventStaffRole {
  ORGANIZER_OWNER
  ORGANIZER_ADMIN
  STAFF
}
```

#### `LiveStream`

```prisma
model LiveStream {
  id              String            @id @default(cuid())
  eventId         String
  staffMemberId   String
  title           String            // Ex: "Pódio", "Abastecimento km 8"
  category        LiveStreamCategory @default(OTHER)
  // PODIUM | AID_STATION | RIVER | INTERVIEW | START_LINE | FINISH_LINE | OTHER
  status          LiveStreamStatus  @default(CREATED)
  // CREATED | LIVE | ENDED | ERROR
  isPublic        Boolean           @default(true)

  // Timestamps
  startedAt       DateTime?
  endedAt         DateTime?

  // Provider
  provider        StreamProvider    @default(MUX)
  // MUX | LIVEKIT | AGORA | CLOUDFLARE | AWS_IVS
  providerStreamId String?          // ID externo no provider
  playbackUrl     String?           // HLS URL (público)
  ingestUrl       String?           // RTMP/WebRTC ingest (NUNCA expor publicamente)
  streamKey       String?           // Chave de stream (NUNCA expor publicamente)

  // Localização opcional (para mostrar no mapa)
  latitude        Float?
  longitude       Float?

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  // Relações
  event           Event             @relation(fields: [eventId], references: [id], onDelete: Cascade)
  staffMember     EventStaffMember  @relation(fields: [staffMemberId], references: [id], onDelete: Cascade)

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
User ──< Registration >── EventVariant
              │                  │
              │                  └── Event ──< LiveStream
              │                       │
              └── RaceSession (1:1)    └──< EventStaffMember
                       │                        │
                       └──< TrackingPoint      └──< LiveStream
                                                      │
                                                User ─┘
```

---

## 4. Regras de Acesso (Gating)

### 4.1 Roles do evento

| Role              | Descrição          | Permissões principais                                       |
| ----------------- | ------------------ | ----------------------------------------------------------- |
| `ORGANIZER_OWNER` | Dono do evento     | Tudo (gerir evento, staff, streams, inscrições, resultados) |
| `ORGANIZER_ADMIN` | Admin do evento    | Gerir staff, streams, inscrições, leaderboard               |
| `STAFF`           | Membro credenciado | Iniciar/parar live streams, check-in de atletas             |
| `ATHLETE`         | Atleta inscrito    | Inscrever-se, check-in, corrida, tracking                   |
| `PUBLIC_VIEWER`   | Público            | Ver evento, leaderboard, streams públicos                   |

> Nota: `ATHLETE` e `PUBLIC_VIEWER` não são guardados em `EventStaffMember`. São roles implícitos baseados em `Registration` e sessão autenticada.

### 4.2 Quem pode fazer o quê

| Ação                               | Requisito                                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Ver evento / variantes             | Público (qualquer utilizador)                                                                                            |
| Inscrever-se (checkout)            | Autenticado + variante ativa + capacidade disponível                                                                     |
| Check-in                           | `Registration.status = CONFIRMED` + dentro da janela (`checkInOpensAt` → `checkInClosesAt`)                              |
| Iniciar corrida (tracking)         | `Registration.status = CONFIRMED` + `checkedInAt != null` + evento/variante em estado `LIVE` + permissões de localização |
| Aparecer no leaderboard oficial    | `Registration.status = CONFIRMED` + `RaceSession.status = RUNNING` ou `FINISHED`                                         |
| Ver tracking de outro atleta       | `RaceSession.privacyMode = PUBLIC` **ou** relação de amizade (se `FRIENDS`) **ou** organizador (se `ORGANIZER_ONLY`)     |     | **Iniciar / parar live stream** | **`EventStaffMember.role ∈ {STAFF, ORGANIZER_ADMIN, ORGANIZER_OWNER}` + `isActive = true` + evento não `FINISHED`/`CANCELLED`** |
| **Definir título/local do stream** | **Mesmo que acima**                                                                                                      |
| **Definir visibilidade do stream** | **`ORGANIZER_ADMIN` ou `ORGANIZER_OWNER` (staff pode sugerir, admin aprova)**                                            |
| **Ver streams públicos**           | **Público (qualquer utilizador)**                                                                                        |
| **Ver streams "Só organizador"**   | **`ORGANIZER_ADMIN` ou `ORGANIZER_OWNER`**                                                                               |
| **Credenciar staff**               | **`ORGANIZER_OWNER` ou `ORGANIZER_ADMIN`**                                                                               |

### 4.3 Estados bloqueantes

| Estado                            | Bloqueio                                                    |
| --------------------------------- | ----------------------------------------------------------- |
| `Registration.status = PENDING`   | Sem acesso ao modo corrida. Pagamento ainda não confirmado. |
| `Registration.status = CANCELLED` | Inscrição cancelada. Sem acesso.                            |
| `Registration.status = REFUNDED`  | Reembolso processado. Sem acesso.                           |
| `checkedInAt = null`              | Não fez check-in. Não pode iniciar corrida.                 |
| Evento não está `LIVE`            | Corrida ainda não começou ou já terminou.                   |
| Localização não concedida         | App bloqueia início da corrida.                             |

### 4.4 Nota sobre privacidade

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

| Evento Stripe                        | Ação no Athlifyr                                                          |
| ------------------------------------ | ------------------------------------------------------------------------- |
| `checkout.session.completed`         | Marcar `Registration.status = CONFIRMED`, guardar `stripePaymentIntentId` |
| `payment_intent.payment_failed`      | Manter `Registration.status = PENDING`, enviar notificação ao utilizador  |
| `charge.refunded` / `refund.updated` | Marcar `Registration.status = REFUNDED`                                   |

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

### Fase 5 — Melhorias Pós-MVP (Tracking)

- Cupões/descontos Stripe
- Campos personalizados no checkout (tamanho t-shirt, clube, etc.)
- Checkpoints intermédios (split times)
- Integração com wearables (heart rate)
- Notificações push (confirmação, lembrete, resultado)
- Alertas de segurança (atleta parado há muito tempo)
- Replay do percurso no mapa

### Fase 6 — Staff Live Streams (MVP Streams)

> Pode ser implementada como piloto separado ou integrada na Fase 3/4, dependendo do risco e prioridade.

- Modelo `EventStaffMember` + `LiveStream` + enums
- Roles e permissões de staff (`ORGANIZER_OWNER`, `ORGANIZER_ADMIN`, `STAFF`)
- Credenciamento de staff no painel do organizador
- Integração com **provider de streaming** (Mux Live recomendado para MVP)
- App mobile: modo staff com ecrã de streaming (criar, iniciar, monitorizar, terminar)
- Reconexão automática de stream na app
- Página pública: secção "Live" com grid de streams, filtros por categoria, player HLS
- Endpoints de API para staff streams + webhooks do provider
- Dashboard do organizador: gestão de streams + kill switch
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

| Milestone                               | Scope                                                                          | Dependências                                       |
| --------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------- |
| **Milestone 1** — MVP LiveRace Tracking | Inscrições, pagamentos, check-in, tracking, leaderboard (Fases 1-4)            | Stripe, Socket.io, expo-location                   |
| **Milestone 2** — MVP Live Streams      | Staff credenciamento, streaming multi-câmara, página pública, runbook (Fase 6) | Provider de streaming (Mux), app mobile staff mode |
| **Milestone 3** — Live Streams V2       | DVR, viewers, featured stream, self-hosted, highlights (Fase 7)                | Milestone 2 concluída                              |

> **Nota**: Milestone 2 pode ser executada como piloto separado (1 evento teste) antes do rollout geral, para validar a integração com o provider e o fluxo de staff.

---

**Status**: 📋 **Roadmap definido — pronto para implementação por fases**
