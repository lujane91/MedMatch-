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
  createNotificationId,
  SEED_NOTIFICATIONS,
  type MedJourneyNotification,
  type MedJourneyNotificationCategory,
} from "@/data/medjourney-notifications";

const STORAGE_KEY = "medmatch-notifications-v1";

type NotificationStore = {
  hydrated: boolean;
  notifications: MedJourneyNotification[];
  unreadCount: number;
  addNotification: (
    input: Omit<MedJourneyNotification, "id" | "unread" | "date"> & {
      date?: string;
      unread?: boolean;
    },
  ) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const NotificationContext = createContext<NotificationStore | null>(null);

function load(): MedJourneyNotification[] {
  if (typeof window === "undefined") return SEED_NOTIFICATIONS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_NOTIFICATIONS;
    const parsed = JSON.parse(raw) as MedJourneyNotification[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : SEED_NOTIFICATIONS;
  } catch {
    return SEED_NOTIFICATIONS;
  }
}

export function MedJourneyNotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notifications, setNotifications] = useState<MedJourneyNotification[]>(
    SEED_NOTIFICATIONS,
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = load();
    queueMicrotask(() => {
      setNotifications(saved);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [hydrated, notifications]);

  const addNotification = useCallback(
    (
      input: Omit<MedJourneyNotification, "id" | "unread" | "date"> & {
        date?: string;
        unread?: boolean;
      },
    ) => {
      const next: MedJourneyNotification = {
        id: createNotificationId(),
        category: input.category,
        title: input.title,
        message: input.message,
        relatedRecordId: input.relatedRecordId,
        actionHref: input.actionHref,
        date: input.date ?? "Just now",
        unread: input.unread ?? true,
      };
      setNotifications((prev) => [next, ...prev]);
    },
    [],
  );

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: false } : item,
      ),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, unread: false })),
    );
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications],
  );

  const value = useMemo(
    () => ({
      hydrated,
      notifications,
      unreadCount,
      addNotification,
      markRead,
      markAllRead,
    }),
    [
      addNotification,
      hydrated,
      markAllRead,
      markRead,
      notifications,
      unreadCount,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useMedJourneyNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useMedJourneyNotifications must be used within MedJourneyNotificationProvider",
    );
  }
  return ctx;
}

export type { MedJourneyNotificationCategory };
