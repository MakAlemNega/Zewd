"use client";

import React, { useEffect, useState } from "react";
import { useInvitation } from "@/context/InvitationContext";

export default function ShareLinkBar() {
  const { invitationData, updateField, slug, status, isSaving } = useInvitation();
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (status !== "ready" || !slug) return null;

  const path = `/i/${slug}`;
  const fullUrl = `${origin}${path}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable (e.g. insecure context); the URL is
      // still visible on screen for a manual copy.
    }
  };

  return (
    <div className="mb-8 rounded-md border border-amber-800/15 bg-amber-50/60 p-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
        Your guest link
      </p>

      {/* Editing either name regenerates the link below (until someone has
          RSVP'd — after that the link is kept stable on purpose). */}
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="text"
          value={invitationData.brideName}
          onChange={(e) => updateField("brideName", e.target.value)}
          placeholder="Bride's name"
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-stone-900 focus:outline-none"
        />
        <input
          type="text"
          value={invitationData.groomName}
          onChange={(e) => updateField("groomName", e.target.value)}
          placeholder="Groom's name"
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-stone-900 focus:outline-none"
        />
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 truncate text-sm text-stone-700">{path}</p>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-xs text-stone-400" aria-live="polite">
            {isSaving ? "Saving…" : "Saved"}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full bg-stone-900 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-stone-700"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </div>
    </div>
  );
}
