# AI Job Copilot Launch Checklist

## Required External Accounts

- Groq API key.
- Stripe account with products/prices/webhooks.
- Production Postgres database.
- Redis instance.
- Email SMTP provider.
- Telegram bot token if Telegram notifications are enabled.
- Vercel/Railway/Render or equivalent hosting.
- Chrome Web Store developer account.
- Domain and SSL.

## Production Environment

- Set `JWT_SECRET` to a long random value.
- Set `DATABASE_URL` to Postgres.
- Set `GROQ_API_KEY`.
- Set Stripe webhook secret and checkout price IDs after adding the real Stripe integration.
- Configure `FRONTEND_ORIGIN` to the production frontend URL.
- Configure SMTP variables for email notifications.

## Prelaunch Verification

- `python -m py_compile backend/app/main.py backend/app/routes/*.py backend/app/services/*.py`
- `npm run build` inside `frontend`.
- Load extension unpacked and verify LinkedIn/Naukri pages.
- Test signup, resume upload, copilot memory, match score, autofill, application tracking.
- Test Docker stack with `docker compose up --build`.

## Safety Policy

- AI may fill forms.
- AI may prepare application workflows.
- AI must not submit final applications without user review/approval.
- CAPTCHA/security checks pause workflow and require user intervention.
