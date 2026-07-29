import * as Sentry from "@sentry/nextjs";

// Optional: set NEXT_PUBLIC_SENTRY_DSN in .env to enable error monitoring.
// Left unset, this is a documented no-op — no crash, nothing sent.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  tracesSampleRate: 0.1,
});

// Required by the SDK to instrument App Router navigations.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
