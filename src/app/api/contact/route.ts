import { sendContactEmail } from "@/lib/mailer";
import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_LENGTHS = {
  name: 100,
  email: 254,
  subject: 150,
  message: 5000,
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, subject, message } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !subject.trim() ||
    !message.trim()
  ) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const trimmed = {
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
  };

  if (!EMAIL_REGEX.test(trimmed.email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const tooLong = (Object.keys(MAX_LENGTHS) as Array<keyof typeof MAX_LENGTHS>).find(
    (field) => trimmed[field].length > MAX_LENGTHS[field],
  );

  if (tooLong) {
    return NextResponse.json({ error: `The ${tooLong} field is too long.` }, { status: 400 });
  }

  try {
    await sendContactEmail(trimmed);
  } catch (error) {
    // eslint-disable-next-line no-console -- surface SMTP failures in server logs for debugging
    console.error("Failed to send contact email:", error);
    return NextResponse.json(
      { error: "Failed to send your message. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
