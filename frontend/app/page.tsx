"use client";

import { useState } from "react";
import { api, saveSession } from "../lib/api";

export default function HomePage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [form, setForm] = useState({ full_name: "Satyam Kumar", email: "", password: "", phone: "" });
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    try {
      const path = mode === "signup" ? "/auth/signup" : "/auth/login";
      const payload = mode === "signup" ? form : { email: form.email, password: form.password };
      const res = await api.post(path, payload);
      saveSession(res.data.access_token);
      setToken(res.data.access_token);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Request failed");
    }
  }

  return (
    <main className="hero">
      <span className="badge">AI SaaS MVP</span>
      <h1 className="title">AI Job Copilot</h1>
      <p className="subtitle">
        Upload resume once, let the system parse your profile, score jobs, fill applications, and track outcomes from one dashboard.
      </p>
      <div className="panel" style={{ maxWidth: 520, marginTop: 24 }}>
        <div className="row">
          <button className={`button ${mode === "signup" ? "" : "secondary"}`} onClick={() => setMode("signup")}>Signup</button>
          <button className={`button ${mode === "login" ? "" : "secondary"}`} onClick={() => setMode("login")}>Login</button>
        </div>
        <div className="stack" style={{ marginTop: 16 }}>
          {mode === "signup" && (
            <>
              <input className="input" placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </>
          )}
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="button" onClick={submit}>{mode === "signup" ? "Create account" : "Login"}</button>
          {error && <p style={{ color: "#fca5a5" }}>{error}</p>}
          {token && (
            <div className="panel" style={{ background: "#08111f" }}>
              <p className="muted">Token saved. Paste this into the Chrome extension popup too.</p>
              <code style={{ wordBreak: "break-all", color: "#a7f3d0" }}>{token}</code>
              <p><a className="button secondary" href="/dashboard">Open dashboard</a></p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
