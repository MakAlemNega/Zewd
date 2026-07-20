import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import Invitation from "@/models/Invitation";
import Guest from "@/models/Guest";
import CopyLinkButton from "@/components/dashboard/CopyLinkButton";
import GuestTable from "@/components/dashboard/GuestTable";

export const dynamic = "force-dynamic";

function summarize(guests) {
  return guests.reduce(
    (acc, guest) => {
      acc.responses += 1;
      if (guest.attending === "yes") {
        acc.attendingYes += 1;
        acc.headcount += guest.guestCount || 0;
      } else if (guest.attending === "maybe") {
        acc.maybe += 1;
      } else {
        acc.no += 1;
      }
      return acc;
    },
    { responses: 0, attendingYes: 0, maybe: 0, no: 0, headcount: 0 },
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  // The proxy already guards this route; this keeps the page correct on its
  // own if that ever changes.
  if (!user) redirect("/login");

  await dbConnect();
  const invitation = await Invitation.findOne({ owner: user._id })
    .sort({ createdAt: -1 })
    .lean();

  if (!invitation) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-ink px-6 text-center">
        <p className="font-display text-2xl italic text-ivory">
          You haven&apos;t designed an invitation yet.
        </p>
        <Link
          href="/create"
          className="mt-6 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
        >
          Start designing
        </Link>
      </div>
    );
  }

  const guestsRaw = await Guest.find({ invitation: invitation._id })
    .sort({ createdAt: -1 })
    .lean();
  const guests = JSON.parse(JSON.stringify(guestsRaw));
  const summary = summarize(guests);
  const shareUrl = `/i/${invitation.slug}`;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-ivory/40">
              Dashboard
            </p>
            <h1 className="font-display text-3xl italic text-ivory">
              {invitation.brideName} &amp; {invitation.groomName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="rounded-full border border-ink-line px-4 py-2 text-xs font-semibold text-ivory/70 transition-colors hover:border-gold/40 hover:text-ivory"
            >
              Edit invitation
            </Link>
            <CopyLinkButton path={shareUrl} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Responses" value={summary.responses} />
          <StatTile label="Attending" value={summary.attendingYes} accent />
          <StatTile label="Maybe" value={summary.maybe} />
          <StatTile label="Total guests" value={summary.headcount} />
        </div>

        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ivory/50">
            Guest responses
          </h2>
          <div className="mt-3">
            <GuestTable initialGuests={guests} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value, accent }) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        accent ? "border-gold/30 bg-gold/10" : "border-ink-line bg-ink-soft/60"
      }`}
    >
      <p
        className={`text-2xl font-semibold ${accent ? "text-gold-bright" : "text-ivory"}`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wide text-ivory/45">
        {label}
      </p>
    </div>
  );
}
