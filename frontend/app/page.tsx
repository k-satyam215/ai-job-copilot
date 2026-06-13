"use client";

import { useState, useEffect, useRef } from "react";

const FEATURES = [
  { icon: "🧠", title: "AI Resume Parser", desc: "Upload once. AI extracts 40+ data points — skills, experience, education, projects — in under 10 seconds.", badge: "Core" },
  { icon: "⚡", title: "1-Click Auto-Fill", desc: "Chrome extension detects job forms and fills every field using your parsed profile. Apply in 4 seconds flat.", badge: "Popular" },
  { icon: "🎯", title: "AI Match Scoring", desc: "Every job gets a match score against your profile. Stop wasting time on roles you won't get.", badge: "Smart" },
  { icon: "📊", title: "Career Analytics", desc: "Full-funnel visibility — applications → interviews → offers. Know exactly where your search is failing.", badge: "Insights" },
  { icon: "🗺️", title: "AI Career Roadmap", desc: "Week-by-week personalised learning plan generated for your exact target role and skill gaps.", badge: "Growth" },
  { icon: "🎤", title: "Interview Agent", desc: "Role-specific technical and behavioral question banks with ideal answers, generated live by AI.", badge: "Prep" },
];

const STEPS = [
  { n: "01", icon: "📄", title: "Upload Your Resume", desc: "Drop your PDF. AI extracts your complete career profile — skills, experience, projects, education." },
  { n: "02", icon: "🔍", title: "Discover Matched Jobs", desc: "AI scours 20+ portals — Naukri, LinkedIn, Foundit, Indeed — and scores each role against your profile." },
  { n: "03", icon: "⚡", title: "Auto-Apply in 4 Seconds", desc: "Chrome extension fills the entire application form using your parsed data. One click, done." },
  { n: "04", icon: "📈", title: "Track & Improve", desc: "Analytics show your full funnel and which skills to upskill. Data-driven job searching." },
];

const PLANS = [
  {
    name: "Free", price: "₹0", period: "forever", highlight: false, accent: "#6b7280",
    features: ["25 AI credits / month", "Resume parsing & profile", "25 applications / day", "Chrome extension (manual)", "Basic analytics"],
    cta: "Start free", href: "/signup",
  },
  {
    name: "Pro", price: "₹1,900", period: "/mo", highlight: true, accent: "#4f8aff", badge: "Most Popular",
    features: ["1,000 AI credits / month", "Unlimited application tracking", "AI Auto-Fill extension", "Interview prep packs", "AI Career Roadmap", "Skill gap analysis", "500 jobs / day"],
    cta: "Upgrade to Pro", href: "/signup",
  },
  {
    name: "Elite", price: "₹4,900", period: "/mo", highlight: false, accent: "#7c5cfc",
    features: ["5,000 AI credits / month", "Everything in Pro", "Priority AI processing", "2,000 jobs / day", "Advanced analytics", "Priority support"],
    cta: "Go Elite", href: "/signup",
  },
];

const TESTIMONIALS = [
  { name: "Rohit M.", role: "SWE @ Zepto", avatar: "RM", color: "#4f8aff", stars: 5, text: "Got 3 interviews in my first week. The auto-fill alone saved me 6 hours of copy-pasting across different portals. This is the unfair advantage I needed." },
  { name: "Priya S.", role: "Product @ Razorpay", avatar: "PS", color: "#7c5cfc", stars: 5, text: "The roadmap feature told me exactly what to learn. Cleared my PM role in 8 weeks following the AI plan it generated just for me." },
  { name: "Arjun K.", role: "Data Science @ Meesho", avatar: "AK", color: "#22d3a0", stars: 5, text: "Match scores are surprisingly accurate. I stopped wasting time on poor-fit roles entirely. Got shortlisted at 4 companies in 2 weeks." },
  { name: "Sneha R.", role: "Frontend Dev @ Swiggy", avatar: "SR", color: "#f59e0b", stars: 5, text: "I was applying to 3-4 jobs a day manually. Now I discover 100+ matched jobs daily and apply to the best ones in minutes. Game changer." },
  { name: "Vikram T.", role: "Backend Eng @ CRED", avatar: "VT", color: "#ec4899", stars: 5, text: "The interview prep packs are insanely good. Role-specific questions with ideal answers. Walked into my interviews fully prepared." },
  { name: "Ananya B.", role: "ML Eng @ PhonePe", avatar: "AB", color: "#10b981", stars: 5, text: "Finally a job search tool built for Indian developers. Naukri + LinkedIn + Foundit all in one dashboard with AI scoring. Nothing else comes close." },
];

