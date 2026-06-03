"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, saveSession } from "../../lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      saveSession(res.data.access_token);
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .auth-page { min-height:100vh; display:grid; grid-template-columns:1fr 480px; background:#04060e; color:#eef2ff; font-family:'DM Sans',sans-serif; }
        .auth-left { display:flex; flex-direction:column; justify-content:center; padding:60px 6vw; position:relative; overflow:hidden; border-right:1px solid rgba(255,255,255,0.07); }
        .auth-left-orb1 { position:absolute; top:-15%; left:-10%; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle,rgba(79,138,255,0.1) 0%,transparent 65%); pointer-events:none; }
        .auth-left-orb2 { position:absolute; bottom:-10%; right:-5%; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(124,92,252,0.08) 0%,transparent 65%); pointer-events:none; }
        .auth-brand { display:flex; align-items:center; gap:12px; margin-bottom:48px; }
        .auth-brand-icon { width:40px;height:40px; border-radius:12px; background:linear-gradient(135deg,#4f8aff,#7c5cfc); display:grid; place-items:center; font-size:20px; box-shadow:0 0 24px rgba(79,138,255,0.35); flex-shrink:0; }
        .auth-brand-name { font-family:'Syne',sans-serif; font-size:17px; font-weight:800; }
        .auth-headline { font-family:'Syne',sans-serif; font-size:clamp(28px,3.5vw,42px); font-weight:800; line-height:1.1; letter-spacing:-0.025em; margin-bottom:16px; }
        .auth-headline em { font-style:normal; background:linear-gradient(135deg,#4f8aff,#7c5cfc); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .auth-sub { font-size:15px; color:#8b95b0; line-height:1.7; max-width:400px; margin-bottom:40px; }
        .auth-feat-list { display:flex; flex-direction:column; gap:14px; }
        .auth-feat-item { display:flex; align-items:center; gap:12px; font-size:14px; color:#8b95b0; }
        .auth-feat-check { width:22px;height:22px; border-radius:50%; background:rgba(34,211,160,0.12); border:1px solid rgba(34,211,160,0.25); display:grid; place-items:center; font-size:12px; color:#22d3a0; flex-shrink:0; }
        .auth-right { display:flex; align-items:center; justify-content:center; padding:40px 44px; }
        .auth-box { width:100%; max-width:380px; }
        .auth-box-title { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; margin-bottom:6px; }
        .auth-box-sub { font-size:13px; color:#8b95b0; margin-bottom:28px; }
        .auth-field { display:flex; flex-direction:column; gap:5px; margin-bottom:16px; }
        .auth-label { font-size:11.5px; font-weight:600; color:#8b95b0; letter-spacing:0.04em; text-transform:uppercase; }
        .auth-input { width:100%; padding:11px 14px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); border-radius:9px; color:#eef2ff; font-size:14px; font-family:'DM Sans',sans-serif; outline:none; transition:all 0.15s; }
        .auth-input:focus { border-color:#4f8aff; background:rgba(79,138,255,0.05); box-shadow:0 0 0 3px rgba(79,138,255,0.12); }
        .auth-input::placeholder { color:#4a5368; }
        .auth-input-wrap { position:relative; }
        .auth-input-wrap .auth-input { padding-right:44px; }
        .auth-eye { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#4a5368; font-size:16px; padding:4px; transition:color 0.15s; }
        .auth-eye:hover { color:#8b95b0; }
        .auth-forgot { text-align:right; margin-top:-8px; margin-bottom:4px; }
        .auth-forgot a { font-size:12px; color:#4f8aff; text-decoration:none; }
        .auth-forgot a:hover { text-decoration:underline; }
        .auth-err { padding:10px 13px; background:rgba(248,113,113,0.1); border:1px solid rgba(248,113,113,0.22); border-radius:8px; color:#f87171; font-size:13px; margin-bottom:14px; }
        .auth-submit { width:100%; padding:12px; border-radius:9px; background:#4f8aff; border:none; color:#fff; font-size:14px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.15s; box-shadow:0 0 22px rgba(79,138,255,0.28); }
        .auth-submit:hover:not(:disabled) { background:#6b9fff; box-shadow:0 0 32px rgba(79,138,255,0.42); transform:translateY(-1px); }
        .auth-submit:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
        .auth-divider { text-align:center; margin-top:20px; font-size:13px; color:#8b95b0; }
        .auth-divider a { color:#4f8aff; font-weight:600; text-decoration:none; }
        .auth-divider a:hover { text-decoration:underline; }
        .auth-back { display:inline-flex; align-items:center; gap:6px; font-size:13px; color:#4a5368; text-decoration:none; margin-bottom:32px; transition:color 0.15s; }
        .auth-back:hover { color:#8b95b0; }
        .auth-spinner { display:inline-block; width:14px;height:14px; border:2px solid rgba(255,255,255,0.2); border-top-color:#fff; border-radius:50%; animation:auth-spin 0.6s linear infinite; }
        @keyframes auth-spin { to{transform:rotate(360deg)} }
        @media(max-width:800px) { .auth-page{grid-template-columns:1fr;} .auth-left{display:none;} .auth-right{padding:40px 24px;} }
      `}</style>
      <div className="auth-page">
        {/* Left panel */}
        <div className="auth-left">
          <div className="auth-left-orb1" />
          <div className="auth-left-orb2" />
          <div className="auth-brand">
            <div className="auth-brand-icon">🤖</div>
            <div className="auth-brand-name">AI Job Copilot</div>
          </div>
          <div className="auth-headline">Your career,<br /><em>on autopilot.</em></div>
          <p className="auth-sub">The AI-powered job search platform that finds, matches, and applies to jobs — so you can focus on interviews.</p>
          <div className="auth-feat-list">
            {[
              "AI resume parsing — 40+ data points extracted",
              "Match scoring across 20+ job portals",
              "Chrome extension auto-fills forms in 4s",
              "Interview prep packs generated by AI",
              "Career analytics & skill gap insights",
            ].map((f) => (
              <div key={f} className="auth-feat-item">
                <div className="auth-feat-check">✓</div>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — login form */}
        <div className="auth-right">
          <div className="auth-box">
            <a href="/" className="auth-back">← Back to home</a>
            <div className="auth-box-title">Welcome back</div>
            <div className="auth-box-sub">Sign in to your AI Job Copilot account</div>

            {error && <div className="auth-err">⚠️ {error}</div>}

            <form onSubmit={handleLogin}>
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <input
                    type={showPw ? "text" : "password"}
                    className="auth-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowPw(!showPw)}>{showPw ? "🙈" : "👁️"}</button>
                </div>
              </div>
              <div className="auth-forgot"><a href="/forgot-password">Forgot password?</a></div>
              <button type="submit" className="auth-submit" disabled={loading} style={{ marginTop: 18 }}>
                {loading ? <><span className="auth-spinner" /> Signing in…</> : "Sign in →"}
              </button>
            </form>

            <div className="auth-divider" style={{ marginTop: 24 }}>
              Don&apos;t have an account? <a href="/signup">Create one free</a>
            </div>

            <div style={{ marginTop: 20, padding: "12px 14px", background: "rgba(255,255,255,0.025)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 11, color: "#4a5368", textAlign: "center" }}>Start free with 25 AI credits • No card needed</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
