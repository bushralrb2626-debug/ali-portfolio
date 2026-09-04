import { Agent, CursorAgentError } from "@cursor/sdk";
import { NextRequest, NextResponse } from "next/server";
import path from "node:path";

export const runtime = "nodejs";
export const maxDuration = 120;

const SCHOOL_PROMPT = `You are the Scuola Materna (BrightSteps) campus desk chatbot on a school demo website.

Answer ONLY as a helpful school receptionist. Be short (2–5 sentences). Match the user's language when clear (English, Italian, Urdu, or Punjabi).

School facts:
- Name: Scuola Materna / BrightSteps Academy demo
- Address: 42 Maple Grove, Riverside
- Office phone: 03066638854 (Pakistan mobile; dial as +923066638854)
- Email: hello@brightsteps.academy
- Office hours: Monday–Friday, 8:00 AM – 4:00 PM (closed weekends)
- Pathways: Early Learning, Primary, Middle School, Creative Arts, Sports, Science & Technology
- Facilities: library, science & computer labs, sports ground, art & music rooms, smart classrooms, cafeteria, safe play area
- Portal: Accedi / Student Portal — demo logins student_demo, parent_demo, teacher_demo (password Demo@12345); admin@gmail.com / 123456
- Visits: visitors must log in first, then book via the chat “Book a visit” flow (you can tell them to tap that chip)

Rules:
- Do not invent fees, staff salaries, or private student data.
- Do not claim to change portal records; point parents/students to the portal.
- If they want to book a visit, tell them to tap “Book a visit” or say they want an appointment.
- Never edit files, run shell commands, or talk about being a coding agent.
- If unsure, say what you know and offer Call office (03066638854) or Book a visit.`;

type Body = {
  message?: string;
  lang?: string;
  history?: Array<{ role?: string; text?: string }>;
};

function cleanReply(text: string): string {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, 1800);
}

export async function GET() {
  const hasKey = Boolean(String(process.env.CURSOR_API_KEY || "").trim());
  return NextResponse.json({
    ok: true,
    service: "campus-bot",
    cursorKeyConfigured: hasKey,
    node: process.version,
  });
}

export async function POST(request: NextRequest) {
  const apiKey = String(process.env.CURSOR_API_KEY || "").trim();
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "missing_key", reply: null },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const message = String(body.message || "").trim().slice(0, 500);
  if (!message) {
    return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  }

  const lang = String(body.lang || "en").slice(0, 8);
  const history = Array.isArray(body.history) ? body.history.slice(-6) : [];
  const historyBlock = history
    .map((h) => {
      const role = h.role === "bot" || h.role === "assistant" ? "Desk" : "Visitor";
      return `${role}: ${String(h.text || "").slice(0, 240)}`;
    })
    .filter(Boolean)
    .join("\n");

  const prompt = [
    historyBlock ? `Recent chat:\n${historyBlock}\n` : "",
    `Visitor language hint: ${lang}`,
    `Visitor message: ${message}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const cwd = path.join(process.cwd(), "public", "demos", "brightsteps");

  try {
    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: process.env.CURSOR_BOT_MODEL || "composer-2.5" },
      systemPrompt: SCHOOL_PROMPT,
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
      agentId: result.agentId,
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
