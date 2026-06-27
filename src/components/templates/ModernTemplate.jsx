"use client";

import React from "react";

export default function ModernTemplate({ data }) {
  const formatDate = (dateString) => {
    if (!dateString) return "00.00.00";
    const date = new Date(dateString);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  return (
    <div className="w-full h-full bg-[#1A1A1A] text-white p-6 sm:p-8 flex flex-col justify-between text-left relative select-none">
      {/* Structural Minimalist Frame Grid */}
      <div className="absolute top-4 left-4 right-4 bottom-4 border border-stone-800 pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-medium">
        // CELEBRATION
      </div>

      {/* Main Couple Names */}
      <div className="my-auto space-y-2 z-10">
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white capitalize">
          {data.brideName || "BRIDE"}
        </h1>
        <div className="text-xl font-serif italic text-stone-500 pl-1 select-none">
          &
        </div>
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white capitalize">
          {data.groomName || "GROOM"}
        </h1>
      </div>

      {/* Logistics Stack */}
      <div className="space-y-4 border-t border-stone-800 pt-6 z-10">
        <div className="flex justify-between items-baseline">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-medium">
            Date
          </span>
          <span className="text-lg font-mono tracking-wider font-semibold text-white">
            {formatDate(data.weddingDate)}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-medium">
            Time
          </span>
          <span className="text-sm font-light text-stone-200">
            {data.weddingTime || "12:00 PM"}
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-1">
            Location
          </div>
          <p className="text-sm font-medium text-white tracking-wide">
            {data.venueName || "The Venue Hall"}
          </p>
          <p className="text-xs text-stone-400 font-light leading-relaxed">
            {data.venueAddress || "Address details, Addis Ababa"}
          </p>
        </div>
      </div>

      {/* Short Personal Note Footnote */}
      <p className="text-[10px] text-stone-500 font-light leading-relaxed mt-4 max-w-[280px]">
        {data.personalMessage || "Join our celebration."}
      </p>
    </div>
  );
}
