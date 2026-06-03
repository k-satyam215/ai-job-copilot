"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

const PLAN_ORDER = ["free", "pro", "elite"];

const PLAN_META: Record<string, { label: string; popular?: boolean; color: string }> = {
  free:  { label: "Free",  color: "var(--text-2)" },
  pro:   { label: "Pro",   color: "var(--accent)", popular: true },
  elite: { label: "Elite", color: "var(--accent2)" },
};

declare global {
  interface Window { Razorpay: any; }
}

export default function BillingPage() {
  const [plans, setPlans]     = useState<any>({});
  const [me, setMe]           = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying]   = useState<string | null>(null);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/billing/plans").then((r) => setPlans(r.data)).catch(() => {}),
      api.get("/billing/me").then((r) => setMe(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  async function handleUpgrade(planName: string) {
    setPaying(planName);
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/billing/razorpay/order", { plan: planName });
      const order = res.data;

      if (!window.Razorpay) {
        // Load Razorpay script on demand
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://checkout.razorpay.com/v1/checkout.js";
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Razorpay load failed"));
          document.body.appendChild(s);
        });
      }

      const rzp = new window.Razorpay({
        key: order.key_id || "",
        amount: order.amount,
        currency: order.currency || "INR",
        name: "AI Job Copilot",
        description: `${planName} Plan`,
        order_id: order.razorpay_order_id || order.id,
        handler: async (response: any) => {
          try {
            await api.post("/billing/razorpay/verify", response);
            setSuccess(`✓ Payment successful! Welcome to ${planName} plan.`);
            const meRes = await api.get("/billing/me");
            setMe(meRes.data);
          } catch {
            setError("Payment verification failed. Contact support.");
          }
        },
        prefill: { email: me?.email || "" },
        theme: { color: "#4f8aff" },
      });
      rzp.open();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not initiate payment.");
    } finally {
      setPaying(null);
    }
  }

  const sortedPlans = PLAN_ORDER.filter((k) => plans[k]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="page-main">

        {/* Header */}
        <div className="page-header">
          <div className="page-title-block">
            <div className="page-eyebrow">Subscription</div>
            <h1>SaaS Billing</h1>
            <p>Upgrade your plan to unlock more AI credits and features</p>
          </div>
        </div>

        {/* Current Plan Banner */}
        <div className="card elevated" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="section-title">Current Plan</div>
              {loading ? (
                <div className="skeleton" style={{ height: 20, width: 160, marginTop: 8 }} />
              ) : (
                <div style={{ marginTop: 6, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <span className={`badge ${me?.plan === "free" ? "badge-neutral" : me?.plan === "pro" ? "badge-blue" : "badge-purple"}`}>
                    {(me?.plan || "free").toUpperCase()}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-2)" }}>
                    {me?.ai_credits ?? 0} AI credits remaining
                  </span>
                  {me?.plan !== "free" && me?.credits_reset_at && (
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                      · resets {new Date(me.credits_reset_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
            {me?.plan === "free" && (
              <div className="notice info" style={{ padding: "8px 14px" }}>
                💡 Upgrade to Pro to unlock auto-apply & unlimited analytics
              </div>
            )}
          </div>
        </div>

        {/* Notices */}
        {error   && <div className="error-msg" style={{ marginBottom: 16 }}>⚠ {error}</div>}
        {success && <div className="notice success" style={{ marginBottom: 16 }}>{success}</div>}

        {/* Plans Grid */}
        {loading ? (
          <div className="stats-grid">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 12 }} />)}
          </div>
        ) : (
          <div className="stats-grid" style={{ alignItems: "start" }}>
            {sortedPlans.map((planName) => {
              const plan = plans[planName];
              const meta = PLAN_META[planName] || { label: planName, color: "var(--text-2)" };
              const isCurrent = me?.plan === planName;
              const isFeatured = !!meta.popular;

              return (
                <div
                  key={planName}
                  className={`plan-card${isFeatured ? " featured" : ""}${isCurrent ? " active-plan" : ""}`}
                >
                  <div>
                    <span className={`badge ${planName === "pro" ? "badge-blue" : planName === "elite" ? "badge-purple" : "badge-neutral"}`}>
                      {meta.label}
                    </span>
                  </div>

                  <div className="plan-price">
                    {plan.price === 0 ? (
                      <>Free</>
                    ) : (
                      <>
                        <sup>₹</sup>{plan.price}<span>/mo</span>
                      </>
                    )}
                  </div>

                  <ul className="plan-features">
                    {(plan.features || []).map((f: string) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>

                  <div style={{ marginTop: "auto", paddingTop: 8 }}>
                    {isCurrent ? (
                      <div className="notice success" style={{ justifyContent: "center", fontSize: 12 }}>
                        ✓ Your current plan
                      </div>
                    ) : planName === "free" ? (
                      <button className="btn btn-ghost w-full" disabled>Downgrade</button>
                    ) : (
                      <button
                        className={`btn w-full ${isFeatured ? "btn-primary" : "btn-ghost"}`}
                        onClick={() => handleUpgrade(planName)}
                        disabled={paying === planName}
                      >
                        {paying === planName ? <><span className="spinner" /> Processing…</> : `Upgrade to ${meta.label} →`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Credit Usage */}
        {me && (
          <div className="card elevated" style={{ marginTop: 24 }}>
            <div className="section-title" style={{ marginBottom: 14 }}>📊 Credit Usage</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${me.max_credits > 0 ? Math.round(((me.max_credits - (me.ai_credits ?? 0)) / me.max_credits) * 100) : 0}%`,
                    background: "linear-gradient(90deg, var(--accent), var(--accent2))",
                    borderRadius: 99,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <span style={{ fontSize: 12, color: "var(--text-2)", whiteSpace: "nowrap" }}>
                {me.max_credits - (me.ai_credits ?? 0)} / {me.max_credits} used
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>
              {me.ai_credits ?? 0} credits remaining this billing cycle
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="card" style={{ marginTop: 20 }}>
          <div className="section-title" style={{ marginBottom: 14 }}>❓ Common Questions</div>
          <div className="stack">
            {[
              ["What are AI credits?", "Credits are consumed when using AI features like resume parsing, job scoring, interview prep, and roadmap generation."],
              ["Can I cancel anytime?", "Yes, plans are monthly. Cancel before the next cycle to avoid charges."],
              ["Is my payment secure?", "All payments are processed via Razorpay with bank-grade encryption. We never store your card details."],
            ].map(([q, a]) => (
              <div key={q} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{q}</div>
                <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.6 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
