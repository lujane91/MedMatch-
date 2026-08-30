/**
 * Healthcare field specialties for MedJourney onboarding.
 * Specialty options depend on the selected healthcare field.
 */

import type { HealthcareField } from "@/data/intern";

export const MEDICINE_SPECIALTIES = [
  "Emergency Medicine",
  "Family Medicine",
  "Internal Medicine",
  "General Surgery",
  "Pediatrics",
  "Obstetrics and Gynecology",
  "Psychiatry",
  "Orthopedic Surgery",
  "Dermatology",
  "Anesthesiology",
  "Radiology",
  "Diagnostic Radiology",
  "Pathology",
  "Neurology",
  "Neurosurgery",
  "Ophthalmology",
  "Otolaryngology",
  "Urology",
  "Plastic Surgery",
  "Cardiothoracic Surgery",
  "Vascular Surgery",
  "Cardiology",
  "Gastroenterology",
  "Endocrinology",
  "Nephrology",
  "Pulmonology",
  "Rheumatology",
  "Hematology",
  "Medical Oncology",
  "Infectious Diseases",
  "Geriatric Medicine",
  "Physical Medicine and Rehabilitation",
  "Preventive Medicine",
  "Public Health",
  "Occupational Medicine",
  "Critical Care Medicine",
  "Pain Medicine",
  "Nuclear Medicine",
  "Radiation Oncology",
  "Clinical Genetics",
] as const;

export const DENTISTRY_SPECIALTIES = [
  "General Dentistry",
  "Orthodontics",
  "Endodontics",
  "Periodontics",
  "Prosthodontics",
  "Pediatric Dentistry",
  "Oral and Maxillofacial Surgery",
  "Oral Medicine",
  "Oral and Maxillofacial Radiology",
  "Restorative Dentistry",
  "Dental Public Health",
] as const;

export const PHARMACY_SPECIALTIES = [
  "General Pharmacy",
  "Clinical Pharmacy",
  "Hospital Pharmacy",
  "Community Pharmacy",
  "Ambulatory Care Pharmacy",
  "Critical Care Pharmacy",
  "Emergency Medicine Pharmacy",
  "Oncology Pharmacy",
  "Infectious Diseases Pharmacy",
  "Pediatric Pharmacy",
  "Cardiology Pharmacy",
  "Psychiatric Pharmacy",
  "Medication Safety",
  "Drug Information",
  "Pharmacotherapy",
  "Pharmaceutical Sciences",
] as const;

export const NURSING_SPECIALTIES = [
  "General Nursing",
  "Emergency Nursing",
  "Critical Care Nursing",
  "Medical Surgical Nursing",
  "Pediatric Nursing",
  "Neonatal Nursing",
  "Obstetric and Gynecologic Nursing",
  "Operating Room Nursing",
  "Mental Health Nursing",
  "Community Health Nursing",
  "Oncology Nursing",
  "Cardiac Nursing",
  "Dialysis Nursing",
  "Nursing Administration",
] as const;

export const ALLIED_HEALTH_SPECIALTIES = [
  "Physical Therapy",
  "Occupational Therapy",
  "Respiratory Therapy",
  "Clinical Laboratory Sciences",
  "Radiologic Technology",
  "Diagnostic Medical Sonography",
  "Clinical Nutrition",
  "Speech Language Pathology",
  "Audiology",
  "Optometry",
  "Anesthesia Technology",
  "Emergency Medical Services",
  "Cardiac Technology",
  "Perfusion Technology",
  "Health Information Management",
] as const;

export const SPECIALTIES_BY_FIELD: Record<
  Exclude<HealthcareField, "other">,
  readonly string[]
> = {
  medicine: MEDICINE_SPECIALTIES,
  dentistry: DENTISTRY_SPECIALTIES,
  pharmacy: PHARMACY_SPECIALTIES,
  nursing: NURSING_SPECIALTIES,
  allied: ALLIED_HEALTH_SPECIALTIES,
};

export function getSpecialtiesForField(
  field: HealthcareField | null | undefined,
): readonly string[] {
  if (!field || field === "other") return MEDICINE_SPECIALTIES;
  return SPECIALTIES_BY_FIELD[field] ?? MEDICINE_SPECIALTIES;
}
