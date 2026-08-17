"use client";

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
  addMonthsIso,
  canAccessInternshipDashboard,
  defaultStudentSubscription,
  generateInvoiceNumber,
  generateTransactionId,
  getDefaultSubscriptionPlanSnapshot,
  isSubscriptionExpiringSoon,
  type LiveSubscriptionPlanSnapshot,
  type PaymentMethod,
  type StudentSubscription,
} from "@/data/subscription";

const STORAGE_KEY = "medmatch-student-subscription-v1";

type SubscriptionStoreValue = {
  hydrated: boolean;
  subscription: StudentSubscription;
  canAccessDashboard: boolean;
  isExpiringSoon: boolean;
  markUnpaidProgress: (plan?: LiveSubscriptionPlanSnapshot) => void;
  resetForNewAccount: () => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  acceptTerms: () => void;
  beginPayment: (method: PaymentMethod) => void;
  completePaymentSuccess: (
    method: PaymentMethod,
    plan?: LiveSubscriptionPlanSnapshot,
  ) => StudentSubscription;
  completePaymentFailure: (method: PaymentMethod) => void;
  renewSubscription: (
    method: PaymentMethod,
    plan?: LiveSubscriptionPlanSnapshot,
  ) => StudentSubscription;
  resetPaymentAttempt: () => void;
  setExpiringSoonWindowDays: (days: number) => void;
};

const SubscriptionContext = createContext<SubscriptionStoreValue | null>(null);

function resolvePlan(
  plan?: LiveSubscriptionPlanSnapshot,
): LiveSubscriptionPlanSnapshot {
  return plan ?? getDefaultSubscriptionPlanSnapshot();
}

function normalizeSubscription(
  value: Partial<StudentSubscription> | null | undefined,
): StudentSubscription {
  const base = defaultStudentSubscription();
  if (!value) return base;
  const merged: StudentSubscription = {
    ...base,
    ...value,
    // Preserve historical plan/price on existing student records.
    planName: value.planName ?? base.planName,
    priceSar: value.priceSar ?? base.priceSar,
  };

  if (
    merged.accessStatus === "Active" ||
    merged.accessStatus === "Sponsored" ||
    merged.accessStatus === "Payment Waived"
  ) {
    if (merged.expiryDate) {
      const expiry = new Date(merged.expiryDate).getTime();
      if (Number.isFinite(expiry) && expiry < Date.now()) {
        merged.paymentStatus = "Expired";
      }
    }
  }

  return merged;
}

