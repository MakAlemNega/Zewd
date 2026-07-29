import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import Invitation from "@/models/Invitation";
import Guest from "@/models/Guest";
import GuestTable from "@/components/dashboard/GuestTable";

export const dynamic = "force-dynamic";

export default async function GuestsPage() {
  const user = await getCurrentUser();

  await dbConnect();
  const invitation = await Invitation.findOne({ owner: user._id })
    .sort({ createdAt: -1 })
    .lean();

  if (!invitation) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-2xl italic text-ivory">
          Design your invitation first.
        </p>
        <p className="mt-2 text-sm text-ivory/50">
          Guest RSVPs will show up here once you have a shareable link.
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

  return (
    <div className="px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-widest text-ivory/40">
          {invitation.brideName} &amp; {invitation.groomName}
        </p>
        <h1 className="mt-1 font-display text-2xl italic text-ivory">
          Guest responses
        </h1>

        <div className="mt-6">
          <GuestTable initialGuests={guests} />
        </div>
      </div>
    </div>
  );
}
