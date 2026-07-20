import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { buildInvitationSlug } from "@/lib/slug";
import { handleApiError } from "@/lib/apiError";
import Invitation from "@/models/Invitation";

// GET /api/invitations?owner=<userId> — list invitations, optionally scoped
// to an owner
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");

    await dbConnect();
    const query = owner ? { owner } : {};
    const invitations = await Invitation.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ invitations });
  } catch (err) {
    return handleApiError(err);
  }
}

// POST /api/invitations — create an invitation. A shareable slug is
// generated from the couple's names unless one is explicitly provided.
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.brideName || !body.groomName) {
      return NextResponse.json(
        { error: "brideName and groomName are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const slug = body.slug || buildInvitationSlug(body.brideName, body.groomName);
    const invitation = await Invitation.create({ ...body, slug });

    return NextResponse.json({ invitation }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
