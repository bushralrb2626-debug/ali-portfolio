"use client";

import { logoutAction } from "@/app/admin/actions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type ProfileChip = {
  name: string;
  planLabel: string;
  roleLabel: string;
};

const NAV = [
  { href: "/admin", label: "Home", match: (p: string) => p === "/admin" },
  { href: "/admin/preview", label: "Visual editor", match: (p: string) => p.startsWith("/admin/preview") },
  { href: "/admin/messages", label: "Messages", match: (p: string) => p.startsWith("/admin/messages") },
  { href: "/admin/slots", label: "Slots", match: (p: string) => p.startsWith("/admin/slots") },
  { href: "/admin/reports", label: "Reports", match: (p: string) => p.startsWith("/admin/reports") },
];

export function AdminChrome({
  children,
  signedIn,
}: {
  children: React.ReactNode;
  signedIn: boolean;
}) {
  const pathname = usePathname() || "";
  const [profile, setProfile] = useState<ProfileChip | null>(null);

  useEffect(() => {
    if (!signedIn) return;
    if (pathname === "/admin/login") return;
    void fetch("/api/admin/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.profile) return;
        setProfile({
          name: data.profile.name || "Ali",
          planLabel: data.profile.planLabel || "Admin",
          roleLabel: data.profile.roleLabel || "Agency",
        });
      })
      .catch(() => {});
  }, [signedIn, pathname]);

  if (pathname.startsWith("/admin/preview") || pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {signedIn ? (
        <header className="border-b border-zinc-800">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
            <div className="flex flex-wrap items-center gap-5">
              {NAV.map((item) => {
                const active = item.match(pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      active
                        ? "text-sm font-medium text-zinc-100"
                        : "text-sm text-zinc-400 hover:text-zinc-100"
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-zinc-400 sm:inline">
                {profile?.name || "Ali"}
              </span>
              <span className="rounded-full border border-cyan-500/40 bg-cyan-950/50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-cyan-200">
                {profile?.planLabel || "Admin"}
              </span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-sm text-zinc-400 hover:text-zinc-100"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>
      ) : null}
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
