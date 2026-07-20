import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";
import { handleApiError } from "@/lib/apiError";
import User from "@/models/User";

// GET /api/users — list accounts (passwordHash is excluded by the schema)
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find().sort({ createdAt: -1 });
    return NextResponse.json({ users });
  } catch (err) {
    return handleApiError(err);
  }
}

// POST /api/users — create an account
// body: { name, email, password }
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "name, email, and password are required" },
        { status: 400 },
      );
    }

    await dbConnect();
    const passwordHash = await hashPassword(password);
    const created = await User.create({ name, email, passwordHash });

    // select: false only applies to queries, not documents just created in
    // this process, so strip the hash by hand before it goes over the wire.
    const user = created.toObject();
    delete user.passwordHash;

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
