"use client";

import { useEffect, useRef, useState } from "react";

/** Loads the image only when near the viewport — keeps Proof/Work thumbs fast. */
export function LazyThumb({
  src,
  className,
  alt = "",
  priority = false,
}: {
  src: string;
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(priority);

  useEffect(() => {
    if (priority || show) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [priority, show]);

  return (
    <div ref={ref} className={className ?? "h-full w-full"}>
      {show ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
        />
      ) : (
        <div className="h-full w-full bg-cyan-950/50" aria-hidden />
      )}
    </div>
  );
}
