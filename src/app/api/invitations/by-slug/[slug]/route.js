import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { handleApiError } from "@/lib/apiError";
import Invitation from "@/models/Invitation";

// GET /api/invitations/by-slug/:slug — public read used by the guest-facing
// shared invitation link (e.g. zewd.app/i/selam-and-dawit-x8k2p)
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    await dbConnect();

    const invitation = await Invitation.findOne({ slug });
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
