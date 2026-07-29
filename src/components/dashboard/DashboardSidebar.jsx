"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS = {
  grid: (
    <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" />
  ),
  envelope: (
    <path d="M4 6h16v12H4V6Zm0 0 8 6 8-6" fill="none" strokeWidth="1.6" />
  ),
  people: (
    <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c0-3 3-5 6-5s6 2 6 5H2Zm12 0c.4-2.6 2.6-4.6 5-4.9 2 .3 5 2 5 4.9h-10Z" />
  ),
  gear: (
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3-1.8-.6a6.8 6.8 0 0 0-.7-1.7l.9-1.7-1.4-1.4-1.7.9a6.8 6.8 0 0 0-1.7-.7L13 4h-2l-.6 1.8a6.8 6.8 0 0 0-1.7.7l-1.7-.9-1.4 1.4.9 1.7a6.8 6.8 0 0 0-.7 1.7L4 12l1.8.6c.1.6.4 1.2.7 1.7l-.9 1.7 1.4 1.4 1.7-.9c.5.3 1.1.6 1.7.7L12 20h2l.6-1.8c.6-.1 1.2-.4 1.7-.7l1.7.9 1.4-1.4-.9-1.7c.3-.5.6-1.1.7-1.7L20 12Z" />
  ),
  dot: <circle cx="12" cy="12" r="3" />,
};

function Icon({ name, className }) {
  const filled = name !== "envelope";
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
    >
      {ICONS[name] || ICONS.dot}
    </svg>
  );
}

const REAL_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "grid" },
  { href: "/create", label: "Invitation", icon: "envelope" },
  { href: "/dashboard/guests", label: "Guests", icon: "people" },
];

const SOON_ITEMS = [
  { href: "/dashboard/event-profile", label: "Event Profile" },
  { href: "/dashboard/galleries", label: "Galleries" },
  { href: "/dashboard/sign-board", label: "Sign Board" },
  { href: "/dashboard/locations", label: "Locations" },
  { href: "/dashboard/guest-media", label: "Guest Media" },
  { href: "/dashboard/qr-code", label: "QR Code" },
  { href: "/dashboard/event-access", label: "Event Access" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-ink-line bg-ink-soft/40 px-3 py-6 md:flex">
      <Link
        href="/"
        className="mb-6 flex items-center gap-1.5 px-2 text-xs font-medium text-ivory/50 transition-colors hover:text-ivory"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M12.5 15.5 7 10l5.5-5.5L14 6l-4 4 4 4-1.5 1.5Z" />
        </svg>
        Back
      </Link>

      <nav className="flex flex-col gap-0.5">
        {REAL_ITEMS.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-gold/15 font-semibold text-gold-bright"
                  : "text-ivory/65 hover:bg-white/5 hover:text-ivory"
              }`}
            >
              <Icon name={item.icon} className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-ink-line pt-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-ivory/30">
          Coming soon
        </p>
        <nav className="flex flex-col gap-0.5">
          {SOON_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-ivory/35 transition-colors hover:bg-white/5 hover:text-ivory/55"
            >
              {item.label}
              <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-ivory/40">
                Soon
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-ink-line pt-3">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
            pathname.startsWith("/dashboard/settings")
              ? "bg-gold/15 font-semibold text-gold-bright"
              : "text-ivory/65 hover:bg-white/5 hover:text-ivory"
          }`}
        >
          <Icon name="gear" className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
