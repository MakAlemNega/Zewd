import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { handleApiError } from "@/lib/apiError";

// GET /api/users — the signed-in account only. Account creation now happens
// through /api/auth/register (which also starts a session); there's no
// admin panel in this app, so there's no legitimate reason to list every
// user in the database.
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    return handleApiError(err);
  }
}
