# Architecture

AI Job Copilot is organized as a modular AI SaaS platform.

## Backend

- FastAPI route layer.
- SQLAlchemy models for users, jobs, and applications.
- AI services for parsing, matching, question reasoning, tailoring, and career intelligence.
- Agent workflow services for observe/reason/plan/execute/verify/recover loops.
- Worker entrypoint for job polling and notifications.
- Docker-ready Postgres/Redis architecture.

## Frontend

- Next.js App Router dashboard.
- Resume intelligence and copilot memory.
- Analytics, interview prep, roadmap, billing, and applications screens.

## Extension

- Manifest V3.
- LinkedIn/Naukri content scripts.
- Dynamic form parser and filler.
- Workflow observer/controller/executor.
- Human-in-the-loop final submission policy.

## Production Boundaries

Cloud deployment, Stripe live mode, Chrome Store publishing, and provider credentials require external accounts. Code paths are prepared for those integrations.
