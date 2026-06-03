"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { API_BASE } from "../../lib/api";

function VerifyEmailContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in URL.");
      return;
    }
    fetch(`${API_BASE}/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.detail || "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error. Please try again.");
      });
  }, [token]);

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
          textAlign: "center",
        }}
      >
        {status === "loading" && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔄</div>
            <h2 style={{ marginBottom: 8 }}>Verifying your email…</h2>
            <p style={{ color: "var(--text-2)", fontSize: 14 }}>Please wait a moment.</p>
          </>
        )}
        {status === "success" && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
            <h2 style={{ marginBottom: 8, color: "var(--green)" }}>Email Verified!</h2>
            <p style={{ color: "var(--text-2)", fontSize: 14, marginBottom: 24 }}>{message}</p>
            <a href="/" className="btn btn-primary" style={{ display: "inline-block" }}>
              Sign In →
            </a>
          </>
        )}
        {status === "error" && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>❌</div>
            <h2 style={{ marginBottom: 8, color: "var(--red)" }}>Verification Failed</h2>
            <p style={{ color: "var(--text-2)", fontSize: 14, marginBottom: 24 }}>{message}</p>
            <a href="/" className="btn btn-ghost" style={{ display: "inline-block" }}>
              Back to Login
            </a>
          </>
        )}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
