const MAX_ELEMENTS = 40;
const MAX_TEXT_LENGTH = 500;
const MAX_URL_LENGTH = 600;

function isFiniteNumber(n) {
  return typeof n === "number" && Number.isFinite(n);
}

// Best-effort shape check for a Mixed field — not full schema validation,
// just enough to stop obviously malformed or abusive payloads (huge text
// blobs, absurd element counts) from ever reaching the database.
export function sanitizeCustomLayout(input) {
  if (!input || typeof input !== "object") return null;

  const background =
    input.background &&
    typeof input.background === "object" &&
    (input.background.type === "color" || input.background.type === "image") &&
    typeof input.background.value === "string"
      ? {
          type: input.background.type,
          value: input.background.value.slice(0, MAX_URL_LENGTH),
        }
      : { type: "color", value: "#141210" };

  const rawElements = Array.isArray(input.elements) ? input.elements : [];

  const elements = rawElements.slice(0, MAX_ELEMENTS).flatMap((el) => {
    if (!el || typeof el !== "object") return [];
    if (!["text", "image", "shape"].includes(el.type)) return [];
    if (!isFiniteNumber(el.x) || !isFiniteNumber(el.y) || !isFiniteNumber(el.width)) {
      return [];
    }

    const base = {
      id: typeof el.id === "string" ? el.id.slice(0, 64) : crypto.randomUUID(),
      type: el.type,
      x: Math.min(100, Math.max(0, el.x)),
      y: Math.min(100, Math.max(0, el.y)),
      width: Math.min(100, Math.max(2, el.width)),
      zIndex: isFiniteNumber(el.zIndex) ? Math.round(el.zIndex) : 0,
    };

    if (el.type === "text") {
      return [
        {
          ...base,
          text: typeof el.text === "string" ? el.text.slice(0, MAX_TEXT_LENGTH) : "",
          fontFamily: el.fontFamily === "sans" ? "sans" : "display",
          fontSize: isFiniteNumber(el.fontSize) ? Math.min(20, Math.max(1.5, el.fontSize)) : 5,
          color: typeof el.color === "string" ? el.color.slice(0, 20) : "#e9c46a",
          fontWeight: el.fontWeight === "bold" ? "bold" : "normal",
          italic: Boolean(el.italic),
          align: ["left", "center", "right"].includes(el.align) ? el.align : "center",
        },
      ];
    }

    if (el.type === "shape") {
      if (!isFiniteNumber(el.height)) return [];
      return [
        {
          ...base,
          height: Math.min(100, Math.max(0.5, el.height)),
          shapeType: ["rectangle", "circle", "line"].includes(el.shapeType)
            ? el.shapeType
            : "rectangle",
          color: typeof el.color === "string" ? el.color.slice(0, 20) : "#e9c46a",
        },
      ];
    }

    return [
      {
        ...base,
        src: typeof el.src === "string" ? el.src.slice(0, MAX_URL_LENGTH) : "",
      },
    ];
  });

  return { background, elements };
}
