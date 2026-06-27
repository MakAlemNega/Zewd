"use client";

import React from "react";
import { useInvitation } from "@/context/InvitationContext";
import InvitationForm from "@/components/invitation/InvitationForm";
import { TEMPLATE_REGISTRY } from "@/components/templates/templates"; // 👈 Import Registry map

export default function CreateInvitationPage() {
  const { invitationData } = useInvitation();

  // Find the selected template component config dynamically, fallback to classic-ivory if none matched
  const SelectedTemplateConfig =
    TEMPLATE_REGISTRY[invitationData.templateId] ||
    TEMPLATE_REGISTRY["classic-ivory"];
  const ActiveTemplateComponent = SelectedTemplateConfig.component;

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

            <InvitationForm />
          </div>
        </div>

        {/* RIGHT COLUMN: Live Production Preview Canvas */}
        <div className="p-6 md:p-10 lg:sticky lg:top-16 h-[75vh] lg:h-[calc(100vh-4rem)] flex items-center justify-center bg-stone-100 overflow-hidden">
          <div className="w-full max-w-sm aspect-[3.5/5] bg-white shadow-2xl rounded-sm overflow-hidden border border-stone-200/60 transition-all duration-300 transform hover:scale-[1.01]">
            {/* RENDER THE ACTIVE COMPONENT AUTOMATICALLY DYNAMICALLY */}
            <ActiveTemplateComponent data={invitationData} />
          </div>
        </div>
      </div>
    </div>
  );
}
