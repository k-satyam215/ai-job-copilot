export default function TermsOfService() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 100px" }}>
      <div style={{ marginBottom: 40 }}>
        <a href="/" style={{ fontSize: 13, color: "var(--accent)" }}>← Back to Home</a>
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ color: "var(--text-3)", fontSize: 13, marginBottom: 40 }}>Last updated: June 1, 2025</p>

      {[
        {
          title: "1. About This Service",
          body: `AI Job Copilot is a career productivity software platform ("Service"). We provide tools including AI resume parsing, application tracking, Chrome extension auto-fill, interview preparation, and career roadmap generation.\n\nWe are NOT a recruitment agency, staffing company, or job board. We do not connect candidates with employers. We do not charge companies to post vacancies. We sell software subscriptions to individual users.`,
        },
        {
          title: "2. Eligibility",
          body: `You must be at least 18 years old to use this Service. By creating an account you confirm you are using this platform for your own personal career management and not on behalf of a recruitment or staffing organisation.`,
        },
        {
          title: "3. Subscription Plans & Credits",
          body: `We offer the following plans:\n• Free: 25 AI credits/month — resume parsing, basic matching\n• Pro (₹1,900/month): 1,000 AI credits — full access including auto-fill and analytics\n• Elite (₹4,900/month): 5,000 AI credits — priority features\n\nAI credits are consumed when you use AI-powered features (resume parsing, interview prep, roadmap generation). Unused credits do not roll over. Credits reset on the 1st of each month.`,
        },
        {
          title: "4. Payment & Billing",
          body: `Payments are processed by Razorpay. By subscribing you agree to Razorpay's terms of service. Subscriptions are billed monthly. You may cancel at any time; cancellation takes effect at the end of the current billing period. We do not store your payment card details.`,
        },
        {
          title: "5. Refund Policy",
          body: `See our separate Refund Policy at /refund. In summary: if the Service was unavailable for more than 24 continuous hours in a billing month, you may request a prorated refund for that period. No refunds are issued for unused AI credits.`,
        },
        {
          title: "6. Acceptable Use",
          body: `You may use this Service only for:\n• Managing your own career and application data\n• Automating your own form submissions on platforms where automation is permitted\n\nYou may NOT:\n• Use this Service to apply to positions on behalf of others\n• Scrape or resell data from this platform\n• Use the Chrome extension to submit false or misleading information`,
        },
        {
          title: "7. AI-Generated Content",
          body: `AI features (cover letters, interview questions, roadmaps) generate suggestions based on your profile. You are responsible for reviewing and verifying all AI-generated content before use. We do not guarantee accuracy or fitness for purpose of AI outputs.`,
        },
        {
          title: "8. Intellectual Property",
          body: `The platform, codebase, UI, and AI models are the property of AI Job Copilot. Your resume data and profile remain your property. You grant us a limited licence to process your data solely to provide the Service.`,
        },
        {
          title: "9. Limitation of Liability",
          body: `The Service is provided "as is". We are not liable for any loss of employment opportunity, missed applications, or inaccuracies in AI-generated suggestions. Our maximum liability is limited to the amount you paid us in the last 30 days.`,
        },
        {
          title: "10. Governing Law",
          body: `These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.`,
        },
        {
          title: "11. Contact",
          body: `For any questions about these terms:\nEmail: Ksatyam215@gmail.com\nPlatform: AI Job Copilot — Career Productivity SaaS`,
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
