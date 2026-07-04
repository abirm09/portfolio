import nodemailer, { Transporter } from "nodemailer";

export type ContactFormPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

// Every submission arrives with this exact subject so it's easy to filter/search for in the inbox.
const SUBJECT_ALIAS = "New Portfolio Contact Form Submission";

let transporter: Transporter | null = null;

const getTransporter = (): Transporter => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in the environment.",
    );
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  return transporter;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const sendContactEmail = async ({ name, email, subject, message }: ContactFormPayload) => {
  const to = process.env.CONTACT_TO_EMAIL?.split(",");

  if (!to) {
    throw new Error("CONTACT_TO_EMAIL is not configured.");
  }

  const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER;
  const transport = getTransporter();

  await transport.sendMail({
    from: `"Portfolio Contact Form" <${from}>`,
    to,
    replyTo: `"${name}" <${email}>`,
    subject: SUBJECT_ALIAS,
    text: `You got a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1a1a1a;">
        <h2 style="margin-bottom: 16px;">${SUBJECT_ALIAS}</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>
    `,
  });
};
