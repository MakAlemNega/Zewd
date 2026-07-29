// In-memory, fixed-window rate limiter. Good enough for a single server
// instance; it does NOT share state across multiple instances/serverless
// invocations, so swap in a shared store (e.g. Redis) before scaling out
// horizontally.
const buckets = new Map();
let callsSinceSweep = 0;

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function sweep(windowMs) {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.start > windowMs) buckets.delete(key);
  }
}

// key: a short string identifying the endpoint (e.g. "auth:login")
// limit: max requests allowed per window
// windowMs: window size in milliseconds
export function rateLimit(request, { key, limit, windowMs }) {
  const ip = getClientIp(request);
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();

  let bucket = buckets.get(bucketKey);
  if (!bucket || now - bucket.start > windowMs) {
    bucket = { start: now, count: 0 };
    buckets.set(bucketKey, bucket);
  }
  bucket.count += 1;

  // Opportunistic cleanup so the map doesn't grow unbounded over a long
  // server lifetime.
  callsSinceSweep += 1;
  if (callsSinceSweep > 500) {
    callsSinceSweep = 0;
    sweep(windowMs);
  }

  const allowed = bucket.count <= limit;
  const retryAfterMs = allowed ? 0 : bucket.start + windowMs - now;

  return { allowed, retryAfterMs };
}

export function rateLimitResponse(retryAfterMs) {
  return Response.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: { "Retry-After": String(Math.max(1, Math.ceil(retryAfterMs / 1000))) },
    },
  );
}
