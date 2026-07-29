"use client";

import React from "react";
import { Divider, CornerFlourish } from "./Ornament";

export default function ClassicTemplate({ data }) {
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
    <div className="relative flex h-full w-full select-none flex-col justify-between bg-ivory p-6 text-stone-800 sm:p-8">
      {/* Hairline frame */}
      <div className="pointer-events-none absolute inset-3 border border-gold-deep/25 sm:inset-4" />

      {/* Corner flourishes */}
      <CornerFlourish className="absolute left-3 top-3 h-8 w-8 text-gold-deep/50 sm:left-4 sm:top-4" />
      <CornerFlourish className="absolute right-3 top-3 h-8 w-8 -scale-x-100 text-gold-deep/50 sm:right-4 sm:top-4" />
      <CornerFlourish className="absolute bottom-3 left-3 h-8 w-8 -scale-y-100 text-gold-deep/50 sm:bottom-4 sm:left-4" />
      <CornerFlourish className="absolute bottom-3 right-3 h-8 w-8 -scale-x-100 -scale-y-100 text-gold-deep/50 sm:bottom-4 sm:right-4" />

      <div className="relative z-10 flex h-full flex-col justify-between py-4 text-center">
        {/* Optional couple photo */}
        {data.coverImageUrl && (
          <div className="mx-auto -mt-1 mb-1 h-16 w-16 overflow-hidden rounded-full border-2 border-gold-deep/30 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded, unknown intrinsic size */}
            <img
              src={data.coverImageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* 1. Host Announcement (Parents) */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-500">
            {data.brideParents || "Bride's Parents"}
          </p>
          <p className="font-display text-[11px] italic text-gold-deep">&</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-500">
            {data.groomParents || "Groom's Parents"}
          </p>
          <p className="mx-auto max-w-60 pt-3 font-display text-[11px] italic leading-relaxed text-stone-500">
            request the honor of your presence to celebrate the holy
            matrimony of their beloved children
          </p>
        </div>

        {/* 2. The Couple Names */}
        <div className="my-3">
          <h1 className="px-2 font-display text-3xl font-normal capitalize tracking-wide text-stone-900 sm:text-4xl">
            {data.brideName || "Bride"}
          </h1>
          <div className="my-1.5 select-none font-display text-xl italic text-gold-deep">
            and
          </div>
          <h1 className="px-2 font-display text-3xl font-normal capitalize tracking-wide text-stone-900 sm:text-4xl">
            {data.groomName || "Groom"}
          </h1>
        </div>

        <Divider className="mx-auto w-28 text-gold-deep" />

        {/* 3. Event Logistics */}
        <div className="space-y-1.5 py-3 text-stone-700">
          <p className="font-display text-sm font-semibold tracking-wide text-stone-900">
            {formatDate(data.weddingDate)}
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
            at {data.weddingTime || "Twelve O'Clock in the Afternoon"}
          </p>

          <div className="pt-2">
            <p className="font-display text-base font-medium tracking-wide text-gold-deep">
              {data.venueName || "The Venue Hall"}
            </p>
            <p className="mx-auto mt-0.5 max-w-55 text-[11px] leading-normal text-stone-500">
              {data.venueAddress || "Address details, Addis Ababa"}
            </p>
          </div>
        </div>

        {/* 4. Personal Message */}
        <div className="mt-2 border-t border-gold-deep/15 pt-4">
          <p className="mx-auto max-w-65 font-display text-[11px] italic leading-relaxed text-stone-500">
            &ldquo;
            {data.personalMessage ||
              "Our shared journey steps into eternity. We look forward to celebrating this beautiful day with you."}
            &rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
