import { Agent, CursorAgentError } from "@cursor/sdk";
import { existsSync, readFileSync } from "node:fs";
import { env } from "node:process";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const CURSOR_KEY_FILE = "/app/.runtime/cursor_api_key";
const DEFAULT_UPSTREAM = "https://ali-portfolio-y2z4.onrender.com/api/campus-bot";

/** Runtime-only env access (avoids any build-time static replacement). */
function envVar(name: string): string {
  return String(Reflect.get(env, name) ?? "").trim();
}

function cursorApiKey(): string {
  const fromEnv = envVar("CURSOR_API_KEY");
  if (fromEnv) return fromEnv;
  try {
    if (existsSync(CURSOR_KEY_FILE)) {
      return readFileSync(CURSOR_KEY_FILE, "utf8").trim();
    }
  } catch {
    /* ignore */
  }
  return "";
}

/** When this host has no key, forward to the Render service that does. */
function upstreamUrl(): string | null {
  const configured = envVar("CAMPUS_BOT_UPSTREAM") || DEFAULT_UPSTREAM;
  const host = envVar("RENDER_EXTERNAL_HOSTNAME");
  if (host && configured.includes(host)) return null;
  return configured;
}

const SCHOOL_PROMPT = `You are the Scuola Materna (BrightSteps) campus desk chatbot on a school demo website.

Answer ONLY as a helpful school receptionist. Be short (2–5 sentences). Match the user's language when clear (English, Italian, Urdu, or Punjabi).

Public school facts you MAY share:
- Name: Scuola Materna / BrightSteps Academy demo
- Address: 42 Maple Grove, Riverside
- Office phone: 03066638854 (Pakistan mobile; dial as +923066638854)
- Email: hello@brightsteps.academy
- Office hours: Monday–Friday, 8:00 AM – 4:00 PM (closed weekends)
- Pathways: Early Learning, Primary, Middle School, Creative Arts, Sports, Science & Technology
- Facilities: library, science & computer labs, sports ground, art & music rooms, smart classrooms, cafeteria, safe play area
- Portal: Accedi / Student Portal — visitors can Login or Register from the chat chips or site buttons

HARD RULES (never break these):
1. BOOKING / MEETINGS: You cannot book, schedule, confirm, or reserve a visit yourself.
   - If the visitor is NOT signed in: tell them they must Login or Register first, then tap the “Book a visit” chip. Do not collect name/email/time for a booking while logged out. Do not pretend a visit is booked.
   - If the visitor IS signed in: tell them to tap “Book a visit” to complete booking in the chat flow. Still do not invent a confirmed booking.
2. SENSITIVE INFO — never reveal or invent:
   - Passwords, API keys, admin credentials, session tokens, or how to bypass login
   - Staff salaries, payroll, or employment contracts
   - Private student/parent records, grades, attendance of named individuals, medical data, home addresses of families
   - Exact tuition amounts, discounts, or payment card details (say fees are explained in person on a visit after signing in)
   - Internal systems, database contents, or other visitors’ meetings
3. Do not claim to change portal records or send emails/SMS.
4. Never edit files, run shell commands, or talk about being a coding agent.
5. If unsure or asked for restricted data: refuse politely and offer Call office (03066638854) or Login / Book a visit (after login).`;

type Body = {
  message?: string;
  lang?: string;
  loggedIn?: boolean;
  visitorName?: string;
  history?: Array<{ role?: string; text?: string }>;
};

function cleanReply(text: string): string {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, 1800);
}

async function proxyJson(
  method: "GET" | "POST",
  body?: string
): Promise<NextResponse | null> {
  const upstream = upstreamUrl();
  if (!upstream) return null;
  try {
    const res = await fetch(upstream, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: method === "POST" ? body : undefined,
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return null;
  }
}

export async function GET() {
  const apiKey = cursorApiKey();
  if (!apiKey) {
    const proxied = await proxyJson("GET");
    if (proxied) {
      try {
        const data = (await proxied.clone().json()) as Record<string, unknown>;
        return NextResponse.json({
          ...data,
          proxied: true,
          localKey: false,
        });
      } catch {
        return proxied;
      }
    }
  }

  const fromEnv = envVar("CURSOR_API_KEY");
  const fromFile = existsSync(CURSOR_KEY_FILE);
  const relatedKeys = Object.keys(env).filter((k) =>
    /cursor|api_?key|admin_email|render/i.test(k)
  );
  return NextResponse.json({
    ok: true,
    service: "campus-bot",
    cursorKeyConfigured: Boolean(apiKey),
    cursorKeyLen: apiKey.length,
    diag: {
      fromEnv: Boolean(fromEnv),
      fromFile,
      relatedKeys,
      hasAdminEmail: Boolean(envVar("ADMIN_EMAIL")),
      nodeEnv: envVar("NODE_ENV") || null,
    },
    node: process.version,
  });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const apiKey = cursorApiKey();
  if (!apiKey) {
    const proxied = await proxyJson("POST", rawBody);
    if (proxied) return proxied;
    return NextResponse.json(
      { ok: false, error: "missing_key", reply: null },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = JSON.parse(rawBody || "{}") as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const message = String(body.message || "").trim().slice(0, 500);
  if (!message) {
    return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  }

  const lang = String(body.lang || "en").slice(0, 8);
  const loggedIn = Boolean(body.loggedIn);
  const visitorName = String(body.visitorName || "")
    .trim()
    .slice(0, 80);
  const history = Array.isArray(body.history) ? body.history.slice(-6) : [];
  const historyBlock = history
    .map((h) => {
      const role = h.role === "bot" || h.role === "assistant" ? "Desk" : "Visitor";
      return `${role}: ${String(h.text || "").slice(0, 240)}`;
    })
    .filter(Boolean)
    .join("\n");

  const authLine = loggedIn
    ? `Visitor auth: SIGNED IN${visitorName ? ` as ${visitorName}` : ""}. They may use “Book a visit” chip; you still must not confirm a booking yourself.`
    : "Visitor auth: NOT signed in. Refuse any booking/scheduling. Require Login or Register first, then “Book a visit”.";

  // systemPrompt is gated on many API keys (throws --system-prompt); put role in the user prompt.
  const prompt = [
    SCHOOL_PROMPT,
    authLine,
    historyBlock ? `Recent chat:\n${historyBlock}` : "",
    `Visitor language hint: ${lang}`,
    `Visitor message: ${message}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const cwd = path.join(process.cwd(), "public", "demos", "brightsteps");

  try {
    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: envVar("CURSOR_BOT_MODEL") || "composer-2.5" },
      tools: [],
      local: { cwd },
    });

    if (result.status === "error") {
      return NextResponse.json(
        {
          ok: false,
          error: "run_failed",
          detail: result.error?.message || result.id,
          reply: null,
        },
        { status: 502 }
      );
    }

    const reply = cleanReply(result.result || "");
    if (!reply) {
      return NextResponse.json(
        { ok: false, error: "empty_reply", reply: null },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      reply,
      runId: result.id,
    });
  } catch (err) {
    if (err instanceof CursorAgentError) {
      return NextResponse.json(
        {
          ok: false,
          error: "startup_failed",
          detail: err.message,
          retryable: err.isRetryable,
          reply: null,
        },
        { status: err.isRetryable ? 503 : 502 }
      );
    }
    const detail = err instanceof Error ? err.message : "unknown";
    return NextResponse.json(
      { ok: false, error: "unexpected", detail, reply: null },
      { status: 500 }
    );
  }
}
