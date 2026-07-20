import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { findOwnedInvitation } from "@/lib/invitationOwnership";
import { handleApiError } from "@/lib/apiError";
import Guest from "@/models/Guest";

// Guests never have accounts, so every operation here is gated on the
// *invitation's* owner instead of the guest itself — only the host managing
// their RSVP list may read, edit, or remove an entry.
async function findGuestForOwner(user, guestId) {
  const guest = await Guest.findById(guestId);
  if (!guest) return null;

  const owned = await findOwnedInvitation(user, guest.invitation);
  return owned ? guest : null;
}

// GET /api/guests/:id
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    await dbConnect();
    const guest = await findGuestForOwner(user, id);
    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json({ guest });
  } catch (err) {
    return handleApiError(err);
  }
}

// PATCH /api/guests/:id — the host correcting/annotating an RSVP
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    await dbConnect();
    const owned = await findGuestForOwner(user, id);
    if (!owned) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    const updates = await request.json();
    delete updates.invitation; // an RSVP can't be reassigned to another invite

    const guest = await Guest.findByIdAndUpdate(
      id,
      { $set: updates },
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({ guest });
  } catch (err) {
    return handleApiError(err);
  }
}

// DELETE /api/guests/:id — the host removing a spam/duplicate RSVP
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    await dbConnect();
    const owned = await findGuestForOwner(user, id);
    if (!owned) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    await Guest.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
