/**
 * Push portfolio admin events to Ali's Gmail so the /admin panel is optional.
 * Default inbox: alimasterofall105@gmail.com
 *
 * Transport (first match wins):
 * 1. RESEND_API_KEY (+ optional RESEND_FROM)
 * 2. SMTP_HOST + SMTP_USER + SMTP_PASS (Gmail app password works)
 */

const DEFAULT_ADMIN_INBOX = "alimasterofall105@gmail.com";

function envVar(name: string): string {
  return String(process.env[name] ?? "").trim();
}

export function adminNotifyEmail(): string {
  return (
    envVar("ADMIN_NOTIFY_EMAIL") ||
    envVar("ADMIN_EMAIL") ||
    DEFAULT_ADMIN_INBOX
  );
}

export type AdminNotifyPayload = {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

async function sendViaResend(to: string, payload: AdminNotifyPayload): Promise<boolean> {
  const key = envVar("RESEND_API_KEY");
  if (!key) return false;
  const from =
    envVar("RESEND_FROM") || "Portfolio Admin <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: payload.subject,
      text: payload.text,
      html: payload.html || undefined,
      reply_to: payload.replyTo || undefined,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn("[admin-notify] Resend failed", res.status, body.slice(0, 300));
    return false;
  }
  return true;
}

async function sendViaSmtp(to: string, payload: AdminNotifyPayload): Promise<boolean> {
  const host = envVar("SMTP_HOST");
  const user = envVar("SMTP_USER");
  const pass = envVar("SMTP_PASS");
  if (!host || !user || !pass) return false;

  try {
    const nodemailer = await import("nodemailer");
    const port = Number(envVar("SMTP_PORT") || "587");
    const secure = envVar("SMTP_SECURE") === "1" || port === 465;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: envVar("SMTP_FROM") || user,
      to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
      replyTo: payload.replyTo,
    });
    return true;
  } catch (err) {
    console.warn("[admin-notify] SMTP failed", err);
    return false;
  }
}

/** Awaited send — returns whether an email was accepted by a transport. */
export async function notifyAdmin(
  payload: AdminNotifyPayload
): Promise<{ sent: boolean; to: string }> {
  const to = adminNotifyEmail();
  if (!to) return { sent: false, to: "" };

  try {
    if (await sendViaResend(to, payload)) return { sent: true, to };
    if (await sendViaSmtp(to, payload)) return { sent: true, to };
    console.warn(
      "[admin-notify] No mail transport configured (set RESEND_API_KEY or SMTP_*). Skipped:",
      payload.subject
    );
    return { sent: false, to };
  } catch (err) {
    console.warn("[admin-notify] unexpected", err);
    return { sent: false, to };
  }
}

/** Fire-and-forget — never blocks the visitor path. */
export function notifyAdminBackground(payload: AdminNotifyPayload): void {
  void notifyAdmin(payload);
}

export function notifyContactMessage(input: {
  name: string;
  email: string;
  message: string;
}): void {
  notifyAdminBackground({
    subject: `[Portfolio] Contact from ${input.name}`,
    replyTo: input.email,
    text: [
      "New contact form message (also in /admin/messages).",
      "",
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      "",
      input.message,
    ].join("\n"),
    html: `
      <p><strong>New contact form message</strong></p>
      <p>Name: ${escapeHtml(input.name)}<br/>Email: <a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></p>
      <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(input.message)}</pre>
    `,
  });
}

export function notifyBooking(input: {
  name: string;
  email: string;
  note: string;
  slotId: string;
  startsAt?: string;
}): void {
  notifyAdminBackground({
    subject: `[Portfolio] Booking — ${input.name}`,
    replyTo: input.email,
    text: [
      "New visit booking (also in /admin/slots).",
      "",
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Slot: ${input.startsAt || input.slotId}`,
      "",
      input.note || "(no note)",
    ].join("\n"),
    html: `
      <p><strong>New visit booking</strong></p>
      <p>Name: ${escapeHtml(input.name)}<br/>Email: <a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a><br/>When: ${escapeHtml(input.startsAt || input.slotId)}</p>
      <p>${escapeHtml(input.note || "(no note)")}</p>
    `,
  });
}

export function notifyReportReady(input: {
  type: string;
  title?: string;
  summary?: string;
  via?: string;
  credits?: number;
}): void {
  notifyAdminBackground({
    subject: `[Portfolio] Report ready — ${input.type}`,
    text: [
      "A portfolio report finished (also in /admin/reports).",
      "",
      `Type: ${input.type}`,
      `Title: ${input.title || "—"}`,
      `Via: ${input.via || "—"}`,
      input.credits != null ? `Credits (Agency): ${input.credits}` : "",
      "",
      input.summary || "",
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
