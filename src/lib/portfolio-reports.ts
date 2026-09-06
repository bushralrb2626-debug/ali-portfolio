/**
 * Slorsh-style portfolio reports: aggregate first-party data, then Cursor writes the narrative.
 * Catalog mirrors Slorsh: usage (weekly/monthly/+ ) + 6 market intel types + full pack.
 */

import { Agent, CursorAgentError } from "@cursor/sdk";
import { existsSync, readFileSync } from "node:fs";
import { env } from "node:process";
import path from "node:path";
import { prisma } from "@/lib/prisma";

const CURSOR_KEY_FILE = "/app/.runtime/cursor_api_key";

/** Same family as Slorsh reports.py + market_intel_service.MARKET_TYPES (catalog-visible). */
export type ReportType =
  | "weekly"
  | "monthly"
  | "weekly_plus"
  | "monthly_plus"
  | "market_competitor"
  | "product_performance"
  | "pricing_optimization"
  | "customer_satisfaction"
  | "sales_performance"
  | "executive_dashboard"
  | "full";

export type ReportPack = {
  as_of: string;
  days: number;
  type: ReportType;
  period: string;
  topic?: string;
  metrics: {
    bot_turns: number;
    contact_messages: number;
    bookings: number;
    open_slots: number;
    logged_in_chats: number;
    guest_chats: number;
    sections_visible: number;
  };
  prior_metrics: {
    bot_turns: number;
    contact_messages: number;
    bookings: number;
  };
  rates: {
    /** bookings / max(contact_messages, 1) */
    contact_to_booking_pct: number | null;
    /** logged_in_chats / max(bot_turns, 1) */
    login_chat_share_pct: number | null;
  };
  bot_by_day: Array<{ day: string; count: number }>;
  langs: Array<{ lang: string; count: number }>;
  top_questions: Array<{ question: string; count: number }>;
  recent_messages: Array<{ name: string; preview: string; at: string }>;
  recent_bookings: Array<{ name: string; email: string; at: string; note: string }>;
  section_titles: string[];
  data_gaps: string[];
  accuracy_note: string;
};

