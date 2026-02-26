# Athlifyr Live Server

Real-time layer for Athlifyr built with **Fastify**, **Socket.io**, and **Redis**. It handles live chat (REST + WebSocket) and presence/typing indicators, while **all database operations are delegated to the Next.js API**.

## ✅ What this service does

- Hosts a Fastify HTTP server for health checks and chat REST routes.
- Hosts a Socket.io server for real-time chat events.
- Uses Redis for ephemeral state (typing indicators, online presence).
- Proxies all persistent data operations to the Next.js API.

## 📦 Tech stack

- **Fastify 5** (HTTP API)
- **Socket.io 4** (real-time)
- **Redis** (ephemeral data)
- **TypeScript**

## 🚀 Getting started

### 1) Install dependencies

```powershell
pnpm install
```

### 2) Configure environment

Copy the example file and adjust values as needed:

```powershell
Copy-Item .env.example .env
```

Required variables (see `.env.example`):

- `LIVE_PORT` – Port for Fastify
- `LIVE_HOST` – Bind address
- `NODE_ENV` – `development` | `production` | `test`
- `LIVE_CORS_ORIGINS` – Comma-separated list of allowed origins
- `REDIS_URL` – Redis connection URL
- `NEXTAUTH_SECRET` / `JWT_SECRET` – Must match the Next.js app
- `NEXT_API_URL` – Base URL for the Next.js API

> **Note**: Redis is optional. If Redis is unavailable, the server still runs but presence and typing indicators won’t work.

### 3) Run the server

Development (auto-reload):

```powershell
pnpm dev
```

Production build:

```powershell
pnpm build
pnpm start
```

## 🧭 Service overview

```
src/
  config.ts                # Environment configuration
  index.ts                 # Entry point (boot + graceful shutdown)
  server.ts                # Fastify setup
  modules/
    chat/
      chat.routes.ts       # REST endpoints (proxy to Next.js API)
      chat.handlers.ts     # Socket.io handlers
      chat.service.ts      # API client wrapper (Next.js)
  plugins/
    api-client.ts          # Next.js API client
    auth.ts                # JWT verification for HTTP + sockets
    redis.ts               # Redis helpers (presence/typing)
    socket.ts              # Socket.io server setup
  types/
    index.ts               # Shared socket/REST types
```

## 🌐 HTTP endpoints

All routes require a valid **Bearer token** in the `Authorization` header.

### Health

- `GET /health` – Basic health check

### Chat REST API (`/api/chat`)

- `GET /conversations`
- `POST /conversations` – body: `{ otherUserId }`
- `GET /conversations/:id/messages` – query: `cursor`, `limit`
- `POST /conversations/:id/messages` – body: `{ content }`
- `POST /conversations/:id/seen`
- `POST /conversations/:id/hide`
- `GET /unread`

## 🔌 Socket.io events

### Authentication

- Provide the JWT token in the Socket.io handshake:
  - `auth: { token: "<JWT>" }` **or**
  - `Authorization: Bearer <JWT>` header

If valid, the server emits:

- `connection:authenticated` → `{ userId }`

### Client → Server

- `chat:join` → `conversationId`
- `chat:leave` → `conversationId`
- `chat:message` → `{ conversationId, content }`
- `chat:typing` → `{ conversationId, isTyping }`
- `chat:seen` → `conversationId`

### Server → Client

- `chat:message` → `{ id, conversationId, senderId, senderName, senderImage, content, createdAt }`
- `chat:typing` → `{ conversationId, userId, userName, isTyping }`
- `chat:seen` → `{ conversationId, userId, lastSeenAt }`
- `chat:user_online` → `{ userId }`
- `chat:user_offline` → `{ userId }`
- `chat:error` → `{ message, code? }`

## 🔐 Auth and security notes

- JWT validation is shared with the Next.js app.
- **Refresh tokens are rejected** for both HTTP and WebSocket usage.
- All requests to the Next.js API include:
  - `Authorization: Bearer <JWT>`
  - `X-Live-Server: true`

## 🧪 Scripts

- `pnpm dev` – Start in watch mode
- `pnpm build` – Compile TypeScript to `dist/`
- `pnpm start` – Run compiled server
- `pnpm typecheck` – TypeScript checks only

## 🛠️ Troubleshooting

- **401 Unauthorized**: Ensure you’re sending a valid access token (not refresh).
- **CORS errors**: Add your frontend URL to `LIVE_CORS_ORIGINS`.
- **Redis errors**: Verify `REDIS_URL`; server will still run, but presence/typing will be disabled.
- **Next.js API errors**: Confirm `NEXT_API_URL` is reachable and uses the same JWT secret.

## 📌 Roadmap

- LiveRace module (real-time event streaming)
- Notifications module (push + real-time delivery)
