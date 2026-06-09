import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/console") && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    (pathname === "/login" || pathname === "/signup") &&
    sessionCookie
  ) {
    return NextResponse.redirect(new URL("/console", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/console/:path*", "/login", "/signup"],
};
