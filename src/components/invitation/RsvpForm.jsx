"use client";

import React, { useState } from "react";

const initialFields = {
  name: "",
  phone: "",
  attending: "yes",
  guestCount: 1,
  message: "",
};

export default function RsvpForm({ invitationId, coupleNames }) {
  const [fields, setFields] = useState(initialFields);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const setField = (name, value) =>
    setFields((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fields.name.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitation: invitationId,
          name: fields.name.trim(),
          phone: fields.phone.trim(),
          attending: fields.attending,
          guestCount: fields.attending === "yes" ? Number(fields.guestCount) || 1 : 0,
          message: fields.message.trim(),
        }),
      });

      if (!res.ok) throw new Error("RSVP failed");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong sending your RSVP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-gold/20 bg-ink-soft/60 p-8 text-center">
        <p className="font-display text-2xl italic text-gold-bright">
          Thank you.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ivory/60">
          Your response has been received{coupleNames ? ` by ${coupleNames}` : ""}
          . We can&apos;t wait to celebrate with you.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg border border-ink-line bg-ink-soft/60 p-6 sm:p-8"
    >
      <div>
        <h2 className="font-display text-xl italic text-ivory">
          Will you be joining us?
        </h2>
        <p className="mt-1 text-xs text-ivory/50">
          Let {coupleNames || "the couple"} know you're coming.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ivory/50">
          Your name
        </label>
        <input
          type="text"
          required
          value={fields.name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="e.g. Bethlehem Girma"
          className="w-full rounded-md border border-ink-line bg-ink px-3 py-2 text-sm text-ivory placeholder:text-ivory/30 outline-none transition-colors focus:border-gold"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ivory/50">
          Phone (optional)
        </label>
        <input
          type="tel"
          value={fields.phone}
          onChange={(e) => setField("phone", e.target.value)}
          placeholder="e.g. 09xx xxx xxx"
          className="w-full rounded-md border border-ink-line bg-ink px-3 py-2 text-sm text-ivory placeholder:text-ivory/30 outline-none transition-colors focus:border-gold"
        />
      </div>

      <div>
        <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ivory/50">
          Will you attend?
        </span>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "yes", label: "Joyfully yes" },
            { value: "maybe", label: "Not sure yet" },
            { value: "no", label: "Can't make it" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setField("attending", option.value)}
              className={`rounded-md border px-2 py-2 text-xs font-medium transition-colors ${
                fields.attending === option.value
                  ? "border-gold bg-gold text-ink"
                  : "border-ink-line text-ivory/60 hover:border-gold/40"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {fields.attending === "yes" && (
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ivory/50">
            Number of guests (including you)
          </label>
          <input
            type="number"
            min={1}
            value={fields.guestCount}
            onChange={(e) => setField("guestCount", e.target.value)}
            className="w-full rounded-md border border-ink-line bg-ink px-3 py-2 text-sm text-ivory outline-none transition-colors focus:border-gold"
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ivory/50">
          Message (optional)
        </label>
        <textarea
          rows={3}
          value={fields.message}
          onChange={(e) => setField("message", e.target.value)}
          placeholder="Leave a wish for the couple..."
          className="w-full resize-none rounded-md border border-ink-line bg-ink px-3 py-2 text-sm text-ivory placeholder:text-ivory/30 outline-none transition-colors focus:border-gold"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-all hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send RSVP"}
      </button>
    </form>
  );
}
