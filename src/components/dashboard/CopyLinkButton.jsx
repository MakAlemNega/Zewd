"use client";

import { useEffect, useState } from "react";

export default function CopyLinkButton({ path }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${origin}${path}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable; the path is still visible on the
      // page for a manual copy.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-gold-bright"
    >
      {copied ? "Copied!" : "Copy guest link"}
    </button>
  );
}
