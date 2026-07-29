import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Zewd",
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-ink px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-ivory/40">
          Last updated: July 2026
        </p>
        <h1 className="mt-2 font-display text-3xl italic text-ivory sm:text-4xl">
          Terms of Service
        </h1>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-ivory/75">
          <section>
            <h2 className="text-base font-semibold text-ivory">
              1. Acceptance of terms
            </h2>
            <p className="mt-3">
              By creating an account or using Zewd, you agree to these
              Terms of Service and our{" "}
              <Link href="/privacy" className="text-gold-bright hover:underline">
                Privacy Policy
              </Link>
              . If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">
              2. The service
            </h2>
            <p className="mt-3">
              Zewd lets hosts design a digital wedding invitation, share it
              with guests via a link, and collect RSVPs. We may change,
              suspend, or discontinue any part of the service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">
              3. Accounts
            </h2>
            <p className="mt-3">
              You&apos;re responsible for keeping your account credentials
              confidential and for all activity under your account. You
              must provide accurate information when creating an account.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">
              4. Acceptable use
            </h2>
            <p className="mt-3">You agree not to use Zewd to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Publish content that is unlawful, harassing, or infringes
                someone else&apos;s rights.
              </li>
              <li>
                Attempt to disrupt the service (e.g. spamming RSVP
                submissions, scraping, or automated account creation).
              </li>
              <li>
                Impersonate another person or misrepresent your affiliation
                with anyone.
              </li>
            </ul>
            <p className="mt-3">
              We may suspend or terminate accounts that violate these
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">
              5. Guest data is your responsibility
            </h2>
            <p className="mt-3">
              As a host, you collect your guests&apos; RSVP information
              (name, contact details, and any message they submit) through
              your invitation. You are responsible for using that
              information appropriately and in accordance with applicable
              law.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">
              6. Intellectual property
            </h2>
            <p className="mt-3">
              The Zewd name, templates, and design are owned by us. You
              retain ownership of the content you enter (couple names,
              messages, and similar details).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">
              7. Disclaimer &amp; limitation of liability
            </h2>
            <p className="mt-3">
              Zewd is provided &quot;as is&quot;, without warranties of any
              kind. To the fullest extent permitted by law, we are not
              liable for indirect, incidental, or consequential damages
              arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">
              8. Changes to these terms
            </h2>
            <p className="mt-3">
              We may update these terms from time to time. Continued use of
              Zewd after a change means you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">
              9. Contact us
            </h2>
            <p className="mt-3">
              Questions about these terms? Reach out via our{" "}
              <Link
                href="/contact"
                className="text-gold-bright hover:underline"
              >
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
