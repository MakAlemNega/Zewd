import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { findOwnedInvitation } from "@/lib/invitationOwnership";
import { buildInvitationSlug } from "@/lib/slug";
import { handleApiError } from "@/lib/apiError";
import Invitation from "@/models/Invitation";
import Guest from "@/models/Guest";

// GET /api/invitations/:id
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    await dbConnect();
    const invitation = await findOwnedInvitation(user, id);
    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ invitation });
  } catch (err) {
    return handleApiError(err);
  }
}

// PATCH /api/invitations/:id — update any invitation field (e.g. from the
// live /create form)
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    await dbConnect();
    const owned = await findOwnedInvitation(user, id);
    if (!owned) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 },
      );
    }

    const updates = await request.json();
    delete updates.slug; // clients never set the slug directly — see below
    delete updates.owner; // ownership can't be reassigned through this route

    const nameChanged =
      (typeof updates.brideName === "string" &&
        updates.brideName !== owned.brideName) ||
      (typeof updates.groomName === "string" &&
        updates.groomName !== owned.groomName);

    if (nameChanged) {
      const hasGuests = await Guest.exists({ invitation: id });
      if (!hasGuests) {
        // No one has RSVP'd yet, so nothing depends on the current link —
        // regenerate the slug to match the couple's updated names.
        updates.slug = buildInvitationSlug(
          updates.brideName ?? owned.brideName,
          updates.groomName ?? owned.groomName,
        );
      }
      // Once guests exist, keep the current slug so already-shared links
      // don't silently break underneath someone who bookmarked it.
    }

    const invitation = await Invitation.findByIdAndUpdate(
      id,
      { $set: updates },
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({ invitation });
  } catch (err) {
    return handleApiError(err);
  }
}

// DELETE /api/invitations/:id
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    await dbConnect();
    const owned = await findOwnedInvitation(user, id);
    if (!owned) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 },
      );
    }

    await Invitation.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
