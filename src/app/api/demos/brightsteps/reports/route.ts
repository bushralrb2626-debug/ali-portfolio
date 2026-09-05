/**
 * BrightSteps school-admin reports — Slorsh catalog types, Cursor narrative.
 * Accepts a first-party pack from the demo dashboard (localStorage tallies).
 */

import { Agent, CursorAgentError } from "@cursor/sdk";
import { existsSync, readFileSync } from "node:fs";
import { env } from "node:process";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

const CURSOR_KEY_FILE = "/app/.runtime/cursor_api_key";

const TYPES = [
  "weekly",
  "monthly",
  "weekly_plus",
  "monthly_plus",
  "market_competitor",
  "product_performance",
  "pricing_optimization",
  "customer_satisfaction",
  "sales_performance",
  "executive_dashboard",
] as const;

type ReportType = (typeof TYPES)[number];

const LABELS: Record<ReportType, string> = {
  weekly: "Weekly Report",
  monthly: "Monthly Report",
  weekly_plus: "Weekly Report+",
  monthly_plus: "Monthly Report+",
  market_competitor: "Market + Competitor Report",
  product_performance: "Product Performance Report",
  pricing_optimization: "Pricing Optimization Report",
  customer_satisfaction: "Customer Satisfaction Report",
  sales_performance: "Sales Performance Report",
  executive_dashboard: "Executive Dashboard",
};

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

function brief(type: ReportType, topic?: string): string {
  const topicLine = topic
    ? `Niche/topic: ${topic}`
    : "Context: BrightSteps / Scuola Materna school campus demo admin.";
  const map: Record<ReportType, string> = {
    weekly:
      "WEEKLY school usage: Summary, Staff/students/attendance metrics, Meetings & visits, Action Items, Alerts.",
    monthly:
      "MONTHLY school ops: Summary, Enrollment & attendance trends, Fees snapshot, Results on file, Recommendations, Next Steps.",
    weekly_plus:
      "WEEKLY+ deeper: TL;DR, Funnel (visits→enrollment interest), Risks [URGENT], Priorities, Next Steps. No invented fees.",
    monthly_plus:
      "MONTHLY+ deeper: TL;DR, Ops health, Positioning vs typical school portals, Action Items, ROI note = Data not found if unknown.",
    market_competitor:
      "Market + Competitor for school portal demos: TL;DR, Differentiation, Competitor angles (Data not found for unknown prices), Actions.",
    product_performance:
      "Product Performance of the campus portal (attendance, meetings, desk bot): health, gaps, CTA fixes, Actions.",
    pricing_optimization:
      "Pricing/fee framing for the school demo (no invented tuition tables): packaging experiments, Actions.",
    customer_satisfaction:
      "Parent/visitor satisfaction from visits, inbox feedback, attendance friction: themes, trust fixes, Actions.",
    sales_performance:
      "Admissions funnel: visit requests → meetings → interest: conversion leaks, Actions.",
    executive_dashboard:
      "Executive one-pager: Snapshot metrics, Top risks, Top opportunities, This week priorities.",
  };
  return `${map[type]}\n${topicLine}`;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    usage: [
      { type: "weekly", label: LABELS.weekly },
      { type: "monthly", label: LABELS.monthly },
      { type: "weekly_plus", label: LABELS.weekly_plus, plus: true },
      { type: "monthly_plus", label: LABELS.monthly_plus, plus: true },
    ],
    market: [
      { type: "market_competitor", label: LABELS.market_competitor },
      { type: "product_performance", label: LABELS.product_performance },
      { type: "pricing_optimization", label: LABELS.pricing_optimization },
      { type: "customer_satisfaction", label: LABELS.customer_satisfaction },
      { type: "sales_performance", label: LABELS.sales_performance },
      { type: "executive_dashboard", label: LABELS.executive_dashboard },
    ],
  });
}

export async function POST(request: NextRequest) {
  let body: { type?: string; topic?: string; pack?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = String(body.type || "").trim() as ReportType;
  if (!TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
  }

  const pack = body.pack && typeof body.pack === "object" ? body.pack : {};
  const topic = String(body.topic || "").trim().slice(0, 200);
  const asOf = new Date().toISOString();
  const title = `${LABELS[type]} — school admin`;

  const fallback = [
    `# ${title}`,
    "",
    `**As of:** ${asOf}`,
    "",
    "## Snapshot",
    "```json",
    JSON.stringify(pack, null, 2).slice(0, 4000),
    "```",
    "",
    "## Note",
    "Structured pack only — AI narrative temporarily unavailable.",
  ].join("\n");

  const apiKey = cursorApiKey();
  if (!apiKey) {
    return NextResponse.json({
      ok: true,
      type,
      title,
      via: "fallback",
      markdown: fallback,
      summary: "Structured pack — AI temporarily unavailable.",
    });
  }

  const prompt = `You are an internal analyst for BrightSteps school admin (Ali’s portfolio campus demo). Admin seat like Slorsh.

${brief(type, topic)}

ACCURACY:
- Cite EXACT numbers from the JSON pack only.
- Never invent tuition, salaries, headcount, or competitor prices — write Data not found.
- Do not mention which AI or tooling generated this report. Do not mention Cursor, vendor models, or API keys.
- Brand as Slorsh / BrightSteps insight only if needed.
- Markdown only.

JSON pack:
${JSON.stringify({ as_of: asOf, type, topic, pack }, null, 2).slice(0, 14000)}`;

  try {
    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: envVar("CURSOR_REPORT_MODEL") || envVar("CURSOR_BOT_MODEL") || "auto" },
      tools: [],
      local: { cwd: path.resolve(process.cwd()) },
    });
    if (result.status === "error") {
      throw new Error(result.error?.message || "run_failed");
    }
    let text = String(result.result || "").trim();
    if (text.startsWith("```")) {
      text = text
        .replace(/^```(?:markdown|md)?\s*/i, "")
        .replace(/```\s*$/, "")
        .trim();
    }
    if (text.length < 80) throw new Error("short_reply");
    // Strip accidental tooling mentions from the narrative.
    text = text
      .replace(/\bCursor\b/gi, "Slorsh AI")
      .replace(/\bCursor API\b/gi, "Slorsh AI");
    const summary =
      text.split("\n").find((l) => l.trim() && !l.startsWith("#"))?.slice(0, 280) ||
      LABELS[type];
    return NextResponse.json({
      ok: true,
      type,
      title,
      via: "ai",
      markdown: text.slice(0, 24000),
      summary,
      runId: result.id,
    });
  } catch (err) {
    const detail =
      err instanceof CursorAgentError
        ? err.message
        : err instanceof Error
          ? err.message
          : "unknown";
    return NextResponse.json({
      ok: true,
      type,
      title,
      via: "fallback",
      markdown: fallback,
      summary: "Structured pack — AI temporarily unavailable.",
      detail,
    });
  }
}
