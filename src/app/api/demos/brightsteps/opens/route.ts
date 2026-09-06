import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function utcDay(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function daysAgoUtc(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return utcDay(d);
}

async function countFrom(dayFrom: string): Promise<number> {
  return prisma.brightStepsSiteOpen.count({
    where: { day: { gte: dayFrom } },
  });
}

export async function GET() {
  try {
    const today = utcDay();
    const weekFrom = daysAgoUtc(6);
    const monthFrom = daysAgoUtc(29);
    const [todayCount, weekCount, monthCount] = await Promise.all([
      prisma.brightStepsSiteOpen.count({ where: { day: today } }),
      countFrom(weekFrom),
      countFrom(monthFrom),
    ]);
    return NextResponse.json({
      ok: true,
      today: todayCount,
      week: weekCount,
      month: monthCount,
      as_of: new Date().toISOString(),
      note: "Unique browsers that opened the public BrightSteps site (1 count per visitor per UTC day).",
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "unknown";
    return NextResponse.json(
      { ok: false, today: 0, week: 0, month: 0, error: detail },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let body: { visitorId?: string; path?: string } = {};
  try {
    body = (await request.json()) as { visitorId?: string; path?: string };
  } catch {
    /* empty body ok */
  }

  const visitorId = String(body.visitorId || "")
    .trim()
    .slice(0, 80)
    .replace(/[^a-zA-Z0-9_-]/g, "");
  if (!visitorId || visitorId.length < 8) {
    return NextResponse.json({ ok: false, error: "bad_visitor" }, { status: 400 });
  }

  const path = String(body.path || "/")
    .trim()
    .slice(0, 200);
  const day = utcDay();

  try {
    await prisma.brightStepsSiteOpen.upsert({
      where: {
        day_visitorId: { day, visitorId },
      },
      create: { day, visitorId, path },
      update: { path },
    });
    return NextResponse.json({ ok: true, day });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ ok: false, error: detail }, { status: 500 });
  }
}
