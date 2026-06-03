"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import JobCard from "../../components/JobCard";
import { api } from "../../lib/api";

export default function DashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [discovering, setDiscovering] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/resume/profile").then((res) => setProfile(res.data.profile)).catch(() => {}),
      api.get("/jobs/").then((res) => setJobs(res.data)).catch(() => {}),
      api.get("/apply/").then((res) => setApps(res.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const highMatches = jobs.filter((job) => (job.match?.match_score || 0) >= 70).length;
  const appliedCount = apps.length;

  async function discoverJobs() {
    setDiscovering(true);
    try {
      const res = await api.post("/jobs/discover", { pages: 1 });
      setJobs(
        res.data.jobs.map((row: any) => ({
          id: row.id,
          title: row.title,
          company: row.company,
          source: row.source,
          url: row.url,
          skills: [],
          match: row.match,
        }))
      );
    } finally {
      setDiscovering(false);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="page-main">
        {/* Header */}
        <div className="page-header">
          <div className="page-title-block">
            <div className="page-eyebrow">Overview</div>
            <h1>Dashboard</h1>
            <p>Your AI-powered career command center</p>
          </div>
          <div className="page-header-actions">
            <button
              className="btn btn-primary"
              onClick={discoverJobs}
              disabled={discovering}
            >
              {discovering ? (
                <><span className="spinner" /> Discovering…</>
              ) : (
                "⚡ Find Fresh Jobs"
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            {loading ? (
              <div className="skeleton" style={{ height: 36, width: 60, marginBottom: 8 }} />
            ) : (
              <div className="stat-value">{jobs.length}</div>
            )}
            <div className="stat-label">Jobs Captured</div>
            <div className="stat-change neutral">From all platforms</div>
          </div>
          <div className="stat-card">
            {loading ? (
              <div className="skeleton" style={{ height: 36, width: 60, marginBottom: 8 }} />
            ) : (
              <div className="stat-value" style={{ color: "var(--green)" }}>{highMatches}</div>
            )}
            <div className="stat-label">High Matches (≥70%)</div>
            <div className="stat-change up">↑ Strong fit roles</div>
          </div>
          <div className="stat-card">
            {loading ? (
              <div className="skeleton" style={{ height: 36, width: 60, marginBottom: 8 }} />
            ) : (
              <div className="stat-value">{appliedCount}</div>
            )}
            <div className="stat-label">Applications Tracked</div>
            <div className="stat-change neutral">Via Chrome extension</div>
          </div>
        </div>

        {/* Profile Intelligence */}
        <div className="card elevated" style={{ marginBottom: 20 }}>
          <div className="section-header">
            <div>
              <div className="section-title">📋 Profile Intelligence</div>
              <div className="section-subtitle">AI-extracted insights from your resume</div>
            </div>
            <a href="/resume" className="btn btn-ghost btn-sm">Manage Resume →</a>
          </div>

          {profile ? (
            <>
              <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 14 }}>
                {profile.summary}
              </p>
              <div className="row">
                {(profile.skills || []).slice(0, 14).map((skill: string) => (
                  <span key={skill} className="badge badge-blue">{skill}</span>
                ))}
                {(profile.skills || []).length > 14 && (
                  <span className="badge badge-neutral">+{profile.skills.length - 14} more</span>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <div className="empty-icon">📄</div>
              <div className="empty-title">No resume uploaded yet</div>
              <div className="empty-desc">Upload your resume to unlock AI profile parsing and job matching.</div>
              <a href="/resume" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>Upload Resume →</a>
            </div>
          )}
        </div>

        {/* Job Listings */}
        <div className="section-header">
          <div>
            <div className="section-title">🎯 Matched Jobs</div>
            <div className="section-subtitle">
              {jobs.length > 0 ? `${jobs.length} jobs found — sorted by match score` : "Click 'Find Fresh Jobs' to discover opportunities"}
            </div>
          </div>
          {jobs.length > 0 && (
            <span className="badge badge-green">{highMatches} strong matches</span>
          )}
        </div>

        {jobs.length > 0 ? (
          <div className="jobs-grid">
            {jobs
              .sort((a, b) => (b.match?.match_score || 0) - (a.match?.match_score || 0))
              .map((job) => (
                <JobCard key={job.id || job.url || job.title} job={job} />
              ))}
          </div>
        ) : (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No jobs discovered yet</div>
              <div className="empty-desc">
                Hit the "Find Fresh Jobs" button above to pull live listings from Naukri, LinkedIn, Foundit, Indeed & more.
              </div>
              <button className="btn btn-primary" onClick={discoverJobs} disabled={discovering} style={{ marginTop: 8 }}>
                {discovering ? <><span className="spinner" /> Searching…</> : "⚡ Discover Jobs Now"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
