"use client";

import { useState } from "react";

export default function SettingsForm({ userId, initialName, initialEmail }) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
      setStatus("error");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/");
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Delete your account? This cannot be undone — your invitation and guest list stay in the database but you'll lose access to them.",
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await fetch(`/api/users/${userId}`, { method: "DELETE" });
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.assign("/");
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ivory/50">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-ink-line bg-ink-soft px-3 py-2 text-sm text-ivory outline-none transition-colors focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ivory/50">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-ink-line bg-ink-soft px-3 py-2 text-sm text-ivory outline-none transition-colors focus:border-gold"
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "saving"
            ? "Saving…"
            : status === "saved"
              ? "Saved!"
              : "Save changes"}
        </button>
      </form>

      <div className="max-w-sm border-t border-ink-line pt-6">
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-ivory/60 transition-colors hover:text-ivory"
        >
          Log out
        </button>
      </div>

      <div className="max-w-sm border-t border-ink-line pt-6">
        <h2 className="text-sm font-semibold text-red-400">Danger zone</h2>
        <p className="mt-1 text-xs text-ivory/45">
          Permanently delete your account. Your invitation and any guest
          responses remain in the database but become inaccessible.
        </p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="mt-3 rounded-full border border-red-500/40 px-5 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete account"}
        </button>
      </div>
    </div>
  );
}
