import { useState } from "react";
import { useNavigate } from "react-router-dom";

const APPOINTMENT_TYPES = ["General Checkup","Dental Cleaning","Physical Therapy","Chiropractic Adjustment","Med Spa Treatment","Post-Surgery Follow-up","Lab Results Review","Specialist Consultation"];
const INSURANCE_TYPES = ["Blue Cross Blue Shield","Aetna","UnitedHealthcare","Cigna","Humana","Medicare","Medicaid","Tricare","Other"];
const PROCEDURE_TYPES = ["MRI","CT Scan","Physical Therapy (10 sessions)","Chiropractic Care","Surgery - Orthopedic","Surgery - General","Colonoscopy","Epidural Steroid Injection","Custom"];

const TOOLS = [
  { id: "followup", label: "Follow-Up", icon: "✉", desc: "Generate patient follow-up messages" },
  { id: "intake",   label: "Intake",    icon: "📋", desc: "Summarize patient intake forms" },
  { id: "auth",     label: "Pre-Auth",  icon: "🛡", desc: "Draft insurance pre-authorization letters" },
];

async function callClaude(prompt) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await response.json();
  return data.content?.map((b) => b.text || "").join("").trim();
}

function OutputBox({ result, onReset }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={s.outputBox}>
      <div style={s.outputHeader}>
        <span style={s.outputLabel}>AI Output</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={s.copyBtn} onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
          <button style={s.resetBtn} onClick={onReset}>New</button>
        </div>
      </div>
      <p style={s.outputText}>{result}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
      <label style={s.label}>{label}</label>
      {children}
    </div>
  );
}

function Input({ placeholder = "", type = "text", value, onChange }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={s.input}
      onFocus={e => { e.target.style.borderColor = "#1a3a2a"; e.target.style.boxShadow = "0 0 0 3px rgba(26,58,42,0.08)"; }}
      onBlur={e => { e.target.style.borderColor = "#e0d8cc"; e.target.style.boxShadow = "none"; }}
    />
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={onChange} style={{ ...s.input, color: value ? "#1c1c1c" : "#9ca3af" }}
      onFocus={e => { e.target.style.borderColor = "#1a3a2a"; }}
      onBlur={e => { e.target.style.borderColor = "#e0d8cc"; }}
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3} style={s.textarea}
      onFocus={e => { e.target.style.borderColor = "#1a3a2a"; e.target.style.boxShadow = "0 0 0 3px rgba(26,58,42,0.08)"; }}
      onBlur={e => { e.target.style.borderColor = "#e0d8cc"; e.target.style.boxShadow = "none"; }}
    />
  );
}

function GenerateBtn({ onClick, loading, disabled, label = "Generate Message" }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...s.generateBtn, opacity: disabled ? 0.45 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
      {loading ? (
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span style={s.pulseDot} /> Generating...
        </span>
      ) : label}
    </button>
  );
}

