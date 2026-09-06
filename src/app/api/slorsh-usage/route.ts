import { NextRequest, NextResponse } from "next/server";
import { reportSlorshUsage, type SlorshUsageFeature } from "@/lib/slorsh-usage";

type Body = {
  feature?: string;
  question?: string;
  answer?: string;
  session_id?: string;
  duration_sec?: number;
  amount?: number;
  metadata?: Record<string, unknown>;
};

const ALLOWED = new Set([
  "portfolio_stt",
  "portfolio_tts",
  "portfolio_chat",
  "portfolio_booking",
  "portfolio_report_weekly",
  "portfolio_report_monthly",
  "portfolio_report_weekly_plus",
  "portfolio_report_monthly_plus",
  "portfolio_report_visitor_intel",
  "portfolio_report_market_competitor",
  "portfolio_report_product_performance",
  "portfolio_report_pricing_optimization",
  "portfolio_report_customer_satisfaction",
  "portfolio_report_sales_performance",
  "portfolio_report_executive_dashboard",
  "portfolio_report_full",
]);

/** Browser-safe proxy — secret stays on the server. Used for STT after mic. */
export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const feature = String(body.feature || "").trim();
  if (!ALLOWED.has(feature)) {
    return NextResponse.json({ ok: false, error: "bad_feature" }, { status: 400 });
  }

  const meta = { ...(body.metadata || {}) };
  if (body.duration_sec != null) {
    meta.duration_sec = Number(body.duration_sec);
  }

  const result = await reportSlorshUsage({
    feature: feature as SlorshUsageFeature,
    question: String(body.question || "").slice(0, 2000),
    answer: String(body.answer || "").slice(0, 4000),
    session_id: String(body.session_id || "").slice(0, 120),
    amount: body.amount,
    metadata: meta,
  });

  return NextResponse.json({ ok: Boolean(result.ok), ...result });
}
