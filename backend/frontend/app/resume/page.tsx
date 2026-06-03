"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

const PREF_FIELDS = [
  { key: "current_ctc", label: "Current CTC", placeholder: "e.g. 8 LPA" },
  { key: "expected_ctc", label: "Expected CTC", placeholder: "e.g. 12 LPA or Negotiable" },
  { key: "notice_period", label: "Notice Period", placeholder: "e.g. Immediate / 30 days" },
  { key: "location", label: "Current Location", placeholder: "e.g. Bengaluru, India" },
  { key: "relocation", label: "Open to Relocation?", placeholder: "Yes / No / Maybe" },
  { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/yourname" },
  { key: "portfolio", label: "Portfolio / GitHub", placeholder: "https://github.com/yourname" },
  { key: "telegram_chat_id", label: "Telegram Chat ID", placeholder: "For job alerts" },
  { key: "whatsapp_phone", label: "WhatsApp Phone", placeholder: "+91 98765 43210" },
];

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "prefs">("profile");

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        setPreferences(res.data.preferences || {});
        setProfile(res.data.profile);
      })
      .catch(() => {});
  }, []);

  async function upload() {
    if (!file) return;
    setUploading(true);
    setError("");
    setUploadMsg("");
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await api.post("/resume/upload", data);
      setProfile(res.data.profile);
      setUploadMsg("✓ Resume parsed successfully!");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  async function savePreferences() {
    setSaving(true);
    setSaveMsg("");
    setError("");
    try {
      await api.put("/auth/preferences", preferences);
      setSaveMsg("✓ Copilot memory saved!");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not save preferences.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="page-main">
        <div className="page-header">
          <div className="page-title-block">
            <div className="page-eyebrow">Profile</div>
            <h1>Resume Intelligence</h1>
            <p>Upload your resume and configure your copilot's memory</p>
          </div>
        </div>

        {/* Upload Card */}
        <div className="card elevated" style={{ marginBottom: 20 }}>
          <div className="section-title" style={{ marginBottom: 14 }}>📤 Upload Resume</div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div className="field" style={{ flex: 1, minWidth: 220 }}>
              <label className="field-label">PDF or TXT file</label>
              <input
                className="input"
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => { setFile(e.target.files?.[0] || null); setUploadMsg(""); setError(""); }}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={upload}
              disabled={uploading || !file}
              style={{ marginBottom: 0 }}
            >
              {uploading ? <><span className="spinner" /> Parsing…</> : "Upload & Parse"}
            </button>
          </div>
          {uploadMsg && <div className="notice success" style={{ marginTop: 12 }}>{uploadMsg}</div>}
          {error && <div className="error-msg" style={{ marginTop: 12 }}>⚠ {error}</div>}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {(["profile", "prefs"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`auth-tab ${activeTab === tab ? "active" : ""}`}
              style={{ minWidth: 140 }}
            >
              {tab === "profile" ? "📊 Parsed Profile" : "⚙️ Copilot Memory"}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          profile ? (
            <div className="card elevated">
              {/* Summary */}
              <div style={{ marginBottom: 20 }}>
                <div className="section-title" style={{ marginBottom: 8 }}>Professional Summary</div>
                <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.8 }}>{profile.summary || "No summary extracted."}</p>
              </div>

              {/* Skills */}
              {profile.skills?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div className="section-title" style={{ marginBottom: 10 }}>Skills ({profile.skills.length})</div>
                  <div className="row">
                    {profile.skills.map((s: string) => (
                      <span key={s} className="badge badge-blue">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {profile.experience?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div className="section-title" style={{ marginBottom: 10 }}>Experience</div>
                  <div className="stack">
                    {profile.experience.map((exp: any, i: number) => (
                      <div key={i} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid var(--border)" }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{exp.title} — {exp.company}</div>
                        <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>{exp.duration}</div>
                        {exp.description && <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>{exp.description}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {profile.education?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div className="section-title" style={{ marginBottom: 10 }}>Education</div>
                  <div className="stack">
                    {profile.education.map((edu: any, i: number) => (
                      <div key={i} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid var(--border)" }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{edu.degree} — {edu.institution}</div>
                        <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>{edu.year}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw JSON (collapsible) */}
              <details style={{ marginTop: 4 }}>
                <summary style={{ fontSize: 12, color: "var(--text-3)", cursor: "pointer", userSelect: "none" }}>
                  View raw JSON
                </summary>
                <pre className="profile-json" style={{ marginTop: 8 }}>{JSON.stringify(profile, null, 2)}</pre>
              </details>
            </div>
          ) : (
            <div className="card">
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <div className="empty-title">No resume uploaded yet</div>
                <div className="empty-desc">Upload a PDF or TXT file above to see your AI-parsed profile here.</div>
              </div>
            </div>
          )
        )}

        {/* Prefs Tab */}
        {activeTab === "prefs" && (
          <div className="card elevated">
            <div className="section-title" style={{ marginBottom: 4 }}>⚙️ Copilot Memory</div>
            <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 20 }}>
              These values are auto-filled by the Chrome extension when applying on Naukri, LinkedIn, etc.
            </p>
            <div className="grid-2">
              {PREF_FIELDS.map(({ key, label, placeholder }) => (
                <div className="field" key={key}>
                  <label className="field-label">{label}</label>
                  <input
                    className="input"
                    placeholder={placeholder}
                    value={preferences[key] || ""}
                    onChange={(e) => setPreferences({ ...preferences, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            {saveMsg && <div className="notice success" style={{ marginTop: 16 }}>{saveMsg}</div>}
            {error && <div className="error-msg" style={{ marginTop: 12 }}>⚠ {error}</div>}
            <button
              className="btn btn-primary"
              onClick={savePreferences}
              disabled={saving}
              style={{ marginTop: 20 }}
            >
              {saving ? <><span className="spinner" /> Saving…</> : "💾 Save Copilot Memory"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
