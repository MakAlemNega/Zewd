"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Signed-out visitors get two plain, always-visible buttons (Log in / Get
// Started) — no menu to open. Once signed in, account actions (Dashboard,
// Edit invitation, Log out) collapse behind a single "Admin" dropdown,
// since only the couple managing an invitation ever needs those.
export default function AdminMenu({ loggedIn, userName }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    // Hard navigation so the server-rendered Navbar re-reads the cleared
    // session cookie instead of relying on router cache state.
    window.location.assign("/");
  };

  if (!loggedIn) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm font-medium text-ivory/70 transition-colors hover:text-ivory"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink transition-all hover:bg-gold-bright hover:shadow-[0_0_0_4px_oklch(0.74_0.12_78/0.15)]"
        >
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-ink-line px-3.5 py-1.5 text-xs font-medium text-ivory/60 transition-colors hover:border-gold/40 hover:text-ivory"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
          <path
            fillRule="evenodd"
            d="M10 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7Zm-6 8a6 6 0 1112 0 1 1 0 01-1 1H5a1 1 0 01-1-1Z"
            clipRule="evenodd"
          />
        </svg>
        Admin
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-md border border-ink-line bg-ink-soft py-1.5 shadow-xl">
          {userName && (
            <p className="truncate border-b border-ink-line px-4 py-2 text-xs text-ivory/40">
              Signed in as {userName}
            </p>
          )}
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-ivory/80 transition-colors hover:bg-ink hover:text-ivory"
          >
            Dashboard
          </Link>
          <Link
            href="/create"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-ivory/80 transition-colors hover:bg-ink hover:text-ivory"
          >
            Edit invitation
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-sm text-ivory/60 transition-colors hover:bg-ink hover:text-ivory"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
