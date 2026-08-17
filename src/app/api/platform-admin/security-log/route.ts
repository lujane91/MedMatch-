import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PLATFORM_ADMIN_COOKIE } from "@/lib/platform-admin/config";
import { listSecurityEvents } from "@/lib/platform-admin/security-log";
import { verifyAdminSessionToken } from "@/lib/platform-admin/session";

export const runtime = "nodejs";

export async function GET() {
  const jar = await cookies();
  const session = await verifyAdminSessionToken(
    jar.get(PLATFORM_ADMIN_COOKIE)?.value,
  );

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (session.role !== "Owner" && session.role !== "Administrator") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  return NextResponse.json({ events: listSecurityEvents(100) });
}
