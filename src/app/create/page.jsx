"use client";

import React from "react";
import { useInvitation } from "@/context/InvitationContext";

export default function CreateInvitationPage() {
  const { invitationData, updateField } = useInvitation();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-100">
      <div className="mx-auto max-w-7xl h-full grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT COLUMN: Input Form Control Panel */}
        <div className="p-6 md:p-10 bg-white border-r border-stone-200 overflow-y-auto">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Design Your Invitation
            </h1>
            <p className="text-sm text-stone-500 mt-1 mb-8">
              Enter your celebration details below. Your preview updates
              instantly.
            </p>

            <div className="space-y-6">
              {/* Couple Section */}
              <div className="border-b border-stone-100 pb-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-4">
                  The Happy Couple
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Bride's First Name
                    </label>
                    <input
                      type="text"
                      value={invitationData.brideName}
                      onChange={(e) => updateField("brideName", e.target.value)}
                      className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-amber-600 focus:outline-none transition-colors"
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
                      className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-amber-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Venue Section Preview Trigger */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Reception Venue
                </label>
                <input
                  type="text"
                  value={invitationData.venueName}
                  onChange={(e) => updateField("venueName", e.target.value)}
                  className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-amber-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Preview */}
        <div className="p-6 md:p-10 lg:sticky lg:top-16 h-[50vh] lg:h-[calc(100vh-4rem)] flex items-center justify-center bg-stone-100 overflow-hidden">
          <div className="w-full max-w-sm aspect-[3.5/5] bg-white shadow-xl rounded-lg p-8 border border-stone-200 flex flex-col justify-between text-center relative transition-all-custom">
            {/* Template Card Content Mockup */}
            <div className="border-2 border-double border-amber-800/20 h-full w-full p-6 flex flex-col justify-between">
              <div className="text-amber-800 tracking-widest text-xs uppercase font-serif">
                Wedding Invitation
              </div>

              <div className="my-auto space-y-3">
                <h2 className="font-serif text-3xl text-stone-800">
                  {invitationData.brideName} & {invitationData.groomName}
                </h2>
                <div className="w-8 h-[1px] bg-amber-700 mx-auto my-2"></div>
                <p className="text-xs text-stone-500 italic max-w-[200px] mx-auto">
                  Are getting married at{" "}
                  <span className="font-medium text-stone-800 block not-italic mt-1">
                    {invitationData.venueName}
                  </span>
                </p>
              </div>

              <div className="text-[10px] text-stone-400 font-mono tracking-wider uppercase">
                Live Preview Deck
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
