"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import JobCard from "../../components/JobCard";
import { api } from "../../lib/api";

export default function DashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [discovering, setDiscovering] = useState(false);

  useEffect(() => {
    api.get("/resume/profile").then((res) => setProfile(res.data.profile)).catch(() => {});
    api.get("/jobs/").then((res) => setJobs(res.data)).catch(() => {});
    api.get("/apply/").then((res) => setApps(res.data)).catch(() => {});
  }, []);

  const highMatches = jobs.filter((job) => (job.match?.match_score || 0) >= 70).length;

  async function discoverJobs() {
    setDiscovering(true);
    try {
      const res = await api.post("/jobs/discover", { pages: 1 });
      setJobs(res.data.jobs.map((row: any) => ({
        id: row.id,
        title: row.title,
        company: row.company,
        source: row.source,
        url: row.url,
        skills: [],
        match: row.match,
      })));
    } finally {
      setDiscovering(false);
    }
  }

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <Navbar title="Dashboard" />
        <section className="panel" style={{ marginBottom: 16 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <h2 style={{ margin: 0 }}>Live Job Discovery</h2>
              <p className="muted">Fetch fresh matching jobs from Naukri, LinkedIn, Foundit, Indeed, Unstop, and Apna.</p>
            </div>
            <button className="button" onClick={discoverJobs} disabled={discovering}>{discovering ? "Searching..." : "Find Fresh Jobs"}</button>
          </div>
        </section>
        <section className="grid">
          <div className="panel"><div className="metric">{jobs.length}</div><div className="muted">Jobs captured</div></div>
          <div className="panel"><div className="metric">{highMatches}</div><div className="muted">High matches</div></div>
          <div className="panel"><div className="metric">{apps.length}</div><div className="muted">Applications tracked</div></div>
        </section>
        <section className="panel" style={{ marginTop: 16 }}>
          <h2>Profile Intelligence</h2>
          <p className="muted">{profile?.summary || "Upload your resume to generate profile intelligence."}</p>
          <div className="row">{(profile?.skills || []).slice(0, 12).map((skill: string) => <span className="badge" key={skill}>{skill}</span>)}</div>
        </section>
        <section style={{ marginTop: 16 }}>
          <h2>Matched Jobs</h2>
          <div className="jobs">{jobs.map((job) => <JobCard key={job.id} job={job} />)}</div>
        </section>
      </main>
    </div>
  );
}
