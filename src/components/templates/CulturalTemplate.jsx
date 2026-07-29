"use client";

import React from "react";
import { Divider } from "./Ornament";

const tiletBandStyle = {
  backgroundImage:
    "linear-gradient(135deg, var(--color-gold) 25%, transparent 25%), linear-gradient(225deg, var(--color-gold) 25%, transparent 25%), linear-gradient(45deg, var(--color-gold) 25%, transparent 25%), linear-gradient(315deg, var(--color-gold) 25%, transparent 25%)",
  backgroundPosition: "10px 0, 10px 0, 0 0, 0 0",
  backgroundSize: "20px 10px",
};

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
    <div className="relative flex h-full w-full select-none flex-col overflow-hidden bg-ivory text-stone-900">
      {/* Top tilet ornament band */}
      <div className="h-2.5 w-full opacity-90" style={tiletBandStyle} />

      <div className="relative flex flex-1 flex-col justify-between p-5 text-center sm:p-7">
        {/* Radial gold glow behind monogram area */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-2xl" />

        {/* Optional couple photo */}
        {data.coverImageUrl && (
          <div className="relative z-10 mx-auto -mb-1 h-16 w-16 overflow-hidden rounded-full border-2 border-gold shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded, unknown intrinsic size */}
            <img
              src={data.coverImageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Family Honorifics */}
        <div className="relative z-10 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-600">
            {data.brideParents || "የሙሽሪት ቤተሰቦች"}
          </p>
          <p className="font-display text-[11px] italic text-gold-deep">
            እና
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-600">
            {data.groomParents || "የሙሽራው ቤተሰቦች"}
          </p>
          <p className="mx-auto max-w-55 pt-2 text-[10px] leading-relaxed text-stone-500">
            የልጆቻቸውን የቅዱስ ጋብቻ በዓል ለማክበር በደስታና በክብር የእርሶን መገኘት ይፈልጋሉ።
          </p>
        </div>

        {/* Central Monogram */}
        <div className="relative z-10 my-2 border-y border-gold-deep/20 py-3">
          <div className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-ivory px-3 text-[11px] tracking-widest text-gold-deep">
            ዘውድ
          </div>
          <h2 className="font-display text-2xl font-medium tracking-wide text-stone-900 sm:text-3xl">
            {data.brideName}{" "}
            <span className="font-normal italic text-gold-deep">&</span>{" "}
            {data.groomName}
          </h2>
        </div>

        {/* Logistics Detail */}
        <div className="relative z-10 my-1 space-y-1.5 rounded-sm border border-gold-deep/15 bg-gold/5 p-3.5 text-stone-800">
          <p className="text-xs font-bold tracking-wider text-stone-900">
            {formatDate(data.weddingDate)}
          </p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-stone-500">
            ከሰዓት {data.weddingTime || "6:00 ሰዓት"} ጀምሮ
          </p>
          <Divider className="mx-auto w-12 text-gold-deep" />
          <p className="font-display text-sm font-medium tracking-wide text-gold-deep">
            {data.venueName}
          </p>
          <p className="mx-auto max-w-50 text-[10px] leading-tight text-stone-500">
            {data.venueAddress}
          </p>
        </div>

        {/* Custom Verse */}
        <p className="relative z-10 mx-auto max-w-60 px-2 text-[10px] italic leading-normal text-stone-500">
          &ldquo;{data.personalMessage}&rdquo;
        </p>
      </div>

      {/* Bottom tilet ornament band */}
      <div className="h-2.5 w-full opacity-90" style={tiletBandStyle} />
    </div>
  );
}
