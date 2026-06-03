"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, saveSession } from "../../lib/api";

const STEPS_INFO = [
  { n: "1", text: "Upload your resume — AI extracts your full career profile" },
  { n: "2", text: "Discover matched jobs across 20+ portals instantly" },
  { n: "3", text: "Auto-fill applications in 4 seconds with Chrome extension" },
  { n: "4", text: "Track, analyze, and improve your entire job search funnel" },
];

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
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
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
      setSuccess("Account created! Taking you to your dashboard…");
      setTimeout(() => router.push("/dashboard"), 1600);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cabinet+Grotesk:wght@700;800;900&display=swap');

        .su-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 500px 1fr;
          background: #030508;
          color: #f0f4ff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .su-page::before {
          content: '';
          position: fixed; inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 85% 10%, rgba(79,138,255,0.085) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 15% 90%, rgba(124,92,252,0.07) 0%, transparent 55%);
          pointer-events: none; z-index: 0;
        }

        /* Left — Form */
        .su-left {
          display: flex; align-items: center; justify-content: center;
          padding: 48px 52px;
          border-right: 1px solid rgba(255,255,255,0.065);
          position: relative; z-index: 1;
          background: rgba(6,10,20,0.5);
        }
        .su-box { width: 100%; max-width: 380px; }

        .su-back {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 12.5px; color: #44506a; text-decoration: none;
          margin-bottom: 36px; transition: color 0.15s; font-weight: 600;
        }
        .su-back:hover { color: #8893ae; }

        .su-title {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 26px; font-weight: 900; margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .su-sub { font-size: 13px; color: #8893ae; margin-bottom: 28px; }

        .su-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
        .su-label {
          font-size: 11px; font-weight: 700; color: #8893ae;
          letter-spacing: 0.07em; text-transform: uppercase;
        }
        .su-input {
          width: 100%; padding: 12px 14px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px; color: #f0f4ff;
          font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none; transition: all 0.16s;
        }
        .su-input:focus {
          border-color: #4f8aff;
          background: rgba(79,138,255,0.05);
          box-shadow: 0 0 0 3px rgba(79,138,255,0.13);
        }
        .su-input::placeholder { color: #44506a; }
        .su-pw-wrap { position: relative; }
        .su-pw-wrap .su-input { padding-right: 46px; }
        .su-eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #44506a;
          font-size: 16px; padding: 4px; transition: color 0.15s;
        }
        .su-eye:hover { color: #8893ae; }

        .su-err {
          padding: 11px 13px;
          background: rgba(248,113,113,0.09);
          border: 1px solid rgba(248,113,113,0.22);
          border-radius: 9px; color: #f87171;
          font-size: 13px; margin-bottom: 14px;
          display: flex; gap: 8px; align-items: flex-start;
        }
        .su-ok {
          padding: 11px 13px;
          background: rgba(32,217,160,0.09);
          border: 1px solid rgba(32,217,160,0.22);
          border-radius: 9px; color: #20d9a0;
          font-size: 13px; margin-bottom: 14px;
          display: flex; gap: 8px; align-items: center;
        }

        .su-submit {
          width: 100%; padding: 13px;
          border-radius: 9px; background: #4f8aff; border: none;
          color: #fff; font-size: 14px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 8px; transition: all 0.16s;
          box-shadow: 0 0 24px rgba(79,138,255,0.3); margin-top: 20px;
        }
        .su-submit:hover:not(:disabled) {
          background: #6b9eff;
          box-shadow: 0 0 36px rgba(79,138,255,0.44);
          transform: translateY(-1px);
        }
        .su-submit:disabled { opacity: 0.42; cursor: not-allowed; transform: none; }

        .su-spinner {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.2); border-top-color: #fff;
          border-radius: 50%; animation: su-spin 0.6s linear infinite;
        }
        @keyframes su-spin { to { transform: rotate(360deg); } }

        .su-divider { text-align: center; margin-top: 22px; font-size: 13px; color: #8893ae; }
        .su-divider a { color: #4f8aff; font-weight: 700; text-decoration: none; }
        .su-divider a:hover { text-decoration: underline; }

        .su-legal { margin-top: 16px; font-size: 11.5px; color: #44506a; text-align: center; line-height: 1.65; }
        .su-legal a { color: #4f8aff; text-decoration: none; font-weight: 600; }

        /* Right — Brand & Value */
        .su-right {
          display: flex; flex-direction: column; justify-content: center;
          padding: 60px 7vw;
          position: relative; z-index: 1;
          overflow: hidden;
        }

        .su-brand {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 52px; text-decoration: none; color: #f0f4ff;
          width: fit-content;
        }
        .su-brand-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: linear-gradient(135deg, #4f8aff, #7c5cfc);
          display: grid; place-items: center; font-size: 20px;
          box-shadow: 0 0 28px rgba(79,138,255,0.38), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .su-brand-name { font-family: 'Cabinet Grotesk', sans-serif; font-size: 16px; font-weight: 900; }

        .su-headline {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: clamp(32px, 4vw, 50px);
          font-weight: 900; line-height: 1.05;
          letter-spacing: -0.03em; margin-bottom: 18px;
        }
        .su-headline em {
          font-style: normal;
          background: linear-gradient(135deg, #4f8aff, #7c5cfc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .su-desc { font-size: 15px; color: #8893ae; line-height: 1.75; max-width: 400px; margin-bottom: 44px; }

        .su-credits-card {
          background: rgba(79,138,255,0.06);
          border: 1px solid rgba(79,138,255,0.2);
          border-radius: 16px; padding: 22px 24px;
          display: flex; align-items: flex-start; gap: 16px;
          max-width: 400px; margin-bottom: 36px;
        }
        .su-credits-icon { font-size: 30px; flex-shrink: 0; }
        .su-credits-title { font-family: 'Cabinet Grotesk', sans-serif; font-size: 15px; font-weight: 800; margin-bottom: 5px; }
        .su-credits-sub { font-size: 13px; color: #8893ae; line-height: 1.65; }

        .su-steps { display: flex; flex-direction: column; gap: 14px; max-width: 400px; }
        .su-step { display: flex; align-items: flex-start; gap: 13px; }
        .su-step-n {
          width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
          background: rgba(79,138,255,0.1); border: 1px solid rgba(79,138,255,0.22);
          display: grid; place-items: center;
          font-size: 11px; font-weight: 800; color: #4f8aff;
          margin-top: 1px;
        }
        .su-step-text { font-size: 13.5px; color: #8893ae; line-height: 1.6; }

        @media (max-width: 860px) {
          .su-page { grid-template-columns: 1fr; }
          .su-right { display: none; }
          .su-left { padding: 48px 24px; border-right: none; background: transparent; }
        }
      `}</style>

      <div className="su-page">
        {/* Left — Form */}
        <div className="su-left">
          <div className="su-box">
            <a href="/" className="su-back">← Back to home</a>

            <div className="su-title">Create your account</div>
            <div className="su-sub">Start free with 25 AI credits — no card needed</div>

            {error   && <div className="su-err"><span>⚠️</span> {error}</div>}
            {success && <div className="su-ok"><span>✓</span> {success}</div>}

            <form onSubmit={handleSignup}>
              <div className="su-field">
                <label className="su-label">Full name</label>
                <input
                  type="text"
                  className="su-input"
                  placeholder="Satyam Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                  autoFocus
                />
              </div>

              <div className="su-field">
                <label className="su-label">Email address</label>
                <input
                  type="email"
                  className="su-input"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="su-field">
                <label className="su-label">
                  Phone <span style={{ fontWeight: 400, textTransform: "none", color: "#44506a" }}>(optional)</span>
                </label>
                <input
                  type="tel"
                  className="su-input"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>

              <div className="su-field">
                <label className="su-label">Password</label>
                <div className="su-pw-wrap">
                  <input
                    type={showPw ? "text" : "password"}
                    className="su-input"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="su-eye"
                    onClick={() => setShowPw(!showPw)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button type="submit" className="su-submit" disabled={loading || !!success}>
                {loading ? (
                  <><span className="su-spinner" /> Creating account…</>
                ) : (
                  "Create free account →"
                )}
              </button>
            </form>

            <div className="su-divider">
              Already have an account? <a href="/login">Sign in</a>
            </div>

            <div className="su-legal">
              By signing up you agree to our{" "}
              <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </div>
          </div>
        </div>

        {/* Right — Brand / Info */}
        <div className="su-right">
          <a href="/" className="su-brand">
            <div className="su-brand-icon">🤖</div>
            <span className="su-brand-name">AI Job Copilot</span>
          </a>

          <div className="su-headline">
            Your job search,<br />
            <em>supercharged.</em>
          </div>
          <p className="su-desc">
            Thousands of ambitious job seekers use AI Job Copilot to apply 10× faster, track every opportunity, and land more interviews.
          </p>

          <div className="su-credits-card">
            <div className="su-credits-icon">⚡</div>
            <div>
              <div className="su-credits-title">25 free AI credits on signup</div>
              <div className="su-credits-sub">
                Enough to parse your resume, discover matched jobs, and generate your first interview prep pack. No credit card needed.
              </div>
            </div>
          </div>

          <div className="su-steps">
            {STEPS_INFO.map((s) => (
              <div key={s.n} className="su-step">
                <div className="su-step-n">{s.n}</div>
                <div className="su-step-text">{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
