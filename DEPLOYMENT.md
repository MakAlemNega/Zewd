# Deploying Zewd

Two paths are documented here: **Vercel** (serverless, least setup) and
**Docker/VPS** (self-hosted, persistent server). Pick one.

Either way, start from [.env.example](.env.example) — copy it to `.env`,
fill in the required values, and add whichever optional integrations
you're ready to use (Resend for emails, Vercel Blob for photo uploads,
Sentry for error monitoring). Every optional one degrades gracefully when
left blank: the app logs a warning and keeps working instead of crashing.

## A build-time gotcha worth knowing about

`next build` imports every route module to collect its metadata — even
though every route in this app renders fully dynamically at runtime (a
side effect of `Navbar` reading the session cookie via `cookies()`, which
opts the whole tree out of static generation). That import runs the
top-level presence checks in `src/lib/mongodb.js` and `src/lib/session.js`,
so **`MONGODB_URI` and `SESSION_SECRET` must exist in the build
environment**, not just at runtime — confirmed locally: the build fails
outright without them, even though no route is ever actually prerendered.

- **Vercel**: env vars set in the project dashboard are already available
  at build time automatically. Nothing extra to do.
- **Docker**: the Dockerfile sets build-time placeholder values for exactly
  this reason (see the comment in it) — they only need to be non-empty to
  satisfy the check, and are never read for anything real. The real values
  are supplied at `docker run` time instead, and never reach the built
  image.

## Option 1: Vercel

1. Push this repo to GitHub/GitLab/Bitbucket and import it in the [Vercel
   dashboard](https://vercel.com/new).
2. Under Project Settings → Environment Variables, add everything from
   `.env.example` that you're using (`MONGODB_URI` and `SESSION_SECRET` at
   minimum). Use a real [MongoDB Atlas](https://www.mongodb.com/atlas)
   connection string — Vercel's serverless functions can't reach a
   `localhost` database.
3. If you want cover photo uploads, add the Vercel Blob integration from
   your project's Storage tab — it fills in `BLOB_READ_WRITE_TOKEN`
   automatically.
4. Deploy. Vercel builds with `next build` and runs it serverless; the
   `output: "standalone"` setting in `next.config.mjs` is simply ignored
   here (it's a Docker-only concern).

## Option 2: Docker / self-hosted VPS

Ships with a [Dockerfile](Dockerfile) (multi-stage, targets the standalone
output) and a [docker-compose.yml](docker-compose.yml) that also runs a
local MongoDB — useful if you'd rather not depend on Atlas.

1. Copy `.env.example` to `.env` and fill in real values. At minimum:
   ```
   SESSION_SECRET=<output of: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
   ```
   (`MONGODB_URI` is pre-wired to the compose-managed `mongo` service —
   leave the compose file's default unless you're pointing at Atlas
   instead.)
2. Build and start both containers:
   ```bash
   docker compose up --build -d
   ```
3. The app is now on port 3000. Put a reverse proxy (nginx, Caddy) in front
   of it for TLS — Next.js's own docs recommend this for any self-hosted
   deployment, and it's not something this compose file sets up for you.

### Without Compose (bringing your own MongoDB, e.g. Atlas)

```bash
docker build -t zewd .
docker run -p 3000:3000 \
  -e MONGODB_URI="<your Atlas connection string>" \
  -e SESSION_SECRET="<your generated secret>" \
  -e RESEND_API_KEY="<optional>" \
  -e BLOB_READ_WRITE_TOKEN="<optional>" \
  -e SENTRY_DSN="<optional>" \
  zewd
```

### Known limitation carried over from earlier hardening work

The rate limiter (`src/lib/rateLimit.js`) is in-memory — it only works
correctly with a **single** running instance. If you scale the Docker
deployment to multiple replicas behind a load balancer, each instance
tracks its own limits independently, so the effective limit multiplies by
instance count. Swap in a shared store (Redis) before scaling horizontally.

## Verifying what I could actually test

I don't have a running Docker daemon in this environment, so the
Dockerfile itself hasn't been build-tested end-to-end. What I *did*
verify locally before writing it:

- `next build` succeeds with `output: "standalone"` and produces
  `.next/standalone/server.js` as expected.
- The build-time placeholder trick for `MONGODB_URI`/`SESSION_SECRET`
  actually works — confirmed the build fails without them present at all,
  and succeeds with dummy non-empty values.

Please do a real `docker compose up --build` before trusting this in
production.
