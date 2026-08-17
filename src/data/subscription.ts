import { DEFAULT_PLATFORM_SUBSCRIPTION_PLAN } from "@/data/platform-subscription-plan";

export type PaymentMethod = "mada" | "visa" | "mastercard" | "apple_pay";

export const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
}[] = [
  { id: "mada", label: "Mada" },
  { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "apple_pay", label: "Apple Pay" },
];

/** Account statuses that may enter the internship dashboard. */
export type SubscriptionAccessStatus =
  | "Active"
  | "Sponsored"
  | "Payment Waived";

export type SubscriptionPaymentStatus =
  | "Unpaid"
  | "Processing"
  | "Paid"
  | "Failed"
  | "Expired";

export type StudentSubscription = {
  planName: string;
  priceSar: number;
  paymentStatus: SubscriptionPaymentStatus;
  accessStatus: SubscriptionAccessStatus | "Inactive";
  paymentMethod: PaymentMethod | null;
  amountPaid: number | null;
  startDate: string | null;
  expiryDate: string | null;
  invoiceNumber: string | null;
  transactionId: string | null;
  lastPaymentAt: string | null;
  termsAcceptedAt: string | null;
};

export type LiveSubscriptionPlanSnapshot = {
  planName: string;
  price: number;
  durationMonths: number;
  currency?: string;
  features?: string[];
  shortName?: string;
};

/**
 * Fallback snapshot for SSR / pre-hydration only.
 * Runtime student flows should read the live plan from
 * PlatformSubscriptionPlanProvider (Platform Admin → Subscription Management).
 */
export function getDefaultSubscriptionPlanSnapshot(): LiveSubscriptionPlanSnapshot {
  const plan = DEFAULT_PLATFORM_SUBSCRIPTION_PLAN;
  return {
    planName: plan.planName,
    price: plan.price,
    durationMonths: plan.durationMonths,
    currency: plan.currency,
    features: [...plan.features],
    shortName: "Annual Subscription",
  };
}

export const defaultStudentSubscription = (): StudentSubscription => {
  const plan = getDefaultSubscriptionPlanSnapshot();
  return {
    planName: plan.planName,
    priceSar: plan.price,
    paymentStatus: "Unpaid",
    accessStatus: "Inactive",
    paymentMethod: null,
    amountPaid: null,
    startDate: null,
    expiryDate: null,
    invoiceNumber: null,
    transactionId: null,
    lastPaymentAt: null,
    termsAcceptedAt: null,
  };
};

export function paymentMethodLabel(method: PaymentMethod | null): string {
  if (!method) return "—";
  return PAYMENT_METHODS.find((item) => item.id === method)?.label ?? method;
}

export function formatSar(amount: number): string {
  return `SAR ${amount.toLocaleString("en-US")}`;
}

export function addMonthsIso(isoDate: string, months: number): string {
  const date = new Date(isoDate);
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result.toISOString();
}

export function formatSubscriptionDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Riyadh",
  }).format(new Date(iso));
}

export function generateInvoiceNumber(): string {
  const stamp = Date.now().toString().slice(-8);
  return `INV-MM-${stamp}`;
}

export function generateTransactionId(): string {
  const stamp = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `TXN-${stamp}`;
}

export function canAccessInternshipDashboard(
  subscription: StudentSubscription,
): boolean {
  if (
    subscription.accessStatus !== "Active" &&
    subscription.accessStatus !== "Sponsored" &&
    subscription.accessStatus !== "Payment Waived"
  ) {
    return false;
  }
  if (subscription.paymentStatus === "Expired") return false;
  if (subscription.expiryDate) {
    const expiry = new Date(subscription.expiryDate).getTime();
    if (Number.isFinite(expiry) && expiry < Date.now()) return false;
  }
  return true;
}

export function isSubscriptionExpiringSoon(
  subscription: StudentSubscription,
  withinDays = DEFAULT_PLATFORM_SUBSCRIPTION_PLAN.renewalReminderDays[0] ?? 30,
): boolean {
  if (!canAccessInternshipDashboard(subscription)) return false;
  if (!subscription.expiryDate) return false;
  const expiry = new Date(subscription.expiryDate).getTime();
  if (!Number.isFinite(expiry)) return false;
  const msLeft = expiry - Date.now();
  return msLeft > 0 && msLeft <= withinDays * 24 * 60 * 60 * 1000;
}

export function daysUntilExpiry(
  subscription: StudentSubscription,
): number | null {
  if (!subscription.expiryDate) return null;
  const expiry = new Date(subscription.expiryDate).getTime();
  if (!Number.isFinite(expiry)) return null;
  return Math.ceil((expiry - Date.now()) / (24 * 60 * 60 * 1000));
}
