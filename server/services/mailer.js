import nodemailer from "nodemailer";

// ── Configuration ────────────────────────────────────────────────────────────
// Emails are sent through Gmail SMTP by default using a dedicated Gmail
// account + an "App Password":
//   EMAIL_USER=you@gmail.com
//   EMAIL_PASS=your_16_char_app_password
// (Create an app password at https://myaccount.google.com/apppasswords — you
// need 2-step verification enabled. Use the app password, NOT your login
// password.)
//
// For local development you can point SMTP_HOST/SMTP_PORT at the included mail
// sink (server/scripts/dev-mail-server.mjs) instead — see server/.env.
//
// Env vars are read lazily (at first send / verify), never at module load,
// so dotenv/config (loaded first in server.js) is always applied.
const smtpHost = () => process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = () => Number(process.env.SMTP_PORT || 587);
const emailUser = () => process.env.EMAIL_USER;
// Gmail app passwords are 16 lowercase chars with NO spaces. If the password
// was pasted in Gmail's grouped format ("abcd efgh ijkl mnop") we strip the
// spaces so auth never silently fails.
const emailPass = () => (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

const isSmtpConfigured = () => Boolean(emailUser() && emailPass());

const smtpSettings = () => ({
  host: smtpHost(),
  port: smtpPort(),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: emailUser(), pass: emailPass() },
});

let cachedTransport = null;

const getTransport = () => {
  if (!isSmtpConfigured()) {
    return nodemailer.createTransport({ jsonTransport: true });
  }
  if (!cachedTransport) {
    cachedTransport = nodemailer.createTransport(smtpSettings());
  }
  return cachedTransport;
};

const fromAddress = () =>
  process.env.SMTP_FROM ||
  `"RemoteRecruit" <${emailUser() || "no-reply@remoterecruit.com"}>`;

