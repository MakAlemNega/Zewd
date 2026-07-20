import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

// No bcrypt dependency in this project, so we use Node's built-in scrypt KDF
// instead: a random salt per password plus a slow hash, stored as "salt:hash".
export async function hashPassword(plainPassword) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(plainPassword, salt, KEY_LENGTH);
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(plainPassword, storedHash) {
  const [salt, hashHex] = (storedHash || "").split(":");
  if (!salt || !hashHex) return false;

  const derivedKey = await scrypt(plainPassword, salt, KEY_LENGTH);
  const storedBuffer = Buffer.from(hashHex, "hex");

  if (storedBuffer.length !== derivedKey.length) return false;
  return timingSafeEqual(storedBuffer, derivedKey);
}
