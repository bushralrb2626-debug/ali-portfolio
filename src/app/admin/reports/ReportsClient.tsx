"use client";

import { useCallback, useEffect, useState } from "react";

type CatalogItem = { type: string; label: string; blurb: string; plus?: boolean };
type ReportItem = {
  id?: string;
  report_id?: string;
  type: string;
  period?: string;
  title?: string;
  summary?: string;
  markdown?: string;
  content?: {
    summary?: string;
    top_questions?: Array<{ question?: string; count?: number }>;
    recommendations?: string[];
    next_steps?: string[];
    alerts?: string[];
    metrics?: Record<string, number>;
    via?: string;
  };
  via?: string;
  count?: number;
  items?: ReportItem[];
  createdAt?: string;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      <div className="text-sm text-zinc-300">{children}</div>
    </div>
  );
}

function TypeButton({
  item,
  busy,
  onGenerate,
}: {
  item: CatalogItem;
  busy: boolean;
  onGenerate: (type: string) => void;
}) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => onGenerate(item.type)}
      className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-left hover:border-zinc-600 disabled:opacity-50"
    >
      <span className="font-medium text-zinc-100">
        {item.label}
        {item.plus ? <span className="ml-2 text-xs text-cyan-300">Plus</span> : null}
      </span>
      <span className="mt-2 flex-1 text-xs text-zinc-400">{item.blurb}</span>
      <span className="mt-4 text-sm font-semibold text-cyan-300">
        {busy ? "Generating…" : "Generate"}
      </span>
    </button>
  );
}

export function ReportsClient() {
  const [usage, setUsage] = useState<CatalogItem[]>([]);
  const [market, setMarket] = useState<CatalogItem[]>([]);
  const [items, setItems] = useState<ReportItem[]>([]);
  const [latest, setLatest] = useState<ReportItem | null>(null);
  const [topic, setTopic] = useState("");
  const [schedule, setSchedule] = useState({ cadence: "weekly", enabled: true });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [listRes, catRes] = await Promise.all([
        fetch("/api/admin/reports", { cache: "no-store" }),
        fetch("/api/admin/reports?catalog=1", { cache: "no-store" }),
      ]);
      if (!listRes.ok || !catRes.ok) {
        throw new Error("Could not load reports (sign in as admin).");
      }
      const list = await listRes.json();
      const cat = await catRes.json();
      setItems(list.items || []);
      setUsage(cat.usage || []);
      setMarket(cat.market || []);
      if (cat.schedule) setSchedule(cat.schedule);
      if ((list.items || [])[0] && !latest) setLatest(list.items[0]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    }
  }, [latest]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, []);

  const generate = async (type: string) => {
    setBusy(true);
    setError("");
    setToast("");
    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, topic: topic.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generate failed");
      setLatest(data);
      setToast(
        type === "full"
          ? `Full pack ready (${data.count || data.items?.length || 0} reports).`
          : "Report ready."
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generate failed");
    } finally {
      setBusy(false);
    }
  };

  const saveSchedule = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "schedule",
          cadence: schedule.cadence,
          enabled: schedule.enabled,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Schedule failed");
      setSchedule({ cadence: data.cadence, enabled: data.enabled });
      setToast("Schedule saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Schedule failed");
    } finally {
      setBusy(false);
    }
  };

  const c = latest?.content || {};
  const topQ = c.top_questions || [];
  const recs = c.recommendations || [];
  const next = c.next_steps || [];
  const alerts = c.alerts || [];
  const metrics = c.metrics;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Reports</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Signed in as Ali (Admin). Reports use exact site tallies (current vs prior window, rates,
          daily series) and never invent numbers.
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}
      {toast ? (
        <p className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 px-4 py-3 text-sm text-cyan-100">
          {toast}
        </p>
      ) : null}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
        <label className="block text-xs font-medium text-zinc-400">
          Niche / topic (optional — used for market intel)
          <input
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. school demo sites, creative director portfolio"
            maxLength={200}
          />
        </label>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-zinc-100">Usage reports</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {usage.map((item) => (
            <TypeButton key={item.type} item={item} busy={busy} onGenerate={generate} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-zinc-100">Market intel (6 types)</h2>
          <button
            type="button"
            disabled={busy}
            onClick={() => void generate("full")}
            className="rounded-full border border-cyan-500/40 px-4 py-1.5 text-xs font-semibold text-cyan-200 hover:border-cyan-300 disabled:opacity-50"
          >
            {busy ? "Working…" : "Generate full pack"}
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {market.map((item) => (
            <TypeButton key={item.type} item={item} busy={busy} onGenerate={generate} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <h2 className="text-sm font-semibold text-zinc-100">Schedule preference</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Same idea as Slorsh auto-schedule (manual generate for now).
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-sm text-zinc-300">
            Cadence
            <select
              className="mt-1 block rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
              value={schedule.cadence}
              onChange={(e) =>
                setSchedule((s) => ({
                  ...s,
                  cadence: e.target.value,
                  enabled: e.target.value !== "off",
                }))
              }
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="off">Off</option>
            </select>
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={() => void saveSchedule()}
            className="rounded-full border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-400"
          >
            Save schedule
          </button>
        </div>
      </div>

      {latest ? (
        <div className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold text-zinc-100">
              {latest.title || latest.type}
              {latest.period ? ` — ${latest.period}` : ""}
            </h2>
          </div>

          <Section title="Summary">
            <p>{c.summary || latest.summary || "—"}</p>
          </Section>

          {metrics ? (
            <Section title="Metrics">
              <ul className="grid gap-1 sm:grid-cols-2">
                {Object.entries(metrics).map(([k, v]) => (
                  <li key={k} className="text-zinc-400">
                    <span className="text-zinc-200">{k.replace(/_/g, " ")}</span>: {v}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {topQ.length > 0 ? (
            <Section title="Top questions">
              <ul className="list-inside list-disc space-y-1">
                {topQ.map((q, i) => (
                  <li key={i}>
                    {q.question} {q.count != null ? `(${q.count})` : ""}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {recs.length > 0 ? (
            <Section title="Recommendations">
              <ul className="list-inside list-disc space-y-1">
                {recs.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          {next.length > 0 ? (
            <Section title="Next steps">
              <ul className="list-inside list-disc space-y-1">
                {next.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          {alerts.length > 0 ? (
            <Section title="Alerts">
              <ul className="list-inside list-disc space-y-1 text-amber-200/90">
                {alerts.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          {latest.markdown ? (
            <details className="rounded-xl bg-zinc-950/60 p-3" open={latest.type === "full"}>
              <summary className="cursor-pointer text-xs text-zinc-500">Full narrative</summary>
              <pre className="mt-2 max-h-[24rem] overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-zinc-300">
                {latest.markdown}
              </pre>
              <a
                className="mt-3 inline-block text-xs text-cyan-300 hover:underline"
                href={`data:text/markdown;charset=utf-8,${encodeURIComponent(latest.markdown)}`}
                download={`${latest.type || "report"}-${latest.period || "latest"}.md`}
              >
                Download markdown
              </a>
            </details>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">Generate a report to see it here.</p>
      )}

      {items.length > 0 ? (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-zinc-100">History</h2>
          <ul className="space-y-2">
            {items.slice(0, 16).map((item) => (
              <li key={item.id || item.report_id}>
                <button
                  type="button"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3 text-left text-sm hover:border-zinc-600"
                  onClick={() => setLatest(item)}
                >
                  <span className="text-zinc-100">{item.title || item.type}</span>
                  <span className="mt-1 block text-xs text-zinc-500">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
