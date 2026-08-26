"use client";

import { useEffect, useCallback, useState, useRef, type RefObject } from "react";
import { TripleCharts } from "@/components/site/TerminalChart";
import type { PitchDeck, PitchSlide } from "@/lib/evidence-pitch";

function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace(/^\//, "").split("/")[0] || null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] || null;
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] || null;
      return u.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

const AUTO_MS = 7000;

function ClipFrame({
  url,
  title,
  badge,
  poster,
  cues,
  sourceLabel,
}: {
  url?: string;
  title: string;
  badge?: string;
  poster?: string;
  cues?: boolean;
  sourceLabel?: string;
}) {
  const yt = url ? youtubeId(url) : null;
  const isFile = Boolean(url && !yt && /\.(mp4|webm|ogg)(\?|$)/i.test(url));

  return (
    <div className="pitch-clip">
      {badge ? <span className="pitch-clip-badge">{badge}</span> : null}
      <div className="video-frame relative aspect-video w-full overflow-hidden rounded-xl border border-cyan-400/30">
        {yt ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${yt}?rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : isFile && url ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={url}
            controls
            playsInline
          />
        ) : poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-cyan-200/50">
            {cues ? "Typical local recite-and-post · drop a clip in admin" : null}
          </div>
        )}
      </div>
      {sourceLabel || url ? (
        <p className="pitch-clip-label">
          {sourceLabel ? <span>Source: {sourceLabel}</span> : null}
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="ml-2 text-[var(--ice)] hover:underline"
            >
              Open video →
            </a>
          ) : null}
        </p>
      ) : (
        <p className="pitch-clip-label">{title}</p>
      )}
    </div>
  );
}

