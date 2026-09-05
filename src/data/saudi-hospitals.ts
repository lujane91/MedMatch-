/**
 * Saudi hospitals and training institutions for MedJourney onboarding demo.
 * Expandable static list — later fields can include programs and available specialties.
 */

export type SaudiHospital = {
  id: string;
  name: string;
  city: string;
  region: string;
  group?: string;
  type:
    | "moh"
    | "cluster"
    | "university"
    | "specialist"
    | "military"
    | "private"
    | "other";
};

export const SAUDI_HOSPITALS: SaudiHospital[] = [
  // Riyadh
  { id: "kfshrc-riyadh", name: "King Faisal Specialist Hospital and Research Centre Riyadh", city: "Riyadh", region: "Riyadh", group: "KFSHRC", type: "specialist" },
  { id: "ksumc", name: "King Saud University Medical City", city: "Riyadh", region: "Riyadh", group: "KSU", type: "university" },
  { id: "kkuh", name: "King Khalid University Hospital", city: "Riyadh", region: "Riyadh", group: "KSU", type: "university" },
  { id: "ksmc", name: "King Saud Medical City", city: "Riyadh", region: "Riyadh", group: "MOH", type: "moh" },
  { id: "kfmc", name: "King Fahad Medical City", city: "Riyadh", region: "Riyadh", group: "MOH", type: "specialist" },
  { id: "ngha-riyadh", name: "King Abdulaziz Medical City Riyadh", city: "Riyadh", region: "Riyadh", group: "MNGHA", type: "military" },
  { id: "psmmc", name: "Prince Sultan Military Medical City", city: "Riyadh", region: "Riyadh", group: "Armed Forces", type: "military" },
  { id: "sfh-riyadh", name: "Security Forces Hospital Riyadh", city: "Riyadh", region: "Riyadh", group: "Security Forces", type: "military" },
  { id: "rmh", name: "Riyadh Military Hospital", city: "Riyadh", region: "Riyadh", group: "Armed Forces", type: "military" },
  { id: "hmg-olaya", name: "Dr. Sulaiman Al Habib Olaya Medical Complex", city: "Riyadh", region: "Riyadh", group: "HMG", type: "private" },
  { id: "hmg-rayan", name: "Dr. Sulaiman Al Habib Al Rayyan Hospital", city: "Riyadh", region: "Riyadh", group: "HMG", type: "private" },
  { id: "hmg-suwaidi", name: "Dr. Sulaiman Al Habib Al Suwaidi Hospital", city: "Riyadh", region: "Riyadh", group: "HMG", type: "private" },
  { id: "hmg-takhassusi", name: "Dr. Sulaiman Al Habib Takhassusi Hospital", city: "Riyadh", region: "Riyadh", group: "HMG", type: "private" },
  { id: "dallah-namar", name: "Dallah Hospital Namar", city: "Riyadh", region: "Riyadh", group: "Dallah Health", type: "private" },
  { id: "dallah-nakheel", name: "Dallah Hospital Al Nakheel", city: "Riyadh", region: "Riyadh", group: "Dallah Health", type: "private" },
  { id: "mouwasat-riyadh", name: "Mouwasat Hospital Riyadh", city: "Riyadh", region: "Riyadh", group: "Mouwasat", type: "private" },
  { id: "sgh-riyadh", name: "Saudi German Hospital Riyadh", city: "Riyadh", region: "Riyadh", group: "Saudi German Health", type: "private" },
  { id: "care-national", name: "Care National Hospital", city: "Riyadh", region: "Riyadh", type: "private" },
  { id: "specialty-riyadh", name: "Specialty Hospital Riyadh", city: "Riyadh", region: "Riyadh", type: "private" },
  { id: "green-crescent", name: "Green Crescent Hospital", city: "Riyadh", region: "Riyadh", type: "private" },
  { id: "aliman", name: "Al Iman General Hospital", city: "Riyadh", region: "Riyadh", group: "MOH", type: "moh" },
  { id: "alyaamamah", name: "Al Yamamah Hospital", city: "Riyadh", region: "Riyadh", group: "MOH", type: "moh" },
  { id: "prince-mohammed-bin-abdulaziz", name: "Prince Mohammed Bin Abdulaziz Hospital Riyadh", city: "Riyadh", region: "Riyadh", group: "MOH", type: "moh" },

  // Makkah / Jeddah / Taif
  { id: "kauyh", name: "King Abdulaziz University Hospital", city: "Jeddah", region: "Makkah", group: "KAU", type: "university" },
  { id: "kauh-jeddah", name: "King Abdulaziz Hospital Jeddah", city: "Jeddah", region: "Makkah", group: "MOH", type: "moh" },
  { id: "kfshrc-jeddah", name: "King Faisal Specialist Hospital and Research Centre Jeddah", city: "Jeddah", region: "Makkah", group: "KFSHRC", type: "specialist" },
  { id: "ngha-jeddah", name: "King Abdulaziz Medical City Jeddah", city: "Jeddah", region: "Makkah", group: "MNGHA", type: "military" },
  { id: "king-fahd-armed-forces", name: "King Fahd Armed Forces Hospital Jeddah", city: "Jeddah", region: "Makkah", group: "Armed Forces", type: "military" },
  { id: "imc", name: "International Medical Center", city: "Jeddah", region: "Makkah", type: "private" },
  { id: "fakeeh-jeddah", name: "Dr. Soliman Fakeeh Hospital Jeddah", city: "Jeddah", region: "Makkah", group: "Fakeeh Care", type: "private" },
  { id: "sgh-jeddah", name: "Saudi German Hospital Jeddah", city: "Jeddah", region: "Makkah", group: "Saudi German Health", type: "private" },
  { id: "hmg-jeddah", name: "Dr. Sulaiman Al Habib Hospital Jeddah", city: "Jeddah", region: "Makkah", group: "HMG", type: "private" },
  { id: "mouwasat-jeddah", name: "Mouwasat Hospital Jeddah", city: "Jeddah", region: "Makkah", group: "Mouwasat", type: "private" },
  { id: "bugshan", name: "Bugshan Hospital", city: "Jeddah", region: "Makkah", type: "private" },
  { id: "king-abdullah-medical-city", name: "King Abdullah Medical City Makkah", city: "Makkah", region: "Makkah", group: "MOH", type: "specialist" },
  { id: "hera", name: "Hera General Hospital", city: "Makkah", region: "Makkah", group: "MOH", type: "moh" },
  { id: "ajyad", name: "Ajyad Emergency Hospital", city: "Makkah", region: "Makkah", group: "MOH", type: "moh" },
  { id: "king-faisal-taif", name: "King Faisal Medical Complex Taif", city: "Taif", region: "Makkah", group: "MOH", type: "moh" },
  { id: "king-abdulaziz-taif", name: "King Abdulaziz Specialist Hospital Taif", city: "Taif", region: "Makkah", group: "MOH", type: "specialist" },
  { id: "children-maternity-jeddah", name: "Maternity and Children Hospital Jeddah", city: "Jeddah", region: "Makkah", group: "MOH", type: "moh" },

  // Eastern Province
  { id: "kfsh-dammam", name: "King Fahad Specialist Hospital Dammam", city: "Dammam", region: "Eastern Province", group: "MOH", type: "specialist" },
  { id: "kfuh", name: "King Fahd University Hospital", city: "Al Khobar", region: "Eastern Province", group: "IAU", type: "university" },
  { id: "jhah", name: "Johns Hopkins Aramco Healthcare", city: "Dhahran", region: "Eastern Province", group: "JHAH", type: "private" },
  { id: "ngha-dammam", name: "Imam Abdulrahman Bin Faisal Hospital Dammam", city: "Dammam", region: "Eastern Province", group: "MNGHA", type: "military" },
  { id: "mouwasat-dammam", name: "Mouwasat Hospital Dammam", city: "Dammam", region: "Eastern Province", group: "Mouwasat", type: "private" },
  { id: "mouwasat-khobar", name: "Mouwasat Hospital Al Khobar", city: "Al Khobar", region: "Eastern Province", group: "Mouwasat", type: "private" },
  { id: "mouwasat-qatif", name: "Mouwasat Hospital Qatif", city: "Qatif", region: "Eastern Province", group: "Mouwasat", type: "private" },
  { id: "mouwasat-jubail", name: "Mouwasat Hospital Jubail", city: "Jubail", region: "Eastern Province", group: "Mouwasat", type: "private" },
  { id: "hmg-khobar", name: "Dr. Sulaiman Al Habib Al Khobar Hospital", city: "Al Khobar", region: "Eastern Province", group: "HMG", type: "private" },
  { id: "sgh-dammam", name: "Saudi German Hospital Dammam", city: "Dammam", region: "Eastern Province", group: "Saudi German Health", type: "private" },
  { id: "sgh-hafar", name: "Saudi German Hospital Hafr Al Batin", city: "Hafr Al Batin", region: "Eastern Province", group: "Saudi German Health", type: "private" },
  { id: "king-fahd-hofuf", name: "King Fahd Hospital Hofuf", city: "Al Ahsa", region: "Eastern Province", group: "MOH", type: "moh" },
  { id: "almoosa", name: "Almoosa Specialist Hospital", city: "Al Ahsa", region: "Eastern Province", type: "private" },
  { id: "procare", name: "Procare Riaya Hospital", city: "Al Khobar", region: "Eastern Province", type: "private" },
  { id: "royal-commission-jubail", name: "Royal Commission Hospital Jubail", city: "Jubail", region: "Eastern Province", group: "Royal Commission", type: "other" },
  { id: "qatif-central", name: "Qatif Central Hospital", city: "Qatif", region: "Eastern Province", group: "MOH", type: "moh" },

  // Madinah
  { id: "king-fahd-madinah", name: "King Fahd Hospital Madinah", city: "Madinah", region: "Madinah", group: "MOH", type: "moh" },
  { id: "ohud", name: "Ohud Hospital", city: "Madinah", region: "Madinah", group: "MOH", type: "moh" },
  { id: "miu-hospital", name: "Islamic University Medical Center", city: "Madinah", region: "Madinah", type: "university" },
  { id: "mouwasat-madinah", name: "Mouwasat Hospital Madinah", city: "Madinah", region: "Madinah", group: "Mouwasat", type: "private" },
  { id: "sgh-madinah", name: "Saudi German Hospital Madinah", city: "Madinah", region: "Madinah", group: "Saudi German Health", type: "private" },

  // Asir / Jazan / Najran / Al Baha
  { id: "asir-central", name: "Asir Central Hospital", city: "Abha", region: "Asir", group: "MOH", type: "moh" },
  { id: "ach-abha", name: "Ahad Rufaidah General Hospital", city: "Ahad Rufaidah", region: "Asir", group: "MOH", type: "moh" },
  { id: "kku-medical", name: "King Khalid University Medical City", city: "Abha", region: "Asir", group: "KKU", type: "university" },
  { id: "sgh-abha", name: "Saudi German Hospital Abha", city: "Abha", region: "Asir", group: "Saudi German Health", type: "private" },
  { id: "king-fahd-jazan", name: "King Fahd Central Hospital Jazan", city: "Jazan", region: "Jazan", group: "MOH", type: "moh" },
  { id: "prince-mohammed-jazan", name: "Prince Mohammed Bin Nasser Hospital", city: "Jazan", region: "Jazan", group: "MOH", type: "moh" },
  { id: "king-khalid-najran", name: "King Khalid Hospital Najran", city: "Najran", region: "Najran", group: "MOH", type: "moh" },
  { id: "king-fahd-baha", name: "King Fahd Hospital Al Baha", city: "Al Baha", region: "Al Baha", group: "MOH", type: "moh" },

  // Qassim / Hail / Northern Borders / Al Jouf / Tabuk
  { id: "king-fahd-buraidah", name: "King Fahd Specialist Hospital Buraidah", city: "Buraidah", region: "Qassim", group: "MOH", type: "specialist" },
  { id: "buraidah-central", name: "Buraidah Central Hospital", city: "Buraidah", region: "Qassim", group: "MOH", type: "moh" },
  { id: "mouwasat-buraidah", name: "Mouwasat Hospital Buraidah", city: "Buraidah", region: "Qassim", group: "Mouwasat", type: "private" },
  { id: "king-salman-hail", name: "King Salman Specialist Hospital Hail", city: "Hail", region: "Hail", group: "MOH", type: "specialist" },
  { id: "hail-general", name: "Hail General Hospital", city: "Hail", region: "Hail", group: "MOH", type: "moh" },
  { id: "prince-abdulaziz-bin-musaad", name: "Prince Abdulaziz Bin Musaad Hospital Arar", city: "Arar", region: "Northern Borders", group: "MOH", type: "moh" },
  { id: "king-abdulaziz-jouf", name: "King Abdulaziz Specialist Hospital Al Jouf", city: "Sakaka", region: "Al Jouf", group: "MOH", type: "specialist" },
  { id: "king-khalid-tabuk", name: "King Khalid Hospital Tabuk", city: "Tabuk", region: "Tabuk", group: "MOH", type: "moh" },
  { id: "king-fahd-tabuk", name: "King Fahd Specialist Hospital Tabuk", city: "Tabuk", region: "Tabuk", group: "MOH", type: "specialist" },
  { id: "prince-sultan-tabuk", name: "Prince Sultan Armed Forces Hospital Tabuk", city: "Tabuk", region: "Tabuk", group: "Armed Forces", type: "military" },
  { id: "royal-commission-yanbu", name: "Royal Commission Medical Center Yanbu", city: "Yanbu", region: "Madinah", group: "Royal Commission", type: "other" },

  // Clusters / additional
  { id: "riyadh-first-health-cluster", name: "Riyadh First Health Cluster", city: "Riyadh", region: "Riyadh", group: "Health Clusters", type: "cluster" },
  { id: "riyadh-second-health-cluster", name: "Riyadh Second Health Cluster", city: "Riyadh", region: "Riyadh", group: "Health Clusters", type: "cluster" },
  { id: "riyadh-third-health-cluster", name: "Riyadh Third Health Cluster", city: "Riyadh", region: "Riyadh", group: "Health Clusters", type: "cluster" },
  { id: "makkah-health-cluster", name: "Makkah Health Cluster", city: "Makkah", region: "Makkah", group: "Health Clusters", type: "cluster" },
  { id: "jeddah-health-cluster", name: "Jeddah Health Cluster", city: "Jeddah", region: "Makkah", group: "Health Clusters", type: "cluster" },
  { id: "eastern-health-cluster", name: "Eastern Health Cluster", city: "Dammam", region: "Eastern Province", group: "Health Clusters", type: "cluster" },
  { id: "qassim-health-cluster", name: "Qassim Health Cluster", city: "Buraidah", region: "Qassim", group: "Health Clusters", type: "cluster" },
  { id: "asir-health-cluster", name: "Asir Health Cluster", city: "Abha", region: "Asir", group: "Health Clusters", type: "cluster" },
];

export const SAUDI_HOSPITAL_NAMES = SAUDI_HOSPITALS.map((item) => item.name);

export const SAUDI_CITIES = Array.from(
  new Set(SAUDI_HOSPITALS.map((item) => item.city)),
).sort();
