import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { findOwnedInvitation } from "@/lib/invitationOwnership";
import { handleApiError } from "@/lib/apiError";
import { sendRsvpNotification } from "@/lib/email";
import Guest from "@/models/Guest";
import Invitation from "@/models/Invitation";
import User from "@/models/User";

// GET /api/guests?invitation=<invitationId> — list RSVPs for an invitation.
// Only that invitation's owner can see who responded.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get("invitation");

    if (!invitationId) {
      return NextResponse.json(
        { error: "invitation query param is required" },
        { status: 400 },
      );
    }

    const user = await getCurrentUser();
    await dbConnect();

    const owned = await findOwnedInvitation(user, invitationId);
    if (!owned) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 },
      );
    }

    const guests = await Guest.find({ invitation: invitationId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ guests });
  } catch (err) {
    return handleApiError(err);
  }
}

// POST /api/guests — submit an RSVP. Deliberately public/unauthenticated:
// guests responding to a shared invitation link don't have (or need)
// accounts.
// body: { invitation, name, phone?, attending, guestCount?, message? }
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.invitation || !body.name) {
      return NextResponse.json(
        { error: "invitation and name are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const invitation = await Invitation.findById(body.invitation);
    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 },
      );
    }

    const guest = await Guest.create(body);

    if (invitation.owner) {
      const host = await User.findById(invitation.owner);
      if (host) {
        await sendRsvpNotification({
          hostEmail: host.email,
          hostName: host.name,
          guest,
          invitation,
          dashboardUrl: `${new URL(request.url).origin}/dashboard`,
        });
      }
    }

    return NextResponse.json({ guest }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
