/**
 * Report portfolio usage to Slorsh (admin Agency rates → School Desk bot).
 */

const DEFAULT_SLORSH = "https://ramuza.onrender.com/api/v1";
/** Must match Slorsh `external_usage_service._DEFAULT_PORTFOLIO_BRIDGE_SECRET` when env unset. */
const DEFAULT_BRIDGE_SECRET = "slorsh-pf-bridge-v1-ali-brightsteps-9f3c2a";

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
  bot_id?: string;
  report_id?: string;
  conversation_id?: string;
  error?: string;
};

function apiBase() {
  return (envVar("SLORSH_API_BASE") || DEFAULT_SLORSH).replace(/\/$/, "");
}

export function getSlorshApiBase(): string {
  return apiBase();
}

function usageSecret() {
  return (
    envVar("SLORSH_USAGE_SECRET") ||
    envVar("PORTFOLIO_USAGE_SECRET") ||
    DEFAULT_BRIDGE_SECRET
  );
}

export function slorshBillingConfigured(): boolean {
  return Boolean(envVar("SLORSH_USAGE_SECRET") || envVar("PORTFOLIO_USAGE_SECRET"));
}

export async function pingSlorshUsage(): Promise<{
  ok: boolean;
  bridge_ready?: boolean;
  secret_env_set?: boolean;
  error?: string;
}> {
  try {
    const res = await fetch(`${apiBase()}/external/usage/ping`, {
      method: "GET",
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      bridge_ready?: boolean;
      secret_env_set?: boolean;
    };
    if (!res.ok) {
      return { ok: false, error: `http_${res.status}` };
    }
    return {
      ok: Boolean(data.ok),
      bridge_ready: Boolean(data.bridge_ready),
      secret_env_set: Boolean(data.secret_env_set),
    };
  } catch (err) {
    console.warn("[slorsh-usage] ping failed", err);
    return { ok: false, error: "network" };
  }
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
 * Debit Agency report credits on Slorsh and create a Reports history row.
 * Free SKUs (0 cr) still POST so History gets an entry.
 */
export async function billPortfolioReport(input: {
  type: string;
  title?: string;
  source?: string;
}): Promise<SlorshUsageResult & { credits: number }> {
  const credits = agencyCreditsForReportType(input.type);
  const result = await reportSlorshUsage({
    feature: reportFeatureForReportType(input.type),
    ...(credits > 0 ? { amount: credits } : {}),
    question: `Portfolio report: ${input.type}`,
    answer: (input.title || input.type).slice(0, 500),
    metadata: {
      report_type: input.type,
      title: input.title || input.type,
      source: input.source || "portfolio",
    },
  });
  return { ...result, credits };
}

/**
 * Attach generated markdown to the Slorsh report created at bill time (no extra debit).
 */
export async function attachPortfolioReportToSlorsh(input: {
  reportId?: string;
  type: string;
  title?: string;
  summary?: string;
  markdown?: string;
}): Promise<SlorshUsageResult> {
  const markdown = (input.markdown || "").trim();
  if (!markdown && !input.reportId) {
    return { ok: true };
  }
  return reportSlorshUsage({
    feature: "portfolio_report_attach" as SlorshUsageFeature,
    question: `Attach portfolio report: ${input.type}`,
    answer: (input.summary || input.title || input.type).slice(0, 500),
    metadata: {
      report_id: input.reportId || undefined,
      report_type: input.type,
      title: input.title,
      summary: input.summary,
      markdown: markdown.slice(0, 24000),
      source: "portfolio",
    },
  });
}

