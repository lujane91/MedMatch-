import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  PLATFORM_ADMIN_COOKIE,
  getAdminIdleMinutes,
} from "@/lib/platform-admin/config";
import {
  touchAdminSession,
  verifyAdminSessionToken,
} from "@/lib/platform-admin/session";
import { recordSecurityEvent } from "@/lib/platform-admin/security-log";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const jar = await cookies();
  const token = jar.get(PLATFORM_ADMIN_COOKIE)?.value;
  const session = await verifyAdminSessionToken(token);

  if (!session) {
    if (token) {
      recordSecurityEvent({
        type: "session_expired",
        path: "/api/platform-admin/session",
        detail: "Session validation failed.",
      });
    }
    const response = NextResponse.json({ authenticated: false }, { status: 401 });
    response.cookies.set(PLATFORM_ADMIN_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  const refreshed = await touchAdminSession(session);
  const response = NextResponse.json({
    authenticated: true,
    admin: {
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
  response.cookies.set(PLATFORM_ADMIN_COOKIE, refreshed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getAdminIdleMinutes() * 60,
  });
  // Avoid unused request lint in some configs
  void request;
  return response;
}
