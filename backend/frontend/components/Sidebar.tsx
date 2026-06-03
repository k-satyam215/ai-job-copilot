"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api, clearSession } from "../lib/api";

const navItems = [
  { href: "/dashboard",   icon: "⚡", label: "Dashboard" },
  { href: "/resume",      icon: "📄", label: "Resume" },
  { href: "/applications",icon: "📋", label: "Applications" },
  { href: "/analytics",   icon: "📊", label: "Analytics" },
  { href: "/interview",   icon: "🎤", label: "Interview Prep" },
  { href: "/roadmap",     icon: "🗺️", label: "Roadmap" },
  { href: "/billing",     icon: "💳", label: "Billing" },
  { href: "/settings",    icon: "⚙️", label: "Settings" },
];

const PLAN_COLORS: Record<string, string> = {
  free: "#6b7280",
  pro: "#4f8aff",
  elite: "#7c5cf8",
  enterprise: "#22d3a0",
};

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get("/auth/me").then((res) => setUser(res.data)).catch(() => {});
  }, []);

  const initial = (user?.full_name || user?.email || "U")[0].toUpperCase();
  const planColor = PLAN_COLORS[user?.plan || "free"] || "#6b7280";

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">🤖</div>
        <div className="brand-name">
          AI Job Copilot
          <span>Career Agent</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`nav-link ${pathname === item.href ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        {/* Credits bar */}
        {user && (
          <div style={{ padding: "0 4px 12px", fontSize: 11, color: "var(--text-3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>AI Credits</span>
              <span style={{ color: "var(--text-2)" }}>{user.ai_credits}</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(100, (user.ai_credits / (user.plan === "pro" ? 1000 : user.plan === "elite" ? 5000 : 25)) * 100)}%`,
                  background: planColor,
                  borderRadius: 99,
                }}
              />
            </div>
          </div>
        )}

        <div className="sidebar-user">
          <div
            className="sidebar-avatar"
            style={{ background: `linear-gradient(135deg, ${planColor}, #4f8aff)` }}
          >
            {initial}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.full_name || "Loading…"}</div>
            <div className="sidebar-user-plan" style={{ color: planColor }}>
              {(user?.plan || "free").charAt(0).toUpperCase() + (user?.plan || "free").slice(1)} Plan
            </div>
          </div>
          <button
            title="Sign Out"
            onClick={clearSession}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: 16, padding: "0 4px" }}
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}
