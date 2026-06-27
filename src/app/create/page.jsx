"use client";

import React from "react";
import { useInvitation } from "@/context/InvitationContext";
import InvitationForm from "@/components/invitation/InvitationForm"; // Import our clean new form component

export default function CreateInvitationPage() {
  const { invitationData } = useInvitation();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-100">
      <div className="mx-auto max-w-7xl h-full grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT COLUMN: Input Form Control Panel */}
        <div className="p-6 md:p-10 bg-white border-r border-stone-200 overflow-y-auto lg:h-[calc(100vh-4rem)]">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Design Your Invitation
            </h1>
            <p className="text-sm text-stone-500 mt-1 mb-8">
              Enter your celebration details below. Your preview updates
              instantly.
            </p>

            {/* RENDER OUR FORM COMPONENT */}
            <InvitationForm />
          </div>
        </div>

        {/* RIGHT COLUMN: Live Dynamic Preview */}
        <div className="p-6 md:p-10 lg:sticky lg:top-16 h-[60vh] lg:h-[calc(100vh-4rem)] flex items-center justify-center bg-stone-100 overflow-hidden">
          <div className="w-full max-w-sm aspect-[3.5/5] bg-white shadow-xl rounded-lg p-6 sm:p-8 border border-stone-200 flex flex-col justify-between text-center relative transition-all-custom">
            {/* Template Card Cardboard Frame */}
            <div className="border-2 border-double border-amber-800/20 h-full w-full p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
              {/* Host Announcement */}
              <div className="text-[10px] text-stone-500 uppercase tracking-wide space-y-1">
                <p>{invitationData.brideParents}</p>
                <p>&</p>
                <p>{invitationData.groomParents}</p>
                <p className="text-amber-800 pt-2 font-serif text-xs lowercase italic">
                  request the honor of your presence at the wedding of their
                  children
                </p>
              </div>

              {/* Core Couple Typography */}
              <div className="my-4">
                <h2 className="font-serif text-3xl text-stone-800">
                  {invitationData.brideName}
                </h2>
                <div className="text-amber-700 font-serif my-1 text-xl">&</div>
                <h2 className="font-serif text-3xl text-stone-800">
                  {invitationData.groomName}
                </h2>
              </div>

              {/* Event Metadata details */}
              <div className="space-y-2 border-t border-b border-stone-100 py-3 text-xs text-stone-600">
                <p className="font-medium text-stone-800">
                  {invitationData.weddingDate
                    ? new Date(invitationData.weddingDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "Date To Be Announced"}
                </p>
                <p>{invitationData.weddingTime}</p>
                <div className="w-4 h-[1px] bg-stone-200 mx-auto"></div>
                <p className="font-medium text-stone-800">
                  {invitationData.venueName}
                </p>
                <p className="text-[11px] text-stone-500 font-sans">
                  {invitationData.venueAddress}
                </p>
              </div>

              {/* Personal Message block snippet */}
              <p className="text-[11px] text-stone-500 italic max-w-[240px] mx-auto line-clamp-3">
                "{invitationData.personalMessage}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
