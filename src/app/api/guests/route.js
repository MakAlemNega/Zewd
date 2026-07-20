import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { handleApiError } from "@/lib/apiError";
import Guest from "@/models/Guest";

// GET /api/guests?invitation=<invitationId> — list RSVPs for an invitation
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const invitation = searchParams.get("invitation");

    if (!invitation) {
      return NextResponse.json(
        { error: "invitation query param is required" },
        { status: 400 },
      );
    }

    await dbConnect();
    const guests = await Guest.find({ invitation }).sort({ createdAt: -1 });

    return NextResponse.json({ guests });
  } catch (err) {
    return handleApiError(err);
  }
}

// POST /api/guests — submit an RSVP
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
    const guest = await Guest.create(body);

    return NextResponse.json({ guest }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
