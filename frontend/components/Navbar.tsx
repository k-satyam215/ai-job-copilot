"use client";

import { getToken } from "../lib/api";

interface NavbarProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}

export default function Navbar({ title, subtitle, eyebrow, actions }: NavbarProps) {
  const isConnected = typeof window !== "undefined" && Boolean(getToken());

  return (
    <div className="page-header">
      <div className="page-title-block">
        {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="page-header-actions">
        {actions}
        <span className={`badge ${isConnected ? "badge-green" : "badge-red"}`}>
          {isConnected ? "● Connected" : "○ Login required"}
        </span>
      </div>
    </div>
  );
}
