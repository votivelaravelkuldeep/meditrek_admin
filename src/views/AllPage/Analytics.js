import { useState, useMemo, useEffect } from "react";
import TagSearch from "./Analytics/TagSearch";
import AgeRangeFilter from "./Analytics/AgeRangeFilter";
import GenderFilter from "./Analytics/GenderFilter";
import { BsFillFileBarGraphFill, BsPeopleFill } from "react-icons/bs";
import { PiHospitalFill } from "react-icons/pi";
import { GiMedicines, GiPillDrop } from "react-icons/gi";
import { FaStethoscope } from "react-icons/fa";
import { BiSolidCustomize } from "react-icons/bi";
import { fetchAdminCrossAnalytics, fetchAdminCustomTable, fetchAdminDiseaseDashboard, fetchAdminDiseaseMedication, fetchAdminMedicationDiseaseDashboard, fetchAdminMedicationFull, fetchAdminMedicationReportedHealth, fetchAdminPatientDemographics, fetchAdminPatientDemographicsDetails, fetchDiseases, fetchDoctorAnalytics, fetchDoctors, fetchMeasurementOptions, fetchMedicines, fetchSymptoms } from "services/analyticsAPI";
import CustomPagination from "component/common/Pagination";
import { CircularProgress } from "@mui/material";

// const MOCK_PATIENTS = [
//   { id: 1, age: 45, gender: "Male", diseases: [{ name: "Hypertension" }, { name: "Type 2 Diabetes" }], medications: [{ name: "Lisinopril" }, { name: "Metformin" }], symptoms: "headache, fatigue" },
//   { id: 2, age: 32, gender: "Female", diseases: [{ name: "Migraine" }], medications: [{ name: "Sumatriptan" }], symptoms: "severe headache, nausea" },
//   { id: 3, age: 58, gender: "Male", diseases: [{ name: "COPD" }, { name: "Hypertension" }], medications: [{ name: "Albuterol" }, { name: "Lisinopril" }], symptoms: "shortness of breath, wheezing" },
//   { id: 4, age: 27, gender: "Female", diseases: [{ name: "Anxiety" }], medications: [{ name: "Sertraline" }], symptoms: "nervousness, insomnia" },
//   { id: 5, age: 62, gender: "Male", diseases: [{ name: "Osteoarthritis" }, { name: "Hypertension" }], medications: [{ name: "Ibuprofen" }, { name: "Amlodipine" }], symptoms: "joint pain, stiffness" },
//   { id: 6, age: 41, gender: "Female", diseases: [{ name: "Asthma" }], medications: [{ name: "Fluticasone" }], symptoms: "coughing, chest tightness" },
//   { id: 7, age: 73, gender: "Male", diseases: [{ name: "Heart Failure" }, { name: "COPD" }], medications: [{ name: "Furosemide" }, { name: "Spiriva" }], symptoms: "fatigue, edema, shortness of breath" },
//   { id: 8, age: 35, gender: "Female", diseases: [{ name: "Depression" }], medications: [{ name: "Escitalopram" }], symptoms: "low mood, loss of interest" },
//   { id: 9, age: 51, gender: "Male", diseases: [{ name: "Type 2 Diabetes" }, { name: "Hyperlipidemia" }], medications: [{ name: "Metformin" }, { name: "Atorvastatin" }], symptoms: "frequent urination, thirst" },
//   { id: 10, age: 29, gender: "Female", diseases: [{ name: "Migraine" }], medications: [{ name: "Rizatriptan" }], symptoms: "aura, throbbing headache" },
// ];

// const MOCK_DEMOGRAPHICS = [
//   {age_group:"0-18",  gender:"Male",   count:5},
//   {age_group:"0-18",  gender:"Female", count:4},
//   {age_group:"19-30", gender:"Male",   count:12},
//   {age_group:"19-30", gender:"Female", count:15},
//   {age_group:"31-45", gender:"Male",   count:18},
//   {age_group:"31-45", gender:"Female", count:14},
//   {age_group:"46+",   gender:"Male",   count:10},
//   {age_group:"46+",   gender:"Female", count:8},
// ];

// const MOCK_DOCTORS  = [{value:1,label:"Dr. Smith"},{value:2,label:"Dr. Johnson"},{value:3,label:"Dr. Williams"}];
// const MOCK_DISEASES = ["Hypertension", "Type 2 Diabetes", "Migraine", "COPD", "Anxiety", "Depression", "Asthma", "Osteoarthritis", "Heart Failure", "Hyperlipidemia"].map(l => ({ label: l }));
// const MOCK_MEDICINES = ["Lisinopril", "Metformin", "Sumatriptan", "Albuterol", "Sertraline", "Ibuprofen", "Amlodipine", "Fluticasone", "Furosemide", "Spiriva", "Escitalopram", "Atorvastatin", "Rizatriptan"].map(l => ({ label: l }));
const MOCK_SYMPTOMS = ["headache", "fatigue", "nausea", "shortness of breath", "wheezing", "joint pain", "coughing", "edema", "insomnia"].map(l => ({ label: l }));

// const MOCK_MEASUREMENTS = ["Blood Pressure", "Blood Glucose", "BMI", "Cholesterol", "Oxygen Saturation", "Heart Rate"];
// const MOCK_PATIENT_MEASUREMENTS = {
//   1: { "Blood Pressure": "142/90", "Blood Glucose": "7.8 mmol/L", "BMI": "28.1", "Cholesterol": "210 mg/dL" },
//   2: { "Blood Pressure": "118/76", "Blood Glucose": "5.1 mmol/L", "BMI": "22.4" },
//   3: { "Blood Pressure": "148/92", "Blood Glucose": "5.9 mmol/L", "BMI": "26.7", "Cholesterol": "220 mg/dL", "Oxygen Saturation": "94%" },
//   4: { "Blood Pressure": "115/72", "Blood Glucose": "4.9 mmol/L", "BMI": "21.0" },
//   5: { "Blood Pressure": "155/98", "Blood Glucose": "6.1 mmol/L", "BMI": "30.2", "Cholesterol": "245 mg/dL" },
//   6: { "Blood Pressure": "120/78", "Blood Glucose": "5.0 mmol/L", "BMI": "23.5", "Oxygen Saturation": "97%" },
//   7: { "Blood Pressure": "135/85", "Blood Glucose": "6.8 mmol/L", "BMI": "27.0", "Oxygen Saturation": "92%", "Heart Rate": "88 bpm" },
//   8: { "Blood Pressure": "112/70", "Blood Glucose": "4.7 mmol/L", "BMI": "20.8" },
//   9: { "Blood Pressure": "138/86", "Blood Glucose": "8.9 mmol/L", "BMI": "31.5", "Cholesterol": "260 mg/dL" },
//   10: { "Blood Pressure": "116/74", "Blood Glucose": "4.8 mmol/L", "BMI": "22.1" },
// };

// const AGE_GROUPS = {
//   "0-18": a => a >= 0 && a <= 18,
//   "19-30": a => a >= 19 && a <= 30,
//   "31-44": a => a >= 31 && a <= 44,
//   "45-64": a => a >= 45 && a <= 64,
//   "65-74": a => a >= 65 && a <= 74,
//   "75-84": a => a >= 75 && a <= 84,
//   "85+": a => a >= 85,
// };

/** Convert exact age → age-group label */
const toAgeGroup = age => {
  if (age <= 18) return "0-18";
  if (age <= 30) return "19-30";
  if (age <= 44) return "31-44";
  if (age <= 64) return "45-64";
  if (age <= 74) return "65-74";
  if (age <= 84) return "75-84";
  return "85+";
};

// const anonymise = (patients) =>
//   patients.map((p, i) => ({
//     ref: `P-${String(i + 1).padStart(3, "0")}`,   // P-001, P-002 …
//     ageGroup: toAgeGroup(p.age),
//     gender: p.gender,
//     conditions: p.diseases.map(d => d.name),
//     meds: p.medications.map(m => m.name),
//     symptoms: p.symptoms ? p.symptoms.split(", ") : [],
//   }));

const ACCENT = "#1ddec4";
const ACCENT_BG = "rgba(29,222,196,0.13)";
const GCOLORS = { Male: ACCENT, Female: "#60a5fa", Other: "#8b5cf6", "Not Specified": "#94a3b8" };

