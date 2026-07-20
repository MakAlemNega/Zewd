import { createHmac, timingSafeEqual } from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error(
    "Missing SESSION_SECRET environment variable. Add it to your .env file.",
  );
}

export const SESSION_COOKIE = "zewd_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function sign(payload) {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
}

// No JWT library installed, so sessions are a small hand-rolled equivalent:
// base64url(payload).base64url(hmac) — enough for a first-party cookie
// session, verified with a timing-safe comparison.
export function createSessionToken(userId) {
  const payload = Buffer.from(
    JSON.stringify({
      uid: String(userId),
      exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.uid || !data.exp || Date.now() > data.exp) return null;
    return { userId: data.uid };
  } catch {
    return null;
  }
}