function SlideStage({
  slide,
  slideKey,
  direction,
  cues,
  scrollEl,
}: {
  slide: PitchSlide;
  slideKey: number;
  direction: 1 | -1;
  cues?: boolean;
  scrollEl?: HTMLDivElement | null;
}) {
  const charts = [
    ...(slide.chart ? [slide.chart] : []),
    ...(slide.charts ?? []),
  ];
  const showCompare = Boolean(
    slide.compareAiLabel && slide.compareHumanLabel,
  );
  const showSingle = Boolean(slide.videoUrl && !showCompare);
  const accent =
    slide.accent === "warn"
      ? "warn"
      : slide.accent === "win"
        ? "win"
        : "default";

  return (
    <div
      key={slideKey}
      className={`pitch-stage pitch-stage--${direction > 0 ? "fwd" : "back"} pitch-accent--${accent}`}
    >
      <div className="pitch-stage-glow" aria-hidden />
      <div className="pitch-stage-grid" aria-hidden />

      <p className="pitch-kicker">Slide {slideKey + 1}</p>

      <h2 className="pitch-title">{slide.title}</h2>
      <div className="pitch-title-rule" aria-hidden />

      {slide.subtitle ? (
        <p className="pitch-subtitle">{slide.subtitle}</p>
      ) : null}

      {showSingle ? (
        <div className="pitch-video">
          <ClipFrame
            url={slide.videoUrl}
            title={slide.title}
            sourceLabel={slide.videoSourceLabel}
            cues={cues}
          />
        </div>
      ) : null}

      {showCompare ? (
        <div className="pitch-compare">
          {slide.videoUrl ? (
            <ClipFrame
              url={slide.videoUrl}
              title={slide.compareAiLabel ?? "Left"}
              sourceLabel={slide.videoSourceLabel}
              badge={slide.compareAiLabel ?? "Left"}
              cues={cues}
            />
          ) : null}
          <ClipFrame
            url={slide.contrastVideoUrl}
            poster={slide.contrastPoster}
            title={slide.compareHumanLabel ?? "Right"}
            sourceLabel={slide.contrastVideoSourceLabel}
            badge={slide.compareHumanLabel ?? "Right"}
            cues={cues}
          />
        </div>
      ) : null}

      {charts.length ? (
        <div className="pitch-chart-grid">
          {charts.map((chart, i) => (
            <TripleCharts
              key={`${slideKey}-${chart.title}-${i}`}
              chart={chart}
              compact
              slideKey={slideKey}
              scrollEl={scrollEl}
              notes={cues}
            />
          ))}
        </div>
      ) : null}

      <ul className="pitch-bullets">
        {slide.bullets.map((bullet, i) => (
          <li
            key={`${slideKey}-${i}`}
            className="pitch-bullet-row"
            style={{ animationDelay: `${280 + i * 160}ms` }}
          >
            <span className="pitch-bullet-index" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="pitch-bullet-text">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EvidencePitchModal({
  deck,
  open,
  onClose,
  cues = false,
  startAtEnd = false,
  onNextBriefing,
  onPrevBriefing,
}: {
  deck: PitchDeck;
  open: boolean;
  onClose: () => void;
  cues?: boolean;
  startAtEnd?: boolean;
  onNextBriefing?: () => void;
  onPrevBriefing?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);

  const slide = deck.slides[index];
  const isVideoSlide = Boolean(
    slide?.videoUrl || slide?.contrastVideoUrl,
  );

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const goTo = useCallback(
    (nextIndex: number, dir: 1 | -1) => {
      if (nextIndex < 0 || nextIndex >= deck.slides.length) return;
      setDirection(dir);
      setIndex(nextIndex);
      setProgress(0);
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    },
    [deck.slides.length],
  );

  const go = useCallback(
    (delta: number) => {
      const next = indexRef.current + delta;
      if (next < 0 || next >= deck.slides.length) return;
      goTo(next, delta >= 0 ? 1 : -1);
    },
    [goTo, deck.slides.length],
  );

  const goCard = useCallback(
    (dir: 1 | -1) => {
      if (dir > 0) {
        if (onNextBriefing) onNextBriefing();
        else go(1);
        return;
      }
      if (onPrevBriefing) onPrevBriefing();
      else go(-1);
    },
    [go, onNextBriefing, onPrevBriefing],
  );

  useEffect(() => {
    if (!open) return;
    const last = Math.max(0, deck.slides.length - 1);
    setIndex(startAtEnd ? last : 0);
    setDirection(startAtEnd ? -1 : 1);
    setPaused(false);
    setProgress(0);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0 });
      setScrollEl(scrollRef.current);
    });
  }, [open, deck.id, startAtEnd, deck.slides.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goCard(1);
      }
      if (e.key === " " ) {
        e.preventDefault();
        go(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goCard(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, go, goCard]);

  useEffect(() => {
    if (!open || isVideoSlide) {
      setProgress(0);
      return;
    }

    let raf = 0;
    let start = performance.now();
    let leftover = 0;

    const tick = (now: number) => {
      if (pausedRef.current) {
        leftover = now - start;
        raf = requestAnimationFrame(tick);
        return;
      }
      if (leftover) {
        start = now - leftover;
        leftover = 0;
      }
      const p = Math.min(1, (now - start) / AUTO_MS);
      setProgress(p);
      if (p >= 1) {
        const i = indexRef.current;
        if (i < deck.slides.length - 1) {
          goTo(i + 1, 1);
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, isVideoSlide, index, deck.slides.length, goTo, onNextBriefing]);

  if (!open || !slide) return null;

  return (
    <div
      className="pitch-modal-root fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={deck.title}
    >
      <button
        type="button"
        className="pitch-modal-backdrop absolute inset-0"
        aria-label="Close presentation"
        onClick={onClose}
      />

      <div
        className="pitch-modal-panel relative z-10 flex h-[min(92vh,880px)] w-[min(100%-1rem,980px)] flex-col overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="pitch-progress" aria-hidden>
          <div
            className="pitch-progress-bar"
            style={{
              transform: `scaleX(${isVideoSlide ? 0 : progress})`,
            }}
          />
        </div>

        <header className="pitch-modal-header flex items-center justify-between gap-3 px-5 py-3 md:px-8">
          <div className="min-w-0">
            <p className="pitch-modal-eyebrow">
              {cues ? "Live briefing" : "Watch"}
            </p>
            <p
              key={deck.id}
              className="truncate text-sm font-medium text-cyan-50 pitch-title md:text-base"
            >
              {deck.title}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-xs tabular-nums text-cyan-400/80">
              {index + 1} / {deck.slides.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-cyan-400/30 bg-cyan-950/50 px-3 py-1.5 text-xs text-cyan-100 transition hover:bg-cyan-900/60"
            >
              Close
            </button>
          </div>
        </header>

        <div
          ref={scrollRef}
          className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
        >
          <SlideStage
            slide={slide}
            slideKey={index}
            direction={direction}
            cues={cues}
            scrollEl={scrollEl}
          />
        </div>

        <footer className="pitch-modal-footer flex items-center justify-between gap-3 px-5 py-3 md:px-8">
          <button
            type="button"
            onClick={() => goCard(-1)}
            disabled={!onPrevBriefing}
            className="pitch-nav-btn disabled:opacity-25"
          >
            ← Prev card
          </button>
          <div className="flex flex-wrap justify-center gap-2">
            {deck.slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className={`pitch-dot ${i === index ? "pitch-dot--active" : ""}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goCard(1)}
            disabled={!onNextBriefing}
            className="pitch-nav-btn pitch-nav-btn--primary disabled:opacity-25"
          >
            Next card →
          </button>
        </footer>
      </div>
    </div>
  );
}
