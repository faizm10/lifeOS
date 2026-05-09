import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("better-auth.session_token");
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