// ── Startup check ────────────────────────────────────────────────────────────
// Verifies the configured SMTP transporter actually connects/authenticates.
// Called once from server.js on boot so misconfiguration is loud, not silent.
export const verifyEmailService = async () => {
  if (!isSmtpConfigured()) {
    console.log(
      "📧 Mailer: SMTP not configured — emails will be logged to the console only. " +
        "Set EMAIL_USER/EMAIL_PASS in server/.env to send real emails via Gmail SMTP."
    );
    return { configured: false, ok: true };
  }

  const { host, port } = smtpSettings();
  try {
    await getTransport().verify();
    console.log(`✅ Mailer: SMTP connection verified (${host}:${port})`);
    return { configured: true, ok: true };
  } catch (error) {
    console.error(
      `❌ Mailer: SMTP verification failed (${host}:${port}) — ${error.message}. ` +
        "Check EMAIL_USER/EMAIL_PASS and that the Gmail App Password is correct."
    );
    return { configured: true, ok: false, error };
  }
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// ── Core send ────────────────────────────────────────────────────────────────
const sendMail = async ({ to, subject, text, html, attachments }) => {
  const message = { from: fromAddress(), to, subject, text, html, attachments };

  if (!isSmtpConfigured()) {
    const link = (text.match(/https?:\/\/\S+/) || [])[0] || "";
    console.log(`📧 [${to}] ${subject}`);
    if (link) console.log(`   Verification link: ${link}`);
    console.log(
      "   (SMTP not configured — email printed to console. Set EMAIL_USER/EMAIL_PASS to send real emails.)"
    );
    return { success: true, delivery: "console" };
  }

  const info = await getTransport().sendMail(message);
  return { success: true, delivery: "smtp", messageId: info.messageId };
};

// ── Email templates ──────────────────────────────────────────────────────────
const VERIFY_EMAIL_HTML = (name, url) => `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Verify your email</title>
    <style>
      @media only screen and (max-width: 620px) {
        .container { width: 100% !important; }
        .content { padding: 32px 24px !important; }
        .hero { padding: 36px 24px !important; }
        .button { width: 100% !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#f3f6fb;-webkit-text-size-adjust:none;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">
    <span style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;">
      Confirm your email address to activate your RemoteRecruit account.
    </span>
    <div style="background-color:#f3f6fb;padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
              <!-- Brand bar -->
              <tr>
                <td style="padding:0 0 24px 0;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" valign="middle">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                          <tr>
                            <td width="40" height="40" align="center" style="width:40px;height:40px;background:linear-gradient(90deg,#1E3A8A,#2563EB);border-radius:10px;">
                              <span style="color:#ffffff;font-size:20px;font-weight:700;line-height:40px;">R</span>
                            </td>
                            <td style="padding-left:12px;">
                              <span style="color:#1E3A8A;font-size:20px;font-weight:700;">RemoteRecruit</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Card -->
              <tr>
                <td style="background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 12px 32px rgba(30,58,138,0.10);">
                  <!-- Hero -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td class="hero" align="center" style="background:linear-gradient(135deg,#1E3A8A 0%,#2563EB 100%);padding:44px 32px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                          <tr>
                            <td width="64" height="64" align="center" style="width:64px;height:64px;background:rgba(255,255,255,0.16);border-radius:50%;">
                              <span style="color:#ffffff;font-size:30px;line-height:64px;">✓</span>
                            </td>
                          </tr>
                        </table>
                        <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:20px 0 0 0;">Confirm your email address</h1>
                      </td>
                    </tr>
                  </table>
                  <!-- Body -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td class="content" style="padding:40px 40px 32px 40px;">
                        <p style="color:#1f2937;font-size:16px;margin:0 0 16px 0;">Hello ${escapeHtml(name)},</p>
                        <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 8px 0;">
                          Thanks for creating a RemoteRecruit account. To activate it and start
                          finding or hiring top remote talent, please confirm that this email
                          address belongs to you.
                        </p>
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:28px 0 20px 0;">
                          <tr>
                            <td align="center">
                              <a href="${url}" class="button"
                                 style="display:inline-block;background:#1E3A8A;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:12px;border:1px solid #1E3A8A;">
                                Verify Email
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0 0 4px 0;">
                          If the button doesn't work, copy and paste this link into your browser:
                        </p>
                        <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0 0 24px 0;word-break:break-all;">
                          <a href="${url}" style="color:#2563EB;text-decoration:none;">${url}</a>
                        </p>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #eef2f7;">
                          <tr>
                            <td style="padding-top:20px;">
                              <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0;">
                                This link expires in <strong>24 hours</strong>. If you didn't create a
                                RemoteRecruit account, you can safely ignore this email — no changes
                                have been made to your account.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="padding:28px 16px 0 16px;">
                  <p style="color:#9ca3af;font-size:12px;line-height:1.6;margin:0 0 4px 0;">
                    You're receiving this email because an account was registered with this address on RemoteRecruit.
                  </p>
                  <p style="color:#9ca3af;font-size:12px;margin:0;">
                    © ${new Date().getFullYear()} RemoteRecruit · Global remote jobs
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
`;

export const sendVerificationEmail = async ({ to, name, verificationUrl }) => {
  const subject = "Verify Your Email Address";
  const text = [
    `Hello ${name},`,
    "",
    "Thanks for creating a RemoteRecruit account. To activate it and start",
    "finding or hiring top remote talent, please confirm your email address.",
    "",
    `Verify your email: ${verificationUrl}`,
    "",
    "This link will expire in 24 hours. If you did not create an account, you",
    "can safely ignore this email.",
  ].join("\n");

  try {
    const result = await sendMail({
      to,
      subject,
      text,
      html: VERIFY_EMAIL_HTML(name, verificationUrl),
    });
    if (result.success) {
      console.log(`📧 [${to}] Verification email delivered via ${result.delivery}`);
    }
    return result;
  } catch (error) {
    console.error(`❌ Failed to send verification email to ${to}:`, error.message);
    return { success: false, error };
  }
};

export const sendApplicationEmail = async ({
  to,
  jobTitle,
  applicant,
  coverLetter,
  cv,
}) => {
  const subject = `New Job Application - ${jobTitle}`;
  const text = [
    "A new application has been submitted.",
    "",
    `Applicant Name: ${applicant.fullName}`,
    `Email: ${applicant.email}`,
    `Phone: ${applicant.phone}`,
    `Job Title: ${jobTitle}`,
    "",
    "Cover Letter:",
    coverLetter || "(No cover letter provided)",
  ].join("\n");

  try {
    const result = await sendMail({
      to,
      subject,
      text,
      attachments: cv ? [{ filename: cv.originalname, content: cv.buffer }] : [],
    });
    if (result.success) {
      console.log(`📧 [${to}] Application email delivered via ${result.delivery}`);
    }
    return result;
  } catch (error) {
    console.error(`❌ Failed to send application email to ${to}:`, error.message);
    return { success: false, error };
  }
};
