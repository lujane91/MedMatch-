/**
 * Saudi universities for MedJourney onboarding demo.
 * Expandable static list — replace with API/database later without UI changes.
 */

export type SaudiUniversity = {
  id: string;
  name: string;
  type: "public" | "private" | "specialized";
};

export const SAUDI_UNIVERSITIES: SaudiUniversity[] = [
  { id: "uqu", name: "Umm Al Qura University", type: "public" },
  { id: "iu", name: "Islamic University of Madinah", type: "public" },
  { id: "imsiu", name: "Imam Mohammad Ibn Saud Islamic University", type: "public" },
  { id: "ksu", name: "King Saud University", type: "public" },
  { id: "kau", name: "King Abdulaziz University", type: "public" },
  { id: "kfupm", name: "King Fahd University of Petroleum and Minerals", type: "public" },
  { id: "kfu", name: "King Faisal University", type: "public" },
  { id: "kku", name: "King Khalid University", type: "public" },
  { id: "qu", name: "Qassim University", type: "public" },
  { id: "taibah", name: "Taibah University", type: "public" },
  { id: "tu", name: "Taif University", type: "public" },
  { id: "uoh", name: "University of Hail", type: "public" },
  { id: "jazanu", name: "Jazan University", type: "public" },
  { id: "ju", name: "Al Jouf University", type: "public" },
  { id: "bu", name: "Al Baha University", type: "public" },
  { id: "ut", name: "University of Tabuk", type: "public" },
  { id: "nu", name: "Najran University", type: "public" },
  { id: "nbu", name: "Northern Border University", type: "public" },
  { id: "pnu", name: "Princess Nourah bint Abdulrahman University", type: "public" },
  { id: "ksauhs", name: "King Saud bin Abdulaziz University for Health Sciences", type: "specialized" },
  { id: "iau", name: "Imam Abdulrahman Bin Faisal University", type: "public" },
  { id: "psau", name: "Prince Sattam bin Abdulaziz University", type: "public" },
  { id: "su", name: "Shaqra University", type: "public" },
  { id: "mu", name: "Majmaah University", type: "public" },
  { id: "seu", name: "Saudi Electronic University", type: "public" },
  { id: "uj", name: "University of Jeddah", type: "public" },
  { id: "ub", name: "University of Bisha", type: "public" },
  { id: "uhb", name: "University of Hafr Al Batin", type: "public" },
  { id: "ksu-med", name: "King Saud University College of Medicine", type: "specialized" },
  { id: "kau-med", name: "King Abdulaziz University Faculty of Medicine", type: "specialized" },
  { id: "effat", name: "Effat University", type: "private" },
  { id: "dar-al-hekma", name: "Dar Al Hekma University", type: "private" },
  { id: "pmu", name: "Prince Mohammad Bin Fahd University", type: "private" },
  { id: "alfaisal", name: "Alfaisal University", type: "private" },
  { id: "aubh", name: "Arabian Gulf University", type: "private" },
  { id: "fbsu", name: "Fahad Bin Sultan University", type: "private" },
  { id: "riyadh-elm", name: "Riyadh Elm University", type: "private" },
  { id: "batterjee", name: "Batterjee Medical College", type: "private" },
  { id: "fakeeh-college", name: "Fakeeh College for Medical Sciences", type: "private" },
  { id: "ibn-sina", name: "Ibn Sina National College for Medical Studies", type: "private" },
  { id: "almarefa", name: "AlMaarefa University", type: "private" },
  { id: "sulaiman-alrajhi", name: "Sulaiman Al Rajhi University", type: "private" },
  { id: "vision", name: "Vision Colleges", type: "private" },
  { id: "inaya", name: "Inaya Medical Colleges", type: "private" },
  { id: "mustaqbal", name: "Al Mustaqbal University", type: "private" },
  { id: "dar-al-uloom", name: "Dar Al Uloom University", type: "private" },
  { id: "najran-private", name: "Najran Private Colleges", type: "private" },
  { id: "buraydah", name: "Buraydah Colleges", type: "private" },
  { id: "qassim-private", name: "Qassim Private Colleges", type: "private" },
  { id: "saudi-german-college", name: "Saudi German Institute for Nursing and Allied Health", type: "private" },
];

export const SAUDI_UNIVERSITY_NAMES = SAUDI_UNIVERSITIES.map((item) => item.name);
