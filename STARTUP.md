# AI Job Copilot — Complete Launch Guide

## 🟢 LIVE URLS
| Service  | URL |
|----------|-----|
| Frontend | https://ai-job-copilot-psi.vercel.app |
| Backend  | https://ai-job-copilot-backend-vsdc.onrender.com |
| Health   | https://ai-job-copilot-backend-vsdc.onrender.com/health |

---

## 🏗️ Architecture
```
ai-job-copilot/           ← Root repo (GitHub: k-satyam215/ai-job-copilot)
├── frontend/             ← Next.js 14, deployed on Vercel
├── extension/            ← Chrome Extension (load unpacked)
├── backend/              ← Separate nested git repo
│   ├── app/
│   │   ├── main.py       ← FastAPI entrypoint
│   │   ├── config.py     ← Pydantic settings
│   │   ├── routes/       ← auth, jobs, billing, resume, etc.
│   │   ├── models/       ← SQLAlchemy models
│   │   ├── services/     ← AI services, scrapers, billing
│   │   └── utils/        ← JWT, security
│   ├── alembic/          ← DB migrations
│   └── requirements.txt
└── render.yaml           ← Render deploy config
```

---

## ⚙️ Environment Variables

### Backend (Render Dashboard → Environment)
```
APP_ENV=production
JWT_SECRET=c723d44c-32b0-4182-9058-eb21cf92dc12
DATABASE_URL=postgresql://neondb_owner:npg_ZtPWwL1cdA9V@ep-billowing-hall-aqoabhgq.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require
GROQ_API_KEY=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
GROQ_MODEL=llama-3.3-70b-versatile
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=Ksatyam215@gmail.com
SMTP_PASS=duux lvbu nhqa mtdy
TELEGRAM_BOT_TOKEN=8435118600:AAHEgY49pXXofnoJq08PQpKZarvwhzNVd78
RAZORPAY_KEY_ID=rzp_test_Sx5w1hHCLZ052H
RAZORPAY_KEY_SECRET=gW8y9rcGID3O1BAQDkLSlPtJ
RAZORPAY_WEBHOOK_SECRET=rzp_test_webhook_secret
RAZORPAY_ENABLED=true
FRONTEND_ORIGIN=https://ai-job-copilot-psi.vercel.app
CORS_ALLOW_ORIGINS=https://ai-job-copilot-psi.vercel.app,http://localhost:3000
ADMIN_EMAILS=Ksatyam215@gmail.com
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

### Frontend (Vercel Dashboard → Environment Variables)
```
NEXT_PUBLIC_API_BASE=https://ai-job-copilot-backend-vsdc.onrender.com
```

---

## 🚀 Render Settings
- **Service Name**: ai-job-copilot-backend
- **Root Directory**: backend
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check**: `/health`

> Note: alembic upgrade head is NOT in build command because tables already exist on Neon DB.

---

## 💻 Local Development
```powershell
# Start backend
cd C:\Users\ksaty\Desktop\ai-job-copilot\backend
..\\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000

# Start frontend
cd C:\Users\ksaty\Desktop\ai-job-copilot\frontend
npm run dev
```

---

## 🔌 Chrome Extension Setup
1. Chrome → `chrome://extensions` → Developer Mode ON
2. "Load Unpacked" → select `C:\Users\ksaty\Desktop\ai-job-copilot\extension`
3. Open dashboard → Settings → copy your JWT token
4. Paste token in extension popup
5. Go to Naukri/LinkedIn → extension auto-fills forms

---

## 📤 Pushing Code
```powershell
# Push root repo
cd C:\Users\ksaty\Desktop\ai-job-copilot
git add . && git commit -m "update" && git push origin main

# Push backend repo
cd C:\Users\ksaty\Desktop\ai-job-copilot\backend
git add app/ alembic/ && git commit -m "update" && git push origin main
```

---

## 🧪 Testing
1. Visit https://ai-job-copilot-psi.vercel.app
2. Landing page → Sign Up → Dashboard
3. Upload resume (PDF) → AI parses profile
4. Click "Find Fresh Jobs" → jobs load from 8+ portals
5. Click "Start free" on billing → Razorpay test checkout

---

## 💰 Go Live Checklist
- [ ] Replace `rzp_test_*` Razorpay keys with live keys
- [ ] Set `RAZORPAY_WEBHOOK_SECRET` to actual webhook secret from Razorpay dashboard
- [ ] Upgrade Render to paid plan (removes 50s cold start)
- [ ] Add custom domain on Vercel
- [ ] Enable Sentry DSN for error tracking
