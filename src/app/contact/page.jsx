// Demo contact details — replace these once you have a verified business
// email/phone. Nothing elsewhere in the app reads these; editing them here
// is the only step needed.
const CONTACT_EMAIL = "hello@zewd.app";
const CONTACT_PHONE = "+251 900 000 000";

export const metadata = {
  title: "Contact | Zewd",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-ink px-6 py-16">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display text-3xl italic text-ivory">
          Get in touch
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ivory/60">
          Questions about your invitation, a guest&apos;s RSVP, or anything
          else — we&apos;re happy to help.
        </p>

        <div className="mt-10 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-ivory/40">
              Email
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-1 inline-block text-lg text-gold-bright hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-ivory/40">
              Phone
            </p>
            <a
              href={`tel:${CONTACT_PHONE.replace(/\s+/g, "")}`}
              className="mt-1 inline-block text-lg text-ivory/80 hover:text-ivory"
            >
              {CONTACT_PHONE}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
