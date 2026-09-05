/**
 * Specialty → subspecialty map for MedJourney onboarding demo.
 * Expandable; empty arrays mean no common demo subspecialties yet.
 */

export const SUBSPECIALTIES_BY_SPECIALTY: Record<string, readonly string[]> = {
  "Internal Medicine": [
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
    "Allergy and Immunology",
  ],
  Pediatrics: [
    "Pediatric Cardiology",
    "Pediatric Neurology",
    "Pediatric Gastroenterology",
    "Pediatric Endocrinology",
    "Pediatric Nephrology",
    "Pediatric Pulmonology",
    "Pediatric Hematology Oncology",
    "Neonatology",
    "Pediatric Critical Care",
    "Pediatric Emergency Medicine",
  ],
  "General Surgery": [
    "Colorectal Surgery",
    "Hepatobiliary Surgery",
    "Breast Surgery",
    "Bariatric Surgery",
    "Surgical Oncology",
    "Transplant Surgery",
    "Trauma Surgery",
    "Endocrine Surgery",
  ],
  Cardiology: [
    "Interventional Cardiology",
    "Electrophysiology",
    "Heart Failure",
    "Adult Congenital Heart Disease",
    "Cardiac Imaging",
  ],
  Neurology: [
    "Stroke Medicine",
    "Epilepsy",
    "Movement Disorders",
    "Neuromuscular Medicine",
    "Neurocritical Care",
    "Headache Medicine",
  ],
  "Orthopedic Surgery": [
    "Spine Surgery",
    "Sports Medicine",
    "Joint Replacement",
    "Pediatric Orthopedics",
    "Hand Surgery",
    "Trauma Orthopedics",
  ],
  "Obstetrics and Gynecology": [
    "Maternal Fetal Medicine",
    "Gynecologic Oncology",
    "Reproductive Endocrinology",
    "Urogynecology",
    "Minimally Invasive Gynecologic Surgery",
  ],
  Anesthesiology: [
    "Cardiac Anesthesia",
    "Pediatric Anesthesia",
    "Obstetric Anesthesia",
    "Pain Medicine",
    "Critical Care Anesthesia",
  ],
  Radiology: [
    "Interventional Radiology",
    "Neuroradiology",
    "Pediatric Radiology",
    "Musculoskeletal Radiology",
    "Breast Imaging",
    "Body Imaging",
  ],
  "Diagnostic Radiology": [
    "Interventional Radiology",
    "Neuroradiology",
    "Pediatric Radiology",
    "Musculoskeletal Radiology",
    "Breast Imaging",
  ],
  Psychiatry: [
    "Child and Adolescent Psychiatry",
    "Geriatric Psychiatry",
    "Addiction Psychiatry",
    "Consultation Liaison Psychiatry",
    "Forensic Psychiatry",
  ],
  "Emergency Medicine": [
    "Pediatric Emergency Medicine",
    "Emergency Medical Services",
    "Toxicology",
    "Critical Care",
    "Ultrasound",
  ],
  Ophthalmology: [
    "Retina",
    "Cornea",
    "Glaucoma",
    "Pediatric Ophthalmology",
    "Oculoplastics",
  ],
  Otolaryngology: [
    "Head and Neck Surgery",
    "Otology",
    "Rhinology",
    "Pediatric Otolaryngology",
    "Laryngology",
  ],
  Neurosurgery: [
    "Spine Neurosurgery",
    "Pediatric Neurosurgery",
    "Vascular Neurosurgery",
    "Neuro Oncology",
    "Functional Neurosurgery",
  ],
  Dermatology: [
    "Dermatopathology",
    "Pediatric Dermatology",
    "Mohs Surgery",
    "Cosmetic Dermatology",
  ],
  Urology: [
    "Pediatric Urology",
    "Urologic Oncology",
    "Female Urology",
    "Endourology",
    "Andrology",
  ],
  "Family Medicine": [
    "Geriatrics",
    "Sports Medicine",
    "Palliative Care",
    "Adolescent Medicine",
  ],
  Pathology: [
    "Hematopathology",
    "Cytopathology",
    "Molecular Pathology",
    "Forensic Pathology",
    "Dermatopathology",
  ],
  "Medical Oncology": [
    "Breast Oncology",
    "Gastrointestinal Oncology",
    "Thoracic Oncology",
    "Genitourinary Oncology",
    "Neuro Oncology",
  ],
  "Clinical Pharmacy": [
    "Critical Care Pharmacy",
    "Oncology Pharmacy",
    "Infectious Diseases Pharmacy",
    "Cardiology Pharmacy",
    "Ambulatory Care Pharmacy",
  ],
  "Physical Therapy": [
    "Orthopedic Physical Therapy",
    "Neurologic Physical Therapy",
    "Pediatric Physical Therapy",
    "Sports Physical Therapy",
    "Cardiopulmonary Physical Therapy",
  ],
  "Oral and Maxillofacial Surgery": [
    "Orthognathic Surgery",
    "Craniofacial Surgery",
    "Oral Oncology",
    "Temporomandibular Joint Surgery",
  ],
};

export function getSubspecialtiesForSpecialty(
  specialty: string | null | undefined,
): readonly string[] {
  if (!specialty) return [];
  const exact = SUBSPECIALTIES_BY_SPECIALTY[specialty];
  if (exact?.length) return exact;
  const trimmed = specialty.trim();
  if (trimmed !== specialty) {
    const byTrim = SUBSPECIALTIES_BY_SPECIALTY[trimmed];
    if (byTrim?.length) return byTrim;
  }
  const lower = trimmed.toLowerCase();
  const match = Object.entries(SUBSPECIALTIES_BY_SPECIALTY).find(
    ([key]) => key.toLowerCase() === lower,
  );
  return match?.[1] ?? [];
}