const S = {
  wrap: { display: "flex", fontFamily: "'DM Sans',sans-serif", minHeight: "100vh", background: "#f4f6fb" },
  nav: { width: 230, minWidth: 210, background: "#fff", borderRight: "1px solid #eaecf2", display: "flex", flexDirection: "column", flexShrink: 0 },
  navHead: { padding: "22px 20px 14px", borderBottom: "1px solid #f0f2f8" },
  navTitle: { fontSize: 15, fontWeight: 800, color: "#1a202c", letterSpacing: -.3 },
  navSub: { fontSize: 11, color: "#a0aec0", marginTop: 2 },
  navGroup: { padding: "14px 16px 4px 18px", fontSize: 10, fontWeight: 700, letterSpacing: 1.6, color: "#c4cad8", textTransform: "uppercase" },
  navItem: a => ({
    margin: "1px 10px", padding: "9px 12px", borderRadius: 10, cursor: "pointer", fontSize: 12.5,
    fontWeight: a ? 600 : 400, background: a ? ACCENT_BG : "transparent", color: a ? ACCENT : "#4a5568",
    border: a ? `1px solid rgba(29,222,196,0.25)` : "1px solid transparent",
    transition: "all .15s", display: "flex", alignItems: "center", gap: 9,
  }),
  main: { flex: 1, padding: "28px 28px 40px", overflowX: "hidden", minWidth: 0 },
  adminBanner: { background: `linear-gradient(135deg,${ACCENT_BG},rgba(96,165,250,0.08))`, border: `1px solid rgba(29,222,196,0.25)`, borderRadius: 12, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 },
  adminBannerLeft: { display: "flex", alignItems: "center", gap: 10 },
  adminBadge: { background: ACCENT, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, letterSpacing: .5, textTransform: "uppercase" },
  adminBannerText: { fontSize: 12, color: "#374151", fontWeight: 500 },
  doctorSelect: { padding: "7px 12px", borderRadius: 8, border: "1px solid #dde1ec", fontSize: 12, outline: "none", background: "#fff", minWidth: 200, cursor: "pointer" },
  anonBanner: { background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "9px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#92400e" },
  pageHead: { marginBottom: 20 },
  pageTitle: { fontSize: 18, fontWeight: 800, color: "#1a202c", margin: 0 },
  pageSub: { fontSize: 13, color: "#64748b", marginTop: 4 },
  filterBar: { background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #eaecf2", marginBottom: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" },
  filterRow: { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" },
  filterLabel: { fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 5, display: "block" },
  statRow: { display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 },
  statCard: { background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1px solid #eaecf2", minWidth: 130, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" },
  statVal: { fontSize: 24, fontWeight: 800, color: ACCENT, lineHeight: 1.1 },
  statLbl: { fontSize: 11, color: "#94a3b8", marginBottom: 4, fontWeight: 500 },
  statSub: { fontSize: 11, color: "#b0b8c9", marginTop: 3 },
  card: { background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #eaecf2", boxShadow: "0 1px 8px rgba(0,0,0,0.04)", marginBottom: 18 },
  cardTitle: { fontSize: 13, fontWeight: 700, color: "#1a202c", marginBottom: 14, marginTop: 0, display: "flex", alignItems: "center", justifyContent: "space-between" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 },
  tWrap: { overflowX: "auto", borderRadius: 10, border: "1px solid #eaecf2" },
  th: { padding: "10px 13px", fontSize: 11, fontWeight: 700, color: "#6b7280", background: "#f8f9fc", borderBottom: "1px solid #eaecf2", whiteSpace: "nowrap", letterSpacing: .3 },
  td: { padding: "10px 13px", fontSize: 12, color: "#374151", borderBottom: "1px solid #f4f6fb" },
  chip: t => ({
    display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 9px", borderRadius: 999,
    fontSize: 11, fontWeight: 500, background: t ? ACCENT_BG : "#f1f5f9", color: t ? ACCENT : "#374151",
    border: t ? `1px solid rgba(29,222,196,0.3)` : "1px solid #e5e7eb", margin: "2px 3px 2px 0", lineHeight: "15px",
  }),
  badge: c => ({
    display: "inline-block", whiteSpace: "nowrap", padding: "2px 9px", borderRadius: 999, fontSize: 11, fontWeight: 600,
    background: c === "Male" ? ACCENT_BG : c === "Female" ? "rgba(96,165,250,0.15)" : "rgba(139,92,246,0.15)",
    color: c === "Male" ? ACCENT : c === "Female" ? "#60a5fa" : "#8b5cf6",
  }),
  refBadge: { display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "#f1f5f9", color: "#64748b", fontFamily: "monospace", letterSpacing: .5 },
  ageGroupBadge: { display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "rgba(29,222,196,0.08)", color: ACCENT, border: `1px solid rgba(29,222,196,0.2)` },
  barWrap: { display: "flex", flexDirection: "column", gap: 9 },
  barRow: { display: "grid", gridTemplateColumns: "180px 1fr 70px", alignItems: "center", gap: 10 },
  barLabel: { fontSize: 12, color: "#374151", fontWeight: 500, wordBreak: "break-word" },
  barTrack: { width: "100%", background: "#f1f5f9", borderRadius: 999, height: 7, overflow: "hidden" },
  barFill: (p, c) => ({ height: "100%", width: `${Math.min(p, 100)}%`, background: c || ACCENT, borderRadius: 999, transition: "width .5s" }),
  barVal: { fontSize: 11, fontWeight: 700, color: ACCENT, textAlign: "right" },
  expandBtn: { border: "none", cursor: "pointer", fontSize: 11, color: ACCENT, fontWeight: 600, padding: "5px 12px", borderRadius: 7, background: ACCENT_BG },
  expandPanel: { marginTop: 14, borderTop: "1px solid #eaecf2", paddingTop: 14 },
  noData: { textAlign: "center", padding: "28px 0", color: "#b0b8c9", fontSize: 13 },
  checkLabel: a => ({ display: "flex", alignItems: "center", gap: 7, fontSize: 12, cursor: "pointer", color: a ? ACCENT : "#374151", fontWeight: a ? 600 : 400 }),
};

// function pct(n, d) { return d === 0 ? "0.0" : ((n / d) * 100).toFixed(1); }
function Chip({ label, teal }) { return <span style={S.chip(teal)}>{label}</span>; }
function DChips({ arr }) { return <>{(arr || []).map((c, i) => <Chip key={i} label={c} teal={false} />)}</>; }
function MChips({ arr }) { return <>{(arr || []).map((m, i) => <Chip key={i} label={m} teal={true} />)}</>; }

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={S.statCard}>
      <div style={S.statLbl}>{label}</div>
      <div style={{ ...S.statVal, color: accent || ACCENT }}>{value}</div>
      {sub && <div style={S.statSub}>{sub}</div>}
    </div>
  );
}

function HBar({ label, value, total, pctVal, color }) {
  const p = pctVal !== undefined ? parseFloat(pctVal) : (total > 0 ? (value / total) * 100 : 0);
  return (
    <div style={S.barRow}>
      <span style={S.barLabel} title={label}>{label}</span>
      <div style={S.barTrack}><div style={S.barFill(p, color)} /></div>
      <span style={{ ...S.barVal, color: color || ACCENT }}>{value} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({p.toFixed(1)}%)</span></span>
    </div>
  );
}

function DataTable({ cols, rows, empty = "No data found" }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const onSort = key => setSortConfig(prev => prev.key === key ? { key, direction: prev.direction === "asc" ? "desc" : "asc" } : { key, direction: "asc" });
  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return rows;
    return [...rows].sort((a, b) => {
      const av = a[sortConfig.key] ?? "", bv = b[sortConfig.key] ?? "";
      if (av < bv) return sortConfig.direction === "asc" ? -1 : 1;
      if (av > bv) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig]);
  return (
    <div style={S.tWrap}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c.key} style={{ ...S.th, cursor: c.sortable ? "pointer" : "default" }}
                onClick={() => c.sortable && onSort(c.key)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {c.label}
                  {c.sortable && <span className="sort-icons"><span className={`arrow up ${sortConfig?.key === c.key && sortConfig.direction === "asc" ? "active" : ""}`} /><span className={`arrow down ${sortConfig?.key === c.key && sortConfig.direction === "desc" ? "active" : ""}`} /></span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0
            ? <tr><td colSpan={cols.length} style={S.noData}>{empty}</td></tr>
            : sortedRows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafbfd" }}>
                {cols.map(c => <td key={c.key} style={{ ...S.td, ...(c.style || {}) }}>{c.render ? c.render(r) : r[c.key]}</td>)}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

// function AnonExpandPanel({ patients, showSymptoms = false }) {
//   const [open, setOpen] = useState(false);

//   /* Anonymise on expand — must be called before any early return */
//   const rows = useMemo(() => anonymise(patients || []), [patients]);

//   if (!patients || patients.length === 0) return null;

//   const cols = [
//     {
//       key: "ref", label: "Patient Ref",
//       render: r => <span style={S.refBadge}>{r.ref}</span>
//     },
//     {
//       key: "ageGroup", label: "Age Group",
//       sortable: true,
//       render: r => <span style={S.ageGroupBadge}>{r.ageGroup}</span>
//     },
//     {
//       key: "gender", label: "Gender",
//       sortable: true,
//       render: r => <span style={S.badge(r.gender)}>{r.gender}</span>
//     },
//     {
//       key: "conditions", label: "Diseases",
//       render: r => <DChips arr={r.conditions} />
//     },
//     {
//       key: "meds", label: "Medications",
//       render: r => <MChips arr={r.meds} />
//     },
//     ...(showSymptoms ? [{
//       key: "symptoms", label: "Reported Symptoms",
//       render: r => <DChips arr={r.symptoms} />
//     }] : []),
//   ];

//   return (
//     <div>
//       <button style={S.expandBtn} onClick={() => setOpen(v => !v)}>
//         {open ? "▲ Collapse records" : `▼ Expand — view ${patients.length} record${patients.length !== 1 ? "s" : ""}`}
//       </button>

//       {open && (
//         <div style={S.expandPanel}>
//           {/* Anonymisation notice */}
//           {/* <div style={S.anonBanner}>
//             <span style={{fontSize:15}}>🔒</span>
//             <span>
//               <strong>Anonymous view.</strong> Patient identifiers (name, exact age) are hidden in compliance with data privacy requirements.
//               Each row shows an auto-generated reference number, age group, and clinical data only.
//               This view is provided so you can verify the accuracy of the analytics above.
//             </span>
//           </div> */}
//           <DataTable cols={cols} rows={rows} empty="No records available" />
//         </div>
//       )}
//     </div>
//   );
// }

function AdminDoctorBanner({ selectedDoctors, doctors, onToggle }) {
  const doctorOptions = doctors.map(d => d.label);

  return (
    <div style={S.adminBanner}>
      <div style={S.adminBannerLeft}>
        <span style={S.adminBadge}>Admin</span>

        <span style={S.adminBannerText}>
          {selectedDoctors.length > 0
            ? `Viewing data for: ${selectedDoctors.length === 1
              ? selectedDoctors[0]
              : `${selectedDoctors.length} doctors selected`
            }`
            : "Viewing data across all doctors"}
        </span>
      </div>

      <div style={{ minWidth: 260 }}>
        <TagSearch
          label="Doctor"
          all={doctorOptions}
          selected={selectedDoctors}
          onToggle={(doctorName) => {
            const doctor = doctors.find(d => d.label === doctorName);
            onToggle(doctorName, doctor?.value);
          }}
          searchPlaceholder="Search doctors..."
        />
      </div>
    </div>
  );
}

function DoctorAnalytics({ selectedDoctorIds = [] }) {
  const [period, setPeriod] = useState("last_30_days");
  const [doctorsData, setDoctorsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const PERIOD_OPTIONS = [
    { value: "last_30_days", label: "Last 30 days" },
    { value: "last_90_days", label: "Last 90 days" },
    { value: "last_6_months", label: "Last 6 months" },
    { value: "last_year", label: "Last year" },
  ];

  const loadDoctorAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetchDoctorAnalytics({
        doctor_ids: selectedDoctorIds.length > 0 ? selectedDoctorIds : [],
        period,
        page,
        limit: rowsPerPage,
      });
      if (res?.success) setDoctorsData(res);
    } catch (err) {
      console.error("Error loading doctor analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDoctorAnalytics(); }, [period, selectedDoctorIds, page, rowsPerPage]);
  useEffect(() => { setPage(1); }, [period, selectedDoctorIds]);

  const getPeriodLabel = () =>
    PERIOD_OPTIONS.find(o => o.value === period)?.label ?? "Last 30 days";

  if (loading && !doctorsData) {
    return (
      <div>
        <div style={S.pageHead}>
          <h2 style={S.pageTitle}>Doctor Analytics</h2>
          <p style={S.pageSub}>Patient load and growth per doctor</p>
        </div>
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <CircularProgress size={32} />
          </div>
        </div>
      </div>
    );
  }

  const doctors = doctorsData?.doctors || [];
  const totalDoctors = doctorsData?.total_doctors || 0;
  const totalPatients = doctorsData?.total_patients || 0;
  // const avgPatients      = doctorsData?.avg_patients_per_doctor || 0;
  const totalNewPatients = doctorsData?.total_new_patients || 0;

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Doctor Analytics</h2>
        <p style={S.pageSub}>Patient load and growth per doctor</p>
      </div>

      {/* Period filter */}
      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ minWidth: 200 }}>
            <div style={S.filterLabel}>PERIOD</div>
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              style={{
                width: "100%", height: 38, border: "1.5px solid #e5e7eb",
                borderRadius: 10, padding: "0 12px", fontSize: 13,
                background: "#fff", cursor: "pointer", outline: "none",
              }}
            >
              {PERIOD_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stat cards — always reflect ALL doctors, not just current page */}
      <div style={S.statRow}>
        {loading ? (
          ["Total Doctors", "Total Patients", `New Patients (${getPeriodLabel()})`].map(lbl => (
            <div key={lbl} style={S.statCard}>
              <div style={S.statLbl}>{lbl}</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>
          ))
        ) : (
          <>
            <StatCard label="Total Doctors" value={totalDoctors} />
            <StatCard label="Total Patients" value={totalPatients} />
            {/* <StatCard label="Avg Patients / Doctor"                value={avgPatients}     /> */}
            <StatCard label={`New Patients (${getPeriodLabel()})`} value={totalNewPatients} />
          </>
        )}
      </div>

      {/* Patients per doctor — paginated bar chart */}
      <div style={S.card}>
        <p style={S.cardTitle}>Patients per doctor</p>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
            <CircularProgress size={24} />
          </div>
        ) : doctors.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {doctors.map((d, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{d.doctor_name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>{d.total_patients} patients</span>
                </div>
                <div style={S.barTrack}>
                  <div style={{
                    ...S.barFill(totalPatients > 0 ? (d.total_patients / totalPatients) * 100 : 0, ACCENT),
                  }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={S.noData}>No doctors found</div>
        )}

        {/* Pagination sits inside this card, only controls the rows above */}
        {totalDoctors > 0 && (
          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
            <CustomPagination
              count={totalDoctors}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              onRowsPerPageChange={val => { setRowsPerPage(val); setPage(1); }}
            />
          </div>
        )}
      </div>

      {/* New patient growth — separate pagination would go here if needed */}
      <div style={S.grid2}>
        <div style={S.card}>
          <p style={S.cardTitle}>New patient growth</p>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
              <CircularProgress size={24} />
            </div>
          ) : (
            <DataTable
              cols={[
                { key: "doctor_name", label: "Doctor", sortable: true },
                {
                  key: "new_patients", label: "New Patients", sortable: true,
                  render: r => <span style={{ fontWeight: 700, color: ACCENT }}>{r.new_patients}</span>
                },
                // { key:"growth_percent",label:"vs Last Period", sortable:true,
                //   render: r => (
                //     <span style={{
                //       display:"inline-flex", alignItems:"center", gap:4,
                //       padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600,
                //       background: r.trend==="up"   ? "rgba(34,197,94,0.1)"
                //                 : r.trend==="down" ? "rgba(239,68,68,0.1)"
                //                 :                    "rgba(107,114,128,0.1)",
                //       color:      r.trend==="up"   ? "#22c55e"
                //                 : r.trend==="down" ? "#ef4444"
                //                 :                    "#6b7280",
                //     }}>
                //       {r.trend==="up" ? "↑" : r.trend==="down" ? "↓" : "→"} {r.growth_percent}%
                //     </span>
                //   )
                // },
              ]}
              rows={doctors.map(d => ({
                doctor_name: d.doctor_name,
                new_patients: d.new_patients,
                growth_percent: d.growth_percent,
                trend: d.trend,
              }))}
              empty="No data available"
            />
          )}
        </div>

        {/* Session activity — active patients column removed */}
        <div style={S.card}>
          <p style={S.cardTitle}>Session activity</p>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
              <CircularProgress size={24} />
            </div>
          ) : (
            <DataTable
              cols={[
                { key: "doctor_name", label: "Doctor", sortable: true },
                {
                  key: "last_login", label: "Last Login", sortable: true,
                  render: r => (
                    <span style={{ fontSize: 12, color: "#64748b" }}>{r.last_login}</span>
                  )
                },
                {
                  key: "last_patient_added", label: "Last Patient Added", sortable: true,
                  render: r => (
                    <span style={{ fontSize: 12, color: "#64748b" }}>{r.last_patient_added}</span>
                  )
                },
              ]}
              rows={doctors.map(d => ({
                doctor_name: d.doctor_name,
                last_login: d.last_login,
                last_patient_added: d.last_patient_added,
              }))}
              empty="No data available"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Demographics({ selectedDoctorIds = [] }) {
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  const [summary, setSummary] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [totalPatients, setTotalPatients] = useState(0);
  const [matchedPatients, setMatchedPatients] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const buildPayload = () => ({
    doctor_ids: selectedDoctorIds.length > 0 ? selectedDoctorIds : [],
    gender: gender === "All" ? "" : gender === "Male" ? 1 : gender === "Female" ? 2 : 3,
    age_group: ageGroup === "All" ? "" : ageGroup,
    page,
    limit: rowsPerPage,
  });

  const loadSummary = async () => {
    setLoadingSummary(true);
    try {
      const payload = buildPayload();
      const res = await fetchAdminPatientDemographics(payload);
      if (res?.success) {
        setSummary(res);
        setTotalPatients(res.total_patients || 0);
        setMatchedPatients(res.matched_patients || 0);
      }
    } catch (err) {
      console.error("Error loading demographics summary:", err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const loadPatients = async () => {
    setLoadingPatients(true);
    try {
      const payload = buildPayload();
      console.log("🔍 Request Payload:", payload); // Debug

      const res = await fetchAdminPatientDemographicsDetails(payload);
      console.log("📊 API Response:", res); // Debug

      if (res?.success) {
        console.log(`✅ Received ${res.patients?.length || 0} patients out of ${res.total} total`); // Debug
        setPatients(res.patients || []);

        if (res.total !== res.matched_patients) {
          console.warn(`⚠️ Total (${res.total}) doesn't match matched_patients (${res.matched_patients})`);
        }
      }
    } catch (err) {
      console.error("Error loading patient details:", err);
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    loadSummary();
    loadPatients();
  }, [ageGroup, gender, selectedDoctorIds]);

  useEffect(() => {
    loadPatients();
  }, [page, rowsPerPage]);

  useEffect(() => {
    setPage(1);
  }, [ageGroup, gender, selectedDoctorIds]);

  const ageDist = useMemo(() => {
    if (!summary?.ageDistribution) return [];
    let filtered = summary.ageDistribution;
    if (ageGroup !== "All") {
      filtered = filtered.filter(item => item.age_group === ageGroup);
    }
    return filtered
      .filter(item => item.count > 0)
      .map(item => ({
        label: item.age_group,
        value: item.count,
        pct: item.percentage,
      }));
  }, [summary, ageGroup]);

  const genderDist = useMemo(() => {
    if (!summary?.sexDistribution) return [];
    let filtered = summary.sexDistribution;
    if (gender !== "All") {
      filtered = filtered.filter(item => item.gender === gender);
    }
    return filtered
      .filter(item => item.count > 0)
      .map(item => ({
        label: item.gender,
        value: item.count,
        pct: item.percentage,
      }));
  }, [summary, gender]);

  const crossData = useMemo(() => {
    if (!summary?.crossTable) return [];
    let filtered = summary.crossTable;
    if (ageGroup !== "All") {
      filtered = filtered.filter(row => row.age_group === ageGroup);
    }
    return filtered
      .filter(row => {
        const totalCount = parseInt(row.total?.toString().split(" ")[0] ?? "0", 10);
        return totalCount > 0;
      })
      .map(row => ({
        age: row.age_group,
        Male: row.Male,
        Female: row.Female,
        Other: row.Other,
        "Not Specified": row["Not Specified"],
        total: row.total,
      }));
  }, [summary, ageGroup]);

  const TOTAL_AGE_GROUPS = 7;

  if (loadingSummary && !summary) {
    return (
      <div>
        <div style={S.pageHead}>
          <h2 style={S.pageTitle}>Demographics</h2>
          <p style={S.pageSub}>Age group × Sex distribution across patients</p>
        </div>
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
            <CircularProgress size={32} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Demographics</h2>
        <p style={S.pageSub}>Age group × Sex distribution across patients</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <GenderFilter value={gender} onChange={setGender} />
          </div>
        </div>
      </div>

      <div style={S.statRow}>
        {loadingSummary ? (
          <>
            {["Patients in View", "Total Patients", "Age Groups"].map(lbl => (
              <div key={lbl} style={S.statCard}>
                <div style={S.statLbl}>{lbl}</div>
                <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                  <CircularProgress size={24} />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard
              label="Patients in View"
              value={matchedPatients}
              sub={`${totalPatients > 0 ? ((matchedPatients / totalPatients) * 100).toFixed(1) : "0.0"}% of all patients`}
            />
            <StatCard label="Total Patients" value={totalPatients} />
            <StatCard label="Age Groups" value={TOTAL_AGE_GROUPS} />
          </>
        )}
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <p style={S.cardTitle}>
            Age Group Distribution
            <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>
              % of all {totalPatients} patients
            </span>
          </p>
          {loadingSummary ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
              <CircularProgress size={24} />
            </div>
          ) : ageDist.length > 0 ? (
            <div style={S.barWrap}>
              {ageDist.map((d, i) => (
                <HBar key={i} label={d.label} value={d.value} total={totalPatients} pctVal={d.pct} />
              ))}
            </div>
          ) : (
            <div style={S.noData}>No age distribution data available</div>
          )}
        </div>

        <div style={S.card}>
          <p style={S.cardTitle}>
            Sex Distribution
            <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>
              % of all {totalPatients} patients
            </span>
          </p>
          {loadingSummary ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
              <CircularProgress size={24} />
            </div>
          ) : genderDist.length > 0 ? (
            <div style={S.barWrap}>
              {genderDist.map((d, i) => (
                <HBar key={i} label={d.label} value={d.value} total={totalPatients} pctVal={d.pct} color={GCOLORS[d.label]} />
              ))}
            </div>
          ) : (
            <div style={S.noData}>No gender distribution data available</div>
          )}
        </div>
      </div>

      <div style={S.card}>
        <p style={S.cardTitle}>Age × Sex Cross-table</p>
        {loadingSummary ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
            <CircularProgress size={24} />
          </div>
        ) : (
          <DataTable
            cols={[
              { key: "age", label: "Age Group", sortable: true },
              {
                key: "Male", label: "Male", sortable: true,
                render: r => <span style={{ fontWeight: 600, color: ACCENT }}>{r.Male}</span>
              },
              {
                key: "Female", label: "Female", sortable: true,
                render: r => <span style={{ fontWeight: 600, color: "#60a5fa" }}>{r.Female}</span>
              },
              {
                key: "Other", label: "Other", sortable: true,
                render: r => <span style={{ fontWeight: 600, color: "#8b5cf6" }}>{r.Other}</span>
              },
              {
                key: "Not Specified", label: "Not Specified", sortable: true,
                render: r => <span style={{ fontWeight: 600, color: "#94a3b8" }}>{r["Not Specified"]}</span>
              },
              {
                key: "total", label: "Total", sortable: true,
                render: r => <span style={{ fontWeight: 700 }}>{r.total}</span>
              },
            ]}
            rows={crossData}
            empty="No cross-table data available"
          />
        )}
      </div>

      <div style={S.card}>
        <p style={S.cardTitle}>Patient Details</p>
        {loadingPatients ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
            <CircularProgress size={32} />
          </div>
        ) : patients.length > 0 ? (
          <>
            <DataTable
              cols={[
                // { key: "user_id", label: "Patient Ref", sortable: true },
                { key: "age", label: "Age", sortable: true },
                {
                  key: "gender", label: "Gender", sortable: true,
                  render: r => <span style={S.badge(r.gender)}>{r.gender}</span>
                },
                {
                  key: "diseases", label: "Diseases",
                  render: r => {
                    let diseasesList = [];
                    if (r.diseases) {
                      try {
                        const matches = r.diseases.match(/name:\s*([^,}]+)/g);
                        if (matches) diseasesList = matches.map(m => m.replace("name:", "").trim());
                      } catch (e) { diseasesList = []; }
                    }
                    return <DChips arr={diseasesList} />;
                  }
                },
                {
                  key: "medications", label: "Medications",
                  render: r => <MChips arr={(r.medications || []).map(m => m.name)} />
                },
              ]}
              rows={patients}
            />
            <CustomPagination
              count={matchedPatients}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={newPage => setPage(newPage)}
              onRowsPerPageChange={val => { setRowsPerPage(val); setPage(1); }}
              hideRowsPerPage={true}
            />
          </>
        ) : (
          <div style={S.noData}>No patient records found</div>
        )}
      </div>
    </div>
  );
}

function DiseaseDemo({ diseases, selectedDoctorIds = [] }) {
  const allDiseases = diseases?.length > 0
    ? diseases.map(d => ({ label: d.label, value: d.value }))
    : [];

  const [selDiseases, setSelDiseases] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  const [loading, setLoading] = useState(false);
  const [patientPage, setPatientPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [singleOnly, setSingleOnly] = useState(false);
  const [combinedOnly, setCombinedOnly] = useState(false);
  const [includeExtra, setIncludeExtra] = useState(false);
  const [dashboard, setDashboard] = useState({
    total_patients: 0,
    matched_patients: 0,
    disease_distribution: [],
    age_breakdown: [],
    sex_breakdown: [],
    patients: [],
  });
  const [diseasePage, setDiseasePage] = useState(1);
  const [diseaseRowsPerPage, setDiseaseRowsPerPage] = useState(10);
  const toggleD = (diseaseLabel) => {
    setSelDiseases(prev =>
      prev.includes(diseaseLabel)
        ? prev.filter(x => x !== diseaseLabel)
        : [...prev, diseaseLabel]
    );
    setPatientPage(1);
  };

  const parseDiseaseNames = (nameStr) => {
    if (!nameStr || nameStr === "") return ["No Disease"];
    const matches = nameStr.match(/name:\s*([^,}]+)/g);
    if (matches && matches.length > 0) {
      return matches.map(m => m.replace("name:", "").trim());
    }
    if (/^\d+(?:,\d+)*$/.test(nameStr)) {
      return ["Multiple Diseases (ID only)"];
    }
    if (nameStr && !nameStr.includes("disease_id") && nameStr !== "") {
      return [nameStr];
    }
    return [nameStr || "Unknown"];
  };

  const formatDiseaseName = (nameStr) => {
    if (!nameStr || nameStr === "") return "No Disease";
    const names = parseDiseaseNames(nameStr);
    if (names.length === 1) return names[0];
    if (names.length <= 3) return names.join(", ");
    return `${names.slice(0, 3).join(", ")} +${names.length - 3} more`;
  };

  const fetchData = async () => {
    setLoading(true);

    const payload = {
      doctor_ids: selectedDoctorIds.length > 0 ? selectedDoctorIds : [],
      disease: selDiseases,
      age_group: ageGroup !== "All" ? ageGroup : "",
      gender: gender !== "All" ? gender : "",
      singleOnly,
      combinedOnly,
      includeExtra,
      page: patientPage,
      limit: rowsPerPage,
      disease_page: diseasePage,
      disease_limit: diseaseRowsPerPage,
    };

    console.log("📤 Sending payload:", payload);

    try {
      const res = await fetchAdminDiseaseDashboard(payload);
      console.log("📥 Received response:", res);

      if (res && res.success) {
        const processedDistribution = (res.disease_distribution || [])
          .filter(item => item.name !== null && item.name !== undefined)
          .map(item => ({
            ...item,
            display_name: formatDiseaseName(item.name),
          }));

        setDashboard({
          ...res,
          disease_distribution: processedDistribution,
        });
      } else {
        console.error("API returned success: false", res);
      }
    } catch (error) {
      console.error("Error fetching disease dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selDiseases, ageGroup, gender, selectedDoctorIds, singleOnly, combinedOnly, includeExtra]);

  useEffect(() => {
    fetchData();
  }, [patientPage, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [diseasePage, diseaseRowsPerPage]);

  useEffect(() => {
    setPatientPage(1);
    setDiseasePage(1);
  }, [selDiseases, ageGroup, gender, selectedDoctorIds, singleOnly, combinedOnly, includeExtra]);

  useEffect(() => {
    setSingleOnly(false);
    setCombinedOnly(false);
    setIncludeExtra(false);
  }, [selDiseases]);

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Disease / Demographics</h2>
        <p style={S.pageSub}>Disease prevalence by age and sex</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 2, minWidth: 200 }}>
            <TagSearch
              label="Disease"
              all={allDiseases.map(d => d.label)}
              selected={selDiseases}
              onToggle={toggleD}
              searchPlaceholder="Search diseases…"
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <GenderFilter value={gender} onChange={setGender} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {selDiseases.length >= 2 && (
            <div style={{ marginTop: 12, display: "flex", gap: 20 }}>
              <label style={S.checkLabel(combinedOnly)}>
                <input
                  type="checkbox"
                  checked={combinedOnly}
                  onChange={e => {
                    setCombinedOnly(e.target.checked);
                    if (e.target.checked) setIncludeExtra(false);
                  }}
                  style={{ accentColor: ACCENT }}
                />
                Combined — patients must have ALL selected diseases
              </label>

              <label style={S.checkLabel(includeExtra)}>
                <input
                  type="checkbox"
                  checked={includeExtra}
                  onChange={e => {
                    setIncludeExtra(e.target.checked);
                    if (e.target.checked) setCombinedOnly(false);
                  }}
                  style={{ accentColor: ACCENT }}
                />
                Include extra diseases
              </label>
            </div>
          )}

          {/* ✅ SINGLE disease */}
          {selDiseases.length === 1 && (
            <div style={{ marginTop: 12 }}>
              <label style={S.checkLabel(singleOnly)}>
                <input
                  type="checkbox"
                  checked={singleOnly}
                  onChange={e => {
                    setSingleOnly(e.target.checked);
                  }}
                  style={{ accentColor: ACCENT }}
                />
                Only patients with exactly this disease
              </label>
            </div>
          )}
        </div>
      </div>

      <div style={S.statRow}>
        {loading ? (
          <>
            <div style={S.statCard}>
              <div style={S.statLbl}>Matched Patients</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>
            <div style={S.statCard}>
              <div style={S.statLbl}>Group Size</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>
            <div style={S.statCard}>
              <div style={S.statLbl}>Diseases Selected</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>
          </>
        ) : (
          <>
            <StatCard
              label="Matched Patients"
              value={dashboard.matched_patients || 0}
              sub={`${dashboard.total_patients > 0
                ? ((dashboard.matched_patients / dashboard.total_patients) * 100).toFixed(1)
                : "0.0"}% of group`}
            />
            <StatCard
              label="Group Size"
              value={dashboard.total_patients || 0}
              sub="Total patients"
            />
            <StatCard
              label="Diseases Selected"
              value={selDiseases.length || "All"}
            />
          </>
        )}
      </div>

      {/* CHARTS - ALL data, no pagination */}
      <div style={S.grid2}>
        <div style={S.card}>
          <p style={S.cardTitle}>Disease Distribution</p>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
              <CircularProgress size={24} />
            </div>
          ) : dashboard.disease_distribution && dashboard.disease_distribution.length > 0 ? (
            <div style={S.barWrap}>
              {dashboard.disease_distribution.map((d, i) => (
                <HBar
                  key={i}
                  label={d.display_name}
                  value={d.count}
                  total={dashboard.matched_patients}
                  pctVal={d.percentage}
                />
              ))}
            </div>
          ) : (
            <div style={S.noData}>No disease distribution data available</div>
          )}
          {dashboard.disease_distribution.length > 0 && (
            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <CustomPagination
                count={dashboard.disease_total || 0}
                page={diseasePage}
                rowsPerPage={diseaseRowsPerPage}
                onPageChange={setDiseasePage}
                onRowsPerPageChange={(val) => {
                  setDiseaseRowsPerPage(val);
                  setDiseasePage(1);
                }}
                hideRowsPerPage={true}
              />
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={S.card}>
            <p style={S.cardTitle}>Age Breakdown</p>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                <CircularProgress size={24} />
              </div>
            ) : dashboard.age_breakdown && dashboard.age_breakdown.length > 0 ? (
              <div style={S.barWrap}>
                {dashboard.age_breakdown.map((d, i) => (
                  <HBar
                    key={i}
                    label={d.age_group}
                    value={d.count}
                    total={dashboard.matched_patients}
                    pctVal={d.percentage}
                  />
                ))}
              </div>
            ) : (
              <div style={S.noData}>No age breakdown data available</div>
            )}
          </div>

          <div style={S.card}>
            <p style={S.cardTitle}>Sex Breakdown</p>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                <CircularProgress size={24} />
              </div>
            ) : dashboard.sex_breakdown && dashboard.sex_breakdown.length > 0 ? (
              <div style={S.barWrap}>
                {dashboard.sex_breakdown.map((d, i) => (
                  <HBar
                    key={i}
                    label={d.gender}
                    value={d.count}
                    total={dashboard.matched_patients}
                    pctVal={d.percentage}
                    color={GCOLORS[d.gender]}
                  />
                ))}
              </div>
            ) : (
              <div style={S.noData}>No sex breakdown data available</div>
            )}
          </div>
        </div>
      </div>

      {/* PATIENT TABLE - Only this has pagination */}
      <div style={S.card}>
        <p style={S.cardTitle}>Patient Records</p>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
            <CircularProgress size={32} />
          </div>
        ) : dashboard.patients && dashboard.patients.length > 0 ? (
          <>
            <DataTable
              cols={[
                // { key: "name", label: "Patient Name", sortable: true },
                { key: "age", label: "Age", sortable: true },
                {
                  key: "gender", label: "Gender", sortable: true,
                  render: r => <span style={S.badge(r.gender)}>{r.gender}</span>
                },
                {
                  key: "diseases", label: "Diseases",
                  render: r => {
                    const diseaseNames = parseDiseaseNames(r.diseases);
                    return <DChips arr={diseaseNames} />;
                  }
                },
                {
                  key: "medications", label: "Medications",
                  render: r => <MChips arr={(r.medications || []).map(m => m.name)} />
                },
              ]}
              rows={dashboard.patients}
              empty="No patient records found"
            />
            {dashboard.matched_patients > 0 && (
              <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                <CustomPagination
                  count={dashboard.matched_patients}
                  page={patientPage}
                  rowsPerPage={rowsPerPage}
                  onPageChange={setPatientPage}
                  onRowsPerPageChange={(val) => { setRowsPerPage(val); setPatientPage(1); }}
                />
              </div>
            )}
          </>
        ) : (
          <div style={S.noData}>No patient records found</div>
        )}
      </div>
    </div>
  );
}

function DiseaseMedication({ diseases, selectedDoctorIds = [] }) {
  const allDiseases = diseases?.length > 0
    ? diseases.map(d => d.label)
    : [];

  const [selDiseases, setSelDiseases] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  const [singleOnly, setSingleOnly] = useState(false);
  const [combinedOnly, setCombined] = useState(false);
  const [includeExtra, setIncludeExtra] = useState(false);

  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    analytics: {
      total_patients: 0,
      matched_patients: 0,
      percentage: "0%",
      top_drug: "",
      doctors_count: 0,
    },
    medicine_distribution: [],
    patients: {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      total_pages: 0,
    }
  });

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPatients, setShowPatients] = useState(false);
  const [medPage, setMedPage] = useState(1);
  const [medRowsPerPage, setMedRowsPerPage] = useState(10);

  const toggleD = d => {
    setSelDiseases(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    );
    setPage(1);
  };

  useEffect(() => {
    setSingleOnly(false);
    setCombined(false);
    setIncludeExtra(false);
    setPage(1);
  }, [selDiseases]);

  const fetchData = async () => {
    setLoading(true);

    const payload = {
      doctor_ids: selectedDoctorIds || [],
      disease: selDiseases,
      medication: [],
      gender: gender !== "All" ? (gender === "Male" ? 1 : gender === "Female" ? 2 : 3) : "",
      age_group: ageGroup !== "All" ? ageGroup : "",
      singleOnly,
      combinedOnly,
      includeExtra,
      page,
      limit: rowsPerPage,
      med_page: medPage,
      med_limit: medRowsPerPage
    };

    try {
      const res = await fetchAdminDiseaseMedication(payload);
      if (res && res.success) {
        setDashboardData(res);
      } else {
        console.error("API returned error:", res);
      }
    } catch (error) {
      console.error("Error fetching disease/medication data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selDiseases, ageGroup, gender, singleOnly, combinedOnly, includeExtra, selectedDoctorIds, page, rowsPerPage]);

  const medicationStats = dashboardData.medicine_distribution || [];

  const topDrug = dashboardData.analytics.top_drug || "—";
  const matchedPatients = dashboardData.analytics.matched_patients || 0;
  const totalPatients = dashboardData.analytics.total_patients || 0;
  const percentage = dashboardData.analytics.percentage || "0";

  const patientData = dashboardData.patients?.data || [];

  // Helper function to parse diseases from API response
  const parseDiseasesFromPatient = (diseasesData) => {
    if (!diseasesData) return [];

    // If it's already an array
    if (Array.isArray(diseasesData)) {
      return diseasesData.map(d => {
        if (typeof d === 'string') return d;
        if (d && d.name) return d.name;
        return String(d);
      }).filter(Boolean);
    }

    // If it's a string, try to parse it
    if (typeof diseasesData === 'string') {
      try {
        // Try JSON parse first
        const parsed = JSON.parse(diseasesData);
        if (Array.isArray(parsed)) {
          return parsed.map(d => d.name || d).filter(Boolean);
        }
      } catch (e) {
        // If JSON parse fails, try regex for "name: value" pattern
        const matches = diseasesData.match(/name:\s*([^,}]+)/g);
        if (matches && matches.length > 0) {
          return matches.map(m => m.replace("name:", "").trim());
        }
        // If no matches, return the string as is if it's not empty
        if (diseasesData.trim()) {
          return [diseasesData];
        }
      }
    }

    return [];
  };

  // Helper function to parse medications
  const parseMedicationsFromPatient = (medicationsData) => {
    if (!medicationsData) return [];

    if (Array.isArray(medicationsData)) {
      return medicationsData.map(m => {
        if (typeof m === 'string') return m;
        if (m && m.medicine_name) return m.medicine_name;
        if (m && m.name) return m.name;
        return String(m);
      }).filter(Boolean);
    }

    return [];
  };

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Disease / Medication</h2>
        <p style={S.pageSub}>Select diseases → see which drugs are prescribed</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 2, minWidth: 200 }}>
            <TagSearch
              label="Disease(s)"
              all={allDiseases}
              selected={selDiseases}
              onToggle={toggleD}
              searchPlaceholder="Add diseases…"
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <GenderFilter value={gender} onChange={setGender} />
          </div>
        </div>

        {selDiseases.length >= 2 && (
          <div style={{ marginTop: 12, display: 'flex', gap: 20 }}>
            <label style={S.checkLabel(combinedOnly)}>
              <input
                type="checkbox"
                checked={combinedOnly}
                onChange={e => {
                  setCombined(e.target.checked);
                  if (e.target.checked) setIncludeExtra(false);
                  setPage(1);
                }}
                style={{ accentColor: ACCENT }}
              />
              Combined — patients must have ALL selected diseases
            </label>
            <label style={S.checkLabel(includeExtra)}>
              <input
                type="checkbox"
                checked={includeExtra}
                onChange={e => {
                  setIncludeExtra(e.target.checked);
                  if (e.target.checked) setCombined(false);
                  setPage(1);
                }}
                style={{ accentColor: ACCENT }}
              />
              Include extra diseases (patients can have more than selected)
            </label>
          </div>
        )}

        {selDiseases.length === 1 && (
          <div style={{ marginTop: 12 }}>
            <label style={S.checkLabel(singleOnly)}>
              <input
                type="checkbox"
                checked={singleOnly}
                onChange={e => {
                  setSingleOnly(e.target.checked);
                  setPage(1);
                }}
                style={{ accentColor: ACCENT }}
              />
              Only patients with exactly this disease (no other diseases)
            </label>
          </div>
        )}
      </div>

      <div style={S.statRow}>
        {loading ? (
          <>
            {["Matched Patients", "Total Patients", "Top Drug"].map(lbl => (
              <div key={lbl} style={S.statCard}>
                <div style={S.statLbl}>{lbl}</div>
                <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                  <CircularProgress size={24} />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard
              label="Matched Patients"
              value={matchedPatients}
              sub={`${percentage}% of all patients`}
            />
            <StatCard label="Total Patients" value={totalPatients} />
            <StatCard label="Top Drug" value={topDrug} />
          </>
        )}
      </div>

      <div style={S.card}>
        <p style={S.cardTitle}>
          Medication Distribution
          <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400, marginLeft: 8 }}>
            among {matchedPatients} matched patients
          </span>
        </p>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <CircularProgress size={32} />
          </div>
        ) : medicationStats.length === 0 ? (
          <div style={S.noData}>No data found</div>
        ) : (
          <>
            <DataTable
              cols={[
                {
                  key: "medicine_name",
                  label: "Medication",
                  sortable: true,
                  render: r => <Chip label={r.medicine_name} teal={true} />
                },
                {
                  key: "patient_count",
                  label: "Patients",
                  sortable: true,
                  render: r => <span style={{ fontWeight: 700, color: ACCENT }}>{r.patient_count}</span>
                },
                {
                  key: "percent_matched",
                  label: "% of Matched",
                  sortable: true,
                  render: r => <span>{r.percent_matched}%</span>
                },
                {
                  key: "percent_total",
                  label: "% of All Patients",
                  sortable: true,
                  render: r => <span style={{ color: "#94a3b8" }}>{r.percent_total}%</span>
                },
                {
                  key: "bar",
                  label: "",
                  render: r => (
                    <div style={{ ...S.barTrack, minWidth: 80 }}>
                      <div style={S.barFill(parseFloat(r.percent_matched))} />
                    </div>
                  )
                }
              ]}
              rows={medicationStats}
            />

            {dashboardData.medicine_total > medRowsPerPage && (
              <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                <CustomPagination
                  count={dashboardData.medicine_total || 0}
                  page={medPage}
                  rowsPerPage={medRowsPerPage}
                  onPageChange={setMedPage}
                  onRowsPerPageChange={val => {
                    setMedRowsPerPage(val);
                    setMedPage(1);
                  }}
                  hideRowsPerPage={true}
                />
              </div>
            )}
          </>
        )}

        <div style={{ marginTop: 14 }}>
          {matchedPatients > 0 && (
            <button
              style={S.expandBtn}
              onClick={() => setShowPatients(prev => !prev)}
            >
              {showPatients ? "▲ Collapse patients" : `▼ Expand patients (${matchedPatients} total)`}
            </button>
          )}

          {showPatients && (
            <>
              <p style={{ fontWeight: 500, margin: "12px 0 8px" }}>
                Total: {matchedPatients} patients
              </p>

              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                  <CircularProgress size={24} />
                </div>
              ) : patientData.length === 0 ? (
                <div style={S.noData}>No patients on this page</div>
              ) : (
                <DataTable
                  cols={[
                    {
                      key: "name",
                      label: "Patient Name",
                      sortable: true,
                      render: r => <span>{r.name || "—"}</span>
                    },
                    {
                      key: "age",
                      label: "Age",
                      sortable: true,
                      render: r => <span>{r.age ?? "—"}</span>
                    },
                    {
                      key: "gender",
                      label: "Gender",
                      sortable: true,
                      render: r => {
                        let genderText = r.gender || "Not Specified";
                        if (genderText === 1) genderText = "Male";
                        if (genderText === 2) genderText = "Female";
                        if (genderText === 3) genderText = "Other";
                        return <Chip label={genderText} />;
                      }
                    },
                    {
                      key: "diseases",
                      label: "Diseases",
                      render: r => {
                        const diseasesList = parseDiseasesFromPatient(r.diseases);
                        return diseasesList.length > 0
                          ? diseasesList.map((d, idx) => <Chip key={idx} label={d} />)
                          : <span style={{ color: "#94a3b8" }}>—</span>;
                      }
                    },
                    {
                      key: "medications",
                      label: "Medications",
                      render: r => {
                        const medsList = parseMedicationsFromPatient(r.medications);
                        return medsList.length > 0
                          ? medsList.map((m, idx) => <Chip key={idx} label={m} teal />)
                          : <span style={{ color: "#94a3b8" }}>—</span>;
                      }
                    }
                  ]}
                  rows={patientData}
                />
              )}

              {dashboardData.patients?.total_pages > 1 && (
                <div style={{ marginTop: 10 }}>
                  <CustomPagination
                    count={matchedPatients}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={newPage => setPage(newPage)}
                    onRowsPerPageChange={val => { setRowsPerPage(val); setPage(1); }}
                    hideRowsPerPage={true}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MedicationDemo({ medicines, selectedDoctorIds = [] }) {
  const allMeds = medicines?.length > 0 
    ? medicines.map(m => m.label) 
    : [];

  const [selMeds, setSelMeds] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  const [singleOnly, setSingleOnly] = useState(false);
  const [combinedOnly, setCombinedOnly] = useState(false);
  const [includeExtra, setIncludeExtra] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    total_patients: 0,
    matched_patients: 0,
    percentage: "0%",
    selected_medication_count: 0,
    summary_total: 0,
    patient_total: 0,
    summary: [],
    details: [],
    age_breakdown: [],
    sex_breakdown: [],
  });
  
  const [summaryPage, setSummaryPage] = useState(1);
  const [summaryRowsPerPage, setSummaryRowsPerPage] = useState(10);
  const [patientPage, setPatientPage] = useState(1);
  const [patientRowsPerPage, setPatientRowsPerPage] = useState(10);
  const [showPatients, setShowPatients] = useState(false);

  const toggleM = (medLabel) => {
    setSelMeds(prev =>
      prev.includes(medLabel)
        ? prev.filter(x => x !== medLabel)
        : [...prev, medLabel]
    );
    setSummaryPage(1);
    setPatientPage(1);
  };

  // Reset checkboxes when medication selection changes
  useEffect(() => {
    setSingleOnly(false);
    setCombinedOnly(false);
    setIncludeExtra(false);
    setSummaryPage(1);
    setPatientPage(1);
  }, [selMeds]);

  const fetchData = async () => {
    setLoading(true);

    const payload = {
      doctor_ids: selectedDoctorIds || [],
      medication: selMeds,
      gender: gender !== "All" ? (gender === "Male" ? 1 : gender === "Female" ? 2 : 3) : "",
      age_group: ageGroup !== "All" ? ageGroup : "",
      singleOnly,
      combinedOnly,
      includeExtra,
      summary_page: summaryPage,
      summary_limit: summaryRowsPerPage,
      patient_page: patientPage,
      patient_limit: patientRowsPerPage,
    };

    console.log("🔵 MedicationDemo - Sending payload:", JSON.stringify(payload, null, 2));

    try {
      const res = await fetchAdminMedicationFull(payload);
      console.log("🟢 MedicationDemo - Response:", res);
      if (res && res.success) {
        // Filter out age groups with zero count
        const filteredAgeBreakdown = (res.age_breakdown || []).filter(item => item.count > 0);
        // Filter out gender with zero count
        const filteredSexBreakdown = (res.sex_breakdown || []).filter(item => item.count > 0);
        
        setDashboardData({
          total_patients: res.total_patients || 0,
          matched_patients: res.matched_patients || 0,
          percentage: res.percentage || "0%",
          selected_medication_count: res.selected_medication_count || 0,
          summary_total: res.summary_total || 0,
          patient_total: res.patient_total || 0,
          summary: res.summary || [],
          details: res.details || [],
          age_breakdown: filteredAgeBreakdown,
          sex_breakdown: filteredSexBreakdown,
        });
      } else {
        console.error("API returned error:", res);
        setDashboardData({
          total_patients: 0,
          matched_patients: 0,
          percentage: "0%",
          selected_medication_count: 0,
          summary_total: 0,
          patient_total: 0,
          summary: [],
          details: [],
          age_breakdown: [],
          sex_breakdown: [],
        });
      }
    } catch (error) {
      console.error("Error fetching medication data:", error);
      setDashboardData({
        total_patients: 0,
        matched_patients: 0,
        percentage: "0%",
        selected_medication_count: 0,
        summary_total: 0,
        patient_total: 0,
        summary: [],
        details: [],
        age_breakdown: [],
        sex_breakdown: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selMeds, ageGroup, gender, singleOnly, combinedOnly, includeExtra, selectedDoctorIds, summaryPage, summaryRowsPerPage, patientPage, patientRowsPerPage]);

  const matchedPatients = dashboardData.matched_patients || 0;
  const totalPatients = dashboardData.total_patients || 0;
  const percentage = dashboardData.percentage || "0%";
  const summaryData = dashboardData.summary || [];
  const patientData = dashboardData.details || [];
  const ageBreakdown = dashboardData.age_breakdown || [];
  const sexBreakdown = dashboardData.sex_breakdown || [];

  // Helper function to parse diseases from string
  const parseDiseasesFromString = (diseasesStr) => {
    if (!diseasesStr) return [];
    if (Array.isArray(diseasesStr)) return diseasesStr;
    if (typeof diseasesStr === 'string') {
      try {
        const parsed = JSON.parse(diseasesStr);
        return parsed.map(d => d.name || d);
      } catch {
        const matches = diseasesStr.match(/name:\s*([^,}]+)/g);
        if (matches) {
          return matches.map(m => m.replace("name:", "").trim());
        }
        return diseasesStr.split(",").map(d => d.trim()).filter(Boolean);
      }
    }
    return [];
  };

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Medication / Demographics</h2>
        <p style={S.pageSub}>Medication usage breakdown by age and sex</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 2, minWidth: 200 }}>
            <TagSearch
              label="Medication"
              all={allMeds}
              selected={selMeds}
              onToggle={toggleM}
              searchPlaceholder="Search medications…"
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <GenderFilter value={gender} onChange={setGender} />
          </div>
        </div>

        {/* Checkbox filters - only show when medications are selected */}
        {selMeds.length >= 2 && (
          <div style={{ marginTop: 12, display: 'flex', gap: 20 }}>
            <label style={S.checkLabel(combinedOnly)}>
              <input
                type="checkbox"
                checked={combinedOnly}
                onChange={e => {
                  setCombinedOnly(e.target.checked);
                  if (e.target.checked) setIncludeExtra(false);
                  setSummaryPage(1);
                  setPatientPage(1);
                }}
                style={{ accentColor: ACCENT }}
              />
              Combined — patients must have ALL selected medications
            </label>
            <label style={S.checkLabel(includeExtra)}>
              <input
                type="checkbox"
                checked={includeExtra}
                onChange={e => {
                  setIncludeExtra(e.target.checked);
                  if (e.target.checked) setCombinedOnly(false);
                  setSummaryPage(1);
                  setPatientPage(1);
                }}
                style={{ accentColor: ACCENT }}
              />
              Include extra medications (patients can have more than selected)
            </label>
          </div>
        )}

        {selMeds.length === 1 && (
          <div style={{ marginTop: 12 }}>
            <label style={S.checkLabel(singleOnly)}>
              <input
                type="checkbox"
                checked={singleOnly}
                onChange={e => {
                  setSingleOnly(e.target.checked);
                  setSummaryPage(1);
                  setPatientPage(1);
                }}
                style={{ accentColor: ACCENT }}
              />
              Only patients with exactly this medication (no other medications)
            </label>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div style={S.statRow}>
        {loading ? (
          <>
            {["Matched Patients", "Total Patients", "Selected Meds"].map(lbl => (
              <div key={lbl} style={S.statCard}>
                <div style={S.statLbl}>{lbl}</div>
                <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                  <CircularProgress size={24} />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard
              label="Matched Patients"
              value={matchedPatients}
              sub={`${percentage} of all patients`}
            />
            <StatCard label="Total Patients" value={totalPatients} />
            <StatCard label="Selected Meds" value={selMeds.length || "All"} />
          </>
        )}
      </div>

      {/* Drug Distribution Table */}
      <div style={S.card}>
        <p style={S.cardTitle}>
          Drug Distribution
          <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400, marginLeft: 8 }}>
            among {matchedPatients} matched patients
          </span>
        </p>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <CircularProgress size={32} />
          </div>
        ) : summaryData.length === 0 ? (
          <div style={S.noData}>No drug distribution data found</div>
        ) : (
          <>
            <DataTable
              cols={[
                {
                  key: "medicine_name",
                  label: "Medication",
                  sortable: true,
                  render: r => <Chip label={r.medicine_name} teal={true} />
                },
                {
                  key: "patient_count",
                  label: "Patients",
                  sortable: true,
                  render: r => <span style={{ fontWeight: 700, color: ACCENT }}>{r.patient_count}</span>
                },
                {
                  key: "percentage",
                  label: "% of All Patients",
                  sortable: true,
                  render: r => <span style={{ color: "#94a3b8" }}>{r.percentage}%</span>
                },
                {
                  key: "bar",
                  label: "",
                  render: r => (
                    <div style={{ ...S.barTrack, minWidth: 80 }}>
                      <div style={S.barFill(parseFloat(r.percentage))} />
                    </div>
                  )
                }
              ]}
              rows={summaryData}
            />

            {/* Summary Table Pagination */}
            {dashboardData.summary_total > summaryRowsPerPage && (
              <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                <CustomPagination
                  count={dashboardData.summary_total || 0}
                  page={summaryPage}
                  rowsPerPage={summaryRowsPerPage}
                  onPageChange={setSummaryPage}
                  onRowsPerPageChange={(val) => {
                    setSummaryRowsPerPage(val);
                    setSummaryPage(1);
                  }}
                  hideRowsPerPage={true}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Age & Sex Breakdown Section - Only show if there is data */}
      {(ageBreakdown.length > 0 || sexBreakdown.length > 0) && (
        <div style={S.grid2}>
          {ageBreakdown.length > 0 && (
            <div style={S.card}>
              <p style={S.cardTitle}>Age Breakdown</p>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                  <CircularProgress size={24} />
                </div>
              ) : (
                <div style={S.barWrap}>
                  {ageBreakdown.map((d, i) => (
                    <HBar
                      key={i}
                      label={d.age_group}
                      value={d.count}
                      total={matchedPatients}
                      pctVal={d.percentage}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {sexBreakdown.length > 0 && (
            <div style={S.card}>
              <p style={S.cardTitle}>Sex Breakdown</p>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                  <CircularProgress size={24} />
                </div>
              ) : (
                <div style={S.barWrap}>
                  {sexBreakdown.map((d, i) => (
                    <HBar
                      key={i}
                      label={d.gender}
                      value={d.count}
                      total={matchedPatients}
                      pctVal={d.percentage}
                      color={GCOLORS[d.gender]}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Patient Records Section - Shows ALL patient data */}
      <div style={S.card}>
        <p style={S.cardTitle}>
          Patient Records
          <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400, marginLeft: 8 }}>
            showing {patientData.length} of {dashboardData.patient_total || 0} patients
          </span>
        </p>
        
        {matchedPatients > 0 && patientData.length > 0 && (
          <button
            style={S.expandBtn}
            onClick={() => setShowPatients(prev => !prev)}
          >
            {showPatients ? "▲ Collapse patients" : `▼ Expand patients (${matchedPatients} total)`}
          </button>
        )}

        {showPatients && (
          <>
            <p style={{ fontWeight: 500, margin: "12px 0 8px" }}>
              Total: {matchedPatients} patients
            </p>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                <CircularProgress size={24} />
              </div>
            ) : patientData.length === 0 ? (
              <div style={S.noData}>No patients on this page</div>
            ) : (
              <DataTable
                cols={[
                  {
                    key: "name",
                    label: "Patient Name",
                    sortable: true,
                    render: r => <span>{r.name || "—"}</span>
                  },
                  {
                    key: "age",
                    label: "Age",
                    sortable: true,
                    render: r => <span>{r.age ?? "—"}</span>
                  },
                  {
                    key: "gender",
                    label: "Gender",
                    sortable: true,
                    render: r => {
                      let genderText = r.gender || "Not Specified";
                      if (genderText === 1) genderText = "Male";
                      if (genderText === 2) genderText = "Female";
                      if (genderText === 3) genderText = "Other";
                      return <Chip label={genderText} />;
                    }
                  },
                  {
                    key: "diseases",
                    label: "Diseases",
                    render: r => {
                      const diseasesList = parseDiseasesFromString(r.diseases);
                      return diseasesList.length > 0
                        ? diseasesList.map((d, idx) => <Chip key={idx} label={d} />)
                        : <span style={{ color: "#94a3b8" }}>—</span>;
                    }
                  },
                  {
                    key: "medications",
                    label: "Medications",
                    render: r => {
                      const medsList = (r.medications || []).map(m => m.medicine_name || m.name);
                      return medsList.length > 0
                        ? medsList.map((m, idx) => <Chip key={idx} label={m} teal />)
                        : <span style={{ color: "#94a3b8" }}>—</span>;
                    }
                  }
                ]}
                rows={patientData}
              />
            )}

            {/* Patient Pagination */}
            {dashboardData.patient_total > patientRowsPerPage && (
              <div style={{ marginTop: 10 }}>
                <CustomPagination
                  count={dashboardData.patient_total || 0}
                  page={patientPage}
                  rowsPerPage={patientRowsPerPage}
                  onPageChange={setPatientPage}
                  onRowsPerPageChange={(val) => {
                    setPatientRowsPerPage(val);
                    setPatientPage(1);
                  }}
                  hideRowsPerPage={true}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MedicationDisease({ medicines, selectedDoctorIds = [] }) {
  const allMeds = medicines?.length > 0 
    ? medicines.map(m => m.label) 
    : [];

  const [selMeds, setSelMeds] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  const [singleOnly, setSingleOnly] = useState(false);
  const [combinedOnly, setCombinedOnly] = useState(false);
  const [includeExtra, setIncludeExtra] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    total_patients: 0,
    matched_patients: 0,
    unique_diseases: 0,
    top_disease: "",
    disease_distribution: [],
    patients: [],
  });
  
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPatients, setShowPatients] = useState(false);

  const toggleM = (medLabel) => {
    setSelMeds(prev =>
      prev.includes(medLabel)
        ? prev.filter(x => x !== medLabel)
        : [...prev, medLabel]
    );
    setPage(1);
  };

  // Reset checkboxes when medication selection changes
  useEffect(() => {
    setSingleOnly(false);
    setCombinedOnly(false);
    setIncludeExtra(false);
    setPage(1);
  }, [selMeds]);

  const fetchData = async () => {
    setLoading(true);

    const payload = {
      doctor_ids: selectedDoctorIds || [],
      medication: selMeds,  // Empty array is fine - backend returns all data
      age_group: ageGroup !== "All" ? ageGroup : "",
      gender: gender !== "All" ? (gender === "Male" ? 1 : gender === "Female" ? 2 : 3) : "",
      singleOnly,
      combinedOnly,
      includeExtra,
      page,
      limit: rowsPerPage,
    };

    console.log("🔵 MedicationDisease - Sending payload:", JSON.stringify(payload, null, 2));
    console.log("🔵 selMeds length:", selMeds.length);

    try {
      const res = await fetchAdminMedicationDiseaseDashboard(payload);
      console.log("🟢 MedicationDisease - Response:", res);
      if (res && res.success) {
        setDashboardData(res);
      } else {
        console.error("API returned error:", res);
        setDashboardData({
          total_patients: 0,
          matched_patients: 0,
          unique_diseases: 0,
          top_disease: "",
          disease_distribution: [],
          patients: [],
        });
      }
    } catch (error) {
      console.error("Error fetching medication/disease data:", error);
      setDashboardData({
        total_patients: 0,
        matched_patients: 0,
        unique_diseases: 0,
        top_disease: "",
        disease_distribution: [],
        patients: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a separate effect for pagination changes
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  // Main effect for filter changes
  useEffect(() => {
    fetchData();
  }, [selMeds, ageGroup, gender, singleOnly, combinedOnly, includeExtra, selectedDoctorIds]);

  const matchedPatients = dashboardData.matched_patients || 0;
  const totalPatients = dashboardData.total_patients || 0;
  const percentage = totalPatients > 0 ? ((matchedPatients / totalPatients) * 100).toFixed(2) : "0.00";
  const uniqueDiseases = dashboardData.unique_diseases || 0;
  const topDisease = dashboardData.top_disease || "—";
  const diseaseDistribution = dashboardData.disease_distribution || [];
  const patientData = dashboardData.patients || [];

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Medication / Disease</h2>
        <p style={S.pageSub}>Select medications → see which diseases are associated</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 2, minWidth: 200 }}>
            <TagSearch
              label="Medication(s)"
              all={allMeds}
              selected={selMeds}
              onToggle={toggleM}
              searchPlaceholder="Add medications…"
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <GenderFilter value={gender} onChange={setGender} />
          </div>
        </div>

        {/* Checkbox filters - only show when medications are selected */}
        {selMeds.length >= 2 && (
          <div style={{ marginTop: 12, display: 'flex', gap: 20 }}>
            <label style={S.checkLabel(combinedOnly)}>
              <input
                type="checkbox"
                checked={combinedOnly}
                onChange={e => {
                  setCombinedOnly(e.target.checked);
                  if (e.target.checked) setIncludeExtra(false);
                  setPage(1);
                }}
                style={{ accentColor: ACCENT }}
              />
              Combined — patients must have ALL selected medications
            </label>
            <label style={S.checkLabel(includeExtra)}>
              <input
                type="checkbox"
                checked={includeExtra}
                onChange={e => {
                  setIncludeExtra(e.target.checked);
                  if (e.target.checked) setCombinedOnly(false);
                  setPage(1);
                }}
                style={{ accentColor: ACCENT }}
              />
              Include extra medications (patients can have more than selected)
            </label>
          </div>
        )}

        {selMeds.length === 1 && (
          <div style={{ marginTop: 12 }}>
            <label style={S.checkLabel(singleOnly)}>
              <input
                type="checkbox"
                checked={singleOnly}
                onChange={e => {
                  setSingleOnly(e.target.checked);
                  setPage(1);
                }}
                style={{ accentColor: ACCENT }}
              />
              Only patients with exactly this medication (no other medications)
            </label>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div style={S.statRow}>
        {loading ? (
          <>
            {["Matched Patients", "Unique Diseases", "Top Disease"].map(lbl => (
              <div key={lbl} style={S.statCard}>
                <div style={S.statLbl}>{lbl}</div>
                <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                  <CircularProgress size={24} />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard
              label="Matched Patients"
              value={matchedPatients}
              sub={`${percentage}% of all patients`}
            />
            <StatCard label="Unique Diseases" value={uniqueDiseases} />
            <StatCard label="Top Disease" value={topDisease} />
          </>
        )}
      </div>

      {/* Disease Distribution Table */}
      <div style={S.card}>
        <p style={S.cardTitle}>
          Disease Distribution
          <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400, marginLeft: 8 }}>
            among {matchedPatients} matched patients
          </span>
        </p>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <CircularProgress size={32} />
          </div>
        ) : diseaseDistribution.length === 0 ? (
          <div style={S.noData}>No disease distribution data found</div>
        ) : (
          <DataTable
            cols={[
              {
                key: "disease",
                label: "Disease",
                sortable: true,
                render: r => <Chip label={r.disease} teal={false} />
              },
              {
                key: "patient_count",
                label: "Patients",
                sortable: true,
                render: r => <span style={{ fontWeight: 700, color: ACCENT }}>{r.patient_count}</span>
              },
              {
                key: "percent_matched",
                label: "% of Matched",
                sortable: true,
                render: r => <span>{r.percent_matched}%</span>
              },
              {
                key: "percent_total",
                label: "% of All Patients",
                sortable: true,
                render: r => <span style={{ color: "#94a3b8" }}>{r.percent_total}%</span>
              },
              {
                key: "bar",
                label: "",
                render: r => (
                  <div style={{ ...S.barTrack, minWidth: 80 }}>
                    <div style={S.barFill(parseFloat(r.percent_matched))} />
                  </div>
                )
              }
            ]}
            rows={diseaseDistribution}
          />
        )}
      </div>

      {/* Patient Records Section */}
      <div style={S.card}>
        <p style={S.cardTitle}>Patient Records</p>
        
        {matchedPatients > 0 && (
          <button
            style={S.expandBtn}
            onClick={() => setShowPatients(prev => !prev)}
          >
            {showPatients ? "▲ Collapse patients" : `▼ Expand patients (${matchedPatients} total)`}
          </button>
        )}

        {showPatients && (
          <>
            <p style={{ fontWeight: 500, margin: "12px 0 8px" }}>
              Total: {matchedPatients} patients
            </p>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                <CircularProgress size={24} />
              </div>
            ) : patientData.length === 0 ? (
              <div style={S.noData}>No patients on this page</div>
            ) : (
              <DataTable
                cols={[
                  {
                    key: "name",
                    label: "Patient Name",
                    sortable: true,
                    render: r => <span>{r.name || "—"}</span>
                  },
                  {
                    key: "age",
                    label: "Age",
                    sortable: true,
                    render: r => <span>{r.age ?? "—"}</span>
                  },
                  {
                    key: "gender",
                    label: "Gender",
                    sortable: true,
                    render: r => {
                      let genderText = r.gender || "Not Specified";
                      if (genderText === 1) genderText = "Male";
                      if (genderText === 2) genderText = "Female";
                      if (genderText === 3) genderText = "Other";
                      return <Chip label={genderText} />;
                    }
                  },
                  {
                    key: "diseases",
                    label: "Diseases",
                    render: r => {
                      let diseasesList = [];
                      if (r.diseases) {
                        try {
                          if (typeof r.diseases === 'string') {
                            diseasesList = r.diseases.split(",").map(d => d.trim()).filter(Boolean);
                          } else if (Array.isArray(r.diseases)) {
                            diseasesList = r.diseases;
                          }
                        } catch (e) { diseasesList = []; }
                      }
                      return diseasesList.length > 0
                        ? diseasesList.map((d, idx) => <Chip key={idx} label={d} />)
                        : <span style={{ color: "#94a3b8" }}>—</span>;
                    }
                  },
                  {
                    key: "medications",
                    label: "Medications",
                    render: r => {
                      const medsList = (r.medications || []).map(m => m.name || m.medicine_name);
                      return medsList.length > 0
                        ? medsList.map((m, idx) => <Chip key={idx} label={m} teal />)
                        : <span style={{ color: "#94a3b8" }}>—</span>;
                    }
                  }
                ]}
                rows={patientData}
              />
            )}

            {/* Patient Pagination */}
            {dashboardData.patients?.length === rowsPerPage && matchedPatients > rowsPerPage && (
              <div style={{ marginTop: 10 }}>
                <CustomPagination
                  count={matchedPatients}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={setPage}
                  onRowsPerPageChange={(val) => {
                    setRowsPerPage(val);
                    setPage(1);
                  }}
                  hideRowsPerPage={true}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MedicationHealth({ medicines, selectedDoctorIds = [] }) {
  const allMeds = medicines?.length > 0 
    ? medicines.map(m => m.label) 
    : [];

  const [selMeds, setSelMeds] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    total_patients: 0,
    total_medications: 0,
    page: 1,
    limit: 10,
    patient_page: 1,
    patient_limit: 5,
    data: [],
  });
  
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedMedication, setExpandedMedication] = useState(null);

  const toggleM = (medLabel) => {
    setSelMeds(prev =>
      prev.includes(medLabel)
        ? prev.filter(x => x !== medLabel)
        : [...prev, medLabel]
    );
    setPage(1);
  };

  const fetchData = async () => {
    setLoading(true);

    const payload = {
      doctor_ids: selectedDoctorIds || [],
      medication: selMeds,  // Empty array is fine - backend returns all data
      age_group: ageGroup !== "All" ? ageGroup : "",
      page,
      limit: rowsPerPage,
      patient_page: 1,
      patient_limit: 5,
    };

    console.log("🔵 MedicationHealth - Sending payload:", JSON.stringify(payload, null, 2));

    try {
      const res = await fetchAdminMedicationReportedHealth(payload);
      console.log("🟢 MedicationHealth - Response:", res);
      if (res && res.success) {
        setDashboardData(res);
      } else {
        console.error("API returned error:", res);
        setDashboardData({
          total_patients: 0,
          total_medications: 0,
          page: 1,
          limit: 10,
          patient_page: 1,
          patient_limit: 5,
          data: [],
        });
      }
    } catch (error) {
      console.error("Error fetching medication/reported health data:", error);
      setDashboardData({
        total_patients: 0,
        total_medications: 0,
        page: 1,
        limit: 10,
        patient_page: 1,
        patient_limit: 5,
        data: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selMeds, ageGroup, selectedDoctorIds, page, rowsPerPage]);

  const totalPatients = dashboardData.total_patients || 0;
  const medicationData = dashboardData.data || [];

  const toggleExpand = (medicationName) => {
    setExpandedMedication(expandedMedication === medicationName ? null : medicationName);
  };

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Medication / Reported Health</h2>
        <p style={S.pageSub}>For each medication, see the reported health outcomes and their frequency</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 2, minWidth: 200 }}>
            <TagSearch
              label="Drug name(s)"
              all={allMeds}
              selected={selMeds}
              onToggle={toggleM}
              searchPlaceholder="Filter by drug name…"
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={S.statRow}>
        {loading ? (
          <>
            {["Total Medications", "Total Patients"].map(lbl => (
              <div key={lbl} style={S.statCard}>
                <div style={S.statLbl}>{lbl}</div>
                <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                  <CircularProgress size={24} />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard label="Total Medications" value={dashboardData.total_medications || 0} />
            <StatCard label="Total Patients" value={totalPatients} />
          </>
        )}
      </div>

      {/* Medication Cards */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <CircularProgress size={32} />
        </div>
      ) : medicationData.length === 0 ? (
        <div style={S.card}>
          <div style={S.noData}>No data found</div>
        </div>
      ) : (
        medicationData.map((item, idx) => (
          <div key={idx} style={S.card}>
            <p style={S.cardTitle}>
              <span>
                <Chip label={item.medication.name} teal={true} />
                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400, marginLeft: 6 }}>
                  {item.total_patients} patients ({item.percentage} of total)
                </span>
              </span>
            </p>
            
            {/* Symptoms Bar Chart */}
            <div style={S.barWrap}>
              {item.symptoms && item.symptoms.length > 0 ? (
                item.symptoms.map((symptom, i) => (
                  <HBar
                    key={i}
                    label={symptom.symptom}
                    value={symptom.count}
                    total={item.total_patients}
                    pctVal={parseFloat(symptom.percentage)}
                    color="#f59e0b"
                  />
                ))
              ) : (
                <div style={S.noData}>No reported symptoms for this medication</div>
              )}
            </div>

            {/* Expand/Collapse Patients Button */}
            {item.patients && item.patients.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <button
                  style={S.expandBtn}
                  onClick={() => toggleExpand(item.medication.name)}
                >
                  {expandedMedication === item.medication.name 
                    ? "▲ Collapse patients" 
                    : `▼ Expand patients (${item.total_patients_in_medication || item.patients.length} total)`}
                </button>

                {expandedMedication === item.medication.name && (
                  <div style={S.expandPanel}>
                    <p style={{ fontWeight: 500, margin: "12px 0 8px" }}>
                      Patients with reported reactions for {item.medication.name}
                    </p>
                    <DataTable
                      cols={[
                        {
                          key: "patient_name",
                          label: "Patient Name",
                          sortable: true,
                          render: r => <span>{r.patient_name || "—"}</span>
                        },
                        {
                          key: "age",
                          label: "Age",
                          sortable: true,
                          render: r => <span>{r.age ?? "—"}</span>
                        },
                        {
                          key: "diseases",
                          label: "Diseases",
                          render: r => {
                            let diseasesList = [];
                            if (r.diseases) {
                              try {
                                const matches = r.diseases.match(/name:\s*([^,}]+)/g);
                                if (matches) diseasesList = matches.map(m => m.replace("name:", "").trim());
                              } catch (e) { diseasesList = []; }
                            }
                            return diseasesList.length > 0
                              ? diseasesList.map((d, idx) => <Chip key={idx} label={d} />)
                              : <span style={{ color: "#94a3b8" }}>—</span>;
                          }
                        },
                        {
                          key: "symptoms",
                          label: "Reported Symptoms",
                          render: r => {
                            const symptomsList = r.symptoms ? r.symptoms.split(",").map(s => s.trim()) : [];
                            return symptomsList.length > 0
                              ? symptomsList.map((s, idx) => <Chip key={idx} label={s} />)
                              : <span style={{ color: "#94a3b8" }}>—</span>;
                          }
                        },
                        {
                          key: "all_medications",
                          label: "All Medications",
                          render: r => {
                            const medsList = (r.all_medications || []).map(m => m.name);
                            return medsList.length > 0
                              ? medsList.slice(0, 3).map((m, idx) => <Chip key={idx} label={m} teal />)
                              : <span style={{ color: "#94a3b8" }}>—</span>;
                          }
                        }
                      ]}
                      rows={item.patients || []}
                      empty="No patients found"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}

      {/* Pagination for Medications */}
      {dashboardData.total_medications > rowsPerPage && (
        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          <CustomPagination
            count={dashboardData.total_medications || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={(val) => {
              setRowsPerPage(val);
              setPage(1);
            }}
            hideRowsPerPage={true}
          />
        </div>
      )}
    </div>
  );
}

function CrossAnalysis({ diseases, medicines, selectedDoctorIds = [] }) {
  const allDiseases = diseases?.length > 0 ? diseases.map(d => d.label) : [];
  const allMeds = medicines?.length > 0 ? medicines.map(m => m.label) : [];
  
  const [measurementOptions, setMeasurementOptions] = useState([]);
  const [selDiseases, setSelDiseases] = useState([]);
  const [selMeasurements, setSelMeasurements] = useState([]);
  const [selMeds, setSelMeds] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    matched_patients: 0,
    diseases_selected: 0,
    measurements_selected: 0,
    medications_selected: 0,
    disease_overlap: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
    medication_overlap: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
    measurement_values: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
    records: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
  });
  
  // Pagination states
  const [diseasePage, setDiseasePage] = useState(1);
  const [diseaseRowsPerPage, setDiseaseRowsPerPage] = useState(10);
  const [medicationPage, setMedicationPage] = useState(1);
  const [medicationRowsPerPage, setMedicationRowsPerPage] = useState(10);
  const [measurementPage, setMeasurementPage] = useState(1);
  const [measurementRowsPerPage, setMeasurementRowsPerPage] = useState(10);
  const [recordsPage, setRecordsPage] = useState(1);
  const [recordsRowsPerPage, setRecordsRowsPerPage] = useState(10);

  const toggleD = d => setSelDiseases(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleM = m => setSelMeasurements(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  const toggleMed = m => setSelMeds(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  // Load measurement options
  useEffect(() => {
    const loadMeasurementOptions = async () => {
      try {
        const res = await fetchMeasurementOptions({
          doctor_ids: selectedDoctorIds || []
        });
        if (res && res.success) {
          setMeasurementOptions(res.options || res.default_options || []);
        }
      } catch (error) {
        console.error("Error loading measurement options:", error);
        setMeasurementOptions([
          { value: "bp", label: "Blood Pressure", type: "bp" },
          { value: "fasting_glucose", label: "Fasting Blood Glucose", type: "fasting_glucose" },
          { value: "ppbgs", label: "Postprandial Blood Glucose (PPBG)", type: "ppbgs" },
          { value: "weight", label: "Weight", type: "weight" },
          { value: "temperature", label: "Temperature", type: "temperature" }
        ]);
      }
    };
    loadMeasurementOptions();
  }, [selectedDoctorIds]);

  const fetchData = async () => {
    setLoading(true);

    const payload = {
      doctor_ids: selectedDoctorIds || [],
      diseases: selDiseases,
      measurements: selMeasurements,
      medications: selMeds,
      gender: gender !== "All" ? (gender === "Male" ? 1 : gender === "Female" ? 2 : 3) : "",
      age_group: ageGroup !== "All" ? ageGroup : "",
      disease_page: diseasePage,
      disease_limit: diseaseRowsPerPage,
      medication_page: medicationPage,
      medication_limit: medicationRowsPerPage,
      measurement_page: measurementPage,
      measurement_limit: measurementRowsPerPage,
      records_page: recordsPage,
      records_limit: recordsRowsPerPage,
    };

    console.log("🔵 CrossAnalysis - Sending payload:", JSON.stringify(payload, null, 2));

    try {
      const res = await fetchAdminCrossAnalytics(payload);
      console.log("🟢 CrossAnalysis - Response:", res);
      if (res && res.success) {
        setDashboardData(res);
      } else {
        console.error("API returned error:", res);
        setDashboardData({
          matched_patients: 0,
          diseases_selected: 0,
          measurements_selected: 0,
          medications_selected: 0,
          disease_overlap: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
          medication_overlap: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
          measurement_values: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
          records: { data: [], total: 0, page: 1, limit: 10, total_pages: 0 },
        });
      }
    } catch (error) {
      console.error("Error fetching cross analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selDiseases, selMeasurements, selMeds, ageGroup, gender, selectedDoctorIds, 
      diseasePage, diseaseRowsPerPage, medicationPage, medicationRowsPerPage, 
      measurementPage, measurementRowsPerPage, recordsPage, recordsRowsPerPage]);

  const matchedPatients = dashboardData.matched_patients || 0;
  const diseaseOverlapData = dashboardData.disease_overlap?.data || [];
  const medicationOverlapData = dashboardData.medication_overlap?.data || [];
  const measurementValuesData = dashboardData.measurement_values?.data || [];
  const recordsData = dashboardData.records?.data || [];

  const anyFilter = selDiseases.length > 0 || selMeds.length > 0 || selMeasurements.length > 0;

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Cross-Analysis</h2>
        <p style={S.pageSub}>Explore relationships across diseases, measurements, and medications</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <TagSearch
              label="Disease"
              all={allDiseases}
              selected={selDiseases}
              onToggle={toggleD}
              searchPlaceholder="Search diseases..."
            />
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <TagSearch
              label="Measurement"
              all={measurementOptions.map(opt => opt.label)}
              selected={selMeasurements}
              onToggle={toggleM}
              searchPlaceholder="Search measurements..."
            />
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <TagSearch
              label="Medication"
              all={allMeds}
              selected={selMeds}
              onToggle={toggleMed}
              searchPlaceholder="Search medications..."
            />
          </div>
        </div>

        <div style={{ ...S.filterRow, marginTop: 12 }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <GenderFilter value={gender} onChange={setGender} />
          </div>
        </div>
      </div>

      <div style={S.statRow}>
        {loading ? (
          <>
            {["Matched Patients", "Diseases Selected", "Measurements", "Medications"].map(lbl => (
              <div key={lbl} style={S.statCard}>
                <div style={S.statLbl}>{lbl}</div>
                <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                  <CircularProgress size={24} />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard 
              label="Matched Patients" 
              value={matchedPatients} 
              sub={`${matchedPatients} patients match selected criteria`} 
            />
            <StatCard label="Diseases Selected" value={selDiseases.length || "All"} />
            <StatCard label="Measurements" value={selMeasurements.length || "None"} />
            <StatCard label="Medications Selected" value={selMeds.length || "All"} />
          </>
        )}
      </div>

      {!anyFilter ? (
        <div style={S.card}>
          <div style={S.noData}>Select at least one disease, measurement, or medication to explore correlations</div>
        </div>
      ) : (
        <>
          {/* Disease Overlap Section */}
          <div style={S.grid2}>
            <div style={S.card}>
              <p style={S.cardTitle}>
                Disease Overlap
                <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400, marginLeft: 8 }}>
                  among {matchedPatients} matched patients
                </span>
              </p>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                  <CircularProgress size={24} />
                </div>
              ) : diseaseOverlapData.length === 0 ? (
                <div style={S.noData}>No disease overlap data available</div>
              ) : (
                <>
                  <div style={S.barWrap}>
                    {diseaseOverlapData.map((d, i) => (
                      <HBar
                        key={i}
                        label={d.disease}
                        value={d.count}
                        total={matchedPatients}
                        pctVal={d.percentage}
                      />
                    ))}
                  </div>
                  {dashboardData.disease_overlap?.total > diseaseRowsPerPage && (
                    <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                      <CustomPagination
                        count={dashboardData.disease_overlap?.total || 0}
                        page={diseasePage}
                        rowsPerPage={diseaseRowsPerPage}
                        onPageChange={setDiseasePage}
                        onRowsPerPageChange={(val) => {
                          setDiseaseRowsPerPage(val);
                          setDiseasePage(1);
                        }}
                        hideRowsPerPage={true}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={S.card}>
              <p style={S.cardTitle}>
                Medication Overlap
                <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400, marginLeft: 8 }}>
                  among {matchedPatients} matched patients
                </span>
              </p>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                  <CircularProgress size={24} />
                </div>
              ) : medicationOverlapData.length === 0 ? (
                <div style={S.noData}>No medication overlap data available</div>
              ) : (
                <>
                  <div style={S.barWrap}>
                    {medicationOverlapData.map((d, i) => (
                      <HBar
                        key={i}
                        label={d.medication}
                        value={d.count}
                        total={matchedPatients}
                        pctVal={d.percentage}
                      />
                    ))}
                  </div>
                  {dashboardData.medication_overlap?.total > medicationRowsPerPage && (
                    <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                      <CustomPagination
                        count={dashboardData.medication_overlap?.total || 0}
                        page={medicationPage}
                        rowsPerPage={medicationRowsPerPage}
                        onPageChange={setMedicationPage}
                        onRowsPerPageChange={(val) => {
                          setMedicationRowsPerPage(val);
                          setMedicationPage(1);
                        }}
                        hideRowsPerPage={true}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Measurement Values Table */}
          {selMeasurements.length > 0 && (
            <div style={S.card}>
              <p style={S.cardTitle}>
                Measurement Values — matched patients
                <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400, marginLeft: 8 }}>
                  showing {measurementValuesData.length} of {dashboardData.measurement_values?.total || 0} records
                </span>
              </p>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                  <CircularProgress size={24} />
                </div>
              ) : measurementValuesData.length === 0 ? (
                <div style={S.noData}>No measurement data available</div>
              ) : (
                <>
                  <DataTable
                    cols={[
                      { key: "patient_ref", label: "Patient Ref", sortable: true },
                      { key: "age_group", label: "Age Group", sortable: true },
                      { key: "gender", label: "Gender", sortable: true },
                      ...selMeasurements.map(m => {
                        let label = m;
                        if (m === 'bp') label = 'Blood Pressure';
                        if (m === 'fasting_glucose') label = 'Fasting Glucose';
                        if (m === 'ppbgs') label = 'Postprandial Glucose';
                        if (m === 'weight') label = 'Weight';
                        if (m === 'temperature') label = 'Temperature';
                        return {
                          key: m === 'bp' ? 'blood_pressure' : 
                                m === 'fasting_glucose' ? 'blood_glucose' :
                                m === 'ppbgs' ? 'postprandial_glucose' : m,
                          label: label,
                          sortable: true,
                        };
                      }),
                    ]}
                    rows={measurementValuesData}
                    empty="No measurement data found"
                  />
                  {dashboardData.measurement_values?.total > measurementRowsPerPage && (
                    <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                      <CustomPagination
                        count={dashboardData.measurement_values?.total || 0}
                        page={measurementPage}
                        rowsPerPage={measurementRowsPerPage}
                        onPageChange={setMeasurementPage}
                        onRowsPerPageChange={(val) => {
                          setMeasurementRowsPerPage(val);
                          setMeasurementPage(1);
                        }}
                        hideRowsPerPage={true}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Records Section */}
          <div style={S.card}>
            <p style={S.cardTitle}>
              Records
              <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400, marginLeft: 8 }}>
                showing {recordsData.length} of {dashboardData.records?.total || 0} records
              </span>
            </p>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                <CircularProgress size={24} />
              </div>
            ) : recordsData.length === 0 ? (
              <div style={S.noData}>No records available</div>
            ) : (
              <>
                <DataTable
                  cols={[
                    { key: "patient_ref", label: "Patient Ref", sortable: true },
                    { key: "age_group", label: "Age Group", sortable: true },
                    { key: "gender", label: "Gender", sortable: true },
                    { key: "diseases", label: "Diseases", sortable: true },
                    { key: "medications", label: "Medications", sortable: true },
                  ]}
                  rows={recordsData}
                  empty="No records found"
                />
                {dashboardData.records?.total > recordsRowsPerPage && (
                  <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                    <CustomPagination
                      count={dashboardData.records?.total || 0}
                      page={recordsPage}
                      rowsPerPage={recordsRowsPerPage}
                      onPageChange={setRecordsPage}
                      onRowsPerPageChange={(val) => {
                        setRecordsRowsPerPage(val);
                        setRecordsPage(1);
                      }}
                      hideRowsPerPage={true}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const FIELD_DEFS = [
  { key: "ref", label: "Patient Ref" },
  { key: "ageGroup", label: "Age Group" },
  { key: "gender", label: "Gender" },
  { key: "conditions", label: "Diseases", isArr: true },
  { key: "meds", label: "Medications", isArr: true, teal: true },
  { key: "symptoms", label: "Reported Health", isArr: true },
];

function CustomizeTable({ diseases, medicines, symptoms = [], selectedDoctorIds = [] }) {
  const allDiseases = diseases?.length > 0 ? diseases.map(d => d.label) : [];
  const allMeds = medicines?.length > 0 ? medicines.map(m => m.label) : [];
  const allSymptoms = symptoms?.length > 0 ? symptoms.map(s => s.label) : [];

  const [selFields, setSelFields] = useState(["ref", "ageGroup", "gender", "conditions", "meds"]);
  const [filterDis, setFilterDis] = useState([]);
  const [filterMed, setFilterMed] = useState([]);
  const [filterSymptoms, setFilterSymptoms] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  const [singleOnly, setSingleOnly] = useState(false);
  const [combinedOnly, setCombinedOnly] = useState(false);
  const [includeExtra, setIncludeExtra] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState({
    total: 0,
    matched_patients: 0,
    page: 1,
    limit: 10,
    patients: [],
  });
  
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const toggleF = k => setSelFields(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  const toggleD = d => setFilterDis(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleM = m => setFilterMed(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  const toggleH = h => setFilterSymptoms(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);

  // Reset checkboxes when any filter selection changes
  useEffect(() => {
    setSingleOnly(false);
    setCombinedOnly(false);
    setIncludeExtra(false);
    setPage(1);
  }, [filterDis, filterMed, filterSymptoms]);

  const fetchData = async () => {
    setLoading(true);

    const payload = {
      doctor_ids: selectedDoctorIds || [],
      gender: gender !== "All" ? (gender === "Male" ? 1 : gender === "Female" ? 2 : 3) : "",
      age_group: ageGroup !== "All" ? ageGroup : "",
      disease: filterDis,
      medication: filterMed,
      symptoms: filterSymptoms,
      page,
      limit: rowsPerPage,
      singleOnly,
      combinedOnly,
      includeExtra,
    };

    console.log("🔵 CustomizeTable - Sending payload:", JSON.stringify(payload, null, 2));

    try {
      const res = await fetchAdminCustomTable(payload);
      console.log("🟢 CustomizeTable - Response:", res);
      if (res && res.success) {
        setTableData(res);
      } else {
        console.error("API returned error:", res);
        setTableData({
          total: 0,
          matched_patients: 0,
          page: 1,
          limit: 10,
          patients: [],
        });
      }
    } catch (error) {
      console.error("Error fetching custom table data:", error);
      setTableData({
        total: 0,
        matched_patients: 0,
        page: 1,
        limit: 10,
        patients: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterDis, filterMed, filterSymptoms, ageGroup, gender, singleOnly, combinedOnly, includeExtra, selectedDoctorIds, page, rowsPerPage]);

  const matchedPatients = tableData.matched_patients || 0;
  const totalPatients = tableData.total || 0;
  const patientData = tableData.patients || [];
  const activeFilters = filterDis.length + filterMed.length + filterSymptoms.length + (ageGroup !== "All" ? 1 : 0) + (gender !== "All" ? 1 : 0);

  // Prepare rows for DataTable
  const rows = patientData.map((p, i) => ({
    ref: `P-${String(i + 1).padStart(3, "0")}`,
    ageGroup: toAgeGroup(p.age),
    gender: p.gender,
    conditions: p.diseases || [],
    meds: (p.medications || []).map(m => m.name),
    symptoms: p.reported_symptoms || [],
  }));

  const cols = FIELD_DEFS.filter(f => selFields.includes(f.key)).map(f => ({
    key: f.key, label: f.label, sortable: true,
    render:
      f.key === "ref" ? r => <span style={S.refBadge}>{r.ref}</span>
        : f.key === "ageGroup" ? r => <span style={S.ageGroupBadge}>{r.ageGroup}</span>
          : f.key === "gender" ? r => <span style={S.badge(r.gender)}>{r.gender}</span>
            : f.isArr ? r => {
              const arr = r[f.key];
              if (!arr || arr.length === 0) return <span style={{ color: "#94a3b8" }}>—</span>;
              return f.teal ? <MChips arr={arr} /> : <DChips arr={arr} />;
            }
              : null
  }));

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Customize Table</h2>
        <p style={S.pageSub}>Build your own anonymous lookup — choose columns and stack filters to understand the data</p>
      </div>

      <div style={S.filterBar}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ ...S.filterLabel, display: "block", marginBottom: 8 }}>Columns to display</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {FIELD_DEFS.map(f => (
              <label key={f.key} style={S.checkLabel(selFields.includes(f.key))}>
                <input type="checkbox" checked={selFields.includes(f.key)} onChange={() => toggleF(f.key)} style={{ accentColor: ACCENT }} />
                {f.label}
              </label>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid #eaecf2", margin: "12px 0" }} />

        <div style={{ ...S.filterRow, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <TagSearch 
              label="Disease" 
              all={allDiseases} 
              selected={filterDis} 
              onToggle={toggleD} 
              searchPlaceholder="Filter by disease…" 
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <TagSearch 
              label="Medication" 
              all={allMeds} 
              selected={filterMed} 
              onToggle={toggleM} 
              searchPlaceholder="Filter by medication…" 
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <TagSearch 
              label="Reported Symptoms" 
              all={allSymptoms} 
              selected={filterSymptoms} 
              onToggle={toggleH} 
              searchPlaceholder="Filter by symptom…" 
            />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <GenderFilter value={gender} onChange={setGender} />
          </div>
        </div>

        {/* Disease Checkbox filters */}
        {filterDis.length >= 2 && (
          <div style={{ marginTop: 12, display: 'flex', gap: 20 }}>
            <label style={S.checkLabel(combinedOnly && filterDis.length >= 2)}>
              <input
                type="checkbox"
                checked={combinedOnly && filterDis.length >= 2}
                onChange={e => {
                  if (filterDis.length >= 2) {
                    setCombinedOnly(e.target.checked);
                    if (e.target.checked) setIncludeExtra(false);
                    setPage(1);
                  }
                }}
                style={{ accentColor: ACCENT }}
              />
              Combined Diseases — patients must have ALL selected diseases
            </label>
            <label style={S.checkLabel(includeExtra && filterDis.length >= 2)}>
              <input
                type="checkbox"
                checked={includeExtra && filterDis.length >= 2}
                onChange={e => {
                  if (filterDis.length >= 2) {
                    setIncludeExtra(e.target.checked);
                    if (e.target.checked) setCombinedOnly(false);
                    setPage(1);
                  }
                }}
                style={{ accentColor: ACCENT }}
              />
              Include extra diseases
            </label>
          </div>
        )}

        {filterDis.length === 1 && (
          <div style={{ marginTop: 12 }}>
            <label style={S.checkLabel(singleOnly && filterDis.length === 1)}>
              <input
                type="checkbox"
                checked={singleOnly && filterDis.length === 1}
                onChange={e => {
                  setSingleOnly(e.target.checked);
                  setPage(1);
                }}
                style={{ accentColor: ACCENT }}
              />
              Only patients with exactly this disease
            </label>
          </div>
        )}

        {/* Medication Checkbox filters */}
        {filterMed.length >= 2 && (
          <div style={{ marginTop: 12, display: 'flex', gap: 20 }}>
            <label style={S.checkLabel(combinedOnly && filterMed.length >= 2)}>
              <input
                type="checkbox"
                checked={combinedOnly && filterMed.length >= 2}
                onChange={e => {
                  if (filterMed.length >= 2) {
                    setCombinedOnly(e.target.checked);
                    if (e.target.checked) setIncludeExtra(false);
                    setPage(1);
                  }
                }}
                style={{ accentColor: ACCENT }}
              />
              Combined Medications — patients must have ALL selected medications
            </label>
            <label style={S.checkLabel(includeExtra && filterMed.length >= 2)}>
              <input
                type="checkbox"
                checked={includeExtra && filterMed.length >= 2}
                onChange={e => {
                  if (filterMed.length >= 2) {
                    setIncludeExtra(e.target.checked);
                    if (e.target.checked) setCombinedOnly(false);
                    setPage(1);
                  }
                }}
                style={{ accentColor: ACCENT }}
              />
              Include extra medications
            </label>
          </div>
        )}

        {filterMed.length === 1 && (
          <div style={{ marginTop: 12 }}>
            <label style={S.checkLabel(singleOnly && filterMed.length === 1)}>
              <input
                type="checkbox"
                checked={singleOnly && filterMed.length === 1}
                onChange={e => {
                  setSingleOnly(e.target.checked);
                  setPage(1);
                }}
                style={{ accentColor: ACCENT }}
              />
              Only patients with exactly this medication
            </label>
          </div>
        )}

        {/* Symptoms Checkbox filters */}
        {filterSymptoms.length >= 2 && (
          <div style={{ marginTop: 12, display: 'flex', gap: 20 }}>
            <label style={S.checkLabel(combinedOnly && filterSymptoms.length >= 2)}>
              <input
                type="checkbox"
                checked={combinedOnly && filterSymptoms.length >= 2}
                onChange={e => {
                  if (filterSymptoms.length >= 2) {
                    setCombinedOnly(e.target.checked);
                    if (e.target.checked) setIncludeExtra(false);
                    setPage(1);
                  }
                }}
                style={{ accentColor: ACCENT }}
              />
              Combined Symptoms — patients must have ALL selected symptoms
            </label>
            <label style={S.checkLabel(includeExtra && filterSymptoms.length >= 2)}>
              <input
                type="checkbox"
                checked={includeExtra && filterSymptoms.length >= 2}
                onChange={e => {
                  if (filterSymptoms.length >= 2) {
                    setIncludeExtra(e.target.checked);
                    if (e.target.checked) setCombinedOnly(false);
                    setPage(1);
                  }
                }}
                style={{ accentColor: ACCENT }}
              />
              Include extra symptoms
            </label>
          </div>
        )}

        {filterSymptoms.length === 1 && (
          <div style={{ marginTop: 12 }}>
            <label style={S.checkLabel(singleOnly && filterSymptoms.length === 1)}>
              <input
                type="checkbox"
                checked={singleOnly && filterSymptoms.length === 1}
                onChange={e => {
                  setSingleOnly(e.target.checked);
                  setPage(1);
                }}
                style={{ accentColor: ACCENT }}
              />
              Only patients with exactly this symptom
            </label>
          </div>
        )}
      </div>

      <div style={S.statRow}>
        <StatCard 
          label="Matching Records" 
          value={matchedPatients} 
          sub={`${totalPatients > 0 ? ((matchedPatients / totalPatients) * 100).toFixed(1) : "0.0"}% of total patients`} 
        />
        <StatCard label="Total Patients" value={totalPatients} />
        <StatCard label="Active Filters" value={activeFilters} />
      </div>

      <div style={S.card}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <CircularProgress size={32} />
          </div>
        ) : cols.length === 0 ? (
          <div style={S.noData}>Select at least one column to display</div>
        ) : rows.length === 0 ? (
          <div style={S.noData}>No records match the selected filters</div>
        ) : (
          <>
            <DataTable cols={cols} rows={rows} empty="No records match the selected filters" />
            
            {/* Pagination */}
            {matchedPatients > rowsPerPage && (
              <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                <CustomPagination
                  count={matchedPatients}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={setPage}
                  onRowsPerPageChange={(val) => {
                    setRowsPerPage(val);
                    setPage(1);
                  }}
                  hideRowsPerPage={true}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const NAV = [
  { section: "Doctor" },
  { key: "doctorana", label: "Doctor Analytics", icon: <BsPeopleFill /> },
  { section: "Patient Info" },
  { key: "demographics", label: "Demographics", icon: <BsPeopleFill /> },
  { section: "Disease" },
  { key: "diseasedemo", label: "Disease / Demographics", icon: <PiHospitalFill /> },
  { key: "diseasemed", label: "Disease / Medication", icon: <GiMedicines /> },
  { section: "Drug Info" },
  { key: "meddemo", label: "Medication / Demographics", icon: <BsFillFileBarGraphFill /> },
  { key: "meddisease", label: "Medication / Disease", icon: <GiPillDrop /> },
  { key: "medhealth", label: "Medication / Reported Health", icon: <FaStethoscope /> },
  { section: "Cross Analysis" },
  { key: "crossana", label: "Cross-Analysis", icon: <FaStethoscope /> },
  { section: "Custom" },
  { key: "customize", label: "Customize Table", icon: <BiSolidCustomize /> },
];

export default function AdminAnalytics() {
  const [active, setActive] = useState("doctorana");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [selectedDoctorValues, setSelectedDoctorValues] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [symptoms, setSymptoms] = useState([]);

  // const sharedProps = { diseases: MOCK_DISEASES, medicines: MOCK_MEDICINES, symptoms: MOCK_SYMPTOMS };

  useEffect(() => {
    const loadDoctors = async () => {
      const data = await fetchDoctors();
      setDoctors(data);
      setSelectedDoctors(data.map(d => d.label));
      setSelectedDoctorValues(data.map(d => d.value));
    };
    loadDoctors();
  }, []);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [diseaseRes, medicineRes, symptomsRes] = await Promise.all([
          fetchDiseases(),
          fetchMedicines(),
          fetchSymptoms(),
        ]);

        setDiseases(diseaseRes || []);
        setMedicines(medicineRes || []);
        setSymptoms(symptomsRes || []); 
        console.log("Loaded symptoms:", symptomsRes);
      } catch (err) {
        console.error("Error loading disease/medicine/symptoms:", err);
      }
    };

    loadMeta();
  }, []);

  const VIEWS = {
    doctorana: <DoctorAnalytics selectedDoctorIds={selectedDoctorValues} />,
    demographics: <Demographics selectedDoctorIds={selectedDoctorValues} />,
    diseasedemo: <DiseaseDemo diseases={diseases} selectedDoctorIds={selectedDoctorValues} />,
    diseasemed: <DiseaseMedication diseases={diseases} symptoms={MOCK_SYMPTOMS} selectedDoctorIds={selectedDoctorValues} />,
    meddemo: <MedicationDemo medicines={medicines} selectedDoctorIds={selectedDoctorValues} />,
    meddisease: <MedicationDisease medicines={medicines} selectedDoctorIds={selectedDoctorValues} />,
    medhealth: <MedicationHealth medicines={medicines} selectedDoctorIds={selectedDoctorValues} />,
    crossana: <CrossAnalysis diseases={diseases} medicines={medicines} selectedDoctorIds={selectedDoctorValues} />,
    customize: <CustomizeTable diseases={diseases} medicines={medicines} symptoms={symptoms} selectedDoctorIds={selectedDoctorValues} />,
  };

  const toggleDoctor = (doctorName, doctorValue) => {
    setSelectedDoctors(prev =>
      prev.includes(doctorName)
        ? prev.filter(d => d !== doctorName)
        : [...prev, doctorName]
    );
    setSelectedDoctorValues(prev =>
      prev.includes(doctorValue)
        ? prev.filter(v => v !== doctorValue)
        : [...prev, doctorValue]
    );
  };

  return (
    <div style={S.wrap}>
      <nav style={S.nav}>
        <div style={S.navHead}>
          <div style={S.navTitle}>Analytics</div>
          <div style={S.navSub}>Admin · All Doctors</div>
        </div>
        {NAV.map((item, i) => {
          if (item.section) return <div key={i} style={S.navGroup}>{item.section}</div>;
          const isActive = active === item.key;
          return (
            <div key={item.key} role="button" tabIndex={0} style={S.navItem(isActive)}
              onClick={() => setActive(item.key)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setActive(item.key); }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>
      <main style={S.main}>
        <AdminDoctorBanner
          selectedDoctors={selectedDoctors}
          doctors={doctors}
          onToggle={toggleDoctor}
        />
        {VIEWS[active]}
      </main>
    </div>
  );
}