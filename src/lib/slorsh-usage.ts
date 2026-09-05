/**
 * Report portfolio usage to Slorsh after Cursor/TTS finishes.
 * Fire-and-forget so answer latency is unchanged.
 */

const DEFAULT_SLORSH = "https://ramuza.onrender.com/api/v1";

function envVar(name: string): string {
  return String(process.env[name] ?? "").trim();
}

export type SlorshUsagePayload = {
  feature: "portfolio_chat" | "portfolio_tts" | "portfolio_booking";
  question?: string;
  answer?: string;
  session_id?: string;
  amount?: number;
  metadata?: Record<string, unknown>;
};

export async function reportSlorshUsage(payload: SlorshUsagePayload): Promise<void> {
  const secret = envVar("SLORSH_USAGE_SECRET") || envVar("PORTFOLIO_USAGE_SECRET");
  if (!secret) {
    console.warn("[slorsh-usage] SLORSH_USAGE_SECRET not set — skip billing");
    return;
  }
  const base = (envVar("SLORSH_API_BASE") || DEFAULT_SLORSH).replace(/\/$/, "");
  try {
    const res = await fetch(`${base}/external/usage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Usage-Secret": secret,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn("[slorsh-usage] failed", res.status, text.slice(0, 200));
    }
  } catch (err) {
    console.warn("[slorsh-usage] network", err);
  }
}

/** Non-blocking: never await on the answer path. */
export function reportSlorshUsageBackground(payload: SlorshUsagePayload): void {
  void reportSlorshUsage(payload);
}
