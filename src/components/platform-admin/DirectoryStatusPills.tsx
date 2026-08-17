import { cn } from "@/lib/cn";
import type {
  HospitalApprovalStatus,
  PlatformAccountStatus,
} from "@/data/platform-directory";
import type { SubscriberHistoryStatus } from "@/data/platform-subscription-plan";

export function AccountStatusPill({
  status,
}: {
  status: PlatformAccountStatus;
}) {
  const styles: Record<PlatformAccountStatus, string> = {
    Active: "border-mm-teal/30 bg-mm-teal-50 text-mm-teal-700",
    Inactive: "border-mm-border bg-mm-gray-50 text-mm-text-muted",
    Suspended: "border-amber-200 bg-amber-50 text-amber-900",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-1 text-[0.75rem] font-semibold",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}

export function SubscriptionStatusPill({
  status,
}: {
  status: SubscriberHistoryStatus;
}) {
  const styles: Record<SubscriberHistoryStatus, string> = {
    Active: "border-mm-teal/30 bg-mm-teal-50 text-mm-teal-700",
    Expired: "border-mm-border bg-mm-gray-50 text-mm-text-muted",
    Sponsored: "border-sky-200 bg-sky-50 text-sky-800",
    "Payment Waived": "border-violet-200 bg-violet-50 text-violet-800",
    Refunded: "border-amber-200 bg-amber-50 text-amber-900",
    Canceled: "border-rose-200 bg-rose-50 text-rose-800",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-1 text-[0.75rem] font-semibold",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}

export function ApprovalStatusPill({
  status,
}: {
  status: HospitalApprovalStatus;
}) {
  const styles: Record<HospitalApprovalStatus, string> = {
    Approved: "border-mm-teal/30 bg-mm-teal-50 text-mm-teal-700",
    Pending: "border-amber-200 bg-amber-50 text-amber-900",
    Rejected: "border-rose-200 bg-rose-50 text-rose-800",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-1 text-[0.75rem] font-semibold",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