type CatalogEntry = {
  type: ReportType;
  label: string;
  blurb: string;
  group: "usage" | "market";
  plus?: boolean;
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

export const USAGE_CATALOG: CatalogEntry[] = [
  {
    type: "weekly",
    label: "Weekly Report",
    blurb: "Last 7 days: campus bot, contact form, bookings.",
    group: "usage",
  },
  {
    type: "monthly",
    label: "Monthly Report",
    blurb: "Last 30 days performance pack with action items.",
    group: "usage",
  },
  {
    type: "weekly_plus",
    label: "Weekly Report+",
    blurb: "Deeper weekly narrative with funnel + positioning.",
    group: "usage",
    plus: true,
  },
  {
    type: "monthly_plus",
    label: "Monthly Report+",
    blurb: "Deeper monthly narrative with ROI-style next steps.",
    group: "usage",
    plus: true,
  },
];

/** Slorsh market intel catalog (6 visible types; competitor_analysis / market_trends aliased into market_competitor). */
export const MARKET_CATALOG: CatalogEntry[] = [
  {
    type: "market_competitor",
    label: "Market + Competitor Report",
    blurb: "Positioning vs similar portfolio / school-demo / agency sites.",
    group: "market",
  },
  {
    type: "product_performance",
    label: "Product Performance Report",
    blurb: "Demos, sections, CTA, and campus desk product health.",
    group: "market",
  },
  {
    type: "pricing_optimization",
    label: "Pricing Optimization Report",
    blurb: "How to frame offers, booking value, and service packaging.",
    group: "market",
  },
  {
    type: "customer_satisfaction",
    label: "Customer Satisfaction Report",
    blurb: "Visitor messages, bot tone gaps, and trust signals.",
    group: "market",
  },
  {
    type: "sales_performance",
    label: "Sales Performance Report",
    blurb: "Contact → login → booking funnel and conversion actions.",
    group: "market",
  },
  {
    type: "executive_dashboard",
    label: "Executive Dashboard",
    blurb: "One-page ops view for the portfolio owner.",
    group: "market",
  },
];

export const REPORT_CATALOG: CatalogEntry[] = [...USAGE_CATALOG, ...MARKET_CATALOG];

export const ALL_REPORT_TYPES: ReportType[] = [
  ...USAGE_CATALOG.map((c) => c.type),
  ...MARKET_CATALOG.map((c) => c.type),
  "full",
];

export function isReportType(value: string): value is ReportType {
  return (ALL_REPORT_TYPES as string[]).includes(value);
}

export function periodKey(type: ReportType, now = new Date()): string {
  if (type === "weekly" || type === "weekly_plus") {
    const onejan = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    const week = Math.ceil(
      ((now.getTime() - onejan.getTime()) / 86400000 + onejan.getUTCDay() + 1) / 7
    );
    return `${now.getUTCFullYear()}-W${week}`;
  }
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function daysForType(type: ReportType): number {
  if (type === "weekly" || type === "weekly_plus") return 7;
  if (type === "monthly" || type === "monthly_plus") return 30;
  if (type === "executive_dashboard" || type === "full") return 30;
  return 30;
}

function countQuestions(rows: Array<{ question: string }>) {
  const map = new Map<string, number>();
  for (const row of rows) {
    const q = row.question.trim().slice(0, 160);
    if (!q) continue;
    map.set(q, (map.get(q) || 0) + 1);
  }
  return [...map.entries()]
    .map(([question, count]) => ({ question, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function pct(num: number, den: number): number | null {
  if (!den) return null;
  return Math.round((num / den) * 1000) / 10;
}

export async function collectReportPack(
  type: ReportType,
  topic?: string
): Promise<ReportPack> {
  const days = daysForType(type);
  const now = Date.now();
  const since = new Date(now - days * 86400000);
  const priorSince = new Date(now - days * 2 * 86400000);
  const gaps: string[] = [];

  let turns: Awaited<ReturnType<typeof prisma.campusBotTurn.findMany>> = [];
  let priorTurns = 0;
  try {
    turns = await prisma.campusBotTurn.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 800,
    });
    priorTurns = await prisma.campusBotTurn.count({
      where: { createdAt: { gte: priorSince, lt: since } },
    });
  } catch {
    gaps.push("campus_bot_turns");
  }

  let messages: Awaited<ReturnType<typeof prisma.contactMessage.findMany>> = [];
  let priorMessages = 0;
  try {
    messages = await prisma.contactMessage.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    priorMessages = await prisma.contactMessage.count({
      where: { createdAt: { gte: priorSince, lt: since } },
    });
  } catch {
    gaps.push("contact_messages");
  }

  let bookings: Array<{
    name: string;
    email: string;
    note: string;
    createdAt: Date;
  }> = [];
  let priorBookings = 0;
  try {
    bookings = await prisma.appointmentBooking.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    priorBookings = await prisma.appointmentBooking.count({
      where: { createdAt: { gte: priorSince, lt: since } },
    });
  } catch {
    gaps.push("bookings");
  }

  let openSlots = 0;
  try {
    openSlots = await prisma.appointmentSlot.count({
      where: { open: true, startsAt: { gte: new Date() } },
    });
  } catch {
    gaps.push("slots");
  }

  let sectionTitles: string[] = [];
  let sectionsVisible = 0;
  try {
    const sections = await prisma.section.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
      take: 40,
      select: { title: true, type: true },
    });
    sectionsVisible = sections.length;
    sectionTitles = sections.map((s) => `${s.type}: ${s.title}`.slice(0, 80));
  } catch {
    gaps.push("sections");
  }

  const loggedIn = turns.filter((t) => t.loggedIn).length;
  const byDay = new Map<string, number>();
  const byLang = new Map<string, number>();
  for (const t of turns) {
    const dk = dayKey(t.createdAt);
    byDay.set(dk, (byDay.get(dk) || 0) + 1);
    const lang = (t.lang || "en").slice(0, 8);
    byLang.set(lang, (byLang.get(lang) || 0) + 1);
  }

  const metrics = {
    bot_turns: turns.length,
    contact_messages: messages.length,
    bookings: bookings.length,
    open_slots: openSlots,
    logged_in_chats: loggedIn,
    guest_chats: Math.max(0, turns.length - loggedIn),
    sections_visible: sectionsVisible,
  };

  return {
    as_of: new Date().toISOString(),
    days,
    type,
    period: periodKey(type),
    topic: topic?.trim().slice(0, 200) || undefined,
    metrics,
    prior_metrics: {
      bot_turns: priorTurns,
      contact_messages: priorMessages,
      bookings: priorBookings,
    },
    rates: {
      contact_to_booking_pct: pct(bookings.length, messages.length),
      login_chat_share_pct: pct(loggedIn, turns.length),
    },
    bot_by_day: [...byDay.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([day, count]) => ({ day, count })),
    langs: [...byLang.entries()]
      .map(([lang, count]) => ({ lang, count }))
      .sort((a, b) => b.count - a.count),
    top_questions: countQuestions(turns),
    recent_messages: messages.slice(0, 8).map((m) => ({
      name: m.name,
      preview: m.message.slice(0, 140),
      at: m.createdAt.toISOString(),
    })),
    recent_bookings: bookings.slice(0, 8).map((b) => ({
      name: b.name,
      email: b.email,
      note: b.note.slice(0, 120),
      at: b.createdAt.toISOString(),
    })),
    section_titles: sectionTitles,
    data_gaps: gaps,
    accuracy_note:
      "All counts are exact database tallies for the window. prior_metrics is the equal-length window immediately before. Never invent competitor or revenue figures.",
  };
}

function structuredFromPack(pack: ReportPack) {
  const m = pack.metrics;
  const alerts: string[] = [];
  if (m.bot_turns === 0) alerts.push("No campus bot turns in this period.");
  if (m.bookings === 0 && m.contact_messages > 3) {
    alerts.push("Contact volume without bookings — funnel may need a clearer CTA.");
  }
  if (m.open_slots === 0) alerts.push("No open appointment slots ahead.");

  const recommendations: string[] = [];
  if (pack.top_questions[0]) {
    recommendations.push(
      `Add a FAQ chip for: “${pack.top_questions[0].question.slice(0, 80)}”`
    );
  }
  if (m.guest_chats > m.logged_in_chats) {
    recommendations.push("Prompt guests to Login before Book a visit more often.");
  }
  if (!recommendations.length) {
    recommendations.push("Keep logging campus desk chats so trends stay reliable.");
  }

  return {
    summary: `In the last ${pack.days} days: ${m.bot_turns} bot turns (prior window ${pack.prior_metrics.bot_turns}), ${m.contact_messages} contact messages (prior ${pack.prior_metrics.contact_messages}), ${m.bookings} bookings (prior ${pack.prior_metrics.bookings}). Contact→booking ${pack.rates.contact_to_booking_pct == null ? "Data not found" : pack.rates.contact_to_booking_pct + "%"}.`,
    top_questions: pack.top_questions,
    metrics: m,
    prior_metrics: pack.prior_metrics,
    rates: pack.rates,
    recommendations,
    next_steps: [
      "Review top questions and update campus bot chips.",
      "Ensure enough open slots for the next two weeks.",
      "Reply to unanswered contact messages.",
    ],
    alerts,
    data_gaps: pack.data_gaps,
  };
}

function promptBrief(type: ReportType, pack: ReportPack): string {
  const topicLine = pack.topic ? `Niche / topic focus: ${pack.topic}` : "Niche / topic: portfolio + BrightSteps campus demo.";
  const plus =
    type === "weekly_plus" || type === "monthly_plus"
      ? "This is a PLUS report: go deeper on risks, funnel leaks, and 6/12/24 month projections (use Data not found when unknown)."
      : "";

  const briefs: Record<Exclude<ReportType, "full">, string> = {
    weekly: `Write a WEEKLY usage report. Sections: Summary, Metrics, Top Questions, Trends & funnel, Action Items, Recommendations, Alerts.`,
    monthly: `Write a MONTHLY usage report. Sections: Summary, Metrics, Top Questions, Trends vs prior period, Action Items, ROI note, Recommendations, Next Steps.`,
    weekly_plus: `Write a WEEKLY Report+ (deeper). ${plus} Sections: TL;DR, Metrics deep-dive, Funnel, Competitive posture, Action Items with [URGENT], Risks, Next Steps.`,
    monthly_plus: `Write a MONTHLY Report+ (deeper). ${plus} Sections: TL;DR, Metrics deep-dive, Funnel, Positioning, Action Items with [URGENT], Risks, ROI 6/12/24, Next Steps.`,
    market_competitor: `Write a Market + Competitor analyst report (not a metrics dump). Sections: TL;DR, Market landscape, Named competitor angles, Differentiation vs pack signals, Industry price ESTIMATES (labeled), Action Items. Do not fill every price cell with Data not found — reserve that for THIS site's missing pack fields only.`,
    product_performance: `Write a Product Performance report. Sections: TL;DR, Product health vs category norms, Engagement from pack, Gaps, Action Items, Next Steps.`,
    pricing_optimization: `Write a Pricing Optimization report. Sections: TL;DR, Category pricing norms as ESTIMATES, Offer packaging, Experiments, Action Items.`,
    customer_satisfaction: `Write a Customer Satisfaction report. Sections: TL;DR, Sentiment from pack + typical visitor friction, Trust fixes, Action Items.`,
    sales_performance: `Write a Sales Performance report. Sections: TL;DR, Funnel from pack, Category conversion benchmarks as ESTIMATES, Pipeline actions, Action Items.`,
    executive_dashboard: `Write an Executive Dashboard (one page). Sections: Snapshot (exact pack metrics), Top 5 risks, Top 5 wins/opportunities (market + ops), This week’s priorities, Open questions.`,
  };

  return `${briefs[type as Exclude<ReportType, "full">]}

${topicLine}
As of ${pack.as_of}. Period ${pack.period} (${pack.days} days).`;
}

function fallbackMarkdown(
  pack: ReportPack,
  content: ReturnType<typeof structuredFromPack>
) {
  const lines = [
    `# ${pack.type.replace(/_/g, " ")} report — ${pack.period}`,
    "",
    `**Summary:** ${content.summary}`,
    "",
    "## Metrics",
    `- Bot turns: ${pack.metrics.bot_turns}`,
    `- Contact messages: ${pack.metrics.contact_messages}`,
    `- Bookings: ${pack.metrics.bookings}`,
    `- Open slots: ${pack.metrics.open_slots}`,
    `- Visible sections: ${pack.metrics.sections_visible}`,
    "",
    "## Top questions",
  ];
  if (!pack.top_questions.length) lines.push("- Data not found");
  for (const q of pack.top_questions) {
    lines.push(`- ${q.question} (${q.count})`);
  }
  lines.push("", "## Recommendations");
  for (const r of content.recommendations) lines.push(`- ${r}`);
  if (content.alerts.length) {
    lines.push("", "## Alerts");
    for (const a of content.alerts) lines.push(`- ${a}`);
  }
  lines.push(
    "",
    "## Note",
    "AI narrative temporarily unavailable — structured pack only."
  );
  return lines.join("\n");
}

async function cursorNarrative(
  pack: ReportPack,
  content: ReturnType<typeof structuredFromPack>
) {
  const apiKey = cursorApiKey();
  if (!apiKey) {
    throw new Error("CURSOR_API_KEY not configured");
  }
  const modelId = envVar("CURSOR_BOT_MODEL") || envVar("CURSOR_REPORT_MODEL") || "auto";
  const cwd = path.resolve(process.cwd());

  const prompt = `You are an internal analyst for Ali’s portfolio admin console (same role as Slorsh admin seat). Admin display name: Ali.

${promptBrief(pack.type, pack)}

ACCURACY RULES (mandatory):
- Cite EXACT integers from metrics / prior_metrics / rates / bot_by_day / langs. Do not round away from the JSON.
- When comparing periods, use prior_metrics explicitly (e.g. bot_turns ${pack.metrics.bot_turns} vs prior ${pack.prior_metrics.bot_turns}).
- If a site rate is null, write Data not found — do not invent THIS site's percentages.
- For market / competitor / pricing reports: use trained knowledge for category landscape, named competitors, and industry price bands — label bands as estimates. Do NOT spam "Data not found" on every competitor cell; that phrase is only for THIS site's missing pack fields.
- Never invent THIS site's headcount, bookings, or revenue beyond the JSON.
- ${pack.accuracy_note}
- Do not mention Cursor, vendor model names, API keys, or coding agents.
- Markdown only. Insight-first narrative — not a fixed template.

JSON:
${JSON.stringify(
  {
    metrics: pack.metrics,
    prior_metrics: pack.prior_metrics,
    rates: pack.rates,
    bot_by_day: pack.bot_by_day,
    langs: pack.langs,
    top_questions: pack.top_questions,
    recent_messages: pack.recent_messages,
    recent_bookings: pack.recent_bookings,
    section_titles: pack.section_titles,
    data_gaps: pack.data_gaps,
    topic: pack.topic,
    seed: content,
  },
  null,
  2
).slice(0, 14000)}`;

  const result = await Agent.prompt(prompt, {
    apiKey,
    model: { id: modelId },
    tools: [],
    local: { cwd },
  });

  if (result.status === "error") {
    throw new Error(result.error?.message || "Cursor report run failed");
  }
  let text = String(result.result || "").trim();
  if (text.startsWith("```")) {
    text = text
      .replace(/^```(?:markdown|md)?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
  }
  if (text.length < 80) {
    throw new Error("Cursor returned a short report");
  }
  return text.slice(0, 24000);
}

function catalogLabel(type: ReportType): string {
  if (type === "full") return "Full market pack";
  return REPORT_CATALOG.find((c) => c.type === type)?.label || type;
}

async function generateOne(type: Exclude<ReportType, "full">, topic?: string) {
  const pack = await collectReportPack(type, topic);
  const content = structuredFromPack(pack);
  let markdown: string;
  let via: "cursor" | "fallback" = "cursor";
  try {
    markdown = await cursorNarrative(pack, content);
  } catch (err) {
    via = "fallback";
    console.warn(
      "[portfolio-reports]",
      err instanceof CursorAgentError ? err.message : err
    );
    markdown = fallbackMarkdown(pack, content);
  }

  const title = `${catalogLabel(type)} — ${pack.period}`;
  const summary =
    content.summary ||
    markdown.split("\n").find((l) => l.trim())?.replace(/^#+\s*/, "").slice(0, 400) ||
    "";

  const saved = await prisma.portfolioReport.create({
    data: {
      type,
      period: pack.period,
      title,
      summary,
      markdown,
      content: JSON.stringify({
        ...content,
        markdown,
        pack_metrics: pack.metrics,
        via,
        as_of: pack.as_of,
        topic: pack.topic || "",
      }),
    },
  });

  return {
    report_id: saved.id,
    type: saved.type,
    period: saved.period,
    title: saved.title,
    summary: saved.summary,
    markdown: saved.markdown,
    content: JSON.parse(saved.content),
    via,
    createdAt: saved.createdAt.toISOString(),
  };
}

export async function generatePortfolioReport(type: ReportType, topic?: string) {
  if (type === "full") {
    const items = [];
    for (const entry of MARKET_CATALOG) {
      items.push(await generateOne(entry.type as Exclude<ReportType, "full">, topic));
    }
    return {
      type: "full" as const,
      count: items.length,
      items,
      title: "Full market pack",
      summary: `${items.length} market intel reports generated`,
      markdown: items
        .map((r) => `## ${r.title}\n\n${r.markdown}`)
        .join("\n\n---\n\n")
        .slice(0, 24000),
      content: { summary: `${items.length} reports generated` },
      via: items.every((i) => i.via === "cursor")
        ? ("cursor" as const)
        : ("fallback" as const),
      createdAt: new Date().toISOString(),
    };
  }
  return generateOne(type, topic);
}

export async function logCampusBotTurn(input: {
  question: string;
  answer: string;
  lang?: string;
  loggedIn?: boolean;
  sessionId?: string;
  runId?: string;
}) {
  try {
    await prisma.campusBotTurn.create({
      data: {
        question: String(input.question || "").slice(0, 2000),
        answer: String(input.answer || "").slice(0, 4000),
        lang: String(input.lang || "en").slice(0, 8),
        loggedIn: Boolean(input.loggedIn),
        sessionId: String(input.sessionId || "").slice(0, 120),
        runId: String(input.runId || "").slice(0, 120),
      },
    });
  } catch (err) {
    console.warn("[portfolio-reports] log turn failed", err);
  }
}