function FollowUpTool() {
  const [form, setForm] = useState({ patientName: "", providerName: "", appointmentType: "", appointmentDate: "", tone: "Warm & Friendly", notes: "" });
  const [result, setResult] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const valid = form.patientName && form.providerName && form.appointmentType && form.appointmentDate;
  const generate = async () => {
    setLoading(true); setError(""); setResult("");
    try {
      const text = await callClaude(`Write a patient follow-up message. Patient: ${form.patientName} | Provider: ${form.providerName} | Appointment: ${form.appointmentType} on ${form.appointmentDate} | Tone: ${form.tone} | Notes: ${form.notes || "none"}. 3-5 sentences. Thank the patient, reference appointment, encourage questions, prompt rebooking. Output message only.`);
      setResult(text);
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };
  if (result) return <OutputBox result={result} onReset={() => setResult("")} />;
  return (
    <div style={s.toolForm}>
      <div style={s.twoCol}>
        <Field label="Patient Name"><Input value={form.patientName} onChange={e => setForm({...form, patientName: e.target.value})} placeholder="Sarah Johnson" /></Field>
        <Field label="Provider Name"><Input value={form.providerName} onChange={e => setForm({...form, providerName: e.target.value})} placeholder="Dr. Ramirez" /></Field>
      </div>
      <div style={s.twoCol}>
        <Field label="Appointment Type"><Select value={form.appointmentType} onChange={e => setForm({...form, appointmentType: e.target.value})} options={APPOINTMENT_TYPES} placeholder="Select type..." /></Field>
        <Field label="Appointment Date"><Input type="date" value={form.appointmentDate} onChange={e => setForm({...form, appointmentDate: e.target.value})} /></Field>
      </div>
      <Field label="Tone">
        <div style={s.toneRow}>
          {["Warm & Friendly","Professional","Brief & Direct"].map(t => (
            <button key={t} style={form.tone === t ? s.toneActive : s.toneBtn} onClick={() => setForm({...form, tone: t})}>{t}</button>
          ))}
        </div>
      </Field>
      <Field label="Notes (optional)"><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Any special context for this patient..." /></Field>
      {error && <div style={s.errorBox}>{error}</div>}
      <GenerateBtn onClick={generate} loading={loading} disabled={!valid || loading} />
    </div>
  );
}

function IntakeTool() {
  const [form, setForm] = useState({ patientName: "", dob: "", chiefComplaint: "", symptoms: "", medications: "", allergies: "", history: "" });
  const [result, setResult] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const valid = form.patientName && form.chiefComplaint && form.symptoms;
  const generate = async () => {
    setLoading(true); setError(""); setResult("");
    try {
      const text = await callClaude(`Summarize this patient intake for a provider chart note. Patient: ${form.patientName} | DOB: ${form.dob || "not provided"} | Age: ${form.dob ? (() => { const dob = new Date(form.dob); const today = new Date(); let age = today.getFullYear() - dob.getFullYear(); if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) age--; return age; })() : "unknown"} | Chief Complaint: ${form.chiefComplaint} | Symptoms: ${form.symptoms} | Medications: ${form.medications || "none"} | Allergies: ${form.allergies || "none"} | History: ${form.history || "none"}. Write a concise clinical-style summary (4-6 sentences). Professional, structured. Output summary only.`);
      setResult(text);
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };
  if (result) return <OutputBox result={result} onReset={() => setResult("")} />;
  return (
    <div style={s.toolForm}>
      <div style={s.twoCol}>
        <Field label="Patient Name"><Input value={form.patientName} onChange={e => setForm({...form, patientName: e.target.value})} placeholder="John Smith" /></Field>
        <Field label="Date of Birth"><Input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} /></Field>
      </div>
      <Field label="Chief Complaint"><Input value={form.chiefComplaint} onChange={e => setForm({...form, chiefComplaint: e.target.value})} placeholder="e.g. Lower back pain for 3 weeks" /></Field>
      <Field label="Symptoms"><Textarea value={form.symptoms} onChange={e => setForm({...form, symptoms: e.target.value})} placeholder="Describe symptoms, onset, severity, duration..." /></Field>
      <div style={s.twoCol}>
        <Field label="Current Medications"><Input value={form.medications} onChange={e => setForm({...form, medications: e.target.value})} placeholder="e.g. Lisinopril 10mg" /></Field>
        <Field label="Allergies"><Input value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} placeholder="e.g. Penicillin" /></Field>
      </div>
      <Field label="Medical History"><Textarea value={form.history} onChange={e => setForm({...form, history: e.target.value})} placeholder="Past surgeries, chronic conditions..." /></Field>
      {error && <div style={s.errorBox}>{error}</div>}
      <GenerateBtn onClick={generate} loading={loading} disabled={!valid || loading} label="Summarize Intake" />
    </div>
  );
}

