/**
 * BrightSteps school-admin reports — Slorsh catalog types, Cursor narrative.
 * Accepts a first-party pack from the demo dashboard (localStorage tallies).
 */

import { Agent, CursorAgentError } from "@cursor/sdk";
import { existsSync, readFileSync } from "node:fs";
import { env } from "node:process";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { billPortfolioReport } from "@/lib/slorsh-usage";

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

const MARKET_TYPES: ReportType[] = [
  "market_competitor",
  "product_performance",
  "pricing_optimization",
  "customer_satisfaction",
  "sales_performance",
  "executive_dashboard",
];

function isMarketType(type: ReportType): boolean {
  return MARKET_TYPES.includes(type);
}

function brief(type: ReportType, topic?: string): string {
  const topicLine = topic
    ? `Niche/topic: ${topic}`
    : "Context: BrightSteps / Scuola Materna school campus demo admin (Pakistan / GCC-style private school portal).";
  const map: Record<ReportType, string> = {
    weekly:
      "WEEKLY school usage: Summary, Staff/students/attendance metrics, Meetings & visits, Action Items, Alerts.",
    monthly:
      "MONTHLY school ops: Summary, Enrollment & attendance trends, Fees snapshot, Results on file, Recommendations, Next Steps.",
    weekly_plus:
      "WEEKLY+ deeper: TL;DR, Funnel (visits→enrollment interest), Risks [URGENT], Priorities, Next Steps. No invented fees for THIS school.",
    monthly_plus:
      "MONTHLY+ deeper: TL;DR, Ops health, Positioning vs typical school portals, Action Items. ROI for THIS school = Data not found if unknown.",
    market_competitor: `Market + Competitor intel (analyst depth, NOT a pack dump).
Sections: TL;DR · Market landscape (EdTech / school SIS / parent portals) · Named competitor angles (e.g. PowerSchool, Infinite Campus, ClassDojo, Google Classroom, local private-school portals — pick ones relevant to niche) · How BrightSteps/Slorsh campus desk differentiates · Pricing & packaging ranges as industry ESTIMATES (label clearly) · Actions for this admin.
Do NOT fill every price cell with "Data not found". Use your knowledge for market norms; reserve "Data not found" only for THIS school's missing pack fields (tuition, vendor fees not in JSON).`,
    product_performance: `Product Performance of the campus portal — analyst write-up.
Sections: TL;DR · Feature health vs category norms (attendance windows, parent visits, desk bot, results) · Engagement signals from pack · Gaps vs competitors · CTA / UX fixes · Actions.
Compare against typical school-portal feature sets; do not refuse analysis just because pack is small.`,
    pricing_optimization: `Pricing / fee packaging strategy for a private-school portal SaaS + school demo.
Sections: TL;DR · How category vendors usually price (per-student / campus / seat — as ESTIMATES) · Experiments this admin can run · What NOT to invent from pack · Actions.
Industry price bands are allowed when labeled as estimates.`,
    customer_satisfaction: `Parent/visitor satisfaction intel.
Sections: TL;DR · Themes from pack (visits, feedback, attendance friction) · Typical parent pain points in school portals · Trust fixes · Actions.
Blend pack signals with category expertise.`,
    sales_performance: `Admissions / visit funnel performance.
Sections: TL;DR · Pack funnel (visits → meetings → interest) · Category conversion benchmarks as ESTIMATES · Leak fixes · Actions.`,
    executive_dashboard: `Executive one-pager for school admin.
Sections: Snapshot (exact pack metrics) · Top risks · Top opportunities (market + ops) · This week priorities · Open questions.
Opportunities may include market moves — not only empty pack fields.`,
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

  // Agency debit on Slorsh (School Desk) before Cursor spend.
  const bill = await billPortfolioReport({
    type,
    title,
    source: "brightsteps_school_admin",
  });
  if (!bill.ok) {
    return NextResponse.json(
      {
        error:
          bill.error === "secret_missing"
            ? "Billing not configured (SLORSH_USAGE_SECRET)."
            : bill.error || "Not enough credits on Slorsh admin.",
        credits_required: bill.credits,
      },
      { status: 402 }
    );
  }

  const accuracy = isMarketType(type)
    ? `ACCURACY (market intel):
- Campus JSON pack = ground truth for THIS school's live tallies (teachers, students, attendance, visits, etc.). Cite those integers exactly.
- For market landscape, competitor names, category feature norms, and typical industry price bands: use your trained knowledge. Label price bands as estimates (e.g. "~$X–$Y / student / year (industry estimate)").
- Do NOT write "Data not found" for every competitor cell. That phrase is ONLY for fields missing from THIS school's pack (e.g. this campus's tuition, payroll, vendor invoice amounts).
- Never invent THIS school's headcount, fees, or attendance beyond the pack.
- Write like a real market analyst — insight-first, not a re-listing of the JSON.`
    : `ACCURACY (usage report):
- Cite EXACT numbers from the JSON pack only.
- Never invent this school's tuition, salaries, headcount, or fees — write Data not found when the pack lacks them.
- Do not invent competitor list prices.`;

  const prompt = `You are an internal market & ops analyst for BrightSteps school admin (Ali’s portfolio campus demo). Admin seat like Slorsh. Produce a fresh narrative every run — not a fixed template.

${brief(type, topic)}

${accuracy}

- Do not mention which AI or tooling generated this report. Do not mention Cursor, vendor models, or API keys.
- Brand as Slorsh / BrightSteps insight only if needed.
- Markdown only. Prefer prose + a few sharp tables over endless "Data not found" rows.

JSON pack (this school's live demo state):
${JSON.stringify({ as_of: asOf, type, topic, pack }, null, 2).slice(0, 14000)}`;

  try {
    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: envVar("CURSOR_REPORT_MODEL") || envVar("CURSOR_BOT_MODEL") || "auto" },
      // Market / Plus: allow web research. Usage reports stay text-only.
      tools: isMarketType(type) || type.endsWith("_plus")
        ? ["webSearch", "webFetch"]
        : [],
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
      credits_charged: bill.credits_charged ?? bill.credits,
      balance_after: bill.balance_after,
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
