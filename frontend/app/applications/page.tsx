"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    api.get("/apply/").then((res) => setApplications(res.data)).catch(() => {});
  }, []);

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <Navbar title="Applications" />
        <div className="stack">
          {applications.map((app) => (
            <article className="panel" key={app.id}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="badge">{app.match_score}% match</span>
                <span className="muted">{app.status}</span>
              </div>
              <h3>{app.title}</h3>
              <p className="muted">{app.company}</p>
              <a className="button secondary" href={app.job_url} target="_blank">Open job</a>
            </article>
          ))}
          {!applications.length && <div className="panel muted">No applications tracked yet. Use the extension on LinkedIn or Naukri.</div>}
        </div>
      </main>
    </div>
  );
}
