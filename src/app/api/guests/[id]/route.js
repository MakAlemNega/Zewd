import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { handleApiError } from "@/lib/apiError";
import Guest from "@/models/Guest";

// GET /api/guests/:id
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const guest = await Guest.findById(id);
    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json({ guest });
  } catch (err) {
    return handleApiError(err);
  }
}

// PATCH /api/guests/:id — e.g. a guest changing their RSVP
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const updates = await request.json();
    delete updates.invitation; // an RSVP can't be reassigned to another invite

    await dbConnect();
    const guest = await Guest.findByIdAndUpdate(
      id,
      { $set: updates },
      { returnDocument: "after", runValidators: true },
    );

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json({ guest });
  } catch (err) {
    return handleApiError(err);
  }
}

// DELETE /api/guests/:id
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const guest = await Guest.findByIdAndDelete(id);
    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
