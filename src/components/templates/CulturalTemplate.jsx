"use client";

import React from "react";

export default function CulturalTemplate({ data }) {
  const formatDate = (dateString) => {
    if (!dateString) return "ቀን ይጠባበቃል";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full h-full bg-[#FAF6F0] text-stone-900 p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Top Graphic Tilet Ornament Banner Mockup */}
      <div className="w-full h-3 flex items-center justify-between opacity-80 select-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-full h-full border-t border-b border-amber-600 bg-amber-700/10 flex items-center justify-center text-[6px] text-amber-700 font-serif"
          >
            ❖
          </div>
        ))}
      </div>

      <div className="border border-amber-600/20 rounded-sm h-full w-full my-3 p-3 flex flex-col justify-between text-center bg-white/40 backdrop-blur-xs">
        {/* Family Honorifics Banner */}
        <div className="space-y-0.5 my-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-700">
            {data.brideParents || "የሙሽሪት ቤተሰቦች"}
          </p>
          <p className="text-[9px] text-amber-700 font-serif italic">እና</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-700">
            {data.groomParents || "የሙሽራው ቤተሰቦች"}
          </p>
          <div className="text-[10px] text-amber-800 font-serif max-w-[220px] mx-auto leading-relaxed pt-2">
            የልጆቻቸውን የቅዱስ ጋብቻ በዓል ለማክበር በደስታና በክብር የእርሶን መገኘት ይፈልጋሉ።
          </div>
        </div>

        {/* Central Monogram Frame */}
        <div className="my-2 py-2 border-y border-stone-200/60 relative">
          <div className="absolute left-1/2 -top-2 -translate-x-1/2 bg-[#FAF6F0] px-3 text-xs text-amber-700">
            ዘውድ
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-wide text-amber-950">
            {data.brideName}{" "}
            <span className="text-amber-600 font-normal">&</span>{" "}
            {data.groomName}
          </h2>
        </div>

        {/* Logistics Detail Box */}
        <div className="bg-amber-50/50 rounded-sm p-3 border border-amber-600/10 space-y-1.5 text-stone-800 my-1">
          <p className="font-serif text-xs font-bold tracking-wider text-stone-900">
            {formatDate(data.weddingDate)}
          </p>
          <p className="text-[10px] tracking-widest text-stone-500 uppercase font-medium">
            ከሰዓት {data.weddingTime || "6:00 ሰዓት"} ጀምሮ
          </p>
          <div className="h-[0.5px] w-12 bg-amber-600/20 mx-auto my-1"></div>
          <p className="font-serif text-sm text-amber-900 font-medium tracking-wide">
            {data.venueName}
          </p>
          <p className="text-[10px] text-stone-500 font-sans max-w-[200px] mx-auto leading-tight">
            {data.venueAddress}
          </p>
        </div>

        {/* Custom Text/Verse */}
        <p className="text-[10px] text-stone-500 italic max-w-[240px] mx-auto leading-normal px-2">
          "{data.personalMessage}"
        </p>
      </div>

      {/* Bottom Graphic Tilet Ornament Banner Mockup */}
      <div className="w-full h-3 flex items-center justify-between opacity-80 select-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-full h-full border-t border-b border-amber-600 bg-amber-700/10 flex items-center justify-center text-[6px] text-amber-700 font-serif"
          >
            ❖
          </div>
        ))}
      </div>
    </div>
  );
}
