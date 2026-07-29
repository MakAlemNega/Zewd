"use client";

import { useState } from "react";

export default function PublishToggle({ invitationId, initialPublished }) {
  const [published, setPublished] = useState(initialPublished);
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/invitations/${invitationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      if (res.ok) setPublished((prev) => !prev);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span
        id="publish-section"
        className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${
          published
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : "border-amber-500/30 bg-amber-500/10 text-amber-400"
        }`}
      >
        {published ? "Published" : "Draft"}
      </span>
      <button
        type="button"
        onClick={toggle}
        disabled={saving}
        className={
          published
            ? "rounded-full border border-ink-line px-4 py-2 text-xs font-semibold text-ivory/70 transition-colors hover:border-red-400/40 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-60"
            : "rounded-full bg-gold px-4 py-2 text-xs font-semibold text-ink transition-all hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {saving ? "…" : published ? "Unpublish" : "Publish"}
      </button>
    </div>
  );
}
