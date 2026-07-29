"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      window.location.assign("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-ink px-6 py-16">
      {/* Ambient glow behind the glass card — glassmorphism needs color
          underneath it to actually read as glass. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-[-10%] h-96 w-96 rounded-full bg-gold/20 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-15%] right-[-10%] h-80 w-80 rounded-full bg-clay/40 blur-[100px]"
      />

      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        <Image
          src="/zewd-logo-full.png"
          alt="Zewd"
          width={618}
          height={566}
          className="mx-auto h-16 w-auto"
          priority
        />
        <h1 className="mt-5 text-center font-display text-3xl italic text-ivory">
          Create your account
        </h1>
        <p className="mt-2 text-center text-sm text-ivory/50">
          Start designing your invitation.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ivory/50">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-ivory outline-none transition-colors focus:border-gold"
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
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-ivory outline-none transition-colors focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ivory/50">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-ivory outline-none transition-colors focus:border-gold"
            />
            <p className="mt-1 text-[11px] text-ivory/35">
              At least 8 characters.
            </p>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-all hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Sign up"}
          </button>

          <p className="text-center text-[11px] leading-relaxed text-ivory/35">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-ivory/50 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-ivory/50 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-ivory/50">
          Already have an account?{" "}
          <Link href="/login" className="text-gold-bright hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
