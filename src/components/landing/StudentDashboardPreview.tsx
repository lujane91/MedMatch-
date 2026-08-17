import {
  Bell,
  Briefcase,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  UserRound,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Internship Year", icon: CalendarRange, active: false },
  { label: "Opportunities", icon: Briefcase, active: false },
  { label: "Applications", icon: ClipboardList, active: false },
  { label: "Notifications", icon: Bell, active: false },
  { label: "Profile", icon: UserRound, active: false },
];

const analytics = [
  { label: "Year Progress", value: "3 approved", detail: "8 planned rotations" },
  { label: "Upcoming", value: "Internal Med", detail: "Sep 1 → Sep 30" },
  { label: "Pending", value: "2", detail: "Awaiting review" },
  { label: "Profile", value: "92%", detail: "Almost complete" },
];

const applications = [
  {
    hospital: "King Fahad Medical City",
    specialty: "Internal Medicine",
    status: "Accepted" as const,
    logo: "/institutions/kfmc.png",
  },
  {
    hospital: "KFSH&RC",
    specialty: "Emergency Medicine",
    status: "Pending" as const,
    logo: "/institutions/kfshrc.svg",
  },
  {
    hospital: "JHAH",
    specialty: "Pediatrics",
    status: "Waitlisted" as const,
    logo: "/institutions/jhah.svg",
  },
];

const calendarDays = [
  { d: "1", on: false },
  { d: "2", on: false },
  { d: "3", on: true },
  { d: "4", on: true },
  { d: "5", on: true },
  { d: "6", on: false },
  { d: "7", on: false },
  { d: "8", on: true },
  { d: "9", on: true },
  { d: "10", on: false },
  { d: "11", on: false },
  { d: "12", on: true },
  { d: "13", on: true },
  { d: "14", on: true },
];

const timeline = [
  { label: "Application submitted", time: "Aug 12", done: true },
  { label: "Documents verified", time: "Aug 18", done: true },
  { label: "Hospital review", time: "Aug 24", done: true },
  { label: "Offer accepted", time: "Sep 1", done: false },
];

const statusStyles = {
  Accepted: "border-[#d8f3f1] bg-[#eefaf9] text-[#178f8a]",
  Pending: "border-[#fff7ed] bg-[#fff7ed] text-[#b45309]",
  Waitlisted: "border-[#e8eef4] bg-[#f2f6f9] text-[#1f5a84]",
};

/**
 * Static, non-interactive preview of the student dashboard for the landing hero.
 */
export function StudentDashboardPreview() {
  return (
    <div className="landing-dashboard-preview">
      <div className="landing-dashboard-chrome">
        <aside className="landing-dashboard-sidebar">
          <div className="landing-dashboard-brand">
            <span className="landing-dashboard-brand-mark" aria-hidden />
            <span className="landing-dashboard-brand-text">
              Med<span>Journey</span>
            </span>
          </div>
          <nav className="landing-dashboard-nav" aria-hidden>
            {navItems.map(({ label, icon: Icon, active }) => (
              <div
                key={label}
                className={`landing-dashboard-nav-item${active ? " is-active" : ""}`}
              >
                <Icon size={14} strokeWidth={1.75} />
                <span>{label}</span>
              </div>
            ))}
          </nav>
          <div className="landing-dashboard-user">
            <span className="landing-dashboard-avatar">AH</span>
            <div>
              <p>Amina Hassan</p>
              <p>Medicine · Intern</p>
            </div>
          </div>
        </aside>

        <div className="landing-dashboard-main">
          <header className="landing-dashboard-topbar">
            <p>Intern Dashboard</p>
            <div className="landing-dashboard-topbar-meta">
              <span className="landing-dashboard-bell">
                <Bell size={13} strokeWidth={1.75} />
                <i>3</i>
              </span>
              <span className="landing-dashboard-pill">92% profile</span>
            </div>
          </header>

          <div className="landing-dashboard-body">
            <div className="landing-dashboard-welcome">
              <div>
                <p className="landing-dashboard-eyebrow">Medicine · Intern</p>
                <h3>Welcome, Amina</h3>
                <p>Plan, apply for, and track your internship rotations.</p>
              </div>
              <div className="landing-dashboard-cta">
                <CalendarRange size={12} strokeWidth={2} />
                Manage Internship Year
              </div>
            </div>

            <div className="landing-dashboard-analytics">
              {analytics.map((card) => (
                <div key={card.label} className="landing-dashboard-stat">
                  <p>{card.label}</p>
                  <strong>{card.value}</strong>
                  <span>{card.detail}</span>
                </div>
              ))}
            </div>

            <div className="landing-dashboard-grid">
              <div className="landing-dashboard-panel">
                <div className="landing-dashboard-panel-head">
                  <h4>Applications</h4>
                  <span>3 active</span>
                </div>
                <ul className="landing-dashboard-apps">
                  {applications.map((app) => (
                    <li key={app.hospital}>
                      <div className="landing-dashboard-hospital-logo">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={app.logo} alt="" width={28} height={28} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-[#0E3A5D]">
                          {app.hospital}
                        </p>
                        <p className="truncate text-[0.625rem] text-[rgba(14,58,93,0.55)]">
                          {app.specialty}
                        </p>
                      </div>
                      <span
                        className={`landing-dashboard-status ${statusStyles[app.status]}`}
                      >
                        {app.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="landing-dashboard-panel">
                <div className="landing-dashboard-panel-head">
                  <h4>Rotation calendar</h4>
                  <span>September</span>
                </div>
                <div className="landing-dashboard-calendar">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <span key={d} className="landing-dashboard-cal-label">
                      {d}
                    </span>
                  ))}
                  {calendarDays.map((day, i) => (
                    <span
                      key={`${day.d}-${i}`}
                      className={`landing-dashboard-cal-day${day.on ? " is-on" : ""}`}
                    >
                      {day.d}
                    </span>
                  ))}
                </div>
                <div className="landing-dashboard-upcoming">
                  <CheckCircle2 size={12} className="text-[#1FA6A0]" />
                  <span>KFMC · Internal Medicine · Sep 1–30</span>
                </div>
              </div>
            </div>

            <div className="landing-dashboard-bottom">
              <div className="landing-dashboard-panel landing-dashboard-timeline">
                <div className="landing-dashboard-panel-head">
                  <h4>Timeline</h4>
                  <span>KFMC offer</span>
                </div>
                <ol>
                  {timeline.map((item) => (
                    <li key={item.label} className={item.done ? "is-done" : ""}>
                      <span className="landing-dashboard-dot" />
                      <div>
                        <p>{item.label}</p>
                        <time>{item.time}</time>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="landing-dashboard-panel landing-dashboard-notes">
                <div className="landing-dashboard-panel-head">
                  <h4>Notifications</h4>
                  <span>3 new</span>
                </div>
                <ul>
                  <li>
                    <strong>Accepted</strong>
                    <span>KFMC confirmed your September rotation.</span>
                  </li>
                  <li>
                    <strong>Document request</strong>
                    <span>KFSH&RC needs an updated CV.</span>
                  </li>
                  <li>
                    <strong>Waitlist update</strong>
                    <span>JHAH Pediatrics moved you to #2.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
