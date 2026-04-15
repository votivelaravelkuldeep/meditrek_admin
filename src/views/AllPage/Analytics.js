import { useState, useMemo, useEffect } from "react";
import TagSearch from "./Analytics/TagSearch";
import AgeRangeFilter from "./Analytics/AgeRangeFilter";
import GenderFilter from "./Analytics/GenderFilter";
import { BsFillFileBarGraphFill, BsPeopleFill } from "react-icons/bs";
import { PiHospitalFill } from "react-icons/pi";
import { GiMedicines, GiPillDrop } from "react-icons/gi";
import { FaStethoscope } from "react-icons/fa";
import { BiSolidCustomize } from "react-icons/bi";
import { fetchAdminDiseaseDashboard, fetchAdminPatientDemographics, fetchAdminPatientDemographicsDetails, fetchDiseases, fetchDoctorAnalytics, fetchDoctors, fetchMedicines } from "services/analyticsAPI";
import CustomPagination from "component/common/Pagination";
import { CircularProgress } from "@mui/material";

const MOCK_PATIENTS = [
  { id: 1, age: 45, gender: "Male", diseases: [{ name: "Hypertension" }, { name: "Type 2 Diabetes" }], medications: [{ name: "Lisinopril" }, { name: "Metformin" }], symptoms: "headache, fatigue" },
  { id: 2, age: 32, gender: "Female", diseases: [{ name: "Migraine" }], medications: [{ name: "Sumatriptan" }], symptoms: "severe headache, nausea" },
  { id: 3, age: 58, gender: "Male", diseases: [{ name: "COPD" }, { name: "Hypertension" }], medications: [{ name: "Albuterol" }, { name: "Lisinopril" }], symptoms: "shortness of breath, wheezing" },
  { id: 4, age: 27, gender: "Female", diseases: [{ name: "Anxiety" }], medications: [{ name: "Sertraline" }], symptoms: "nervousness, insomnia" },
  { id: 5, age: 62, gender: "Male", diseases: [{ name: "Osteoarthritis" }, { name: "Hypertension" }], medications: [{ name: "Ibuprofen" }, { name: "Amlodipine" }], symptoms: "joint pain, stiffness" },
  { id: 6, age: 41, gender: "Female", diseases: [{ name: "Asthma" }], medications: [{ name: "Fluticasone" }], symptoms: "coughing, chest tightness" },
  { id: 7, age: 73, gender: "Male", diseases: [{ name: "Heart Failure" }, { name: "COPD" }], medications: [{ name: "Furosemide" }, { name: "Spiriva" }], symptoms: "fatigue, edema, shortness of breath" },
  { id: 8, age: 35, gender: "Female", diseases: [{ name: "Depression" }], medications: [{ name: "Escitalopram" }], symptoms: "low mood, loss of interest" },
  { id: 9, age: 51, gender: "Male", diseases: [{ name: "Type 2 Diabetes" }, { name: "Hyperlipidemia" }], medications: [{ name: "Metformin" }, { name: "Atorvastatin" }], symptoms: "frequent urination, thirst" },
  { id: 10, age: 29, gender: "Female", diseases: [{ name: "Migraine" }], medications: [{ name: "Rizatriptan" }], symptoms: "aura, throbbing headache" },
];

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
const MOCK_DISEASES = ["Hypertension", "Type 2 Diabetes", "Migraine", "COPD", "Anxiety", "Depression", "Asthma", "Osteoarthritis", "Heart Failure", "Hyperlipidemia"].map(l => ({ label: l }));
const MOCK_MEDICINES = ["Lisinopril", "Metformin", "Sumatriptan", "Albuterol", "Sertraline", "Ibuprofen", "Amlodipine", "Fluticasone", "Furosemide", "Spiriva", "Escitalopram", "Atorvastatin", "Rizatriptan"].map(l => ({ label: l }));
const MOCK_SYMPTOMS = ["headache", "fatigue", "nausea", "shortness of breath", "wheezing", "joint pain", "coughing", "edema", "insomnia"].map(l => ({ label: l }));

