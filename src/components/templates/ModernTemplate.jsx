"use client";

import React from "react";

export default function ModernTemplate({ data }) {
  const formatDate = (dateString) => {
    if (!dateString) return "00.00.00";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}.${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}.${date.getFullYear()}`;
  };

  return (
    <div className="relative flex h-full w-full select-none flex-col justify-between bg-ink p-6 text-left text-ivory sm:p-8">
      {/* Structural frame with corner ticks */}
      <div className="pointer-events-none absolute inset-4 border border-ink-line" />
      <div className="pointer-events-none absolute left-4 top-4 h-2 w-2 border-l border-t border-gold" />
      <div className="pointer-events-none absolute right-4 top-4 h-2 w-2 border-r border-t border-gold" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-2 w-2 border-b border-l border-gold" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-2 w-2 border-b border-r border-gold" />

      {/* Top Banner Tag */}
      <div className="z-10 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-ivory/45">
        <span className="h-1 w-1 rounded-full bg-gold" />
        Celebration
      </div>

      {/* Main Couple Names */}
      <div className="z-10 my-auto space-y-1">
        <h1 className="font-display text-4xl font-normal capitalize italic tracking-tight text-ivory sm:text-5xl">
          {data.brideName || "Bride"}
        </h1>
        <div className="pl-1 text-lg font-light text-gold/70">&</div>
        <h1 className="font-display text-4xl font-normal capitalize italic tracking-tight text-ivory sm:text-5xl">
          {data.groomName || "Groom"}
        </h1>
      </div>

      {/* Logistics Stack */}
      <div className="z-10 space-y-3.5 border-t border-ink-line pt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ivory/45">
            Date
          </span>
          <span className="text-lg font-semibold tracking-wider text-gold tabular-nums">
            {formatDate(data.weddingDate)}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ivory/45">
            Time
          </span>
          <span className="text-sm font-light text-ivory/85">
            {data.weddingTime || "12:00 PM"}
          </span>
        </div>

        <div className="space-y-1">
          <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-ivory/45">
            Location
          </div>
          <p className="text-sm font-medium tracking-wide text-ivory">
            {data.venueName || "The Venue Hall"}
          </p>
          <p className="text-xs font-light leading-relaxed text-ivory/55">
            {data.venueAddress || "Address details, Addis Ababa"}
          </p>
        </div>
      </div>

      {/* Short Personal Note Footnote */}
      <p className="z-10 mt-4 max-w-70 text-[10px] font-light leading-relaxed text-ivory/45">
        {data.personalMessage || "Join our celebration."}
      </p>
    </div>
  );
}
