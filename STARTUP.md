# AI Job Copilot — Complete Startup Guide

## ✅ Project Status: 100% DONE & PRODUCTION READY

---

## 🚀 Step 1 — Backend Start (Local)

```powershell
cd C:\Users\ksaty\Desktop\ai-job-copilot\backend

# Install dependencies (first time only)
pip install -r requirements.txt

# Start backend
uvicorn app.main:app --reload --port 8000
```

Backend: http://127.0.0.1:8000
API Docs: http://127.0.0.1:8000/docs (local only — disabled in production)
Health:   http://127.0.0.1:8000/health

---

## 🗄️ Step 2 — DB Migration (Neon Postgres — Run Once)

```powershell
cd C:\Users\ksaty\Desktop\ai-job-copilot

# This will create/update all tables on Neon Postgres
alembic upgrade head
```

Tables created: users, jobs, applications (with platform + credits_reset_at columns)

---

## 🚀 Step 3 — Frontend Start (Local)

```powershell
cd C:\Users\ksaty\Desktop\ai-job-copilot\frontend

# Install packages (first time only)
npm install

# Start frontend (local dev — hits localhost:8000 backend)
npm run dev
```

Frontend: http://localhost:3000

> NOTE: .env.local already points to http://127.0.0.1:8000 for local dev.
> .env.production points to https://ai-job-copilot.onrender.com for Vercel deploy.

---

## 🔌 Step 4 — Chrome Extension Install

1. Chrome → chrome://extensions
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select: `C:\Users\ksaty\Desktop\ai-job-copilot\extension`
5. Extension icon appears in Chrome toolbar

### Connect Extension to Your Account:
1. Open http://localhost:3000 → Login
2. Go to Settings → 🔌 Extension tab
3. Click "Copy Token" button
4. Click Chrome extension icon → Paste token → Save
5. Open any LinkedIn/Naukri job page → AI Copilot panel appears!

---

## 🌍 Step 5 — Production Deploy

### Frontend → Vercel (already configured)
- vercel.json ready ✅
- .env.production points to Render backend ✅
- Push to GitHub → Vercel auto-deploys → https://ai-job-copilot-psi.vercel.app

### Backend → Render (already configured)
- render.yaml ready ✅
- Push to GitHub → Deploy to Render → https://ai-job-copilot.onrender.com
- CORS already allows Vercel origin ✅

---

## 🔑 Environment Variables Status

| Variable | Status | Value |
|----------|--------|-------|
| DATABASE_URL | ✅ Neon Postgres | configured |
| GROQ_API_KEY | ✅ Set | configured |
| SMTP credentials | ✅ Gmail set | configured |
| TELEGRAM_BOT_TOKEN | ✅ Set | configured |
| JWT_SECRET | ✅ Set | configured |
| RAZORPAY_KEY_ID | ✅ Test keys | rzp_test_* |
| RAZORPAY_KEY_SECRET | ✅ Set | configured |
| FRONTEND_ORIGIN | ✅ Vercel URL | configured |
| CORS_ALLOW_ORIGINS | ✅ Both origins | configured |
| WHATSAPP_ACCESS_TOKEN | ⚠️ Fill when needed | optional |
| RAZORPAY live keys | ⚠️ Fill when going live | optional |

---

## ✅ All Bugs Fixed

