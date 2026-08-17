"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Building2,
  CreditCard,
  LayoutDashboard,
  Shield,
  Users,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { usePlatformAdminBasePath } from "@/components/platform-admin/PlatformAdminBaseProvider";
import type { PlatformAdminRole } from "@/lib/platform-admin/config";
import { cn } from "@/lib/cn";

type AdminIdentity = {
  name: string;
  email: string;
  role: PlatformAdminRole | string;
};

const AdminSessionContext = createContext<AdminIdentity | null>(null);

export function usePlatformAdminSession() {
  return useContext(AdminSessionContext);
}

const NAV_ITEMS: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { href: "", label: "Overview", icon: LayoutDashboard },
  { href: "/subscriptions", label: "Subscription Management", icon: CreditCard },
  { href: "/hospitals", label: "Hospitals", icon: Building2 },
  { href: "/students", label: "Students", icon: Users },
  { href: "/security-log", label: "Security Activity", icon: Shield },
];

export function PlatformAdminShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const basePath = usePlatformAdminBasePath();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminIdentity | null>(null);
  const [ready, setReady] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch("/api/platform-admin/session", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) {
        void fetch("/api/platform-admin/unauthorized", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            path: window.location.pathname,
            detail: "Client session check failed on protected admin page.",
          }),
        });
        window.location.href = `${basePath}/sign-in?reason=expired`;
        return;
      }
      const data = (await res.json()) as { admin: AdminIdentity };
      setAdmin(data.admin);
      setReady(true);
    } catch {
      window.location.href = `${basePath}/sign-in?reason=expired`;
    }
  }, [basePath]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  async function logout() {
    await fetch("/api/platform-admin/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = `${basePath}/sign-in`;
  }

  const nav = useMemo(() => {
    const normalizedPath = pathname.startsWith("/platform-admin")
      ? pathname.replace("/platform-admin", basePath)
      : pathname;

    return NAV_ITEMS.map((item) => {
      const href = `${basePath}${item.href}`;
      const active =
        item.href === ""
          ? normalizedPath === basePath || normalizedPath === `${basePath}/`
          : normalizedPath === href || normalizedPath.startsWith(`${href}/`);
      return { ...item, href, active };
    });
  }, [basePath, pathname]);

  if (!ready || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mm-bg">
        <p className="text-sm text-mm-text-muted">
          Verifying administration access…
        </p>
      </div>
    );
  }

  return (
    <AdminSessionContext.Provider value={admin}>
      <div className="min-h-screen bg-mm-bg">
        <header className="border-b border-mm-border bg-mm-surface/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-4">
              <Logo href={basePath} />
              <div className="min-w-0 border-l border-mm-border pl-4">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-mm-teal">
                  Platform Administration
                </p>
                {title ? (
                  <p className="truncate text-sm font-semibold text-mm-navy">
                    {title}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-mm-navy">{admin.name}</p>
                <p className="text-[0.75rem] text-mm-text-muted">{admin.role}</p>
              </div>
              <button
                type="button"
                onClick={() => void logout()}
                className="inline-flex min-h-10 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-sm font-semibold text-mm-navy transition-colors hover:bg-mm-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
          <nav
            className="mx-auto flex max-w-6xl touch-pan-x gap-1 overflow-x-auto overscroll-x-contain px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:thin] sm:px-6"
            aria-label="Platform admin"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[var(--mm-radius-lg)] px-3 py-2 text-sm font-medium transition-colors",
                  item.active
                    ? "bg-mm-teal-50 text-mm-teal-700"
                    : "text-mm-text-secondary hover:bg-mm-gray-50 hover:text-mm-navy",
                )}
              >
                <item.icon size={16} strokeWidth={1.75} aria-hidden />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
        <footer className="border-t border-mm-border py-4 text-center text-[0.75rem] text-mm-text-muted">
          MedJourney Platform Administration · Restricted access
        </footer>
      </div>
    </AdminSessionContext.Provider>
  );
}
