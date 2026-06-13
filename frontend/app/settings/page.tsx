"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api, clearSession, getToken } from "../../lib/api";

const PLAN_BADGE: Record<string, string> = {
  free: "badge-neutral",
  pro: "badge-blue",
  elite: "badge-purple",
  enterprise: "badge-green",
};

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ full_name: "", phone: "" });
  const [pwForm, setPwForm] = useState({ current_password: "", new_password: "", confirm: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [error, setError] = useState("");
  const [pwError, setPwError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "account" | "extension">("profile");
  const [tokenCopied, setTokenCopied] = useState(false);

  function copyToken() {
    const t = getToken();
    if (t) {
      navigator.clipboard.writeText(t).then(() => {
        setTokenCopied(true);
        setTimeout(() => setTokenCopied(false), 2500);
      });
    }
  }

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data);
        setForm({ full_name: res.data.full_name || "", phone: res.data.phone || "" });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile() {
    setSaving(true);
    setMsg("");
    setError("");
    try {
      await api.put("/auth/preferences", { phone: form.phone });
      setMsg("✓ Profile updated successfully!");
      setUser((u: any) => ({ ...u, ...form }));
    } catch (e: any) {
      setError(e.response?.data?.detail || "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    setPwSaving(true);
    setPwMsg("");
    setPwError("");
    if (pwForm.new_password !== pwForm.confirm) {
      setPwError("Passwords do not match.");
      setPwSaving(false);
      return;
    }
    if (pwForm.new_password.length < 8) {
      setPwError("Password must be at least 8 characters.");
      setPwSaving(false);
      return;
    }
    try {
      await api.post("/auth/change-password", {
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      });
      setPwMsg("✓ Password changed successfully!");
      setPwForm({ current_password: "", new_password: "", confirm: "" });
    } catch (e: any) {
      setPwError(e.response?.data?.detail || "Failed to change password.");
    } finally {
      setPwSaving(false);
    }
  }

  async function deleteAccount() {
    try {
      await api.delete("/auth/account");
      clearSession();
    } catch (e: any) {
      setError(e.response?.data?.detail || "Account deletion failed.");
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="page-main">
        <div className="page-header">
          <div className="page-title-block">
            <div className="page-eyebrow">Account</div>
            <h1>Settings</h1>
            <p>Manage your profile, security, and account preferences</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-ghost" onClick={clearSession}>Sign Out</button>
          </div>
        </div>

        {/* Current plan info */}
        {user && (
          <div className="card elevated" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <div
                style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, fontWeight: 700, flexShrink: 0,
                }}
              >
                {(user.full_name || user.email || "U")[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{user.full_name}</div>
                <div style={{ fontSize: 12, color: "var(--text-2)" }}>{user.email}</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <span className={`badge ${PLAN_BADGE[user.plan] || "badge-neutral"}`}>
                  {(user.plan || "free").toUpperCase()}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-2)" }}>
                  {user.ai_credits} AI credits
                </span>
                {!user.is_verified && (
                  <span className="badge badge-amber">Email not verified</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {(["profile", "security", "extension", "account"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`auth-tab ${activeTab === tab ? "active" : ""}`}
              style={{ minWidth: 120, textTransform: "capitalize" }}
            >
              {tab === "profile" ? "👤 Profile" : tab === "security" ? "🔒 Security" : tab === "extension" ? "🔌 Extension" : "⚠️ Account"}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="card elevated">
            <div className="section-title" style={{ marginBottom: 16 }}>Profile Information</div>
            {loading ? (
              <div className="stack">
                {[1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 48, borderRadius: 8 }} />)}
              </div>
            ) : (
              <>
                <div className="grid-2">
                  <div className="field">
                    <label className="field-label">Full Name</label>
                    <input
                      className="input"
                      value={form.full_name}
                      disabled
                      style={{ opacity: 0.6 }}
                      title="Contact support to change your name"
                    />
                  </div>
                  <div className="field">
                    <label className="field-label">Phone</label>
                    <input
                      className="input"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Email Address</label>
                  <input
                    className="input"
                    value={user?.email || ""}
                    disabled
                    style={{ opacity: 0.6 }}
                  />
                </div>
                {msg && <div className="notice success" style={{ marginTop: 12 }}>{msg}</div>}
                {error && <div className="error-msg" style={{ marginTop: 12 }}>⚠ {error}</div>}
                <button
                  className="btn btn-primary"
                  onClick={saveProfile}
                  disabled={saving}
                  style={{ marginTop: 16 }}
                >
                  {saving ? <><span className="spinner" /> Saving…</> : "Save Profile"}
                </button>
              </>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="card elevated">
            <div className="section-title" style={{ marginBottom: 16 }}>Change Password</div>
            <div className="stack" style={{ maxWidth: 460 }}>
              <div className="field">
                <label className="field-label">Current Password</label>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={pwForm.current_password}
                  onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="field-label">New Password (min 8 chars)</label>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={pwForm.new_password}
                  onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="field-label">Confirm New Password</label>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && changePassword()}
                />
              </div>
            </div>
            {pwMsg && <div className="notice success" style={{ marginTop: 12 }}>{pwMsg}</div>}
            {pwError && <div className="error-msg" style={{ marginTop: 12 }}>⚠ {pwError}</div>}
            <button
              className="btn btn-primary"
              onClick={changePassword}
              disabled={pwSaving}
              style={{ marginTop: 16 }}
            >
              {pwSaving ? <><span className="spinner" /> Changing…</> : "🔒 Change Password"}
            </button>
          </div>
        )}

        {/* Account/Danger Tab */}
        {activeTab === "extension" && (
          <div className="card elevated">
            <div className="section-title" style={{ marginBottom: 8 }}>🔌 Chrome Extension Token</div>
            <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 20, lineHeight: 1.7 }}>
              Chrome Extension ko connect karne ke liye apna JWT token copy karo aur extension popup mein paste karo.
            </p>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
              <div className="input" style={{ flex: 1, fontFamily: "monospace", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: 0.7 }}>
                {getToken() ? getToken()!.slice(0, 40) + "…" : "Not logged in"}
              </div>
              <button className="btn btn-primary" onClick={copyToken} style={{ flexShrink: 0 }}>
                {tokenCopied ? "✓ Copied!" : "Copy Token"}
              </button>
            </div>
            <div className="notice info">
              <span>💡</span>
              <span style={{ fontSize: 12 }}>Extension install karo → popup open karo → token paste karo → LinkedIn/Naukri pe job open karo → AI copilot panel automatically aayega.</span>
            </div>
            <div style={{ marginTop: 16 }}>
              <div className="section-title" style={{ marginBottom: 10, fontSize: 13 }}>Extension Steps:</div>
              <div className="stack" style={{ gap: 8 }}>
                {[
                  ["1", "Chrome open karo → chrome://extensions"],
                  ["2", "Developer mode ON karo (top right toggle)"],
                  ["3", "Load unpacked → ai-job-copilot/extension folder select karo"],
                  ["4", "Upar se token copy karo → extension popup mein paste karo"],
                  ["5", "Kisi bhi Naukri/LinkedIn job page pe jao → AI panel dikhega"],
                ].map(([n, t]) => (
                  <div key={n} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ background: "rgba(79,138,255,0.1)", border: "1px solid rgba(79,138,255,0.2)", color: "var(--accent)", borderRadius: "50%", width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{n}</span>
                    <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "account" && (
          <div className="card elevated">
            <div className="section-title" style={{ marginBottom: 8 }}>⚠️ Danger Zone</div>
            <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 20 }}>
              Deleting your account is permanent and cannot be undone. All your data, applications, and resume will be erased.
            </p>
            {!deleteConfirm ? (
              <button
                className="btn"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--red)" }}
                onClick={() => setDeleteConfirm(true)}
              >
                Delete My Account
              </button>
            ) : (
              <div className="card" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <p style={{ fontSize: 13, color: "var(--red)", marginBottom: 16, fontWeight: 600 }}>
                  Are you absolutely sure? This cannot be undone.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn"
                    style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "var(--red)" }}
                    onClick={deleteAccount}
                  >
                    Yes, delete everything
                  </button>
                  <button className="btn btn-ghost" onClick={() => setDeleteConfirm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
