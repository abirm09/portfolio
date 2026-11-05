# syntax=docker/dockerfile:1

# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# ==========================================
# Stage 2: Builder
# ==========================================
FROM node:24-alpine AS builder
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build without env vars - they will be injected at runtime
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm run build

# ==========================================
# Stage 3: Runner (Production)
# ==========================================
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
