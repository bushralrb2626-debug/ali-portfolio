"use client";

import { useEffect, useState } from "react";

export function TypeLine({
  text,
  className,
  as: Tag = "span",
  delayMs = 0,
  msPerChar = 22,
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  delayMs?: number;
  msPerChar?: number;
}) {
  // Always start with the full string so SSR, slow JS, and screenshots
  // never show a blank headline (e.g. "Made by Ali").
  const [shown, setShown] = useState(text);
  const [done, setDone] = useState(true);

  useEffect(() => {
    setShown(text);
    setDone(true);

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !text) return;

    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    let safety: ReturnType<typeof setTimeout> | undefined;

    const start = window.setTimeout(() => {
      setShown("");
      setDone(false);
      interval = setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setDone(true);
        }
      }, msPerChar);

      // Never leave the line blank if the interval is interrupted.
      safety = setTimeout(
        () => {
          if (interval) clearInterval(interval);
          setShown(text);
          setDone(true);
        },
        delayMs + text.length * msPerChar + 800,
      );
    }, delayMs);

    return () => {
      window.clearTimeout(start);
      if (interval) clearInterval(interval);
      if (safety) clearTimeout(safety);
      setShown(text);
      setDone(true);
    };
  }, [text, delayMs, msPerChar]);

  return (
    <Tag className={className}>
      {shown || text}
      {!done ? <span className="nano-caret" aria-hidden /> : null}
    </Tag>
  );
}
