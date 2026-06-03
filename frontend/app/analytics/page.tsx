"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [gaps, setGaps] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/analytics/overview").then((res) => setOverview(res.data)).catch(() => {}),
      api.get("/analytics/skill-gaps").then((res) => setGaps(res.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const maxDemand = Math.max(...(gaps?.missing_skills || []).map((g: any) => g.demand || 0), 1);
  const statusData = overview?.applications_by_status || {};
  const totalApps = overview?.total_applications || 0;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="page-main">
        <div className="page-header">
          <div className="page-title-block">
            <div className="page-eyebrow">Insights</div>
            <h1>Career Analytics</h1>
            <p>Data-driven view of your job search performance</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-grid">
          <div className="stat-card">
            {loading ? <div className="skeleton" style={{ height: 36, width: 60, marginBottom: 8 }} /> : (
              <div className="stat-value">{overview?.total_applications ?? 0}</div>
            )}
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            {loading ? <div className="skeleton" style={{ height: 36, width: 80, marginBottom: 8 }} /> : (
              <div className="stat-value" style={{ color: "var(--accent)" }}>{overview?.average_match_score ?? 0}%</div>
            )}
            <div className="stat-label">Avg Match Score</div>
          </div>
          <div className="stat-card">
            {loading ? <div className="skeleton" style={{ height: 36, width: 60, marginBottom: 8 }} /> : (
              <div className="stat-value" style={{ color: "var(--green)" }}>{overview?.interview_rate ?? 0}%</div>
            )}
            <div className="stat-label">Interview Rate</div>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: 20 }}>
          {/* Application Funnel */}
          <div className="card elevated">
            <div className="section-header">
              <div className="section-title">📊 Application Funnel</div>
            </div>
            {Object.keys(statusData).length > 0 ? (
              <div className="stack">
                {Object.entries(statusData).map(([status, count]: any) => {
                  const pct = totalApps > 0 ? Math.round((count / totalApps) * 100) : 0;
                  const colors: Record<string, string> = {
                    applied: "var(--accent)",
                    interview: "var(--accent2)",
                    offer: "var(--green)",
                    rejected: "var(--red)",
                  };
                  const color = colors[status.toLowerCase()] || "var(--text-3)";
                  return (
                    <div key={status} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ minWidth: 72, fontSize: 12, color: "var(--text-2)", textTransform: "capitalize" }}>{status}</div>
                      <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.6s ease" }} />
                      </div>
                      <div style={{ minWidth: 36, fontSize: 12, color: "var(--text-2)", textAlign: "right" }}>{count}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: "20px 0" }}>
                <div className="empty-icon">📊</div>
                <div className="empty-desc">No application data yet</div>
              </div>
            )}
          </div>

          {/* Top Platforms */}
          <div className="card elevated">
            <div className="section-header">
              <div className="section-title">🌐 Platform Breakdown</div>
            </div>
            {overview?.by_platform && Object.keys(overview.by_platform).length > 0 ? (
              <div className="stack">
                {Object.entries(overview.by_platform).map(([platform, count]: any) => {
                  const pct = totalApps > 0 ? Math.round((count / totalApps) * 100) : 0;
                  return (
                    <div key={platform} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ minWidth: 80, fontSize: 12, color: "var(--text-2)", textTransform: "capitalize" }}>{platform}</div>
                      <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", borderRadius: 99 }} />
                      </div>
                      <div style={{ minWidth: 36, fontSize: 12, color: "var(--text-2)", textAlign: "right" }}>{count}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: "20px 0" }}>
                <div className="empty-icon">🌐</div>
                <div className="empty-desc">Platform data unavailable</div>
              </div>
            )}
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="card elevated">
          <div className="section-header">
            <div>
              <div className="section-title">🚨 Skill Gaps</div>
              <div className="section-subtitle">Skills frequently required in jobs you're missing</div>
            </div>
            {gaps?.missing_skills?.length > 0 && (
              <span className="badge badge-amber">{gaps.missing_skills.length} gaps found</span>
            )}
          </div>

          {gaps?.missing_skills?.length > 0 ? (
            <div>
              {gaps.missing_skills.map((gap: any) => (
                <div key={gap.skill} className="skill-gap-item">
                  <div className="skill-gap-name">{gap.skill}</div>
                  <div className="skill-gap-bar-track">
                    <div
                      className="skill-gap-bar-fill"
                      style={{ width: `${Math.round((gap.demand / maxDemand) * 100)}%` }}
                    />
                  </div>
                  <div className="skill-gap-count">{gap.demand} jobs</div>
                </div>
              ))}
              <div className="notice warn" style={{ marginTop: 16 }}>
                💡 Focus on top 3 skills to significantly boost your match scores.
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: "20px 0" }}>
              <div className="empty-icon">🎉</div>
              <div className="empty-title">No skill gaps detected</div>
              <div className="empty-desc">Upload your resume and discover jobs to see your gap analysis.</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
