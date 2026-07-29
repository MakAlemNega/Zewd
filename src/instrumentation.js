import * as Sentry from "@sentry/nextjs";

// Optional: set SENTRY_DSN in .env to enable error monitoring on the
// server and in Proxy. Left unset, this is a documented no-op.
export async function register() {
  const dsn = process.env.SENTRY_DSN;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn,
      enabled: Boolean(dsn),
      tracesSampleRate: 0.1,
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn,
      enabled: Boolean(dsn),
      tracesSampleRate: 0.1,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