const MOCK_MEASUREMENTS = ["Blood Pressure", "Blood Glucose", "BMI", "Cholesterol", "Oxygen Saturation", "Heart Rate"];
const MOCK_PATIENT_MEASUREMENTS = {
  1: { "Blood Pressure": "142/90", "Blood Glucose": "7.8 mmol/L", "BMI": "28.1", "Cholesterol": "210 mg/dL" },
  2: { "Blood Pressure": "118/76", "Blood Glucose": "5.1 mmol/L", "BMI": "22.4" },
  3: { "Blood Pressure": "148/92", "Blood Glucose": "5.9 mmol/L", "BMI": "26.7", "Cholesterol": "220 mg/dL", "Oxygen Saturation": "94%" },
  4: { "Blood Pressure": "115/72", "Blood Glucose": "4.9 mmol/L", "BMI": "21.0" },
  5: { "Blood Pressure": "155/98", "Blood Glucose": "6.1 mmol/L", "BMI": "30.2", "Cholesterol": "245 mg/dL" },
  6: { "Blood Pressure": "120/78", "Blood Glucose": "5.0 mmol/L", "BMI": "23.5", "Oxygen Saturation": "97%" },
  7: { "Blood Pressure": "135/85", "Blood Glucose": "6.8 mmol/L", "BMI": "27.0", "Oxygen Saturation": "92%", "Heart Rate": "88 bpm" },
  8: { "Blood Pressure": "112/70", "Blood Glucose": "4.7 mmol/L", "BMI": "20.8" },
  9: { "Blood Pressure": "138/86", "Blood Glucose": "8.9 mmol/L", "BMI": "31.5", "Cholesterol": "260 mg/dL" },
  10: { "Blood Pressure": "116/74", "Blood Glucose": "4.8 mmol/L", "BMI": "22.1" },
};

const AGE_GROUPS = {
  "0-18": a => a >= 0 && a <= 18,
  "19-30": a => a >= 19 && a <= 30,
  "31-44": a => a >= 31 && a <= 44,
  "45-64": a => a >= 45 && a <= 64,
  "65-74": a => a >= 65 && a <= 74,
  "75-84": a => a >= 75 && a <= 84,
  "85+": a => a >= 85,
};

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

const anonymise = (patients) =>
  patients.map((p, i) => ({
    ref: `P-${String(i + 1).padStart(3, "0")}`,   // P-001, P-002 …
    ageGroup: toAgeGroup(p.age),
    gender: p.gender,
    conditions: p.diseases.map(d => d.name),
    meds: p.medications.map(m => m.name),
    symptoms: p.symptoms ? p.symptoms.split(", ") : [],
  }));

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

function pct(n, d) { return d === 0 ? "0.0" : ((n / d) * 100).toFixed(1); }
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

function AnonExpandPanel({ patients, showSymptoms = false }) {
  const [open, setOpen] = useState(false);

  /* Anonymise on expand — must be called before any early return */
  const rows = useMemo(() => anonymise(patients || []), [patients]);

  if (!patients || patients.length === 0) return null;

  const cols = [
    {
      key: "ref", label: "Patient Ref",
      render: r => <span style={S.refBadge}>{r.ref}</span>
    },
    {
      key: "ageGroup", label: "Age Group",
      sortable: true,
      render: r => <span style={S.ageGroupBadge}>{r.ageGroup}</span>
    },
    {
      key: "gender", label: "Gender",
      sortable: true,
      render: r => <span style={S.badge(r.gender)}>{r.gender}</span>
    },
    {
      key: "conditions", label: "Diseases",
      render: r => <DChips arr={r.conditions} />
    },
    {
      key: "meds", label: "Medications",
      render: r => <MChips arr={r.meds} />
    },
    ...(showSymptoms ? [{
      key: "symptoms", label: "Reported Symptoms",
      render: r => <DChips arr={r.symptoms} />
    }] : []),
  ];

  return (
    <div>
      <button style={S.expandBtn} onClick={() => setOpen(v => !v)}>
        {open ? "▲ Collapse records" : `▼ Expand — view ${patients.length} record${patients.length !== 1 ? "s" : ""}`}
      </button>

      {open && (
        <div style={S.expandPanel}>
          {/* Anonymisation notice */}
          {/* <div style={S.anonBanner}>
            <span style={{fontSize:15}}>🔒</span>
            <span>
              <strong>Anonymous view.</strong> Patient identifiers (name, exact age) are hidden in compliance with data privacy requirements.
              Each row shows an auto-generated reference number, age group, and clinical data only.
              This view is provided so you can verify the accuracy of the analytics above.
            </span>
          </div> */}
          <DataTable cols={cols} rows={rows} empty="No records available" />
        </div>
      )}
    </div>
  );
}

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
                { key: "name", label: "Patient Name", sortable: true },
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
  }, [selDiseases, ageGroup, gender, selectedDoctorIds]);

  // Patient pagination
  useEffect(() => {
    fetchData();
  }, [patientPage, rowsPerPage]);

  // Disease pagination 👇 NEW
  useEffect(() => {
    fetchData();
  }, [diseasePage, diseaseRowsPerPage]);

  useEffect(() => {
    setPatientPage(1);
    setDiseasePage(1); // 👈 ADD THIS
  }, [selDiseases, ageGroup, gender, selectedDoctorIds]);

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
      </div>

      {/* STATS - Total values, no pagination */}
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
                { key: "name", label: "Patient Name", sortable: true },
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

