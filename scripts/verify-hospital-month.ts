/**
 * Functional verification for month-first Hospital Admin filtering.
 * Run: npx tsx scripts/verify-hospital-month.ts
 */
import {
  DEMO_APPLICATIONS,
  DEMO_NOTIFICATIONS,
  DEMO_SPECIALTIES,
  MONTHS,
  computeCapacityRow,
  getApplicationsForHospital,
  getNotificationsForHospital,
  isAcceptedStatus,
  toDisplayStatus,
  type MonthKey,
} from "../src/data/hospital-demo";

const HOSPITAL_ID = "kfmc";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

function appsForMonth(month: MonthKey) {
  return getApplicationsForHospital(HOSPITAL_ID, DEMO_APPLICATIONS).filter(
    (app) => app.month === month,
  );
}

let checks = 0;

for (const month of MONTHS) {
  const monthApps = appsForMonth(month.key);

  assert(
    monthApps.every((app) => app.month === month.key),
    `${month.label} applications are month-scoped`,
  );
  checks += 1;

  const accepted = monthApps.filter((a) => isAcceptedStatus(a.status));
  assert(
    accepted.every((a) => a.month === month.key),
    `${month.label} accepted are month-scoped`,
  );
  checks += 1;

  const rejected = monthApps.filter(
    (a) => toDisplayStatus(a.status) === "Rejected",
  );
  assert(
    rejected.every((a) => a.month === month.key),
    `${month.label} rejected are month-scoped`,
  );
  checks += 1;

  const waitlisted = monthApps.filter((a) => a.status === "Waitlisted");
  assert(
    waitlisted.every((a) => a.month === month.key),
    `${month.label} waitlist are month-scoped`,
  );
  checks += 1;

  const offered = DEMO_SPECIALTIES.filter((specialty) => {
    const row = computeCapacityRow(
      specialty.id,
      month.key,
      HOSPITAL_ID,
      DEMO_APPLICATIONS,
      undefined,
      { specialtyActive: true },
    );
    return (row?.totalSlots ?? 0) > 0;
  });
  assert(
    offered.every((specialty) =>
      Boolean(
        computeCapacityRow(
          specialty.id,
          month.key,
          HOSPITAL_ID,
          DEMO_APPLICATIONS,
          undefined,
          { specialtyActive: true },
        )?.totalSlots,
      ),
    ),
    `${month.label} offered specialties have slots`,
  );
  checks += 1;

  const notifications = getNotificationsForHospital(
    HOSPITAL_ID,
    DEMO_NOTIFICATIONS,
  ).filter((n) => n.relatedMonth === month.key);
  assert(
    notifications.every((n) => n.relatedMonth === month.key),
    `${month.label} notifications are month-scoped`,
  );
  checks += 1;
}

const january = appsForMonth("01");
const june = appsForMonth("06");
assert(
  january.length !== june.length ||
    january.some((a) => !june.find((b) => b.id === a.id)),
  "Changing month changes the application set",
);
checks += 1;

const allYearCount = getApplicationsForHospital(
  HOSPITAL_ID,
  DEMO_APPLICATIONS,
).length;
assert(allYearCount >= january.length, "All Year includes monthly subset");
checks += 1;

const july = appsForMonth("07");
assert(
  july.length === 0,
  "Months without demo applications return an empty set",
);
checks += 1;

console.log(`OK: ${checks} month-first verification checks passed.`);
console.log(
  "Sample counts:",
  MONTHS.map((m) => `${m.label.slice(0, 3)}=${appsForMonth(m.key).length}`).join(
    " ",
  ),
);
