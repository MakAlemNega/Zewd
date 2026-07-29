"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocalStorage } from "../app/hooks/useLocalStorage";

const InvitationContext = createContext(undefined);

// Default structure tailored for the local market context
const initialInvitationData = {
  brideName: "Selam",
  groomName: "Dawit",
  brideParents: "Ato Tadesse & Woizero Almaz",
  groomParents: "Ato Berhanu & Woizero Aster",
  weddingDate: "2027-01-10",
  weddingTime: "12:00 PM",
  venueName: "Sheraton Addis",
  venueAddress: "T those Links St, Addis Ababa",
  personalMessage:
    "Our families joyfully request the honor of your presence to celebrate our holy matrimony.",
  templateId: "classic-ivory", // classic-ivory, modern-minimal, cultural-gold
  colorTheme: "gold-default",
};

const SAVE_DEBOUNCE_MS = 700;

export function InvitationProvider({ children }) {
  // Only the Mongo _id of the "current draft" is kept in the browser now —
  // the invitation itself lives in the database.
  const [invitationId, setInvitationId] = useLocalStorage(
    "zewd_invitation_id",
    null,
  );

  const [invitationData, setInvitationData] = useState(initialInvitationData);
  const [slug, setSlug] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [isSaving, setIsSaving] = useState(false);

  const invitationIdRef = useRef(invitationId);
  const pendingChangesRef = useRef({});
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    invitationIdRef.current = invitationId;
  }, [invitationId]);

  // Bootstrap: hydrate the draft this browser was already editing, or start
  // a brand new one on the server.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        // 1. Fast path: this browser already remembers which draft it's
        // editing.
        if (invitationId) {
          const res = await fetch(`/api/invitations/${invitationId}`);
          if (res.ok) {
            const { invitation } = await res.json();
            if (!cancelled) {
              setInvitationData(invitation);
              setSlug(invitation.slug);
              setStatus("ready");
            }
            return;
          }
          // Stored id no longer belongs to this account (deleted, or a
          // different user's browser) — fall through below.
        }

        // 2. No local pointer — check whether this account already owns an
        // invitation (e.g. logging in from a new device) before creating
        // another one.
        const listRes = await fetch("/api/invitations");
        if (listRes.ok) {
          const { invitations } = await listRes.json();
          if (invitations.length > 0) {
            const invitation = invitations[0];
            if (!cancelled) {
              setInvitationId(invitation._id);
              setInvitationData(invitation);
              setSlug(invitation.slug);
              setStatus("ready");
            }
            return;
          }
        }

        // 3. First time ever for this account — start a fresh draft.
        const res = await fetch("/api/invitations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(initialInvitationData),
        });
        if (!res.ok) throw new Error("Failed to create invitation draft");

        const { invitation } = await res.json();
        if (!cancelled) {
          setInvitationId(invitation._id);
          setInvitationData(invitation);
          setSlug(invitation.slug);
          setStatus("ready");
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setStatus("error");
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
    // Runs once on mount; invitationId is only used as the initial read.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flushSave = useCallback(async () => {
    const id = invitationIdRef.current;
    const changes = pendingChangesRef.current;
    if (!id || Object.keys(changes).length === 0) return;

    pendingChangesRef.current = {};
    setIsSaving(true);
    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });

      // The server may regenerate the slug when the couple's names change
      // (see the invitations/:id PATCH route) — pick that up so the share
      // link shown in the UI stays in sync.
      if (res.ok) {
        const { invitation } = await res.json();
        if (invitation?.slug) setSlug(invitation.slug);
      }
    } catch (err) {
      console.error("Failed to save invitation", err);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Helper function to update individual fields dynamically
  const updateField = useCallback(
    (fieldName, value) => {
      setInvitationData((prevData) => ({
        ...prevData,
        [fieldName]: value,
      }));

      pendingChangesRef.current[fieldName] = value;

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(flushSave, SAVE_DEBOUNCE_MS);
    },
    [flushSave],
  );

  // For components that persist their own field directly (e.g. CanvasEditor,
  // which saves customLayout itself since it needs finer control over
  // debouncing/beacon-flush timing) — updates local state only, without
  // scheduling a redundant save of its own.
  const syncField = useCallback((fieldName, value) => {
    setInvitationData((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  // Reset the current draft back to defaults (same record, same share link)
  const resetForm = useCallback(() => {
    setInvitationData(initialInvitationData);
    pendingChangesRef.current = { ...initialInvitationData };

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    flushSave();
  }, [flushSave]);

  // Best-effort: send any still-pending edits if the component unmounts
  // before the debounce timer fires (e.g. navigating away quickly).
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        flushSave();
      }
    };
  }, [flushSave]);

  // A regular fetch() started here can be aborted mid-flight when the page
  // actually closes, so a tab closed within the 700ms debounce window used
  // to lose that last edit. sendBeacon is designed to survive exactly that —
  // it's fire-and-forget and the browser guarantees delivery even as the
  // page unloads. "pagehide" covers the tab closing/navigating away entirely;
  // "visibilitychange" also covers switching tabs or backgrounding on
  // mobile, which is often the last event a page ever sees there.
  useEffect(() => {
    function flushBeacon() {
      const id = invitationIdRef.current;
      const changes = pendingChangesRef.current;
      if (!id || Object.keys(changes).length === 0) return;
      if (typeof navigator === "undefined" || !navigator.sendBeacon) return;

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      pendingChangesRef.current = {};

      const blob = new Blob([JSON.stringify(changes)], {
        type: "application/json",
      });
      navigator.sendBeacon(`/api/invitations/${id}`, blob);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") flushBeacon();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", flushBeacon);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", flushBeacon);
    };
  }, []);

  return (
    <InvitationContext.Provider
      value={{
        invitationData,
        updateField,
        syncField,
        resetForm,
        invitationId,
        slug,
        status,
        isSaving,
      }}
    >
      {children}
    </InvitationContext.Provider>
  );
}

// 3. Create a custom hook for clean, effortless imports in other components
export function useInvitation() {
  const context = useContext(InvitationContext);
  if (!context) {
    throw new Error("useInvitation must be used within an InvitationProvider");
  }
  return context;
}
