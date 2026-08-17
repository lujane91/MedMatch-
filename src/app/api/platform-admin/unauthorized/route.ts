import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PLATFORM_ADMIN_COOKIE } from "@/lib/platform-admin/config";
import { recordSecurityEvent } from "@/lib/platform-admin/security-log";
import { verifyAdminSessionToken } from "@/lib/platform-admin/session";

export const runtime = "nodejs";

/** Record unauthorized access attempts from the admin UI / guards. */
export async function POST(request: Request) {
  let body: { path?: string; detail?: string } = {};
  try {
    body = (await request.json()) as { path?: string; detail?: string };
  } catch {
    body = {};
  }

  const jar = await cookies();
  const session = await verifyAdminSessionToken(
    jar.get(PLATFORM_ADMIN_COOKIE)?.value,
  );

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";

  recordSecurityEvent({
    type: "unauthorized_access",
    email: session?.email,
    path: body.path,
    ip,
    userAgent: request.headers.get("user-agent") || "unknown",
    detail:
      body.detail ||
      (session
        ? `Authenticated user with role ${session.role} blocked.`
        : "Unauthenticated or unauthorized admin access attempt."),
  });

  return NextResponse.json({ ok: true });
}
