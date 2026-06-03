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
  const [showPw, setShowPw] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true); setError("");
    try {
      const res = await api.post("/auth/signup", { full_name: fullName, email, password, phone: phone || undefined });
      saveSession(res.data.access_token);
      setSuccess("Account created! Redirecting to dashboard…");
      setTimeout(() => router.push("/dashboard"), 1800);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .su-page { min-height:100vh; display:grid; grid-template-columns:480px 1fr; background:#04060e; color:#eef2ff; font-family:'DM Sans',sans-serif; }
        .su-left { display:flex; align-items:center; justify-content:center; padding:40px 44px; border-right:1px solid rgba(255,255,255,0.07); }
        .su-box { width:100%; max-width:380px; }
        .su-back { display:inline-flex; align-items:center; gap:6px; font-size:13px; color:#4a5368; text-decoration:none; margin-bottom:32px; transition:color 0.15s; }
        .su-back:hover { color:#8b95b0; }
        .su-title { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; margin-bottom:6px; }
        .su-sub { font-size:13px; color:#8b95b0; margin-bottom:28px; }
        .su-field { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
        .su-label { font-size:11.5px; font-weight:600; color:#8b95b0; letter-spacing:0.04em; text-transform:uppercase; }
        .su-input { width:100%; padding:11px 14px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); border-radius:9px; color:#eef2ff; font-size:14px; font-family:'DM Sans',sans-serif; outline:none; transition:all 0.15s; }
        .su-input:focus { border-color:#4f8aff; background:rgba(79,138,255,0.05); box-shadow:0 0 0 3px rgba(79,138,255,0.12); }
        .su-input::placeholder { color:#4a5368; }
        .su-pw-wrap { position:relative; }
        .su-pw-wrap .su-input { padding-right:44px; }
        .su-eye { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#4a5368; font-size:16px; padding:4px; }
        .su-err { padding:10px 13px; background:rgba(248,113,113,0.1); border:1px solid rgba(248,113,113,0.22); border-radius:8px; color:#f87171; font-size:13px; margin-bottom:14px; }
        .su-ok { padding:10px 13px; background:rgba(34,211,160,0.1); border:1px solid rgba(34,211,160,0.22); border-radius:8px; color:#22d3a0; font-size:13px; margin-bottom:14px; }
        .su-submit { width:100%; padding:12px; border-radius:9px; background:#4f8aff; border:none; color:#fff; font-size:14px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.15s; box-shadow:0 0 22px rgba(79,138,255,0.28); margin-top:18px; }
        .su-submit:hover:not(:disabled) { background:#6b9fff; transform:translateY(-1px); }
        .su-submit:disabled { opacity:0.45; cursor:not-allowed; }
        .su-divider { text-align:center; margin-top:20px; font-size:13px; color:#8b95b0; }
        .su-divider a { color:#4f8aff; font-weight:600; text-decoration:none; }
        .su-spinner { display:inline-block; width:14px;height:14px; border:2px solid rgba(255,255,255,0.2); border-top-color:#fff; border-radius:50%; animation:su-spin 0.6s linear infinite; }
        @keyframes su-spin { to{transform:rotate(360deg)} }
        .su-right { display:flex; flex-direction:column; justify-content:center; padding:60px 6vw; position:relative; overflow:hidden; }
        .su-right-orb1 { position:absolute; top:-15%; right:-5%; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle,rgba(79,138,255,0.09) 0%,transparent 65%); pointer-events:none; }
        .su-right-orb2 { position:absolute; bottom:-10%; left:-10%; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(124,92,252,0.07) 0%,transparent 65%); pointer-events:none; }
        .su-brand { display:flex; align-items:center; gap:12px; margin-bottom:48px; }
        .su-brand-icon { width:40px;height:40px; border-radius:12px; background:linear-gradient(135deg,#4f8aff,#7c5cfc); display:grid; place-items:center; font-size:20px; box-shadow:0 0 24px rgba(79,138,255,0.35); }
        .su-brand-name { font-family:'Syne',sans-serif; font-size:17px; font-weight:800; }
        .su-headline { font-family:'Syne',sans-serif; font-size:clamp(28px,3.5vw,46px); font-weight:800; line-height:1.1; letter-spacing:-0.025em; margin-bottom:16px; }
        .su-headline em { font-style:normal; background:linear-gradient(135deg,#4f8aff,#7c5cfc); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .su-desc { font-size:15px; color:#8b95b0; line-height:1.7; max-width:400px; margin-bottom:40px; }
        .su-credits-card { background:rgba(79,138,255,0.06); border:1px solid rgba(79,138,255,0.2); border-radius:14px; padding:22px 24px; display:flex; align-items:center; gap:18px; max-width:380px; }
        .su-credits-icon { font-size:32px; flex-shrink:0; }
        .su-credits-title { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; margin-bottom:4px; }
        .su-credits-sub { font-size:13px; color:#8b95b0; }
        .su-steps { margin-top:36px; display:flex; flex-direction:column; gap:14px; }
        .su-step { display:flex; align-items:center; gap:14px; }
        .su-step-n { width:28px;height:28px; border-radius:50%; background:rgba(79,138,255,0.12); border:1px solid rgba(79,138,255,0.22); display:grid; place-items:center; font-size:12px; font-weight:700; color:#4f8aff; flex-shrink:0; }
        .su-step-text { font-size:13px; color:#8b95b0; }
        @media(max-width:800px) { .su-page{grid-template-columns:1fr;} .su-right{display:none;} .su-left{padding:40px 24px; border-right:none;} }
      `}</style>
      <div className="su-page">
        {/* Left — Form */}
        <div className="su-left">
          <div className="su-box">
            <a href="/" className="su-back">← Back to home</a>
            <div className="su-title">Create your account</div>
            <div className="su-sub">Start free with 25 AI credits — no card needed</div>

            {error && <div className="su-err">⚠️ {error}</div>}
            {success && <div className="su-ok">✓ {success}</div>}

            <form onSubmit={handleSignup}>
              <div className="su-field">
                <label className="su-label">Full name</label>
                <input type="text" className="su-input" placeholder="Satyam Kumar" value={fullName} onChange={(e) => setFullName(e.target.value)} required autoComplete="name" />
              </div>
              <div className="su-field">
                <label className="su-label">Email</label>
                <input type="email" className="su-input" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="su-field">
                <label className="su-label">Phone <span style={{ fontWeight: 400, textTransform: "none", color: "#4a5368" }}>(optional)</span></label>
                <input type="tel" className="su-input" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
              </div>
              <div className="su-field">
                <label className="su-label">Password</label>
                <div className="su-pw-wrap">
                  <input type={showPw ? "text" : "password"} className="su-input" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
                  <button type="button" className="su-eye" onClick={() => setShowPw(!showPw)}>{showPw ? "🙈" : "👁️"}</button>
                </div>
              </div>
              <button type="submit" className="su-submit" disabled={loading || !!success}>
                {loading ? <><span className="su-spinner" /> Creating account…</> : "Create free account →"}
              </button>
            </form>

            <div className="su-divider" style={{ marginTop: 24 }}>
              Already have an account? <a href="/login">Sign in</a>
            </div>

            <div style={{ marginTop: 16, fontSize: 11, color: "#4a5368", textAlign: "center", lineHeight: 1.6 }}>
              By signing up you agree to our <a href="/terms" style={{ color: "#4f8aff" }}>Terms of Service</a> and <a href="/privacy" style={{ color: "#4f8aff" }}>Privacy Policy</a>.
            </div>
          </div>
        </div>

        {/* Right — Info */}
        <div className="su-right">
          <div className="su-right-orb1" />
          <div className="su-right-orb2" />
          <div className="su-brand">
            <div className="su-brand-icon">🤖</div>
            <div className="su-brand-name">AI Job Copilot</div>
          </div>
          <div className="su-headline">Your job search,<br /><em>supercharged.</em></div>
          <p className="su-desc">Thousands of job seekers already use AI Job Copilot to apply 10x faster, track every opportunity, and land more interviews.</p>

          <div className="su-credits-card">
            <div className="su-credits-icon">⚡</div>
            <div>
              <div className="su-credits-title">25 free AI credits</div>
              <div className="su-credits-sub">Enough to parse your resume, discover jobs, and generate your first interview prep pack.</div>
            </div>
          </div>

          <div className="su-steps">
            {[
              "Upload your resume — AI extracts your full profile",
              "Discover matched jobs across 20+ portals instantly",
              "Auto-fill applications in 4 seconds with Chrome extension",
              "Track, analyze, and improve your job search funnel",
            ].map((s, i) => (
              <div key={s} className="su-step">
                <div className="su-step-n">{i + 1}</div>
                <div className="su-step-text">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
