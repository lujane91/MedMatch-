/**
 * Shared MedJourney notification model for Research, Conferences,
 * Career, and Training prototype events.
 */

export type MedJourneyNotificationCategory =
  | "research"
  | "conferences"
  | "career"
  | "training"
  | "system";

export type MedJourneyNotification = {
  id: string;
  category: MedJourneyNotificationCategory;
  title: string;
  message: string;
  date: string;
  unread: boolean;
  relatedRecordId: string;
  actionHref: string;
};

export function createNotificationId() {
  return `nt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const SEED_NOTIFICATIONS: MedJourneyNotification[] = [
  {
    id: "nt_seed_research_1",
    category: "research",
    title: "Someone requested to join your research",
    message:
      "Layla Al Mutairi requested to join Medication Safety Handoffs in Internal Medicine Wards.",
    date: "Today",
    unread: true,
    relatedRecordId: "req-1",
    actionHref: "/research/research-2",
  },
  {
    id: "nt_seed_research_invite",
    category: "research",
    title: "You received a research invitation",
    message:
      "Omar Al Qahtani invited you to join Medication Safety Handoffs in Internal Medicine Wards.",
    date: "Today",
    unread: true,
    relatedRecordId: "research-2",
    actionHref: "/research/research-2",
  },
  {
    id: "nt_seed_conf_1",
    category: "conferences",
    title: "Conference match",
    message:
      "A new Internal Medicine conference was added in Saudi Arabia.",
    date: "Yesterday",
    unread: true,
    relatedRecordId: "conf-1",
    actionHref: "/conferences",
  },
  {
    id: "nt_seed_career_1",
    category: "career",
    title: "Career opportunity",
    message:
      "King Faisal Specialist Hospital posted a new Emergency Medicine opportunity.",
    date: "2 days ago",
    unread: false,
    relatedRecordId: "career-1",
    actionHref: "/career",
  },
  {
    id: "nt_seed_conf_2",
    category: "conferences",
    title: "Saved conference approaching",
    message: "A saved conference is approaching.",
    date: "3 days ago",
    unread: false,
    relatedRecordId: "conf-1",
    actionHref: "/conferences",
  },
  {
    id: "nt_seed_career_2",
    category: "career",
    title: "Career match",
    message:
      "A new Ministry of Health opportunity matches your preferences.",
    date: "4 days ago",
    unread: false,
    relatedRecordId: "career-2",
    actionHref: "/career",
  },
];
