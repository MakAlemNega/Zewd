"use client";

const SWATCHES = ["#e9c46a", "#f5f0e6", "#1a1714", "#c98a4b", "#8b95a1"];

export default function ElementInspector({
  element,
  onChange,
  onDelete,
  onBringToFront,
  onSendToBack,
}) {
  if (!element) {
    return (
      <div className="rounded-lg border border-ink-line bg-ink-soft/40 p-5 text-center text-sm text-ivory/40">
        Select an element on the card to edit it, or add a new one above.
      </div>
    );
  }

  const update = (patch) => onChange(element.id, patch);

  return (
    <div className="space-y-5 rounded-lg border border-ink-line bg-ink-soft/60 p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ivory/50">
          {element.type === "text" ? "Text" : element.type === "shape" ? "Shape" : "Image"}
        </p>
        <button
          type="button"
          onClick={() => onDelete(element.id)}
          className="text-xs text-red-400/80 hover:text-red-400"
        >
          Delete
        </button>
      </div>

      {element.type === "text" && (
        <>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-wide text-ivory/40">
              Content
            </label>
            <textarea
              rows={3}
              value={element.text}
              onChange={(e) => update({ text: e.target.value })}
              className="w-full resize-none rounded-md border border-ink-line bg-ink px-3 py-2 text-sm text-ivory outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-wide text-ivory/40">
                Font
              </label>
              <select
                value={element.fontFamily}
                onChange={(e) => update({ fontFamily: e.target.value })}
                className="w-full rounded-md border border-ink-line bg-ink px-2 py-1.5 text-xs text-ivory outline-none focus:border-gold"
              >
                <option value="display">Display (serif)</option>
                <option value="sans">Sans</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-wide text-ivory/40">
                Size
              </label>
              <input
                type="range"
                min={1.5}
                max={16}
                step={0.5}
                value={element.fontSize}
                onChange={(e) => update({ fontSize: Number(e.target.value) })}
                className="w-full accent-gold"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                update({ fontWeight: element.fontWeight === "bold" ? "normal" : "bold" })
              }
              className={`rounded-md border px-2.5 py-1 text-xs font-bold ${
                element.fontWeight === "bold"
                  ? "border-gold bg-gold text-ink"
                  : "border-ink-line text-ivory/60"
              }`}
            >
              B
            </button>
            <button
              type="button"
              onClick={() => update({ italic: !element.italic })}
              className={`rounded-md border px-2.5 py-1 text-xs italic ${
                element.italic
                  ? "border-gold bg-gold text-ink"
                  : "border-ink-line text-ivory/60"
              }`}
            >
              I
            </button>
            {["left", "center", "right"].map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => update({ align })}
                className={`rounded-md border px-2.5 py-1 text-xs ${
                  element.align === align
                    ? "border-gold bg-gold text-ink"
                    : "border-ink-line text-ivory/60"
                }`}
              >
                {align === "left" ? "⟵" : align === "center" ? "↔" : "⟶"}
              </button>
            ))}
          </div>
        </>
      )}

      {element.type === "shape" && (
        <div>
          <label className="mb-1 block text-[11px] uppercase tracking-wide text-ivory/40">
            Shape
          </label>
          <div className="flex gap-2">
            {["rectangle", "circle", "line"].map((shapeType) => (
              <button
                key={shapeType}
                type="button"
                onClick={() => update({ shapeType })}
                className={`flex-1 rounded-md border px-2 py-1.5 text-xs capitalize ${
                  element.shapeType === shapeType
                    ? "border-gold bg-gold text-ink"
                    : "border-ink-line text-ivory/60"
                }`}
              >
                {shapeType}
              </button>
            ))}
          </div>
        </div>
      )}

      {(element.type === "text" || element.type === "shape") && (
        <div>
          <label className="mb-1 block text-[11px] uppercase tracking-wide text-ivory/40">
            Color
          </label>
          <div className="flex items-center gap-2">
            {SWATCHES.map((swatch) => (
              <button
                key={swatch}
                type="button"
                onClick={() => update({ color: swatch })}
                style={{ backgroundColor: swatch }}
                className={`h-6 w-6 rounded-full border ${
                  element.color === swatch ? "border-ivory" : "border-white/20"
                }`}
                aria-label={swatch}
              />
            ))}
            <input
              type="color"
              value={element.color}
              onChange={(e) => update({ color: e.target.value })}
              className="h-6 w-6 cursor-pointer rounded border border-white/20 bg-transparent"
            />
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block text-[11px] uppercase tracking-wide text-ivory/40">
          Width
        </label>
        <input
          type="range"
          min={5}
          max={100}
          value={element.width}
          onChange={(e) => update({ width: Number(e.target.value) })}
          className="w-full accent-gold"
        />
      </div>

      {element.type === "shape" && (
        <div>
          <label className="mb-1 block text-[11px] uppercase tracking-wide text-ivory/40">
            Height
          </label>
          <input
            type="range"
            min={0.5}
            max={100}
            value={element.height}
            onChange={(e) => update({ height: Number(e.target.value) })}
            className="w-full accent-gold"
          />
        </div>
      )}

      <div className="flex gap-2 border-t border-ink-line pt-4">
        <button
          type="button"
          onClick={() => onBringToFront(element.id)}
          className="flex-1 rounded-md border border-ink-line px-2 py-1.5 text-xs text-ivory/70 hover:border-gold/40 hover:text-ivory"
        >
          Bring to front
        </button>
        <button
          type="button"
          onClick={() => onSendToBack(element.id)}
          className="flex-1 rounded-md border border-ink-line px-2 py-1.5 text-xs text-ivory/70 hover:border-gold/40 hover:text-ivory"
        >
          Send to back
        </button>
      </div>
    </div>
  );
}
