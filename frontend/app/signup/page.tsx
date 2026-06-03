"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, saveSession } from "../../lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/signup", {
        full_name: fullName,
        email,
        password,
        phone: phone || undefined,
      });
      saveSession(res.data.access_token);
      setSuccess("Account created! Check your email to verify your account.");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "24px", position: "relative", zIndex: 1,
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
            AI Job Copilot
          </div>
          <div style={{ fontSize: 14, color: "var(--text-2)" }}>
            Start your autonomous job search
          </div>
        </div>

        {/* Card */}
        <div className="card elevated" style={{ padding: "32px 28px" }}>
          <div style={{ marginBottom: 24 }}>
            <div className="page-eyebrow">Get started free</div>
            <h1 style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>Create your account</h1>
            <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 6 }}>
              25 free AI credits • No credit card required
            </p>
          </div>

          {error && <div className="error-msg" style={{ marginBottom: 16 }}>⚠ {error}</div>}
          {success && <div className="notice success" style={{ marginBottom: 16 }}>✓ {success}</div>}

          <form onSubmit={handleSignup}>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Full name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Satyam Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Phone <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(optional)</span></label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", height: 42 }}
              disabled={loading}
            >
              {loading ? <><span className="spinner" /> Creating account…</> : "Create free account →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-2)" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "var(--accent)", fontWeight: 500 }}>Sign in</a>
          </div>

          <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--surface)", borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text-3)", textAlign: "center" }}>
            By creating an account you agree to our terms of service. Your data is encrypted and never sold.
          </div>
        </div>
      </div>
    </div>
  );
}
