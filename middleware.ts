import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const session =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token");
  const { pathname } = request.nextUrl;

  const isAuthPage   = pathname === "/login" || pathname === "/signup";
  const isPublic     = pathname === "/" || isAuthPage;
  const isDashboard  = pathname.startsWith("/dashboard");

  if (!session && isDashboard) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
