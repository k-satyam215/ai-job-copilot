"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, saveSession } from "../../lib/api";

const FEATURES = [
  { icon: "🧠", text: "AI resume parsing — 40+ data points extracted instantly" },
  { icon: "⚡", text: "Chrome extension auto-fills job forms in 4 seconds" },
  { icon: "🎯", text: "AI match scoring across 20+ job portals" },
  { icon: "📊", text: "Full-funnel career analytics & skill gap insights" },
  { icon: "🗺️", text: "Personalised AI career roadmap for your target role" },
];

const AUTH_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cabinet+Grotesk:wght@700;800;900&display=swap');
  .auth-page {
    min-height: 100vh; display: grid;
    grid-template-columns: 500px 1fr;
    background: #030508; color: #f0f4ff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative; overflow: hidden;
  }
  .auth-page::before {
    content: ''; position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 90% 10%, rgba(79,138,255,0.09) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 10% 90%, rgba(124,92,252,0.07) 0%, transparent 55%);
    pointer-events: none; z-index: 0;
  }
  .auth-right {
    display: flex; flex-direction: column; justify-content: center;
    padding: 60px 7vw; position: relative; z-index: 1;
    border-left: 1px solid rgba(255,255,255,0.065);
  }
  .auth-brand {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 56px; text-decoration: none; color: #f0f4ff; width: fit-content;
  }
  .auth-brand-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: linear-gradient(135deg, #4f8aff, #7c5cfc);
    display: grid; place-items: center; font-size: 20px;
    box-shadow: 0 0 28px rgba(79,138,255,0.38), inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .auth-brand-name { font-family: 'Cabinet Grotesk', sans-serif; font-size: 16px; font-weight: 900; letter-spacing: -0.01em; }
  .auth-headline {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: clamp(32px, 4vw, 50px); font-weight: 900;
    line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 18px;
  }
  .auth-headline em {
    font-style: normal;
    background: linear-gradient(135deg, #4f8aff, #7c5cfc);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .auth-sub { font-size: 15px; color: #8893ae; line-height: 1.75; max-width: 420px; margin-bottom: 44px; }
  .auth-feat-list { display: flex; flex-direction: column; gap: 14px; max-width: 420px; }
  .auth-feat-item { display: flex; align-items: center; gap: 12px; font-size: 13.5px; color: #8893ae; }
  .auth-feat-icon {
    width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
    background: rgba(79,138,255,0.08); border: 1px solid rgba(79,138,255,0.16);
    display: grid; place-items: center; font-size: 13px;
  }
  .auth-left {
    display: flex; align-items: center; justify-content: center;
    padding: 48px 48px; position: relative; z-index: 1;
    background: rgba(6,10,20,0.5);
  }
  .auth-box { width: 100%; max-width: 360px; }
  .auth-back {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 12.5px; color: #44506a; text-decoration: none;
    margin-bottom: 36px; transition: color 0.15s; font-weight: 600;
  }
  .auth-back:hover { color: #8893ae; }
  .auth-box-title { font-family: 'Cabinet Grotesk', sans-serif; font-size: 26px; font-weight: 900; margin-bottom: 6px; letter-spacing: -0.02em; }
  .auth-box-sub { font-size: 13px; color: #8893ae; margin-bottom: 28px; }
  .auth-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 16px; }
  .auth-label { font-size: 11px; font-weight: 700; color: #8893ae; letter-spacing: 0.07em; text-transform: uppercase; }
  .auth-input {
    width: 100%; padding: 12px 14px;
    background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 9px; color: #f0f4ff; font-size: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.16s;
  }
  .auth-input:focus { border-color: #4f8aff; background: rgba(79,138,255,0.05); box-shadow: 0 0 0 3px rgba(79,138,255,0.13); }
  .auth-input::placeholder { color: #44506a; }
  .auth-input-wrap { position: relative; }
  .auth-input-wrap .auth-input { padding-right: 46px; }
  .auth-eye {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: #44506a; font-size: 16px; padding: 4px; transition: color 0.15s;
  }
  .auth-eye:hover { color: #8893ae; }
  .auth-forgot { text-align: right; margin-top: -8px; margin-bottom: 6px; }
  .auth-forgot a { font-size: 12px; color: #4f8aff; text-decoration: none; font-weight: 600; }
  .auth-forgot a:hover { text-decoration: underline; }
  .auth-err {
    padding: 11px 13px; background: rgba(248,113,113,0.09); border: 1px solid rgba(248,113,113,0.22);
    border-radius: 9px; color: #f87171; font-size: 13px; margin-bottom: 16px;
    display: flex; gap: 8px; align-items: flex-start;
  }
  .auth-submit {
    width: 100%; padding: 13px; border-radius: 9px; background: #4f8aff; border: none;
    color: #fff; font-size: 14px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.16s; box-shadow: 0 0 24px rgba(79,138,255,0.3); margin-top: 20px;
  }
  .auth-submit:hover:not(:disabled) { background: #6b9eff; box-shadow: 0 0 36px rgba(79,138,255,0.44); transform: translateY(-1px); }
  .auth-submit:disabled { opacity: 0.42; cursor: not-allowed; transform: none; }
  .auth-footer { text-align: center; margin-top: 22px; font-size: 13px; color: #8893ae; }
  .auth-footer a { color: #4f8aff; font-weight: 700; text-decoration: none; }
  .auth-footer a:hover { text-decoration: underline; }
  .auth-free-badge {
    margin-top: 20px; padding: 11px 14px; background: rgba(32,217,160,0.06);
    border: 1px solid rgba(32,217,160,0.14); border-radius: 9px;
    text-align: center; font-size: 12px; color: #20d9a0; font-weight: 600;
  }
  .auth-spinner {
    display: inline-block; width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.2); border-top-color: #fff;
    border-radius: 50%; animation: auth-spin 0.6s linear infinite;
  }
  @keyframes auth-spin { to { transform: rotate(360deg); } }
  @media (max-width: 860px) {
    .auth-page { grid-template-columns: 1fr; }
    .auth-right { display: none; }
    .auth-left { padding: 48px 24px; background: transparent; }
  }
`;

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
    setLoading(true); setError("");
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
      <style>{AUTH_STYLES}</style>
      <div className="auth-page">
        {/* LEFT — Form */}
        <div className="auth-left">
          <div className="auth-box">
            <a href="/" className="auth-back">← Back to home</a>
            <div className="auth-box-title">Welcome back</div>
            <div className="auth-box-sub">Sign in to your AI Job Copilot account</div>

            {error && <div className="auth-err"><span>⚠️</span> {error}</div>}

            <form onSubmit={handleLogin}>
              <div className="auth-field">
                <label className="auth-label">Email address</label>
                <input type="email" className="auth-input" placeholder="you@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  required autoComplete="email" autoFocus />
              </div>
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <input type={showPw ? "text" : "password"} className="auth-input"
                    placeholder="••••••••" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required autoComplete="current-password" />
                  <button type="button" className="auth-eye" onClick={() => setShowPw(!showPw)}>
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              <div className="auth-forgot"><a href="/forgot-password">Forgot password?</a></div>
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? <><span className="auth-spinner" /> Signing in…</> : "Sign in →"}
              </button>
            </form>

            <div className="auth-footer" style={{ marginTop: 24 }}>
              Don&apos;t have an account? <a href="/signup">Create one free</a>
            </div>
            <div className="auth-free-badge">⚡ Free plan includes 25 AI credits — no card needed</div>
          </div>
        </div>

        {/* RIGHT — Brand */}
        <div className="auth-right">
          <a href="/" className="auth-brand">
            <div className="auth-brand-icon">🤖</div>
            <span className="auth-brand-name">AI Job Copilot</span>
          </a>
          <div className="auth-headline">Your career,<br /><em>on autopilot.</em></div>
          <p className="auth-sub">The AI-powered job search platform that finds, matches, and applies to jobs — so you can focus on what matters: interviews.</p>
          <div className="auth-feat-list">
            {FEATURES.map((f) => (
              <div key={f.text} className="auth-feat-item">
                <div className="auth-feat-icon">{f.icon}</div>
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
