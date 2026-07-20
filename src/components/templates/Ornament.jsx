export function Divider({ className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-8 flex-1 bg-current opacity-30" />
      <span className="h-1.5 w-1.5 rotate-45 bg-current opacity-70" />
      <span className="h-px w-8 flex-1 bg-current opacity-30" />
    </div>
  );
}

export function CornerFlourish({ className = "" }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 44C2 24 4 4 24 2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M9 42C9 27 12 11 27 9"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="24" cy="2" r="1.5" fill="currentColor" />
      <circle cx="2" cy="44" r="1.5" fill="currentColor" />
    </svg>
  );
}
