import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "ali_admin";
const ADMIN_COOKIE_VALUE = "ok";

export function adminCookieValue() {
  return process.env.AUTH_SECRET || ADMIN_COOKIE_VALUE;
}

export async function hasAdminCookie() {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === adminCookieValue();
}

export function requestHasAdminCookie(request: NextRequest) {
  return request.cookies.get(ADMIN_COOKIE)?.value === adminCookieValue();
}

export function attachAdminCookie(response: NextResponse, request: NextRequest) {
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: adminCookieValue(),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: request.nextUrl.protocol === "https:",
  });
  return response;
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}
