"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

export default function InterviewPage() {
  const [role, setRole] = useState("AI Engineer");
  const [pack, setPack] = useState<any>(null);

  async function generate() {
    const res = await api.post("/analytics/interview", { title: role, skills: ["Python", "FastAPI", "LLM"] });
    setPack(res.data);
  }

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <Navbar title="Interview Agent" />
        <section className="panel stack">
          <input className="input" value={role} onChange={(e) => setRole(e.target.value)} />
          <button className="button" onClick={generate}>Generate Prep Pack</button>
        </section>
        {pack && <section className="panel" style={{ marginTop: 16 }}>
          <h2>{pack.role}</h2>
          {[...(pack.technical_questions || []), ...(pack.behavioral_questions || [])].map((q: string) => <p key={q} className="muted">{q}</p>)}
        </section>}
      </main>
    </div>
  );
}
