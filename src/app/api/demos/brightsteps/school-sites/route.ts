import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Block = { id?: string; type?: string; title?: string; body?: string };

function parseBlocks(raw: string): Block[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Block[]) : [];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const schoolId = String(request.nextUrl.searchParams.get("schoolId") || "").trim();
  const slug = String(request.nextUrl.searchParams.get("slug") || "").trim();
  if (!schoolId && !slug) {
    return NextResponse.json({ ok: false, error: "schoolId_or_slug_required" }, { status: 400 });
  }
  try {
    const row = schoolId
      ? await prisma.brightStepsSchoolSite.findUnique({ where: { schoolId } })
      : await prisma.brightStepsSchoolSite.findFirst({ where: { slug } });
    if (!row) {
      return NextResponse.json({ ok: true, found: false, blocks: [], schoolId: schoolId || "", slug: slug || "" });
    }
    return NextResponse.json({
      ok: true,
      found: true,
      schoolId: row.schoolId,
      slug: row.slug,
      blocks: parseBlocks(row.blocksJson),
      updatedBy: row.updatedBy,
      updatedAt: row.updatedAt.toISOString(),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ ok: false, error: detail }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  let body: {
    schoolId?: string;
    slug?: string;
    blocks?: Block[];
    updatedBy?: string;
    token?: string;
  } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const schoolId = String(body.schoolId || "").trim().slice(0, 80);
  const slug = String(body.slug || "").trim().slice(0, 80);
  if (!schoolId) {
    return NextResponse.json({ ok: false, error: "schoolId_required" }, { status: 400 });
  }
  // Lightweight demo gate: client must send role token from superadmin session
  const token = String(body.token || "").trim();
  if (token !== "superadmin") {
    return NextResponse.json({ ok: false, error: "superadmin_only" }, { status: 403 });
  }

  const blocks = Array.isArray(body.blocks) ? body.blocks.slice(0, 40) : [];
  const sanitized = blocks.map((b, i) => ({
    id: String(b?.id || `b-${i}`).slice(0, 40),
    type: String(b?.type || "about").slice(0, 40),
    title: String(b?.title || "").slice(0, 200),
    body: String(b?.body || "").slice(0, 4000),
  }));
  const updatedBy = String(body.updatedBy || "Super Admin").trim().slice(0, 120);

  try {
    const row = await prisma.brightStepsSchoolSite.upsert({
      where: { schoolId },
      create: {
        schoolId,
        slug: slug || schoolId,
        blocksJson: JSON.stringify(sanitized),
        updatedBy,
      },
      update: {
        slug: slug || schoolId,
        blocksJson: JSON.stringify(sanitized),
        updatedBy,
      },
    });
    return NextResponse.json({
      ok: true,
      schoolId: row.schoolId,
      slug: row.slug,
      blocks: sanitized,
      updatedBy: row.updatedBy,
      updatedAt: row.updatedAt.toISOString(),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ ok: false, error: detail }, { status: 500 });
  }
}