/* ============================================================
   3. DISEASE / MEDICATION
   ============================================================ */
function DiseaseMedication({ diseases }) {
  const allDiseases = diseases?.length > 0 ? diseases.map(d => d.label) : [];
  const [selDiseases, setSelDiseases] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");

  const toggleD = d => setSelDiseases(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const filteredPatients = useMemo(() => {
    let p = [...MOCK_PATIENTS];
    if (selDiseases.length > 0) p = p.filter(pt => pt.diseases.some(d => selDiseases.includes(d.name)));
    if (ageGroup !== "All") p = p.filter(pt => AGE_GROUPS[ageGroup]?.(pt.age));
    if (gender !== "All") p = p.filter(pt => pt.gender === gender);
    return p;
  }, [selDiseases, ageGroup, gender]);

  const medicationStats = useMemo(() => {
    const map = {};
    filteredPatients.forEach(p => p.medications.forEach(m => { map[m.name] = (map[m.name] || 0) + 1; }));
    return Object.entries(map).map(([name, count]) => ({
      medicine_name: name,
      patient_count: count,
      percent_matched: pct(count, filteredPatients.length),
      percent_total: pct(count, MOCK_PATIENTS.length),
    })).sort((a, b) => b.patient_count - a.patient_count);
  }, [filteredPatients]);

  const topDrug = medicationStats[0]?.medicine_name || "—";

  return (
    <div>
      <div style={S.pageHead}><h2 style={S.pageTitle}>Disease / Medication</h2><p style={S.pageSub}>Select diseases → see which drugs are prescribed</p></div>
      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 2, minWidth: 200 }}><TagSearch label="Disease(s)" all={allDiseases} selected={selDiseases} onToggle={toggleD} searchPlaceholder="Add diseases…" /></div>
          <div style={{ flex: 1, minWidth: 160 }}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup} /></div>
          <div style={{ flex: 1, minWidth: 160 }}><GenderFilter value={gender} onChange={setGender} /></div>
        </div>
      </div>
      <div style={S.statRow}>
        <StatCard label="Matched Patients" value={filteredPatients.length} sub={`${pct(filteredPatients.length, MOCK_PATIENTS.length)}% of all patients`} />
        <StatCard label="Total Patients" value={MOCK_PATIENTS.length} />
        <StatCard label="Top Drug" value={topDrug} />
      </div>
      <div style={S.card}>
        <p style={S.cardTitle}>Drug Distribution</p>
        {medicationStats.length === 0 ? <div style={S.noData}>No data found</div> : (
          <DataTable cols={[
            { key: "medicine_name", label: "Medication", sortable: true, render: r => <Chip label={r.medicine_name} teal={true} /> },
            { key: "patient_count", label: "Patients", sortable: true, render: r => <span style={{ fontWeight: 700, color: ACCENT }}>{r.patient_count}</span> },
            { key: "percent_matched", label: "% of Matched", sortable: true, render: r => <span>{r.percent_matched}%</span> },
            { key: "percent_total", label: "% of All Patients", sortable: true, render: r => <span style={{ color: "#94a3b8" }}>{r.percent_total}%</span> },
          ]} rows={medicationStats} />
        )}
        <div style={{ marginTop: 14 }}>
          <AnonExpandPanel patients={filteredPatients} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   4. MEDICATION / DEMOGRAPHICS
   ============================================================ */
