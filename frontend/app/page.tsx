"use client";

import { useState } from "react";
import { api, saveSession } from "../lib/api";

export default function HomePage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [form, setForm] = useState({ full_name: "", email: "", password: "", phone: "" });
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");

  function field(key: keyof typeof form) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  async function submit() {
    if (!form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setVerifyMsg("");
    setLoading(true);
    try {
      const path = mode === "signup" ? "/auth/signup" : "/auth/login";
      const payload = mode === "signup" ? form : { email: form.email, password: form.password };
      const res = await api.post(path, payload);
      saveSession(res.data.access_token);
      setToken(res.data.access_token);
      if (mode === "signup" && res.data.message) {
        setVerifyMsg(res.data.message);
      }
      setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Request failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="hero">
      {/* Left: copy */}
      <div>
        <div className="hero-eyebrow">AI-Powered Career Agent</div>
        <h1 className="hero-title">
          Land your next job<br />
          <span className="gradient-text">on autopilot.</span>
        </h1>
        <p className="hero-subtitle">
          Upload your resume once. Let AI parse your profile, score jobs from Naukri, LinkedIn & more, auto-fill applications, and track every outcome — all from one dashboard.
        </p>
        <div className="row" style={{ marginBottom: 40 }}>
          {["Resume Parsing", "Job Scoring", "Auto-Apply", "Analytics"].map((f) => (
            <span key={f} className="badge badge-blue">{f}</span>
          ))}
        </div>
      </div>

      {/* Right: auth form */}
      <div className="hero-form">
        <div className="auth-tabs">
          <button className={`auth-tab ${mode === "signup" ? "active" : ""}`} onClick={() => { setMode("signup"); setError(""); }}>
            Create Account
          </button>
          <button className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => { setMode("login"); setError(""); }}>
            Sign In
          </button>
        </div>

        <div className="form-stack">
          {mode === "signup" && (
            <>
              <div className="field">
                <label className="field-label">Full Name</label>
                <input className="input" placeholder="Satyam Kumar" {...field("full_name")} />
              </div>
              <div className="field">
                <label className="field-label">Phone</label>
                <input className="input" placeholder="+91 98765 43210" {...field("phone")} />
              </div>
            </>
          )}
          <div className="field">
            <label className="field-label">Email *</label>
            <input className="input" placeholder="you@email.com" type="email" {...field("email")} onKeyDown={(e) => e.key === "Enter" && submit()} />
          </div>
          <div className="field">
            <label className="field-label">Password *</label>
            <input className="input" placeholder="••••••••" type="password" {...field("password")} onKeyDown={(e) => e.key === "Enter" && submit()} />
          </div>

          {mode === "login" && (
            <div style={{ textAlign: "right", marginTop: -8 }}>
              <a href="/forgot-password" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none" }}>
                Forgot password?
              </a>
            </div>
          )}

          {error && <div className="error-msg">⚠ {error}</div>}

          {(token || verifyMsg) && (
            <div className="success-box">
              <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                ✓ {mode === "signup" ? "Account created!" : "Logged in!"} Redirecting…
              </div>
              {verifyMsg && (
                <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4 }}>
                  📧 {verifyMsg}
                </div>
              )}
              {token && (
                <>
                  <div className="token-label" style={{ fontSize: 11, color: "var(--text-2)", marginTop: 6 }}>
                    Save this token for Chrome extension:
                  </div>
                  <div className="token-value">{token}</div>
                </>
              )}
            </div>
          )}

          <button
            className="btn btn-primary w-full"
            onClick={submit}
            disabled={loading || !!token}
            style={{ marginTop: 4 }}
          >
            {loading ? <><span className="spinner" /> Processing…</> : mode === "signup" ? "Create free account →" : "Sign in →"}
          </button>

          {!token && (
            <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-3)" }}>
              {mode === "signup" ? "Already have an account? " : "New here? "}
              <button
                onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}
                style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
              >
                {mode === "signup" ? "Sign in" : "Create account"}
              </button>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
