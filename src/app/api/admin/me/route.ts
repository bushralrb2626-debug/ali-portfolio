import { NextRequest, NextResponse } from "next/server";
import { requestHasAdminCookie } from "@/lib/admin-session";
import { adminDisplayName, adminEmail, PORTFOLIO_ADMIN } from "@/lib/portfolio-admin";
import { collectReportPack } from "@/lib/portfolio-reports";
import { existsSync, readFileSync } from "node:fs";
import { env } from "node:process";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CURSOR_KEY_FILE = "/app/.runtime/cursor_api_key";

function envVar(name: string): string {
  return String(Reflect.get(env, name) ?? "").trim();
}

function cursorConfigured() {
  if (envVar("CURSOR_API_KEY")) return true;
  try {
    return existsSync(CURSOR_KEY_FILE) && Boolean(readFileSync(CURSOR_KEY_FILE, "utf8").trim());
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!requestHasAdminCookie(request)) {
    return NextResponse.json({ ok: false, authenticated: false }, { status: 401 });
  }

  const pack = await collectReportPack("weekly");
  let reportCount = 0;
  try {
    reportCount = await prisma.portfolioReport.count();
  } catch {
    reportCount = 0;
  }

  return NextResponse.json({
    ok: true,
    authenticated: true,
    profile: {
      id: PORTFOLIO_ADMIN.id,
      name: adminDisplayName(),
      email: adminEmail() || undefined,
      role: PORTFOLIO_ADMIN.role,
      planLabel: PORTFOLIO_ADMIN.planLabel,
      roleLabel: PORTFOLIO_ADMIN.roleLabel,
      chip: PORTFOLIO_ADMIN.planLabel,
    },
    cursor: {
      configured: cursorConfigured(),
      model: envVar("CURSOR_REPORT_MODEL") || envVar("CURSOR_BOT_MODEL") || "auto",
    },
    snapshot: pack.metrics,
    snapshot_period: pack.period,
    report_count: reportCount,
    data_gaps: pack.data_gaps,
  });
}
