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
  DEFAULT_PLATFORM_SUBSCRIPTION_PLAN,
  DEMO_PLATFORM_SUBSCRIBERS,
  type PlatformSubscriberRecord,
  type PlatformSubscriptionPlan,
} from "@/data/platform-subscription-plan";

const STORAGE_KEY = "medmatch-platform-subscription-plan-v2";

type PersistedState = {
  plan: PlatformSubscriptionPlan;
  subscribers: PlatformSubscriberRecord[];
};

type PlanStoreValue = {
  hydrated: boolean;
  plan: PlatformSubscriptionPlan;
  subscribers: PlatformSubscriberRecord[];
  /** Live plan used by student registration/payment when status is Active. */
  activePlan: PlatformSubscriptionPlan;
  savePlan: (plan: PlatformSubscriptionPlan) => void;
  updateRenewalReminders: (days: number[]) => void;
};

const PlanContext = createContext<PlanStoreValue | null>(null);

function normalizePlan(
  value: Partial<PlatformSubscriptionPlan> | null | undefined,
): PlatformSubscriptionPlan {
  const base = DEFAULT_PLATFORM_SUBSCRIPTION_PLAN;
  if (!value) return { ...base, features: [...base.features], renewalReminderDays: [...base.renewalReminderDays] };
  const reminders = Array.isArray(value.renewalReminderDays)
    ? value.renewalReminderDays
        .map((d) => Number(d))
        .filter((d) => Number.isFinite(d) && d > 0)
        .sort((a, b) => b - a)
    : [...base.renewalReminderDays];
  return {
    planName: (value.planName ?? base.planName).trim() || base.planName,
    price:
      typeof value.price === "number" && value.price >= 0
        ? value.price
        : base.price,
    currency: "SAR",
    durationMonths:
      typeof value.durationMonths === "number" && value.durationMonths > 0
        ? Math.round(value.durationMonths)
        : base.durationMonths,
    status: value.status === "Inactive" ? "Inactive" : "Active",
    features:
      Array.isArray(value.features) && value.features.length > 0
        ? value.features
        : [...base.features],
    renewalReminderDays:
      reminders.length > 0 ? reminders : [...base.renewalReminderDays],
  };
}

function readStored(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        plan: normalizePlan(DEFAULT_PLATFORM_SUBSCRIPTION_PLAN),
        subscribers: DEMO_PLATFORM_SUBSCRIBERS,
      };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      plan: normalizePlan(parsed.plan),
      subscribers:
        Array.isArray(parsed.subscribers) && parsed.subscribers.length > 0
          ? parsed.subscribers
          : DEMO_PLATFORM_SUBSCRIBERS,
    };
  } catch {
    return {
      plan: normalizePlan(DEFAULT_PLATFORM_SUBSCRIPTION_PLAN),
      subscribers: DEMO_PLATFORM_SUBSCRIBERS,
    };
  }
}

export function PlatformSubscriptionPlanProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [plan, setPlan] = useState<PlatformSubscriptionPlan>(() =>
    normalizePlan(DEFAULT_PLATFORM_SUBSCRIPTION_PLAN),
  );
  const [subscribers, setSubscribers] = useState<PlatformSubscriberRecord[]>(
    DEMO_PLATFORM_SUBSCRIBERS,
  );

  useEffect(() => {
    const stored = readStored();
    queueMicrotask(() => {
      setPlan(stored.plan);
      setSubscribers(stored.subscribers);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ plan, subscribers } satisfies PersistedState),
    );
  }, [hydrated, plan, subscribers]);

  const savePlan = useCallback((next: PlatformSubscriptionPlan) => {
    setPlan(normalizePlan(next));
  }, []);

  const updateRenewalReminders = useCallback((days: number[]) => {
    setPlan((prev) =>
      normalizePlan({
        ...prev,
        renewalReminderDays: days,
      }),
    );
  }, []);

  const activePlan = useMemo(() => {
    // Inactive plans still expose config for admin editing; student checkout
    // should treat inactive as unavailable — callers check plan.status.
    return plan;
  }, [plan]);

  const value = useMemo<PlanStoreValue>(
    () => ({
      hydrated,
      plan,
      subscribers,
      activePlan,
      savePlan,
      updateRenewalReminders,
    }),
    [
      activePlan,
      hydrated,
      plan,
      savePlan,
      subscribers,
      updateRenewalReminders,
    ],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlatformSubscriptionPlanStore() {
  const ctx = useContext(PlanContext);
  if (!ctx) {
    throw new Error(
      "usePlatformSubscriptionPlanStore must be used within PlatformSubscriptionPlanProvider",
    );
  }
  return ctx;
}
