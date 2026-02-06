function escapeHtml(input) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emailLayout({ title, preheader, contentHtml, cta }) {
  const safeTitle = escapeHtml(title);
  const safePreheader = escapeHtml(preheader);
  const ctaHtml = cta?.href
    ? `
      <div style="margin: 28px 0 12px;">
        <a href="${cta.href}"
           style="display:inline-block;background:#e11d48;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:700;">
          ${escapeHtml(cta.label || "Open")}
        </a>
      </div>
    `
    : "";

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${safeTitle}</title>
    </head>
    <body style="margin:0;padding:0;background:#fff1f2;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        ${safePreheader}
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fff1f2;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #fecdd3;">
              <tr>
                <td style="padding:22px 24px;background:linear-gradient(135deg,#fff1f2,#ffffff);border-bottom:1px solid #fecdd3;">
                  <div style="font-size:20px;font-weight:800;color:#e11d48;">Blood.in</div>
                  <div style="margin-top:6px;font-size:14px;color:#475569;">${safeTitle}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:22px 24px;color:#0f172a;font-size:15px;line-height:1.6;">
                  ${contentHtml}
                  ${ctaHtml}
                  <div style="margin-top:18px;font-size:12px;color:#64748b;">
                    If you didn’t request this, you can safely ignore this email.
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 24px;background:#fafafa;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">
                  © ${new Date().getFullYear()} Blood.in
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

export function verificationEmailTemplate({ verifyLink }) {
  const safeLink = escapeHtml(verifyLink);
  const contentHtml = `
    <div style="font-size:16px;font-weight:800;color:#0f172a;">Verify your email</div>
    <div style="margin-top:10px;color:#334155;">
      Thanks for signing up. Please verify your email to activate your account.
    </div>
    <div style="margin-top:14px;font-size:13px;color:#475569;">
      Or copy and paste this link into your browser:
      <div style="margin-top:6px;word-break:break-all;color:#0ea5e9;">${safeLink}</div>
    </div>
  `;

  return {
    subject: "Verify your email for Blood.in",
    html: emailLayout({
      title: "Email Verification",
      preheader: "Verify your email to activate your Blood.in account.",
      contentHtml,
      cta: { href: verifyLink, label: "Verify Email" },
    }),
    text:
      `Verify your email for Blood.in\n\n` +
      `Please open this link to verify your email:\n${verifyLink}\n`,
  };
}

export function welcomeEmailTemplate() {
  const contentHtml = `
    <div style="font-size:16px;font-weight:800;color:#0f172a;">Welcome to Blood.in</div>
    <div style="margin-top:10px;color:#334155;">
      Your email is verified. You can now login and request or register as a donor.
    </div>
    <ul style="margin:12px 0 0 18px;color:#334155;">
      <li>Search donors by blood group</li>
      <li>Register as a donor from your dashboard</li>
      <li>Keep your city updated for accurate matches</li>
    </ul>
  `;

  return {
    subject: "Welcome to Blood.in",
    html: emailLayout({
      title: "Welcome",
      preheader: "Your Blood.in account is ready.",
      contentHtml,
    }),
    text:
      "Welcome to Blood.in\n\n" +
      "Your email is verified. You can now login and request or register as a donor.\n",
  };
}

