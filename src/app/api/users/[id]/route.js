import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { handleApiError } from "@/lib/apiError";
import User from "@/models/User";

// All operations here are self-service only — a user may read/update/delete
// their own account, never anyone else's.
function assertSelf(user, id) {
  return user && user._id.toString() === id;
}

// GET /api/users/:id
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!assertSelf(user, id)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    return handleApiError(err);
  }
}

// PATCH /api/users/:id — update name/email (password changes are out of
// scope here; that belongs to a dedicated "change password" flow later)
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!assertSelf(currentUser, id)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { name, email } = await request.json();

    await dbConnect();
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { name, email } },
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({ user });
  } catch (err) {
    return handleApiError(err);
  }
}

// DELETE /api/users/:id
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!assertSelf(currentUser, id)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await dbConnect();
    await User.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
