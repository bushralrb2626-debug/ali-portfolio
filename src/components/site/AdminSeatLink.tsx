"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Public header chip — only when admin cookie is present (like Slorsh showing the signed-in seat). */
export function AdminSeatLink() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("Ali");

  useEffect(() => {
    void fetch("/api/admin/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.authenticated) return;
        setShow(true);
        if (data.profile?.name) setName(data.profile.name);
      })
      .catch(() => {});
  }, []);

  if (!show) return null;

  return (
    <Link
      href="/admin"
      className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-100 hover:border-cyan-300/60"
      title="Portfolio admin"
    >
      {name}
      <span className="rounded-full bg-cyan-400/20 px-1.5 py-0.5 text-[9px] text-cyan-200">Admin</span>
    </Link>
  );
}