function MedicationDemo({ medicines }) {
  const allMeds = medicines?.length > 0 ? medicines.map(m => m.label) : [];
  const [selMeds, setSelMeds] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");

  const toggleM = m => setSelMeds(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const filteredPatients = useMemo(() => {
    let p = [...MOCK_PATIENTS];
    if (selMeds.length > 0) p = p.filter(pt => pt.medications.some(m => selMeds.includes(m.name)));
    if (ageGroup !== "All") p = p.filter(pt => AGE_GROUPS[ageGroup]?.(pt.age));
    if (gender !== "All") p = p.filter(pt => pt.gender === gender);
    return p;
  }, [selMeds, ageGroup, gender]);

  const medicationDist = useMemo(() => {
    const map = {};
    filteredPatients.forEach(p => p.medications.forEach(m => {
      if (selMeds.length === 0 || selMeds.includes(m.name)) map[m.name] = (map[m.name] || 0) + 1;
    }));
    return Object.entries(map).map(([label, value]) => ({ label, value, pct: pct(value, filteredPatients.length) }));
  }, [filteredPatients, selMeds]);

  const ageDist = useMemo(() => {
    const map = { "0-18": 0, "19-30": 0, "31-45": 0, "46+": 0 };
    filteredPatients.forEach(p => { const g = Object.keys(AGE_GROUPS).find(k => AGE_GROUPS[k](p.age)); if (g) map[g]++; });
    return Object.entries(map).map(([age_group, count]) => ({ age_group, count, percentage: pct(count, filteredPatients.length) }));
  }, [filteredPatients]);

  const genderDist = useMemo(() => {
    const base = { Male: 0, Female: 0, Other: 0, "Not Specified": 0 };
    filteredPatients.forEach(p => { if (base[p.gender] !== undefined) base[p.gender]++; else base["Not Specified"]++; });
    return Object.entries(base).map(([gender, count]) => ({ gender, count, percentage: pct(count, filteredPatients.length) }));
  }, [filteredPatients]);

  return (
    <div>
      <div style={S.pageHead}><h2 style={S.pageTitle}>Medication / Demographics</h2><p style={S.pageSub}>Medication usage breakdown by age and sex</p></div>
      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 2, minWidth: 200 }}><TagSearch label="Medication" all={allMeds} selected={selMeds} onToggle={toggleM} searchPlaceholder="Search medications…" /></div>
          <div style={{ flex: 1, minWidth: 160 }}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup} /></div>
          <div style={{ flex: 1, minWidth: 160 }}><GenderFilter value={gender} onChange={setGender} /></div>
        </div>
      </div>
      <div style={S.statRow}>
        <StatCard label="Matched Patients" value={filteredPatients.length} sub={`${pct(filteredPatients.length, MOCK_PATIENTS.length)}% of all patients`} />
        <StatCard label="Total Patients" value={MOCK_PATIENTS.length} />
        <StatCard label="Selected Medications" value={selMeds.length || "All"} />
      </div>
      <div style={S.grid2}>
        <div style={S.card}>
          <p style={S.cardTitle}>Medication Distribution</p>
          <div style={S.barWrap}>{medicationDist.map((d, i) => <HBar key={i} label={d.label} value={d.value} total={filteredPatients.length} pctVal={d.pct} />)}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={S.card}>
            <p style={S.cardTitle}>Age Breakdown</p>
            <div style={S.barWrap}>{ageDist.map((d, i) => <HBar key={i} label={d.age_group} value={d.count} total={filteredPatients.length} pctVal={d.percentage} />)}</div>
          </div>
          <div style={S.card}>
            <p style={S.cardTitle}>Sex Breakdown</p>
            <div style={S.barWrap}>{genderDist.map((d, i) => <HBar key={i} label={d.gender} value={d.count} total={filteredPatients.length} pctVal={d.percentage} color={GCOLORS[d.gender]} />)}</div>
          </div>
        </div>
      </div>
      <div style={S.card}>
        <p style={S.cardTitle}>Records
          {/* <span style={{fontSize:11,color:"#94a3b8",fontWeight:400}}>Expand to verify analytics data</span> */}
        </p>
        <AnonExpandPanel patients={filteredPatients} />
      </div>
    </div>
  );
}

/* ============================================================
   5. MEDICATION / DISEASE
   ============================================================ */