function PreAuthTool() {
  const [form, setForm] = useState({ patientName: "", dob: "", insuranceType: "", memberId: "", providerName: "", npi: "", procedure: "", diagnosis: "", clinicalNotes: "" });
  const [result, setResult] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const valid = form.patientName && form.insuranceType && form.procedure && form.diagnosis;
  const generate = async () => {
    setLoading(true); setError(""); setResult("");
    try {
      const text = await callClaude(`Draft a professional insurance pre-authorization letter. Patient: ${form.patientName} | DOB: ${form.dob || "on file"} | Insurance: ${form.insuranceType} | Member ID: ${form.memberId || "on file"} | Provider: ${form.providerName || "on file"} | NPI: ${form.npi || "on file"} | Procedure: ${form.procedure} | Diagnosis: ${form.diagnosis} | Clinical Notes: ${form.clinicalNotes || "see attached"}. Write a formal pre-auth letter with clinical justification, medical necessity, and request for expedited review. Output letter only.`);
      setResult(text);
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };
  if (result) return <OutputBox result={result} onReset={() => setResult("")} />;
  return (
    <div style={s.toolForm}>
      <div style={s.twoCol}>
        <Field label="Patient Name"><Input value={form.patientName} onChange={e => setForm({...form, patientName: e.target.value})} placeholder="Maria Garcia" /></Field>
        <Field label="Date of Birth"><Input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} /></Field>
      </div>
      <div style={s.twoCol}>
        <Field label="Insurance Provider"><Select value={form.insuranceType} onChange={e => setForm({...form, insuranceType: e.target.value})} options={INSURANCE_TYPES} placeholder="Select insurer..." /></Field>
        <Field label="Member ID"><Input value={form.memberId} onChange={e => setForm({...form, memberId: e.target.value})} placeholder="XYZ123456789" /></Field>
      </div>
      <div style={s.twoCol}>
        <Field label="Requesting Provider"><Input value={form.providerName} onChange={e => setForm({...form, providerName: e.target.value})} placeholder="Dr. Thompson" /></Field>
        <Field label="NPI Number"><Input value={form.npi} onChange={e => setForm({...form, npi: e.target.value})} placeholder="1234567890" /></Field>
      </div>
      <Field label="Requested Procedure"><Select value={form.procedure} onChange={e => setForm({...form, procedure: e.target.value})} options={PROCEDURE_TYPES} placeholder="Select procedure..." /></Field>
      <Field label="Diagnosis / ICD-10 Code"><Input value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} placeholder="e.g. M54.5 - Low back pain" /></Field>
      <Field label="Clinical Justification"><Textarea value={form.clinicalNotes} onChange={e => setForm({...form, clinicalNotes: e.target.value})} placeholder="Why is this procedure medically necessary?" /></Field>
      {error && <div style={s.errorBox}>{error}</div>}
      <GenerateBtn onClick={generate} loading={loading} disabled={!valid || loading} label="Draft Pre-Auth Letter" />
    </div>
  );
}

