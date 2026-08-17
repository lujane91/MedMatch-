import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { BackToDashboard, PageHeader } from "@/components/PageChrome";
import { Badge, Caption, Card } from "@/components/ui";
import { Bell } from "@/components/ui/icons";
import { notifications } from "@/data/mock";

export default function NotificationsPage() {
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-8 mm-animate-fade-up">
        <PageHeader
          eyebrow="Updates"
          title="Notifications"
          description={`${unread} unread updates across your applications and matches.`}
          action={<Badge tone="teal">{notifications.length} total</Badge>}
        />

        <Card className="divide-y divide-mm-border overflow-hidden p-0">
          {notifications.map((notification) => (
            <Link
              key={notification.id}
              href={notification.href}
              className={`flex gap-4 px-5 py-5 transition-colors duration-[var(--mm-duration)] hover:bg-mm-gray-50 sm:px-6 ${
                notification.unread ? "bg-mm-teal-50/40" : ""
              }`}
            >
              <div
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--mm-radius-md)] ${
                  notification.unread
                    ? "bg-mm-teal text-white"
                    : "bg-mm-gray-100 text-mm-gray-500"
                }`}
              >
                <Bell size={18} strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[0.9375rem] font-semibold text-mm-navy">
                    {notification.title}
                  </p>
                  {notification.unread ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-mm-teal" />
                  ) : null}
                </div>
                <p className="mt-1 text-[0.875rem] leading-relaxed text-mm-text-secondary">
                  {notification.message}
                </p>
                <Caption className="mt-2">{notification.time}</Caption>
              </div>
            </Link>
          ))}
        </Card>

        <BackToDashboard />
      </div>
    </AppShell>
  );
}
