import { NextResponse } from "next/server";
import { PLATFORM_ADMIN_COOKIE } from "@/lib/platform-admin/config";
import { recordSecurityEvent } from "@/lib/platform-admin/security-log";
import { verifyAdminSessionToken } from "@/lib/platform-admin/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${PLATFORM_ADMIN_COOKIE}=`))
    ?.slice(PLATFORM_ADMIN_COOKIE.length + 1);

  const session = await verifyAdminSessionToken(token);
  if (session) {
    recordSecurityEvent({
      type: "logout",
      email: session.email,
      detail: "Administrator signed out.",
    });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(PLATFORM_ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
