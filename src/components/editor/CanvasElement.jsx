"use client";

import { useRef } from "react";
import {
  getElementContainerStyle,
  getShapeStyle,
  getTextStyle,
} from "@/lib/customLayoutStyles";

// A single draggable element on the canvas. Dragging is done with raw
// pointer events (no drag-and-drop library) — position is tracked in
// percentages relative to the canvas so it stays correct at any render
// size (editor, small preview, guest page).
export default function CanvasElement({
  element,
  selected,
  canvasRef,
  onSelect,
  onMove,
}) {
  const dragState = useRef(null);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    onSelect(element.id);

    const canvas = canvasRef.current;
    if (!canvas) return;

    dragState.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: element.x,
      startY: element.y,
      canvasRect: canvas.getBoundingClientRect(),
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const dxPct = ((e.clientX - drag.startClientX) / drag.canvasRect.width) * 100;
    const dyPct = ((e.clientY - drag.startClientY) / drag.canvasRect.height) * 100;

    onMove(element.id, {
      x: Math.min(98, Math.max(0, drag.startX + dxPct)),
      y: Math.min(98, Math.max(0, drag.startY + dyPct)),
    });
  };

  const handlePointerUp = (e) => {
    if (dragState.current?.pointerId === e.pointerId) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      dragState.current = null;
    }
  };

  return (
    <div
      style={getElementContainerStyle(element)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`cursor-grab select-none active:cursor-grabbing ${
        selected ? "outline outline-2 outline-offset-2 outline-gold" : ""
      }`}
    >
      {element.type === "text" ? (
        <p style={getTextStyle(element)}>{element.text || " "}</p>
      ) : element.type === "shape" ? (
        <div style={getShapeStyle(element)} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- user-authored layout, unknown intrinsic size
        <img
          src={element.src}
          alt=""
          draggable={false}
          className="block h-auto w-full"
        />
      )}
    </div>
  );
}
