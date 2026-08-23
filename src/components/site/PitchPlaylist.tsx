"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getEvidencePitch } from "@/lib/evidence-pitch";
import { EvidencePitchModal } from "@/components/site/EvidencePitchModal";

export type PlaylistEntry = {
  id: string;
  contrastVideoUrl?: string;
  cues?: boolean;
  order?: number;
};

type PlaylistApi = {
  register: (entry: PlaylistEntry) => void;
  open: (id: string, opts?: { atEnd?: boolean }) => void;
  close: () => void;
};

const PlaylistContext = createContext<PlaylistApi | null>(null);

export function usePitchPlaylist() {
  return useContext(PlaylistContext);
}

export function PitchPlaylistProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<PlaylistEntry[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [atEnd, setAtEnd] = useState(false);

  const register = useCallback((entry: PlaylistEntry) => {
    if (!entry.id) return;
    setEntries((prev) => {
      const i = prev.findIndex((item) => item.id === entry.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], ...entry };
        return next.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      }
      return [...prev, entry].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    });
  }, []);

  const api = useMemo<PlaylistApi>(
    () => ({
      register,
      open: (id, opts) => {
        setAtEnd(Boolean(opts?.atEnd));
        setOpenId(id);
      },
      close: () => {
        setOpenId(null);
        setAtEnd(false);
      },
    }),
    [register],
  );

  const index = entries.findIndex((entry) => entry.id === openId);
  const entry = index >= 0 ? entries[index] : undefined;
  const deck = entry
    ? getEvidencePitch(entry.id, entry.contrastVideoUrl, { cues: entry.cues })
    : undefined;
  const prevEntry = index > 0 ? entries[index - 1] : undefined;
  const nextEntry = index >= 0 && index < entries.length - 1 ? entries[index + 1] : undefined;

  return (
    <PlaylistContext.Provider value={api}>
      {children}
      {deck ? (
        <EvidencePitchModal
          deck={deck}
          open
          startAtEnd={atEnd}
          cues={entry?.cues}
          onClose={api.close}
          onNextBriefing={
            nextEntry
              ? () => {
                  setAtEnd(false);
                  setOpenId(nextEntry.id);
                }
              : undefined
          }
          onPrevBriefing={
            prevEntry
              ? () => {
                  setAtEnd(true);
                  setOpenId(prevEntry.id);
                }
              : undefined
          }
        />
      ) : null}
    </PlaylistContext.Provider>
  );
}
