"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [gaps, setGaps] = useState<any>(null);

  useEffect(() => {
    api.get("/analytics/overview").then((res) => setOverview(res.data)).catch(() => {});
    api.get("/analytics/skill-gaps").then((res) => setGaps(res.data)).catch(() => {});
  }, []);

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <Navbar title="Career Analytics" />
        <section className="grid">
          <div className="panel"><div className="metric">{overview?.total_applications ?? 0}</div><div className="muted">Applications</div></div>
          <div className="panel"><div className="metric">{overview?.average_match_score ?? 0}%</div><div className="muted">Avg match</div></div>
          <div className="panel"><div className="metric">{overview?.interview_rate ?? 0}%</div><div className="muted">Interview rate</div></div>
        </section>
        <section className="panel" style={{ marginTop: 16 }}>
          <h2>Skill Gaps</h2>
          <div className="row">{(gaps?.missing_skills || []).map((gap: any) => <span className="badge" key={gap.skill}>{gap.skill} x{gap.demand}</span>)}</div>
        </section>
      </main>
    </div>
  );
}
