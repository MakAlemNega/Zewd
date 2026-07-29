import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // Standalone output is what the Dockerfile (see DEPLOYMENT.md) copies out
  // of .next/ — irrelevant for Vercel, which ignores it.
  output: "standalone",
};

// Safe with no Sentry account at all: without SENTRY_ORG/SENTRY_PROJECT/
// SENTRY_AUTH_TOKEN set, this just skips the source-map upload step.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  // disableLogger's replacement (webpack.treeshake.removeDebugLogging) only
  // applies under webpack; this project builds with Turbopack, where
  // neither option does anything, so there's nothing to configure here.
});
