import { API_URL } from "config/constant";


let diseaseCache = {};
let medicineCache = {};
export const symptomCache = {};
let doctorCache = null;

export const fetchDiseases = async (doctor_id) => {
  if (diseaseCache[doctor_id]) return diseaseCache[doctor_id];

  const res = await fetch(
    `${API_URL}subadmin/docterwise/diseases?doctor_id=${doctor_id}`
  );

  const data = await res.json();

  if (data.success) {
    diseaseCache[doctor_id] = data.diseases.map(d => ({
      label: d.disease_name,
      value: d.disease_id,
    }));
    return diseaseCache[doctor_id];
  }

  return [];
};

export const fetchMedicines = async (doctor_id) => {
  if (medicineCache[doctor_id]) return medicineCache[doctor_id];

  const res = await fetch(
    `${API_URL}subadmin/docterwise/medicines?doctor_id=${doctor_id}`
  );

  const data = await res.json();

  if (data.success) {
    medicineCache[doctor_id] = data.medicines.map(m => ({
      label: m.medicine_name,
      value: m.medicine_id,
    }));
    return medicineCache[doctor_id];
  }

  return [];
};

export const fetchSymptoms = async (doctor_id) => {
  if (symptomCache[doctor_id]) return symptomCache[doctor_id];

  try {
    const res = await fetch(`${API_URL}report-symptoms?doctor_id=${doctor_id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    // ✅ ADD THESE
    console.log("fetchSymptoms status:", res.status);
    const data = await res.json();
    console.log("fetchSymptoms raw data:", data);  // ← most important

    if (data.success && Array.isArray(data.data)) {
      const formatted = data.data.map(symptom => ({
        label: symptom.symptom_name,
        value: symptom.symptom_name,
      }));
      symptomCache[doctor_id] = formatted;
      return formatted;
    }

    return [];
  } catch (error) {
    console.error("Error fetching symptoms:", error);
    return [];
  }
};

export const fetchDoctors = async () => {
  if (doctorCache) return doctorCache;

  try {
    const res = await fetch(`${API_URL}doctor-list`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log("Doctor API:", data);

    if (data.success && Array.isArray(data.data)) {
      doctorCache = data.data.map(d => ({
        label: d.label,
        value: d.value,
      }));
      return doctorCache;
    }

    return [];
  } catch (err) {
    console.error("Error fetching doctors:", err);
    return [];
  }
};