function readStored(): StudentSubscription {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStudentSubscription();
    return normalizeSubscription(
      JSON.parse(raw) as Partial<StudentSubscription>,
    );
  } catch {
    return defaultStudentSubscription();
  }
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [subscription, setSubscription] = useState<StudentSubscription>(
    defaultStudentSubscription,
  );
  const [expiringSoonWindowDays, setExpiringSoonWindowDays] = useState(30);

  useEffect(() => {
    const saved = readStored();
    queueMicrotask(() => {
      setSubscription(saved);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
  }, [hydrated, subscription]);

  const markUnpaidProgress = useCallback(
    (plan?: LiveSubscriptionPlanSnapshot) => {
      const live = resolvePlan(plan);
      setSubscription((prev) => ({
        ...prev,
        // Only stamp the live catalog plan when the student is not yet paid.
        planName:
          prev.accessStatus === "Active" ||
          prev.accessStatus === "Sponsored" ||
          prev.accessStatus === "Payment Waived"
            ? prev.planName
            : live.planName,
        priceSar:
          prev.accessStatus === "Active" ||
          prev.accessStatus === "Sponsored" ||
          prev.accessStatus === "Payment Waived"
            ? prev.priceSar
            : live.price,
        paymentStatus:
          prev.paymentStatus === "Paid" ||
          prev.accessStatus === "Sponsored" ||
          prev.accessStatus === "Payment Waived"
            ? prev.paymentStatus
            : "Unpaid",
        accessStatus:
          prev.accessStatus === "Active" ||
          prev.accessStatus === "Sponsored" ||
          prev.accessStatus === "Payment Waived"
            ? prev.accessStatus
            : "Inactive",
      }));
    },
    [],
  );

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setSubscription((prev) => ({ ...prev, paymentMethod: method }));
  }, []);

  const acceptTerms = useCallback(() => {
    setSubscription((prev) => ({
      ...prev,
      termsAcceptedAt: new Date().toISOString(),
    }));
  }, []);

  const beginPayment = useCallback((method: PaymentMethod) => {
    setSubscription((prev) => ({
      ...prev,
      paymentMethod: method,
      paymentStatus: "Processing",
    }));
  }, []);

  const completePaymentSuccess = useCallback(
    (method: PaymentMethod, plan?: LiveSubscriptionPlanSnapshot) => {
      const live = resolvePlan(plan);
      const now = new Date().toISOString();
      const startDate = now;
      const expiryDate = addMonthsIso(startDate, live.durationMonths);
      const next: StudentSubscription = {
        planName: live.planName,
        priceSar: live.price,
        paymentStatus: "Paid",
        accessStatus: "Active",
        paymentMethod: method,
        amountPaid: live.price,
        startDate,
        expiryDate,
        invoiceNumber: generateInvoiceNumber(),
        transactionId: generateTransactionId(),
        lastPaymentAt: now,
        termsAcceptedAt: now,
      };
      setSubscription(next);
      return next;
    },
    [],
  );

  const resetForNewAccount = useCallback(() => {
    setSubscription(defaultStudentSubscription());
  }, []);

  const completePaymentFailure = useCallback((method: PaymentMethod) => {
    setSubscription((prev) => {
      if (
        prev.accessStatus === "Active" ||
        prev.accessStatus === "Sponsored" ||
        prev.accessStatus === "Payment Waived"
      ) {
        return {
          ...prev,
          paymentMethod: method,
        };
      }
      return {
        ...prev,
        paymentMethod: method,
        paymentStatus: "Failed",
        accessStatus: "Inactive",
        amountPaid: null,
        startDate: null,
        expiryDate: null,
        invoiceNumber: null,
        transactionId: null,
        lastPaymentAt: null,
      };
    });
  }, []);

  const renewSubscription = useCallback(
    (method: PaymentMethod, plan?: LiveSubscriptionPlanSnapshot) => {
      const live = resolvePlan(plan);
      const now = new Date().toISOString();
      let next: StudentSubscription = defaultStudentSubscription();
      setSubscription((prev) => {
        const baseStart =
          prev.expiryDate && new Date(prev.expiryDate).getTime() > Date.now()
            ? prev.expiryDate
            : now;
        const expiryDate = addMonthsIso(baseStart, live.durationMonths);
        next = {
          ...prev,
          planName: live.planName,
          priceSar: live.price,
          paymentStatus: "Paid",
          accessStatus: "Active",
          paymentMethod: method,
          amountPaid: live.price,
          startDate: prev.startDate ?? now,
          expiryDate,
          invoiceNumber: generateInvoiceNumber(),
          transactionId: generateTransactionId(),
          lastPaymentAt: now,
          termsAcceptedAt: now,
        };
        return next;
      });
      return next;
    },
    [],
  );

  const resetPaymentAttempt = useCallback(() => {
    setSubscription((prev) => ({
      ...prev,
      paymentStatus:
        prev.accessStatus === "Active" ||
        prev.accessStatus === "Sponsored" ||
        prev.accessStatus === "Payment Waived"
          ? prev.paymentStatus
          : "Unpaid",
    }));
  }, []);

  const canAccessDashboard = useMemo(
    () => canAccessInternshipDashboard(subscription),
    [subscription],
  );

  const expiringSoon = useMemo(
    () => isSubscriptionExpiringSoon(subscription, expiringSoonWindowDays),
    [expiringSoonWindowDays, subscription],
  );

  const value = useMemo<SubscriptionStoreValue>(
    () => ({
      hydrated,
      subscription,
      canAccessDashboard,
      isExpiringSoon: expiringSoon,
      markUnpaidProgress,
      resetForNewAccount,
      setPaymentMethod,
      acceptTerms,
      beginPayment,
      completePaymentSuccess,
      completePaymentFailure,
      renewSubscription,
      resetPaymentAttempt,
      setExpiringSoonWindowDays,
    }),
    [
      acceptTerms,
      beginPayment,
      canAccessDashboard,
      completePaymentFailure,
      completePaymentSuccess,
      expiringSoon,
      hydrated,
      markUnpaidProgress,
      renewSubscription,
      resetForNewAccount,
      resetPaymentAttempt,
      setPaymentMethod,
      subscription,
    ],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionStore() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error(
      "useSubscriptionStore must be used within SubscriptionProvider",
    );
  }
  return ctx;
}
