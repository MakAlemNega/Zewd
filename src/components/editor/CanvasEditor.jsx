"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCanvasStyle } from "@/lib/customLayoutStyles";
import CanvasElement from "./CanvasElement";
import ElementInspector from "./ElementInspector";
import LayersPanel from "./LayersPanel";

const DEFAULT_LAYOUT = {
  background: { type: "color", value: "#14100d" },
  elements: [],
};

const SAVE_DEBOUNCE_MS = 800;

const RAIL_ICONS = {
  text: <path d="M4 5h16M12 5v14" strokeWidth="2" strokeLinecap="round" />,
  shapes: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <circle cx="16.5" cy="16.5" r="4.5" />
    </>
  ),
  upload: (
    <path
      d="M12 16V4m0 0 4 4m-4-4-4 4M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  layers: (
    <path
      d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

function RailButton({ icon, label, onClick, active, disabled }) {
  const isStroke = icon === "text" || icon === "upload" || icon === "layers";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2.5 text-[10px] font-medium transition-colors disabled:opacity-40 ${
        active
          ? "bg-gold/15 text-gold-bright"
          : "text-ivory/60 hover:bg-white/5 hover:text-ivory"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill={isStroke ? "none" : "currentColor"}
        stroke={isStroke ? "currentColor" : "none"}
      >
        {RAIL_ICONS[icon]}
      </svg>
      {label}
    </button>
  );
}

function nextZIndex(elements, direction) {
  if (elements.length === 0) return 0;
  const zs = elements.map((el) => el.zIndex || 0);
  return direction === "front" ? Math.max(...zs) + 1 : Math.min(...zs) - 1;
}

export default function CanvasEditor({ invitationId, initialLayout, onSaved }) {
  const [layout, setLayout] = useState(initialLayout || DEFAULT_LAYOUT);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTool, setActiveTool] = useState(null); // null | "layers"
  const [shapesOpen, setShapesOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const canvasRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const backgroundFileInputRef = useRef(null);

  const selectedElement = layout.elements.find((el) => el.id === selectedId) || null;

  const flushSave = useCallback(async (layoutToSave) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/invitations/${invitationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designMode: "custom", customLayout: layoutToSave }),
      });
      if (res.ok) onSaved?.(layoutToSave);
    } catch (err) {
      console.error("Failed to save custom layout", err);
    } finally {
      setIsSaving(false);
    }
    // onSaved intentionally omitted: it's a stable syncField callback from
    // context in practice, and including it would force flushSave (and
    // every debounce timer built on it) to be recreated on each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitationId]);

  const scheduleSave = useCallback(
    (nextLayout) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => flushSave(nextLayout), SAVE_DEBOUNCE_MS);
    },
    [flushSave],
  );

  // Best-effort flush on unmount / tab close, same pattern as InvitationContext.
  useEffect(() => {
    function flushBeacon() {
      if (!saveTimeoutRef.current) return;
      clearTimeout(saveTimeoutRef.current);
      if (typeof navigator === "undefined" || !navigator.sendBeacon) return;
      const blob = new Blob(
        [JSON.stringify({ designMode: "custom", customLayout: layout })],
        { type: "application/json" },
      );
      navigator.sendBeacon(`/api/invitations/${invitationId}`, blob);
    }
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flushBeacon();
    });
    window.addEventListener("pagehide", flushBeacon);
    return () => window.removeEventListener("pagehide", flushBeacon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, invitationId]);

  const updateLayout = (updater) => {
    setLayout((prev) => {
      const next = updater(prev);
      scheduleSave(next);
      return next;
    });
  };

  const handleMove = (id, { x, y }) => {
    updateLayout((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, x, y } : el)),
    }));
  };

  const handleElementChange = (id, patch) => {
    updateLayout((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, ...patch } : el)),
    }));
  };

  const handleDelete = (id) => {
    setSelectedId(null);
    updateLayout((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
    }));
  };

  const handleBringToFront = (id) => {
    updateLayout((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === id ? { ...el, zIndex: nextZIndex(prev.elements, "front") } : el,
      ),
    }));
  };

  const handleSendToBack = (id) => {
    updateLayout((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === id ? { ...el, zIndex: nextZIndex(prev.elements, "back") } : el,
      ),
    }));
  };

  // Swaps zIndex with the neighbor in front-to-back visual order — used by
  // the Layers panel's up/down arrows.
  const moveLayer = (id, direction) => {
    updateLayout((prev) => {
      const sorted = [...prev.elements].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
      const idx = sorted.findIndex((el) => el.id === id);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (idx === -1 || swapIdx < 0 || swapIdx >= sorted.length) return prev;

      const a = sorted[idx];
      const b = sorted[swapIdx];
      const aZ = a.zIndex || 0;
      const bZ = b.zIndex || 0;

      return {
        ...prev,
        elements: prev.elements.map((el) => {
          if (el.id === a.id) return { ...el, zIndex: bZ };
          if (el.id === b.id) return { ...el, zIndex: aZ };
          return el;
        }),
      };
    });
  };

  const selectAndShowInspector = (id) => {
    setSelectedId(id);
    setActiveTool(null);
  };

  const addText = () => {
    const id = crypto.randomUUID();
    updateLayout((prev) => ({
      ...prev,
      elements: [
        ...prev.elements,
        {
          id,
          type: "text",
          x: 20,
          y: 42,
          width: 60,
          zIndex: nextZIndex(prev.elements, "front"),
          text: "Double-click to edit",
          fontFamily: "display",
          fontSize: 6,
          color: "#f5f0e6",
          fontWeight: "normal",
          italic: false,
          align: "center",
        },
      ],
    }));
    selectAndShowInspector(id);
  };

  const addShape = (shapeType) => {
    const id = crypto.randomUUID();
    updateLayout((prev) => ({
      ...prev,
      elements: [
        ...prev.elements,
        {
          id,
          type: "shape",
          shapeType,
          x: 30,
          y: 35,
          width: shapeType === "line" ? 40 : 30,
          height: shapeType === "line" ? 1 : 20,
          color: "#e9c46a",
          zIndex: nextZIndex(prev.elements, "front"),
        },
      ],
    }));
    setShapesOpen(false);
    selectAndShowInspector(id);
  };

  const addImage = () => fileInputRef.current?.click();

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Upload failed.");
        return;
      }

      const id = crypto.randomUUID();
      updateLayout((prev) => ({
        ...prev,
        elements: [
          ...prev.elements,
          {
            id,
            type: "image",
            x: 30,
            y: 30,
            width: 40,
            zIndex: nextZIndex(prev.elements, "front"),
            src: data.url,
          },
        ],
      }));
      selectAndShowInspector(id);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const setBackgroundColor = (value) => {
    updateLayout((prev) => ({ ...prev, background: { type: "color", value } }));
  };

  const uploadBackgroundImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Upload failed.");
        return;
      }
      updateLayout((prev) => ({
        ...prev,
        background: { type: "image", value: data.url },
      }));
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Left tool rail */}
      <div className="flex shrink-0 flex-row gap-1 border-b border-ink-line pb-3 lg:w-20 lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-3">
        <RailButton icon="text" label="Text" onClick={addText} />

        <div className="relative">
          <RailButton
            icon="shapes"
            label="Shapes"
            active={shapesOpen}
            onClick={() => setShapesOpen((v) => !v)}
          />
          {shapesOpen && (
            <div className="absolute left-0 top-full z-20 mt-1 flex gap-1 rounded-md border border-ink-line bg-ink-soft p-2 shadow-xl lg:left-full lg:top-0 lg:ml-2 lg:mt-0">
              <button
                type="button"
                onClick={() => addShape("rectangle")}
                className="rounded border border-ink-line px-2.5 py-1.5 text-xs text-ivory/70 hover:border-gold/40 hover:text-ivory"
              >
                ▭
              </button>
              <button
                type="button"
                onClick={() => addShape("circle")}
                className="rounded border border-ink-line px-2.5 py-1.5 text-xs text-ivory/70 hover:border-gold/40 hover:text-ivory"
              >
                ◯
              </button>
              <button
                type="button"
                onClick={() => addShape("line")}
                className="rounded border border-ink-line px-2.5 py-1.5 text-xs text-ivory/70 hover:border-gold/40 hover:text-ivory"
              >
                ─
              </button>
            </div>
          )}
        </div>

        <RailButton icon="upload" label="Upload" onClick={addImage} disabled={uploading} />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelected}
        />

        <RailButton
          icon="layers"
          label="Layers"
          active={activeTool === "layers"}
          onClick={() => setActiveTool((t) => (t === "layers" ? null : "layers"))}
        />
      </div>

      <div className="min-w-0 flex-1">
        {/* Canvas-wide settings */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-ivory/60">
            Background
            <input
              type="color"
              value={
                layout.background?.type === "color" ? layout.background.value : "#14100d"
              }
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="h-6 w-6 cursor-pointer rounded border border-white/20 bg-transparent"
            />
          </label>
          <label className="cursor-pointer text-xs font-semibold text-ivory/60 hover:text-ivory">
            Upload background image
            <input
              ref={backgroundFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadBackgroundImage}
            />
          </label>

          <span className="ml-auto text-xs text-ivory/40" aria-live="polite">
            {isSaving ? "Saving…" : "Saved"}
          </span>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          onPointerDown={() => setSelectedId(null)}
          className="mx-auto aspect-[3.5/5] w-full max-w-sm overflow-hidden rounded-lg border border-ink-line shadow-2xl shadow-black/40"
          style={getCanvasStyle(layout.background)}
        >
          {[...layout.elements]
            .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
            .map((el) => (
              <CanvasElement
                key={el.id}
                element={el}
                selected={el.id === selectedId}
                canvasRef={canvasRef}
                onSelect={selectAndShowInspector}
                onMove={handleMove}
              />
            ))}

          {layout.elements.length === 0 && (
            <p className="flex h-full items-center justify-center px-8 text-center text-sm text-ivory/30">
              Add text, a shape, or an image to start designing your card.
            </p>
          )}
        </div>
      </div>

      <div className="w-full shrink-0 lg:w-72">
        {activeTool === "layers" ? (
          <LayersPanel
            elements={layout.elements}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onMoveUp={(id) => moveLayer(id, "up")}
            onMoveDown={(id) => moveLayer(id, "down")}
            onDelete={handleDelete}
          />
        ) : (
          <ElementInspector
            element={selectedElement}
            onChange={handleElementChange}
            onDelete={handleDelete}
            onBringToFront={handleBringToFront}
            onSendToBack={handleSendToBack}
          />
        )}
      </div>
    </div>
  );
}
