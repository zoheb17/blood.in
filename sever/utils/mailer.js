import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let cachedTransporter;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const user = process.env.MAIL_USER || "sayyedzohebuddin61859@gmail.com";
  const pass = process.env.MAIL_PASS || process.env.PASS;

  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  return cachedTransporter;
}

/**
 * Send an email.
 * @param {string} to
 * @param {string} subject
 * @param {{text?: string, html?: string}} content
 */
async function sendmail(to, subject, content = {}) {
  try {
    const transporter = getTransporter();
    const from = process.env.MAIL_FROM || process.env.MAIL_USER || "sayyedzohebuddin61859@gmail.com";

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: content.text,
      html: content.html,
    });

    console.log("Email-sent", info.messageId);
  } catch (error) {
    console.log(error);
  }
}

export default sendmail;