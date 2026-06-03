# Environment Configuration Reference

> **Note:** Copy `docs/ENV_REFERENCE.md` values into your local `.env` file. The actual `.env.example` already exists in the repo root — this document is a comprehensive reference for all production settings.

## Required Setup

```bash
cp .env.example .env
# Edit .env with your real secrets
```

## Full Production Configuration

```env
# ---------- App ----------
APP_NAME="AI Job Copilot"
APP_ENV=production
APP_VERSION=0.2.0
APP_DEBUG=false
APP_PORT=8000
APP_HOST=0.0.0.0
APP_LOG_LEVEL=INFO
APP_TIMEZONE=Asia/Kolkata

# ---------- Database ----------
DATABASE_URL=postgresql+psycopg://user:pass@host:5432/ai_job_copilot
DATABASE_POOL_SIZE=10
DATABASE_MAX_OVERFLOW=20
DATABASE_POOL_TIMEOUT=30
DATABASE_ECHO=false

# ---------- Security ----------
JWT_SECRET=GENERATE_WITH_secrets.token_urlsafe(64)
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# ---------- AI / LLM (Groq) ----------
GROQ_API_KEY=gsk_your_real_key_here
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_TIMEOUT_SECONDS=45
GROQ_TEMPERATURE=0.2
AI_FALLBACK_ENABLED=true

# ---------- Embeddings ----------
EMBEDDING_BACKEND=sentence-transformer
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
EMBEDDING_DIM=384
EMBEDDING_CACHE_DIR=.cache/embeddings

# ---------- Vector Store ----------
VECTOR_BACKEND=pgvector
VECTOR_TOP_K=20

# ---------- Frontend / CORS ----------
FRONTEND_ORIGIN=https://app.aijobcopilot.com
CORS_ALLOW_ORIGINS=https://app.aijobcopilot.com,https://aijobcopilot.com

# ---------- Resume Uploads ----------
RESUME_UPLOAD_DIR=uploads
RESUME_MAX_BYTES=5242880
RESUME_ALLOWED_EXT=.pdf,.txt

# ---------- Matching ----------
HIGH_MATCH_THRESHOLD=75
REVIEW_MATCH_THRESHOLD=50

# ---------- Rate Limiting ----------
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_BURST=100

# ---------- Razorpay (Billing) ----------
RAZORPAY_ENABLED=true
RAZORPAY_KEY_ID=rzp_live_xxxxxxx
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
RAZORPAY_CURRENCY=INR

# ---------- Observability ----------
SENTRY_DSN=https://xxxx@sentry.io/123
LOG_JSON=true
LOG_FILE=logs/app.log

# ---------- Feature Flags ----------
FEATURE_AUTONOMOUS_APPLY=true
FEATURE_TELEGRAM_NOTIFY=true
FEATURE_VECTOR_SEARCH=true
```

## Generate Secure Secrets

```bash
# JWT Secret (run once, save to .env)
python -c "import secrets; print(secrets.token_urlsafe(64))"

# Webhook signing secret
python -c "import secrets; print(secrets.token_hex(32))"
```
