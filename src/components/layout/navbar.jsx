import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-ink-line/60 bg-ink/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="font-display text-xl tracking-wide text-ivory transition-colors hover:text-gold-bright"
        >
          Zewd
        </Link>

        <div className="hidden items-center gap-8 text-sm text-ivory/70 sm:flex">
          <Link
            href="/#templates"
            className="transition-colors hover:text-ivory"
          >
            Templates
          </Link>
          <Link href="/#how" className="transition-colors hover:text-ivory">
            How it works
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="transition-colors hover:text-ivory"
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login"
              className="hidden text-sm text-ivory/70 transition-colors hover:text-ivory sm:inline"
            >
              Log in
            </Link>
          )}
          <Link
            href={user ? "/create" : "/signup"}
            className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink transition-all hover:bg-gold-bright hover:shadow-[0_0_0_4px_oklch(0.74_0.12_78/0.15)]"
          >
            {user ? "Create Invitation" : "Get Started"}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
