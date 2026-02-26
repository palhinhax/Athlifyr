# ============================================================================
# Athlifyr Live Server — Dockerfile
# Multi-stage build: build TypeScript → run compiled JS
# ============================================================================

# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript
RUN pnpm build


# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:20-alpine AS runner

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

# Railway injects PORT automatically — map it to LIVE_PORT
# LIVE_PORT is read by config.ts; PORT is injected by Railway
ENV NODE_ENV=production

# Default port (Railway overrides PORT at runtime)
EXPOSE 4000

# Use shell form so the PORT env var from Railway is expanded at runtime
CMD ["sh", "-c", "LIVE_PORT=${PORT:-4000} node dist/index.js"]
