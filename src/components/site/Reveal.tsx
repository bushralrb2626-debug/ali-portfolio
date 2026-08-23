"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  className,
  delayMs = 0,
  rootEl,
  replay = false,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  rootEl?: Element | null;
  replay?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setOn(true);
        else if (replay) setOn(false);
      },
      {
        root: rootEl ?? null,
        threshold: 0.18,
        rootMargin: "0px 0px -12% 0px",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootEl, replay]);

  return (
    <div
      ref={ref}
      className={`nano-reveal ${on ? "nano-reveal--on" : ""} ${className ?? ""}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
