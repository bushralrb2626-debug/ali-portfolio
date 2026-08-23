"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { SectionItem } from "@/lib/section-items";
import { getEvidencePitch } from "@/lib/evidence-pitch";
import { EvidencePitchModal } from "@/components/site/EvidencePitchModal";
import { usePitchPlaylist } from "@/components/site/PitchPlaylist";

export function EvidencePitchTrigger({
  item,
  contrastVideoUrl,
  cues = false,
  order = 0,
  children,
}: {
  item: SectionItem;
  contrastVideoUrl?: string;
  cues?: boolean;
  order?: number;
  children: ReactNode;
}) {
  const playlist = usePitchPlaylist();
  const [open, setOpen] = useState(false);
  const id = item.id ?? item.title;

  useEffect(() => {
    playlist?.register({ id, contrastVideoUrl, cues, order });
  }, [playlist, id, contrastVideoUrl, cues, order]);

  const openThis = () => {
    if (playlist) playlist.open(id);
    else setOpen(true);
  };

  const deck = playlist ? null : getEvidencePitch(id, contrastVideoUrl, { cues });

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={openThis}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openThis();
          }
        }}
        className="cursor-pointer rounded-2xl outline-none transition hover:brightness-[1.03] focus-visible:ring-2 focus-visible:ring-cyan-400/40"
        aria-label={`Open presentation: ${item.title}`}
      >
        {children}
      </div>
      {deck ? (
        <EvidencePitchModal
          deck={deck}
          open={open}
          onClose={() => setOpen(false)}
          cues={cues}
        />
      ) : null}
    </>
  );
}
