"use client";

const TYPE_ICON = { text: "T", shape: "▭", image: "🖼" };

function layerLabel(el) {
  if (el.type === "text") return el.text?.trim() || "Text";
  if (el.type === "shape") return `${el.shapeType} shape`;
  return "Image";
}

export default function LayersPanel({
  elements,
  selectedId,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
}) {
  // Front-most first, matching how layers read in most design tools.
  const sorted = [...elements].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  return (
    <div className="rounded-lg border border-ink-line bg-ink-soft/60 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ivory/50">
        Layers
      </p>

      {sorted.length === 0 && (
        <p className="text-xs text-ivory/40">
          Nothing on the card yet — add text, a shape, or an image.
        </p>
      )}

      <ul className="space-y-1">
        {sorted.map((el, i) => (
          <li
            key={el.id}
            className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs ${
              el.id === selectedId
                ? "bg-gold/15 text-gold-bright"
                : "text-ivory/70 hover:bg-white/5"
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(el.id)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
            >
              <span className="w-4 shrink-0 text-center">{TYPE_ICON[el.type]}</span>
              <span className="truncate">{layerLabel(el)}</span>
            </button>
            <button
              type="button"
              onClick={() => onMoveUp(el.id)}
              disabled={i === 0}
              className="shrink-0 px-1 text-ivory/50 hover:text-ivory disabled:opacity-20"
              aria-label="Move layer up"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(el.id)}
              disabled={i === sorted.length - 1}
              className="shrink-0 px-1 text-ivory/50 hover:text-ivory disabled:opacity-20"
              aria-label="Move layer down"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => onDelete(el.id)}
              className="shrink-0 px-1 text-red-400/70 hover:text-red-400"
              aria-label="Delete layer"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
