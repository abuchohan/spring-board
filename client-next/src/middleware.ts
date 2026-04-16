import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hasCookie = request.cookies.has("session_id");
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith("/dashboard");
  const isAuthPage = /^\/(login|register|forgot-password|reset-password)/.test(pathname);

  if (isProtected && !hasCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isAuthPage && hasCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
