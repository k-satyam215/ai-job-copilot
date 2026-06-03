"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/* ─── DATA ─────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "🧠",
    title: "AI Resume Parser",
    desc: "Upload once. AI extracts 40+ data points — skills, experience, education, projects — in under 10 seconds.",
    badge: "Core",
  },
  {
    icon: "⚡",
    title: "1-Click Auto-Fill",
    desc: "Chrome extension detects job forms and fills every field using your parsed profile. Apply in 4 seconds flat.",
    badge: "Popular",
  },
  {
    icon: "🎯",
    title: "AI Match Scoring",
    desc: "Every job gets a match score against your profile. Stop wasting time on roles you won't get.",
    badge: "Smart",
  },
  {
    icon: "📊",
    title: "Career Analytics",
    desc: "Full-funnel visibility — applications → interviews → offers. Know exactly where your search is failing.",
    badge: "Insights",
  },
  {
    icon: "🗺️",
    title: "AI Career Roadmap",
    desc: "Week-by-week personalised learning plan generated for your exact target role and skill gaps.",
    badge: "Growth",
  },
  {
    icon: "🎤",
    title: "Interview Agent",
    desc: "Role-specific technical and behavioral question banks with ideal answers, generated live by AI.",
    badge: "Prep",
  },
];

const STEPS = [
  {
    n: "01",
    icon: "📄",
    title: "Upload Your Resume",
    desc: "Drop your PDF. AI extracts your complete career profile — skills, experience, projects, education.",
  },
  {
    n: "02",
    icon: "🔍",
    title: "Discover Matched Jobs",
    desc: "AI scours 20+ portals — Naukri, LinkedIn, Foundit, Indeed — and scores each role against your profile.",
  },
  {
    n: "03",
    icon: "⚡",
    title: "Auto-Apply in 4 Seconds",
    desc: "Chrome extension fills the entire application form using your parsed data. One click, done.",
  },
  {
    n: "04",
    icon: "📈",
    title: "Track & Improve",
    desc: "Analytics show your full funnel and which skills to upskill. Data-driven job searching.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    highlight: false,
    accent: "#6b7280",
    features: [
      "25 AI credits / month",
      "Resume parsing & profile",
      "25 applications / day",
      "Chrome extension (manual)",
      "Basic analytics",
    ],
    cta: "Start free",
    href: "/signup",
  },
  {
    name: "Pro",
    price: "₹1,900",
    period: "/mo",
    highlight: true,
    accent: "#4f8aff",
    badge: "Most Popular",
    features: [
      "1,000 AI credits / month",
      "Unlimited application tracking",
      "AI Auto-Fill extension",
      "Interview prep packs",
      "AI Career Roadmap",
      "Skill gap analysis",
      "500 jobs / day",
    ],
    cta: "Upgrade to Pro",
    href: "/signup",
  },
  {
    name: "Elite",
    price: "₹4,900",
    period: "/mo",
    highlight: false,
    accent: "#7c5cfc",
    features: [
      "5,000 AI credits / month",
      "Everything in Pro",
      "Priority AI processing",
      "2,000 jobs / day",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Go Elite",
    href: "/signup",
  },
];

const TESTIMONIALS = [
  {
    name: "Rohit M.",
    role: "SWE @ Zepto",
    avatar: "RM",
    color: "#4f8aff",
    stars: 5,
    text: "Got 3 interviews in my first week using this. The auto-fill alone saved me 6 hours of copy-pasting across different portals.",
  },
  {
    name: "Priya S.",
    role: "Product @ Razorpay",
    avatar: "PS",
    color: "#7c5cfc",
    stars: 5,
    text: "The roadmap feature told me exactly what to learn. Cleared my PM role in 8 weeks following the plan it generated for me.",
  },
  {
    name: "Arjun K.",
    role: "Data Science @ Meesho",
    avatar: "AK",
    color: "#22d3a0",
    stars: 5,
    text: "Match scores are surprisingly accurate. I stopped wasting time on poor-fit roles entirely — saved weeks of effort.",
  },
];

const TICKER_ITEMS = [
  "AI Resume Parsing",
  "Smart Auto-Fill",
  "Career Analytics",
  "AI Roadmap",
  "Interview Prep",
  "20+ Job Portals",
  "Match Scoring",
  "Skill Gap Analysis",
  "Cover Letter AI",
  "1-Click Apply",
];

/* ─── HOOKS ─────────────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── MAIN COMPONENT ────────────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter();
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const featRef = useInView();
  const stepsRef = useInView();
  const plansRef = useInView();
  const testiRef = useInView();
  const ctaRef = useInView();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cabinet+Grotesk:wght@400;500;700;800;900&display=swap');

        /* ── TOKENS ── */
        :root {
          --bg:        #030508;
          --bg2:       #060a14;
          --surface:   rgba(255,255,255,0.028);
          --surface2:  rgba(255,255,255,0.05);
          --border:    rgba(255,255,255,0.065);
          --border2:   rgba(255,255,255,0.12);
          --tx:        #f0f4ff;
          --tx2:       #8893ae;
          --tx3:       #44506a;
          --ac:        #4f8aff;
          --ac2:       #7c5cfc;
          --green:     #20d9a0;
          --r:         14px;
          --r2:        20px;
          --font-d:    'Cabinet Grotesk', 'Plus Jakarta Sans', sans-serif;
          --font-b:    'Plus Jakarta Sans', sans-serif;
        }

        /* ── RESET ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; scroll-padding-top: 80px; }

        .lp { background: var(--bg); color: var(--tx); font-family: var(--font-b); -webkit-font-smoothing: antialiased; overflow-x: hidden; }

        /* ── AMBIENT BACKGROUND ── */
        .lp-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 90% 70% at 15% -5%,  rgba(79,138,255,0.09) 0%, transparent 55%),
            radial-gradient(ellipse 70% 60% at 85% 95%,  rgba(124,92,252,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 50%,  rgba(32,217,160,0.025) 0%, transparent 60%);
        }

        /* Grid texture */
        .lp-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }

        /* ── ANIMATIONS ── */
        @keyframes fade-up   { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in   { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float     { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes ticker    { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(79,138,255,0.4); } 100% { box-shadow: 0 0 0 14px rgba(79,138,255,0); } }
        @keyframes glow-pulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }

        .animate-fade-up { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }
        .delay-6 { animation-delay: 0.6s; }

        .reveal       { opacity: 0; transform: translateY(28px); transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1); }
        .reveal.in    { opacity: 1; transform: translateY(0); }
        .reveal.d1    { transition-delay: 0.07s; }
        .reveal.d2    { transition-delay: 0.14s; }
        .reveal.d3    { transition-delay: 0.21s; }
        .reveal.d4    { transition-delay: 0.28s; }
        .reveal.d5    { transition-delay: 0.35s; }
        .reveal.d6    { transition-delay: 0.42s; }

        /* ── NAV ── */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 999;
          height: 64px; display: flex; align-items: center;
          padding: 0 max(24px, 5vw);
          justify-content: space-between;
          transition: background 0.3s, backdrop-filter 0.3s, border-color 0.3s, box-shadow 0.3s;
          border-bottom: 1px solid transparent;
        }
        .lp-nav.scrolled {
          background: rgba(3,5,8,0.82);
          backdrop-filter: blur(24px);
          border-color: var(--border);
          box-shadow: 0 1px 0 rgba(255,255,255,0.04);
        }
        .lp-logo {
          display: flex; align-items: center; gap: 11px;
          font-family: var(--font-d); font-size: 15px; font-weight: 800;
          letter-spacing: -0.01em; color: var(--tx); text-decoration: none;
        }
        .lp-logo-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, var(--ac), var(--ac2));
          display: grid; place-items: center; font-size: 18px;
          box-shadow: 0 0 24px rgba(79,138,255,0.38), inset 0 1px 0 rgba(255,255,255,0.2);
          flex-shrink: 0;
        }
        .lp-logo-live {
          width: 7px; height: 7px; border-radius: 50%; background: var(--green);
          animation: pulse-ring 2s infinite;
          flex-shrink: 0;
        }
        .lp-nav-links { display: flex; align-items: center; gap: 32px; }
        .lp-nav-links a {
          font-size: 13.5px; font-weight: 600; color: var(--tx2);
          text-decoration: none; transition: color 0.15s; letter-spacing: 0.01em;
        }
        .lp-nav-links a:hover { color: var(--tx); }
        .lp-nav-btns { display: flex; align-items: center; gap: 8px; }

        /* ── BUTTONS ── */
        .btn-ghost-nav {
          padding: 7px 18px; border-radius: 8px; border: 1px solid var(--border2);
          background: transparent; color: var(--tx); font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.15s; font-family: var(--font-b);
          text-decoration: none; display: inline-flex; align-items: center;
        }
        .btn-ghost-nav:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.18); }
        .btn-solid-nav {
          padding: 8px 20px; border-radius: 8px; border: none;
          background: var(--ac); color: #fff; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.15s; font-family: var(--font-b);
          text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
          box-shadow: 0 0 22px rgba(79,138,255,0.32);
        }
        .btn-solid-nav:hover { background: #6b9eff; box-shadow: 0 0 32px rgba(79,138,255,0.48); transform: translateY(-1px); }

        .btn-hero {
          padding: 15px 30px; border-radius: 11px; border: none;
          background: var(--ac); color: #fff; font-size: 15px; font-weight: 700;
          cursor: pointer; transition: all 0.16s; font-family: var(--font-b);
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 0 36px rgba(79,138,255,0.36), 0 4px 16px rgba(0,0,0,0.3);
        }
        .btn-hero:hover { background: #6b9eff; box-shadow: 0 0 48px rgba(79,138,255,0.52), 0 6px 20px rgba(0,0,0,0.4); transform: translateY(-2px); }
        .btn-hero-outline {
          padding: 14px 30px; border-radius: 11px; border: 1px solid var(--border2);
          background: rgba(255,255,255,0.04); color: var(--tx); font-size: 15px; font-weight: 600;
          cursor: pointer; transition: all 0.16s; font-family: var(--font-b);
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
          backdrop-filter: blur(10px);
        }
        .btn-hero-outline:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.22); transform: translateY(-1px); }

        /* ── HERO ── */
        .lp-hero {
          min-height: 100vh;
          display: flex; flex-direction: column; justify-content: center; align-items: flex-start;
          padding: 120px max(24px, 6vw) 80px;
          position: relative; z-index: 1;
          max-width: 1320px; margin: 0 auto; width: 100%;
        }
        .lp-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px; border-radius: 99px;
          background: rgba(79,138,255,0.08); border: 1px solid rgba(79,138,255,0.22);
          font-size: 11.5px; font-weight: 700; color: var(--ac);
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 24px;
        }
        .lp-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ac); animation: glow-pulse 2s infinite; }
        .lp-h1 {
          font-family: var(--font-d);
          font-size: clamp(52px, 7vw, 96px);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -0.04em;
          margin-bottom: 26px;
          max-width: 900px;
        }
        .lp-h1 .grad {
          background: linear-gradient(135deg, var(--ac) 0%, #7fb3ff 40%, var(--ac2) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lp-sub {
          font-size: clamp(16px, 1.8vw, 19px);
          color: var(--tx2); line-height: 1.75;
          max-width: 580px; margin-bottom: 40px;
        }
        .lp-cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 64px; }

        /* HERO STATS */
        .lp-stats {
          display: flex; gap: 40px; flex-wrap: wrap;
          padding: 0 1px;
        }
        .lp-stat { }
        .lp-stat-v {
          font-family: var(--font-d);
          font-size: 36px; font-weight: 900;
          color: var(--tx); letter-spacing: -0.03em; line-height: 1;
        }
        .lp-stat-l { font-size: 12px; color: var(--tx3); margin-top: 4px; font-weight: 500; }
        .lp-stat-sep { width: 1px; background: var(--border2); align-self: stretch; }

        /* FLOATING PREVIEW CARD */
        .lp-preview-wrap {
          position: relative; width: 100%;
          margin-top: 80px;
          max-width: 1100px; margin-left: auto; margin-right: auto;
          animation: fade-in 1s 0.5s ease both;
        }
        .lp-preview-glow {
          position: absolute; inset: -60px;
          background: radial-gradient(ellipse 65% 55% at 50% 55%, rgba(79,138,255,0.08) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .lp-preview {
          position: relative; z-index: 1;
          background: rgba(6,10,20,0.92);
          border: 1px solid var(--border2);
          border-radius: var(--r2);
          box-shadow: 0 32px 96px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04);
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .lp-preview-header {
          height: 40px; background: rgba(255,255,255,0.025);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; padding: 0 16px; gap: 6px;
        }
        .lp-preview-dot { width: 11px; height: 11px; border-radius: 50%; }
        .lp-preview-url {
          margin-left: 12px; flex: 1;
          background: rgba(255,255,255,0.04); border: 1px solid var(--border);
          border-radius: 6px; height: 22px; display: flex; align-items: center;
          padding: 0 10px; font-size: 10.5px; color: var(--tx3); font-family: monospace;
          max-width: 280px;
        }
        .lp-preview-body {
          display: grid; grid-template-columns: 200px 1fr;
          min-height: 340px;
        }
        .lp-preview-sidebar {
          border-right: 1px solid var(--border);
          padding: 16px 12px;
          display: flex; flex-direction: column; gap: 3px;
        }
        .lp-preview-nav-item {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 10px; border-radius: 7px;
          font-size: 12px; color: var(--tx2);
        }
        .lp-preview-nav-item.active {
          background: rgba(79,138,255,0.1); color: var(--ac);
          border: 1px solid rgba(79,138,255,0.18);
        }
        .lp-preview-main { padding: 20px; }
        .lp-preview-stat-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 16px; }
        .lp-preview-stat-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 10px; padding: 12px 14px;
        }
        .lp-preview-stat-v { font-family: var(--font-d); font-size: 26px; font-weight: 900; letter-spacing: -0.02em; }
        .lp-preview-stat-l { font-size: 10.5px; color: var(--tx2); margin-top: 2px; }
        .lp-preview-jobs { display: flex; flex-direction: column; gap: 6px; }
        .lp-preview-job {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; padding: 10px 12px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .lp-preview-job-title { font-size: 12px; font-weight: 700; }
        .lp-preview-job-co { font-size: 10.5px; color: var(--tx2); margin-top: 2px; }
        .lp-match {
          padding: 3px 9px; border-radius: 99px;
          font-size: 10.5px; font-weight: 700; white-space: nowrap;
        }
        .match-high { background: rgba(32,217,160,0.12); color: var(--green); border: 1px solid rgba(32,217,160,0.22); }
        .match-mid  { background: rgba(79,138,255,0.12); color: var(--ac);    border: 1px solid rgba(79,138,255,0.22); }

        /* ── TICKER ── */
        .lp-ticker-wrap {
          overflow: hidden; position: relative; z-index: 1;
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,0.012); padding: 14px 0;
          margin: 100px 0;
        }
        .lp-ticker { display: flex; gap: 56px; width: max-content; animation: ticker 30s linear infinite; white-space: nowrap; }
        .lp-ticker-item { display: flex; align-items: center; gap: 10px; font-size: 12.5px; font-weight: 600; color: var(--tx3); }
        .lp-ticker-item span { color: var(--ac); font-size: 10px; }

        /* ── SECTIONS ── */
        .lp-section { padding: 100px max(24px, 6vw); position: relative; z-index: 1; max-width: 1320px; margin: 0 auto; }
        .lp-section-full { padding: 100px max(24px, 6vw); position: relative; z-index: 1; }

        .lp-section-label { font-size: 11px; font-weight: 700; color: var(--ac); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 10px; }
        .lp-section-h2 {
          font-family: var(--font-d);
          font-size: clamp(32px, 4.5vw, 56px);
          font-weight: 900; letter-spacing: -0.03em; line-height: 1.05;
          margin-bottom: 16px;
        }
        .lp-section-sub { font-size: 15px; color: var(--tx2); line-height: 1.75; max-width: 560px; margin-bottom: 60px; }

        /* ── FEATURES ── */
        .lp-feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .lp-feat-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--r); padding: 26px;
          transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
          position: relative; overflow: hidden;
        }
        .lp-feat-card::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(79,138,255,0.04), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .lp-feat-card:hover { transform: translateY(-4px); border-color: rgba(79,138,255,0.3); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
        .lp-feat-card:hover::after { opacity: 1; }
        .lp-feat-icon {
          width: 46px; height: 46px; border-radius: 12px;
          background: rgba(79,138,255,0.08); border: 1px solid rgba(79,138,255,0.16);
          display: grid; place-items: center; font-size: 22px;
          margin-bottom: 18px;
        }
        .lp-feat-badge {
          display: inline-flex; align-items: center;
          padding: 2px 9px; border-radius: 99px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
          background: rgba(79,138,255,0.1); color: var(--ac);
          border: 1px solid rgba(79,138,255,0.2);
          margin-bottom: 12px;
        }
        .lp-feat-title { font-family: var(--font-d); font-size: 15px; font-weight: 800; margin-bottom: 8px; }
        .lp-feat-desc { font-size: 13.5px; color: var(--tx2); line-height: 1.75; }

        /* ── STEPS ── */
        .lp-steps-wrap { position: relative; }
        .lp-steps-line {
          position: absolute; top: 44px; left: calc(22px + 2%); right: calc(22px + 2%);
          height: 1px; background: linear-gradient(90deg, transparent, var(--border2) 15%, var(--ac) 50%, var(--border2) 85%, transparent);
          z-index: 0; pointer-events: none;
        }
        .lp-steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; position: relative; z-index: 1; }
        .lp-step { padding: 0 20px 0 0; }
        .lp-step-icon-wrap { position: relative; margin-bottom: 22px; }
        .lp-step-num {
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, var(--ac), var(--ac2));
          display: grid; place-items: center;
          font-family: var(--font-d); font-size: 13px; font-weight: 900;
          color: #fff; letter-spacing: 0.05em;
          box-shadow: 0 0 32px rgba(79,138,255,0.32);
          position: relative; z-index: 1;
        }
        .lp-step-emoji {
          position: absolute; bottom: -8px; right: -8px;
          width: 26px; height: 26px; border-radius: 50%;
          background: var(--bg2); border: 1px solid var(--border2);
          display: grid; place-items: center; font-size: 12px;
        }
        .lp-step-title { font-family: var(--font-d); font-size: 15px; font-weight: 800; margin-bottom: 8px; }
        .lp-step-desc { font-size: 13px; color: var(--tx2); line-height: 1.75; }

        /* ── TESTIMONIALS ── */
        .lp-testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .lp-testi {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--r); padding: 26px;
          transition: all 0.2s;
        }
        .lp-testi:hover { border-color: var(--border2); transform: translateY(-2px); }
        .lp-testi-stars { font-size: 14px; margin-bottom: 14px; letter-spacing: 2px; }
        .lp-testi-text { font-size: 14px; color: var(--tx); line-height: 1.8; margin-bottom: 20px; font-style: italic; }
        .lp-testi-meta { display: flex; align-items: center; gap: 10px; }
        .lp-testi-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          display: grid; place-items: center;
          font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
        }
        .lp-testi-name { font-size: 13px; font-weight: 700; }
        .lp-testi-role { font-size: 11px; color: var(--tx3); margin-top: 2px; }

        /* ── PRICING ── */
        .lp-plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; align-items: start; }
        .lp-plan {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--r2); padding: 30px;
          position: relative; overflow: hidden;
          transition: all 0.2s;
        }
        .lp-plan:hover { transform: translateY(-3px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
        .lp-plan.pop {
          background: rgba(79,138,255,0.04);
          border-color: rgba(79,138,255,0.3);
          box-shadow: 0 0 0 1px rgba(79,138,255,0.15), 0 12px 48px rgba(79,138,255,0.12);
        }
        .lp-plan-badge {
          position: absolute; top: 16px; right: -24px;
          background: var(--ac); color: #fff;
          font-size: 9px; font-weight: 800; letter-spacing: 0.1em;
          padding: 4px 34px; transform: rotate(35deg);
          text-transform: uppercase;
        }
        .lp-plan-name-tag {
          display: inline-flex; align-items: center;
          padding: 3px 11px; border-radius: 99px;
          font-size: 11px; font-weight: 700;
          margin-bottom: 16px;
        }
        .lp-plan-price {
          font-family: var(--font-d); font-size: 46px;
          font-weight: 900; letter-spacing: -0.03em;
          line-height: 1; margin-bottom: 4px;
        }
        .lp-plan-period { font-size: 13px; color: var(--tx2); margin-bottom: 22px; }
        .lp-plan-divider { height: 1px; background: var(--border); margin-bottom: 22px; }
        .lp-plan-features { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 26px; }
        .lp-plan-features li { font-size: 13.5px; color: var(--tx2); display: flex; gap: 9px; align-items: flex-start; line-height: 1.5; }
        .lp-plan-features li .check { color: var(--green); font-weight: 700; flex-shrink: 0; margin-top: 1px; }
        .lp-plan-cta {
          display: block; text-align: center; padding: 12px;
          border-radius: 10px; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: all 0.15s; text-decoration: none;
          font-family: var(--font-b);
        }

        /* ── CTA BANNER ── */
        .lp-cta-banner {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, rgba(79,138,255,0.1) 0%, rgba(124,92,252,0.1) 100%);
          border: 1px solid rgba(79,138,255,0.22);
          border-radius: 24px; padding: 72px 5%; text-align: center;
          z-index: 1;
        }
        .lp-cta-banner::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 60% at 50% 100%, rgba(79,138,255,0.12), transparent);
          pointer-events: none;
        }

        /* ── FOOTER ── */
        .lp-footer {
          border-top: 1px solid var(--border);
          padding: 36px max(24px, 6vw);
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 20px;
          position: relative; z-index: 1;
        }
        .lp-footer-right { display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
        .lp-footer-right a { font-size: 12.5px; color: var(--tx3); text-decoration: none; transition: color 0.15s; }
        .lp-footer-right a:hover { color: var(--tx2); }
        .lp-footer-copy { font-size: 12px; color: var(--tx3); }

        /* ── MOBILE MENU TOGGLE ── */
        .lp-hamburger { display: none; background: none; border: none; cursor: pointer; color: var(--tx); font-size: 20px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .lp-preview-body { grid-template-columns: 1fr; }
          .lp-preview-sidebar { display: none; }
          .lp-feat-grid { grid-template-columns: 1fr 1fr; }
          .lp-plans-grid { grid-template-columns: 1fr 1fr; }
          .lp-testi-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .lp-nav-links { display: none; }
          .lp-hamburger { display: block; }
          .lp-feat-grid { grid-template-columns: 1fr; }
          .lp-plans-grid { grid-template-columns: 1fr; }
          .lp-testi-grid { grid-template-columns: 1fr; }
          .lp-steps-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
          .lp-steps-line { display: none; }
          .lp-stat-sep { display: none; }
          .lp-preview-stat-row { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .lp-stats { gap: 24px; }
          .lp-steps-grid { grid-template-columns: 1fr; }
          .lp-plans-grid { grid-template-columns: 1fr; }
          .lp-h1 { letter-spacing: -0.03em; }
          .lp-preview-stat-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="lp">
        <div className="lp-bg" />
        <div className="lp-grid" />

        {/* ═══════════════════════════════════ NAV */}
        <nav className={`lp-nav ${navScrolled ? "scrolled" : ""}`}>
          <a href="/" className="lp-logo">
            <div className="lp-logo-icon">🤖</div>
            AI Job Copilot
            <div className="lp-logo-live" />
          </a>
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Reviews</a>
          </div>
          <div className="lp-nav-btns">
            <a href="/login" className="btn-ghost-nav">Sign in</a>
            <a href="/signup" className="btn-solid-nav">Start free →</a>
          </div>
        </nav>

        {/* ═══════════════════════════════════ HERO */}
        <section>
          <div className="lp-hero">
            <div className="lp-eyebrow animate-fade-up">
              <span className="lp-eyebrow-dot" />
              AI-Powered Career Platform · India's #1
            </div>

            <h1 className="lp-h1 animate-fade-up delay-1">
              Apply 10× faster.<br />
              <span className="grad">Land your dream job.</span>
            </h1>

            <p className="lp-sub animate-fade-up delay-2">
              Upload your resume once. AI parses your full profile, discovers matched jobs across 20+ portals, auto-fills applications in 4 seconds, and tracks every outcome — all from one command center.
            </p>

            <div className="lp-cta-row animate-fade-up delay-3">
              <a href="/signup" className="btn-hero">
                Start free — 25 AI credits
                <span style={{ fontSize: 18 }}>→</span>
              </a>
              <a href="/login" className="btn-hero-outline">
                Sign in
              </a>
            </div>

            <div className="lp-stats animate-fade-up delay-4">
              <div className="lp-stat">
                <div className="lp-stat-v">10×</div>
                <div className="lp-stat-l">Faster applications</div>
              </div>
              <div className="lp-stat-sep" />
              <div className="lp-stat">
                <div className="lp-stat-v">94%</div>
                <div className="lp-stat-l">Auto-fill accuracy</div>
              </div>
              <div className="lp-stat-sep" />
              <div className="lp-stat">
                <div className="lp-stat-v">20+</div>
                <div className="lp-stat-l">Job portals covered</div>
              </div>
              <div className="lp-stat-sep" />
              <div className="lp-stat">
                <div className="lp-stat-v">Free</div>
                <div className="lp-stat-l">To start, always</div>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="lp-preview-wrap">
              <div className="lp-preview-glow" />
              <div className="lp-preview">
                <div className="lp-preview-header">
                  <div className="lp-preview-dot" style={{ background: "#ff5f57" }} />
                  <div className="lp-preview-dot" style={{ background: "#febc2e" }} />
                  <div className="lp-preview-dot" style={{ background: "#28c840" }} />
                  <div className="lp-preview-url">app.aijobcopilot.in/dashboard</div>
                </div>
                <div className="lp-preview-body">
                  <div className="lp-preview-sidebar">
                    {[
                      { icon: "⚡", label: "Dashboard", active: true },
                      { icon: "📄", label: "Resume" },
                      { icon: "📋", label: "Applications" },
                      { icon: "📊", label: "Analytics" },
                      { icon: "🎤", label: "Interview" },
                      { icon: "🗺️", label: "Roadmap" },
                    ].map((item) => (
                      <div key={item.label} className={`lp-preview-nav-item ${item.active ? "active" : ""}`}>
                        <span>{item.icon}</span>
                        <span style={{ fontSize: 11.5 }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="lp-preview-main">
                    <div className="lp-preview-stat-row">
                      <div className="lp-preview-stat-card">
                        <div className="lp-preview-stat-v" style={{ color: "var(--ac)" }}>247</div>
                        <div className="lp-preview-stat-l">Jobs Today</div>
                      </div>
                      <div className="lp-preview-stat-card">
                        <div className="lp-preview-stat-v" style={{ color: "var(--green)" }}>38</div>
                        <div className="lp-preview-stat-l">High Matches</div>
                      </div>
                      <div className="lp-preview-stat-card">
                        <div className="lp-preview-stat-v">12</div>
                        <div className="lp-preview-stat-l">Applied</div>
                      </div>
                    </div>
                    <div className="lp-preview-jobs">
                      {[
                        { title: "Senior Frontend Engineer", co: "Razorpay · Bangalore", match: 94, hi: true },
                        { title: "Full Stack Developer", co: "Zepto · Mumbai", match: 88, hi: true },
                        { title: "React Developer", co: "Meesho · Remote", match: 76, hi: false },
                        { title: "Software Engineer II", co: "PhonePe · Pune", match: 71, hi: false },
                      ].map((j) => (
                        <div key={j.title} className="lp-preview-job">
                          <div>
                            <div className="lp-preview-job-title">{j.title}</div>
                            <div className="lp-preview-job-co">{j.co}</div>
                          </div>
                          <div className={`lp-match ${j.hi ? "match-high" : "match-mid"}`}>
                            {j.match}% match
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════ TICKER */}
        <div className="lp-ticker-wrap">
          <div className="lp-ticker" aria-hidden>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <div key={i} className="lp-ticker-item">
                <span>✦</span> {item}
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════ FEATURES */}
        <section id="features" className="lp-section">
          <div className="lp-section-label">Everything you need</div>
          <h2 className="lp-section-h2">Your complete career<br />operating system</h2>
          <p className="lp-section-sub">Every feature is purpose-built for one goal — getting you hired faster, with less manual work and more clarity.</p>

          <div ref={featRef.ref} className="lp-feat-grid">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`lp-feat-card reveal ${featRef.visible ? "in" : ""} d${i + 1}`}>
                <div className="lp-feat-icon">{f.icon}</div>
                <div className="lp-feat-badge">{f.badge}</div>
                <div className="lp-feat-title">{f.title}</div>
                <div className="lp-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════ HOW IT WORKS */}
        <div style={{ background: "rgba(255,255,255,0.012)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <section id="how-it-works" className="lp-section">
            <div className="lp-section-label">Process</div>
            <h2 className="lp-section-h2">From resume to offer<br />in 4 simple steps</h2>
            <p className="lp-section-sub">Set up in 5 minutes. Then let the AI do the heavy lifting — discovery, matching, filling, and tracking.</p>

            <div ref={stepsRef.ref} className="lp-steps-wrap">
              <div className="lp-steps-line" />
              <div className="lp-steps-grid">
                {STEPS.map((s, i) => (
                  <div key={s.n} className={`lp-step reveal ${stepsRef.visible ? "in" : ""} d${i + 1}`}>
                    <div className="lp-step-icon-wrap">
                      <div className="lp-step-num">{s.n}</div>
                      <div className="lp-step-emoji">{s.icon}</div>
                    </div>
                    <div className="lp-step-title">{s.title}</div>
                    <div className="lp-step-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ═══════════════════════════════════ TESTIMONIALS */}
        <section id="testimonials" className="lp-section">
          <div className="lp-section-label">Social Proof</div>
          <h2 className="lp-section-h2">Trusted by ambitious<br />job seekers</h2>
          <p className="lp-section-sub">Real results from people who took their job search seriously and used AI to get ahead.</p>

          <div ref={testiRef.ref} className="lp-testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`lp-testi reveal ${testiRef.visible ? "in" : ""} d${i + 1}`}>
                <div className="lp-testi-stars">{"★".repeat(t.stars)}</div>
                <div className="lp-testi-text">&ldquo;{t.text}&rdquo;</div>
                <div className="lp-testi-meta">
                  <div className="lp-testi-avatar" style={{ background: `linear-gradient(135deg, ${t.color}, #4f8aff)` }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="lp-testi-name">{t.name}</div>
                    <div className="lp-testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════ PRICING */}
        <div style={{ background: "rgba(255,255,255,0.012)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <section id="pricing" className="lp-section">
            <div className="lp-section-label">Pricing</div>
            <h2 className="lp-section-h2">Simple, honest pricing</h2>
            <p className="lp-section-sub">Buy AI credits, use them on features you need. No seat fees. No hidden charges. Cancel anytime.</p>

            <div ref={plansRef.ref} className="lp-plans-grid">
              {PLANS.map((p, i) => (
                <div key={p.name} className={`lp-plan ${p.highlight ? "pop" : ""} reveal ${plansRef.visible ? "in" : ""} d${i + 1}`}>
                  {p.badge && <div className="lp-plan-badge">{p.badge}</div>}
                  <div
                    className="lp-plan-name-tag"
                    style={{
                      background: `${p.accent}15`,
                      color: p.accent,
                      border: `1px solid ${p.accent}30`,
                    }}
                  >
                    {p.name}
                  </div>
                  <div className="lp-plan-price">{p.price}</div>
                  <div className="lp-plan-period">{p.period}</div>
                  <div className="lp-plan-divider" />
                  <ul className="lp-plan-features">
                    {p.features.map((f) => (
                      <li key={f}>
                        <span className="check">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={p.href}
                    className="lp-plan-cta"
                    style={{
                      background: p.highlight ? "var(--ac)" : "rgba(255,255,255,0.05)",
                      color: p.highlight ? "#fff" : "var(--tx)",
                      border: `1px solid ${p.highlight ? "transparent" : "var(--border2)"}`,
                      boxShadow: p.highlight ? "0 0 24px rgba(79,138,255,0.3)" : "none",
                    }}
                  >
                    {p.cta} →
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ═══════════════════════════════════ CTA BANNER */}
        <section className="lp-section">
          <div ref={ctaRef.ref} className={`lp-cta-banner reveal ${ctaRef.visible ? "in" : ""}`}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "clamp(32px,4.5vw,52px)", fontFamily: "var(--font-d)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 16 }}>
                Ready to land your dream job?
              </div>
              <p style={{ fontSize: 16, color: "var(--tx2)", marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
                Join thousands of Indian job seekers using AI to cut their search time in half. Free to start — no card needed.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/signup" className="btn-hero">
                  Create free account →
                </a>
                <a href="/pricing" className="btn-hero-outline">
                  View pricing
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════ FOOTER */}
        <footer className="lp-footer">
          <div>
            <div className="lp-logo" style={{ marginBottom: 6 }}>
              <div className="lp-logo-icon" style={{ width: 28, height: 28, fontSize: 14, borderRadius: 8 }}>🤖</div>
              AI Job Copilot
            </div>
            <div className="lp-footer-copy">© 2025 AI Job Copilot. Career Productivity SaaS.</div>
          </div>
          <div className="lp-footer-right">
            <a href="/pricing">Pricing</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/refund">Refund Policy</a>
            <a href="/login">Login</a>
          </div>
        </footer>
      </div>
    </>
  );
}
