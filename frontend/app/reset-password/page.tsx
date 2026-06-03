"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "../../lib/api";

function ResetPasswordContent() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!password || !confirm) { setError("Please fill in both fields."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/reset-password", { token, new_password: password });
      setDone(true);
    } catch (e: any) {
      setError(e.response?.data?.detail || "Reset failed. The link may have expired.");
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
        {done ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎉</div>
            <h2 style={{ marginBottom: 8, color: "var(--green)" }}>Password Reset!</h2>
            <p style={{ color: "var(--text-2)", fontSize: 14, marginBottom: 24 }}>
              Your password has been changed. You can now sign in.
            </p>
            <a href="/" className="btn btn-primary" style={{ display: "inline-block" }}>Sign In →</a>
          </div>
        ) : (
          <>
            <h2 style={{ marginBottom: 6 }}>Set New Password</h2>
            <p style={{ color: "var(--text-2)", fontSize: 13, marginBottom: 24 }}>
              Choose a strong password (at least 8 characters).
            </p>
            <div className="field">
              <label className="field-label">New Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="field" style={{ marginTop: 12 }}>
              <label className="field-label">Confirm Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
              {loading ? <><span className="spinner" /> Resetting…</> : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
