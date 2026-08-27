"use client";

import type { PitchChart } from "@/lib/evidence-pitch";
import { tripleChart } from "@/lib/evidence-pitch";
import { Reveal } from "@/components/site/Reveal";

const PALETTE = ["#38bdf8", "#f97316", "#22c55e", "#e879f9", "#facc15"];

function polar(cx: number, cy: number, r: number, a: number) {
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
}

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
}

export function TripleCharts({
  chart,
  compact,
  slideKey,
  scrollEl,
  notes,
}: {
  chart: PitchChart;
  compact?: boolean;
  slideKey: number;
  scrollEl?: HTMLDivElement | null;
  notes?: boolean;
}) {
  const formats = tripleChart(chart);
  return (
    <div className="pitch-chart-triple pitch-chart-triple">
      {formats.map((entry, i) => (
        <Reveal
          key={`${slideKey}-${entry.type}-${entry.title}`}
          rootEl={scrollEl}
          delayMs={80 + i * 120}
          replay
          className="pitch-chart-reveal"
        >
          <TerminalChart chart={entry} compact={compact} notes={notes} />
        </Reveal>
      ))}
    </div>
  );
}

export function TerminalChart({
  chart,
  compact,
  notes,
}: {
  chart: PitchChart;
  compact?: boolean;
  notes?: boolean;
}) {
  const kind = chart.type ?? "bar";
  const W = 640;
  const H = compact ? 200 : 260;
  const bars = chart.bars ?? [];
  const maxBar = Math.max(...bars.map((b) => b.value), 0.001);

  return (
    <figure className={`pitch-chart pitch-chart--${kind}${compact ? " pitch-chart--compact" : ""}`}>
      <figcaption className="pitch-chart-head">
        <span>{chart.title}</span>
        {notes && chart.kind === "model" ? (
          <span className="pitch-chart-tag">MODEL</span>
        ) : null}
      </figcaption>
      {kind === "pie" ? <PieChart chart={chart} compact={compact} /> : null}
      {kind === "bar" ? (
        <BarChart chart={chart} compact={compact} maxBar={maxBar} W={W} H={H} />
      ) : null}
      {kind === "line" ? <LineChart chart={chart} compact={compact} W={W} H={H} /> : null}
      {chart.caption ? (
        <p className="terminal-chart-cap">{chart.caption}</p>
      ) : null}
    </figure>
  );
}

