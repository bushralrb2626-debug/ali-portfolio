import { NextRequest, NextResponse } from "next/server";
import { attachAdminCookie } from "@/lib/admin-session";

function publicOrigin(request: NextRequest) {
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "localhost:3000";
  const proto =
    request.headers.get("x-forwarded-proto") ??
    (request.nextUrl.protocol === "https:" ? "https" : "http");
  return `${proto}://${host}`;
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  const origin = publicOrigin(request);

  if (!email || !password || email !== adminEmail || password !== adminPassword) {
    return NextResponse.redirect(`${origin}/admin/login?error=1`, { status: 303 });
  }

  const response = NextResponse.redirect(`${origin}/admin/preview`, {
    status: 303,
  });
  return attachAdminCookie(response, request);
}
