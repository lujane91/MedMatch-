"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileBottomNav } from "./MobileBottomNav";
import { SubscriptionAccessGuard } from "@/components/subscription/SubscriptionAccessGuard";

export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <SubscriptionAccessGuard>
      <div className="flex min-h-screen bg-mm-bg">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar title={title} />
          <main className="flex-1 px-4 py-6 sm:py-8 lg:px-10 lg:py-10">
            {children}
          </main>
          <MobileBottomNav />
        </div>
      </div>
    </SubscriptionAccessGuard>
  );
}
