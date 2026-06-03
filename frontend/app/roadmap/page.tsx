"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

const DURATION_OPTIONS = ["4 weeks", "8 weeks", "12 weeks", "16 weeks", "6 months"];

export default function RoadmapPage() {
  const [targetRole,  setTargetRole]  = useState("AI Engineer");
  const [duration,    setDuration]    = useState("8 weeks");
  const [roadmap,     setRoadmap]     = useState<any>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [activeWeek,  setActiveWeek]  = useState<number | null>(null);

  async function generate() {
    if (!targetRole.trim()) return;
    setLoading(true);
    setError("");
    setRoadmap(null);
    try {
      const res = await api.post("/analytics/roadmap", {
        target_role: targetRole,
        duration,
      });
      setRoadmap(res.data);
      setActiveWeek(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  }

  const items: any[] = roadmap?.roadmap || [];

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="page-main">

        {/* Header */}
        <div className="page-header">
          <div className="page-title-block">
            <div className="page-eyebrow">Career Growth</div>
            <h1>Career Roadmap</h1>
            <p>AI-generated week-by-week learning plan to reach your target role</p>
          </div>
        </div>

        {/* Generator */}
        <div className="card elevated" style={{ marginBottom: 24 }}>
          <div className="section-title" style={{ marginBottom: 14 }}>🎯 Generate Your Roadmap</div>
          <div className="grid-2">
            <div className="field">
              <label className="field-label">Target Role *</label>
              <input
                className="input"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior ML Engineer, Full Stack Dev"
                onKeyDown={(e) => e.key === "Enter" && generate()}
              />
            </div>
            <div className="field">
              <label className="field-label">Duration</label>
              <select
                className="input"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{ cursor: "pointer" }}
              >
                {DURATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          {error && <div className="error-msg" style={{ marginTop: 12 }}>⚠ {error}</div>}
          <button
            className="btn btn-primary"
            onClick={generate}
            disabled={loading}
            style={{ marginTop: 16 }}
          >
            {loading ? <><span className="spinner" /> Building roadmap…</> : "🗺️ Build My Roadmap"}
          </button>
        </div>

        {/* Skeleton while loading */}
        {loading && (
          <div className="roadmap-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="roadmap-item">
                <div className="skeleton" style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0 }} />
                <div className="skeleton" style={{ flex: 1, height: 80, borderRadius: 12 }} />
              </div>
            ))}
          </div>
        )}

        {/* Roadmap */}
        {roadmap && !loading && (
          <>
            {/* Summary bar */}
            <div className="card elevated" style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                <div>
                  <div className="section-title">{roadmap.title || `${targetRole} Roadmap`}</div>
                  {roadmap.summary && (
                    <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>{roadmap.summary}</p>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="badge badge-blue">{items.length} weeks</span>
                  {roadmap.difficulty && <span className="badge badge-amber">{roadmap.difficulty}</span>}
                </div>
              </div>

              {/* Progress bar (expandable weeks) */}
              {items.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: "flex", gap: 3 }}>
                    {items.map((_: any, i: number) => (
                      <div
                        key={i}
                        title={`Week ${i + 1}`}
                        onClick={() => setActiveWeek(activeWeek === i ? null : i)}
                        style={{
                          flex: 1,
                          height: 6,
                          borderRadius: 99,
                          background: activeWeek === i ? "var(--accent)" : "rgba(255,255,255,0.08)",
                          cursor: "pointer",
                          transition: "background 0.2s",
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 6 }}>
                    Click a segment to highlight a week
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="roadmap-grid">
              {items.map((item: any, i: number) => {
                const isActive = activeWeek === i;
                return (
                  <div
                    key={item.week ?? i}
                    className="roadmap-item"
                    onClick={() => setActiveWeek(isActive ? null : i)}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="roadmap-dot"
                      style={isActive ? { background: "linear-gradient(135deg, var(--green), var(--accent))", boxShadow: "0 0 16px rgba(34,211,160,0.4)" } : {}}
                    >
                      {item.week ?? i + 1}
                    </div>
                    <div
                      className="roadmap-content"
                      style={isActive ? { border: "1px solid rgba(79,138,255,0.35)", background: "rgba(79,138,255,0.05)" } : {}}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700 }}>{item.focus}</h3>
                        {item.hours && (
                          <span className="badge badge-neutral" style={{ flexShrink: 0 }}>{item.hours}h/wk</span>
                        )}
                      </div>

                      {item.description && (
                        <p style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 8, lineHeight: 1.6 }}>{item.description}</p>
                      )}

                      {/* Outputs */}
                      {(item.outputs || []).length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: item.resources ? 10 : 0 }}>
                          {item.outputs.map((o: string) => (
                            <span key={o} className="badge badge-blue" style={{ fontSize: "10px" }}>{o}</span>
                          ))}
                        </div>
                      )}

                      {/* Resources (shown when active) */}
                      {isActive && item.resources?.length > 0 && (
                        <div style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                            Resources
                          </div>
                          <div className="stack" style={{ gap: 4 }}>
                            {item.resources.map((r: string, ri: number) => (
                              <div key={ri} style={{ fontSize: 12, color: "var(--text-2)", display: "flex", gap: 6 }}>
                                <span style={{ color: "var(--accent)", flexShrink: 0 }}>→</span> {r}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Skills covered */}
            {roadmap.skills_covered?.length > 0 && (
              <div className="card elevated" style={{ marginTop: 20 }}>
                <div className="section-title" style={{ marginBottom: 12 }}>🛠️ Skills You'll Learn</div>
                <div className="row">
                  {roadmap.skills_covered.map((s: string) => (
                    <span key={s} className="badge badge-green">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!roadmap && !loading && (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">🗺️</div>
              <div className="empty-title">No roadmap generated yet</div>
              <div className="empty-desc">
                Enter a target role above. The AI will build a personalised week-by-week plan with topics, deliverables, and learning resources.
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
