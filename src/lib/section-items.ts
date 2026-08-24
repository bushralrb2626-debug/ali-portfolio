export const SECTION_TYPES = [
  "hero",
  "about",
  "stack",
  "evidence",
  "projects",
  "briefing",
  "skills",
  "contact",
  "booking",
  "custom",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export type SectionItem = {
  id?: string;
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  videoUrl?: string;
  sourceLabel?: string;
  articleUrl?: string;
  whyAdded?: string;
  whyVideo?: string;
  whyArticle?: string;
  pitchLine?: string;
  timeRange?: string;
  hidden?: boolean;
};

export function parseItems(raw: string): SectionItem[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    const items: SectionItem[] = [];
    for (const entry of parsed) {
      if (typeof entry === "string" && entry.trim()) {
        items.push({ title: entry });
        continue;
      }
      if (entry && typeof entry === "object" && "title" in entry) {
        const item = entry as SectionItem;
        const title = String(item.title ?? "").trim();
        if (!title) {
          continue;
        }
        const raw = item as SectionItem & {
          sourceLabel?: string;
          timeRange?: string;
          articleUrl?: string;
          whyAdded?: string;
          whyVideo?: string;
          whyArticle?: string;
          pitchLine?: string;
        };
        items.push({
          title,
          description: raw.description ? String(raw.description) : "",
          url: raw.url ? String(raw.url) : "",
          imageUrl: raw.imageUrl ? String(raw.imageUrl) : "",
          videoUrl: raw.videoUrl ? String(raw.videoUrl) : "",
          sourceLabel: String(raw.sourceLabel || raw.sourceLabel || ""),
          articleUrl: String(raw.articleUrl || raw.articleUrl || ""),
          whyAdded: String(raw.whyAdded || raw.whyAdded || ""),
          whyVideo: String(raw.whyVideo || raw.whyVideo || ""),
          whyArticle: String(raw.whyArticle || raw.whyArticle || ""),
          pitchLine: String(raw.pitchLine || raw.pitchLine || ""),
          timeRange: String(raw.timeRange || raw.timeRange || ""),
          hidden: Boolean(raw.hidden),
          id: "id" in raw && raw.id ? String(raw.id) : undefined,
        });
      }
    }
    return items;
  } catch {
    return [];
  }
}

export function itemsToText(type: string, raw: string): string {
  const items = parseItems(raw);
  if (type === "projects" || type === "evidence") {
    return items
      .map((item) =>
        [
          item.title,
          item.description ?? "",
          item.url ?? "",
          item.sourceLabel ?? "",
        ].join(" | "),
      )
      .join("\n");
  }
  if (type === "contact") {
    return items
      .map((item) => [item.title, item.url ?? ""].join(" | "))
      .join("\n");
  }
  return items.map((item) => item.title).join("\n");
}

export function textToItemsJson(type: string, text: string): string {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const items: SectionItem[] = lines.map((line) => {
    const parts = line.split("|").map((part) => part.trim());
    if (type === "projects" || type === "evidence") {
      return {
        title: parts[0] ?? "",
        description: parts[1] ?? "",
        url: parts[2] ?? "",
        sourceLabel: parts[3] ?? "",
        videoUrl: "",
        imageUrl: "",
      };
    }
    if (type === "contact") {
      return { title: parts[0] ?? "", url: parts[1] ?? "" };
    }
    return { title: parts[0] ?? "" };
  });

  return JSON.stringify(items);
}

export function itemsHint(type: string): string {
  if (type === "projects") {
    return "One project per line: Title | Description | URL (upload video in visual editor)";
  }
  if (type === "evidence") {
    return "One card per line: Title | Description | Source URL | Source label";
  }
  if (type === "contact") {
    return "One link per line: Label | URL";
  }
  if (type === "briefing") {
    return "One card per line: Title | Description | Video URL | Source label";
  }
  if (type === "skills") {
    return "One skill per line";
  }
  if (type === "stack") {
    return "One card per line: Title | Description";
  }
  if (type === "booking") {
    return "Leave empty. Dates and times are set under Slots in admin.";
  }
  return "Optional list — one item per line";
}

export function clockToSeconds(clock: string): number | null {
  const parts = clock.trim().split(":").map(Number);
  if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) {
    return null;
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return parts[0] * 60 + parts[1];
}

export function youtubeAtTime(url: string, clock: string): string {
  const seconds = clockToSeconds(clock);
  if (!url || seconds == null) {
    return url;
  }
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("t", String(seconds));
    return parsed.toString();
  } catch {
    return url;
  }
}

export function timeCues(range: string): { label: string; start: string }[] {
  return range
    .split("·")
    .map((part) => part.trim())
    .filter((part) => /\d/.test(part))
    .map((label) => ({
      label,
      start: label.split(/[–-]/)[0].trim(),
    }));
}
