import { formatSar } from "@/data/subscription";

export type PlatformPlanStatus = "Active" | "Inactive";

export type PlatformSubscriptionPlan = {
  planName: string;
  price: number;
  currency: "SAR";
  durationMonths: number;
  status: PlatformPlanStatus;
  features: string[];
  renewalReminderDays: number[];
};

export type SubscriberHistoryStatus =
  | "Active"
  | "Expired"
  | "Sponsored"
  | "Payment Waived"
  | "Refunded"
  | "Canceled";

export type PlatformSubscriberRecord = {
  id: string;
  studentName: string;
  studentId: string;
  university: string;
  planName: string;
  amountPaid: number;
  paymentDate: string;
  expiryDate: string;
  status: SubscriberHistoryStatus;
};

/** Default plan — editable in Platform Admin; used until owner saves changes. */
export const DEFAULT_PLATFORM_SUBSCRIPTION_PLAN: PlatformSubscriptionPlan = {
  planName: "MedJourney Monthly Subscription",
  price: 20,
  currency: "SAR",
  durationMonths: 1,
  status: "Active",
  features: [
    "Browse hospitals and specialties",
    "Apply for internship rotations",
    "Track applications",
    "Manage rotations",
    "Upload submissions",
    "View evaluations and certificates",
  ],
  renewalReminderDays: [30, 14, 7],
};

const FIRST_NAMES = [
  "Amina",
  "Omar",
  "Noura",
  "Khalid",
  "Sara",
  "Yousef",
  "Layla",
  "Faisal",
  "Reem",
  "Turki",
  "Hana",
  "Majed",
  "Lina",
  "Bader",
  "Maha",
  "Sami",
  "Joud",
  "Waleed",
  "Dana",
  "Hassan",
  "Mariam",
  "Anas",
  "Ghada",
  "Ibrahim",
  "Salma",
  "Nawaf",
  "Huda",
  "Ziad",
  "Rana",
  "Tariq",
];

const LAST_NAMES = [
  "Hassan",
  "Alqahtani",
  "Alharbi",
  "Alotaibi",
  "Alghamdi",
  "Alshehri",
  "Almutairi",
  "Alzahrani",
  "Alrashid",
  "Alangari",
  "Alhussein",
  "Alsaif",
  "Alfaraj",
  "Alnajjar",
  "Alenezi",
  "Alshammari",
  "Aldosari",
  "Aljohani",
];

const UNIVERSITIES = [
  "King Saud University",
  "King Abdulaziz University",
  "Princess Nourah University",
  "Alfaisal University",
  "Qassim University",
  "Taibah University",
  "King Khalid University",
  "Imam Abdulrahman Bin Faisal University",
  "Umm Al-Qura University",
  "King Faisal University",
];

function isoDaysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function buildDemoSubscribers(): PlatformSubscriberRecord[] {
  const total = 1000;
  const canceledCount = 200;
  const records: PlatformSubscriberRecord[] = [];
  const planName = DEFAULT_PLATFORM_SUBSCRIPTION_PLAN.planName;
  const price = DEFAULT_PLATFORM_SUBSCRIPTION_PLAN.price;

  for (let i = 1; i <= total; i += 1) {
    const first = FIRST_NAMES[(i - 1) % FIRST_NAMES.length]!;
    const last = LAST_NAMES[(i * 3) % LAST_NAMES.length]!;
    const university = UNIVERSITIES[(i * 5) % UNIVERSITIES.length]!;
    const studentName = `${first} ${last}`;
    const studentId = `STU-${String(2400 + i).padStart(4, "0")}`;

    let status: SubscriberHistoryStatus;
    if (i <= canceledCount) {
      status = "Canceled";
    } else {
      // Distribute the remaining 800 across other statuses.
      const bucket = (i - canceledCount) % 20;
      if (bucket < 14) status = "Active";
      else if (bucket < 17) status = "Expired";
      else if (bucket < 18) status = "Sponsored";
      else if (bucket < 19) status = "Payment Waived";
      else status = "Refunded";
    }

    const paid =
      status === "Sponsored" || status === "Payment Waived" ? 0 : price;
    const paymentOffset = 20 + ((i * 7) % 400);
    const paymentDate = isoDaysAgo(paymentOffset);
    const expiryDate =
      status === "Expired" || status === "Canceled" || status === "Refunded"
        ? isoDaysAgo(5 + (i % 60))
        : isoDaysFromNow(30 + (i % 300));

    records.push({
      id: `sub-hist-${i}`,
      studentName,
      studentId,
      university,
      planName,
      amountPaid: paid,
      paymentDate,
      expiryDate,
      status,
    });
  }

  return records;
}

/** Demo roster: 1,000 subscribers including 200 canceled. */
export const DEMO_PLATFORM_SUBSCRIBERS: PlatformSubscriberRecord[] =
  buildDemoSubscribers();

export function formatPlanPrice(
  plan: Pick<PlatformSubscriptionPlan, "price" | "currency">,
): string {
  if (plan.currency === "SAR") return formatSar(plan.price);
  return `${plan.currency} ${plan.price.toLocaleString("en-US")}`;
}

export function summarizeSubscribers(records: PlatformSubscriberRecord[]) {
  const active = records.filter((r) => r.status === "Active").length;
  const expired = records.filter((r) => r.status === "Expired").length;
  const canceled = records.filter((r) => r.status === "Canceled").length;
  const year = new Date().getFullYear();
  const revenueThisYear = records
    .filter((r) => {
      if (
        r.status === "Refunded" ||
        r.status === "Canceled" ||
        r.amountPaid <= 0
      ) {
        return false;
      }
      return new Date(r.paymentDate).getFullYear() === year;
    })
    .reduce((sum, r) => sum + r.amountPaid, 0);
  return { active, expired, canceled, revenueThisYear, total: records.length };
}
