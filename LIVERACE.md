# LiveRace — Documentação Técnica

Sistema de acompanhamento de corridas em tempo real. Permite a organização controlar o estado de uma prova e os espetadores seguirem os atletas ao vivo através de GPS, leaderboard e feed de eventos.

---

## Índice

1. [Arquitetura](#arquitetura)
2. [Estados da Corrida](#estados-da-corrida)
3. [Fluxo Completo de uma Prova](#fluxo-completo-de-uma-prova)
4. [API REST](#api-rest)
5. [Eventos Socket.io](#eventos-socketio)
6. [Como Usar — Organização](#como-usar--organização)
7. [Como Usar — Atleta (App Móvel)](#como-usar--atleta-app-móvel)
8. [Como Usar — Espetador (Web)](#como-usar--espetador-web)
9. [Variáveis de Ambiente](#variáveis-de-ambiente)
10. [Estrutura de Ficheiros](#estrutura-de-ficheiros)

---

## Arquitetura

O sistema tem **três camadas** que comunicam entre si:

```
┌─────────────────────────────────────────────────────────────┐
│  BROWSER / APP MÓVEL                                        │
│                                                             │
│  Página pública do evento      App do atleta                │
│  (LiveRaceSection + hooks)     (useLiveRace + GPS)          │
│         │ Socket.io                    │ Socket.io + GPS     │
└─────────┼────────────────────────────┼────────────────────-─┘
          │                            │
          ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│  LIVE SERVER  (Fastify + Socket.io)                         │
│  athlifyr-demo.up.railway.app                               │
│                                                             │
│  • Salas em memória (EventRoomState)                        │
│  • GPS processing + route engine                            │
│  • Leaderboard + broadcasts periódicos                      │
│  • Redis para persistência entre instâncias                 │
│                                                             │
│  REST:  /live/*      — controlo público/admin               │
│         /internal/*  — chamadas internas do Next.js         │
│         /api/chat/*  — chat em tempo real                   │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP interno
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  NEXT.JS  (aplicação principal)                             │
│                                                             │
│  • Base de dados (PostgreSQL via Prisma)                    │
│  • Autenticação (NextAuth)                                  │
│  • Página de gestão do evento (manage)                      │
│  • APIs internas para o Live Server                         │
└─────────────────────────────────────────────────────────────┘
```

### Comunicação entre serviços

| Direção               | Protocolo             | Autenticação              |
| --------------------- | --------------------- | ------------------------- |
| Browser → Live Server | Socket.io (WebSocket) | JWT token (atletas)       |
| Browser → Next.js     | HTTP                  | Session cookie (NextAuth) |
| Next.js → Live Server | HTTP REST             | Header `x-live-secret`    |
| Live Server → Next.js | HTTP REST             | Header `X-Live-Secret`    |

---

## Estados da Corrida

```
SCHEDULED
    │
    │  checkin
    ▼
CHECK_IN_OPEN
    │
    │  warmup
    ▼
WARMUP  ◄──────────────────────┐
    │                          │ (auto, pela hora de início)
    │  start (manual ou auto)  │
    ▼                          │
LIVE ──────────────────────────┘
    │  │
    │  │  pause
    │  ▼
    │ PAUSED
    │  │
    │  │  resume
    │  └──────► LIVE
    │
    │  finish
    ▼
FINISHED

LIVE / PAUSED ──► CANCELLED  (via admin)
```

### Descrição dos estados

| Estado          | Descrição                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------- |
| `SCHEDULED`     | Prova configurada, ainda não iniciada                                                              |
| `CHECK_IN_OPEN` | Check-in de atletas aberto                                                                         |
| `WARMUP`        | Sala criada no Live Server, atletas podem ligar-se, GPS aceite mas não processado para leaderboard |
| `LIVE`          | Corrida em curso, GPS processado, leaderboard ativo                                                |
| `PAUSED`        | Corrida pausada (emergência), broadcasts param, GPS ignorado                                       |
| `FINISHED`      | Corrida terminada, resultados persistidos, sala destruída após 60s                                 |
| `CANCELLED`     | Corrida cancelada                                                                                  |

---

## Fluxo Completo de uma Prova

### 1. Configuração (antes do dia)

- O organizador ativa `hasLiveRace = true` no evento
- Configura percursos (variantes) com pontos de rota GPX e checkpoints
- Configura `LiveSettings`: desvio máximo, velocidade máxima, frequência de broadcasts

### 2. Dia da prova — Organização

```
Manage page → Tab "LiveRace"
```

**Passo a passo:**

```
1. [SCHEDULED]     → botão "Abrir Check-in"
        │
        │  POST /api/events/{id}/live-control { command: "checkin" }
        │  DB: liveStatus → CHECK_IN_OPEN
        │
2. [CHECK_IN_OPEN] → botão "Ativar Warmup"
        │
        │  POST /api/events/{id}/live-control { command: "warmup" }
        │  DB: liveStatus → WARMUP
        │  Live Server cria a sala em memória, fetcha config do Next.js
        │  Espetadores que abram a página já vêem badge "WARMUP"
        │
3. [WARMUP]        → botão "Iniciar Corrida"
        │
        │  POST /api/events/{id}/live-control { command: "start" }
        │  DB: liveStatus → LIVE
        │  Live Server: room.status = LIVE, raceStartTime = now
        │  Socket.io broadcast: liverace:status_changed { status: "LIVE" }
        │  Espetadores vêem badge "LIVE" animado
        │
4. [LIVE]          → botão "Pausar" (emergência)
        │
        │  POST /api/events/{id}/live-control { command: "pause" }
        │  DB + Live Server: status → PAUSED
        │  GPS processing para, leaderboard congela
        │
5. [PAUSED]        → botão "Retomar"
        │
        │  POST /api/events/{id}/live-control { command: "resume" }
        │  DB + Live Server: status → LIVE
        │
6. [LIVE/PAUSED]   → botão "Terminar Corrida"

        POST /api/events/{id}/live-control { command: "finish" }
        DB: liveStatus → FINISHED
        Live Server: persiste resultados, destrói sala em 60s
        Socket.io broadcast: liverace:status_changed { status: "FINISHED" }
```

### 3. Atleta (App Móvel)

```
1. Abre o evento na app
2. Conecta via Socket.io → emite liverace:join_athlete { eventId }
3. Live Server verifica registo em /api/internal/live-auth/verify
4. Em WARMUP: posição GPS aceite mas não processada para leaderboard
5. Em LIVE: GPS enviado a cada 1-3s → processado pelo route engine
   - Projeção no percurso
   - Deteção de checkpoints
   - Deteção de chegada
6. Se perder ligação: GPS bufferizado localmente (até 5000 pontos)
7. Ao reconectar: batch enviado via liverace:gps_batch
```

### 4. Espetador (Web)

```
1. Abre a página pública do evento /events/{slug}
2. Se hasLiveRace = true → componente LiveRaceSection montado
3. useLiveRace conecta automaticamente como spectator
4. Recebe liverace:joined → sabe o status atual
5. Atualiza em tempo real via:
   - liverace:status_changed  → estado da corrida
   - liverace:leaderboard     → leaderboard completo (a cada 5s)
   - liverace:positions       → posições GPS dos atletas (a cada 2s)
   - liverace:checkpoint_reached → atleta passou num checkpoint
   - liverace:athlete_finished   → atleta chegou à meta
```

---

## API REST

### Live Server — Rotas públicas (`/live/*`)

#### `POST /live/start`

Prepara uma sala para um evento. Idempotente — chamada quando um espetador carrega a página.

**Body:**

```json
{ "eventId": "clxxx..." }
```

**Resposta:**

```json
{
  "status": "WARMUP",
  "eventId": "clxxx...",
  "created": true,
  "athletes": 0,
  "spectators": 0
}
```

---

#### `POST /live/stop`

Para uma corrida. Requer autenticação JWT + role `ADMIN`.

**Body:**

```json
{ "eventId": "clxxx...", "reason": "FINISHED" }
```

---

#### `GET /live/status?eventId={id}`

Estado atual de uma sala (ou listagem de todas as salas ativas).

**Resposta (com eventId):**

```json
{
  "eventId": "clxxx...",
  "status": "LIVE",
  "raceStartTime": 1740000000000,
  "athletes": 42,
  "leaderboard": [...],
  "spectatorCount": 150
}
```

---

### Live Server — Rotas internas (`/internal/*`)

> Apenas chamadas pelo Next.js. Requerem header `x-live-secret`.

#### `POST /internal/status`

Sincroniza uma mudança de estado (após update na DB) e faz broadcast via Socket.io.

**Body:**

```json
{ "eventId": "clxxx...", "status": "LIVE" }
```

**Resposta:**

```json
{ "ok": true, "eventId": "clxxx...", "status": "LIVE", "roomFound": true }
```

> Se `roomFound: false`, a sala ainda não existe (normal em CHECK_IN_OPEN). Quando for criada, vai ler o status correto da DB.

---

#### `GET /internal/room-info/:eventId`

Métricas em tempo real para o painel de gestão.

**Resposta:**

```json
{
  "connectedCount": 150,
  "participantCount": 42,
  "lastUpdate": null
}
```

---

### Next.js — APIs do evento

#### `POST /api/events/{id}/live-control`

Comandos de controlo. Requer sessão autenticada + permissão `manage_event` ou `manage_liverace`.

**Body:**

```json
{ "command": "start" }
```

Comandos disponíveis: `checkin` | `warmup` | `start` | `pause` | `resume` | `finish`

**Resposta:**

```json
{ "liveStatus": "LIVE" }
```

---

#### `GET /api/events/{id}/live-status`

Status atual para o painel de gestão. Combina dados da DB com métricas do Live Server.

**Resposta:**

```json
{
  "liveStatus": "LIVE",
  "connectedCount": 150,
  "participantCount": 42,
  "lastUpdate": null
}
```

---

### Next.js — APIs internas (chamadas pelo Live Server)

| Endpoint                                 | Descrição                                                    |
| ---------------------------------------- | ------------------------------------------------------------ |
| `GET /api/internal/live-config?eventId=` | Config completa do evento (percursos, checkpoints, settings) |
| `POST /api/internal/live-status`         | Atualiza `liveStatus` na DB                                  |
| `POST /api/internal/live-auth/verify`    | Verifica se um utilizador está registado numa prova          |
| `POST /api/internal/live-results`        | Persiste resultados finais dos atletas                       |

---

## Eventos Socket.io

### Cliente → Servidor

| Evento                    | Payload                                                          | Descrição                        |
| ------------------------- | ---------------------------------------------------------------- | -------------------------------- |
| `liverace:join_athlete`   | `{ eventId }`                                                    | Atleta autentica e entra na sala |
| `liverace:join_spectator` | `{ eventId }`                                                    | Espetador entra na sala          |
| `liverace:leave`          | `{ eventId }`                                                    | Sai da sala                      |
| `liverace:gps_update`     | `{ eventId, point: { lat, lng, accuracy?, speed?, altitude? } }` | Atualização GPS em tempo real    |
| `liverace:gps_batch`      | `{ eventId, points: [...] }`                                     | Batch de GPS acumulado offline   |

### Servidor → Cliente

| Evento                        | Payload                                                       | Descrição                                |
| ----------------------------- | ------------------------------------------------------------- | ---------------------------------------- |
| `liverace:joined`             | `{ eventId, status, role }`                                   | Confirmação de entrada na sala           |
| `liverace:error`              | `{ message, code }`                                           | Erro (ex: não registado)                 |
| `liverace:status_changed`     | `{ eventId, status, raceStartTime? }`                         | Estado da corrida mudou                  |
| `liverace:positions`          | `{ eventId, athletes: [...] }`                                | Posições GPS de todos os atletas (2s/5s) |
| `liverace:leaderboard`        | `{ eventId, entries: [...], timestamp }`                      | Leaderboard completo (5s)                |
| `liverace:athlete_joined`     | `{ eventId, athlete }`                                        | Novo atleta entrou                       |
| `liverace:athlete_left`       | `{ eventId, userId }`                                         | Atleta saiu                              |
| `liverace:checkpoint_reached` | `{ eventId, userId, athleteName, checkpoint }`                | Atleta passou num checkpoint             |
| `liverace:athlete_finished`   | `{ eventId, userId, athleteName, rank, finishTimeMs }`        | Atleta chegou à meta                     |
| `liverace:athlete_status`     | `{ eventId, userId, status }`                                 | Estado do atleta mudou (OFF_ROUTE, etc.) |
| `liverace:spectator_count`    | `{ eventId, count }`                                          | Número de espetadores atualizado         |
| `liverace:sync_progress`      | `{ eventId, processed, total }`                               | Progresso do upload batch                |
| `liverace:sync_complete`      | `{ eventId, processed, skipped, newCheckpoints, durationMs }` | Upload batch concluído                   |

---

## Como Usar — Organização

### Pré-requisitos

1. O evento tem `hasLiveRace = true`
2. O evento tem pelo menos uma variante com pontos de rota

### Painel de controlo

Acede em: `/events/{slug}/manage` → tab **LiveRace** (ícone de antena)

O painel mostra:

- **Estado atual** — badge colorido com o estado da prova
- **Espetadores** — número de pessoas a assistir em tempo real
- **Participantes** — atletas com GPS ativo
- **Estado do servidor** — online/offline (atualiza a cada 10s)
- **Botões de controlo** — aparecem consoante o estado atual

### Sequência de controlo no dia

| Momento              | Ação                 | Resultado                                                  |
| -------------------- | -------------------- | ---------------------------------------------------------- |
| ~1h antes da largada | **Abrir Check-in**   | Atletas recebem notificação para fazer check-in            |
| ~15-30min antes      | **Ativar Warmup**    | Sala criada, espetadores já vêem badge WARMUP              |
| Hora da largada      | **Iniciar Corrida**  | GPS começa a ser processado, leaderboard ativo, badge LIVE |
| Incidente            | **Pausar**           | Corrida suspensa, GPS ignorado                             |
| Fim da prova         | **Terminar Corrida** | Resultados guardados, sala encerrada                       |

### Link para página pública

No fundo do tab existe um botão "Ver página pública" que abre `/events/{slug}` numa nova aba — útil para confirmar que os espetadores estão a ver a corrida.

---

## Como Usar — Atleta (App Móvel)

> A integração com a app móvel usa o hook `useLiveRace` com `role: "athlete"` e `token` JWT.

```typescript
const { connected, status, sendGpsUpdate } = useLiveRace({
  eventId: "clxxx...",
  role: "athlete",
  token: session.accessToken,
  autoConnect: true,
});

// Enviar GPS (chamar a cada 1-3s enquanto LIVE)
sendGpsUpdate({
  lat: 39.7436,
  lng: -8.8069,
  accuracy: 5,
  speed: 3.2,
  altitude: 120,
});
```

### Comportamento offline

- Se perder ligação, os pontos GPS são bufferizados localmente (máx 5000 pontos)
- Ao reconectar, o batch é enviado automaticamente via `liverace:gps_batch`
- O servidor processa os pontos em ordem cronológica e emite progresso via `liverace:sync_progress`

### Anti-cheat

O servidor rejeita automaticamente:

- Pontos com accuracy > threshold (GPS impreciso)
- Saltos de velocidade impossíveis (teleportação)
- Pontos com timestamp futuro ou muito antigo (> 24h)

---

## Como Usar — Espetador (Web)

O componente `LiveRaceSection` é renderizado automaticamente na página do evento quando `hasLiveRace = true` e `status !== "SCHEDULED"`.

```tsx
// app/[locale]/events/[slug]/page.tsx
{
  event.hasLiveRace && (
    <LiveRaceSection
      eventId={event.id}
      variants={event.variants.map((v) => ({
        variantId: v.id,
        variantName: v.name,
        routePoints: v.routePoints,
      }))}
    />
  );
}
```

O que o espetador vê:

- **Badge LIVE** animado (vermelho) durante a corrida
- **Badge WARMUP** (âmbar) antes da largada
- **Badge FINISHED** (verde) após o fim
- **Leaderboard** em tempo real com rank, nome, distância, progresso e tempo
- **Feed de eventos** — checkpoints e chegadas recentes
- **Contador de espetadores** (ícone de olho)

---

## Variáveis de Ambiente

### Next.js (`.env`)

```env
# URL pública do Live Server (usada pelo browser para Socket.io)
NEXT_PUBLIC_LIVE_URL=https://athlifyr-demo.up.railway.app

# URL interna servidor-a-servidor (Next.js API → Live Server)
LIVE_SERVICE_URL=https://athlifyr-demo.up.railway.app

# Secret partilhado para autenticar chamadas internas
# Deve ser igual ao LIVE_INTERNAL_SECRET no live/.env
LIVE_INTERNAL_SECRET=<hex-256-bit>
```

### Live Server (`live/.env`)

```env
# Porta do servidor
PORT=4000

# URL do Next.js (para callbacks internos)
NEXT_API_URL=https://athlifyr.com

# Secret partilhado com o Next.js
LIVE_INTERNAL_SECRET=<hex-256-bit>  # deve ser igual ao do .env principal

# Redis (opcional — para persistência entre instâncias)
REDIS_URL=redis://...

# JWT secret (para verificar tokens dos atletas)
JWT_SECRET=<secret>
```

> **Importante:** `LIVE_INTERNAL_SECRET` tem de ser **idêntico** nos dois serviços.

---

## Estrutura de Ficheiros

```
live/                                   # Live Server (serviço separado)
├── src/
│   ├── server.ts                       # Setup Fastify + registo de rotas
│   ├── config.ts                       # Configuração via env vars
│   ├── plugins/
│   │   ├── socket.ts                   # Setup Socket.io + tipos
│   │   ├── redis.ts                    # Cliente Redis (opcional)
│   │   └── auth.ts                     # Guard JWT para rotas admin
│   └── modules/
│       └── liverace/
│           ├── liverace.routes.ts      # REST: /live/* e /internal/*
│           ├── liverace.service.ts     # Lógica de negócio + salas em memória
│           ├── liverace.api.ts         # Cliente HTTP para o Next.js
│           ├── liverace.types.ts       # Tipos (estados, Socket.io events, etc.)
│           └── route-engine.ts        # Projeção GPS, checkpoints, anti-cheat

app/
├── api/
│   ├── events/[id]/
│   │   ├── live-control/route.ts       # POST — controlo da corrida (organização)
│   │   └── live-status/route.ts        # GET  — estado + métricas (organização)
│   └── internal/
│       ├── live-config/route.ts        # GET  — config para o Live Server
│       ├── live-status/route.ts        # POST — callback do Live Server
│       ├── live-results/route.ts       # POST — persistir resultados
│       └── live-auth/verify/route.ts   # POST — verificar atleta
└── [locale]/events/[slug]/
    ├── page.tsx                        # Página pública (renderiza LiveRaceSection)
    └── manage/
        └── _components/
            └── tab-liverace.tsx        # Painel de controlo (organização)

components/
├── live-race-section.tsx               # Secção da página pública do evento
├── live-leaderboard.tsx                # Tabela de classificação em tempo real
└── live-event-feed.tsx                 # Feed de checkpoints e chegadas

hooks/
└── use-live-race.ts                    # Hook React — conexão Socket.io + estado
```

---

## Diagrama de Sequência — Mudança de Estado

```
Organização          Next.js             Live Server          Espetadores
     │                  │                     │                    │
     │ POST /live-control│                     │                    │
     │ { command:"start"}│                     │                    │
     │─────────────────►│                     │                    │
     │                  │ UPDATE DB            │                    │
     │                  │ liveStatus=LIVE      │                    │
     │                  │                     │                    │
     │                  │ POST /internal/status│                    │
     │                  │ { eventId, "LIVE" }  │                    │
     │                  │────────────────────►│                    │
     │                  │                     │ room.status=LIVE   │
     │                  │                     │ emit status_changed│
     │                  │                     │────────────────────►
     │                  │                     │                    │ badge LIVE
     │                  │   { ok: true }       │                    │
     │                  │◄────────────────────│                    │
     │  { liveStatus:"LIVE" }                  │                    │
     │◄─────────────────│                     │                    │
     │ badge atualizado  │                     │                    │
```
