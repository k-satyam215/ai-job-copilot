# Render + Vercel Environment Variables Reference
# Copy-paste these into their respective dashboards
# DO NOT commit actual secret values — this file is just a reference template

# ─── RENDER (Backend) ──────────────────────────────────────────
# Service: ai-job-copilot-backend → Environment tab

APP_ENV=production
DEBUG=False
JWT_SECRET=<your-jwt-secret-from-.env>
DATABASE_URL=<your-neon-postgres-url>
GROQ_API_KEY=<your-groq-key>
FRONTEND_ORIGIN=https://ai-job-copilot-psi.vercel.app
CORS_ALLOW_ORIGINS=https://ai-job-copilot-psi.vercel.app
RAZORPAY_KEY_ID=rzp_test_Sx5w1hHCLZ052H
RAZORPAY_KEY_SECRET=<your-test-secret>
RAZORPAY_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=Ksatyam215@gmail.com
SMTP_PASS=<your-gmail-app-password>
ADMIN_EMAILS=Ksatyam215@gmail.com

# ─── VERCEL (Frontend) ─────────────────────────────────────────
# Project: ai-job-copilot → Settings → Environment Variables

NEXT_PUBLIC_API_BASE=https://ai-job-copilot.onrender.com