function MedicationDisease({ medicines }) {
  const allMeds = medicines?.length > 0 ? medicines.map(m => m.label) : [];
  const [selMeds, setSelMeds] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");

  const toggleM = m => setSelMeds(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const filteredPatients = useMemo(() => {
    let p = [...MOCK_PATIENTS];
    if (selMeds.length > 0) p = p.filter(pt => pt.medications.some(m => selMeds.includes(m.name)));
    if (ageGroup !== "All") p = p.filter(pt => AGE_GROUPS[ageGroup]?.(pt.age));
    if (gender !== "All") p = p.filter(pt => pt.gender === gender);
    return p;
  }, [selMeds, ageGroup, gender]);

  const diseaseDist = useMemo(() => {
    const map = {};
    filteredPatients.forEach(p => p.diseases.forEach(d => { map[d.name] = (map[d.name] || 0) + 1; }));
    return Object.entries(map).map(([disease, count]) => ({
      disease, patient_count: count,
      percent_matched: pct(count, filteredPatients.length),
      percent_total: pct(count, MOCK_PATIENTS.length),
    })).sort((a, b) => b.patient_count - a.patient_count);
  }, [filteredPatients]);

  const topDisease = diseaseDist[0]?.disease || "—";

  return (
    <div>
      <div style={S.pageHead}><h2 style={S.pageTitle}>Medication / Disease</h2><p style={S.pageSub}>Select medications → see which diseases are associated</p></div>
      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 2, minWidth: 200 }}><TagSearch label="Medication(s)" all={allMeds} selected={selMeds} onToggle={toggleM} searchPlaceholder="Add medications…" /></div>
          <div style={{ flex: 1, minWidth: 160 }}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup} /></div>
          <div style={{ flex: 1, minWidth: 160 }}><GenderFilter value={gender} onChange={setGender} /></div>
        </div>
      </div>
      <div style={S.statRow}>
        <StatCard label="Matched Patients" value={filteredPatients.length} sub={`${pct(filteredPatients.length, MOCK_PATIENTS.length)}% of all patients`} />
        <StatCard label="Unique Diseases" value={diseaseDist.length} />
        <StatCard label="Top Disease" value={topDisease} />
      </div>
      <div style={S.card}>
        <p style={S.cardTitle}>Disease Distribution</p>
        {diseaseDist.length === 0 ? <div style={S.noData}>Select a medication to see disease data</div> : (
          <DataTable cols={[
            { key: "disease", label: "Disease", sortable: true, render: r => <Chip label={r.disease} teal={false} /> },
            { key: "patient_count", label: "Patients", sortable: true, render: r => <span style={{ fontWeight: 700, color: ACCENT }}>{r.patient_count}</span> },
            { key: "percent_matched", label: "% of Matched", sortable: true, render: r => <span style={{ fontWeight: 600 }}>{r.percent_matched}%</span> },
            { key: "percent_total", label: "% of All Patients", sortable: true, render: r => <span style={{ color: "#94a3b8" }}>{r.percent_total}%</span> },
          ]} rows={diseaseDist} />
        )}
        <div style={{ marginTop: 14 }}>
          <AnonExpandPanel patients={filteredPatients} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   6. MEDICATION / REPORTED HEALTH
   ============================================================ */
