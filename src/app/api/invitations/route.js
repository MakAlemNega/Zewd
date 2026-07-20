import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { buildInvitationSlug } from "@/lib/slug";
import { handleApiError } from "@/lib/apiError";
import Invitation from "@/models/Invitation";

// GET /api/invitations — the signed-in user's own invitations
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const invitations = await Invitation.find({ owner: user._id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ invitations });
  } catch (err) {
    return handleApiError(err);
  }
}

// POST /api/invitations — create an invitation owned by the signed-in user.
// A shareable slug is generated from the couple's names unless one is
// explicitly provided.
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.brideName || !body.groomName) {
      return NextResponse.json(
        { error: "brideName and groomName are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const slug =
      body.slug || buildInvitationSlug(body.brideName, body.groomName);
    const invitation = await Invitation.create({
      ...body,
      slug,
      owner: user._id, // always derived from the session, never from the body
    });

    return NextResponse.json({ invitation }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
