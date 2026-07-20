import Link from "next/link";

export default function InvitationNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-ink px-6 text-center">
      <p className="font-display text-3xl italic text-ivory">
        This invitation couldn&apos;t be found.
      </p>
      <p className="mt-3 max-w-sm text-sm text-ivory/50">
        The link may be mistyped, or the invitation may have been removed by
        its host.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
      >
        Back to Zewd
      </Link>
    </div>
  );
}
