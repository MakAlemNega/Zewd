import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

// Note: as of Next.js 16 this file replaces the old `middleware.js`
// convention (renamed to "Proxy"; see node_modules/next/dist/docs/.../proxy.md).
export function proxy(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/create", "/create/:path*", "/dashboard", "/dashboard/:path*"],
};
