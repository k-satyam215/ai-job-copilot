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
        <div className="hero-eyebrow">AI-Powered Career Productivity Tool</div>
        <h1 className="hero-title">
          Manage your career<br />
          <span className="gradient-text">intelligently.</span>
        </h1>
        <p className="hero-subtitle">
          Upload your resume once. Let AI parse your profile, score opportunities, 
          auto-fill applications, and track every outcome — all from one productivity dashboard.
        </p>
        <div className="row" style={{ marginBottom: 40 }}>
          {["Resume Intelligence", "Application Tracking", "AI Auto-Fill", "Career Analytics"].map((f) => (
            <span key={f} className="badge badge-blue">{f}</span>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 40 }}>
          {[
            { value: "10x", label: "Faster applications" },
            { value: "85%", label: "Auto-fill accuracy" },
            { value: "25", label: "Free AI credits" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420 }}>
          {[
            ["🧠", "AI Resume Parser", "Extracts skills, experience & profile automatically"],
            ["⚡", "Smart Auto-Fill", "Chrome extension fills forms instantly using your profile"],
            ["📊", "Career Analytics", "Track applications, interview rates & skill gaps"],
            ["🗺️", "Roadmap Generator", "Week-by-week AI learning plan for your target role"],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{title}</div>
                <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: auth form */}
      <div className="hero-form">
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontFamily: "var(--font-display)", fontWeight: 800 }}>AI Job Copilot</div>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>Career Productivity Platform</div>
        </div>

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
                <input className="input" placeholder="Your name" {...field("full_name")} />
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
            <input className="input" placeholder="Min 8 characters" type="password" {...field("password")} onKeyDown={(e) => e.key === "Enter" && submit()} />
          </div>

          {mode === "login" && (
            <div style={{ textAlign: "right", marginTop: -8 }}>
              <a href="/forgot-password" style={{ fontSize: 12, color: "var(--accent)" }}>Forgot password?</a>
            </div>
          )}

          {error && <div className="error-msg">⚠ {error}</div>}

          {(token || verifyMsg) && (
            <div className="success-box">
              <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                ✓ {mode === "signup" ? "Account created!" : "Logged in!"} Redirecting…
              </div>
              {verifyMsg && (
                <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4 }}>📧 {verifyMsg}</div>
              )}
              {token && (
                <>
                  <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 6 }}>Save for Chrome extension:</div>
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
            {loading ? <><span className="spinner" /> Processing…</> : mode === "signup" ? "Start free — 25 AI credits →" : "Sign in →"}
          </button>

          {!token && (
            <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-3)" }}>
              {mode === "signup" ? "Already have an account? " : "New here? "}
              <button onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}
                style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                {mode === "signup" ? "Sign in" : "Create account"}
              </button>
            </p>
          )}

          {mode === "signup" && (
            <p style={{ fontSize: 11, color: "var(--text-3)", textAlign: "center", lineHeight: 1.5 }}>
              By signing up you agree to our{" "}
              <a href="/terms" style={{ color: "var(--accent)" }}>Terms of Service</a>{" "}
              and{" "}
              <a href="/privacy" style={{ color: "var(--accent)" }}>Privacy Policy</a>.
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        padding: "10px 24px",
        display: "flex", justifyContent: "center", gap: 24,
        fontSize: 12, color: "var(--text-3)",
        borderTop: "1px solid var(--border)",
        background: "rgba(5,8,15,0.9)",
        backdropFilter: "blur(10px)",
        zIndex: 50,
      }}>
        <span>© 2025 AI Job Copilot — Career Productivity SaaS</span>
        <a href="/privacy" style={{ color: "var(--text-3)" }}>Privacy Policy</a>
        <a href="/terms" style={{ color: "var(--text-3)" }}>Terms of Service</a>
        <a href="/refund" style={{ color: "var(--text-3)" }}>Refund Policy</a>
        <a href="/pricing" style={{ color: "var(--text-3)" }}>Pricing</a>
      </div>
    </main>
  );
}
