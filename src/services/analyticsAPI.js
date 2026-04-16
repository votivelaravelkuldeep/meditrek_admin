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

export const fetchSymptoms = async () => {
  if (symptomCache['all']) return symptomCache['all'];

  try {
    const res = await fetch(`${API_URL}get_all_symptoms`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    console.log("fetchSymptoms status:", res.status);
    const data = await res.json();
    console.log("fetchSymptoms raw data:", data);

    if (data.success && Array.isArray(data.data)) {
      const formatted = data.data.map(symptom => ({
        label: symptom.symptom_name,
        value: symptom.symptom_name,
      }));
      symptomCache['all'] = formatted;
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

export const fetchAdminDiseaseMedication = async (payload) => {
  try {
    const requestPayload = {
      doctor_ids: payload.doctor_ids || [],
      disease: payload.disease || [],
      medication: payload.medication || [],
      gender: payload.gender || "",
      age_group: payload.age_group || "",
      singleOnly: payload.singleOnly || false,
      combinedOnly: payload.combinedOnly || false,
      includeExtra: payload.includeExtra || false,
      page: payload.page || 1,
      limit: payload.limit || 10,
    };
    
    console.log("📤 Sending Disease/Medication request:", requestPayload);
    
    const res = await fetch(`${API_URL}admin-disease-medication`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    const data = await res.json();
    console.log("Disease/Medication Response:", data);

    if (data.success) return data;

    return {
      success: false,
      analytics: {
        total_patients: 0,
        matched_patients: 0,
        percentage: "0%",
        top_drug: "",
        doctors_count: 0,
      },
      medicine_distribution: [],
      top_medicines_graph: [],
      patients: {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 0,
      }
    };
  } catch (err) {
    console.error("Error fetching disease/medication data:", err);
    return {
      success: false,
      analytics: {
        total_patients: 0,
        matched_patients: 0,
        percentage: "0%",
        top_drug: "",
        doctors_count: 0,
      },
      medicine_distribution: [],
      top_medicines_graph: [],
      patients: {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 0,
      }
    };
  }
};

export const fetchAdminMedicationFull = async (payload) => {
  try {
    const requestPayload = {
      doctor_ids: payload.doctor_ids || [],
      medication: payload.medication || [],
      gender: payload.gender || "",
      age_group: payload.age_group || "",
      singleOnly: payload.singleOnly || false,
      combinedOnly: payload.combinedOnly || false,
      includeExtra: payload.includeExtra || false,
      summary_page: payload.summary_page || 1,
      summary_limit: payload.summary_limit || 10,
      patient_page: payload.patient_page || 1,
      patient_limit: payload.patient_limit || 10,
    };
    
    console.log("📤 Sending Medication Full request:", requestPayload);
    
    const res = await fetch(`${API_URL}admin-medication-full`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    const data = await res.json();
    console.log("Medication Full Response:", data);

    if (data.success) return data;

    return {
      success: false,
      total_patients: 0,
      matched_patients: 0,
      percentage: "0%",
      selected_medication_count: 0,
      summary_total: 0,
      patient_total: 0,
      summary: [],
      details: [],
      graph: [],
      drilldown: [],
    };
  } catch (err) {
    console.error("Error fetching medication full data:", err);
    return {
      success: false,
      total_patients: 0,
      matched_patients: 0,
      percentage: "0%",
      selected_medication_count: 0,
      summary_total: 0,
      patient_total: 0,
      summary: [],
      details: [],
      graph: [],
      drilldown: [],
    };
  }
};

export const fetchAdminMedicationDiseaseDashboard = async (payload) => {
  try {
    const requestPayload = {
      doctor_ids: payload.doctor_ids || [],
      medication: payload.medication || [],
      diseases: payload.diseases || [],
      age_group: payload.age_group || "",
      gender: payload.gender || "",
      exclude_disease: payload.exclude_disease || [],
      singleOnly: payload.singleOnly || false,
      combinedOnly: payload.combinedOnly || false,
      includeExtra: payload.includeExtra || false,
      page: payload.page || 1,
      limit: payload.limit || 10,
    };
    
    console.log("📤 Sending Medication/Disease request:", requestPayload);
    
    const res = await fetch(`${API_URL}admin-medication-disease-dashboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    const data = await res.json();
    console.log("Medication/Disease Response:", data);

    if (data.success) return data;

    return {
      success: false,
      total_patients: 0,
      matched_patients: 0,
      unique_diseases: 0,
      top_disease: "",
      disease_distribution: [],
      patients: [],
    };
  } catch (err) {
    console.error("Error fetching medication/disease data:", err);
    return {
      success: false,
      total_patients: 0,
      matched_patients: 0,
      unique_diseases: 0,
      top_disease: "",
      disease_distribution: [],
      patients: [],
    };
  }
};

export const fetchAdminMedicationReportedHealth = async (payload) => {
  try {
    const requestPayload = {
      doctor_ids: payload.doctor_ids || [],
      medication: payload.medication || [],
      age_group: payload.age_group || "",
      page: payload.page || 1,
      limit: payload.limit || 10,
      patient_page: payload.patient_page || 1,
      patient_limit: payload.patient_limit || 5,
    };
    
    console.log("📤 Sending Medication/Reported Health request:", requestPayload);
    
    const res = await fetch(`${API_URL}admin-medication-reported-health`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    const data = await res.json();
    console.log("Medication/Reported Health Response:", data);

    if (data.success) return data;

    return {
      success: false,
      total_patients: 0,
      total_medications: 0,
      page: 1,
      limit: 10,
      patient_page: 1,
      patient_limit: 5,
      data: [],
    };
  } catch (err) {
    console.error("Error fetching medication/reported health data:", err);
    return {
      success: false,
      total_patients: 0,
      total_medications: 0,
      page: 1,
      limit: 10,
      patient_page: 1,
      patient_limit: 5,
      data: [],
    };
  }
};

export const fetchAdminCustomTable = async (payload) => {
  try {
    const requestPayload = {
      doctor_ids: payload.doctor_ids || [],
      gender: payload.gender || "",
      age_group: payload.age_group || "",
      disease: payload.disease || [],
      medication: payload.medication || [],
      symptoms: payload.symptoms || [],
      page: payload.page || 1,
      limit: payload.limit || 10,
      singleOnly: payload.singleOnly || false,
      combinedOnly: payload.combinedOnly || false,
      includeExtra: payload.includeExtra || false,
    };
    
    console.log("📤 Sending Custom Table request:", requestPayload);
    
    const res = await fetch(`${API_URL}admin-patient-analytics-CustomTable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    const data = await res.json();
    console.log("Custom Table Response:", data);

    if (data.success) return data;

    return {
      success: false,
      total: 0,
      matched_patients: 0,
      page: 1,
      limit: 10,
      patients: [],
    };
  } catch (err) {
    console.error("Error fetching custom table data:", err);
    return {
      success: false,
      total: 0,
      matched_patients: 0,
      page: 1,
      limit: 10,
      patients: [],
    };
  }
};

export const fetchAdminCrossAnalytics = async (payload) => {
  try {
    const requestPayload = {
      doctor_ids: payload.doctor_ids || [],
      diseases: payload.diseases || [],
      measurements: payload.measurements || [],
      medications: payload.medications || [],
      gender: payload.gender || "",
      age_group: payload.age_group || "",
      disease_page: payload.disease_page || 1,
      disease_limit: payload.disease_limit || 10,
      medication_page: payload.medication_page || 1,
      medication_limit: payload.medication_limit || 10,
      measurement_page: payload.measurement_page || 1,
      measurement_limit: payload.measurement_limit || 10,
      records_page: payload.records_page || 1,
      records_limit: payload.records_limit || 10,
    };
    
    console.log("📤 Sending Cross Analytics request:", requestPayload);
    
    const res = await fetch(`${API_URL}admin-cross-analytics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    const data = await res.json();
    console.log("Cross Analytics Response:", data);

    if (data.success) return data;

    return {
      success: false,
      matched_patients: 0,
      diseases_selected: 0,
      measurements_selected: 0,
      medications_selected: 0,
      disease_overlap: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
      medication_overlap: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
      measurement_values: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
      records: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
    };
  } catch (err) {
    console.error("Error fetching cross analytics data:", err);
    return {
      success: false,
      matched_patients: 0,
      diseases_selected: 0,
      measurements_selected: 0,
      medications_selected: 0,
      disease_overlap: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
      medication_overlap: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
      measurement_values: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
      records: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
    };
  }
};

export const fetchMeasurementOptions = async (payload) => {
  try {
    const res = await fetch(`${API_URL}measurment-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Measurement Options Response:", data);

    if (data.success) return data;

    return {
      success: false,
      options: [],
      default_options: [
        { value: "bp", label: "Blood Pressure", type: "bp" },
        { value: "fasting_glucose", label: "Fasting Blood Glucose", type: "fasting_glucose" },
        { value: "ppbgs", label: "Postprandial Blood Glucose (PPBG)", type: "ppbgs" },
        { value: "weight", label: "Weight", type: "weight" },
        { value: "temperature", label: "Temperature", type: "temperature" }
      ]
    };
  } catch (err) {
    console.error("Error fetching measurement options:", err);
    return {
      success: false,
      options: [],
      default_options: [
        { value: "bp", label: "Blood Pressure", type: "bp" },
        { value: "fasting_glucose", label: "Fasting Blood Glucose", type: "fasting_glucose" },
        { value: "ppbgs", label: "Postprandial Blood Glucose (PPBG)", type: "ppbgs" },
        { value: "weight", label: "Weight", type: "weight" },
        { value: "temperature", label: "Temperature", type: "temperature" }
      ]
    };
  }
};