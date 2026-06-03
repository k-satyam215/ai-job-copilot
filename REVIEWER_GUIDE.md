# Razorpay Reviewer Guide — AI Job Copilot

## Test Credentials

| Field    | Value                              |
|----------|------------------------------------|
| Login URL | https://ai-job-copilot-psi.vercel.app/login |
| Email    | test_reviewer@aijobcopilot.com     |
| Password | TestPassword123!                   |

---

## Checkout Flow (Step by Step)

1. Open: https://ai-job-copilot-psi.vercel.app/login
2. Login with the credentials above
3. Go to **Pricing page**: https://ai-job-copilot-psi.vercel.app/pricing
4. Click **"Upgrade to Pro"** button
5. Razorpay **Test Checkout popup** will open
6. Use test card to complete payment:
   - Card: `4111 1111 1111 1111`
   - Expiry: `12/26`
   - CVV: `123`
   - Name: Any

---

## About This Product

AI Job Copilot is a **career productivity SaaS tool** for individual job seekers.

- Users upload their resume → AI extracts skills and builds a profile
- AI scores and matches job listings from multiple portals
- Chrome extension auto-fills job application forms
- Users purchase AI credits (Pro / Elite plans) to use intelligent features

**This is NOT a job board or recruitment platform.** We sell software
subscriptions to individual users. No employer or recruiter accounts exist.

---

## Payment Integration Details

- **Provider**: Razorpay (INR)
- **Mode**: Test mode (rzp_test_ keys active)
- **Plans**: Pro ₹1,900/mo · Elite ₹4,900/mo
- **Webhook**: `/billing/razorpay/webhook`
- **Verify endpoint**: `/billing/razorpay/verify`

---

## Tech Stack

- Frontend: Next.js 15 → Vercel (https://ai-job-copilot-psi.vercel.app)
- Backend: FastAPI → Render (https://ai-job-copilot.onrender.com)
- Database: PostgreSQL (Neon)
- AI: Groq (Llama 3.3 70B)
