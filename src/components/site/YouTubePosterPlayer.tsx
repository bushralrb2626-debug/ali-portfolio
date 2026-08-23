"use client";

import { useState } from "react";

export function YouTubePosterPlayer({
  videoId,
  title,
  posterUrl,
  overlay,
  staticOnly = false,
}: {
  videoId: string;
  title: string;
  posterUrl?: string;
  overlay?: React.ReactNode;
  /** Show poster only — parent handles click (e.g. pitch modal). */
  staticOnly?: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  if (staticOnly) {
    return (
      <div className="video-frame relative aspect-video w-full overflow-hidden">
        {posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-cyan-950/40">
            <span className="text-xs text-cyan-600">{title}</span>
          </div>
        )}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white/90 shadow-lg backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
        {overlay}
      </div>
    );
  }

  if (playing) {
    return (
      <div className="video-frame relative aspect-video w-full overflow-hidden">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="video-frame relative aspect-video w-full overflow-hidden text-left"
      aria-label={`Play ${title}`}
    >
      {posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-cyan-950/40">
          <span className="text-xs text-cyan-600">Play video</span>
        </div>
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/70">
          <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-current" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
      {overlay}
    </button>
  );
}
