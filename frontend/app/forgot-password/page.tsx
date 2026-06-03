"use client";

import { useState } from "react";
import { api } from "../../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!email.trim()) { setError("Please enter your email."); return; }
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (e: any) {
      setError(e.response?.data?.detail || "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "40px 36px",
          maxWidth: 440,
          width: "100%",
        }}
      >
        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📧</div>
            <h2 style={{ marginBottom: 8 }}>Check your inbox</h2>
            <p style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.7 }}>
              If an account exists for <strong>{email}</strong>, we've sent a password reset link. It expires in 60 minutes.
            </p>
            <a href="/" style={{ display: "inline-block", marginTop: 24, fontSize: 13, color: "var(--accent)" }}>
              ← Back to Sign In
            </a>
          </div>
        ) : (
          <>
            <h2 style={{ marginBottom: 6 }}>Forgot Password</h2>
            <p style={{ color: "var(--text-2)", fontSize: 13, marginBottom: 24 }}>
              Enter your email address and we'll send you a reset link.
            </p>
            <div className="field">
              <label className="field-label">Email Address</label>
              <input
                className="input"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
            </div>
            {error && <div className="error-msg" style={{ marginTop: 8 }}>⚠ {error}</div>}
            <button
              className="btn btn-primary w-full"
              onClick={submit}
              disabled={loading}
              style={{ marginTop: 16 }}
            >
              {loading ? <><span className="spinner" /> Sending…</> : "Send Reset Link"}
            </button>
            <a href="/" style={{ display: "block", textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--text-2)" }}>
              ← Back to Sign In
            </a>
          </>
        )}
      </div>
    </main>
  );
}
