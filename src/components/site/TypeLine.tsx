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
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !text) {
      setShown(text);
      setDone(true);
      return;
    }
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
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
    }, delayMs);
    return () => {
      window.clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, delayMs, msPerChar]);

  return (
    <Tag className={className}>
      {shown}
      {!done ? <span className="nano-caret" aria-hidden /> : null}
    </Tag>
  );
}
