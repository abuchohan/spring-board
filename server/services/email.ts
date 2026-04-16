import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
// Use onboarding@resend.dev in dev until a domain is verified
const FROM = "Spring Board <onboarding@resend.dev>";
const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

function baseEmailLayout(content: string, previewText = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Spring Board</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@1,500&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    body { margin: 0; padding: 0; background-color: #F7F6F2; }
    .email-body { background-color: #F7F6F2; width: 100%; }
    .email-wrapper { max-width: 600px; margin: 0 auto; }
    @media only screen and (max-width: 620px) {
      .email-wrapper { width: 100% !important; }
      .email-card { padding: 32px 24px !important; }
      .email-header { padding: 24px !important; }
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#F7F6F2;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${previewText}</div>` : ""}
  <table class="email-body" role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color:#F7F6F2;width:100%;padding:40px 16px;">
    <tr>
      <td align="center">
        <table class="email-wrapper" role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
          <tr>
            <td class="email-header" style="background-color:#2B2D31;padding:28px 40px;border-radius:12px 12px 0 0;" align="center">
              <span style="font-family:'Newsreader',Georgia,serif;font-style:italic;font-weight:500;font-size:26px;letter-spacing:-0.01em;color:#F7F6F2;">Spring Board</span>
            </td>
          </tr>
          <tr>
            <td style="background-color:#C5A059;height:3px;line-height:3px;font-size:0;">&nbsp;</td>
          </tr>
          <tr>
            <td class="email-card" style="background-color:#FFFFFF;padding:48px 40px;border-radius:0 0 12px 12px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px;" align="center">
              <p style="margin:0 0 8px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:12px;color:#9B9489;line-height:1.6;">
                You received this email because you have a Spring Board account.
              </p>
              <p style="margin:0;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:12px;color:#9B9489;line-height:1.6;">
                © ${new Date().getFullYear()} Spring Board. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(label: string, href: string, bg = "#2B2D31"): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0;">
    <tr>
      <td style="border-radius:8px;background-color:${bg};">
        <a href="${href}" target="_blank"
          style="display:inline-block;padding:14px 32px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:8px;letter-spacing:0.01em;">
          ${label}
        </a>
      </td>
    </tr>
  </table>`;
}

export async function sendWelcomeEmail(to: string, name?: string): Promise<void> {
  const greeting = name ? `Hi ${name},` : "Welcome,";
  const appUrl = `${APP_URL}/dashboard`;

  const content = `
    <h1 style="margin:0 0 16px;font-family:'Newsreader',Georgia,serif;font-style:italic;font-weight:500;font-size:32px;color:#2B2D31;letter-spacing:-0.02em;line-height:1.2;">
      You're in.
    </h1>
    <p style="margin:0 0 12px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:16px;color:#4A4743;line-height:1.7;">
      ${greeting}
    </p>
    <p style="margin:0 0 12px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:16px;color:#4A4743;line-height:1.7;">
      Your Spring Board account is ready. Head to your dashboard to get started.
    </p>
    ${ctaButton("Go to dashboard", appUrl, "#7F77DD")}
    <hr style="border:none;border-top:1px solid #EDEDEA;margin:40px 0 32px;" />
    <p style="margin:0;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:13px;color:#9B9489;line-height:1.6;">
      If you didn't create this account, you can safely ignore this email.
    </p>`;

  const text = `Welcome to Spring Board!\n\nYour account is ready. Head to your dashboard:\n${appUrl}\n\nIf you didn't create this account, you can safely ignore this email.`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to Spring Board",
    html: baseEmailLayout(content, "Your Spring Board account is ready."),
    text,
  });
}

export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
  const content = `
    <h1 style="margin:0 0 24px;font-family:'Newsreader',Georgia,serif;font-style:italic;font-weight:500;font-size:28px;color:#2B2D31;letter-spacing:-0.02em;line-height:1.2;">
      Reset your password
    </h1>
    <p style="margin:0 0 12px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:16px;color:#4A4743;line-height:1.7;">
      We received a request to reset the password for your Spring Board account.
    </p>
    <p style="margin:0;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:16px;color:#4A4743;line-height:1.7;">
      Click the button below to choose a new password. This link expires in <strong>15 minutes</strong>.
    </p>
    ${ctaButton("Reset Password", resetLink, "#2B2D31")}
    <hr style="border:none;border-top:1px solid #EDEDEA;margin:40px 0 32px;" />
    <p style="margin:0 0 8px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:13px;color:#9B9489;line-height:1.6;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="margin:0 0 20px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:12px;color:#7F77DD;line-height:1.6;word-break:break-all;">
      ${resetLink}
    </p>
    <p style="margin:0;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:13px;color:#9B9489;line-height:1.6;">
      If you didn't request a password reset, you can safely ignore this email.
    </p>`;

  const text = `Reset your Spring Board password\n\nClick the link below to set a new one:\n\n${resetLink}\n\nThis link expires in 15 minutes.\n\nIf you didn't request this, you can safely ignore this email.`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your Spring Board password",
    html: baseEmailLayout(content, "Reset your Spring Board password — link expires in 15 minutes."),
    text,
  });
}
