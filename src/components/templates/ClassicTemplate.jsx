"use client";

import React from "react";

export default function ClassicTemplate({ data }) {
  // Helper to format the date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "Date To Be Announced";
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="w-full h-full bg-[#FAF8F5] text-stone-800 p-4 sm:p-6 md:p-8 flex flex-col justify-between relative select-none">
      {/* Elegant Double Border Frame */}
      <div className="border border-amber-800/10 h-full w-full p-2">
        <div className="border-2 border-double border-amber-800/20 h-full w-full p-4 sm:p-6 flex flex-col justify-between text-center">
          {/* Top Decorative Corner Elements Or Emblem Placeholder */}
          <div className="text-amber-700/60 font-serif text-xl tracking-widest select-none">
            ✧ ✦ ✧
          </div>

          {/* 1. Host Announcement (Parents) */}
          <div className="space-y-1 my-2">
            <p className="text-[11px] font-medium tracking-wide uppercase text-stone-600 font-sans">
              {data.brideParents || "Bride's Parents"}
            </p>
            <p className="text-[10px] text-amber-800/70 italic font-serif">&</p>
            <p className="text-[11px] font-medium tracking-wide uppercase text-stone-600 font-sans">
              {data.groomParents || "Groom's Parents"}
            </p>
            <p className="text-[11px] text-amber-800 font-serif italic pt-3 tracking-wide max-w-[240px] mx-auto leading-relaxed">
              request the honor of your presence to celebrate the holy matrimony
              of their beloved children
            </p>
          </div>

          {/* 2. The Couple Names */}
          <div className="my-4 md:my-6">
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-wide capitalize font-normal px-2">
              {data.brideName || "Bride"}
            </h1>
            <div className="text-amber-700 font-serif my-2 text-2xl italic select-none">
              and
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-wide capitalize font-normal px-2">
              {data.groomName || "Groom"}
            </h1>
          </div>

          {/* Decorative Divider Line */}
          <div className="flex items-center justify-center gap-2 w-24 mx-auto my-1 select-none">
            <div className="h-[1px] bg-amber-800/30 flex-grow"></div>
            <div className="text-[8px] text-amber-800/40">✦</div>
            <div className="h-[1px] bg-amber-800/30 flex-grow"></div>
          </div>

          {/* 3. Event Logistics (Date, Time, Location) */}
          <div className="space-y-2 py-2 text-stone-700">
            <p className="font-serif text-sm tracking-wide text-stone-900 font-semibold">
              {formatDate(data.weddingDate)}
            </p>
            <p className="text-xs uppercase tracking-widest text-stone-500 font-sans">
              at {data.weddingTime || "Twelve O'Clock in the Afternoon"}
            </p>

            <div className="pt-2">
              <p className="font-serif text-base text-amber-900 font-medium tracking-wide">
                {data.venueName || "The Venue Hall"}
              </p>
              <p className="text-[11px] text-stone-500 font-sans max-w-[220px] mx-auto mt-0.5 leading-normal">
                {data.venueAddress || "Address details, Addis Ababa"}
              </p>
            </div>
          </div>

          {/* 4. Personal Message / Verse Footer */}
          <div className="mt-4">
            <p className="text-[11px] text-stone-500 italic max-w-[260px] mx-auto leading-relaxed font-serif border-t border-stone-200/60 pt-4">
              "
              {data.personalMessage ||
                "Our shared journey steps into eternity. We look forward to celebrating this beautiful day with you."}
              "
            </p>
          </div>

          {/* Bottom Motif */}
          <div className="text-amber-700/40 text-[10px] tracking-widest mt-2 select-none">
            ✦
          </div>
        </div>
      </div>
    </div>
  );
}
