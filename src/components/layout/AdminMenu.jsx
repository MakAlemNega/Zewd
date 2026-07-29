"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Account access lives behind a single low-key "Admin" affordance rather
// than a prominent nav CTA — only the couple managing an invitation ever
// needs it; every other visitor (guests, browsers) never should.
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
        {loggedIn ? "Admin" : "Get Started"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-md border border-ink-line bg-ink-soft py-1.5 shadow-xl">
          {loggedIn ? (
            <>
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
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-ivory/80 transition-colors hover:bg-ink hover:text-ivory"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-ivory/80 transition-colors hover:bg-ink hover:text-ivory"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
