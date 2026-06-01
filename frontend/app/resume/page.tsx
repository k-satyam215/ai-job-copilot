"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>({
    current_ctc: "",
    expected_ctc: "Negotiable",
    notice_period: "Immediate",
    location: "India",
    relocation: "Yes",
    linkedin: "",
    portfolio: "",
    work_authorization: "Yes"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/auth/me").then((res) => {
      setPreferences((current: any) => ({ ...current, ...(res.data.preferences || {}) }));
      setProfile(res.data.profile);
    }).catch(() => {});
  }, []);

  async function upload() {
    if (!file) return;
    setLoading(true);
    setError("");
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await api.post("/resume/upload", data);
      setProfile(res.data.profile);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function savePreferences() {
    setError("");
    try {
      await api.put("/auth/preferences", preferences);
      alert("Copilot memory saved.");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not save preferences");
    }
  }

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <Navbar title="Resume Intelligence" />
        <section className="panel stack">
          <input className="input" type="file" accept=".pdf,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button className="button" onClick={upload} disabled={loading}>{loading ? "Parsing..." : "Upload & Parse"}</button>
          {error && <p style={{ color: "#fca5a5" }}>{error}</p>}
        </section>
        {profile && (
          <section className="panel" style={{ marginTop: 16 }}>
            <h2>AI Parsed Profile</h2>
            <p className="muted">{profile.summary}</p>
            <h3>Skills</h3>
            <div className="row">{(profile.skills || []).map((skill: string) => <span className="badge" key={skill}>{skill}</span>)}</div>
            <h3>Raw JSON</h3>
            <pre style={{ whiteSpace: "pre-wrap", color: "#cbd5e1" }}>{JSON.stringify(profile, null, 2)}</pre>
          </section>
        )}
        <section className="panel stack" style={{ marginTop: 16 }}>
          <h2>Copilot Memory</h2>
          <p className="muted">These values power Naukri/LinkedIn questions like CTC, notice period, relocation, and profile links.</p>
          <input className="input" placeholder="Current CTC" value={preferences.current_ctc || ""} onChange={(e) => setPreferences({ ...preferences, current_ctc: e.target.value })} />
          <input className="input" placeholder="Expected CTC" value={preferences.expected_ctc || ""} onChange={(e) => setPreferences({ ...preferences, expected_ctc: e.target.value })} />
          <input className="input" placeholder="Notice Period" value={preferences.notice_period || ""} onChange={(e) => setPreferences({ ...preferences, notice_period: e.target.value })} />
          <input className="input" placeholder="Current Location" value={preferences.location || ""} onChange={(e) => setPreferences({ ...preferences, location: e.target.value })} />
          <input className="input" placeholder="Relocation Preference" value={preferences.relocation || ""} onChange={(e) => setPreferences({ ...preferences, relocation: e.target.value })} />
          <input className="input" placeholder="LinkedIn URL" value={preferences.linkedin || ""} onChange={(e) => setPreferences({ ...preferences, linkedin: e.target.value })} />
          <input className="input" placeholder="Portfolio/GitHub URL" value={preferences.portfolio || ""} onChange={(e) => setPreferences({ ...preferences, portfolio: e.target.value })} />
          <button className="button" onClick={savePreferences}>Save Copilot Memory</button>
        </section>
      </main>
    </div>
  );
}
