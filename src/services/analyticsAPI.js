import { API_URL } from "config/constant";

let diseaseCache = null;
let medicineCache = null;
export const symptomCache = {};
let doctorCache = null;

export const fetchDiseases = async () => {
  if (diseaseCache) return diseaseCache;

  try {
    const res = await fetch(`${API_URL}subadmin/diseases`);
    const data = await res.json();

    if (data.success) {
      diseaseCache = data.diseases.map(d => ({
        label: d.disease_name,
        value: d.disease_id,
      }));
      return diseaseCache;
    }
    return [];
  } catch (error) {
    console.error("Error fetching diseases:", error);
    return [];
  }
};

export const fetchMedicines = async () => {
  if (medicineCache) return medicineCache;

  try {
    const res = await fetch(`${API_URL}subadmin/medicines`);
    const data = await res.json();

    if (data.success) {
      medicineCache = data.medicines.map(m => ({
        label: m.medicine_name,
        value: m.medicine_id,
      }));
      return medicineCache;
    }
    return [];
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return [];
  }
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

export const fetchAdminPatientDemographics = async (payload) => {
  try {
    const res = await fetch(`${API_URL}admin-patient-demographics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Demographics Summary:", data);

    if (data.success) return data;

    return {
      success: false,
      total_patients: 0,
      matched_patients: 0,
      ageDistribution: [],
      sexDistribution: [],
      crossTable: [],
    };
  } catch (err) {
    console.error("Error fetching demographics:", err);
    return {
      success: false,
      total_patients: 0,
      matched_patients: 0,
      ageDistribution: [],
      sexDistribution: [],
      crossTable: [],
    };
  }
};

export const fetchAdminPatientDemographicsDetails = async (payload) => {
  try {
    const res = await fetch(`${API_URL}admin-patient-demographics-details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Demographics Details:", data);

    if (data.success) return data;

    return {
      success: false,
      patients: [],
      total: 0,
      matched_patients: 0,
      page: 1,
      limit: 10,
    };
  } catch (err) {
    console.error("Error fetching patient details:", err);
    return {
      success: false,
      patients: [],
      total: 0,
      matched_patients: 0,
      page: 1,
      limit: 10,
    };
  }
};

export const fetchDoctorAnalytics = async (payload) => {
  try {
    const res = await fetch(`${API_URL}admin-doctor-analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Doctor Analytics:", data);

    if (data.success) return data;

    return {
      success: false,
      total_doctors: 0,
      total_patients: 0,
      avg_patients_per_doctor: 0,
      total_new_patients: 0,
      doctors: [],
      page: 1,
      limit: 10,
      has_more: false,
    };
  } catch (err) {
    console.error("Error fetching doctor analytics:", err);
    return {
      success: false,
      total_doctors: 0,
      total_patients: 0,
      avg_patients_per_doctor: 0,
      total_new_patients: 0,
      doctors: [],
      page: 1,
      limit: 10,
      has_more: false,
    };
  }
};

export const fetchAdminDiseaseDashboard = async (payload) => {
  try {
    const requestPayload = {
      ...payload,
      doctor_ids: payload.doctor_ids || [],
    };
    
    console.log("📤 Sending to backend:", requestPayload);
    
    const res = await fetch(`${API_URL}admin-disease-dashboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    const data = await res.json();
    console.log("Disease Dashboard Response:", data);

    if (data.success) return data;

    return {
      success: false,
      total_patients: 0,
      matched_patients: 0,
      disease_distribution: [],
      age_breakdown: [],
      sex_breakdown: [],
      patients: [],
    };
  } catch (err) {
    console.error("Error fetching disease dashboard:", err);
    return {
      success: false,
      total_patients: 0,
      matched_patients: 0,
      disease_distribution: [],
      age_breakdown: [],
      sex_breakdown: [],
      patients: [],
    };
  }
};