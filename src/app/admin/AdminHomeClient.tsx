"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type MePayload = {
  profile: {
    name: string;
    email?: string;
    role: string;
    planLabel: string;
    roleLabel: string;
  };
  cursor: { configured: boolean; model: string };
  snapshot: {
    bot_turns: number;
    contact_messages: number;
    bookings: number;
    open_slots: number;
    logged_in_chats: number;
    guest_chats: number;
    sections_visible: number;
  };
  snapshot_period: string;
  report_count: number;
  data_gaps: string[];
};

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-100">{value}</p>
    </div>
  );
}

export function AdminHomeClient() {
  const [me, setMe] = useState<MePayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" });
        if (!res.ok) throw new Error("Sign in as admin to view this console.");
        setMe(await res.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
  }, []);

  if (error) {
    return (
      <p className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
        {error}
      </p>
    );
  }

  if (!me) {
    return <p className="text-sm text-zinc-500">Loading admin seat…</p>;
  }

  const s = me.snapshot;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">Welcome back,</p>
          <h1 className="mt-1 text-3xl font-semibold text-zinc-100">
            {me.profile.name.split(" ")[0] || "Ali"}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Portfolio admin seat. Generate usage and market intel reports from live site data.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan-500/40 bg-cyan-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
            {me.profile.planLabel}
          </span>
          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
            {me.profile.roleLabel}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={`Bot turns (${me.snapshot_period})`} value={s.bot_turns} />
        <Stat label="Contact messages" value={s.contact_messages} />
        <Stat label="Bookings" value={s.bookings} />
        <Stat label="Open slots" value={s.open_slots} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="text-sm font-semibold text-zinc-100">Reports</h2>
          <p className="mt-2 text-sm text-zinc-400">
            {me.report_count} saved · weekly/monthly/+ and 6 market intel types.
          </p>
          <Link
            href="/admin/reports"
            className="mt-4 inline-flex rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-zinc-950"
          >
            Open reports
          </Link>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="text-sm font-semibold text-zinc-100">Quick links</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className="text-cyan-300 hover:underline" href="/admin/preview">
                Visual editor
              </Link>
            </li>
            <li>
              <Link className="text-cyan-300 hover:underline" href="/admin/messages">
                Messages
              </Link>
            </li>
            <li>
              <Link className="text-cyan-300 hover:underline" href="/admin/slots">
                Appointment slots
              </Link>
            </li>
            <li>
              <Link className="text-cyan-300 hover:underline" href="/" target="_blank">
                Public site
              </Link>
            </li>
          </ul>
          {me.data_gaps.length ? (
            <p className="mt-4 text-xs text-amber-200/80">
              Data gaps: {me.data_gaps.join(", ")}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
