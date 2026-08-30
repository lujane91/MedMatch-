import type { Metadata, Viewport } from "next";
import {
  Instrument_Serif,
  Plus_Jakarta_Sans,
  Source_Serif_4,
} from "next/font/google";
import { DemoModeProvider } from "@/components/demo/DemoModeProvider";
import { DashboardFilterProvider } from "@/lib/dashboard-filter-store";
import { EvaluationProvider } from "@/lib/evaluation-store";
import { HospitalMonthProvider } from "@/lib/hospital-month-store";
import { HospitalSettingsProvider } from "@/lib/hospital-settings-store";
import { HospitalProvider } from "@/lib/hospital-store";
import { InternProvider } from "@/lib/intern-store";
import { PlatformDirectoryProvider } from "@/lib/platform-directory-store";
import { PlatformSubscriptionPlanProvider } from "@/lib/platform-subscription-plan-store";
import { RoleProvider } from "@/lib/role-store";
import { SubscriptionProvider } from "@/lib/subscription-store";
import { TrainingApplicationProvider } from "@/lib/training-application-store";
import "./globals.css";
import "@/components/demo/demo.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "MedJourney | Healthcare Training Opportunities",
    template: "%s | MedJourney",
  },
  description:
    "Discover, match, and apply to clinical training opportunities with MedJourney.",
  applicationName: "MedJourney",
  openGraph: {
    title: "MedJourney | Healthcare Training Opportunities",
    description:
      "Discover, match, and apply to clinical training opportunities with MedJourney.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "MedJourney | Healthcare Training Opportunities",
    description:
      "Discover, match, and apply to clinical training opportunities with MedJourney.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${sourceSerif.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans text-gray-900">
        <DemoModeProvider>
          <RoleProvider>
            <InternProvider>
              <TrainingApplicationProvider>
                <PlatformSubscriptionPlanProvider>
                  <PlatformDirectoryProvider>
                    <SubscriptionProvider>
                      <HospitalProvider>
                        <HospitalSettingsProvider>
                          <EvaluationProvider>
                            <HospitalMonthProvider>
                              <DashboardFilterProvider>
                                {children}
                              </DashboardFilterProvider>
                            </HospitalMonthProvider>
                          </EvaluationProvider>
                        </HospitalSettingsProvider>
                      </HospitalProvider>
                    </SubscriptionProvider>
                  </PlatformDirectoryProvider>
                </PlatformSubscriptionPlanProvider>
              </TrainingApplicationProvider>
            </InternProvider>
          </RoleProvider>
        </DemoModeProvider>
      </body>
    </html>
  );
}
