/**
 * Advanced Training programs by healthcare field.
 * Kept separate from residency and fellowship specialty lists so Nursing,
 * Pharmacy, and Allied Health are not treated as Residents or Fellows.
 * Additional program kinds can be added later without changing the stage model.
 */

import type { HealthcareField, TrainingProgramKind } from "@/data/intern";
import { isAdvancedTrainingField } from "@/data/intern";

export type AdvancedTrainingProgram = {
  name: string;
  field: "nursing" | "pharmacy" | "allied";
  kind: TrainingProgramKind;
};

export const NURSING_ADVANCED_TRAINING_PROGRAMS = [
  "Adult Critical Care Nursing",
  "Pediatric Critical Care Nursing",
  "Neonatal Intensive Care Nursing",
  "Emergency Nursing",
  "Cardiovascular Nursing",
  "Oncology Nursing",
  "Perioperative Nursing",
  "Mental Health Nursing",
  "Obstetric and Gynecologic Nursing",
  "Nephrology Nursing",
  "Community Health Nursing",
  "Nursing Education",
  "Nursing Administration",
  "Wound Care Nursing",
  "Infection Control Nursing",
] as const;

export const PHARMACY_ADVANCED_TRAINING_PROGRAMS = [
  "Clinical Pharmacy",
  "Critical Care Pharmacy",
  "Oncology Pharmacy",
  "Infectious Diseases Pharmacy",
  "Pediatric Pharmacy",
  "Ambulatory Care Pharmacy",
  "Cardiology Pharmacy",
  "Hospital Pharmacy Practice",
  "Pharmacotherapy",
  "Medication Safety",
  "Emergency Medicine Pharmacy",
  "Psychiatric Pharmacy",
  "Drug Information",
] as const;

export const ALLIED_HEALTH_ADVANCED_TRAINING_PROGRAMS = [
  "Physical Therapy",
  "Occupational Therapy",
  "Respiratory Therapy",
  "Clinical Laboratory Sciences",
  "Radiologic Technology",
  "Diagnostic Medical Sonography",
  "Clinical Nutrition",
  "Speech Language Pathology",
  "Audiology",
  "Cardiac Technology",
  "Perfusion Technology",
  "Emergency Medical Services",
  "Anesthesia Technology",
  "Health Information Management",
] as const;

export const ADVANCED_TRAINING_PROGRAMS_BY_FIELD: Record<
  "nursing" | "pharmacy" | "allied",
  readonly string[]
> = {
  nursing: NURSING_ADVANCED_TRAINING_PROGRAMS,
  pharmacy: PHARMACY_ADVANCED_TRAINING_PROGRAMS,
  allied: ALLIED_HEALTH_ADVANCED_TRAINING_PROGRAMS,
};

export function getAdvancedTrainingProgramsForField(
  field: HealthcareField | null | undefined,
): readonly string[] {
  if (!isAdvancedTrainingField(field)) return [];
  return ADVANCED_TRAINING_PROGRAMS_BY_FIELD[field];
}
