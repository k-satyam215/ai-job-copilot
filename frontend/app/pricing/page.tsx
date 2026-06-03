export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      credits: "25 AI credits/month",
      color: "var(--text-2)",
      features: [
        "25 AI credits per month",
        "Resume parsing & profile extraction",
        "25 application trackings/day",
        "Chrome extension (manual mode)",
        "Basic career analytics",
      ],
      cta: "Get Started Free",
      href: "/",
      highlight: false,
    },
    {
      name: "Pro",
      price: "₹1,900",
      period: "/month",
      credits: "1,000 AI credits/month",
      color: "var(--accent)",
      features: [
        "1,000 AI credits per month",
        "Unlimited application tracking",
        "AI auto-fill via Chrome extension",
        "Interview prep pack generator",
        "Career roadmap generator",
        "Skill gap analysis",
        "Cover letter AI generator",
        "500 opportunities/day",
      ],
      cta: "Upgrade to Pro",
      href: "/billing",
      highlight: true,
    },
    {
      name: "Elite",
      price: "₹4,900",
      period: "/month",
      credits: "5,000 AI credits/month",
      color: "var(--accent2)",
      features: [
        "5,000 AI credits per month",
        "Everything in Pro",
        "Priority AI processing",
        "2,000 opportunities/day",
        "Priority email support",
        "Advanced analytics dashboard",
      ],
      cta: "Upgrade to Elite",
      href: "/billing",
      highlight: false,
    },
  ];

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px 120px" }}>
      <div style={{ marginBottom: 40 }}>
        <a href="/" style={{ fontSize: 13, color: "var(--accent)" }}>← Back to Home</a>
      </div>

      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
          Pricing
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-2)", maxWidth: 500, margin: "0 auto" }}>
          AI Job Copilot is a career productivity software tool. You purchase AI credits to use intelligent features. No hidden fees.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "start" }}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{
              background: plan.highlight ? "rgba(79,138,255,0.06)" : "var(--surface)",
              border: `1px solid ${plan.highlight ? "rgba(79,138,255,0.3)" : "var(--border)"}`,
              borderRadius: 16,
              padding: 28,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {plan.highlight && (
              <div style={{
                position: "absolute", top: 14, right: -22,
                background: "var(--accent)", color: "white",
                fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                padding: "3px 30px", transform: "rotate(35deg)",
              }}>
                POPULAR
              </div>
            )}

            <div style={{ marginBottom: 6 }}>
              <span style={{
                padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                background: `${plan.color}20`, color: plan.color,
                border: `1px solid ${plan.color}40`,
              }}>
                {plan.name}
              </span>
            </div>

            <div style={{ fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 800, margin: "14px 0 4px" }}>
              {plan.price}
              <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-2)" }}>{plan.period}</span>
            </div>

            <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 20 }}>{plan.credits}</div>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {plan.features.map((f) => (
                <li key={f} style={{ fontSize: 13, color: "var(--text-2)", display: "flex", gap: 8 }}>
                  <span style={{ color: "var(--green)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={plan.href}
              style={{
                display: "block", textAlign: "center",
                padding: "10px 0", borderRadius: 8,
                fontWeight: 700, fontSize: 13,
                background: plan.highlight ? "var(--accent)" : "var(--surface2)",
                color: plan.highlight ? "white" : "var(--text)",
                border: `1px solid ${plan.highlight ? "transparent" : "var(--border)"}`,
                textDecoration: "none",
              }}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ marginTop: 60 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, marginBottom: 24, textAlign: "center" }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 680, margin: "0 auto" }}>
          {[
            ["What are AI credits?", "Credits are used when you invoke AI features — resume parsing (5 credits), interview prep (3 credits), roadmap generation (3 credits), auto-fill (1 credit per form). Viewing your dashboard or tracking applications is always free."],
            ["Is this a job board?", "No. AI Job Copilot is a career productivity SaaS tool. We do not post vacancies, connect candidates with employers, or charge companies. We sell software subscriptions to individual users who manage their own career data."],
            ["Can I cancel anytime?", "Yes. Cancel from Settings → Billing at any time. You keep access until your billing period ends. No questions asked."],
            ["Is my payment secure?", "All payments are processed by Razorpay with bank-grade encryption. We never store your card details."],
            ["Do credits roll over?", "No, unused credits reset on the 1st of each month. This keeps pricing fair and predictable."],
          ].map(([q, a]) => (
            <div key={q} style={{ padding: "16px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{q}</div>
              <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div style={{ textAlign: "center", marginTop: 60, fontSize: 12, color: "var(--text-3)", display: "flex", gap: 20, justifyContent: "center" }}>
        <a href="/terms" style={{ color: "var(--text-3)" }}>Terms of Service</a>
        <a href="/privacy" style={{ color: "var(--text-3)" }}>Privacy Policy</a>
        <a href="/refund" style={{ color: "var(--text-3)" }}>Refund Policy</a>
      </div>
    </main>
  );
}
