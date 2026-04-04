/**
 * AdminAnalytics.jsx  —  Super-admin version of the Analytics page.
 *
 * Patient data is fully anonymised throughout:
 *   - No patient names
 *   - No exact ages (age group shown instead)
 *   - Each row gets an auto-generated Patient Ref # (P-001, P-002…)
 *   - A 🔒 banner explains the anonymisation to the admin
 */

import { useState, useMemo } from "react";
import TagSearch from "./Analytics/TagSearch";
import AgeRangeFilter from "./Analytics/AgeRangeFilter";
import GenderFilter from "./Analytics/GenderFilter";
import { BsFillFileBarGraphFill, BsPeopleFill } from "react-icons/bs";
import { PiHospitalFill } from "react-icons/pi";
import { GiMedicines, GiPillDrop } from "react-icons/gi";
import { FaStethoscope } from "react-icons/fa";
import { BiSolidCustomize } from "react-icons/bi";

/* ============================================================
   STATIC MOCK DATA
   ============================================================ */
const MOCK_PATIENTS = [
  { id:1,  age:45, gender:"Male",   diseases:[{name:"Hypertension"},{name:"Type 2 Diabetes"}], medications:[{name:"Lisinopril"},{name:"Metformin"}],    symptoms:"headache, fatigue" },
  { id:2,  age:32, gender:"Female", diseases:[{name:"Migraine"}],                               medications:[{name:"Sumatriptan"}],                      symptoms:"severe headache, nausea" },
  { id:3,  age:58, gender:"Male",   diseases:[{name:"COPD"},{name:"Hypertension"}],             medications:[{name:"Albuterol"},{name:"Lisinopril"}],     symptoms:"shortness of breath, wheezing" },
  { id:4,  age:27, gender:"Female", diseases:[{name:"Anxiety"}],                                medications:[{name:"Sertraline"}],                        symptoms:"nervousness, insomnia" },
  { id:5,  age:62, gender:"Male",   diseases:[{name:"Osteoarthritis"},{name:"Hypertension"}],   medications:[{name:"Ibuprofen"},{name:"Amlodipine"}],     symptoms:"joint pain, stiffness" },
  { id:6,  age:41, gender:"Female", diseases:[{name:"Asthma"}],                                 medications:[{name:"Fluticasone"}],                       symptoms:"coughing, chest tightness" },
  { id:7,  age:73, gender:"Male",   diseases:[{name:"Heart Failure"},{name:"COPD"}],            medications:[{name:"Furosemide"},{name:"Spiriva"}],       symptoms:"fatigue, edema, shortness of breath" },
  { id:8,  age:35, gender:"Female", diseases:[{name:"Depression"}],                             medications:[{name:"Escitalopram"}],                      symptoms:"low mood, loss of interest" },
  { id:9,  age:51, gender:"Male",   diseases:[{name:"Type 2 Diabetes"},{name:"Hyperlipidemia"}],medications:[{name:"Metformin"},{name:"Atorvastatin"}],   symptoms:"frequent urination, thirst" },
  { id:10, age:29, gender:"Female", diseases:[{name:"Migraine"}],                               medications:[{name:"Rizatriptan"}],                       symptoms:"aura, throbbing headache" },
];

const MOCK_DEMOGRAPHICS = [
  {age_group:"0-18",  gender:"Male",   count:5},
  {age_group:"0-18",  gender:"Female", count:4},
  {age_group:"19-30", gender:"Male",   count:12},
  {age_group:"19-30", gender:"Female", count:15},
  {age_group:"31-45", gender:"Male",   count:18},
  {age_group:"31-45", gender:"Female", count:14},
  {age_group:"46+",   gender:"Male",   count:10},
  {age_group:"46+",   gender:"Female", count:8},
];

const MOCK_DOCTORS  = [{value:1,label:"Dr. Smith"},{value:2,label:"Dr. Johnson"},{value:3,label:"Dr. Williams"}];
const MOCK_DISEASES = ["Hypertension","Type 2 Diabetes","Migraine","COPD","Anxiety","Depression","Asthma","Osteoarthritis","Heart Failure","Hyperlipidemia"].map(l=>({label:l}));
const MOCK_MEDICINES= ["Lisinopril","Metformin","Sumatriptan","Albuterol","Sertraline","Ibuprofen","Amlodipine","Fluticasone","Furosemide","Spiriva","Escitalopram","Atorvastatin","Rizatriptan"].map(l=>({label:l}));
const MOCK_SYMPTOMS = ["headache","fatigue","nausea","shortness of breath","wheezing","joint pain","coughing","edema","insomnia"].map(l=>({label:l}));

/* ============================================================
   ANONYMISATION HELPERS
   ============================================================ */
const AGE_GROUPS = {
  "0-18":  a => a <= 18,
  "19-30": a => a >= 19 && a <= 30,
  "31-45": a => a >= 31 && a <= 45,
  "46+":   a => a >= 46,
};

/** Convert exact age → age-group label */
const toAgeGroup = age => {
  if (age <= 18) return "0-18";
  if (age <= 30) return "19-30";
  if (age <= 45) return "31-45";
  return "46+";
};

/**
 * Anonymise a patient array for admin display.
 * Removes name / exact age; replaces with Patient Ref and age group.
 */
const anonymise = (patients) =>
  patients.map((p, i) => ({
    ref:       `P-${String(i + 1).padStart(3, "0")}`,   // P-001, P-002 …
    ageGroup:  toAgeGroup(p.age),
    gender:    p.gender,
    conditions:p.diseases.map(d => d.name),
    meds:      p.medications.map(m => m.name),
    symptoms:  p.symptoms ? p.symptoms.split(", ") : [],
  }));

/* ============================================================
   CONSTANTS
   ============================================================ */
const ACCENT    = "#1ddec4";
const ACCENT_BG = "rgba(29,222,196,0.13)";
const GCOLORS   = { Male:ACCENT, Female:"#60a5fa", Other:"#8b5cf6", "Not Specified":"#94a3b8" };

/* ============================================================
   STYLES
   ============================================================ */
