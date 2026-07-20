import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { handleApiError } from "@/lib/apiError";
import Invitation from "@/models/Invitation";

// GET /api/invitations/:id
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const invitation = await Invitation.findById(id);
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
    const updates = await request.json();
    delete updates.slug; // slugs are immutable once shared

    await dbConnect();
    const invitation = await Invitation.findByIdAndUpdate(
      id,
      { $set: updates },
      { returnDocument: "after", runValidators: true },
    );

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

// DELETE /api/invitations/:id
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const invitation = await Invitation.findByIdAndDelete(id);
    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
