import type { Metadata } from "next";
import { headers } from "next/headers";
import { getAdminPublicBasePath } from "@/lib/platform-admin/config";
import { PlatformAdminBaseProvider } from "@/components/platform-admin/PlatformAdminBaseProvider";

export const metadata: Metadata = {
  title: {
    default: "MedJourney Administration",
    template: "%s | MedJourney Administration",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const basePath =
    headerList.get("x-medmatch-admin-base") || getAdminPublicBasePath();

  return (
    <PlatformAdminBaseProvider basePath={basePath}>
      <div className="min-h-screen bg-mm-bg text-mm-navy">{children}</div>
    </PlatformAdminBaseProvider>
  );
}
