# Multi-stage build targeting Next.js's `output: "standalone"` (see
# next.config.mjs) — the final image only carries the traced runtime files,
# not the full node_modules tree or source.

FROM node:22-alpine AS base

# ---- deps -------------------------------------------------------------
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder ------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# next build imports every route module to collect its metadata (even
# routes that render fully dynamically at runtime), which runs the
# presence checks in src/lib/mongodb.js and src/lib/session.js. These
# placeholders only need to be non-empty to satisfy that — they're never
# read for real work, and the real values you pass to `docker run` (see
# DEPLOYMENT.md) are what the running container actually uses.
ENV MONGODB_URI=mongodb://build-placeholder/build
ENV SESSION_SECRET=build-placeholder-not-used-at-runtime

RUN npm run build

# ---- runner ------------------------------------------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
