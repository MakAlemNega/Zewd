import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyPassword } from "@/lib/password";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";
import { handleApiError } from "@/lib/apiError";

// POST /api/auth/login
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password are required" },
        { status: 400 },
      );
    }

    await dbConnect();
    const found = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordHash",
    );
    const valid = found && (await verifyPassword(password, found.passwordHash));

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const user = found.toObject();
    delete user.passwordHash;

    const response = NextResponse.json({ user });
    response.cookies.set(SESSION_COOKIE, createSessionToken(user._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (err) {
    return handleApiError(err);
  }
}
