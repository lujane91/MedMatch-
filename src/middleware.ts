import { NextResponse, type NextRequest } from "next/server";
import {
  PLATFORM_ADMIN_INTERNAL_SEGMENT,
  getAdminIdleMinutes,
  getAdminPublicBasePath,
  getAdminRouteSegment,
} from "@/lib/platform-admin/config";
import { recordSecurityEvent } from "@/lib/platform-admin/security-log";
import {
  PLATFORM_ADMIN_COOKIE,
  touchAdminSession,
  verifyAdminSessionToken,
} from "@/lib/platform-admin/session";

function isPublicAdminRelative(relativePath: string): boolean {
  const path = relativePath || "/";
  return (
    path === "/sign-in" ||
    path === "/access-denied" ||
    path === "/forgot-password" ||
    path.startsWith("/sign-in/") ||
    path.startsWith("/access-denied/") ||
    path.startsWith("/forgot-password/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSegment = getAdminRouteSegment();
  const publicBase = getAdminPublicBasePath();
  const internalBase = `/${PLATFORM_ADMIN_INTERNAL_SEGMENT}`;

  // Never allow the internal implementation path to be used directly.
  if (pathname === internalBase || pathname.startsWith(`${internalBase}/`)) {
    recordSecurityEvent({
      type: "unauthorized_access",
      path: pathname,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
      userAgent: request.headers.get("user-agent") || undefined,
      detail: "Direct access to internal admin implementation path blocked.",
    });
    const denied = request.nextUrl.clone();
    denied.pathname = `${publicBase}/access-denied`;
    return NextResponse.redirect(denied);
  }

  const isAdminPath =
    pathname === `/${adminSegment}` ||
    pathname.startsWith(`/${adminSegment}/`);

  if (!isAdminPath) {
    return NextResponse.next();
  }

  const relative =
    pathname === `/${adminSegment}`
      ? ""
      : pathname.slice(`/${adminSegment}`.length);
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = `${internalBase}${relative || ""}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-medmatch-admin-base", publicBase);

  const rewriteResponse = NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  });

  if (isPublicAdminRelative(relative || "/")) {
    return rewriteResponse;
  }

  const token = request.cookies.get(PLATFORM_ADMIN_COOKIE)?.value;
  const session = await verifyAdminSessionToken(token);

  if (!session) {
    recordSecurityEvent({
      type: token ? "session_expired" : "unauthorized_access",
      path: pathname,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
      userAgent: request.headers.get("user-agent") || undefined,
      detail: token
        ? "Expired or invalid admin session redirected to sign-in."
        : "Unauthenticated access attempt to protected admin route.",
    });
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `${publicBase}/sign-in`;
    loginUrl.searchParams.set("next", pathname);
    if (token) loginUrl.searchParams.set("reason", "expired");
    const redirect = NextResponse.redirect(loginUrl);
    redirect.cookies.set(PLATFORM_ADMIN_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return redirect;
  }

  try {
    const refreshed = await touchAdminSession(session);
    rewriteResponse.cookies.set(PLATFORM_ADMIN_COOKIE, refreshed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getAdminIdleMinutes() * 60,
    });
  } catch {
    // keep prior cookie
  }

  return rewriteResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|institutions/|.*\\..*).*)",
  ],
};
