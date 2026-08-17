/**
 * Platform Admin configuration (server-side).
 * Change values via environment variables — never commit secrets.
 */

export const PLATFORM_ADMIN_ROLES = [
  "Owner",
  "Administrator",
  "Finance",
  "Support",
  "Read Only",
] as const;

export type PlatformAdminRole = (typeof PLATFORM_ADMIN_ROLES)[number];

/** Internal App Router segment (never expose as the public URL). */
export const PLATFORM_ADMIN_INTERNAL_SEGMENT = "platform-admin";

export const PLATFORM_ADMIN_COOKIE = "mm_platform_admin_session";

export function getAdminRouteSegment(): string {
  const raw = process.env.MEDMATCH_ADMIN_ROUTE?.trim() || "medmatch-control";
  return raw.replace(/^\/+|\/+$/g, "") || "medmatch-control";
}

export function getAdminPublicBasePath(): string {
  return `/${getAdminRouteSegment()}`;
}

export function getAdminSessionSecret(): string {
  const secret = process.env.MEDMATCH_ADMIN_SESSION_SECRET?.trim();
  if (secret && secret.length >= 32) return secret;
  // Dev fallback only — production must set MEDMATCH_ADMIN_SESSION_SECRET.
  if (process.env.NODE_ENV !== "production") {
    return "medmatch-dev-admin-session-secret-min-32-chars";
  }
  return "";
}

export function getAdminIdleMinutes(): number {
  const parsed = Number(process.env.MEDMATCH_ADMIN_SESSION_IDLE_MINUTES ?? "30");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
}

export function getAdminMaxFailedAttempts(): number {
  const parsed = Number(process.env.MEDMATCH_ADMIN_MAX_FAILED_ATTEMPTS ?? "5");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
}

export function getAdminLockoutMinutes(): number {
  const parsed = Number(process.env.MEDMATCH_ADMIN_LOCKOUT_MINUTES ?? "15");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 15;
}

export function getOwnerEmail(): string {
  return (process.env.MEDMATCH_OWNER_EMAIL ?? "").trim().toLowerCase();
}

export function getOwnerName(): string {
  return (process.env.MEDMATCH_OWNER_NAME ?? "MedJourney Owner").trim();
}

/** Server-only owner password from env (never expose to the client). */
export function getOwnerPassword(): string {
  return process.env.MEDMATCH_OWNER_PASSWORD ?? "";
}

export function isApprovedAdminRole(
  role: string | null | undefined,
): role is PlatformAdminRole {
  return (
    typeof role === "string" &&
    (PLATFORM_ADMIN_ROLES as readonly string[]).includes(role)
  );
}

/** Placeholder hooks for future hardening (2FA, IP allowlist, etc.). */
export const PLATFORM_ADMIN_FUTURE_CONTROLS = {
  twoFactorAuth: false,
  loginVerificationCode: false,
  approvedEmailDomainRestriction: false,
  ipAllowlist: false,
  loginAttemptLimits: true,
  accountLockAfterFailures: true,
} as const;
