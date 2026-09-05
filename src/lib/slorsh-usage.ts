/**
 * Report portfolio usage to Slorsh (admin Agency rates → School Desk bot).
 */

const DEFAULT_SLORSH = "https://ramuza.onrender.com/api/v1";

function envVar(name: string): string {
  return String(process.env[name] ?? "").trim();
}

/** Matches Slorsh Agency REPORT_COSTS / REPORT_PLUS / MARKET_INTEL. */
export const AGENCY_REPORT_CREDITS: Record<string, number> = {
  weekly: 920,
  monthly: 2300,
  weekly_plus: 2600,
  monthly_plus: 5200,
  market_competitor: 6500,
  product_performance: 600,
  pricing_optimization: 2000,
  customer_satisfaction: 0, // included on Agency
  sales_performance: 2000,
  executive_dashboard: 0, // included on Agency
};

export type SlorshUsageFeature =
  | "portfolio_chat"
  | "portfolio_tts"
  | "portfolio_stt"
  | "portfolio_booking"
  | `portfolio_report_${string}`;

export type SlorshUsagePayload = {
  feature: SlorshUsageFeature;
  question?: string;
  answer?: string;
  session_id?: string;
  amount?: number;
  metadata?: Record<string, unknown>;
};

export type SlorshUsageResult = {
  ok?: boolean;
  credits_charged?: number;
  balance_after?: number;
  bot_name?: string;
  error?: string;
};

function apiBase() {
  return (envVar("SLORSH_API_BASE") || DEFAULT_SLORSH).replace(/\/$/, "");
}

function usageSecret() {
  return envVar("SLORSH_USAGE_SECRET") || envVar("PORTFOLIO_USAGE_SECRET");
}

export function reportFeatureForReportType(type: string): SlorshUsageFeature {
  return `portfolio_report_${type}` as SlorshUsageFeature;
}

export function agencyCreditsForReportType(type: string): number {
  if (type === "full") {
    return MARKET_PACK_TOTAL;
  }
  return AGENCY_REPORT_CREDITS[type] ?? 0;
}

/** Sum of the 6 catalog market types (Agency). */
export const MARKET_PACK_TOTAL = [
  "market_competitor",
  "product_performance",
  "pricing_optimization",
  "customer_satisfaction",
  "sales_performance",
  "executive_dashboard",
].reduce((sum, key) => sum + (AGENCY_REPORT_CREDITS[key] || 0), 0);

export async function reportSlorshUsage(
  payload: SlorshUsagePayload
): Promise<SlorshUsageResult> {
  const secret = usageSecret();
  if (!secret) {
    console.warn("[slorsh-usage] SLORSH_USAGE_SECRET not set — skip billing");
    return { ok: false, error: "secret_missing" };
  }
  try {
    const res = await fetch(`${apiBase()}/external/usage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Usage-Secret": secret,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as SlorshUsageResult & {
      detail?: string;
    };
    if (!res.ok) {
      const err =
        (typeof data.detail === "string" && data.detail) ||
        data.error ||
        `http_${res.status}`;
      console.warn("[slorsh-usage] failed", res.status, err);
      return { ok: false, error: err };
    }
    return { ok: true, ...data };
  } catch (err) {
    console.warn("[slorsh-usage] network", err);
    return { ok: false, error: "network" };
  }
}

export function reportSlorshUsageBackground(payload: SlorshUsagePayload): void {
  void reportSlorshUsage(payload);
}

/**
 * Debit Agency report credits on Slorsh before/after generate.
 * Free SKUs (0 cr) skip the HTTP call and return ok.
 */
export async function billPortfolioReport(input: {
  type: string;
  title?: string;
  source?: string;
}): Promise<SlorshUsageResult & { credits: number }> {
  const credits = agencyCreditsForReportType(input.type);
  if (credits <= 0) {
    return { ok: true, credits: 0, credits_charged: 0 };
  }
  const result = await reportSlorshUsage({
    feature: reportFeatureForReportType(input.type),
    amount: credits,
    question: `Portfolio report: ${input.type}`,
    answer: (input.title || input.type).slice(0, 500),
    metadata: {
      report_type: input.type,
      source: input.source || "portfolio",
    },
  });
  return { ...result, credits };
}

