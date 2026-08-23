"use client";

import {
  createQuickSection,
  logoutAction,
  patchSection,
  reorderSections,
} from "@/app/admin/actions";
import {
  AboutCard,
  EvidenceCard,
  ProjectCard,
  SectionView,
} from "@/components/site/SectionView";
import { EvidencePitchTrigger } from "@/components/site/EvidencePitchTrigger";
import { PitchPlaylistProvider } from "@/components/site/PitchPlaylist";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import type { SectionItem } from "@/lib/section-items";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

export type EditorSection = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  body: string;
  imageUrl: string;
  items: SectionItem[];
  sortOrder: number;
  visible: boolean;
};

function withItemIds(items: SectionItem[]): SectionItem[] {
  return items.map((item, index) => ({
    ...item,
    id: item.id ?? `item-${index}-${item.title}`,
  }));
}

async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: form,
  });
  if (!response.ok) {
    throw new Error("Upload failed");
  }
  const data = (await response.json()) as { url: string };
  return data.url;
}

function InlineText({
  value,
  onSave,
  className,
  multiline,
}: {
  value: string;
  onSave: (next: string) => void;
  className?: string;
  multiline?: boolean;
}) {
  const [draft, setDraft] = useState(value);
  const draftRef = useRef(draft);
  const valueRef = useRef(value);
  const onSaveRef = useRef(onSave);
  draftRef.current = draft;
  valueRef.current = value;
  onSaveRef.current = onSave;

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function commit() {
    if (draftRef.current !== valueRef.current) {
      onSaveRef.current(draftRef.current);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (draft !== value) onSave(draft);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [draft, value, onSave]);

  useEffect(() => {
    const flush = () => {
      if (draftRef.current !== valueRef.current) {
        onSaveRef.current(draftRef.current);
      }
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      flush();
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  const Tag = multiline ? "textarea" : "input";
  return (
    <Tag
      value={draft}
      className={`w-full resize-none bg-transparent outline-none ring-1 ring-transparent hover:ring-[var(--gold)]/30 focus:ring-[var(--gold)]/60 ${className ?? ""}`}
      onChange={(event) => setDraft(event.currentTarget.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (!multiline && event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
    />
  );
}

function PhotoSlot({
  url,
  className,
  onUploaded,
  accept = "image/jpeg,image/png,image/webp,image/gif",
  emptyLabel = "Drop photo or click",
  preview = "image",
}: {
  url: string;
  className?: string;
  onUploaded: (url: string) => void;
  accept?: string;
  emptyLabel?: string;
  preview?: "image" | "video";
}) {
  const [busy, setBusy] = useState(false);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) {
      return;
    }
    setBusy(true);
    try {
      const next = await uploadFile(file);
      onUploaded(next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <label
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        void handleFiles(event.dataTransfer.files);
      }}
      className={`relative flex cursor-pointer items-center justify-center overflow-hidden border border-dashed border-cyan-500/30 bg-cyan-950/40 text-xs text-cyan-600 ${className ?? ""}`}
    >
      {url && preview === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : null}
      {url && preview === "video" ? (
        <video
          src={url}
          className="h-full w-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
      ) : null}
      {!url ? <span>{busy ? "Uploading…" : emptyLabel}</span> : null}
      {url && busy ? (
        <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-cyan-100">
          Uploading…
        </span>
      ) : null}
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          void handleFiles(event.target.files);
          event.currentTarget.value = "";
        }}
      />
    </label>
  );
}

function SortableSection({
  section,
  onPatch,
  onItems,
}: {
  section: EditorSection;
  onPatch: (id: string, data: Parameters<typeof patchSection>[1]) => void;
  onItems: (id: string, items: SectionItem[]) => void;
}) {
  const sortable = useSortable({ id: section.id });
  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };
  const itemIds = section.items.map((item) => item.id ?? item.title);

  return (
    <div
      ref={sortable.setNodeRef}
      style={style}
      className="relative rounded-2xl ring-1 ring-white/5"
    >
      <button
        type="button"
        className="absolute left-0 top-6 z-10 cursor-grab rounded-r-md bg-white/10 px-1 py-2 text-[10px] text-zinc-400"
        {...sortable.attributes}
        {...sortable.listeners}
      >
        Drag
      </button>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      <SectionView
        section={{
          ...section,
          items: JSON.stringify(section.items),
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
        items={section.items}
        editable
        titleNode={
          <InlineText
            value={section.title}
            className="font-semibold tracking-tight text-white"
            onSave={(title) => onPatch(section.id, { title })}
          />
        }
        subtitleNode={
          <InlineText
            value={section.subtitle}
            className="text-zinc-500"
            onSave={(subtitle) => onPatch(section.id, { subtitle })}
          />
        }
        bodyNode={
          <InlineText
            multiline
            value={section.body}
            className="text-zinc-400"
            onSave={(body) => onPatch(section.id, { body })}
          />
        }
        imageNode={
          section.type === "hero" ? (
            <PhotoSlot
              url={section.imageUrl}
              className="h-56 w-56 rounded-3xl md:h-72 md:w-72"
              onUploaded={(imageUrl) => onPatch(section.id, { imageUrl })}
            />
          ) : undefined
        }
        itemNodes={
          section.type === "about" ||
          section.type === "stack" ||
          section.type === "projects" ||
          section.type === "evidence" ||
          section.type === "skills"
            ? section.items.map((item, index) => (
                <SortableItem
                  key={item.id ?? item.title}
                  item={item}
                  index={index}
                  type={section.type}
                  contrastVideoUrl={
                    item.id === "ev-ai-moto" || item.id === "ev-qmobile"
                      ? section.items.find((entry) => entry.id === "ev-qmobile")
                          ?.videoUrl
                      : [
                            "hero",
                            "ev-fazaia",
                            "ev-ai-tunghai",
                            "ev-ai-tunghai-long",
                          ].includes(item.id ?? "")
                        ? section.items.find((entry) => entry.id === "ev-fazaia")
                            ?.videoUrl
                        : undefined
                  }
                  onChange={(next) => {
                    const items = section.items.map((entry) =>
                      (entry.id ?? entry.title) === (item.id ?? item.title)
                        ? next
                        : entry,
                    );
                    onItems(section.id, items);
                  }}
                />
              ))
            : undefined
        }
      />
      </SortableContext>
    </div>
  );
}

function CueFields({
  item,
  onChange,
}: {
  item: SectionItem;
  onChange: (item: SectionItem) => void;
}) {
  return (
    <>
      <p className="pt-2 text-[10px] uppercase tracking-wide text-amber-500/90">
        Cue sheet (admin only — hidden on public site)
      </p>
      <p className="text-[10px] text-cyan-700">Article URL</p>
      <InlineText
        value={item.articleUrl ?? ""}
        className="text-xs text-[var(--ice)]"
        onSave={(articleUrl) => onChange({ ...item, articleUrl })}
      />
      <p className="text-[10px] text-cyan-700">Why this article</p>
      <InlineText
        multiline
        value={item.whyArticle ?? ""}
        className="text-xs text-amber-100/80"
        onSave={(whyArticle) => onChange({ ...item, whyArticle })}
      />
      <p className="text-[10px] text-cyan-700">Why this video</p>
      <InlineText
        multiline
        value={item.whyVideo ?? ""}
        className="text-xs text-amber-100/80"
        onSave={(whyVideo) => onChange({ ...item, whyVideo })}
      />
      <p className="text-[10px] text-cyan-700">Why this card (when to use it)</p>
      <InlineText
        multiline
        value={item.whyAdded ?? ""}
        className="text-xs text-amber-100/80"
        onSave={(whyAdded) => onChange({ ...item, whyAdded })}
      />
      <p className="text-[10px] text-cyan-700">Say this line</p>
      <InlineText
        multiline
        value={item.pitchLine ?? ""}
        className="text-xs text-cyan-100/80"
        onSave={(pitchLine) => onChange({ ...item, pitchLine })}
      />
      <p className="text-[10px] text-cyan-700">Time interval / where to pause</p>
      <InlineText
        value={item.timeRange ?? ""}
        className="text-xs text-cyan-300/70"
        onSave={(timeRange) => onChange({ ...item, timeRange })}
      />
    </>
  );
}

function SortableItem({
  item,
  index,
  type,
  contrastVideoUrl,
  onChange,
}: {
  item: SectionItem;
  index: number;
  type: string;
  contrastVideoUrl?: string;
  onChange: (item: SectionItem) => void;
}) {
  const id = item.id ?? item.title;
  const sortable = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  if (type === "skills") {
    return (
      <div ref={sortable.setNodeRef} style={style} className="flex items-center gap-1">
        <button
          type="button"
          className="cursor-grab text-[10px] text-zinc-600"
          {...sortable.attributes}
          {...sortable.listeners}
        >
          ↕
        </button>
        <span className="rounded-full border border-white/10 bg-zinc-900/70 px-4 py-2 text-sm">
          <InlineText
            value={item.title}
            onSave={(title) => onChange({ ...item, title })}
          />
        </span>
      </div>
    );
  }

  if (type === "about" || type === "stack") {
    return (
      <div ref={sortable.setNodeRef} style={style}>
        <AboutCard
          item={item}
          index={index}
          extra={
            <div className="mt-3 space-y-2">
              <button
                type="button"
                className="cursor-grab text-[10px] text-zinc-500"
                {...sortable.attributes}
                {...sortable.listeners}
              >
                Drag card
              </button>
              <InlineText
                value={item.title}
                className="text-lg font-medium text-white"
                onSave={(title) => onChange({ ...item, title })}
              />
              <InlineText
                multiline
                value={item.description ?? ""}
                className="text-sm text-zinc-500"
                onSave={(description) => onChange({ ...item, description })}
              />
            </div>
          }
        />
      </div>
    );
  }

  if (type === "evidence") {
    return (
      <div
        ref={sortable.setNodeRef}
        style={style}
        className={item.hidden ? "item-hidden-admin" : undefined}
      >
        <EvidenceCard
          item={item}
          extra={
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-wide text-cyan-700">
                Poster / photo
              </p>
              <PhotoSlot
                url={item.imageUrl ?? ""}
                className="mb-1 h-28 w-full rounded-xl"
                onUploaded={(imageUrl) => onChange({ ...item, imageUrl })}
              />
              <p className="text-[10px] uppercase tracking-wide text-cyan-700">
                Video (Pakistan school or clip)
              </p>
              <PhotoSlot
                url={item.videoUrl ?? ""}
                className="mb-2 h-36 w-full rounded-xl"
                accept="video/mp4,video/webm"
                emptyLabel="Drop mp4/webm or click"
                preview="video"
                onUploaded={(videoUrl) => onChange({ ...item, videoUrl })}
              />
              <button
                type="button"
                className="cursor-grab text-[10px] text-cyan-700"
                {...sortable.attributes}
                {...sortable.listeners}
              >
                Drag card
              </button>
              <button
                type="button"
                className="rounded border border-cyan-700/50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-cyan-300"
                onClick={() => onChange({ ...item, hidden: !item.hidden })}
              >
                {item.hidden ? "Show on public site" : "Hide on public site"}
              </button>
              <InlineText
                value={item.title}
                className="text-lg font-medium text-cyan-50"
                onSave={(title) => onChange({ ...item, title })}
              />
              <InlineText
                multiline
                value={item.description ?? ""}
                className="text-sm text-cyan-200/50"
                onSave={(description) => onChange({ ...item, description })}
              />
              <InlineText
                value={item.sourceLabel ?? ""}
                className="text-xs text-cyan-600"
                onSave={(sourceLabel) => onChange({ ...item, sourceLabel })}
              />
              <InlineText
                value={item.url ?? ""}
                className="text-sm text-[var(--ice)]"
                onSave={(url) => onChange({ ...item, url })}
              />
              <div
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <EvidencePitchTrigger
                  item={item}
                  contrastVideoUrl={contrastVideoUrl}
                  cues
                >
                  <span className="inline-flex rounded-lg border border-amber-400/40 bg-amber-950/40 px-3 py-1.5 text-xs text-amber-100">
                    Preview briefing
                  </span>
                </EvidencePitchTrigger>
              </div>
              <CueFields item={item} onChange={onChange} />
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div
      ref={sortable.setNodeRef}
      style={style}
      className={item.hidden ? "item-hidden-admin" : undefined}
    >
      <ProjectCard
        item={item}
        extra={
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-wide text-cyan-700">
              Poster
            </p>
            <PhotoSlot
              url={item.imageUrl ?? ""}
              className="mb-1 h-28 w-full rounded-xl"
              onUploaded={(imageUrl) => onChange({ ...item, imageUrl })}
            />
            <p className="text-[10px] uppercase tracking-wide text-cyan-700">
              Video
            </p>
            <PhotoSlot
              url={item.videoUrl ?? ""}
              className="mb-2 h-36 w-full rounded-xl"
              accept="video/mp4,video/webm"
              emptyLabel="Drop mp4/webm or click"
              preview="video"
              onUploaded={(videoUrl) => onChange({ ...item, videoUrl })}
            />
            <button
              type="button"
              className="cursor-grab text-[10px] text-cyan-700"
              {...sortable.attributes}
              {...sortable.listeners}
            >
              Drag card
            </button>
            <button
              type="button"
              className="rounded border border-cyan-700/50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-cyan-300"
              onClick={() => onChange({ ...item, hidden: !item.hidden })}
            >
              {item.hidden ? "Show on public site" : "Hide on public site"}
            </button>
            <InlineText
              value={item.title}
              className="text-lg font-medium text-cyan-50"
              onSave={(title) => onChange({ ...item, title })}
            />
            <InlineText
              multiline
              value={item.description ?? ""}
              className="text-sm text-cyan-200/50"
              onSave={(description) => onChange({ ...item, description })}
            />
            <InlineText
              value={item.url ?? ""}
              className="text-sm text-[var(--ice)]"
              onSave={(url) => onChange({ ...item, url })}
            />
            <div
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <EvidencePitchTrigger
                item={item}
                contrastVideoUrl={contrastVideoUrl}
                cues
              >
                <span className="inline-flex rounded-lg border border-amber-400/40 bg-amber-950/40 px-3 py-1.5 text-xs text-amber-100">
                  Preview briefing
                </span>
              </EvidencePitchTrigger>
            </div>
            <CueFields item={item} onChange={onChange} />
          </div>
        }
      />
    </div>
  );
}

export function EditableSite({
  initialSections,
}: {
  initialSections: EditorSection[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [dndReady, setDndReady] = useState(false);
  const [sections, setSections] = useState(() =>
    initialSections.map((section) => ({
      ...section,
      items: withItemIds(section.items),
    })),
  );

  useEffect(() => {
    setDndReady(true);
  }, []);

  useEffect(() => {
    setSections(
      initialSections.map((section) => ({
        ...section,
        items: withItemIds(section.items),
      })),
    );
  }, [initialSections]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function persistPatch(id: string, data: Parameters<typeof patchSection>[1]) {
    setSections((current) =>
      current.map((section) =>
        section.id === id
          ? {
              ...section,
              title: data.title ?? section.title,
              subtitle: data.subtitle ?? section.subtitle,
              body: data.body ?? section.body,
              imageUrl: data.imageUrl ?? section.imageUrl,
            }
          : section,
      ),
    );
    startTransition(() => {
      void patchSection(id, data)
        .then(() => router.refresh())
        .catch((error) => {
          console.error("Save failed", error);
        });
    });
  }

  function persistItems(id: string, items: SectionItem[]) {
    setSections((current) =>
      current.map((section) => (section.id === id ? { ...section, items } : section)),
    );
    startTransition(() => {
      void patchSection(id, { itemsJson: JSON.stringify(items) })
        .then(() => router.refresh())
        .catch((error) => {
          console.error("Save failed", error);
        });
    });
  }

  function onSectionDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const activeId = String(active.id);
    const overId = String(over.id);

    const sectionOld = sections.findIndex((section) => section.id === activeId);
    const sectionNew = sections.findIndex((section) => section.id === overId);
    if (sectionOld >= 0 && sectionNew >= 0) {
      const next = arrayMove(sections, sectionOld, sectionNew);
      setSections(next);
      startTransition(() => {
        void reorderSections(next.map((section) => section.id));
      });
      return;
    }

    for (const section of sections) {
      const ids = section.items.map((item) => item.id ?? item.title);
      const oldIndex = ids.indexOf(activeId);
      const newIndex = ids.indexOf(overId);
      if (oldIndex >= 0 && newIndex >= 0) {
        persistItems(section.id, arrayMove(section.items, oldIndex, newIndex));
        return;
      }
    }
  }

  const brand =
    sections.find((section) => section.type === "hero")?.title ?? "Ali";

  if (!dndReady) {
    return (
      <div className="site-bg min-h-screen">
        <div className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/95">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-sm">
            <p className="text-zinc-400">Visual editor — visitors never see this bar</p>
          </div>
        </div>
        <SiteHeader brand={brand} animate={false} />
        <main className="mx-auto max-w-6xl px-6 pb-16">
          <p className="py-24 text-center text-sm text-cyan-700">Loading editor…</p>
        </main>
        <SiteFooter brand={brand} />
      </div>
    );
  }

  return (
    <PitchPlaylistProvider>
    <div className="site-bg min-h-screen">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-sm">
          <p className="text-zinc-400">Visual editor — visitors never see this bar</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full border border-white/15 px-3 py-1 text-zinc-200"
              onClick={() => {
                startTransition(async () => {
                  await createQuickSection();
                  router.refresh();
                });
              }}
            >
              Add section
            </button>
            <Link href="/admin" className="text-zinc-400 hover:text-white">
              List
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="text-zinc-400 hover:text-white">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
      <SiteHeader brand={brand} animate={false} />
      <main className="mx-auto max-w-6xl px-6 pb-16">
        <DndContext
          id="ali-admin-editor"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onSectionDragEnd}
        >
          <SortableContext
            items={sections.map((section) => section.id)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                onPatch={persistPatch}
                onItems={persistItems}
              />
            ))}
          </SortableContext>
        </DndContext>
      </main>
      <SiteFooter brand={brand} />
    </div>
    </PitchPlaylistProvider>
  );
}
