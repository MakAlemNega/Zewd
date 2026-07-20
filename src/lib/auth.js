import { cookies } from "next/headers";
import { dbConnect } from "./mongodb";
import { verifySessionToken, SESSION_COOKIE } from "./session";
import User from "@/models/User";

// Server Components and Route Handlers only — reads the session cookie via
// next/headers, so this can't be called from client components.
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) return null;

  await dbConnect();
  return User.findById(session.userId);
}
