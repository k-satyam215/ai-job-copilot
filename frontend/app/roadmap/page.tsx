"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

export default function RoadmapPage() {
  const [targetRole, setTargetRole] = useState("AI Engineer");
  const [roadmap, setRoadmap] = useState<any>(null);

  async function generate() {
    const res = await api.post("/analytics/roadmap", { target_role: targetRole });
    setRoadmap(res.data);
  }

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <Navbar title="Career Roadmap" />
        <section className="panel stack">
          <input className="input" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
          <button className="button" onClick={generate}>Build Roadmap</button>
        </section>
        {roadmap && <section className="jobs" style={{ marginTop: 16 }}>
          {roadmap.roadmap.map((item: any) => <article className="panel" key={item.week}><span className="badge">Week {item.week}</span><h3>{item.focus}</h3><p className="muted">{item.outputs.join(", ")}</p></article>)}
        </section>}
      </main>
    </div>
  );
}
