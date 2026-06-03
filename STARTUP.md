# AI Job Copilot — Complete Startup Guide

## ✅ Project Status: 100% Done

All bugs fixed. Follow these steps to run the full stack.

---

## 🚀 Step 1 — Backend Start

```bash
cd C:\Users\ksaty\Desktop\ai-job-copilot\backend

# Install dependencies (first time only)
pip install -r requirements.txt

# Run DB migrations (creates tables on Neon Postgres)
cd ..
alembic upgrade head

# Start backend
cd backend
uvicorn app.main:app --reload --port 8000
```

Backend runs at: http://127.0.0.1:8000
API docs at:     http://127.0.0.1:8000/docs

---

## 🚀 Step 2 — Frontend Start

```bash
cd C:\Users\ksaty\Desktop\ai-job-copilot\frontend

# Install packages (first time only)
npm install

# Start frontend
npm run dev
```

Frontend runs at: http://localhost:3000

---

## 🔌 Step 3 — Chrome Extension Install

1. Open Chrome → chrome://extensions
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select folder: `C:\Users\ksaty\Desktop\ai-job-copilot\extension`
5. Extension icon appears in toolbar

### Connect Extension to Account:
1. Open http://localhost:3000 → Create account / Sign in
2. Copy the JWT token shown after login
3. Click extension icon → Paste token → Save

---

## 🔑 Environment Variables (.env already configured)

Located at: `backend/.env`

| Variable | Status |
|----------|--------|
| DATABASE_URL | ✅ Neon Postgres |
| GROQ_API_KEY | ✅ Set |
| SMTP credentials | ✅ Gmail set |
| TELEGRAM_BOT_TOKEN | ✅ Set |
| JWT_SECRET | ✅ Set |
| RAZORPAY | ⚠️ Fill when going live |

---

## 🐛 All Bugs Fixed in This Session

| # | Bug | File | Status |
|---|-----|------|--------|
| 1 | `hmac.new()` wrong Python API | billing.py | ✅ Fixed |
| 2 | `hmac.new()` in billing route | routes/billing.py | ✅ Fixed |
| 3 | `hmac.new()` in razorpay_service | razorpay_service.py | ✅ Fixed |
| 4 | Career roadmap only 4 weeks hardcoded | career_roadmap.py | ✅ Fixed (AI + fallback, dynamic duration) |
| 5 | Analytics/roadmap not passing duration | routes/analytics.py | ✅ Fixed |
| 6 | `require_credits` wrong inject in copilot | routes/copilot.py | ✅ Fixed |
| 7 | `require_credits` wrong inject in resume | routes/resume.py | ✅ Fixed |
| 8 | `.hero` CSS class missing on homepage | globals.css | ✅ Added |
| 9 | Alembic env.py missing psycopg v3 dialect | alembic/env.py | ✅ Fixed |
| 10 | Extension popup token key mismatch | popup.js, popup.html | ✅ Fixed |
| 11 | Razorpay create_order missing key_id | razorpay_service.py | ✅ Fixed |
| 12 | Application model missing `platform` column | application.py | ✅ Done (prev session) |
| 13 | ai_orchestrator missing call_llm | ai_orchestrator.py | ✅ Done (prev session) |
| 14 | credit_scheduler.py missing | credit_scheduler.py | ✅ Done (prev session) |
| 15 | Login/signup pages missing | login/page.tsx, signup/page.tsx | ✅ Done (prev session) |

---

## 🗺️ Full Feature Map

### Backend Routes
- `POST /auth/signup` — Register new user
- `POST /auth/login` — Login, returns JWT
- `GET /auth/me` — Current user info
- `POST /resume/upload` — Parse resume with AI
- `GET /jobs/` — List all jobs
- `POST /jobs/discover` — Fetch fresh jobs from all platforms
- `POST /apply/` — Track application
- `GET /apply/` — List my applications
- `PATCH /apply/{id}/status` — Update status
- `POST /analytics/interview` — Generate interview pack
- `POST /analytics/roadmap` — Build career roadmap
- `GET /analytics/overview` — Full analytics
- `GET /billing/plans` — Pricing plans
- `POST /billing/razorpay/order` — Create payment order
- `POST /billing/razorpay/verify` — Verify payment
- `GET /ops/metrics` — System health (admin)
- `POST /ops/reset-credits` — Monthly credit reset (admin)

### Frontend Pages
- `/` — Landing + auth form
- `/dashboard` — Jobs + stats
- `/resume` — Upload + profile
- `/applications` — Track all applications
- `/analytics` — Career analytics + skill gaps
- `/interview` — AI interview prep
- `/roadmap` — Career roadmap
- `/billing` — Plans + payment
- `/settings` — Profile + security

### Chrome Extension
- Auto-detects LinkedIn / Naukri job pages
- Sends job data to backend for matching
- Tracks applications automatically
- token-based auth (JWT from dashboard)

---

## 💡 Production Checklist

- [ ] Set `APP_ENV=production` in .env
- [ ] Use strong `JWT_SECRET` (32+ chars)
- [ ] Configure Razorpay live keys
- [ ] Set `ADMIN_EMAILS` for admin routes
- [ ] Enable Sentry DSN for error tracking
- [ ] Configure domain in `FRONTEND_ORIGIN` and `CORS_ALLOW_ORIGINS`
- [ ] Run `alembic upgrade head` on prod DB
