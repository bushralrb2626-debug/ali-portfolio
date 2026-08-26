"use client";

import { Reveal } from "@/components/site/Reveal";
import { SECURITY_ROWS } from "@/lib/security-pitch";

export function SecurityMatrix() {
  return (
    <div className="mt-12 overflow-hidden rounded-2xl border border-cyan-500/20">
      <div className="grid grid-cols-1 bg-cyan-950/60 text-xs uppercase tracking-[0.12em] text-cyan-400/80 sm:grid-cols-2">
        <div className="px-4 py-3 font-medium">Google Security Principle</div>
        <div className="hidden px-4 py-3 font-medium sm:block">
          My Implementation
        </div>
      </div>
      <div className="divide-y divide-cyan-500/10 text-sm text-cyan-100/70">
        {SECURITY_ROWS.map((row, index) => (
          <Reveal key={row.principle} delayMs={index * 70}>
            <div className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-2 sm:gap-4">
              <div className="font-medium text-cyan-50">{row.principle}</div>
              <div>
                <span className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-cyan-400/70 sm:hidden">
                  My Implementation
                </span>
                {row.implementation}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
