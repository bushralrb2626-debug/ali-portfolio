/**
 * BrightSteps school-admin reports — Slorsh catalog types, Cursor narrative.
 * Accepts a first-party pack from the demo dashboard (localStorage tallies).
 */

import { Agent, CursorAgentError } from "@cursor/sdk";
import { existsSync, readFileSync } from "node:fs";
import { env } from "node:process";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { attachPortfolioReportToSlorsh, billPortfolioReport } from "@/lib/slorsh-usage";

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
    : "Context: BrightSteps / Scuola Materna — private Italian school campus (Italy). Frame all analysis for Italy: MIUR cycles, iscrizioni, rette in EUR, Italian school calendar, and Italian EdTech / registro elettronico market.";
  const map: Record<ReportType, string> = {
    weekly:
      "WEEKLY school usage (Italy): Summary, Staff/students/presenze metrics, Colloqui & visite, Action Items, Alerts. Use Italian school terms where natural (presenze, iscrizioni, rette, colloqui).",
    monthly:
      "MONTHLY school ops (Italy): Summary, Enrollment & attendance trends, Fees/rette snapshot (EUR only — Data not found if pack lacks amounts), Results on file, Recommendations, Next Steps. Align to Italian school year rhythm when relevant.",
    weekly_plus:
      "WEEKLY+ deeper (Italy): TL;DR, Funnel (visite→interesse iscrizione), Risks [URGENT], Priorities, Next Steps. No invented rette for THIS school.",
    monthly_plus:
      "MONTHLY+ deeper (Italy): TL;DR, Ops health, Positioning vs typical Italian school portals / registro elettronico, Action Items. ROI for THIS school = Data not found if unknown.",
    market_competitor: `Market + Competitor intel for ITALY (analyst depth, NOT a pack dump).
Sections: TL;DR · Italian EdTech / school SIS / parent-portal / registro elettronico landscape · Named competitor angles relevant to Italy (e.g. Axios, Argo ScuolaNext, ClasseViva / Spaggiari, Nuvola, Mastercom, Google Workspace for Education IT, ClassDojo where used — pick ones that fit the niche; avoid US-only SIS like PowerSchool unless comparing for contrast) · How BrightSteps / Scuola Materna campus desk differentiates in Italy · Pricing & packaging ranges as industry ESTIMATES in EUR (label clearly) · Actions for this Italian school admin.
Do NOT fill every price cell with "Data not found". Use your knowledge for Italian market norms; reserve "Data not found" only for THIS school's missing pack fields (rette, vendor fees not in JSON).`,
    product_performance: `Product Performance of the campus portal for an Italian private school — analyst write-up.
Sections: TL;DR · Feature health vs Italian category norms (presenze windows, parent visits/colloqui, desk bot, pagelle/results) · Engagement signals from pack · Gaps vs Italian competitors · CTA / UX fixes · Actions.
Compare against typical Italian school-portal / registro feature sets; do not refuse analysis just because pack is small.`,
    pricing_optimization: `Pricing / rette packaging strategy for an Italian private-school portal SaaS + school demo.
Sections: TL;DR · How Italian category vendors usually price (per-student / campus / seat — ESTIMATES in EUR) · Experiments this admin can run · What NOT to invent from pack · Actions.
Industry price bands are allowed when labeled as estimates and quoted in euro.`,
    customer_satisfaction: `Parent/visitor satisfaction intel for an Italian school.
Sections: TL;DR · Themes from pack (visite, feedback, attendance friction) · Typical Italian parent pain points (comunicazione scuola-famiglia, iscrizioni, rette clarity, registro) · Trust fixes · Actions.
Blend pack signals with Italian category expertise. Prefer Italian parent language when useful.`,
    sales_performance: `Admissions / visit funnel performance (Italy: visite guidate → iscrizione interest).
Sections: TL;DR · Pack funnel (visits → meetings → interest) · Italian private-school conversion benchmarks as ESTIMATES · Leak fixes · Actions.`,
    executive_dashboard: `Executive one-pager for Italian school admin (dirigente / segreteria).
Sections: Snapshot (exact pack metrics) · Top risks · Top opportunities (Italian market + ops) · This week priorities · Open questions.
Opportunities may include Italian market moves — not only empty pack fields.`,
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
  const title = `${LABELS[type]} — Italian school admin`;

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
    ? `ACCURACY (market intel — Italy):
- Campus JSON pack = ground truth for THIS school's live tallies (teachers, students, attendance, visits, etc.). Cite those integers exactly.
- For Italian market landscape, competitor names, category feature norms, and typical industry price bands: use your trained knowledge. Quote money in EUR (e.g. "~€X–€Y / studente / anno (stima di mercato)"). Do not default to USD or US SIS vendors unless explicitly contrasting with Italy.
- Do NOT write "Data not found" for every competitor cell. That phrase is ONLY for fields missing from THIS school's pack (e.g. this campus's rette, payroll, vendor invoice amounts).
- Never invent THIS school's headcount, fees, or attendance beyond the pack.
- Write like a real Italian-market school/EdTech analyst — insight-first, not a re-listing of the JSON.`
    : `ACCURACY (usage report — Italy):
- Cite EXACT numbers from the JSON pack only.
- Never invent this school's rette, salaries, headcount, or fees — write Data not found when the pack lacks them.
- Frame narrative for an Italian private school (Scuola Materna / BrightSteps). Do not invent competitor list prices.`;

  const prompt = `You are an internal market & ops analyst for BrightSteps / Scuola Materna school admin in ITALY (Ali’s portfolio campus demo). Think like a Italian private-school direttore / segreteria using a Slorsh-style admin seat. Produce a fresh narrative every run — not a fixed template.

Geography & market rules (mandatory):
- Primary market = Italy. Prefer Italian competitors, regulations/context (MIUR, iscrizioni, registro elettronico, scuola-famiglia), and EUR.
- Do not write as if this is a Pakistan, GCC, or US K-12 campus unless the optional topic explicitly asks for a comparison.
- Optional Italian phrasing in headings/labels is welcome when it helps the admin; body may be English if clearer, but content must be Italy-relevant.

${brief(type, topic)}

${accuracy}

- Do not mention which AI or tooling generated this report. Do not mention Cursor, vendor models, or API keys.
- Brand as Slorsh / BrightSteps insight only if needed.
- Markdown only. Prefer prose + a few sharp tables over endless "Data not found" rows.

JSON pack (this Italian school's live demo state):
${JSON.stringify({ as_of: asOf, type, topic, market: "Italy", pack }, null, 2).slice(0, 14000)}`;

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
    const markdown = text.slice(0, 24000);
    void attachPortfolioReportToSlorsh({
      reportId: bill.report_id,
      type,
      title,
      summary,
      markdown,
    });
    return NextResponse.json({
      ok: true,
      type,
      title,
      via: "ai",
      markdown,
      summary,
      runId: result.id,
      credits_charged: bill.credits_charged ?? bill.credits,
      balance_after: bill.balance_after,
      slorsh_report_id: bill.report_id,
    });
  } catch (err) {
    const detail =
      err instanceof CursorAgentError
        ? err.message
        : err instanceof Error
          ? err.message
          : "unknown";
    void attachPortfolioReportToSlorsh({
      reportId: bill.report_id,
      type,
      title,
      summary: "Structured pack — AI temporarily unavailable.",
      markdown: fallback,
    });
    return NextResponse.json({
      ok: true,
      type,
      title,
      via: "fallback",
      markdown: fallback,
      summary: "Structured pack — AI temporarily unavailable.",
      detail,
      slorsh_report_id: bill.report_id,
    });
  }
}
