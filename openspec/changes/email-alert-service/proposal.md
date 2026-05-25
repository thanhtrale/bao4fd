## Why

The bulk import pipeline needs to notify admins when import jobs fail. After a batch completes with failures, the system sends a digest email listing all failed URLs with their error reasons. This enables admins to investigate and take action without monitoring the dashboard constantly.

## What Changes

- Add `nodemailer` npm dependency
- Create email service with SMTP configuration via environment variables
- Create failure digest email formatter
- Integrate email sending into batch finalization in process-imports endpoint
- Add SMTP environment variables to runtime config

## Capabilities

### New Capabilities
- `email-alerts`: Email service that sends failure digest notifications when import batches complete with errors

### Modified Capabilities

## Impact

- New `server/services/email.service.ts`
- New runtime config: `smtpHost`, `smtpPort`, `smtpUser`, `smtpPass`, `adminEmail`
- Modifies `server/api/admin/process-imports.post.ts` to send email on batch finalization
