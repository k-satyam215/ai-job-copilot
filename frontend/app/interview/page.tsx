"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

export default function InterviewPage() {
  const [role, setRole] = useState("AI Engineer");
  const [skillsInput, setSkillsInput] = useState("Python, FastAPI, LLM, Machine Learning");
  const [pack, setPack] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<"technical" | "behavioral" | "tips">("technical");

  async function generate() {
    if (!role.trim()) return;
    setLoading(true);
    setError("");
    setPack(null);
    try {
      const skills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await api.post("/analytics/interview", { title: role, skills });
      setPack(res.data);
      setActiveSection("technical");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to generate prep pack.");
    } finally {
      setLoading(false);
    }
  }

  const technicalQs: string[] = pack?.technical_questions || [];
  const behavioralQs: string[] = pack?.behavioral_questions || [];
  const tips: string[] = pack?.tips || pack?.preparation_tips || [];

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="page-main">
        <div className="page-header">
          <div className="page-title-block">
            <div className="page-eyebrow">AI Prep</div>
            <h1>Interview Agent</h1>
            <p>Generate a personalised interview prep pack for any role</p>
          </div>
        </div>

        {/* Generator Card */}
        <div className="card elevated" style={{ marginBottom: 20 }}>
          <div className="section-title" style={{ marginBottom: 14 }}>🎯 Generate Prep Pack</div>
          <div className="grid-2">
            <div className="field">
              <label className="field-label">Target Role *</label>
              <input
                className="input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior ML Engineer"
                onKeyDown={(e) => e.key === "Enter" && generate()}
              />
            </div>
            <div className="field">
              <label className="field-label">Your Skills (comma-separated)</label>
              <input
                className="input"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Python, TensorFlow, SQL, Docker"
                onKeyDown={(e) => e.key === "Enter" && generate()}
              />
            </div>
          </div>
          {error && <div className="error-msg" style={{ marginTop: 12 }}>⚠ {error}</div>}
          <button
            className="btn btn-primary"
            onClick={generate}
            disabled={loading}
            style={{ marginTop: 16 }}
          >
            {loading ? <><span className="spinner" /> Generating…</> : "🤖 Generate Prep Pack"}
          </button>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="stack">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: 64, borderRadius: 8 }} />
            ))}
          </div>
        )}

        {/* Results */}
        {pack && !loading && (
          <>
            <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, width: "fit-content" }}>
              {(["technical", "behavioral", "tips"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSection(tab)}
                  className={`auth-tab ${activeSection === tab ? "active" : ""}`}
                  style={{ minWidth: 130, textTransform: "capitalize" }}
                >
                  {tab === "technical" ? `💻 Technical (${technicalQs.length})` :
                   tab === "behavioral" ? `🧠 Behavioral (${behavioralQs.length})` :
                   `💡 Tips (${tips.length})`}
                </button>
              ))}
            </div>

            <div className="card elevated">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <div className="section-title">
                    {pack.role || role} — {activeSection === "technical" ? "Technical" : activeSection === "behavioral" ? "Behavioral" : "Preparation Tips"}
                  </div>
                  {pack.difficulty && (
                    <div style={{ marginTop: 4 }}>
                      <span className="badge badge-amber">Difficulty: {pack.difficulty}</span>
                    </div>
                  )}
                </div>
              </div>

              {activeSection === "technical" && (
                <div className="questions-list">
                  {technicalQs.length > 0 ? technicalQs.map((q, i) => (
                    <div key={i} className="question-item">
                      <div className="question-num">{i + 1}</div>
                      <div className="question-text">{q}</div>
                    </div>
                  )) : (
                    <div className="empty-state" style={{ padding: "20px 0" }}>
                      <div className="empty-desc">No technical questions generated.</div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === "behavioral" && (
                <div className="questions-list">
                  {behavioralQs.length > 0 ? behavioralQs.map((q, i) => (
                    <div key={i} className="question-item">
                      <div className="question-num" style={{ background: "rgba(124,92,252,0.12)", borderColor: "rgba(124,92,252,0.3)", color: "var(--accent2)" }}>{i + 1}</div>
                      <div className="question-text">{q}</div>
                    </div>
                  )) : (
                    <div className="empty-state" style={{ padding: "20px 0" }}>
                      <div className="empty-desc">No behavioral questions generated.</div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === "tips" && (
                <div className="stack">
                  {tips.length > 0 ? tips.map((tip, i) => (
                    <div key={i} className="notice info" style={{ alignItems: "flex-start" }}>
                      <span>💡</span>
                      <span style={{ fontSize: 13, color: "var(--text)" }}>{tip}</span>
                    </div>
                  )) : (
                    <div className="empty-state" style={{ padding: "20px 0" }}>
                      <div className="empty-desc">No tips available for this role.</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {!pack && !loading && (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">🎤</div>
              <div className="empty-title">Ready to prep?</div>
              <div className="empty-desc">
                Enter a target role and your skills above. The AI will generate role-specific technical questions, behavioral questions, and preparation tips.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
