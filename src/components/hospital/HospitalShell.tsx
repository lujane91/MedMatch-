"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Award,
  Bell,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Menu,
  Settings,
  Stethoscope,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { hospitalBaseFromPathname } from "@/lib/hospital-base-path";
import { useHospitalStore } from "@/lib/hospital-store";
import { Logo } from "@/components/Logo";
import {
  HospitalLogo,
  PageSkeleton,
} from "@/components/hospital/hospital-ui";

type NavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  comingSoon?: boolean;
};

/** Top-level hospital portal navigation. */
const HOSPITAL_NAV_ITEMS: NavItem[] = [
  {
    path: "",
    label: "Hospital Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    path: "/dashboard",
    label: "Internship",
    icon: Stethoscope,
  },
  {
    path: "/residency",
    label: "Residency",
    icon: GraduationCap,
    comingSoon: true,
  },
  {
    path: "/fellowship",
    label: "Fellowship",
    icon: Award,
    comingSoon: true,
  },
  { path: "/settings", label: "Settings", icon: Settings },
];

/** Internship module navigation — reconnects existing internship pages. */
const INTERNSHIP_NAV_ITEMS: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    path: "/specialties",
    label: "Programs & Capacity",
    icon: Layers,
  },
  {
    path: "/applications",
    label: "Applications",
    icon: ClipboardList,
  },
  { path: "/rotations", label: "Rotations", icon: CalendarDays },
];

/** Routes that belong to the Internship module workspace. */
const INTERNSHIP_CONTEXT_PATHS = [
  "/dashboard",
  "/internship",
  "/applications",
  "/specialties",
  "/rotations",
  "/rosters",
  "/accepted",
  "/rejected",
  "/waitlist",
  "/evaluations",
  "/analytics",
] as const;

function stripBase(pathname: string, base: string) {
  if (pathname === base || pathname === `${base}/`) return "";
  if (pathname.startsWith(`${base}/`)) return pathname.slice(base.length);
  return pathname;
}

function isInternshipContext(pathname: string, base: string) {
  const rel = stripBase(pathname, base);
  return INTERNSHIP_CONTEXT_PATHS.some(
    (path) => rel === path || rel.startsWith(`${path}/`),
  );
}

function isNavItemActive(
  pathname: string,
  item: NavItem,
  base: string,
  internshipMode: boolean,
) {
  const rel = stripBase(pathname, base);

  if (item.exact) {
    return rel === "" || rel === "/";
  }

  if (internshipMode) {
    if (item.path === "/dashboard") {
      return rel === "/dashboard" || rel.startsWith("/dashboard/");
    }
    if (item.path === "/applications") {
      return rel === "/applications" || rel.startsWith("/applications/");
    }
    if (item.path === "/rotations") {
      return (
        rel === "/rotations" ||
        rel.startsWith("/rotations/") ||
        rel === "/rosters" ||
        rel.startsWith("/rosters/")
      );
    }
    return rel === item.path || rel.startsWith(`${item.path}/`);
  }

  if (item.path === "/dashboard") {
    // Hospital-level "Internship" entry — active only while in internship pages
    // is handled by switching nav context, so keep inactive at hospital level.
    return false;
  }

  if (item.path === "/settings") {
    return (
      rel === "/settings" ||
      rel.startsWith("/settings/") ||
      rel === "/profile" ||
      rel.startsWith("/profile/") ||
      rel === "/team-access" ||
      rel.startsWith("/team-access/") ||
      rel === "/audit" ||
      rel.startsWith("/audit/")
    );
  }

  return rel === item.path || rel.startsWith(`${item.path}/`);
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  comingSoon,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  comingSoon?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-[var(--mm-radius-lg)] px-3.5 py-2.5 text-[0.875rem] font-medium transition-colors duration-[var(--mm-duration)]",
        active
          ? "bg-mm-teal-50 text-mm-teal-700"
          : "text-mm-text-secondary hover:bg-mm-gray-50 hover:text-mm-navy",
      )}
    >
      <Icon
        size={18}
        strokeWidth={1.75}
        className={active ? "text-mm-teal-700" : "text-mm-gray-400"}
        aria-hidden
      />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {comingSoon ? (
        <span className="shrink-0 rounded-full border border-mm-border bg-mm-white px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
          Soon
        </span>
      ) : null}
    </Link>
  );
}

