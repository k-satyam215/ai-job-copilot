# AI Job Copilot

Production-shaped MVP for an autonomous AI career agent.

## What Is Implemented

- FastAPI backend with SQLite persistence.
- JWT signup/login and protected APIs.
- Resume upload with PDF/TXT text extraction.
- Groq LLaMA 3.3 resume parsing when `GROQ_API_KEY` is set.
- Local fallback parser when no API key is configured.
- Profile-aware hybrid job matching with skill, role, semantic token, and vector-ready scoring.
- Job deduplication by URL/title/company.
- Application tracking.
- Next.js dashboard, resume upload, jobs, and applications UI.
- Manifest V3 Chrome extension for LinkedIn and Naukri copilot mode.
- Extension popup token storage and backend message coordination.
- Dynamic AI form question reasoning with validation, caching, and profile memory.
- Agentic apply workflow planner/verifier/executor contracts.
- Analytics, skill gaps, interview prep, roadmap, billing plans, and enterprise admin summary APIs.
- Dockerfiles and docker-compose for Postgres/Redis/backend/worker/frontend.

## Backend Setup

```powershell
cd C:\Users\ksaty\Desktop\ai-job-copilot
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
$env:GROQ_API_KEY="your_groq_key"
.\.venv\Scripts\uvicorn.exe app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

`GROQ_API_KEY` is optional for local testing. Without it, resume parsing uses a safe local fallback.

## Frontend Setup

```powershell
cd C:\Users\ksaty\Desktop\ai-job-copilot\frontend
npm install
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Open `http://127.0.0.1:3000`.

## Extension Setup

1. Open Chrome extensions.
2. Enable Developer Mode.
3. Load unpacked extension from `C:\Users\ksaty\Desktop\ai-job-copilot\extension`.
4. Signup/login in the web app.
5. Copy the JWT token shown after login/signup.
6. Paste it into the extension popup.
7. Open a LinkedIn or Naukri job page.
8. Use the injected AI Job Copilot panel to fill and track the application.

The extension intentionally fills and tracks applications but leaves final submission for user review.

## Product Modules

- `backend/app/services/agent/`: reusable agentic apply workflow planning and execution contracts.
- `backend/app/services/question_reasoner.py`: cached, validated AI answer generation.
- `backend/app/services/form_ontology.py`: generalized form field classification.
- `backend/app/services/vector_matcher.py`: vector-ready hybrid matching layer.
- `backend/app/services/resume_tailor.py`: ATS-aware resume tailoring suggestions.
- `backend/app/routes/analytics.py`: career intelligence, interview prep, roadmap, tailoring endpoints.
- `extension/workflow_controller.js`: extension workflow planning bridge.
- `extension/dom_observer.js`: browser UI observation layer.
- `extension/action_executor.js`: safe action execution layer.

## Docker Setup

```powershell
cd C:\Users\ksaty\Desktop\ai-job-copilot
copy .env.example .env
docker compose up --build
```

The Docker stack includes Postgres, Redis, backend, worker, and frontend. For local lightweight development, SQLite remains the default.

## Final Launch Commands

```powershell
cd C:\Users\ksaty\Desktop\ai-job-copilot
.\scripts\check_launch_readiness.ps1
.\scripts\package_extension.ps1
.\scripts\production_smoke.ps1
```

The generated extension package is created at `outputs/ai-job-copilot-extension.zip`.

## Environment Variables

- `GROQ_API_KEY`: enables real Groq resume parsing.
- `GROQ_MODEL`: defaults to `llama-3.3-70b-versatile`.
- `JWT_SECRET`: change this before production.
- `DATABASE_URL`: defaults to local SQLite.

## Next Production Steps

- Add migrations with Alembic.
- Connect real Stripe checkout/webhooks.
- Add pgvector-backed embeddings.
- Add Playwright persistent browser profiles for external ATS portals.
- Submit extension for Chrome Web Store review after permissions/security audit.
- Add email/Telegram notification providers.
