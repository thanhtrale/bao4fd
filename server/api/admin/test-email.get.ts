import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const config = useRuntimeConfig()

  if (!config.smtpHost || !config.smtpUser || !config.smtpPass) {
    return { error: 'SMTP not configured', smtpHost: config.smtpHost, smtpUser: config.smtpUser }
  }

  const transport = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort) || 587,
    secure: Number(config.smtpPort) === 465,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  })

  try {
    const info = await transport.sendMail({
      from: config.smtpUser,
      to: config.adminEmail || config.smtpUser,
      subject: '[Test] Email service working',
      text: 'This is a test email from Mini News Portal.\nIf you received this, the email service is working correctly.',
    })

    console.log('[test-email] Sent:', info.messageId)
    return { success: true, messageId: info.messageId, to: config.adminEmail || config.smtpUser }
  }
  catch (err: any) {
    console.error('[test-email] Failed:', err)
    return { success: false, error: err.message }
  }
})
