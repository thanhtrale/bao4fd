## 1. Dependencies

- [x] 1.1 Install `nodemailer` and `@types/nodemailer`

## 2. Configuration

- [x] 2.1 Add SMTP env vars to nuxt.config.ts runtimeConfig (smtpHost, smtpPort, smtpUser, smtpPass, adminEmail)

## 3. Email Service

- [x] 3.1 Create `server/services/email.service.ts` with `sendFailureDigest(batchId)` that queries failed jobs and sends a digest email via Nodemailer

## 4. Integration

- [x] 4.1 Call `sendFailureDigest()` from process-imports endpoint when batch is finalized with failures
