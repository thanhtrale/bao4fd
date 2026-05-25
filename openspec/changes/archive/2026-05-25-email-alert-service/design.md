## Context

Gmail SMTP with app passwords is used for sending operational emails. This is free, requires no credit card, and has a 500 emails/day limit which is more than sufficient for error alerts.

## Goals / Non-Goals

**Goals:**
- Send one digest email per batch when it completes with failures
- Include failed URLs, timestamps, and error reasons in the email body
- Gracefully handle SMTP configuration missing (skip email, log warning)

**Non-Goals:**
- No HTML email templates (plain text is sufficient for operational alerts)
- No email queue or retry for email sending itself
- No success notifications (only failure alerts)

## Decisions

1. **Nodemailer + Gmail SMTP** — Free, reliable, well-supported. App passwords provide secure access without OAuth complexity.

2. **One email per batch** — Consolidates all failures into a single email. Avoids email spam for large batches with many failures.

3. **Graceful degradation** — If SMTP env vars are not configured, email sending is silently skipped with a console warning. This allows the system to work without email in development.

## Risks / Trade-offs

- [Gmail rate limits] → 500 emails/day, far more than needed for batch alerts
- [SMTP credentials in env] → Standard practice for serverless; Vercel encrypts env vars at rest
