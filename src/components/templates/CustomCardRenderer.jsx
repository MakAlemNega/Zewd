import {
  getCanvasStyle,
  getElementContainerStyle,
  getShapeStyle,
  getTextStyle,
} from "@/lib/customLayoutStyles";

// Read-only render of a custom (drag-and-drop-designed) invitation card —
// used on the guest page and in previews. The interactive counterpart is
// CanvasEditor.
export default function CustomCardRenderer({ layout }) {
  if (!layout) return null;

  const elements = [...(layout.elements || [])].sort(
    (a, b) => (a.zIndex || 0) - (b.zIndex || 0),
  );

  return (
    <div
      className="h-full w-full overflow-hidden"
      style={getCanvasStyle(layout.background)}
    >
      {elements.map((el) => (
        <div key={el.id} style={getElementContainerStyle(el)}>
          {el.type === "text" ? (
            <p style={getTextStyle(el)}>{el.text}</p>
          ) : el.type === "shape" ? (
            <div style={getShapeStyle(el)} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- user-authored layout, unknown intrinsic size
            <img src={el.src} alt="" className="block h-auto w-full" />
          )}
        </div>
      ))}
    </div>
  );
}
