"use client";

import { logoutAction } from "@/app/admin/actions";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminChrome({
  children,
  signedIn,
}: {
  children: React.ReactNode;
  signedIn: boolean;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin/preview")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {signedIn ? (
        <header className="border-b border-zinc-800">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-6">
              <Link href="/admin/preview" className="font-medium">
                Visual editor
              </Link>
              <Link
                href="/admin"
                className="text-sm text-zinc-400 hover:text-zinc-100"
              >
                List
              </Link>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-sm text-zinc-400 hover:text-zinc-100"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>
      ) : null}
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
