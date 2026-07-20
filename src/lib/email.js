import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Zewd <onboarding@resend.dev>";

const ATTENDING_PHRASE = {
  yes: "is attending",
  maybe: "might attend",
  no: "can't make it to",
};

// Notifying the host is a nice-to-have, never a reason to fail an RSVP —
// every failure path here is swallowed and logged, not thrown.
export async function sendRsvpNotification({
  hostEmail,
  hostName,
  guest,
  invitation,
  dashboardUrl,
}) {
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY is not set — skipping RSVP notification. " +
        "Add it to .env to send real emails.",
    );
    return;
  }

  const phrase = ATTENDING_PHRASE[guest.attending] || "responded to";
  const coupleNames = `${invitation.brideName} & ${invitation.groomName}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: hostEmail,
      subject: `${guest.name} ${phrase} your wedding`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
          <p>Hi ${hostName || "there"},</p>
          <p><strong>${guest.name}</strong> ${phrase} <strong>${coupleNames}</strong>'s wedding.</p>
          ${
            guest.attending === "yes"
              ? `<p>Party size: ${guest.guestCount}</p>`
              : ""
          }
          ${guest.message ? `<p>Message: &ldquo;${guest.message}&rdquo;</p>` : ""}
          <p><a href="${dashboardUrl}">View your full guest list →</a></p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[email] Failed to send RSVP notification", err);
  }
}