function BarChart({
  chart,
  compact,
  maxBar,
  W,
  H,
}: {
  chart: PitchChart;
  compact?: boolean;
  maxBar: number;
  W: number;
  H: number;
}) {
  const series = chart.series ?? [];
  const grouped = series.length > 1 && (chart.xLabels?.length ?? 0) > 1;
  const bars = chart.bars ?? [];
  const pad = { l: 48, r: 16, t: compact ? 16 : 24, b: 48 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  if (grouped) {
    const xLabels = chart.xLabels ?? [];
    const n = xLabels.length;
    const groupW = innerW / n;
    const all = series.flatMap((s) => s.values);
    const hi = Math.max(...all, 0.001);
    const bw = Math.min(18, (groupW * 0.7) / series.length);

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="terminal-chart-svg" role="img">
        <rect width={W} height={H} fill="#071018" />
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={pad.l}
            x2={W - pad.r}
            y1={pad.t + innerH * (1 - t)}
            y2={pad.t + innerH * (1 - t)}
            stroke="#1e3a4c"
          />
        ))}
        {xLabels.map((label, gi) => {
          const gx = pad.l + gi * groupW + groupW / 2;
          return (
            <g key={label}>
              {series.map((s, si) => {
                const v = s.values[gi] ?? 0;
                const h = (v / hi) * innerH;
                const x = gx - (series.length * bw) / 2 + si * bw;
                const y = pad.t + innerH - h;
                return (
                  <rect
                    key={s.name}
                    className="chart-bar-grow"
                    x={x}
                    y={y}
                    width={bw - 2}
                    height={h}
                    rx="3"
                    fill={PALETTE[si % PALETTE.length]}
                    style={{
                      ["--i" as string]: gi * series.length + si,
                      transformOrigin: `${x + bw / 2}px ${pad.t + innerH}px`,
                    }}
                  />
                );
              })}
              <text x={gx} y={H - 18} textAnchor="middle" fill="#94a3b8" fontSize="11">
                {label}
              </text>
            </g>
          );
        })}
        {series.map((s, si) => (
          <text
            key={s.name}
            x={pad.l + si * 140}
            y={14}
            fill={PALETTE[si % PALETTE.length]}
            fontSize="11"
          >
            {s.name}
          </text>
        ))}
      </svg>
    );
  }

  const gap = 28;
  const bw = Math.min(72, (innerW - gap * (bars.length - 1)) / Math.max(bars.length, 1));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="terminal-chart-svg" role="img">
      <rect width={W} height={H} fill="#071018" />
      {[0, 0.5, 1].map((t) => (
        <line
          key={t}
          x1={pad.l}
          x2={W - pad.r}
          y1={pad.t + innerH * (1 - t)}
          y2={pad.t + innerH * (1 - t)}
          stroke="#1e3a4c"
        />
      ))}
      {bars.map((bar, i) => {
        const h = (bar.value / maxBar) * innerH;
        const x =
          pad.l +
          i * (bw + gap) +
          (innerW - bars.length * bw - gap * (bars.length - 1)) / 2;
        const y = pad.t + innerH - h;
        return (
          <g key={bar.label}>
            <rect
              className="chart-bar-grow"
              x={x}
              y={y}
              width={bw}
              height={h}
              rx="4"
              fill={PALETTE[i % PALETTE.length]}
              style={{
                ["--i" as string]: i,
                transformOrigin: `${x + bw / 2}px ${pad.t + innerH}px`,
              }}
            />
            <text x={x + bw / 2} y={H - 18} textAnchor="middle" fill="#94a3b8" fontSize="11">
              {bar.label}
            </text>
            <text x={x + bw / 2} y={y - 8} textAnchor="middle" fill="#e2e8f0" fontSize="12">
              {bar.value}
              {bar.suffix ?? ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function PieChart({ chart, compact }: { chart: PitchChart; compact?: boolean }) {
  const bars = chart.bars ?? [];
  const total = bars.reduce((s, b) => s + b.value, 0) || 1;
  const size = compact ? 200 : 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = compact ? 62 : 78;
  let a = -Math.PI / 2;

  return (
    <div className="pitch-pie-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} className="terminal-chart-svg pitch-pie-svg" role="img">
        {bars.map((bar, i) => {
          const slice = (bar.value / total) * Math.PI * 2;
          const a0 = a;
          const a1 = a + slice;
          a = a1;
          return (
            <path
              key={bar.label}
              className="chart-pie-slice"
              d={arcPath(cx, cy, r, a0, a1)}
              fill={PALETTE[i % PALETTE.length]}
              style={{ ["--i" as string]: i }}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={r * 0.46} fill="#071018" />
      </svg>
      <ul className="pitch-pie-legend">
        {bars.map((bar, i) => (
          <li key={bar.label}>
            <i style={{ background: PALETTE[i % PALETTE.length] }} />
            {bar.label} · {bar.value}
            {bar.suffix ?? ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LineChart({
  chart,
  compact,
  W,
  H,
}: {
  chart: PitchChart;
  compact?: boolean;
  W: number;
  H: number;
}) {
  const series = chart.series ?? [];
  const xLabels = chart.xLabels ?? series[0]?.values.map((_, i) => String(i + 1)) ?? [];
  const all = series.flatMap((s) => s.values);
  const lo = Math.min(...all, 0);
  const hi = Math.max(...all, 1);
  const pad = { l: 40, r: 16, t: compact ? 16 : 22, b: 36 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const n = Math.max(...series.map((s) => s.values.length), 1);
  const x = (i: number) => pad.l + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => pad.t + innerH - ((v - lo) / (hi - lo || 1)) * innerH;
  const baseY = pad.t + innerH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="terminal-chart-svg" role="img">
      <rect width={W} height={H} fill="#071018" />
      {[0, 0.5, 1].map((t) => (
        <line
          key={t}
          x1={pad.l}
          x2={W - pad.r}
          y1={pad.t + innerH * (1 - t)}
          y2={pad.t + innerH * (1 - t)}
          stroke="#1e3a4c"
        />
      ))}
      {series.map((s, si) => {
        const d = s.values
          .map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
          .join(" ");
        const area = `${d} L ${x(s.values.length - 1).toFixed(1)} ${baseY} L ${x(0).toFixed(1)} ${baseY} Z`;
        return (
          <g key={s.name} className="chart-series">
            <path
              className="chart-area"
              d={area}
              fill={PALETTE[si % PALETTE.length]}
              opacity="0.18"
            />
            <path
              className="chart-line"
              d={d}
              fill="none"
              stroke={PALETTE[si % PALETTE.length]}
              strokeWidth="2.4"
              style={{ ["--i" as string]: si }}
            />
          </g>
        );
      })}
      {xLabels.map((label, i) => (
        <text key={label} x={x(i)} y={H - 10} textAnchor="middle" fill="#94a3b8" fontSize="10">
          {label}
        </text>
      ))}
      {series.map((s, si) => (
        <text
          key={s.name}
          x={pad.l + si * 140}
          y={14}
          fill={PALETTE[si % PALETTE.length]}
          fontSize="11"
        >
          {s.name}
        </text>
      ))}
    </svg>
  );
}