function SidebarNav({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const base = hospitalBaseFromPathname(pathname);
  const homeHref = base;
  const internshipMode = isInternshipContext(pathname, base);
  const navItems = useMemo(() => {
    const source = internshipMode ? INTERNSHIP_NAV_ITEMS : HOSPITAL_NAV_ITEMS;
    return source.map((item) => ({ ...item, href: `${base}${item.path}` }));
  }, [base, internshipMode]);

  return (
    <nav
      className="flex flex-1 flex-col gap-1 overflow-y-auto p-3"
      aria-label={internshipMode ? "Internship admin" : "Hospital admin"}
    >
      {internshipMode ? (
        <Link
          href={homeHref}
          onClick={onNavigate}
          className="mb-2 flex items-center gap-2 rounded-[var(--mm-radius-lg)] px-3.5 py-2.5 text-[0.8125rem] font-semibold text-mm-teal-700 transition-colors hover:bg-mm-teal-50"
        >
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden />
          Back to Hospital Dashboard
        </Link>
      ) : null}
      {navItems.map((item) => (
        <NavLink
          key={item.href || "home"}
          href={item.href || homeHref}
          label={item.label}
          icon={item.icon}
          comingSoon={item.comingSoon}
          active={isNavItemActive(pathname, item, base, internshipMode)}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

function HospitalSidebar() {
  const pathname = usePathname();
  const base = hospitalBaseFromPathname(pathname);
  const homeHref = base;
  const { activeHospital } = useHospitalStore();
  const name = activeHospital?.name || "Hospital";
  const logo = activeHospital?.logo;

  return (
    <aside className="hidden w-[var(--mm-sidebar-width)] shrink-0 flex-col border-r border-mm-border bg-mm-surface lg:flex">
      <div className="flex h-[var(--mm-topnav-height)] items-center border-b border-mm-border px-5">
        <Logo href={homeHref} />
      </div>
      <SidebarNav />
      <div className="border-t border-mm-border p-4">
        <div className="flex items-center gap-3 rounded-[var(--mm-radius-lg)] p-2">
          <HospitalLogo src={logo} name={name} className="h-10 w-10" />
          <div className="min-w-0">
            <p className="truncate text-[0.875rem] font-semibold text-mm-navy">
              {name}
            </p>
            <p className="truncate text-[0.75rem] text-mm-text-muted">
              Hospital director
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function HospitalTopBar({
  title,
  headerActions,
  showHospitalIdentity = false,
}: {
  title?: string;
  headerActions?: React.ReactNode;
  showHospitalIdentity?: boolean;
}) {
  const pathname = usePathname();
  const base = hospitalBaseFromPathname(pathname);
  const isDemoMode = pathname.startsWith("/demo");
  const homeHref = base;
  const { notifications, activeHospitalId, activeHospital } =
    useHospitalStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter(
    (n) => n.hospitalId === activeHospitalId && !n.read,
  ).length;
  const hospitalName = activeHospital?.name ?? "Hospital";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [menuOpen]);

  return (
    <header
      className="sticky top-0 z-40 border-b border-mm-border bg-mm-surface/90 backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex h-[var(--mm-topnav-height)] items-center justify-between gap-4 px-4 sm:px-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative lg:hidden" ref={menuRef}>
            <button
              type="button"
              className="flex items-center justify-center rounded-[var(--mm-radius-md)] border border-mm-border bg-mm-white p-2 text-mm-navy transition-colors hover:bg-mm-gray-50"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X size={18} strokeWidth={1.75} />
              ) : (
                <Menu size={18} strokeWidth={1.75} />
              )}
            </button>
            {menuOpen ? (
              <div
                id={menuId}
                className="absolute left-0 top-12 z-30 max-h-[70vh] w-72 overflow-y-auto rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-white p-2 shadow-mm-md mm-slide-up"
              >
                <div className="mb-2 px-2 py-1">
                  <Logo href={homeHref} />
                </div>
                <SidebarNav onNavigate={() => setMenuOpen(false)} />
              </div>
            ) : null}
          </div>
          {showHospitalIdentity ? (
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <HospitalLogo
                src={activeHospital?.logo}
                name={hospitalName}
                className="h-9 w-9 rounded-[var(--mm-radius-md)] bg-mm-white sm:h-10 sm:w-10"
                imgClassName="p-1"
              />
              <h1 className="truncate text-lg font-semibold tracking-tight text-mm-navy lg:text-xl">
                {hospitalName}
              </h1>
            </div>
          ) : title ? (
            <h1 className="truncate text-lg font-semibold tracking-tight text-mm-navy lg:text-xl">
              {title}
            </h1>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {isDemoMode ? (
            <span className="hidden rounded-md border border-amber-300/80 bg-amber-100 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-amber-900 sm:inline-flex">
              Demo Mode
            </span>
          ) : (
            <span className="hidden rounded-full border border-mm-teal/25 bg-mm-teal-50 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-mm-teal-700 sm:inline-flex">
              Demo
            </span>
          )}
          {headerActions}
          <Link
            href={`${base}/notifications`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-[var(--mm-radius-md)] border border-mm-border bg-mm-white text-mm-navy transition-colors hover:bg-mm-gray-50"
            aria-label={
              unread > 0
                ? `Notifications, ${unread} unread`
                : "Notifications"
            }
          >
            <Bell size={18} strokeWidth={1.75} aria-hidden />
            {unread > 0 ? (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-mm-teal" />
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}

export function HospitalShell({
  children,
  title,
  headerActions,
  showHospitalIdentity = false,
}: {
  children: React.ReactNode;
  title?: string;
  headerActions?: React.ReactNode;
  /** When true, top nav shows hospital logo + name instead of the page title. */
  showHospitalIdentity?: boolean;
}) {
  const { hydrated } = useHospitalStore();

  return (
    <div className="flex min-h-screen bg-mm-bg">
      <a
        href="#hospital-main"
        className="absolute left-4 top-4 z-[60] -translate-y-16 rounded-[var(--mm-radius-md)] bg-mm-teal px-3 py-2 text-sm font-semibold text-white opacity-0 transition focus:translate-y-0 focus:opacity-100"
      >
        Skip to main content
      </a>
      <HospitalSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HospitalTopBar
          title={title}
          headerActions={headerActions}
          showHospitalIdentity={showHospitalIdentity}
        />
        <main
          id="hospital-main"
          className="flex-1 px-4 py-6 sm:px-5 sm:py-8 lg:px-10 lg:py-10"
        >
          {hydrated ? (
            <div className="mm-fade-in">{children}</div>
          ) : (
            <PageSkeleton />
          )}
        </main>
      </div>
    </div>
  );
}
