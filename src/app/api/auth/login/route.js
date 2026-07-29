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
import { rateLimit, rateLimitResponse } from "@/lib/rateLimit";

// POST /api/auth/login
export async function POST(request) {
  try {
    // Slows down credential-stuffing/brute-force attempts against a single
    // account without locking out a legitimate user retyping a password.
    const { allowed, retryAfterMs } = rateLimit(request, {
      key: "auth:login",
      limit: 10,
      windowMs: 15 * 60 * 1000,
    });
    if (!allowed) return rateLimitResponse(retryAfterMs);

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