const S = {
  wrap:        { display:"flex", fontFamily:"'DM Sans',sans-serif", minHeight:"100vh", background:"#f4f6fb" },
  nav:         { width:230, minWidth:210, background:"#fff", borderRight:"1px solid #eaecf2", display:"flex", flexDirection:"column", flexShrink:0 },
  navHead:     { padding:"22px 20px 14px", borderBottom:"1px solid #f0f2f8" },
  navTitle:    { fontSize:15, fontWeight:800, color:"#1a202c", letterSpacing:-.3 },
  navSub:      { fontSize:11, color:"#a0aec0", marginTop:2 },
  navGroup:    { padding:"14px 16px 4px 18px", fontSize:10, fontWeight:700, letterSpacing:1.6, color:"#c4cad8", textTransform:"uppercase" },
  navItem:     a => ({
    margin:"1px 10px", padding:"9px 12px", borderRadius:10, cursor:"pointer", fontSize:12.5,
    fontWeight:a?600:400, background:a?ACCENT_BG:"transparent", color:a?ACCENT:"#4a5568",
    border:a?`1px solid rgba(29,222,196,0.25)`:"1px solid transparent",
    transition:"all .15s", display:"flex", alignItems:"center", gap:9,
  }),
  main:        { flex:1, padding:"28px 28px 40px", overflowX:"hidden", minWidth:0 },
  /* admin banners */
  adminBanner: { background:`linear-gradient(135deg,${ACCENT_BG},rgba(96,165,250,0.08))`, border:`1px solid rgba(29,222,196,0.25)`, borderRadius:12, padding:"12px 18px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 },
  adminBannerLeft: { display:"flex", alignItems:"center", gap:10 },
  adminBadge:  { background:ACCENT, color:"#fff", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:6, letterSpacing:.5, textTransform:"uppercase" },
  adminBannerText: { fontSize:12, color:"#374151", fontWeight:500 },
  doctorSelect:{ padding:"7px 12px", borderRadius:8, border:"1px solid #dde1ec", fontSize:12, outline:"none", background:"#fff", minWidth:200, cursor:"pointer" },
  /* anonymisation notice */
  anonBanner:  { background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:10, padding:"9px 14px", marginBottom:16, display:"flex", alignItems:"center", gap:8, fontSize:12, color:"#92400e" },
  /* page */
  pageHead:    { marginBottom:20 },
  pageTitle:   { fontSize:18, fontWeight:800, color:"#1a202c", margin:0 },
  pageSub:     { fontSize:13, color:"#64748b", marginTop:4 },
  filterBar:   { background:"#fff", borderRadius:14, padding:"16px 20px", border:"1px solid #eaecf2", marginBottom:20, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" },
  filterRow:   { display:"flex", gap:12, flexWrap:"wrap", alignItems:"flex-end" },
  filterLabel: { fontSize:10, fontWeight:700, color:"#94a3b8", letterSpacing:1, textTransform:"uppercase", marginBottom:5, display:"block" },
  statRow:     { display:"flex", gap:14, flexWrap:"wrap", marginBottom:20 },
  statCard:    { background:"#fff", borderRadius:12, padding:"14px 18px", border:"1px solid #eaecf2", minWidth:130, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" },
  statVal:     { fontSize:24, fontWeight:800, color:ACCENT, lineHeight:1.1 },
  statLbl:     { fontSize:11, color:"#94a3b8", marginBottom:4, fontWeight:500 },
  statSub:     { fontSize:11, color:"#b0b8c9", marginTop:3 },
  card:        { background:"#fff", borderRadius:14, padding:"20px 22px", border:"1px solid #eaecf2", boxShadow:"0 1px 8px rgba(0,0,0,0.04)", marginBottom:18 },
  cardTitle:   { fontSize:13, fontWeight:700, color:"#1a202c", marginBottom:14, marginTop:0, display:"flex", alignItems:"center", justifyContent:"space-between" },
  grid2:       { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:18 },
  tWrap:       { overflowX:"auto", borderRadius:10, border:"1px solid #eaecf2" },
  th:          { padding:"10px 13px", fontSize:11, fontWeight:700, color:"#6b7280", background:"#f8f9fc", borderBottom:"1px solid #eaecf2", whiteSpace:"nowrap", letterSpacing:.3 },
  td:          { padding:"10px 13px", fontSize:12, color:"#374151", borderBottom:"1px solid #f4f6fb" },
  chip:        t => ({
    display:"inline-flex", alignItems:"center", gap:3, padding:"2px 9px", borderRadius:999,
    fontSize:11, fontWeight:500, background:t?ACCENT_BG:"#f1f5f9", color:t?ACCENT:"#374151",
    border:t?`1px solid rgba(29,222,196,0.3)`:"1px solid #e5e7eb", margin:"2px 3px 2px 0", lineHeight:"15px",
  }),
  badge:       c => ({
    display:"inline-block", whiteSpace:"nowrap", padding:"2px 9px", borderRadius:999, fontSize:11, fontWeight:600,
    background:c==="Male"?ACCENT_BG:c==="Female"?"rgba(96,165,250,0.15)":"rgba(139,92,246,0.15)",
    color:c==="Male"?ACCENT:c==="Female"?"#60a5fa":"#8b5cf6",
  }),
  refBadge:    { display:"inline-block", padding:"2px 8px", borderRadius:6, fontSize:11, fontWeight:700, background:"#f1f5f9", color:"#64748b", fontFamily:"monospace", letterSpacing:.5 },
  ageGroupBadge:{ display:"inline-block", padding:"2px 8px", borderRadius:6, fontSize:11, fontWeight:600, background:"rgba(29,222,196,0.08)", color:ACCENT, border:`1px solid rgba(29,222,196,0.2)` },
  barWrap:     { display:"flex", flexDirection:"column", gap:9 },
  barRow:      { display:"grid", gridTemplateColumns:"180px 1fr 70px", alignItems:"center", gap:10 },
  barLabel:    { fontSize:12, color:"#374151", fontWeight:500, wordBreak:"break-word" },
  barTrack:    { width:"100%", background:"#f1f5f9", borderRadius:999, height:7, overflow:"hidden" },
  barFill:     (p,c) => ({ height:"100%", width:`${Math.min(p,100)}%`, background:c||ACCENT, borderRadius:999, transition:"width .5s" }),
  barVal:      { fontSize:11, fontWeight:700, color:ACCENT, textAlign:"right" },
  expandBtn:   { border:"none", cursor:"pointer", fontSize:11, color:ACCENT, fontWeight:600, padding:"5px 12px", borderRadius:7, background:ACCENT_BG },
  expandPanel: { marginTop:14, borderTop:"1px solid #eaecf2", paddingTop:14 },
  noData:      { textAlign:"center", padding:"28px 0", color:"#b0b8c9", fontSize:13 },
  checkLabel:  a => ({ display:"flex", alignItems:"center", gap:7, fontSize:12, cursor:"pointer", color:a?ACCENT:"#374151", fontWeight:a?600:400 }),
};

function pct(n, d) { return d===0?"0.0":((n/d)*100).toFixed(1); }

/* ============================================================
   SHARED UI COMPONENTS
   ============================================================ */
function Chip({label,teal}) { return <span style={S.chip(teal)}>{label}</span>; }
function DChips({arr}) { return <>{(arr||[]).map((c,i)=><Chip key={i} label={c} teal={false}/>)}</>; }
function MChips({arr}) { return <>{(arr||[]).map((m,i)=><Chip key={i} label={m} teal={true}/>)}</>; }

function StatCard({label,value,sub,accent}) {
  return (
    <div style={S.statCard}>
      <div style={S.statLbl}>{label}</div>
      <div style={{...S.statVal,color:accent||ACCENT}}>{value}</div>
      {sub&&<div style={S.statSub}>{sub}</div>}
    </div>
  );
}

function HBar({label,value,total,pctVal,color}) {
  const p = pctVal!==undefined?parseFloat(pctVal):(total>0?(value/total)*100:0);
  return (
    <div style={S.barRow}>
      <span style={S.barLabel} title={label}>{label}</span>
      <div style={S.barTrack}><div style={S.barFill(p,color)}/></div>
      <span style={{...S.barVal,color:color||ACCENT}}>{value} <span style={{color:"#94a3b8",fontWeight:400}}>({p.toFixed(1)}%)</span></span>
    </div>
  );
}

function DataTable({cols,rows,empty="No data found"}) {
  const [sortConfig,setSortConfig] = useState({key:null,direction:"asc"});
  const onSort = key => setSortConfig(prev=>prev.key===key?{key,direction:prev.direction==="asc"?"desc":"asc"}:{key,direction:"asc"});
  const sortedRows = useMemo(()=>{
    if(!sortConfig.key) return rows;
    return [...rows].sort((a,b)=>{
      const av=a[sortConfig.key]??"", bv=b[sortConfig.key]??"";
      if(av<bv) return sortConfig.direction==="asc"?-1:1;
      if(av>bv) return sortConfig.direction==="asc"?1:-1;
      return 0;
    });
  },[rows,sortConfig]);
  return (
    <div style={S.tWrap}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead>
          <tr>
            {cols.map(c=>(
              <th key={c.key} style={{...S.th,cursor:c.sortable?"pointer":"default"}}
                onClick={()=>c.sortable&&onSort(c.key)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  {c.label}
                  {c.sortable&&<span className="sort-icons"><span className={`arrow up ${sortConfig?.key===c.key&&sortConfig.direction==="asc"?"active":""}`}/><span className={`arrow down ${sortConfig?.key===c.key&&sortConfig.direction==="desc"?"active":""}`}/></span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length===0
            ? <tr><td colSpan={cols.length} style={S.noData}>{empty}</td></tr>
            : sortedRows.map((r,i)=>(
              <tr key={i} style={{background:i%2===0?"#fff":"#fafbfd"}}>
                {cols.map(c=><td key={c.key} style={{...S.td,...(c.style||{})}}>{c.render?c.render(r):r[c.key]}</td>)}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
   ANONYMISED EXPAND PANEL
   Used in every section — shows the anonymised patient breakdown
   so the admin can verify that the analytics above are correct,
   without exposing any personally identifiable information.
   ============================================================ */
function AnonExpandPanel({patients, showSymptoms=false}) {
  const [open, setOpen] = useState(false);

  /* Anonymise on expand — must be called before any early return */
  const rows = useMemo(()=>anonymise(patients||[]),[patients]);

  if(!patients||patients.length===0) return null;

  const cols = [
    {
      key:"ref", label:"Patient Ref",
      render: r => <span style={S.refBadge}>{r.ref}</span>
    },
    {
      key:"ageGroup", label:"Age Group",
      sortable:true,
      render: r => <span style={S.ageGroupBadge}>{r.ageGroup}</span>
    },
    {
      key:"gender", label:"Gender",
      sortable:true,
      render: r => <span style={S.badge(r.gender)}>{r.gender}</span>
    },
    {
      key:"conditions", label:"Diseases",
      render: r => <DChips arr={r.conditions}/>
    },
    {
      key:"meds", label:"Medications",
      render: r => <MChips arr={r.meds}/>
    },
    ...(showSymptoms ? [{
      key:"symptoms", label:"Reported Symptoms",
      render: r => <DChips arr={r.symptoms}/>
    }] : []),
  ];

  return (
    <div>
      <button style={S.expandBtn} onClick={()=>setOpen(v=>!v)}>
        {open ? "▲ Collapse records" : `▼ Expand — view ${patients.length} record${patients.length!==1?"s":""}`}
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
          <DataTable cols={cols} rows={rows} empty="No records available"/>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ADMIN DOCTOR FILTER BANNER
   ============================================================ */
function AdminDoctorBanner({selectedDoctor,doctors,onChange}) {
  return (
    <div style={S.adminBanner}>
      <div style={S.adminBannerLeft}>
        <span style={S.adminBadge}>Admin</span>
        <span style={S.adminBannerText}>
          {selectedDoctor
            ? `Viewing data for: ${doctors.find(d=>d.value===selectedDoctor)?.label||"Doctor"}`
            : "Viewing data across all doctors"}
        </span>
      </div>
      <select style={S.doctorSelect} value={selectedDoctor||""} onChange={e=>onChange(e.target.value||null)}>
        <option value="">All Doctors</option>
        {doctors.map(d=><option key={d.value} value={d.value}>{d.label}</option>)}
      </select>
    </div>
  );
}

/* ============================================================
   1. DEMOGRAPHICS
   ============================================================ */
function Demographics() {
  const [ageGroup,setAgeGroup] = useState("All");
  const [gender,  setGender]   = useState("All");

  const filteredData = useMemo(()=>MOCK_DEMOGRAPHICS.filter(item=>{
    if(ageGroup!=="All"&&item.age_group!==ageGroup) return false;
    if(gender!=="All"&&item.gender!==gender) return false;
    return true;
  }),[ageGroup,gender]);

  const total        = filteredData.reduce((s,i)=>s+i.count,0);
  const ageGroupCount= new Set(filteredData.map(i=>i.age_group)).size;

  const ageDist = useMemo(()=>{
    const map={};
    filteredData.forEach(i=>{map[i.age_group]=(map[i.age_group]||0)+i.count;});
    return Object.entries(map).map(([label,value])=>({label,value,pct:pct(value,total)}));
  },[filteredData,total]);

  const genderDist = useMemo(()=>{
    const map={Male:0,Female:0,Other:0,"Not Specified":0};
    filteredData.forEach(i=>{if(map[i.gender]!==undefined)map[i.gender]+=i.count;});
    return Object.entries(map).map(([label,value])=>({label,value,pct:pct(value,total)}));
  },[filteredData,total]);

  const crossData = useMemo(()=>{
    const genders=["Male","Female","Other","Not Specified"];
    const map={};
    Object.keys(AGE_GROUPS).forEach(ag=>{map[ag]={age:ag,Male:0,Female:0,Other:0,"Not Specified":0,total:0};});
    filteredData.forEach(item=>{
      if(!map[item.age_group]) return;
      map[item.age_group][item.gender]+=item.count;
      map[item.age_group].total+=item.count;
    });
    return Object.values(map).map(row=>{
      const nr={...row};
      genders.forEach(g=>{nr[g+"_pct"]=pct(row[g],total);});
      nr.total_pct=pct(row.total,total);
      return nr;
    });
  },[filteredData,total]);

  /* For the expand panel we need the mock patients filtered to the same slice */
  const filteredPatients = useMemo(()=>MOCK_PATIENTS.filter(p=>{
    const ag = toAgeGroup(p.age);
    if(ageGroup!=="All"&&ag!==ageGroup) return false;
    if(gender!=="All"&&p.gender!==gender) return false;
    return true;
  }),[ageGroup,gender]);

  return (
    <div>
      <div style={S.pageHead}><h2 style={S.pageTitle}>Demographics</h2><p style={S.pageSub}>Age group × Sex distribution across patients</p></div>
      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{flex:1,minWidth:180}}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup}/></div>
          <div style={{flex:1,minWidth:180}}><GenderFilter value={gender} onChange={setGender}/></div>
        </div>
      </div>
      <div style={S.statRow}>
        <StatCard label="Patients in View" value={total} sub={`${pct(total,86)}% of all patients`}/>
        <StatCard label="Total Patients"   value={86}/>
        <StatCard label="Age Groups"       value={ageGroupCount}/>
      </div>
      <div style={S.grid2}>
        <div style={S.card}>
          <p style={S.cardTitle}>Age Group Distribution</p>
          <div style={S.barWrap}>{ageDist.map((d,i)=><HBar key={i} label={d.label} value={d.value} total={total} pctVal={d.pct}/>)}</div>
        </div>
        <div style={S.card}>
          <p style={S.cardTitle}>Sex Distribution</p>
          <div style={S.barWrap}>{genderDist.map((d,i)=><HBar key={i} label={d.label} value={d.value} total={total} pctVal={d.pct} color={GCOLORS[d.label]}/>)}</div>
        </div>
      </div>
      <div style={S.card}>
        <p style={S.cardTitle}>Age × Sex Cross-table</p>
        <DataTable cols={[
          {key:"age",          label:"Age Group",    sortable:true},
          {key:"Male",         label:"Male",         sortable:true, render:r=><span style={{fontWeight:600,color:ACCENT}}>{r.Male} <span style={{color:"#94a3b8",fontWeight:400}}>({r.Male_pct}%)</span></span>},
          {key:"Female",       label:"Female",       sortable:true, render:r=><span style={{fontWeight:600,color:"#60a5fa"}}>{r.Female} <span style={{color:"#94a3b8",fontWeight:400}}>({r.Female_pct}%)</span></span>},
          {key:"Other",        label:"Other",        sortable:true, render:r=><span style={{fontWeight:600,color:"#8b5cf6"}}>{r.Other} <span style={{color:"#94a3b8",fontWeight:400}}>({r.Other_pct}%)</span></span>},
          {key:"Not Specified",label:"Not Specified",sortable:true, render:r=><span style={{fontWeight:600,color:"#94a3b8"}}>{r["Not Specified"]} <span style={{fontWeight:400}}>({r["Not Specified_pct"]}%)</span></span>},
          {key:"total",        label:"Total",        sortable:true, render:r=><span style={{fontWeight:700}}>{r.total} <span style={{color:"#94a3b8",fontWeight:400}}>({r.total_pct}%)</span></span>},
        ]} rows={crossData}/>
        <div style={{marginTop:14}}>
          <AnonExpandPanel patients={filteredPatients}/>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   2. DISEASE / DEMOGRAPHICS
   ============================================================ */
function DiseaseDemo({diseases}) {
  const allDiseases = diseases?.length>0?diseases.map(d=>d.label):[];
  const [selDiseases,setSelDiseases] = useState([]);
  const [ageGroup,   setAgeGroup]    = useState("All");
  const [gender,     setGender]      = useState("All");

  const toggleD = d=>setSelDiseases(prev=>prev.includes(d)?prev.filter(x=>x!==d):[...prev,d]);

  const filteredPatients = useMemo(()=>{
    let p=[...MOCK_PATIENTS];
    if(selDiseases.length>0) p=p.filter(pt=>pt.diseases.some(d=>selDiseases.includes(d.name)));
    if(ageGroup!=="All") p=p.filter(pt=>AGE_GROUPS[ageGroup]?.(pt.age));
    if(gender!=="All")   p=p.filter(pt=>pt.gender===gender);
    return p;
  },[selDiseases,ageGroup,gender]);

  const diseaseDist = useMemo(()=>{
    const map={};
    filteredPatients.forEach(p=>p.diseases.forEach(d=>{map[d.name]=(map[d.name]||0)+1;}));
    return Object.entries(map).map(([label,value])=>({label,value,pct:pct(value,filteredPatients.length)}));
  },[filteredPatients]);

  const ageDist = useMemo(()=>{
    const map={"0-18":0,"19-30":0,"31-45":0,"46+":0};
    filteredPatients.forEach(p=>{const g=Object.keys(AGE_GROUPS).find(k=>AGE_GROUPS[k](p.age));if(g)map[g]++;});
    return Object.entries(map).map(([age_group,count])=>({age_group,count,percentage:pct(count,filteredPatients.length)}));
  },[filteredPatients]);

  const genderDist = useMemo(()=>{
    const base={Male:0,Female:0,Other:0,"Not Specified":0};
    filteredPatients.forEach(p=>{if(base[p.gender]!==undefined)base[p.gender]++;else base["Not Specified"]++;});
    return Object.entries(base).map(([gender,count])=>({gender,count,percentage:pct(count,filteredPatients.length)}));
  },[filteredPatients]);

  return (
    <div>
      <div style={S.pageHead}><h2 style={S.pageTitle}>Disease / Demographics</h2><p style={S.pageSub}>Disease prevalence by age and sex</p></div>
      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{flex:2,minWidth:200}}><TagSearch label="Disease" all={allDiseases} selected={selDiseases} onToggle={toggleD} searchPlaceholder="Search diseases…"/></div>
          <div style={{flex:1,minWidth:160}}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup}/></div>
          <div style={{flex:1,minWidth:160}}><GenderFilter value={gender} onChange={setGender}/></div>
        </div>
      </div>
      <div style={S.statRow}>
        <StatCard label="Matched Patients" value={filteredPatients.length} sub={`${pct(filteredPatients.length,MOCK_PATIENTS.length)}% of group`}/>
        <StatCard label="Group Size"        value={MOCK_PATIENTS.length} sub="Total patients"/>
        <StatCard label="Diseases Selected" value={selDiseases.length||"All"}/>
      </div>
      <div style={S.grid2}>
        <div style={S.card}>
          <p style={S.cardTitle}>Disease Distribution</p>
          <div style={S.barWrap}>{diseaseDist.map((d,i)=><HBar key={i} label={d.label} value={d.value} total={filteredPatients.length} pctVal={d.pct}/>)}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={S.card}>
            <p style={S.cardTitle}>Age Breakdown</p>
            <div style={S.barWrap}>{ageDist.map((d,i)=><HBar key={i} label={d.age_group} value={d.count} total={filteredPatients.length} pctVal={d.percentage}/>)}</div>
          </div>
          <div style={S.card}>
            <p style={S.cardTitle}>Sex Breakdown</p>
            <div style={S.barWrap}>{genderDist.map((d,i)=><HBar key={i} label={d.gender} value={d.count} total={filteredPatients.length} pctVal={d.percentage} color={GCOLORS[d.gender]}/>)}</div>
          </div>
        </div>
      </div>
      <div style={S.card}>
        <p style={S.cardTitle}>Records 
          {/* <span style={{fontSize:11,color:"#94a3b8",fontWeight:400}}>Expand to verify analytics data</span> */}
        </p>
        <AnonExpandPanel patients={filteredPatients}/>
      </div>
    </div>
  );
}

/* ============================================================
   3. DISEASE / MEDICATION
   ============================================================ */
function DiseaseMedication({diseases}) {
  const allDiseases = diseases?.length>0?diseases.map(d=>d.label):[];
  const [selDiseases,setSelDiseases] = useState([]);
  const [ageGroup,   setAgeGroup]    = useState("All");
  const [gender,     setGender]      = useState("All");

  const toggleD = d=>setSelDiseases(prev=>prev.includes(d)?prev.filter(x=>x!==d):[...prev,d]);

  const filteredPatients = useMemo(()=>{
    let p=[...MOCK_PATIENTS];
    if(selDiseases.length>0) p=p.filter(pt=>pt.diseases.some(d=>selDiseases.includes(d.name)));
    if(ageGroup!=="All") p=p.filter(pt=>AGE_GROUPS[ageGroup]?.(pt.age));
    if(gender!=="All")   p=p.filter(pt=>pt.gender===gender);
    return p;
  },[selDiseases,ageGroup,gender]);

  const medicationStats = useMemo(()=>{
    const map={};
    filteredPatients.forEach(p=>p.medications.forEach(m=>{map[m.name]=(map[m.name]||0)+1;}));
    return Object.entries(map).map(([name,count])=>({
      medicine_name:name,
      patient_count:count,
      percent_matched:pct(count,filteredPatients.length),
      percent_total:pct(count,MOCK_PATIENTS.length),
    })).sort((a,b)=>b.patient_count-a.patient_count);
  },[filteredPatients]);

  const topDrug = medicationStats[0]?.medicine_name||"—";

  return (
    <div>
      <div style={S.pageHead}><h2 style={S.pageTitle}>Disease / Medication</h2><p style={S.pageSub}>Select diseases → see which drugs are prescribed</p></div>
      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{flex:2,minWidth:200}}><TagSearch label="Disease(s)" all={allDiseases} selected={selDiseases} onToggle={toggleD} searchPlaceholder="Add diseases…"/></div>
          <div style={{flex:1,minWidth:160}}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup}/></div>
          <div style={{flex:1,minWidth:160}}><GenderFilter value={gender} onChange={setGender}/></div>
        </div>
      </div>
      <div style={S.statRow}>
        <StatCard label="Matched Patients" value={filteredPatients.length} sub={`${pct(filteredPatients.length,MOCK_PATIENTS.length)}% of all patients`}/>
        <StatCard label="Total Patients"   value={MOCK_PATIENTS.length}/>
        <StatCard label="Top Drug"         value={topDrug}/>
      </div>
      <div style={S.card}>
        <p style={S.cardTitle}>Drug Distribution</p>
        {medicationStats.length===0 ? <div style={S.noData}>No data found</div> : (
          <DataTable cols={[
            {key:"medicine_name",  label:"Medication",        sortable:true, render:r=><Chip label={r.medicine_name} teal={true}/>},
            {key:"patient_count",  label:"Patients",          sortable:true, render:r=><span style={{fontWeight:700,color:ACCENT}}>{r.patient_count}</span>},
            {key:"percent_matched",label:"% of Matched",      sortable:true, render:r=><span>{r.percent_matched}%</span>},
            {key:"percent_total",  label:"% of All Patients", sortable:true, render:r=><span style={{color:"#94a3b8"}}>{r.percent_total}%</span>},
          ]} rows={medicationStats}/>
        )}
        <div style={{marginTop:14}}>
          <AnonExpandPanel patients={filteredPatients}/>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   4. MEDICATION / DEMOGRAPHICS
   ============================================================ */
function MedicationDemo({medicines}) {
  const allMeds = medicines?.length>0?medicines.map(m=>m.label):[];
  const [selMeds,  setSelMeds]  = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender,   setGender]   = useState("All");

  const toggleM = m=>setSelMeds(prev=>prev.includes(m)?prev.filter(x=>x!==m):[...prev,m]);

  const filteredPatients = useMemo(()=>{
    let p=[...MOCK_PATIENTS];
    if(selMeds.length>0) p=p.filter(pt=>pt.medications.some(m=>selMeds.includes(m.name)));
    if(ageGroup!=="All") p=p.filter(pt=>AGE_GROUPS[ageGroup]?.(pt.age));
    if(gender!=="All")   p=p.filter(pt=>pt.gender===gender);
    return p;
  },[selMeds,ageGroup,gender]);

  const medicationDist = useMemo(()=>{
    const map={};
    filteredPatients.forEach(p=>p.medications.forEach(m=>{
      if(selMeds.length===0||selMeds.includes(m.name)) map[m.name]=(map[m.name]||0)+1;
    }));
    return Object.entries(map).map(([label,value])=>({label,value,pct:pct(value,filteredPatients.length)}));
  },[filteredPatients,selMeds]);

  const ageDist = useMemo(()=>{
    const map={"0-18":0,"19-30":0,"31-45":0,"46+":0};
    filteredPatients.forEach(p=>{const g=Object.keys(AGE_GROUPS).find(k=>AGE_GROUPS[k](p.age));if(g)map[g]++;});
    return Object.entries(map).map(([age_group,count])=>({age_group,count,percentage:pct(count,filteredPatients.length)}));
  },[filteredPatients]);

  const genderDist = useMemo(()=>{
    const base={Male:0,Female:0,Other:0,"Not Specified":0};
    filteredPatients.forEach(p=>{if(base[p.gender]!==undefined)base[p.gender]++;else base["Not Specified"]++;});
    return Object.entries(base).map(([gender,count])=>({gender,count,percentage:pct(count,filteredPatients.length)}));
  },[filteredPatients]);

  return (
    <div>
      <div style={S.pageHead}><h2 style={S.pageTitle}>Medication / Demographics</h2><p style={S.pageSub}>Medication usage breakdown by age and sex</p></div>
      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{flex:2,minWidth:200}}><TagSearch label="Medication" all={allMeds} selected={selMeds} onToggle={toggleM} searchPlaceholder="Search medications…"/></div>
          <div style={{flex:1,minWidth:160}}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup}/></div>
          <div style={{flex:1,minWidth:160}}><GenderFilter value={gender} onChange={setGender}/></div>
        </div>
      </div>
      <div style={S.statRow}>
        <StatCard label="Matched Patients"    value={filteredPatients.length} sub={`${pct(filteredPatients.length,MOCK_PATIENTS.length)}% of all patients`}/>
        <StatCard label="Total Patients"      value={MOCK_PATIENTS.length}/>
        <StatCard label="Selected Medications"value={selMeds.length||"All"}/>
      </div>
      <div style={S.grid2}>
        <div style={S.card}>
          <p style={S.cardTitle}>Medication Distribution</p>
          <div style={S.barWrap}>{medicationDist.map((d,i)=><HBar key={i} label={d.label} value={d.value} total={filteredPatients.length} pctVal={d.pct}/>)}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={S.card}>
            <p style={S.cardTitle}>Age Breakdown</p>
            <div style={S.barWrap}>{ageDist.map((d,i)=><HBar key={i} label={d.age_group} value={d.count} total={filteredPatients.length} pctVal={d.percentage}/>)}</div>
          </div>
          <div style={S.card}>
            <p style={S.cardTitle}>Sex Breakdown</p>
            <div style={S.barWrap}>{genderDist.map((d,i)=><HBar key={i} label={d.gender} value={d.count} total={filteredPatients.length} pctVal={d.percentage} color={GCOLORS[d.gender]}/>)}</div>
          </div>
        </div>
      </div>
      <div style={S.card}>
        <p style={S.cardTitle}>Records 
          {/* <span style={{fontSize:11,color:"#94a3b8",fontWeight:400}}>Expand to verify analytics data</span> */}
        </p>
        <AnonExpandPanel patients={filteredPatients}/>
      </div>
    </div>
  );
}

/* ============================================================
   5. MEDICATION / DISEASE
   ============================================================ */
function MedicationDisease({medicines}) {
  const allMeds = medicines?.length>0?medicines.map(m=>m.label):[];
  const [selMeds,  setSelMeds]  = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender,   setGender]   = useState("All");

  const toggleM = m=>setSelMeds(prev=>prev.includes(m)?prev.filter(x=>x!==m):[...prev,m]);

  const filteredPatients = useMemo(()=>{
    let p=[...MOCK_PATIENTS];
    if(selMeds.length>0) p=p.filter(pt=>pt.medications.some(m=>selMeds.includes(m.name)));
    if(ageGroup!=="All") p=p.filter(pt=>AGE_GROUPS[ageGroup]?.(pt.age));
    if(gender!=="All")   p=p.filter(pt=>pt.gender===gender);
    return p;
  },[selMeds,ageGroup,gender]);

  const diseaseDist = useMemo(()=>{
    const map={};
    filteredPatients.forEach(p=>p.diseases.forEach(d=>{map[d.name]=(map[d.name]||0)+1;}));
    return Object.entries(map).map(([disease,count])=>({
      disease, patient_count:count,
      percent_matched:pct(count,filteredPatients.length),
      percent_total:pct(count,MOCK_PATIENTS.length),
    })).sort((a,b)=>b.patient_count-a.patient_count);
  },[filteredPatients]);

  const topDisease = diseaseDist[0]?.disease||"—";

  return (
    <div>
      <div style={S.pageHead}><h2 style={S.pageTitle}>Medication / Disease</h2><p style={S.pageSub}>Select medications → see which diseases are associated</p></div>
      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{flex:2,minWidth:200}}><TagSearch label="Medication(s)" all={allMeds} selected={selMeds} onToggle={toggleM} searchPlaceholder="Add medications…"/></div>
          <div style={{flex:1,minWidth:160}}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup}/></div>
          <div style={{flex:1,minWidth:160}}><GenderFilter value={gender} onChange={setGender}/></div>
        </div>
      </div>
      <div style={S.statRow}>
        <StatCard label="Matched Patients" value={filteredPatients.length} sub={`${pct(filteredPatients.length,MOCK_PATIENTS.length)}% of all patients`}/>
        <StatCard label="Unique Diseases"  value={diseaseDist.length}/>
        <StatCard label="Top Disease"      value={topDisease}/>
      </div>
      <div style={S.card}>
        <p style={S.cardTitle}>Disease Distribution</p>
        {diseaseDist.length===0 ? <div style={S.noData}>Select a medication to see disease data</div> : (
          <DataTable cols={[
            {key:"disease",        label:"Disease",           sortable:true, render:r=><Chip label={r.disease} teal={false}/>},
            {key:"patient_count",  label:"Patients",          sortable:true, render:r=><span style={{fontWeight:700,color:ACCENT}}>{r.patient_count}</span>},
            {key:"percent_matched",label:"% of Matched",      sortable:true, render:r=><span style={{fontWeight:600}}>{r.percent_matched}%</span>},
            {key:"percent_total",  label:"% of All Patients", sortable:true, render:r=><span style={{color:"#94a3b8"}}>{r.percent_total}%</span>},
          ]} rows={diseaseDist}/>
        )}
        <div style={{marginTop:14}}>
          <AnonExpandPanel patients={filteredPatients}/>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   6. MEDICATION / REPORTED HEALTH
   ============================================================ */
function MedicationHealth({medicines}) {
  const allMeds = medicines?.length>0?medicines.map(m=>m.label):[];
  const [selMeds,setSelMeds] = useState([]);
  const toggleM = m=>setSelMeds(prev=>prev.includes(m)?prev.filter(x=>x!==m):[...prev,m]);

  const medHealthData = useMemo(()=>{
    let patients=[...MOCK_PATIENTS];
    if(selMeds.length>0) patients=patients.filter(p=>p.medications.some(m=>selMeds.includes(m.name)));
    const medMap=new Map();
    patients.forEach(p=>{
      p.medications.forEach(med=>{
        if(!medMap.has(med.name)) medMap.set(med.name,{pts:[],symptomMap:new Map()});
        const entry=medMap.get(med.name);
        entry.pts.push(p);
        const syms=p.symptoms?p.symptoms.split(", "):[];
        syms.forEach(s=>entry.symptomMap.set(s,(entry.symptomMap.get(s)||0)+1));
      });
    });
    const result=[];
    for(const [medName,data] of medMap) {
      const symptoms=[];
      for(const [symptom,count] of data.symptomMap)
        symptoms.push({symptom,count,percentage:((count/data.pts.length)*100).toFixed(1)});
      symptoms.sort((a,b)=>b.count-a.count);
      result.push({medication:{name:medName},pts:data.pts,total_patients:data.pts.length,symptoms,percentage:((data.pts.length/MOCK_PATIENTS.length)*100).toFixed(1)});
    }
    return result;
  },[selMeds]);

  return (
    <div>
      <div style={S.pageHead}><h2 style={S.pageTitle}>Medication / Reported Health</h2><p style={S.pageSub}>For each medication, see the reported health outcomes and their frequency</p></div>
      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{flex:1,minWidth:240}}><TagSearch label="Drug name(s)" all={allMeds} selected={selMeds} onToggle={toggleM} searchPlaceholder="Filter by drug name…"/></div>
        </div>
      </div>
      {medHealthData.length===0 ? <div style={S.card}><div style={S.noData}>No data found</div></div> : (
        medHealthData.map((item,idx)=>(
          <div key={idx} style={S.card}>
            <p style={S.cardTitle}>
              <span><Chip label={item.medication.name} teal={true}/> <span style={{fontSize:12,color:"#94a3b8",fontWeight:400,marginLeft:6}}>{item.total_patients} patients ({item.percentage}% of total)</span></span>
            </p>
            <div style={S.barWrap}>
              {item.symptoms.map((o,i)=><HBar key={i} label={o.symptom} value={o.count} total={item.total_patients} pctVal={o.percentage} color="#f59e0b"/>)}
              {item.symptoms.length===0&&<div style={S.noData}>No reported symptoms for this medication</div>}
            </div>
            <div style={{marginTop:14}}>
              <AnonExpandPanel patients={item.pts} showSymptoms={true}/>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ============================================================
   7. CUSTOMIZE TABLE
   ============================================================ */
const FIELD_DEFS = [
  {key:"ref",           label:"Patient Ref"},
  {key:"ageGroup",      label:"Age Group"},
  {key:"gender",        label:"Gender"},
  {key:"conditions",    label:"Diseases",          isArr:true},
  {key:"meds",          label:"Medications",        isArr:true, teal:true},
  {key:"symptoms",      label:"Reported Health",    isArr:true},
];

function CustomizeTable({diseases,medicines,symptoms}) {
  const allDiseases = diseases?.length>0?diseases.map(d=>d.label):[];
  const allMeds     = medicines?.length>0?medicines.map(m=>m.label):[];
  const allSymptoms = symptoms?.length>0?symptoms.map(s=>s.label):[];

  const [selFields,      setSelFields]     = useState(["ref","ageGroup","gender","conditions","meds"]);
  const [filterDis,      setFilterDis]     = useState([]);
  const [filterMed,      setFilterMed]     = useState([]);
  const [filterSymptoms, setFilterSymptoms]= useState([]);
  const [ageGroup,       setAgeGroup]      = useState("All");
  const [gender,         setGender]        = useState("All");

  const toggleF = k=>setSelFields(prev=>prev.includes(k)?prev.filter(x=>x!==k):[...prev,k]);
  const toggleD = d=>setFilterDis(prev=>prev.includes(d)?prev.filter(x=>x!==d):[...prev,d]);
  const toggleM = m=>setFilterMed(prev=>prev.includes(m)?prev.filter(x=>x!==m):[...prev,m]);
  const toggleH = h=>setFilterSymptoms(prev=>prev.includes(h)?prev.filter(x=>x!==h):[...prev,h]);

  const filteredPatients = useMemo(()=>{
    let p=[...MOCK_PATIENTS];
    if(filterDis.length>0)     p=p.filter(pt=>pt.diseases.some(d=>filterDis.includes(d.name)));
    if(filterMed.length>0)     p=p.filter(pt=>pt.medications.some(m=>filterMed.includes(m.name)));
    if(filterSymptoms.length>0)p=p.filter(pt=>{const s=pt.symptoms?pt.symptoms.split(", "):[];return filterSymptoms.some(x=>s.includes(x));});
    if(ageGroup!=="All")       p=p.filter(pt=>AGE_GROUPS[ageGroup]?.(pt.age));
    if(gender!=="All")         p=p.filter(pt=>pt.gender===gender);
    return p;
  },[filterDis,filterMed,filterSymptoms,ageGroup,gender]);

  /* Anonymise for display */
  const rows = useMemo(()=>anonymise(filteredPatients),[filteredPatients]);

  const activeFilters=filterDis.length+filterMed.length+filterSymptoms.length+(ageGroup!=="All"?1:0)+(gender!=="All"?1:0);

  const cols = FIELD_DEFS.filter(f=>selFields.includes(f.key)).map(f=>({
    key:f.key, label:f.label, sortable:true,
    render:
      f.key==="ref"      ? r=><span style={S.refBadge}>{r.ref}</span>
      :f.key==="ageGroup"? r=><span style={S.ageGroupBadge}>{r.ageGroup}</span>
      :f.key==="gender"  ? r=><span style={S.badge(r.gender)}>{r.gender}</span>
      :f.isArr           ? r=>{
          const arr=r[f.key];
          if(!arr||arr.length===0) return <span style={{color:"#94a3b8"}}>—</span>;
          return f.teal?<MChips arr={arr}/>:<DChips arr={arr}/>;
        }
      :null
  }));

  return (
    <div>
      <div style={S.pageHead}><h2 style={S.pageTitle}>Customize Table</h2><p style={S.pageSub}>Build your own anonymous lookup — choose columns and stack filters to understand the data</p></div>
      <div style={S.filterBar}>
        <div style={{marginBottom:14}}>
          <span style={{...S.filterLabel,display:"block",marginBottom:8}}>Columns to display</span>
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            {FIELD_DEFS.map(f=>(
              <label key={f.key} style={S.checkLabel(selFields.includes(f.key))}>
                <input type="checkbox" checked={selFields.includes(f.key)} onChange={()=>toggleF(f.key)} style={{accentColor:ACCENT}}/>
                {f.label}
              </label>
            ))}
          </div>
        </div>
        <div style={{borderTop:"1px solid #eaecf2",margin:"12px 0"}}/>
        <div style={{...S.filterRow,alignItems:"flex-start"}}>
          <div style={{flex:1,minWidth:160}}><TagSearch label="Disease" all={allDiseases} selected={filterDis} onToggle={toggleD} searchPlaceholder="Filter by disease…"/></div>
          <div style={{flex:1,minWidth:160}}><TagSearch label="Medication" all={allMeds} selected={filterMed} onToggle={toggleM} searchPlaceholder="Filter by medication…"/></div>
          <div style={{flex:1,minWidth:160}}><TagSearch label="Reported Symptoms" all={allSymptoms} selected={filterSymptoms} onToggle={toggleH} searchPlaceholder="Filter by symptom…"/></div>
          <div style={{flex:1,minWidth:140}}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup}/></div>
          <div style={{flex:1,minWidth:140}}><GenderFilter value={gender} onChange={setGender}/></div>
        </div>
      </div>
      <div style={S.statRow}>
        <StatCard label="Matching Records" value={filteredPatients.length} sub={`${pct(filteredPatients.length,MOCK_PATIENTS.length)}% of total patients`}/>
        <StatCard label="Total Patients"   value={MOCK_PATIENTS.length}/>
        <StatCard label="Active Filters"   value={activeFilters}/>
      </div>
      {/* Global anonymisation notice */}
      {/* <div style={S.anonBanner}>
        <span style={{fontSize:15}}>🔒</span>
        <span><strong>Anonymous view.</strong> Patient names and exact ages are not shown. Each record is identified by an auto-generated reference number (P-001…) and age group only.</span>
      </div> */}
      <div style={S.card}>
        {cols.length===0 ? <div style={S.noData}>Select at least one column to display</div> : (
          <DataTable cols={cols} rows={rows} empty="No records match the selected filters"/>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   NAV CONFIG
   ============================================================ */
const NAV = [
  {section:"Patient Info"},
  {key:"demographics", label:"Demographics",                icon:<BsPeopleFill/>},
  {section:"Disease"},
  {key:"diseasedemo",  label:"Disease / Demographics",      icon:<PiHospitalFill/>},
  {key:"diseasemed",   label:"Disease / Medication",        icon:<GiMedicines/>},
  {section:"Drug Info"},
  {key:"meddemo",      label:"Medication / Demographics",   icon:<BsFillFileBarGraphFill/>},
  {key:"meddisease",   label:"Medication / Disease",        icon:<GiPillDrop/>},
  {key:"medhealth",    label:"Medication / Reported Health",icon:<FaStethoscope/>},
  {section:"Custom"},
  {key:"customize",    label:"Customize Table",             icon:<BiSolidCustomize/>},
];

/* ============================================================
   ROOT
   ============================================================ */
export default function AdminAnalytics() {
  const [active,         setActive]         = useState("demographics");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const sharedProps = {diseases:MOCK_DISEASES, medicines:MOCK_MEDICINES, symptoms:MOCK_SYMPTOMS};

  const VIEWS = {
    demographics: <Demographics/>,
    diseasedemo:  <DiseaseDemo   {...sharedProps}/>,
    diseasemed:   <DiseaseMedication {...sharedProps}/>,
    meddemo:      <MedicationDemo {...sharedProps}/>,
    meddisease:   <MedicationDisease {...sharedProps}/>,
    medhealth:    <MedicationHealth {...sharedProps}/>,
    customize:    <CustomizeTable {...sharedProps}/>,
  };

  return (
    <div style={S.wrap}>
      <nav style={S.nav}>
        <div style={S.navHead}>
          <div style={S.navTitle}>Analytics</div>
          <div style={S.navSub}>Admin · All Doctors</div>
        </div>
        {NAV.map((item,i)=>{
          if(item.section) return <div key={i} style={S.navGroup}>{item.section}</div>;
          const isActive=active===item.key;
          return (
            <div key={item.key} role="button" tabIndex={0} style={S.navItem(isActive)}
              onClick={()=>setActive(item.key)}
              onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")setActive(item.key);}}>
              <span style={{fontSize:15}}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>
      <main style={S.main}>
        <AdminDoctorBanner selectedDoctor={selectedDoctor} doctors={MOCK_DOCTORS} onChange={setSelectedDoctor}/>
        {VIEWS[active]}
      </main>
    </div>
  );
}