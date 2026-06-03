"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "24px", position: "relative", zIndex: 1,
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
            AI Job Copilot
          </div>
          <div style={{ fontSize: 14, color: "var(--text-2)" }}>
            Your autonomous career agent
          </div>
        </div>

        {/* Card */}
        <div className="card elevated" style={{ padding: "32px 28px" }}>
          <div style={{ marginBottom: 24 }}>
            <div className="page-eyebrow">Welcome back</div>
            <h1 style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>Sign in to your account</h1>
          </div>

          {error && (
            <div className="error-msg" style={{ marginBottom: 16 }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: 16 }}>
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

            <div className="form-group" style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <a href="/forgot-password" style={{ fontSize: 12, color: "var(--accent)" }}>Forgot password?</a>
              </div>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", height: 42 }}
              disabled={loading}
            >
              {loading ? <><span className="spinner" /> Signing in…</> : "Sign in →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-2)" }}>
            Don&apos;t have an account?{" "}
            <a href="/signup" style={{ color: "var(--accent)", fontWeight: 500 }}>Create one free</a>
          </div>
        </div>
      </div>
    </div>
  );
}
