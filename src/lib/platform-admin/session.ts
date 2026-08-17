import {
  PLATFORM_ADMIN_COOKIE,
  getAdminIdleMinutes,
  getAdminSessionSecret,
  isApprovedAdminRole,
  type PlatformAdminRole,
} from "@/lib/platform-admin/config";

export type PlatformAdminSession = {
  sub: string;
  email: string;
  name: string;
  role: PlatformAdminRole;
  iat: number;
  exp: number;
  lastActivity: number;
};

function bytesToBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < arr.length; i += 1) {
    binary += String.fromCharCode(arr[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signPayload(payloadB64: string, secret: string): Promise<string> {
  const key = await importHmacKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64),
  );
  return bytesToBase64Url(sig);
}

export async function createAdminSessionToken(
  input: Omit<PlatformAdminSession, "iat" | "exp" | "lastActivity"> & {
    idleMinutes?: number;
  },
): Promise<string> {
  const secret = getAdminSessionSecret();
  if (!secret) {
    throw new Error("Admin session secret is not configured.");
  }
  const now = Math.floor(Date.now() / 1000);
  const idleSeconds = (input.idleMinutes ?? getAdminIdleMinutes()) * 60;
  const session: PlatformAdminSession = {
    sub: input.sub,
    email: input.email,
    name: input.name,
    role: input.role,
    iat: now,
    exp: now + idleSeconds,
    lastActivity: now,
  };
  const payloadB64 = bytesToBase64Url(
    new TextEncoder().encode(JSON.stringify(session)),
  );
  const signature = await signPayload(payloadB64, secret);
  return `${payloadB64}.${signature}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined | null,
): Promise<PlatformAdminSession | null> {
  if (!token) return null;
  const secret = getAdminSessionSecret();
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;
  if (!payloadB64 || !signature) return null;

  const expected = await signPayload(payloadB64, secret);
  const a = new TextEncoder().encode(signature);
  const b = new TextEncoder().encode(expected);
  if (a.length !== b.length) return null;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i]! ^ b[i]!;
  if (diff !== 0) return null;

  try {
    const json = new TextDecoder().decode(base64UrlToBytes(payloadB64));
    const parsed = JSON.parse(json) as PlatformAdminSession;
    if (!parsed?.email || !isApprovedAdminRole(parsed.role)) return null;
    const now = Math.floor(Date.now() / 1000);
    if (parsed.exp < now) return null;
    if (parsed.lastActivity + getAdminIdleMinutes() * 60 < now) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Sliding idle expiry — issue a refreshed token after activity. */
export async function touchAdminSession(
  session: PlatformAdminSession,
): Promise<string> {
  return createAdminSessionToken({
    sub: session.sub,
    email: session.email,
    name: session.name,
    role: session.role,
  });
}

export function adminSessionCookieOptions(maxAgeSeconds: number) {
  return {
    name: PLATFORM_ADMIN_COOKIE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export async function hashPasswordForCompare(
  password: string,
  pepper: string,
): Promise<string> {
  const data = new TextEncoder().encode(`${pepper}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bytesToBase64Url(digest);
}

export async function passwordsMatch(
  provided: string,
  expected: string,
  pepper: string,
): Promise<boolean> {
  if (!provided || !expected) return false;
  // Support either a precomputed hash (prefix `sha256:`) or raw env password.
  if (expected.startsWith("sha256:")) {
    const hash = await hashPasswordForCompare(provided, pepper);
    return timingSafeEqualString(hash, expected.slice("sha256:".length));
  }
  return timingSafeEqualString(provided, expected);
}

function timingSafeEqualString(a: string, b: string): boolean {
  const aa = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  if (aa.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < aa.length; i += 1) diff |= aa[i]! ^ bb[i]!;
  return diff === 0;
}

export { PLATFORM_ADMIN_COOKIE };
