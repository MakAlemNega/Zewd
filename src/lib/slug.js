const ADJECTIVE_SAFE_CHARS = "abcdefghijkmnpqrstuvwxyz23456789"; // no 0/o/1/l

function randomSuffix(length = 5) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ADJECTIVE_SAFE_CHARS.charAt(
      Math.floor(Math.random() * ADJECTIVE_SAFE_CHARS.length),
    );
  }
  return out;
}

// e.g. "Selam" + "Dawit" -> "selam-and-dawit-x8k2p"
export function buildInvitationSlug(brideName, groomName) {
  const base = [brideName, groomName]
    .filter(Boolean)
    .join("-and-")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9-\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return `${base || "invitation"}-${randomSuffix()}`;
}