function MedicationHealth({ medicines }) {
  const allMeds = medicines?.length > 0 ? medicines.map(m => m.label) : [];
  const [selMeds, setSelMeds] = useState([]);
  const toggleM = m => setSelMeds(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const medHealthData = useMemo(() => {
    let patients = [...MOCK_PATIENTS];
    if (selMeds.length > 0) patients = patients.filter(p => p.medications.some(m => selMeds.includes(m.name)));
    const medMap = new Map();
    patients.forEach(p => {
      p.medications.forEach(med => {
        if (!medMap.has(med.name)) medMap.set(med.name, { pts: [], symptomMap: new Map() });
        const entry = medMap.get(med.name);
        entry.pts.push(p);
        const syms = p.symptoms ? p.symptoms.split(", ") : [];
        syms.forEach(s => entry.symptomMap.set(s, (entry.symptomMap.get(s) || 0) + 1));
      });
    });
    const result = [];
    for (const [medName, data] of medMap) {
      const symptoms = [];
      for (const [symptom, count] of data.symptomMap)
        symptoms.push({ symptom, count, percentage: ((count / data.pts.length) * 100).toFixed(1) });
      symptoms.sort((a, b) => b.count - a.count);
      result.push({ medication: { name: medName }, pts: data.pts, total_patients: data.pts.length, symptoms, percentage: ((data.pts.length / MOCK_PATIENTS.length) * 100).toFixed(1) });
    }
    return result;
  }, [selMeds]);

  return (
    <div>
      <div style={S.pageHead}><h2 style={S.pageTitle}>Medication / Reported Health</h2><p style={S.pageSub}>For each medication, see the reported health outcomes and their frequency</p></div>
      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 1, minWidth: 240 }}><TagSearch label="Drug name(s)" all={allMeds} selected={selMeds} onToggle={toggleM} searchPlaceholder="Filter by drug name…" /></div>
        </div>
      </div>
      {medHealthData.length === 0 ? <div style={S.card}><div style={S.noData}>No data found</div></div> : (
        medHealthData.map((item, idx) => (
          <div key={idx} style={S.card}>
            <p style={S.cardTitle}>
              <span><Chip label={item.medication.name} teal={true} /> <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400, marginLeft: 6 }}>{item.total_patients} patients ({item.percentage}% of total)</span></span>
            </p>
            <div style={S.barWrap}>
              {item.symptoms.map((o, i) => <HBar key={i} label={o.symptom} value={o.count} total={item.total_patients} pctVal={o.percentage} color="#f59e0b" />)}
              {item.symptoms.length === 0 && <div style={S.noData}>No reported symptoms for this medication</div>}
            </div>
            <div style={{ marginTop: 14 }}>
              <AnonExpandPanel patients={item.pts} showSymptoms={true} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}


/* ============================================================
   CROSS-ANALYSIS  (with TagSearch dropdowns)
   ============================================================ */
function CrossAnalysis({ diseases, medicines }) {
  const allDiseases = diseases?.length > 0 ? diseases.map(d => d.label) : [];
  const allMeds = medicines?.length > 0 ? medicines.map(m => m.label) : [];

  const [selDiseases, setSelDiseases] = useState([]);
  const [selMeasurements, setSelMeasurements] = useState([]);
  const [selMeds, setSelMeds] = useState([]);

  const toggleD = d => setSelDiseases(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleM = m => setSelMeasurements(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  const toggleMed = m => setSelMeds(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const filteredPatients = useMemo(() => {
    let p = [...MOCK_PATIENTS];
    if (selDiseases.length > 0) p = p.filter(pt => pt.diseases.some(d => selDiseases.includes(d.name)));
    if (selMeds.length > 0) p = p.filter(pt => pt.medications.some(m => selMeds.includes(m.name)));
    return p;
  }, [selDiseases, selMeds]);

  /* disease overlap within matched cohort */
  const diseaseDist = useMemo(() => {
    const map = {};
    filteredPatients.forEach(p => p.diseases.forEach(d => { map[d.name] = (map[d.name] || 0) + 1; }));
    return Object.entries(map).map(([label, value]) => ({ label, value, pct: pct(value, filteredPatients.length) }))
      .sort((a, b) => b.value - a.value);
  }, [filteredPatients]);

  /* med overlap within matched cohort */
  const medDist = useMemo(() => {
    const map = {};
    filteredPatients.forEach(p => p.medications.forEach(m => { map[m.name] = (map[m.name] || 0) + 1; }));
    return Object.entries(map).map(([label, value]) => ({ label, value, pct: pct(value, filteredPatients.length) }))
      .sort((a, b) => b.value - a.value);
  }, [filteredPatients]);

  /* measurement rows for selected measurements */
  const measurementRows = useMemo(() => {
    if (selMeasurements.length === 0) return [];
    return filteredPatients.map((p, i) => {
      const meas = MOCK_PATIENT_MEASUREMENTS[p.id] || {};
      const row = { ref: `P-${String(i + 1).padStart(3, "0")}`, ageGroup: toAgeGroup(p.age), gender: p.gender };
      selMeasurements.forEach(m => { row[m] = meas[m] || "—"; });
      return row;
    });
  }, [filteredPatients, selMeasurements]);

  const anyFilter = selDiseases.length > 0 || selMeds.length > 0 || selMeasurements.length > 0;

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Cross-Analysis</h2>
        <p style={S.pageSub}>Explore relationships across diseases, measurements, and medications</p>
      </div>

      <div style={S.filterBar} className="d-flex w-100 gap-3">
        <div className="w-100">
          <TagSearch
            label="Disease"
            all={allDiseases}
            selected={selDiseases}
            onToggle={toggleD}
            searchPlaceholder="Search diseases..."
          />
        </div>

        <div className="w-100">
          <TagSearch
            label="Measurement"
            all={MOCK_MEASUREMENTS}
            selected={selMeasurements}
            onToggle={toggleM}
            searchPlaceholder="Search measurements..."
          />
        </div>

        <div className="w-100">
          <TagSearch
            label="Medication"
            all={allMeds}
            selected={selMeds}
            onToggle={toggleMed}
            searchPlaceholder="Search medications..."
          />
        </div>
      </div>

      <div style={S.statRow}>
        <StatCard label="Matched Patients" value={filteredPatients.length} sub={`${pct(filteredPatients.length, MOCK_PATIENTS.length)}% of all patients`} />
        <StatCard label="Diseases Selected" value={selDiseases.length || "All"} />
        <StatCard label="Measurements" value={selMeasurements.length || "None"} />
        <StatCard label="Medications Selected" value={selMeds.length || "All"} />
      </div>

      {!anyFilter && (
        <div style={S.card}><div style={S.noData}>Select at least one disease, measurement, or medication to explore correlations</div></div>
      )}

      {anyFilter && (
        <>
          {/* Overlap charts */}
          <div style={S.grid2}>
            <div style={S.card}>
              <p style={S.cardTitle}>Disease overlap in matched cohort</p>
              {diseaseDist.length === 0
                ? <div style={S.noData}>No data</div>
                : <div style={S.barWrap}>{diseaseDist.map((d, i) => <HBar key={i} label={d.label} value={d.value} total={filteredPatients.length} pctVal={d.pct} />)}</div>
              }
            </div>
            <div style={S.card}>
              <p style={S.cardTitle}>Medication overlap in matched cohort</p>
              {medDist.length === 0
                ? <div style={S.noData}>No data</div>
                : <div style={S.barWrap}>{medDist.map((d, i) => <HBar key={i} label={d.label} value={d.value} total={filteredPatients.length} pctVal={d.pct} />)}</div>
              }
            </div>
          </div>

          {/* Measurement breakdown table */}
          {selMeasurements.length > 0 && (
            <div style={S.card}>
              <p style={S.cardTitle}>Measurement values — matched patients</p>
              <DataTable
                cols={[
                  { key: "ref", label: "Patient Ref", render: r => <span style={S.refBadge}>{r.ref}</span> },
                  { key: "ageGroup", label: "Age Group", sortable: true, render: r => <span style={S.ageGroupBadge}>{r.ageGroup}</span> },
                  { key: "gender", label: "Gender", sortable: true, render: r => <span style={S.badge(r.gender)}>{r.gender}</span> },
                  ...selMeasurements.map(m => ({
                    key: m, label: m, sortable: true,
                    render: r => <span style={{ fontWeight: 600, color: r[m] === "—" ? "#94a3b8" : "#854f0b" }}>{r[m]}</span>,
                  })),
                ]}
                rows={measurementRows}
              />
            </div>
          )}

          {/* Anonymous records expand */}
          <div style={S.card}>
            <p style={S.cardTitle}>Records</p>
            <AnonExpandPanel patients={filteredPatients} />
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================
   7. CUSTOMIZE TABLE
   ============================================================ */
const FIELD_DEFS = [
  { key: "ref", label: "Patient Ref" },
  { key: "ageGroup", label: "Age Group" },
  { key: "gender", label: "Gender" },
  { key: "conditions", label: "Diseases", isArr: true },
  { key: "meds", label: "Medications", isArr: true, teal: true },
  { key: "symptoms", label: "Reported Health", isArr: true },
];

function CustomizeTable({ diseases, medicines, symptoms }) {
  const allDiseases = diseases?.length > 0 ? diseases.map(d => d.label) : [];
  const allMeds = medicines?.length > 0 ? medicines.map(m => m.label) : [];
  const allSymptoms = symptoms?.length > 0 ? symptoms.map(s => s.label) : [];

  const [selFields, setSelFields] = useState(["ref", "ageGroup", "gender", "conditions", "meds"]);
  const [filterDis, setFilterDis] = useState([]);
  const [filterMed, setFilterMed] = useState([]);
  const [filterSymptoms, setFilterSymptoms] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");

  const toggleF = k => setSelFields(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  const toggleD = d => setFilterDis(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleM = m => setFilterMed(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  const toggleH = h => setFilterSymptoms(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);

  const filteredPatients = useMemo(() => {
    let p = [...MOCK_PATIENTS];
    if (filterDis.length > 0) p = p.filter(pt => pt.diseases.some(d => filterDis.includes(d.name)));
    if (filterMed.length > 0) p = p.filter(pt => pt.medications.some(m => filterMed.includes(m.name)));
    if (filterSymptoms.length > 0) p = p.filter(pt => { const s = pt.symptoms ? pt.symptoms.split(", ") : []; return filterSymptoms.some(x => s.includes(x)); });
    if (ageGroup !== "All") p = p.filter(pt => AGE_GROUPS[ageGroup]?.(pt.age));
    if (gender !== "All") p = p.filter(pt => pt.gender === gender);
    return p;
  }, [filterDis, filterMed, filterSymptoms, ageGroup, gender]);

  /* Anonymise for display */
  const rows = useMemo(() => anonymise(filteredPatients), [filteredPatients]);

  const activeFilters = filterDis.length + filterMed.length + filterSymptoms.length + (ageGroup !== "All" ? 1 : 0) + (gender !== "All" ? 1 : 0);

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
      <div style={S.pageHead}><h2 style={S.pageTitle}>Customize Table</h2><p style={S.pageSub}>Build your own anonymous lookup — choose columns and stack filters to understand the data</p></div>
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
          <div style={{ flex: 1, minWidth: 160 }}><TagSearch label="Disease" all={allDiseases} selected={filterDis} onToggle={toggleD} searchPlaceholder="Filter by disease…" /></div>
          <div style={{ flex: 1, minWidth: 160 }}><TagSearch label="Medication" all={allMeds} selected={filterMed} onToggle={toggleM} searchPlaceholder="Filter by medication…" /></div>
          <div style={{ flex: 1, minWidth: 160 }}><TagSearch label="Reported Symptoms" all={allSymptoms} selected={filterSymptoms} onToggle={toggleH} searchPlaceholder="Filter by symptom…" /></div>
          <div style={{ flex: 1, minWidth: 140 }}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup} /></div>
          <div style={{ flex: 1, minWidth: 140 }}><GenderFilter value={gender} onChange={setGender} /></div>
        </div>
      </div>
      <div style={S.statRow}>
        <StatCard label="Matching Records" value={filteredPatients.length} sub={`${pct(filteredPatients.length, MOCK_PATIENTS.length)}% of total patients`} />
        <StatCard label="Total Patients" value={MOCK_PATIENTS.length} />
        <StatCard label="Active Filters" value={activeFilters} />
      </div>
      {/* Global anonymisation notice */}
      {/* <div style={S.anonBanner}>
        <span style={{fontSize:15}}>🔒</span>
        <span><strong>Anonymous view.</strong> Patient names and exact ages are not shown. Each record is identified by an auto-generated reference number (P-001…) and age group only.</span>
      </div> */}
      <div style={S.card}>
        {cols.length === 0 ? <div style={S.noData}>Select at least one column to display</div> : (
          <DataTable cols={cols} rows={rows} empty="No records match the selected filters" />
        )}
      </div>
    </div>
  );
}



/* ============================================================
   NAV CONFIG
   ============================================================ */
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

  const sharedProps = { diseases: MOCK_DISEASES, medicines: MOCK_MEDICINES, symptoms: MOCK_SYMPTOMS };

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
        const [diseaseRes, medicineRes] = await Promise.all([
          fetchDiseases(),
          fetchMedicines(),
        ]);

        setDiseases(diseaseRes || []);
        setMedicines(medicineRes || []);
      } catch (err) {
        console.error("Error loading disease/medicine:", err);
      }
    };

    loadMeta();
  }, []);

  const VIEWS = {
    doctorana: <DoctorAnalytics selectedDoctorIds={selectedDoctorValues} />,
    demographics: <Demographics selectedDoctorIds={selectedDoctorValues} />,
    diseasedemo: <DiseaseDemo diseases={diseases} selectedDoctorIds={selectedDoctorValues} />,
    diseasemed: <DiseaseMedication diseases={diseases} symptoms={MOCK_SYMPTOMS} />,
    meddemo: <MedicationDemo medicines={medicines} symptoms={MOCK_SYMPTOMS} />,
    meddisease: <MedicationDisease medicines={medicines} symptoms={MOCK_SYMPTOMS} />,
    medhealth: <MedicationHealth medicines={medicines} symptoms={MOCK_SYMPTOMS} />,
    crossana: <CrossAnalysis    {...sharedProps} />,
    customize: <CustomizeTable {...sharedProps} />,
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