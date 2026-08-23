"use client";

import type { ReactNode } from "react";
import { PitchPlaylistProvider } from "@/components/site/PitchPlaylist";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";

export function SiteShell({
  brand,
  children,
}: {
  brand: string;
  children: ReactNode;
}) {
  return (
    <PitchPlaylistProvider>
      <div className="site-bg min-h-screen">
        <SiteHeader brand={brand} />
        <main className="mx-auto max-w-6xl px-6">{children}</main>
        <SiteFooter brand={brand} />
      </div>
    </PitchPlaylistProvider>
  );
}