| # | Bug | File | Status |
|---|-----|------|--------|
| 1 | hmac.new() wrong API | billing.py | ✅ Fixed |
| 2 | hmac.new() in routes | routes/billing.py | ✅ Fixed |
| 3 | hmac.new() in razorpay | razorpay_service.py | ✅ Fixed |
| 4 | Roadmap hardcoded 4 weeks | career_roadmap.py | ✅ Fixed |
| 5 | Analytics not passing duration | routes/analytics.py | ✅ Fixed |
| 6 | require_credits wrong inject copilot | routes/copilot.py | ✅ Fixed |
| 7 | require_credits wrong inject resume | routes/resume.py | ✅ Fixed |
| 8 | .hero CSS missing | globals.css | ✅ Fixed |
| 9 | Alembic psycopg v3 dialect | alembic/env.py | ✅ Fixed |
| 10 | Extension popup token key | popup.js, popup.html | ✅ Fixed |
| 11 | Razorpay create_order key_id | razorpay_service.py | ✅ Fixed |
| 12 | Application platform column | application.py | ✅ Done |
| 13 | ai_orchestrator call_llm | ai_orchestrator.py | ✅ Done |
| 14 | credit_scheduler missing | credit_scheduler.py | ✅ Done |
| 15 | Login/signup pages | login/page.tsx, signup/page.tsx | ✅ Done |
| 16 | .env.local pointing to production | frontend/.env.local | ✅ Fixed |
| 17 | Extension backend URL | background.js | ✅ Fixed (Render URL) |
| 18 | Extension popup dashboard URL | popup.html | ✅ Fixed |
| 19 | Extension missing Render host_permission | manifest.json | ✅ Fixed |
| 20 | credits_reset_at missing column | user.py + migration 002 | ✅ Fixed |
| 21 | billing/me missing credits_reset_at | routes/billing.py | ✅ Fixed |
| 22 | Settings missing Extension tab | settings/page.tsx | ✅ Added |

---

## 🗺️ Full Feature Map

### Backend Routes
- POST /auth/signup — Register + email verification
- POST /auth/login — Login, returns JWT
- GET /auth/me — Current user info + profile
- PUT /auth/preferences — Save copilot memory
- POST /auth/forgot-password — Email reset link
- POST /auth/reset-password — Set new password
- POST /auth/change-password — Change password (auth required)
- DELETE /auth/account — Delete account
- POST /resume/upload — Parse resume with AI (Groq)
- GET /jobs/ — List all jobs
- POST /jobs/discover — Fetch fresh jobs from all platforms
- POST /apply/ — Track application
- GET /apply/ — List my applications
- PATCH /apply/{id}/status — Update status
- DELETE /apply/{id} — Delete application
- POST /analytics/interview — Generate interview prep pack
- POST /analytics/roadmap — Build career roadmap
- GET /analytics/overview — Full analytics
- GET /analytics/skill-gaps — Skill gap analysis
- GET /billing/plans — Pricing plans
- GET /billing/me — Current plan + credits
- POST /billing/razorpay/order — Create payment order
- POST /billing/razorpay/verify — Verify payment
- POST /billing/cancel — Cancel subscription
- GET /ops/metrics — System health (admin)
- POST /ops/reset-credits — Monthly credit reset (admin)

### Frontend Pages
- / — Landing page with hero, features, pricing, testimonials
- /login — Login form
- /signup — Signup form
- /dashboard — Jobs + stats + profile
- /resume — Upload + parsed profile + copilot memory
- /applications — Track all applications with status
- /analytics — Career analytics + skill gaps + funnel
- /interview — AI interview prep pack generator
- /roadmap — AI career roadmap generator
- /billing — Plans + Razorpay payment
- /settings — Profile + security + 🔌 extension token + account
- /verify-email — Email verification
- /forgot-password — Password reset request
- /reset-password — Set new password
- /pricing — Public pricing page
- /terms — Terms of service
- /privacy — Privacy policy
- /refund — Refund policy

### Chrome Extension
- Manifest V3 ✅
- Auto-detects LinkedIn / Naukri job pages
- Sends job data to backend for matching
- Tracks applications automatically
- Token-based auth (JWT from Settings → Extension tab)
- Production backend: https://ai-job-copilot.onrender.com

---

## 💡 Production Checklist

- [x] GROQ_API_KEY set
- [x] Neon Postgres DATABASE_URL set
- [x] JWT_SECRET set (strong UUID)
- [x] SMTP Gmail credentials set
- [x] Razorpay test keys set
- [x] FRONTEND_ORIGIN = Vercel URL
- [x] CORS includes Vercel + localhost
- [x] Alembic migrations ready
- [ ] Set Razorpay live keys when going live
- [ ] Configure WhatsApp Cloud API (optional)
- [ ] Submit extension to Chrome Web Store (after review)
- [ ] Add Sentry DSN for error tracking (optional)