const TICKER_ITEMS = ["AI Resume Parsing", "Smart Auto-Fill", "Career Analytics", "AI Roadmap", "Interview Prep", "20+ Job Portals", "Match Scoring", "Skill Gap Analysis", "Cover Letter AI", "1-Click Apply", "Telegram Alerts", "Chrome Extension"];

const COMPARE = [
  { feature: "AI Resume Parsing", us: true, naukri: false, linkedin: false, jobhai: false },
  { feature: "Auto-Fill Chrome Extension", us: true, naukri: false, linkedin: false, jobhai: false },
  { feature: "AI Match Scoring (0–100)", us: true, naukri: false, linkedin: "partial", jobhai: false },
  { feature: "Career Roadmap Generator", us: true, naukri: false, linkedin: false, jobhai: false },
  { feature: "Interview Prep AI Agent", us: true, naukri: false, linkedin: "partial", jobhai: false },
  { feature: "Skill Gap Analysis", us: true, naukri: false, linkedin: false, jobhai: false },
  { feature: "20+ Portal Aggregation", us: true, naukri: false, linkedin: false, jobhai: false },
  { feature: "Real-time Telegram Alerts", us: true, naukri: false, linkedin: false, jobhai: false },
  { feature: "Full-Funnel Analytics", us: true, naukri: false, linkedin: "partial", jobhai: false },
  { feature: "Free Tier Available", us: true, naukri: true, linkedin: true, jobhai: true },
];

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

