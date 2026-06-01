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

  useEffect(() => {
    api.get("/resume/profile").then((res) => setProfile(res.data.profile)).catch(() => {});
    api.get("/jobs/").then((res) => setJobs(res.data)).catch(() => {});
    api.get("/apply/").then((res) => setApps(res.data)).catch(() => {});
  }, []);

  const highMatches = jobs.filter((job) => (job.match?.match_score || 0) >= 70).length;

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <Navbar title="Dashboard" />
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
