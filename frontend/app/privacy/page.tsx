export default function PrivacyPolicy() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 100px" }}>
      <div style={{ marginBottom: 40 }}>
        <a href="/" style={{ fontSize: 13, color: "var(--accent)" }}>← Back to Home</a>
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: "var(--text-3)", fontSize: 13, marginBottom: 40 }}>Last updated: June 1, 2025</p>

      {[
        {
          title: "1. Who We Are",
          body: `AI Job Copilot ("we", "our", "us") is a career productivity SaaS platform. We are not a recruitment agency, job board, or hiring platform. We provide software tools that help individuals manage their own career data, track their own applications, and optimise their own resumes. Our registered business operates under the name AI Job Copilot.`,
        },
        {
          title: "2. What Data We Collect",
          body: `We collect the following data that you voluntarily provide:\n• Name, email address, and phone number (on signup)\n• Resume content (PDF or text, uploaded by you)\n• Career preferences you enter (expected salary, notice period, location)\n• Application tracking data you generate while using the platform\n\nWe do NOT collect: payment card numbers (handled by Razorpay), government IDs, or sensitive personal data beyond what is listed above.`,
        },
        {
          title: "3. How We Use Your Data",
          body: `Your data is used solely to:\n• Provide the AI Career Copilot service to you\n• Parse and analyse your resume to surface career insights\n• Auto-fill application forms via the Chrome extension (using only your own data)\n• Send you transactional emails (account verification, password reset)\n• Send optional job alert notifications via Telegram/WhatsApp (only if you configure these)\n\nWe do NOT sell your data to third parties. We do NOT share your resume or profile with employers or recruiters.`,
        },
        {
          title: "4. Data Storage & Security",
          body: `Your data is stored on secured cloud infrastructure (Neon PostgreSQL). Passwords are hashed using PBKDF2-SHA256 and are never stored in plain text. All API communication is over HTTPS. We use JWT tokens for authentication with a 7-day expiry.`,
        },
        {
          title: "5. Third-Party Services",
          body: `We use the following third-party services:\n• Groq AI (LLM inference — resume parsing, interview prep)\n• Neon (PostgreSQL database hosting)\n• Razorpay (payment processing — they have their own privacy policy)\n• Gmail SMTP (transactional emails)\n• Telegram Bot API (optional job alerts)\n\nThese services process data under their own privacy policies.`,
        },
        {
          title: "6. Your Rights",
          body: `You can:\n• Request deletion of your account and all associated data at any time from Settings → Account → Delete My Account\n• Export your profile data by contacting us\n• Opt out of notifications at any time from Settings\n\nFor any privacy requests, contact: Ksatyam215@gmail.com`,
        },
        {
          title: "7. Cookies",
          body: `We use a single authentication cookie (token) to keep you logged in. We do not use advertising cookies or tracking pixels.`,
        },
        {
          title: "8. Changes to This Policy",
          body: `We may update this policy as the product evolves. We will notify registered users via email of any material changes.`,
        },
        {
          title: "9. Contact",
          body: `For any privacy-related queries:\nEmail: Ksatyam215@gmail.com\nPlatform: AI Job Copilot — Career Productivity SaaS`,
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
