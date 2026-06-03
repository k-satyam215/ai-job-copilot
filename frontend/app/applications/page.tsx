"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

const STATUSES = ["copilot_filled", "applied", "interview", "offer", "rejected"];

const STATUS_COLORS: Record<string, string> = {
  copilot_filled: "badge-neutral",
  applied: "badge-blue",
  interview: "badge-purple",
  offer: "badge-green",
  rejected: "badge-red",
  tracked: "badge-neutral",
  pending: "badge-amber",
};

function getStatusColor(status: string) {
  return STATUS_COLORS[status?.toLowerCase()] || "badge-neutral";
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    api.get("/apply/")
      .then((res) => setApplications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: number, status: string) {
    setUpdating(id);
    try {
      await api.patch(`/apply/${id}/status`, { status });
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch {
      /* noop */
    } finally {
      setUpdating(null);
    }
  }

  async function deleteApp(id: number) {
    if (!confirm("Delete this application?")) return;
    try {
      await api.delete(`/apply/${id}`);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch {
      /* noop */
    }
  }

  const counts: Record<string, number> = {};
  applications.forEach((a) => {
    const s = a.status?.toLowerCase() || "pending";
    counts[s] = (counts[s] || 0) + 1;
  });

  const filterTabs = ["all", ...Array.from(new Set(applications.map((a) => a.status?.toLowerCase()).filter(Boolean)))];
  const filtered = filter === "all" ? applications : applications.filter((a) => a.status?.toLowerCase() === filter);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="page-main">
        <div className="page-header">
          <div className="page-title-block">
            <div className="page-eyebrow">Tracker</div>
            <h1>Applications</h1>
            <p>Every job you've applied to, all in one place</p>
          </div>
          <div className="page-header-actions">
            <span className="badge badge-neutral">{applications.length} total</span>
          </div>
        </div>

        {/* Status summary pills */}
        {applications.length > 0 && (
          <div className="row" style={{ marginBottom: 20, flexWrap: "wrap" }}>
            {Object.entries(counts).map(([status, count]) => (
              <span key={status} className={`badge ${getStatusColor(status)}`}>
                {status} · {count}
              </span>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        {filterTabs.length > 1 && (
          <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
            {filterTabs.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-ghost"}`}
              >
                {s === "all" ? `All (${applications.length})` : `${s} (${counts[s] || 0})`}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="stack">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Platform</th>
                  <th>Match</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 600 }}>{app.title || "—"}</td>
                    <td style={{ color: "var(--text-2)" }}>{app.company || "—"}</td>
                    <td>
                      {app.platform ? (
                        <span className="badge badge-neutral" style={{ textTransform: "capitalize" }}>
                          {app.platform}
                        </span>
                      ) : "—"}
                    </td>
                    <td>
                      <span className={`badge ${app.match_score >= 70 ? "badge-green" : app.match_score >= 50 ? "badge-blue" : "badge-neutral"}`}>
                        {app.match_score || 0}%
                      </span>
                    </td>
                    <td>
                      <select
                        value={app.status || "tracked"}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        disabled={updating === app.id}
                        style={{
                          background: "transparent",
                          border: "1px solid var(--border-bright)",
                          borderRadius: 6,
                          padding: "3px 6px",
                          fontSize: 12,
                          color: "var(--text)",
                          cursor: "pointer",
                          opacity: updating === app.id ? 0.5 : 1,
                        }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} style={{ background: "var(--bg2)" }}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        {app.job_url && (
                          <a className="btn btn-ghost btn-sm" href={app.job_url} target="_blank" rel="noopener">
                            View ↗
                          </a>
                        )}
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => deleteApp(app.id)}
                          style={{ color: "var(--red)", borderColor: "rgba(248,113,113,0.2)" }}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <div className="empty-title">No applications tracked yet</div>
              <div className="empty-desc">
                Install the Chrome extension and apply to jobs on LinkedIn or Naukri — they'll appear here automatically.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
