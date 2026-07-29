// Shared between CustomCardRenderer (read-only: guest page, previews) and
// the CanvasEditor (interactive) so the positioning/typography math only
// lives in one place.

export function getCanvasStyle(background) {
  const base = { position: "relative", containerType: "inline-size" };
  if (background?.type === "image" && background.value) {
    return {
      ...base,
      backgroundImage: `url(${background.value})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { ...base, backgroundColor: background?.value || "#141210" };
}

export function getElementContainerStyle(el) {
  const style = {
    position: "absolute",
    left: `${el.x}%`,
    top: `${el.y}%`,
    width: `${el.width}%`,
    zIndex: el.zIndex || 0,
    touchAction: "none",
  };
  // Text and image elements size their own height (content/aspect ratio);
  // shapes have no intrinsic size, so they need an explicit one.
  if (el.type === "shape") style.height = `${el.height}%`;
  return style;
}

export function getShapeStyle(el) {
  return {
    width: "100%",
    height: "100%",
    backgroundColor: el.color,
    borderRadius:
      el.shapeType === "circle" ? "9999px" : el.shapeType === "line" ? "9999px" : "6px",
  };
}

// fontSize is stored as a percentage of canvas width and rendered with the
// `cqw` (container query width) unit, so text scales correctly whether the
// card is shown at editor size, a small dashboard preview, or full-size on
// the guest page — no JS resize observers needed.
export function getTextStyle(el) {
  return {
    fontFamily:
      el.fontFamily === "sans" ? "var(--font-sans)" : "var(--font-display)",
    fontSize: `${el.fontSize}cqw`,
    color: el.color,
    fontWeight: el.fontWeight === "bold" ? 700 : 400,
    fontStyle: el.italic ? "italic" : "normal",
    textAlign: el.align || "center",
    lineHeight: 1.25,
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
  };
}
