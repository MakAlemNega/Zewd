import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { handleApiError } from "@/lib/apiError";
import User from "@/models/User";

// GET /api/users/:id
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    return handleApiError(err);
  }
}

// PATCH /api/users/:id — update name/email (password changes are out of
// scope here; that belongs to a dedicated auth flow later)
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { name, email } = await request.json();

    await dbConnect();
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { name, email } },
      { returnDocument: "after", runValidators: true },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    return handleApiError(err);
  }
}

// DELETE /api/users/:id
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
