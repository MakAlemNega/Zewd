"use client";

import React from "react";
import { useInvitation } from "@/context/InvitationContext";
import InvitationForm from "@/components/invitation/InvitationForm";
import ShareLinkBar from "@/components/invitation/ShareLinkBar";
import CanvasEditor from "@/components/editor/CanvasEditor";
import { TEMPLATE_REGISTRY } from "@/components/templates/templates"; // 👈 Import Registry map

export default function CreateInvitationPage() {
  const { invitationData, updateField, syncField, invitationId, status } =
    useInvitation();

  // Find the selected template component config dynamically, fallback to classic-ivory if none matched
  const SelectedTemplateConfig =
    TEMPLATE_REGISTRY[invitationData.templateId] ||
    TEMPLATE_REGISTRY["classic-ivory"];
  const ActiveTemplateComponent = SelectedTemplateConfig.component;

  if (status === "error") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-ink-soft px-6 text-center">
        <p className="text-sm text-ivory/60">
          We couldn&apos;t reach the server to load your invitation. Check
          your connection and refresh the page.
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-ink-soft">
        <p className="text-sm text-ivory/50">Loading your invitation…</p>
      </div>
    );
  }

  const designMode = invitationData.designMode || "template";

  const ModeSwitcher = (
    <div className="inline-flex rounded-full border border-ink-line bg-ink-soft/60 p-1">
      <button
        type="button"
        onClick={() => updateField("designMode", "template")}
        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
          designMode === "template"
            ? "bg-gold text-ink"
            : "text-ivory/60 hover:text-ivory"
        }`}
      >
        Use a template
      </button>
      <button
        type="button"
        onClick={() => updateField("designMode", "custom")}
        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
          designMode === "custom"
            ? "bg-gold text-ink"
            : "text-ivory/60 hover:text-ivory"
        }`}
      >
        Design your own
      </button>
    </div>
  );

  if (designMode === "custom") {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-ink-soft px-6 py-8 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl italic text-ivory tracking-tight">
                Design Your Invitation
              </h1>
              <p className="mt-1 text-sm text-ivory/50">
                Drag text and images anywhere on the card.
              </p>
            </div>
            {ModeSwitcher}
          </div>

          <ShareLinkBarDark />

          <CanvasEditor
            invitationId={invitationId}
            initialLayout={invitationData.customLayout}
            onSaved={(layout) => syncField("customLayout", layout)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink-soft">
      <div className="mx-auto max-w-7xl h-full grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT COLUMN: Input Form Control Panel */}
        <div className="p-6 md:p-10 bg-ivory border-r border-ink-line overflow-y-auto lg:h-[calc(100vh-4rem)]">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between gap-4">
              <h1 className="font-display text-2xl italic text-stone-900 tracking-tight">
                Design Your Invitation
              </h1>
            </div>
            <div className="mt-4 mb-6">{ModeSwitcher}</div>
            <p className="text-sm text-stone-500 mt-1 mb-8">
              Enter your celebration details below. Your preview updates
              instantly.
            </p>

            <ShareLinkBar />
            <InvitationForm />
          </div>
        </div>

        {/* RIGHT COLUMN: Live Production Preview Canvas */}
        <div className="p-6 md:p-10 lg:sticky lg:top-16 h-[75vh] lg:h-[calc(100vh-4rem)] flex items-center justify-center bg-ink-soft overflow-hidden">
          <div className="w-full max-w-sm aspect-[3.5/5] bg-white shadow-2xl shadow-black/40 rounded-sm overflow-hidden border border-ink-line transition-all duration-300 transform hover:scale-[1.01]">
            {/* RENDER THE ACTIVE COMPONENT AUTOMATICALLY DYNAMICALLY */}
            <ActiveTemplateComponent data={invitationData} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ShareLinkBar was designed for the ivory form panel; the custom-design
// screen sits directly on the dark page background, so it needs the
// dark-mode equivalent of the same content rather than reusing that
// component's light-panel styling.
function ShareLinkBarDark() {
  const { invitationData, updateField, slug, status: linkStatus, isSaving } =
    useInvitation();
  const [origin, setOrigin] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (linkStatus !== "ready" || !slug) return null;

  const path = `/i/${slug}`;
  const fullUrl = `${origin}${path}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable; the path is still visible.
    }
  };

  return (
    <div className="mb-6 rounded-md border border-ink-line bg-ink-soft/60 p-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gold-bright">
        Your guest link
      </p>

      {/* Editing either name regenerates the link below (until someone has
          RSVP'd — after that the link is kept stable on purpose). */}
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="text"
          value={invitationData.brideName}
          onChange={(e) => updateField("brideName", e.target.value)}
          placeholder="Bride's name"
          className="w-full rounded-md border border-ink-line bg-ink px-3 py-1.5 text-sm text-ivory outline-none focus:border-gold"
        />
        <input
          type="text"
          value={invitationData.groomName}
          onChange={(e) => updateField("groomName", e.target.value)}
          placeholder="Groom's name"
          className="w-full rounded-md border border-ink-line bg-ink px-3 py-1.5 text-sm text-ivory outline-none focus:border-gold"
        />
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 truncate text-sm text-ivory/70">{path}</p>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-xs text-ivory/40" aria-live="polite">
            {isSaving ? "Saving…" : "Saved"}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full bg-gold px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-gold-bright"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </div>
    </div>
  );
}
