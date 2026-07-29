// Every template (and CustomCardRenderer) is built for the ~350x500 card
// size used everywhere else in the app — some with fixed Tailwind text
// sizes, not container-relative units. Rendering them small directly would
// break their internal layout. Instead we render at real size inside a
// fixed box, then scale the whole thing down visually with a CSS
// transform — the classic canvas-thumbnail trick — so it looks like an
// accurate miniature regardless of which renderer produced it.
const NATIVE_WIDTH = 350;
const NATIVE_HEIGHT = 500;

export default function InvitationThumbnail({ width = 120, children }) {
  const scale = width / NATIVE_WIDTH;
  const height = NATIVE_HEIGHT * scale;

  return (
    <div
      style={{ width, height }}
      className="overflow-hidden rounded-md border border-ink-line"
    >
      <div
        style={{
          width: NATIVE_WIDTH,
          height: NATIVE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
