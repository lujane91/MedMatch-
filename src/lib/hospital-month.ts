import { monthLabel, type MonthKey } from "@/data/hospital-demo";

/** Demo rotation window spanning the selected calendar month. */
export function rotationDatesLabel(month: MonthKey, year: number): string {
  const monthIndex = Number(month) - 1;
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0);
  const fmt = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  return `${fmt(start)} – ${fmt(end)}`;
}

/** Demo application deadline: 15th of the previous month. */
export function applicationDeadlineLabel(month: MonthKey, year: number): string {
  const monthIndex = Number(month) - 1;
  const deadline = new Date(year, monthIndex - 1, 15);
  return deadline.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function selectedPeriodLabel(
  month: MonthKey,
  year: number,
  isAllYear: boolean,
): string {
  return isAllYear ? `All Year ${year}` : `${monthLabel(month)} ${year}`;
}
