"use client";

import { useState } from "react";

const ATTENDING_LABEL = {
  yes: "Attending",
  maybe: "Maybe",
  no: "Not attending",
};

const ATTENDING_STYLE = {
  yes: "bg-gold/15 text-gold-bright border-gold/30",
  maybe: "bg-ivory/10 text-ivory/70 border-ink-line",
  no: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function GuestTable({ initialGuests }) {
  const [guests, setGuests] = useState(initialGuests);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/guests/${id}`, { method: "DELETE" });
      if (res.ok) {
        setGuests((prev) => prev.filter((guest) => guest._id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (guests.length === 0) {
    return (
      <p className="rounded-lg border border-ink-line bg-ink-soft/40 p-6 text-sm text-ivory/50">
        No responses yet. Share your guest link to start collecting RSVPs.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-ink-line">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink-line text-xs uppercase tracking-wide text-ivory/40">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Guests</th>
            <th className="px-4 py-3 font-medium">Message</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr
              key={guest._id}
              className="border-b border-ink-line/60 last:border-0"
            >
              <td className="px-4 py-3 text-ivory">
                {guest.name}
                {guest.phone && (
                  <span className="block text-xs text-ivory/40">
                    {guest.phone}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${ATTENDING_STYLE[guest.attending]}`}
                >
                  {ATTENDING_LABEL[guest.attending]}
                </span>
              </td>
              <td className="px-4 py-3 text-ivory/70">
                {guest.attending === "yes" ? guest.guestCount : "—"}
              </td>
              <td className="max-w-60 truncate px-4 py-3 text-ivory/50">
                {guest.message || "—"}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => handleDelete(guest._id)}
                  disabled={deletingId === guest._id}
                  className="text-xs text-ivory/40 transition-colors hover:text-red-400 disabled:opacity-40"
                >
                  {deletingId === guest._id ? "Removing…" : "Remove"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
