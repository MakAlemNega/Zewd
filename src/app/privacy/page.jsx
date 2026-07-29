import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Zewd",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-ink px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-ivory/40">
          Last updated: July 2026
        </p>
        <h1 className="mt-2 font-display text-3xl italic text-ivory sm:text-4xl">
          Privacy Policy
        </h1>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-ivory/75">
          <section>
            <h2 className="text-base font-semibold text-ivory">Overview</h2>
            <p className="mt-3">
              Zewd (&quot;we&quot;, &quot;us&quot;) provides digital wedding
              invitations. This policy explains what information we collect
              from account holders (&quot;hosts&quot;) and their invited
              guests, how we use it, and the choices available to you.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">
              Information we collect
            </h2>
            <p className="mt-3 font-medium text-ivory/90">Account information</p>
            <p className="mt-1">
              When you create a host account, we store your name, email
              address, and a securely hashed password. We never store your
              password in plain text.
            </p>
            <p className="mt-4 font-medium text-ivory/90">
              Invitation &amp; guest data
            </p>
            <p className="mt-1">
              Invitation details (couple names, event date, venue, and any
              personal message) are stored so your invitation can be
              displayed to guests. When a guest responds, we store the name,
              phone number, attendance status, party size, and any message
              they choose to submit, so you can see who is coming.
            </p>
            <p className="mt-4 font-medium text-ivory/90">
              Cookies &amp; session data
            </p>
            <p className="mt-1">
              We use a single first-party, httpOnly session cookie to keep
              hosts signed in. We do not use third-party advertising or
              tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">
              How we use this information
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>To create and display your invitation to your guests.</li>
              <li>
                To let you sign in and manage your invitation and guest
                list.
              </li>
              <li>
                To notify you by email when a guest responds to your
                invitation.
              </li>
              <li>
                To protect the service from abuse (e.g. spam RSVP
                submissions or automated account creation).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">
              Sharing with third parties
            </h2>
            <p className="mt-3">
              We use MongoDB to store data and Resend to deliver
              transactional emails (such as RSVP notifications). These
              providers process data on our behalf and do not use it for
              their own marketing purposes. We do not sell personal
              information to anyone.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">
              Data retention &amp; deletion
            </h2>
            <p className="mt-3">
              We retain invitation and guest data for as long as a host
              account remains active. If you&apos;d like your account,
              invitation, or guest data deleted, contact us at the address
              below and we will remove it.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">Security</h2>
            <p className="mt-3">
              Passwords are hashed (never stored in plain text), session
              cookies are httpOnly, and access to invitation and guest data
              is restricted to the account that owns it.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">
              Children&apos;s privacy
            </h2>
            <p className="mt-3">
              Zewd is not directed at children under 13, and we do not
              knowingly collect information from them.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">
              Changes to this policy
            </h2>
            <p className="mt-3">
              We may update this policy from time to time. Material changes
              will be reflected by updating the date at the top of this
              page.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ivory">Contact us</h2>
            <p className="mt-3">
              Questions about this policy? Reach out via our{" "}
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