export default function Dashboard() {
  const [activeTool, setActiveTool] = useState("followup");
  const navigate = useNavigate();
  const active = TOOLS.find(t => t.id === activeTool);

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: #9ca3af; font-family: 'Sora', sans-serif; font-size: 13px; }
        select option { color: #1c1c1c; }
        textarea { resize: vertical; }
        .nav-tab { transition: all 0.2s ease; }
        .nav-tab:hover { background: rgba(255,255,255,0.08) !important; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.35s ease forwards; }
        @media(max-width:700px) {
          .dash-layout { flex-direction: column !important; }
          .sidebar { width: 100% !important; height: auto !important; position: relative !important; flex-direction: row !important; flex-wrap: wrap; padding: 16px !important; }
          .two-col-inner { flex-direction: column !important; }
        }
      `}</style>

      <div className="dash-layout" style={s.layout}>
        {/* Sidebar */}
        <aside className="sidebar" style={s.sidebar}>
          <div style={s.sidebarTop}>
            <div style={s.logo}>
              <div style={s.logoMark}>+</div>
              <span style={s.logoText}>CareReach</span>
            </div>
            <p style={s.sidebarTagline}>AI for Healthcare Practices</p>
          </div>
          <nav style={s.nav}>
            <p style={s.navSection}>Tools</p>
            {TOOLS.map(tool => (
              <button key={tool.id} className="nav-tab" onClick={() => setActiveTool(tool.id)}
                style={activeTool === tool.id ? s.navItemActive : s.navItem}>
                <span style={s.navIcon}>{tool.icon}</span>
                <div>
                  <div style={s.navLabel}>{tool.label}</div>
                  <div style={s.navDesc}>{tool.desc}</div>
                </div>
              </button>
            ))}
          </nav>
          <div style={s.sidebarFooter}>
            <div style={s.planBadge}><span style={s.planDot} />Pro Plan — $399/mo</div>
            <p style={s.practiceName}>Riverside Family Clinic</p>
            <button onClick={() => navigate("/")} style={s.backBtn}>← Back to site</button>
          </div>
        </aside>

        {/* Main */}
        <main style={s.main}>
          <div style={s.topBar}>
            <div>
              <h1 style={s.pageTitle}>{active.label} Generator</h1>
              <p style={s.pageDesc}>{active.desc}</p>
            </div>
            <div style={s.statRow}>
              <div style={s.stat}><div style={s.statNum}>247</div><div style={s.statLabel}>Generated</div></div>
              <div style={s.stat}><div style={s.statNum}>3.2h</div><div style={s.statLabel}>Saved today</div></div>
            </div>
          </div>

          <div key={activeTool} className="fade-up" style={s.card}>
            {activeTool === "followup" && <FollowUpTool />}
            {activeTool === "intake"   && <IntakeTool />}
            {activeTool === "auth"     && <PreAuthTool />}
          </div>

          <div style={s.tip}>
            💡 <strong>Tip:</strong>{" "}
            {activeTool === "followup" && "Personalized follow-ups increase patient retention by up to 40%."}
            {activeTool === "intake" && "AI summaries help providers spend more time with patients, less time reading forms."}
            {activeTool === "auth" && "Pre-auth letters generated here are formatted to meet standard payer requirements."}
          </div>
        </main>
      </div>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "#f0ece3", fontFamily: "'Sora', sans-serif" },
  layout: { display: "flex", minHeight: "100vh" },
  sidebar: { width: 240, background: "#0f2218", display: "flex", flexDirection: "column", padding: "28px 0", position: "sticky", top: 0, height: "100vh", flexShrink: 0 },
  sidebarTop: { padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" },
  logo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  logoMark: { width: 32, height: 32, background: "#4ade80", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#0f2218" },
  logoText: { fontFamily: "'Lora', serif", fontSize: 18, color: "#f0ece3", fontWeight: 600 },
  sidebarTagline: { fontSize: 11, color: "#5a8a6a", letterSpacing: "0.5px", textTransform: "uppercase" },
  nav: { flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4 },
  navSection: { fontSize: 10, color: "#3a6a4a", letterSpacing: "1px", textTransform: "uppercase", padding: "0 8px", marginBottom: 6 },
  navItem: { display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", textAlign: "left", width: "100%" },
  navItemActive: { display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 12px", borderRadius: 10, border: "none", background: "rgba(74,222,128,0.12)", cursor: "pointer", textAlign: "left", width: "100%" },
  navIcon: { fontSize: 16, marginTop: 1 },
  navLabel: { fontSize: 13, fontWeight: 600, color: "#e8e4dc", marginBottom: 2 },
  navDesc: { fontSize: 11, color: "#5a7a68", lineHeight: 1.4 },
  sidebarFooter: { padding: "20px", borderTop: "1px solid rgba(255,255,255,0.07)" },
  planBadge: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#4ade80", fontWeight: 600, marginBottom: 4 },
  planDot: { width: 6, height: 6, background: "#4ade80", borderRadius: "50%", display: "inline-block" },
  practiceName: { fontSize: 12, color: "#5a7a68", marginBottom: 12 },
  backBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 12px", fontSize: 11, color: "rgba(240,236,227,0.4)", cursor: "pointer", fontFamily: "'Sora', sans-serif", transition: "all 0.15s" },
  main: { flex: 1, padding: "32px 28px", maxWidth: 760, overflowY: "auto" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 },
  pageTitle: { fontFamily: "'Lora', serif", fontSize: 26, color: "#1a1a1a", fontWeight: 600, marginBottom: 4 },
  pageDesc: { fontSize: 13, color: "#7a7268" },
  statRow: { display: "flex", gap: 20 },
  stat: { textAlign: "right" },
  statNum: { fontFamily: "'Lora', serif", fontSize: 22, color: "#1a3a2a", fontWeight: 600 },
  statLabel: { fontSize: 11, color: "#9a9288", textTransform: "uppercase", letterSpacing: "0.5px" },
  card: { background: "#ffffff", borderRadius: 16, border: "1px solid #e5ddd0", boxShadow: "0 2px 24px rgba(26,58,42,0.06)", padding: "28px 28px 32px", marginBottom: 16 },
  toolForm: { display: "flex", flexDirection: "column", gap: 18 },
  twoCol: { display: "flex", gap: 16, flexWrap: "wrap" },
  label: { fontSize: 12, fontWeight: 600, color: "#3a3530", letterSpacing: "0.2px" },
  input: { border: "1.5px solid #e0d8cc", borderRadius: 10, padding: "11px 14px", fontSize: 13, color: "#1c1c1c", background: "#fdfcfa", fontFamily: "'Sora', sans-serif", width: "100%", transition: "border-color 0.15s, box-shadow 0.15s" },
  textarea: { border: "1.5px solid #e0d8cc", borderRadius: 10, padding: "11px 14px", fontSize: 13, color: "#1c1c1c", background: "#fdfcfa", fontFamily: "'Sora', sans-serif", width: "100%", lineHeight: 1.6, transition: "border-color 0.15s, box-shadow 0.15s" },
  toneRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  toneBtn: { border: "1.5px solid #d8d0c4", background: "transparent", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 500, color: "#7a7268", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  toneActive: { border: "1.5px solid #1a3a2a", background: "#1a3a2a", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 500, color: "#f0ece3", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  generateBtn: { background: "#1a3a2a", color: "#f0ece3", border: "none", borderRadius: 10, padding: "14px 28px", fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 600, width: "100%", transition: "all 0.2s ease" },
  pulseDot: { width: 8, height: 8, background: "#4ade80", borderRadius: "50%", display: "inline-block", animation: "pulse 1.4s ease-in-out infinite" },
  outputBox: { background: "#f7faf8", border: "1.5px solid #b8ddc8", borderRadius: 12, overflow: "hidden" },
  outputHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: "1px solid #d4eddf", background: "#edf7f1" },
  outputLabel: { fontSize: 11, fontWeight: 700, color: "#1a3a2a", textTransform: "uppercase", letterSpacing: "0.8px" },
  outputText: { padding: "18px 20px", fontSize: 14, color: "#2d2d2d", lineHeight: 1.8 },
  copyBtn: { background: "#e8f5ee", color: "#1a3a2a", border: "1.5px solid #b8ddc8", borderRadius: 8, padding: "8px 16px", fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  resetBtn: { background: "transparent", color: "#9ca3af", border: "1.5px solid #e5e0d8", borderRadius: 8, padding: "8px 16px", fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 500, cursor: "pointer" },
  errorBox: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#dc2626" },
  tip: { fontSize: 13, color: "#7a7268", background: "#faf7f2", border: "1px solid #e8e0d0", borderRadius: 10, padding: "12px 16px", lineHeight: 1.6 },
};
