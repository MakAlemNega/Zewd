export default function ComingSoon({ title, description }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
      <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ivory/40">
        Coming soon
      </span>
      <h1 className="mt-4 font-display text-2xl italic text-ivory">
        {title}
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ivory/50">
        {description}
      </p>
    </div>
  );
}
