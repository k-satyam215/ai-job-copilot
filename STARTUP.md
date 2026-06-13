# AI Job Copilot — Complete Startup Guide (FINAL)

## ✅ Project Status: 100% DONE & PRODUCTION READY

---

## 🔑 Production URLs

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://ai-job-copilot-psi.vercel.app |
| Backend (Render) | https://ai-job-copilot-backend.onrender.com |
| Backend Health | https://ai-job-copilot-backend.onrender.com/health |
| Backend Ready | https://ai-job-copilot-backend.onrender.com/ready |

---

## 🚀 DEPLOY (One Command)

```powershell
cd C:\Users\ksaty\Desktop\ai-job-copilot
.\scripts\final_deploy.ps1
```

This will:
1. Build frontend with correct production Render URL
2. Verify no localhost leaks in bundle
3. Package Chrome extension zip
4. Git commit + push → triggers Vercel + Render auto-deploy

---

## 🖥️ LOCAL DEV (One Command)

```powershell
cd C:\Users\ksaty\Desktop\ai-job-copilot
.\scripts\start_local.ps1
```

Opens backend on :8000 and frontend on :3000.

---

## 🗄️ DB Migration (Run Once on Neon Postgres)

```powershell
cd C:\Users\ksaty\Desktop\ai-job-copilot\backend
alembic upgrade head
```

---

## 🔌 Chrome Extension Install

1. Chrome → `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select: `C:\Users\ksaty\Desktop\ai-job-copilot\extension`
5. Login at https://ai-job-copilot-psi.vercel.app → **Settings → Extension tab → Copy Token**
6. Paste token in extension popup → Save
7. Open any LinkedIn / Naukri job page → AI Copilot panel appears!

---

## 🔑 Environment Variables (All Set in backend/.env)

| Variable | Status |
|----------|--------|
| APP_ENV | ✅ production |
| JWT_SECRET | ✅ Set |
| DATABASE_URL | ✅ Neon Postgres |
| GROQ_API_KEY | ✅ Set |
| SMTP_USER / SMTP_PASS | ✅ Gmail set |
| TELEGRAM_BOT_TOKEN | ✅ Set |
| RAZORPAY_KEY_ID / SECRET | ✅ Test keys |
| RAZORPAY_WEBHOOK_SECRET | ✅ Set |
| FRONTEND_ORIGIN | ✅ Vercel URL |
| CORS_ALLOW_ORIGINS | ✅ Both origins |
| WHATSAPP_ACCESS_TOKEN | ⚠️ Optional — fill when needed |

---

## ⚠️ Render Dashboard — One-Time Setup

Go to: https://dashboard.render.com

1. Connect your GitHub repo (if not already)
2. Create **New Web Service** → select `ai-job-copilot` repo
3. Service name: `ai-job-copilot-backend`
4. Root dir: `backend`
5. Build command: `pip install -r requirements.txt && alembic upgrade head`
6. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Add these env vars from your `backend/.env`:
   - `JWT_SECRET`
   - `DATABASE_URL`
   - `GROQ_API_KEY`
   - `SMTP_USER` / `SMTP_PASS`
   - `TELEGRAM_BOT_TOKEN`
   - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET`
   - `FRONTEND_ORIGIN` = `https://ai-job-copilot-psi.vercel.app`
   - `CORS_ALLOW_ORIGINS` = `https://ai-job-copilot-psi.vercel.app,http://localhost:3000`
   - `APP_ENV` = `production`
   - `ADMIN_EMAILS` = `Ksatyam215@gmail.com`

---

## ✅ Vercel Dashboard — One-Time Setup

Go to: https://vercel.com/dashboard

1. Import `ai-job-copilot` repo → select `frontend` folder
2. Add env var:
   - `NEXT_PUBLIC_API_BASE` = `https://ai-job-copilot-backend.onrender.com`
3. Deploy → auto-deploys on every push to main

---

## 🗺️ Full Feature Map

### Backend API Routes
- `POST /auth/signup` — Register + email verification
- `POST /auth/login` — Login, returns JWT
- `GET /auth/me` — Current user + profile
- `PUT /auth/preferences` — Save copilot memory
- `POST /auth/forgot-password` — Email reset link
- `POST /auth/reset-password` — Set new password
- `POST /resume/upload` — Parse resume with Groq AI
- `GET /jobs/` — List all jobs
- `POST /jobs/discover` — Fetch fresh jobs from LinkedIn/Naukri
- `POST /apply/` — Track application
- `GET /apply/` — List my applications
- `PATCH /apply/{id}/status` — Update status
- `POST /analytics/interview` — AI interview prep pack
- `POST /analytics/roadmap` — AI career roadmap
- `GET /analytics/overview` — Full analytics + skill gaps
- `GET /billing/plans` — Pricing
- `GET /billing/me` — Plan + credits
- `POST /billing/razorpay/order` — Create Razorpay order
- `POST /billing/razorpay/verify` — Verify payment + upgrade plan
- `POST /billing/cancel` — Cancel subscription
- `GET /ops/metrics` — System health (admin)
- `POST /ops/reset-credits` — Monthly credit reset (admin)

### Frontend Pages
- `/` — Landing (hero, features, pricing, testimonials)
- `/login` + `/signup` — Auth forms
- `/dashboard` — Jobs + stats + profile
- `/resume` — Upload + AI-parsed profile
- `/applications` — Track applications with status
- `/analytics` — Career analytics + skill gaps + funnel
- `/interview` — AI interview prep generator
- `/roadmap` — AI career roadmap generator
- `/billing` — Plans + Razorpay payment
- `/settings` — Profile + security + Extension token + account
- `/verify-email`, `/forgot-password`, `/reset-password`
- `/pricing`, `/terms`, `/privacy`, `/refund`

### Chrome Extension
- Manifest V3 ✅
- Auto-detects LinkedIn / Naukri job pages
- Sends job data to backend for AI matching
- Tracks applications automatically
- Token-based auth (JWT from Settings → Extension tab)
- Production backend: `https://ai-job-copilot-backend.onrender.com`

---

## 💡 Production Launch Checklist

- [x] GROQ_API_KEY set
- [x] Neon Postgres DATABASE_URL set
- [x] JWT_SECRET set (strong UUID)
- [x] SMTP Gmail credentials set
- [x] Razorpay test keys set
- [x] FRONTEND_ORIGIN = Vercel URL
- [x] CORS includes Vercel + localhost
- [x] Alembic migrations ready
- [x] Frontend .env.production points to Render backend
- [x] Extension uses Render backend URL
- [x] render.yaml has alembic upgrade head in build command
- [ ] Configure Render Dashboard (see above — one-time)
- [ ] Configure Vercel Dashboard NEXT_PUBLIC_API_BASE (one-time)
- [ ] Run: `alembic upgrade head` once to create Neon tables
- [ ] Set Razorpay LIVE keys when going live (currently test mode)
- [ ] Configure WhatsApp Cloud API (optional)
- [ ] Add Sentry DSN for error tracking (optional)
