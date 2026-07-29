"use client";

import React from "react";
import { useInvitation } from "@/context/InvitationContext";
import { TEMPLATE_LIST } from "../templates/templates"; // Import template definitions
import CoverImageUploader from "./CoverImageUploader";

export default function InvitationForm() {
  const { invitationData, updateField } = useInvitation();

  return (
    <div className="space-y-8">
      {/* NEW SECTION: VISUAL THEME SELECTOR BUTTON REGISTRY */}
      <div className="border-b border-stone-200 pb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3">
          Select Invitation Theme
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TEMPLATE_LIST.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => updateField("templateId", tpl.id)}
              className={`p-3 text-left rounded-md border transition-all ${
                invitationData.templateId === tpl.id
                  ? "border-stone-900 bg-stone-900 text-white shadow-xs"
                  : "border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100"
              }`}
            >
              <div className="text-xs font-semibold">{tpl.name}</div>
              <div
                className={`text-[10px] mt-0.5 leading-tight line-clamp-2 ${
                  invitationData.templateId === tpl.id
                    ? "text-stone-300"
                    : "text-stone-500"
                }`}
              >
                {tpl.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <CoverImageUploader />

      {/* ... KEEP ALL PRE-EXISTING SECTIONS BELOW (THE COUPLE, PARENTS, DATE & TIME, ETC.) ... */}
      {/* SECTION 1: THE COUPLE */}
      <div className="border-b border-stone-200 pb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-4">
          The Happy Couple
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Bride's First Name
            </label>
            <input
              type="text"
              value={invitationData.brideName}
              onChange={(e) => updateField("brideName", e.target.value)}
              placeholder="e.g. Selam"
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-900 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Groom's First Name
            </label>
            <input
              type="text"
              value={invitationData.groomName}
              onChange={(e) => updateField("groomName", e.target.value)}
              placeholder="e.g. Dawit"
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-900 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: PARENTS */}
      <div className="border-b border-stone-200 pb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-4">
          Family Hosts (Parents)
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Bride's Parents / Hosts
            </label>
            <input
              type="text"
              value={invitationData.brideParents}
              onChange={(e) => updateField("brideParents", e.target.value)}
              placeholder="Ato Tadesse & Woizero Almaz"
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-900 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Groom's Parents / Hosts
            </label>
            <input
              type="text"
              value={invitationData.groomParents}
              onChange={(e) => updateField("groomParents", e.target.value)}
              placeholder="Ato Berhanu & Woizero Aster"
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-900 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: DATE & TIME */}
      <div className="border-b border-stone-200 pb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-4">
          Date & Time
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Wedding Date
            </label>
            <input
              type="date"
              value={invitationData.weddingDate}
              onChange={(e) => updateField("weddingDate", e.target.value)}
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-900 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Reception Time
            </label>
            <input
              type="text"
              value={invitationData.weddingTime}
              onChange={(e) => updateField("weddingTime", e.target.value)}
              placeholder="e.g. 12:00 PM (6:00 ከሰዓት)"
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-900 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: LOCATION */}
      <div className="border-b border-stone-200 pb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-4">
          The Venue
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Venue Name
            </label>
            <input
              type="text"
              value={invitationData.venueName}
              onChange={(e) => updateField("venueName", e.target.value)}
              placeholder="e.g. Sheraton Addis"
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-900 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Physical Address
            </label>
            <input
              type="text"
              value={invitationData.venueAddress}
              onChange={(e) => updateField("venueAddress", e.target.value)}
              placeholder="Addis Ababa"
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-900 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: INVITATION MESSAGE */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-4">
          Personal Message
        </h2>
        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            Invitation Text / Verse
          </label>
          <textarea
            rows={4}
            value={invitationData.personalMessage}
            onChange={(e) => updateField("personalMessage", e.target.value)}
            placeholder="Write a custom welcome message..."
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-900 focus:outline-none transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
}
