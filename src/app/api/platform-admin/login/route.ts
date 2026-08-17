import { NextResponse } from "next/server";
import {
  getAdminIdleMinutes,
  getAdminLockoutMinutes,
  getAdminMaxFailedAttempts,
  getAdminSessionSecret,
  getOwnerEmail,
  getOwnerName,
  getOwnerPassword,
} from "@/lib/platform-admin/config";
import {
  clearFailedLogins,
  isLoginLocked,
  recordSecurityEvent,
  registerFailedLogin,
} from "@/lib/platform-admin/security-log";
import {
  PLATFORM_ADMIN_COOKIE,
  createAdminSessionToken,
  passwordsMatch,
} from "@/lib/platform-admin/session";

export const runtime = "nodejs";

function clientMeta(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  return { ip, userAgent };
}

export async function POST(request: Request) {
  const { ip, userAgent } = clientMeta(request);

  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const ownerEmail = getOwnerEmail();
  const ownerPassword = getOwnerPassword();
  const secret = getAdminSessionSecret();

  if (!ownerEmail || !ownerPassword || !secret) {
    recordSecurityEvent({
      type: "login_failure",
      email,
      ip,
      userAgent,
      detail: "Admin owner credentials are not configured on the server.",
    });
    return NextResponse.json(
      { error: "Administration sign-in is temporarily unavailable." },
      { status: 503 },
    );
  }

  if (isLoginLocked(email) || isLoginLocked(ip)) {
    recordSecurityEvent({
      type: "login_lockout",
      email,
      ip,
      userAgent,
      detail: "Login blocked due to repeated failed attempts.",
    });
    return NextResponse.json(
      {
        error:
          "Too many failed attempts. Try again later or contact the MedJourney owner.",
      },
      { status: 429 },
    );
  }

  const emailOk = email === ownerEmail;
  const passwordOk = await passwordsMatch(password, ownerPassword, secret);
  const allowed = emailOk && passwordOk;

  if (!allowed) {
    const failEmail = registerFailedLogin(
      email,
      getAdminMaxFailedAttempts(),
      getAdminLockoutMinutes(),
    );
    registerFailedLogin(ip, getAdminMaxFailedAttempts(), getAdminLockoutMinutes());
    recordSecurityEvent({
      type: "login_failure",
      email,
      ip,
      userAgent,
      detail: failEmail.locked
        ? "Account locked after repeated failures."
        : "Invalid email or password.",
    });
    return NextResponse.json(
      {
        error: failEmail.locked
          ? "Too many failed attempts. Try again later."
          : "Invalid email or password.",
      },
      { status: failEmail.locked ? 429 : 401 },
    );
  }

  clearFailedLogins(email);
  clearFailedLogins(ip);

  const token = await createAdminSessionToken({
    sub: "owner-1",
    email: ownerEmail,
    name: getOwnerName(),
    role: "Owner",
  });

  recordSecurityEvent({
    type: "login_success",
    email: ownerEmail,
    ip,
    userAgent,
    detail: "Owner signed in to Platform Administration.",
  });

  const response = NextResponse.json({
    ok: true,
    admin: {
      email: ownerEmail,
      name: getOwnerName(),
      role: "Owner",
    },
  });

  response.cookies.set(PLATFORM_ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getAdminIdleMinutes() * 60,
  });

  return response;
}
