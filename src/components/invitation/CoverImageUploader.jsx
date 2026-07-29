"use client";

import { useState } from "react";
import { useInvitation } from "@/context/InvitationContext";

export default function CoverImageUploader() {
  const { invitationData, updateField } = useInvitation();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed. Please try again.");
        return;
      }

      updateField("coverImageUrl", data.url);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = ""; // allow re-selecting the same file later
    }
  };

  return (
    <div className="border-b border-stone-200 pb-6">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-800">
        Cover Photo (optional)
      </h2>

      {invitationData.coverImageUrl ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded, unknown intrinsic size */}
          <img
            src={invitationData.coverImageUrl}
            alt="Cover"
            className="h-16 w-16 rounded-full border border-stone-200 object-cover"
          />
          <button
            type="button"
            onClick={() => updateField("coverImageUrl", "")}
            className="text-xs font-medium text-stone-500 hover:text-red-600"
          >
            Remove photo
          </button>
        </div>
      ) : (
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100">
          {uploading ? "Uploading…" : "Upload a photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={handleFileChange}
          />
        </label>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