export default function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const statsRef = useInView(0.3);
  const featRef = useInView();
  const stepsRef = useInView();
  const plansRef = useInView();
  const testiRef = useInView();
  const ctaRef = useInView();
  const compareRef = useInView();

  const c1 = useCounter(12847, 2200, statsRef.visible);
  const c2 = useCounter(94, 1800, statsRef.visible);
  const c3 = useCounter(20, 1500, statsRef.visible);
  const c4 = useCounter(4, 1200, statsRef.visible);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cabinet+Grotesk:wght@400;500;700;800;900&display=swap');
        :root {
          --bg:#030508;--bg2:#060a14;--surface:rgba(255,255,255,0.028);--surface2:rgba(255,255,255,0.05);
          --border:rgba(255,255,255,0.065);--border2:rgba(255,255,255,0.12);
          --tx:#f0f4ff;--tx2:#8893ae;--tx3:#44506a;
          --ac:#4f8aff;--ac2:#7c5cfc;--green:#20d9a0;
          --r:14px;--r2:20px;
          --font-d:'Cabinet Grotesk','Plus Jakarta Sans',sans-serif;
          --font-b:'Plus Jakarta Sans',sans-serif;
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth;scroll-padding-top:80px}
        .lp{background:var(--bg);color:var(--tx);font-family:var(--font-b);-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .lp-bg{position:fixed;inset:0;z-index:0;pointer-events:none;
          background:radial-gradient(ellipse 90% 70% at 15% -5%,rgba(79,138,255,0.09) 0%,transparent 55%),
          radial-gradient(ellipse 70% 60% at 85% 95%,rgba(124,92,252,0.08) 0%,transparent 55%),
          radial-gradient(ellipse 50% 40% at 50% 50%,rgba(32,217,160,0.025) 0%,transparent 60%)}
        .lp-grid{position:fixed;inset:0;z-index:0;pointer-events:none;
          background-image:linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);
          background-size:48px 48px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 0%,transparent 100%)}
        @keyframes fade-up{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fade-in{from{opacity:0}to{opacity:1}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes ticker2{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(79,138,255,0.4)}100%{box-shadow:0 0 0 14px rgba(79,138,255,0)}}
        @keyframes glow-pulse{0%,100%{opacity:0.6}50%{opacity:1}}
        @keyframes float-slow{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .animate-fade-up{animation:fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both}
        .delay-1{animation-delay:0.1s}.delay-2{animation-delay:0.2s}.delay-3{animation-delay:0.3s}
        .delay-4{animation-delay:0.4s}.delay-5{animation-delay:0.5s}.delay-6{animation-delay:0.6s}
        .reveal{opacity:0;transform:translateY(28px);transition:opacity 0.65s cubic-bezier(0.16,1,0.3,1),transform 0.65s cubic-bezier(0.16,1,0.3,1)}
        .reveal.in{opacity:1;transform:translateY(0)}
        .reveal.d1{transition-delay:0.07s}.reveal.d2{transition-delay:0.14s}.reveal.d3{transition-delay:0.21s}
        .reveal.d4{transition-delay:0.28s}.reveal.d5{transition-delay:0.35s}.reveal.d6{transition-delay:0.42s}

        /* NAV */
        .lp-nav{position:fixed;top:0;left:0;right:0;z-index:999;height:64px;display:flex;align-items:center;
          padding:0 max(24px,5vw);justify-content:space-between;
          transition:background 0.3s,backdrop-filter 0.3s,border-color 0.3s;border-bottom:1px solid transparent}
        .lp-nav.scrolled{background:rgba(3,5,8,0.85);backdrop-filter:blur(24px);border-color:var(--border);box-shadow:0 1px 0 rgba(255,255,255,0.04)}
        .lp-logo{display:flex;align-items:center;gap:11px;font-family:var(--font-d);font-size:15px;font-weight:800;letter-spacing:-0.01em;color:var(--tx);text-decoration:none}
        .lp-logo-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--ac),var(--ac2));display:grid;place-items:center;font-size:18px;box-shadow:0 0 24px rgba(79,138,255,0.38);flex-shrink:0}
        .lp-logo-live{width:7px;height:7px;border-radius:50%;background:var(--green);animation:pulse-ring 2s infinite;flex-shrink:0}
        .lp-nav-links{display:flex;align-items:center;gap:32px}
        .lp-nav-links a{font-size:13.5px;font-weight:600;color:var(--tx2);text-decoration:none;transition:color 0.15s}
        .lp-nav-links a:hover{color:var(--tx)}
        .lp-nav-btns{display:flex;align-items:center;gap:8px}
        .btn-ghost-nav{padding:7px 18px;border-radius:8px;border:1px solid var(--border2);background:transparent;color:var(--tx);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s;font-family:var(--font-b);text-decoration:none;display:inline-flex;align-items:center}
        .btn-ghost-nav:hover{background:rgba(255,255,255,0.07)}
        .btn-solid-nav{padding:8px 20px;border-radius:8px;border:none;background:var(--ac);color:#fff;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.15s;font-family:var(--font-b);text-decoration:none;display:inline-flex;align-items:center;gap:6px;box-shadow:0 0 22px rgba(79,138,255,0.32)}
        .btn-solid-nav:hover{background:#6b9eff;transform:translateY(-1px)}
        .btn-hero{padding:15px 30px;border-radius:11px;border:none;background:var(--ac);color:#fff;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.16s;font-family:var(--font-b);text-decoration:none;display:inline-flex;align-items:center;gap:8px;box-shadow:0 0 36px rgba(79,138,255,0.36),0 4px 16px rgba(0,0,0,0.3)}
        .btn-hero:hover{background:#6b9eff;box-shadow:0 0 48px rgba(79,138,255,0.52);transform:translateY(-2px)}
        .btn-hero-outline{padding:14px 30px;border-radius:11px;border:1px solid var(--border2);background:rgba(255,255,255,0.04);color:var(--tx);font-size:15px;font-weight:600;cursor:pointer;transition:all 0.16s;font-family:var(--font-b);text-decoration:none;display:inline-flex;align-items:center;gap:8px;backdrop-filter:blur(10px)}
        .btn-hero-outline:hover{background:rgba(255,255,255,0.08);transform:translateY(-1px)}

        /* HERO */
        .lp-hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:120px max(24px,6vw) 60px;position:relative;z-index:1;max-width:1320px;margin:0 auto;width:100%}
        .lp-eyebrow{display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:99px;background:rgba(79,138,255,0.08);border:1px solid rgba(79,138,255,0.22);font-size:11.5px;font-weight:700;color:var(--ac);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:24px}
        .lp-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--ac);animation:glow-pulse 2s infinite}
        .lp-h1{font-family:var(--font-d);font-size:clamp(52px,7vw,100px);font-weight:900;line-height:0.93;letter-spacing:-0.04em;margin-bottom:26px;max-width:1000px}
        .lp-h1 .grad{background:linear-gradient(135deg,var(--ac) 0%,#a78bfa 50%,var(--ac2) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .lp-sub{font-size:clamp(16px,1.8vw,19px);color:var(--tx2);line-height:1.75;max-width:580px;margin-bottom:40px}
        .lp-cta-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:52px;align-items:center}
        .lp-cta-note{font-size:12px;color:var(--tx3);margin-top:8px}

        /* TRUST BADGES */
        .lp-trust{display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-bottom:60px}
        .lp-trust-item{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--tx3);font-weight:500}
        .lp-trust-check{width:16px;height:16px;border-radius:50%;background:rgba(32,217,160,0.15);border:1px solid rgba(32,217,160,0.3);display:grid;place-items:center;font-size:9px;color:var(--green);flex-shrink:0}

        /* STATS */
        .lp-stats-wrap{background:rgba(255,255,255,0.02);border:1px solid var(--border);border-radius:var(--r2);padding:32px 40px;display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-bottom:80px;position:relative;overflow:hidden}
        .lp-stats-wrap::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 50% 100%,rgba(79,138,255,0.04),transparent);pointer-events:none}
        .lp-stat{text-align:center;padding:0 20px;position:relative;z-index:1}
        .lp-stat:not(:last-child)::after{content:'';position:absolute;right:0;top:20%;bottom:20%;width:1px;background:var(--border2)}
        .lp-stat-v{font-family:var(--font-d);font-size:clamp(32px,3vw,48px);font-weight:900;color:var(--tx);letter-spacing:-0.03em;line-height:1}
        .lp-stat-l{font-size:12px;color:var(--tx3);margin-top:6px;font-weight:500}

        /* PREVIEW */
        .lp-preview-wrap{position:relative;width:100%;max-width:1100px;margin:0 auto;animation:fade-in 1s 0.5s ease both}
        .lp-preview-glow{position:absolute;inset:-60px;background:radial-gradient(ellipse 65% 55% at 50% 55%,rgba(79,138,255,0.08) 0%,transparent 65%);pointer-events:none;z-index:0}
        .lp-preview{position:relative;z-index:1;background:rgba(6,10,20,0.92);border:1px solid var(--border2);border-radius:var(--r2);box-shadow:0 32px 96px rgba(0,0,0,0.7),0 0 0 1px rgba(255,255,255,0.04);overflow:hidden;backdrop-filter:blur(10px)}
        .lp-preview-header{height:40px;background:rgba(255,255,255,0.025);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 16px;gap:6px}
        .lp-preview-dot{width:11px;height:11px;border-radius:50%}
        .lp-preview-url{margin-left:12px;flex:1;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:6px;height:22px;display:flex;align-items:center;padding:0 10px;font-size:10.5px;color:var(--tx3);font-family:monospace;max-width:280px}
        .lp-preview-body{display:grid;grid-template-columns:200px 1fr;min-height:360px}
        .lp-preview-sidebar{border-right:1px solid var(--border);padding:16px 12px;display:flex;flex-direction:column;gap:3px}
        .lp-preview-nav-item{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;font-size:12px;color:var(--tx2)}
        .lp-preview-nav-item.active{background:rgba(79,138,255,0.1);color:var(--ac);border:1px solid rgba(79,138,255,0.18)}
        .lp-preview-main{padding:20px}
        .lp-preview-stat-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px}
        .lp-preview-stat-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px 14px}
        .lp-preview-stat-v{font-family:var(--font-d);font-size:26px;font-weight:900;letter-spacing:-0.02em}
        .lp-preview-stat-l{font-size:10.5px;color:var(--tx2);margin-top:2px}
        .lp-preview-jobs{display:flex;flex-direction:column;gap:6px}
        .lp-preview-job{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center}
        .lp-preview-job-title{font-size:12px;font-weight:700}
        .lp-preview-job-co{font-size:10.5px;color:var(--tx2);margin-top:2px}
        .lp-match{padding:3px 9px;border-radius:99px;font-size:10.5px;font-weight:700;white-space:nowrap}
        .match-high{background:rgba(32,217,160,0.12);color:var(--green);border:1px solid rgba(32,217,160,0.22)}
        .match-mid{background:rgba(79,138,255,0.12);color:var(--ac);border:1px solid rgba(79,138,255,0.22)}

        /* TICKER */
        .lp-ticker-wrap{overflow:hidden;position:relative;z-index:1;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:rgba(255,255,255,0.012);padding:14px 0;margin:80px 0}
        .lp-ticker{display:flex;gap:56px;width:max-content;animation:ticker 30s linear infinite;white-space:nowrap}
        .lp-ticker2{display:flex;gap:56px;width:max-content;animation:ticker2 30s linear infinite;white-space:nowrap;margin-top:12px}
        .lp-ticker-item{display:flex;align-items:center;gap:10px;font-size:12.5px;font-weight:600;color:var(--tx3)}
        .lp-ticker-item span{color:var(--ac);font-size:10px}

        /* SECTIONS */
        .lp-section{padding:100px max(24px,6vw);position:relative;z-index:1;max-width:1320px;margin:0 auto}
        .lp-section-label{font-size:11px;font-weight:700;color:var(--ac);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:10px}
        .lp-section-h2{font-family:var(--font-d);font-size:clamp(32px,4.5vw,56px);font-weight:900;letter-spacing:-0.03em;line-height:1.05;margin-bottom:16px}
        .lp-section-sub{font-size:15px;color:var(--tx2);line-height:1.75;max-width:560px;margin-bottom:60px}

        /* FEATURES */
        .lp-feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .lp-feat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:26px;transition:all 0.2s cubic-bezier(0.16,1,0.3,1);position:relative;overflow:hidden;cursor:default}
        .lp-feat-card:hover{transform:translateY(-4px);border-color:rgba(79,138,255,0.3);box-shadow:0 16px 40px rgba(0,0,0,0.4)}
        .lp-feat-icon{width:46px;height:46px;border-radius:12px;background:rgba(79,138,255,0.08);border:1px solid rgba(79,138,255,0.16);display:grid;place-items:center;font-size:22px;margin-bottom:18px}
        .lp-feat-badge{display:inline-flex;padding:2px 9px;border-radius:99px;font-size:10px;font-weight:700;letter-spacing:0.06em;background:rgba(79,138,255,0.1);color:var(--ac);border:1px solid rgba(79,138,255,0.2);margin-bottom:12px}
        .lp-feat-title{font-family:var(--font-d);font-size:15px;font-weight:800;margin-bottom:8px}
        .lp-feat-desc{font-size:13.5px;color:var(--tx2);line-height:1.75}

        /* COMPARE */
        .lp-compare-wrap{overflow-x:auto;border-radius:var(--r2);border:1px solid var(--border)}
        .lp-compare{width:100%;border-collapse:collapse;font-size:13.5px}
        .lp-compare th{padding:16px 20px;text-align:center;font-size:12px;font-weight:700;color:var(--tx3);background:rgba(255,255,255,0.02);border-bottom:1px solid var(--border);white-space:nowrap}
        .lp-compare th:first-child{text-align:left}
        .lp-compare th.us{color:var(--ac);background:rgba(79,138,255,0.06)}
        .lp-compare td{padding:13px 20px;border-bottom:1px solid var(--border);color:var(--tx2)}
        .lp-compare td:first-child{color:var(--tx);font-weight:500}
        .lp-compare td:not(:first-child){text-align:center}
        .lp-compare tr:last-child td{border-bottom:none}
        .lp-compare tr:hover td{background:rgba(255,255,255,0.015)}
        .lp-compare td.us-col{background:rgba(79,138,255,0.04)}
        .chk-yes{color:var(--green);font-size:16px;font-weight:700}
        .chk-no{color:var(--tx3);font-size:14px}
        .chk-partial{color:#f59e0b;font-size:12px;font-weight:600}

        /* STEPS */
        .lp-steps-wrap{position:relative}
        .lp-steps-line{position:absolute;top:44px;left:calc(22px + 2%);right:calc(22px + 2%);height:1px;background:linear-gradient(90deg,transparent,var(--border2) 15%,var(--ac) 50%,var(--border2) 85%,transparent);z-index:0;pointer-events:none}
        .lp-steps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;position:relative;z-index:1}
        .lp-step{padding:0 20px 0 0}
        .lp-step-icon-wrap{position:relative;margin-bottom:22px}
        .lp-step-num{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--ac),var(--ac2));display:grid;place-items:center;font-family:var(--font-d);font-size:13px;font-weight:900;color:#fff;letter-spacing:0.05em;box-shadow:0 0 32px rgba(79,138,255,0.32);position:relative;z-index:1}
        .lp-step-emoji{position:absolute;bottom:-8px;right:-8px;width:26px;height:26px;border-radius:50%;background:var(--bg2);border:1px solid var(--border2);display:grid;place-items:center;font-size:12px}
        .lp-step-title{font-family:var(--font-d);font-size:15px;font-weight:800;margin-bottom:8px}
        .lp-step-desc{font-size:13px;color:var(--tx2);line-height:1.75}

        /* TESTIMONIALS */
        .lp-testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .lp-testi{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:26px;transition:all 0.2s}
        .lp-testi:hover{border-color:var(--border2);transform:translateY(-2px)}
        .lp-testi-stars{font-size:13px;margin-bottom:14px;letter-spacing:2px;color:#f59e0b}
        .lp-testi-text{font-size:14px;color:var(--tx);line-height:1.8;margin-bottom:20px}
        .lp-testi-meta{display:flex;align-items:center;gap:10px}
        .lp-testi-avatar{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}
        .lp-testi-name{font-size:13px;font-weight:700}
        .lp-testi-role{font-size:11px;color:var(--tx3);margin-top:2px}

        /* PRICING */
        .lp-plans-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}
        .lp-plan{background:var(--surface);border:1px solid var(--border);border-radius:var(--r2);padding:30px;position:relative;overflow:hidden;transition:all 0.2s}
        .lp-plan:hover{transform:translateY(-3px);box-shadow:0 20px 60px rgba(0,0,0,0.4)}
        .lp-plan.pop{background:rgba(79,138,255,0.04);border-color:rgba(79,138,255,0.3);box-shadow:0 0 0 1px rgba(79,138,255,0.15),0 12px 48px rgba(79,138,255,0.12)}
        .lp-plan-badge{position:absolute;top:16px;right:-24px;background:var(--ac);color:#fff;font-size:9px;font-weight:800;letter-spacing:0.1em;padding:4px 34px;transform:rotate(35deg);text-transform:uppercase}
        .lp-plan-name-tag{display:inline-flex;padding:3px 11px;border-radius:99px;font-size:11px;font-weight:700;margin-bottom:16px}
        .lp-plan-price{font-family:var(--font-d);font-size:46px;font-weight:900;letter-spacing:-0.03em;line-height:1;margin-bottom:4px}
        .lp-plan-period{font-size:13px;color:var(--tx2);margin-bottom:22px}
        .lp-plan-divider{height:1px;background:var(--border);margin-bottom:22px}
        .lp-plan-features{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:26px}
        .lp-plan-features li{font-size:13.5px;color:var(--tx2);display:flex;gap:9px;align-items:flex-start;line-height:1.5}
        .lp-plan-features li .check{color:var(--green);font-weight:700;flex-shrink:0;margin-top:1px}
        .lp-plan-cta{display:block;text-align:center;padding:12px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.15s;text-decoration:none;font-family:var(--font-b)}

        /* CTA */
        .lp-cta-banner{position:relative;overflow:hidden;background:linear-gradient(135deg,rgba(79,138,255,0.1) 0%,rgba(124,92,252,0.1) 100%);border:1px solid rgba(79,138,255,0.22);border-radius:24px;padding:72px 5%;text-align:center;z-index:1}

        /* FOOTER */
        .lp-footer{border-top:1px solid var(--border);padding:36px max(24px,6vw);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px;position:relative;z-index:1}
        .lp-footer-right{display:flex;gap:24px;align-items:center;flex-wrap:wrap}
        .lp-footer-right a{font-size:12.5px;color:var(--tx3);text-decoration:none;transition:color 0.15s}
        .lp-footer-right a:hover{color:var(--tx2)}
        .lp-footer-copy{font-size:12px;color:var(--tx3)}

        /* RESPONSIVE */
        @media(max-width:1024px){
          .lp-preview-body{grid-template-columns:1fr}.lp-preview-sidebar{display:none}
          .lp-feat-grid{grid-template-columns:1fr 1fr}.lp-plans-grid{grid-template-columns:1fr 1fr}
          .lp-testi-grid{grid-template-columns:1fr 1fr}.lp-stats-wrap{grid-template-columns:1fr 1fr}
        }
        @media(max-width:768px){
          .lp-nav-links{display:none}.lp-feat-grid{grid-template-columns:1fr}
          .lp-plans-grid{grid-template-columns:1fr}.lp-testi-grid{grid-template-columns:1fr}
          .lp-steps-grid{grid-template-columns:1fr 1fr;gap:24px}.lp-steps-line{display:none}
          .lp-stats-wrap{grid-template-columns:1fr 1fr;padding:24px}
          .lp-stat:nth-child(2)::after,.lp-stat:nth-child(4)::after{display:none}
          .lp-preview-stat-row{grid-template-columns:1fr 1fr}
        }
        @media(max-width:480px){
          .lp-stats-wrap{grid-template-columns:1fr}.lp-stat::after{display:none!important}
          .lp-steps-grid{grid-template-columns:1fr}.lp-plans-grid{grid-template-columns:1fr}
          .lp-h1{letter-spacing:-0.03em}
        }
      `}</style>

      <div className="lp">
        <div className="lp-bg" />
        <div className="lp-grid" />

        {/* NAV */}
        <nav className={`lp-nav ${navScrolled ? "scrolled" : ""}`}>
          <a href="/" className="lp-logo">
            <div className="lp-logo-icon">🤖</div>
            AI Job Copilot
            <div className="lp-logo-live" />
          </a>
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#compare">Compare</a>
            <a href="#pricing">Pricing</a>
            <a href="#reviews">Reviews</a>
          </div>
          <div className="lp-nav-btns">
            <a href="/login" className="btn-ghost-nav">Sign in</a>
            <a href="/signup" className="btn-solid-nav">Start free →</a>
          </div>
        </nav>

        {/* HERO */}
        <section>
          <div className="lp-hero">
            <div className="lp-eyebrow animate-fade-up">
              <span className="lp-eyebrow-dot" />
              India's Most Advanced AI Career Platform · 2025
            </div>

            <h1 className="lp-h1 animate-fade-up delay-1">
              Stop applying manually.<br />
              <span className="grad">Let AI land your dream job.</span>
            </h1>

            <p className="lp-sub animate-fade-up delay-2">
              Upload your resume once. AI parses your full profile, discovers matched jobs across 20+ portals, auto-fills every application in 4 seconds, and tracks every outcome — all in one command center.
            </p>

            <div className="lp-cta-row animate-fade-up delay-3">
              <a href="/signup" className="btn-hero">
                Start free — no card needed
                <span style={{ fontSize: 18 }}>→</span>
              </a>
              <a href="/login" className="btn-hero-outline">
                Sign in to dashboard
              </a>
            </div>

            <div className="lp-trust animate-fade-up delay-4">
              {["25 free AI credits", "No credit card required", "Setup in 5 minutes", "Cancel anytime"].map(t => (
                <div key={t} className="lp-trust-item">
                  <div className="lp-trust-check">✓</div>
                  {t}
                </div>
              ))}
            </div>

            {/* ANIMATED STATS */}
            <div ref={statsRef.ref} className="lp-stats-wrap animate-fade-up delay-5">
              <div className="lp-stat">
                <div className="lp-stat-v" style={{ color: "var(--ac)" }}>{c1.toLocaleString()}+</div>
                <div className="lp-stat-l">Job seekers helped</div>
              </div>
              <div className="lp-stat">
                <div className="lp-stat-v" style={{ color: "var(--green)" }}>{c2}%</div>
                <div className="lp-stat-l">Auto-fill accuracy</div>
              </div>
              <div className="lp-stat">
                <div className="lp-stat-v">{c3}+</div>
                <div className="lp-stat-l">Job portals covered</div>
              </div>
              <div className="lp-stat">
                <div className="lp-stat-v" style={{ color: "var(--ac2)" }}>{c4}s</div>
                <div className="lp-stat-l">To apply to any job</div>
              </div>
            </div>

            {/* DASHBOARD PREVIEW */}
            <div className="lp-preview-wrap">
              <div className="lp-preview-glow" />
              <div className="lp-preview">
                <div className="lp-preview-header">
                  <div className="lp-preview-dot" style={{ background: "#ff5f57" }} />
                  <div className="lp-preview-dot" style={{ background: "#febc2e" }} />
                  <div className="lp-preview-dot" style={{ background: "#28c840" }} />
                  <div className="lp-preview-url">ai-job-copilot-psi.vercel.app/dashboard</div>
                </div>
                <div className="lp-preview-body">
                  <div className="lp-preview-sidebar">
                    {[{icon:"⚡",label:"Dashboard",active:true},{icon:"📄",label:"Resume"},{icon:"📋",label:"Applications"},{icon:"📊",label:"Analytics"},{icon:"🎤",label:"Interview"},{icon:"🗺️",label:"Roadmap"},{icon:"💳",label:"Billing"}].map(item => (
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
                        <div className="lp-preview-stat-l">Applied Today</div>
                      </div>
                    </div>
                    <div className="lp-preview-jobs">
                      {[
                        { title: "Senior Frontend Engineer", co: "Razorpay · Bangalore", match: 94, hi: true },
                        { title: "Full Stack Developer", co: "Zepto · Mumbai", match: 88, hi: true },
                        { title: "React Developer", co: "Meesho · Remote", match: 79, hi: false },
                        { title: "Software Engineer II", co: "PhonePe · Pune", match: 73, hi: false },
                      ].map(j => (
                        <div key={j.title} className="lp-preview-job">
                          <div>
                            <div className="lp-preview-job-title">{j.title}</div>
                            <div className="lp-preview-job-co">{j.co}</div>
                          </div>
                          <div className={`lp-match ${j.hi ? "match-high" : "match-mid"}`}>{j.match}% match</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div className="lp-ticker-wrap">
          <div className="lp-ticker" aria-hidden>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <div key={i} className="lp-ticker-item"><span>✦</span> {item}</div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
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

        {/* HOW IT WORKS */}
        <div style={{ background: "rgba(255,255,255,0.012)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <section id="how-it-works" className="lp-section">
            <div className="lp-section-label">Process</div>
            <h2 className="lp-section-h2">From resume to offer<br />in 4 simple steps</h2>
            <p className="lp-section-sub">Set up in 5 minutes. Then let AI do the heavy lifting — discovery, matching, filling, and tracking.</p>
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

        {/* COMPARE */}
        <section id="compare" className="lp-section">
          <div className="lp-section-label">Comparison</div>
          <h2 className="lp-section-h2">Why job seekers choose<br />AI Job Copilot</h2>
          <p className="lp-section-sub">See how we stack up against every other tool in the market. No other platform comes close.</p>
          <div ref={compareRef.ref} className={`reveal ${compareRef.visible ? "in" : ""}`}>
            <div className="lp-compare-wrap">
              <table className="lp-compare">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Feature</th>
                    <th className="us">🤖 AI Job Copilot</th>
                    <th>Naukri</th>
                    <th>LinkedIn</th>
                    <th>JobHai</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map(row => (
                    <tr key={row.feature}>
                      <td>{row.feature}</td>
                      <td className="us-col"><span className="chk-yes">✓</span></td>
                      <td>{row.naukri === true ? <span className="chk-yes">✓</span> : row.naukri === "partial" ? <span className="chk-partial">partial</span> : <span className="chk-no">✗</span>}</td>
                      <td>{row.linkedin === true ? <span className="chk-yes">✓</span> : row.linkedin === "partial" ? <span className="chk-partial">partial</span> : <span className="chk-no">✗</span>}</td>
                      <td>{row.jobhai === true ? <span className="chk-yes">✓</span> : row.jobhai === "partial" ? <span className="chk-partial">partial</span> : <span className="chk-no">✗</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <div style={{ background: "rgba(255,255,255,0.012)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <section id="reviews" className="lp-section">
            <div className="lp-section-label">Social Proof</div>
            <h2 className="lp-section-h2">Loved by ambitious<br />Indian job seekers</h2>
            <p className="lp-section-sub">Real results from people who used AI to get ahead. Join thousands who already landed their dream roles.</p>
            <div ref={testiRef.ref} className="lp-testi-grid">
              {TESTIMONIALS.map((t, i) => (
                <div key={t.name} className={`lp-testi reveal ${testiRef.visible ? "in" : ""} d${i + 1}`}>
                  <div className="lp-testi-stars">{"★★★★★"}</div>
                  <div className="lp-testi-text">&ldquo;{t.text}&rdquo;</div>
                  <div className="lp-testi-meta">
                    <div className="lp-testi-avatar" style={{ background: `linear-gradient(135deg, ${t.color}, #4f8aff)` }}>{t.avatar}</div>
                    <div>
                      <div className="lp-testi-name">{t.name}</div>
                      <div className="lp-testi-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* PRICING */}
        <section id="pricing" className="lp-section">
          <div className="lp-section-label">Pricing</div>
          <h2 className="lp-section-h2">Simple, honest pricing</h2>
          <p className="lp-section-sub">Pay for AI credits, use them on features you need. No seat fees. No hidden charges. Cancel anytime.</p>
          <div ref={plansRef.ref} className="lp-plans-grid">
            {PLANS.map((p, i) => (
              <div key={p.name} className={`lp-plan ${p.highlight ? "pop" : ""} reveal ${plansRef.visible ? "in" : ""} d${i + 1}`}>
                {p.badge && <div className="lp-plan-badge">{p.badge}</div>}
                <div className="lp-plan-name-tag" style={{ background: `${p.accent}15`, color: p.accent, border: `1px solid ${p.accent}30` }}>{p.name}</div>
                <div className="lp-plan-price">{p.price}</div>
                <div className="lp-plan-period">{p.period}</div>
                <div className="lp-plan-divider" />
                <ul className="lp-plan-features">
                  {p.features.map(f => (<li key={f}><span className="check">✓</span>{f}</li>))}
                </ul>
                <a href={p.href} className="lp-plan-cta" style={{ background: p.highlight ? "var(--ac)" : "rgba(255,255,255,0.05)", color: p.highlight ? "#fff" : "var(--tx)", border: `1px solid ${p.highlight ? "transparent" : "var(--border2)"}`, boxShadow: p.highlight ? "0 0 24px rgba(79,138,255,0.3)" : "none" }}>
                  {p.cta} →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="lp-section">
          <div ref={ctaRef.ref} className={`lp-cta-banner reveal ${ctaRef.visible ? "in" : ""}`}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "clamp(32px,4.5vw,52px)", fontFamily: "var(--font-d)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 16 }}>
                Ready to land your dream job?
              </div>
              <p style={{ fontSize: 16, color: "var(--tx2)", marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
                Join 12,000+ Indian job seekers using AI to apply 10× faster. Free to start — no card needed.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/signup" className="btn-hero">Create free account →</a>
                <a href="#pricing" className="btn-hero-outline">View pricing</a>
              </div>
              <div style={{ marginTop: 24, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                {["No credit card", "25 free AI credits", "Setup in 5 min"].map(t => (
                  <div key={t} style={{ fontSize: 12, color: "var(--tx3)", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ color: "var(--green)" }}>✓</span> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,var(--ac),var(--ac2))", display: "grid", placeItems: "center", fontSize: 14 }}>🤖</div>
              <span style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: 14 }}>AI Job Copilot</span>
            </div>
            <div className="lp-footer-copy">© 2025 AI Job Copilot · India's #1 AI Career Platform</div>
          </div>
          <div className="lp-footer-right">
            <a href="#pricing">Pricing</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/refund">Refund Policy</a>
            <a href="/login">Login</a>
            <a href="/signup" style={{ color: "var(--ac)", fontWeight: 700 }}>Get Started Free →</a>
          </div>
        </footer>
      </div>
    </>
  );
}
