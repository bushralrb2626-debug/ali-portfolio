import { NextRequest, NextResponse } from "next/server";
import { notifyReportReady } from "@/lib/admin-notify";
import { requestHasAdminCookie } from "@/lib/admin-session";
import {
  generatePortfolioReport,
  isReportType,
  MARKET_CATALOG,
  USAGE_CATALOG,
} from "@/lib/portfolio-reports";
import { prisma } from "@/lib/prisma";
import { billPortfolioReport } from "@/lib/slorsh-usage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!requestHasAdminCookie(request)) return unauthorized();

  const url = new URL(request.url);
  if (url.searchParams.get("catalog") === "1") {
    let schedule = { cadence: "weekly", enabled: true };
    try {
      const pref = await prisma.reportSchedulePref.findUnique({ where: { id: "default" } });
      if (pref) schedule = { cadence: pref.cadence, enabled: pref.enabled };
    } catch {
      /* table may not exist until db push */
    }
    return NextResponse.json({
      usage: USAGE_CATALOG,
      market: MARKET_CATALOG,
      schedule,
    });
  }

  const items = await prisma.portfolioReport.findMany({
    orderBy: { createdAt: "desc" },
    take: 40,
  });

  return NextResponse.json({
    items: items.map((r) => ({
      id: r.id,
      report_id: r.id,
      type: r.type,
      period: r.period,
      title: r.title,
      summary: r.summary,
      markdown: r.markdown,
      content: safeJson(r.content),
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: NextRequest) {
  if (!requestHasAdminCookie(request)) return unauthorized();

  let body: {
    type?: string;
    topic?: string;
    cadence?: string;
    enabled?: boolean;
    action?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.action === "schedule") {
    const cadence = ["weekly", "monthly", "quarterly", "off"].includes(String(body.cadence))
      ? String(body.cadence)
      : "weekly";
    const enabled = body.enabled !== false && cadence !== "off";
    const pref = await prisma.reportSchedulePref.upsert({
      where: { id: "default" },
      create: { id: "default", cadence, enabled },
      update: { cadence, enabled },
    });
    return NextResponse.json({ cadence: pref.cadence, enabled: pref.enabled });
  }

  const type = String(body.type || "").trim();
  if (!isReportType(type)) {
    return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
  }

  try {
    const bill = await billPortfolioReport({
      type,
      title: `${type} report`,
      source: "portfolio_admin_reports",
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

    const report = await generatePortfolioReport(type, body.topic);
    notifyReportReady({
      type,
      title: report.title,
      summary: report.summary,
      via: report.via,
      credits: bill.credits,
    });
    return NextResponse.json({
      ...report,
      credits_charged: bill.credits_charged ?? bill.credits,
      balance_after: bill.balance_after,
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "generate_failed";
    return NextResponse.json({ error: detail }, { status: 502 });
  }
}

function safeJson(raw: string) {
  try {
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}
