export type SecurityLogEvent = {
  id: string;
  at: string;
  type:
    | "login_success"
    | "login_failure"
    | "login_lockout"
    | "unauthorized_access"
    | "session_expired"
    | "logout";
  email?: string;
  path?: string;
  ip?: string;
  userAgent?: string;
  detail?: string;
};

type Store = {
  events: SecurityLogEvent[];
  failures: Map<string, { count: number; lockedUntil: number }>;
};

function getStore(): Store {
  const g = globalThis as typeof globalThis & {
    __medmatchAdminSecurity?: Store;
  };
  if (!g.__medmatchAdminSecurity) {
    g.__medmatchAdminSecurity = {
      events: [],
      failures: new Map(),
    };
  }
  return g.__medmatchAdminSecurity;
}

export function recordSecurityEvent(
  event: Omit<SecurityLogEvent, "id" | "at"> & { at?: string },
): SecurityLogEvent {
  const store = getStore();
  const entry: SecurityLogEvent = {
    id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: event.at ?? new Date().toISOString(),
    type: event.type,
    email: event.email,
    path: event.path,
    ip: event.ip,
    userAgent: event.userAgent,
    detail: event.detail,
  };
  store.events.unshift(entry);
  if (store.events.length > 500) store.events.length = 500;
  return entry;
}

export function listSecurityEvents(limit = 100): SecurityLogEvent[] {
  return getStore().events.slice(0, limit);
}

export function getFailureState(key: string) {
  return getStore().failures.get(key.toLowerCase());
}

export function registerFailedLogin(
  key: string,
  maxAttempts: number,
  lockoutMinutes: number,
): { locked: boolean; remaining: number } {
  const store = getStore();
  const normalized = key.toLowerCase();
  const now = Date.now();
  const current = store.failures.get(normalized);
  if (current && current.lockedUntil > now) {
    return { locked: true, remaining: 0 };
  }
  const count = (current && current.lockedUntil <= now ? 0 : current?.count ?? 0) + 1;
  if (count >= maxAttempts) {
    store.failures.set(normalized, {
      count,
      lockedUntil: now + lockoutMinutes * 60 * 1000,
    });
    return { locked: true, remaining: 0 };
  }
  store.failures.set(normalized, { count, lockedUntil: 0 });
  return { locked: false, remaining: Math.max(0, maxAttempts - count) };
}

export function clearFailedLogins(key: string) {
  getStore().failures.delete(key.toLowerCase());
}

export function isLoginLocked(key: string): boolean {
  const state = getFailureState(key);
  if (!state) return false;
  return state.lockedUntil > Date.now();
}
