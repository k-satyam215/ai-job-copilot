export default function RefundPolicy() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 100px" }}>
      <div style={{ marginBottom: 40 }}>
        <a href="/" style={{ fontSize: 13, color: "var(--accent)" }}>← Back to Home</a>
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Refund Policy</h1>
      <p style={{ color: "var(--text-3)", fontSize: 13, marginBottom: 40 }}>Last updated: June 1, 2025</p>

      {[
        {
          title: "1. Our Commitment",
          body: `AI Job Copilot is a career productivity SaaS platform. We want every customer to be satisfied with the Service. This policy explains when and how refunds are issued.`,
        },
        {
          title: "2. Eligibility for Refund",
          body: `You are eligible for a refund if:\n• The Service was unavailable (downtime) for more than 24 continuous hours in your current billing month\n• You were charged twice for the same subscription period due to a billing error\n• You cancelled within 24 hours of your first-ever paid subscription (first-time subscribers only)\n\nRefunds are NOT issued for:\n• Unused AI credits within a billing period\n• Partial month usage after cancellation\n• Dissatisfaction with AI-generated content quality`,
        },
        {
          title: "3. How to Request a Refund",
          body: `To request a refund, email us at Ksatyam215@gmail.com with:\n• Your registered email address\n• The transaction ID from Razorpay\n• The reason for your refund request\n\nWe will respond within 3 business days. Approved refunds are processed within 5-7 business days to your original payment method.`,
        },
        {
          title: "4. Cancellation",
          body: `You can cancel your subscription at any time from Settings → Billing → Cancel Subscription. Cancellation stops future charges. You retain access to paid features until the end of your current billing period. No partial refunds are issued for mid-month cancellations.`,
        },
        {
          title: "5. Payment Processor",
          body: `All payments are processed by Razorpay. Refunds are credited back to the original payment source (UPI, card, net banking) as per Razorpay's standard processing timelines.`,
        },
        {
          title: "6. Contact",
          body: `For refund queries:\nEmail: Ksatyam215@gmail.com\nResponse time: Within 3 business days`,
        },
      ].map(({ title, body }) => (
        <div key={title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{title}</h2>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.8, whiteSpace: "pre-line" }}>{body}</p>
        </div>
      ))}
    </main>
  );
}
