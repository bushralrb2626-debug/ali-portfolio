"use client";

import type { Section } from "@prisma/client";
import {
  parseItems,
  timeCues,
  youtubeAtTime,
  type SectionItem,
} from "@/lib/section-items";
import type { ReactNode } from "react";
import { YouTubePosterPlayer } from "@/components/site/YouTubePosterPlayer";
import { EvidencePitchTrigger } from "@/components/site/EvidencePitchTrigger";
import { TypeLine } from "@/components/site/TypeLine";
import { Reveal } from "@/components/site/Reveal";
import { ContactForm } from "@/components/site/ContactForm";
import { BookingForm } from "@/components/site/BookingForm";

export type SectionRenderProps = {
  section: Section;
  items: SectionItem[];
  editable?: boolean;
  titleNode?: ReactNode;
  subtitleNode?: ReactNode;
  bodyNode?: ReactNode;
  imageNode?: ReactNode;
  itemNodes?: ReactNode[];
  dragHandle?: ReactNode;
};

function PublicHeading({
  as,
  text,
  editable,
  className,
}: {
  as: "h1" | "h2";
  text: ReactNode;
  editable?: boolean;
  className: string;
}) {
  if (typeof text === "string" && !editable) {
    return <TypeLine as={as} text={text} className={className} />;
  }
  const Tag = as;
  return <Tag className={className}>{text}</Tag>;
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-950/80 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-200">
      {children}
    </span>
  );
}

function youtubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.split("/")[2] || null;
      }
      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/")[2] || null;
      }
      return u.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

function isDirectMedia(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.startsWith("/uploads/");
}

function mediaDuration(item: SectionItem): string | undefined {
  if (!item.videoUrl) return undefined;
  const map: Record<string, string> = {
    "ev-ai-sora": "0:22",
    "ev-ai-coke": "1:00",
    "ev-ai-moto": "0:20",
    "ev-qmobile": "0:20",
    "ev-ai-tunghai": "0:15",
    "ev-ai-tunghai-long": "0:30",
    "ev-fazaia": "0:12",
  };
  return item.id ? map[item.id] : undefined;
}

function mediaHeadline(item: SectionItem): string {
  const map: Record<string, string> = {
    "ev-ai-sora": "Millions of views · Sora",
    "ev-ai-coke": "Official AI holiday film",
    "ev-ai-toys": "First Sora brand · article",
    "ev-ai-moto": "No camera · no crew",
    "ev-qmobile": "Q Mobile · live phone ad",
    "ev-ai-tunghai": "University AI film",
    "ev-ai-tunghai-long": "~2.9M · long AI film",
    "ev-fazaia": "Fazaia human · ~326",
    "ev-ai-dumpling": "AI clips · kids demand",
    "ev-ai-heinz": "850M+ impressions",
    "ev-slorsh": "Hidden gem · Slorsh",
    "ev-ai-castlery": "+23% watch vs crew",
    "ev-pk-school": "Recite lines & post",
    "proj-meta": "Meta · parents in-radius",
    "proj-tiktok": "TikTok · weekly tests",
    "proj-cutdown": "Cutdowns · paid lengths",
  };
  return (item.id && map[item.id]) || item.title;
}

function MediaOverlay({
  title,
  duration,
}: {
  title?: string;
  duration?: string;
}) {
  if (!title && !duration) return null;
  return (
    <>
      {title ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pb-3 pt-10">
          <p className="max-w-[90%] text-sm font-semibold leading-snug text-white drop-shadow md:text-base">
            {title}
          </p>
        </div>
      ) : null}
      {duration ? (
        <span className="pointer-events-none absolute bottom-3 right-3 rounded bg-black/85 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white">
          {duration}
        </span>
      ) : null}
    </>
  );
}

function ProjectMedia({
  item,
  emptyHint,
  overlayTitle,
  showOverlay = true,
  staticOnly = false,
}: {
  item: SectionItem;
  emptyHint?: string;
  overlayTitle?: string;
  showOverlay?: boolean;
  staticOnly?: boolean;
}) {
  const duration = mediaDuration(item);
  const headline = overlayTitle ?? mediaHeadline(item);
  const ytId = item.videoUrl ? youtubeVideoId(item.videoUrl) : null;
  const overlay = showOverlay ? (
    <MediaOverlay title={headline} duration={duration} />
  ) : null;

  if (item.videoUrl && ytId) {
    return (
      <YouTubePosterPlayer
        videoId={ytId}
        title={item.title}
        posterUrl={
          item.imageUrl ||
          `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
        }
        overlay={overlay}
        staticOnly={staticOnly}
      />
    );
  }

  if (item.videoUrl && isDirectMedia(item.videoUrl)) {
    return (
      <div className="video-frame relative aspect-video w-full overflow-hidden">
        <video
          className="h-full w-full object-cover"
          controls
          playsInline
          preload="metadata"
          poster={item.imageUrl || undefined}
          src={item.videoUrl}
        />
        {overlay}
      </div>
    );
  }

  if (item.imageUrl) {
    return (
      <div className="relative aspect-video w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt=""
          className="h-full w-full object-cover"
        />
        {overlay}
      </div>
    );
  }

  return (
    <div className="video-frame flex aspect-video w-full flex-col items-center justify-center gap-1 border-b border-cyan-500/10">
      {emptyHint ? (
        <>
          <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-600">
            Nano frame
          </span>
          <span className="text-xs text-cyan-800">{emptyHint}</span>
        </>
      ) : null}
    </div>
  );
}

export function SectionView({
  section,
  items,
  editable,
  titleNode,
  subtitleNode,
  bodyNode,
  imageNode,
  itemNodes,
  dragHandle,
}: SectionRenderProps) {
  const title = titleNode ?? section.title;
  const subtitle = subtitleNode ?? section.subtitle;
  const body = bodyNode ?? section.body;
  const visibleItems = editable ? items : items.filter((item) => !item.hidden);
  const ficUrl =
    items.find((i) => i.id === "ev-fazaia")?.videoUrl ||
    "https://www.youtube.com/watch?v=4ZtmP_QrErk";
  const qMobileUrl =
    items.find((i) => i.id === "ev-qmobile")?.videoUrl ||
    "https://www.youtube.com/watch?v=XQ3X4CWStoM";
  const contrastFor = (itemId?: string) => {
    if (!itemId) return undefined;
    if (
      ["hero", "ev-fazaia", "ev-ai-tunghai", "ev-ai-tunghai-long"].includes(
        itemId,
      )
    ) {
      return ficUrl;
    }
    if (itemId === "ev-ai-moto" || itemId === "ev-qmobile") {
      return qMobileUrl;
    }
    return undefined;
  };
  const image =
    imageNode ??
    (section.imageUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={section.imageUrl}
        alt=""
        className="h-full w-full object-cover"
      />
    ) : null);

  if (section.type === "hero") {
    return (
      <section id="home" className="relative scroll-mt-20 py-20 md:py-28">
        {dragHandle}
        <div className="grid items-center gap-12 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            {section.subtitle || editable ? (
              typeof subtitle === "string" && !editable ? (
                <TypeLine
                  as="p"
                  text={subtitle}
                  className="text-xs uppercase tracking-[0.22em] text-cyan-500/80"
                />
              ) : (
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-500/80">
                  {subtitle}
                </p>
              )
            ) : null}
            {typeof title === "string" && !editable ? (
              <TypeLine
                as="h1"
                text={title.replace(/^Ali\.\s*/i, "")}
                delayMs={80}
                msPerChar={70}
                className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-cyan-50 md:text-7xl"
              />
            ) : (
              <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-cyan-50 md:text-7xl">
                {typeof title === "string" ? title.replace(/^Ali\.\s*/i, "") : title}
              </h1>
            )}
            {section.body || editable ? (
              typeof body === "string" && !editable ? (
                <TypeLine
                  as="p"
                  text={body}
                  delayMs={220}
                  msPerChar={12}
                  className="mt-6 max-w-xl text-base leading-relaxed text-cyan-100/55"
                />
              ) : (
                <p className="mt-6 max-w-xl text-base leading-relaxed text-cyan-100/55">
                  {body}
                </p>
              )
            ) : null}
            <div className="mt-8">
              <a
                href="#contact"
                className="gradient-cta inline-flex rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                Get in touch
              </a>
            </div>
          </div>
          <div className="justify-self-center">
            {editable ? (
              <div className="circuit-card h-56 w-56 overflow-hidden rounded-3xl md:h-72 md:w-72">
                {image ?? (
                  <div className="video-frame flex h-full w-full flex-col items-center justify-center gap-2">
                    <span className="nano-orb h-10 w-10 rounded-full" />
                    <span className="text-xs text-cyan-700">Drop a photo</span>
                  </div>
                )}
              </div>
            ) : (
              <EvidencePitchTrigger
                item={{ id: "hero", title: section.title }}
                contrastVideoUrl={contrastFor("hero")}
                order={0}
              >
                <div className="circuit-card relative h-56 w-56 overflow-hidden rounded-3xl md:h-72 md:w-72">
                  {section.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={section.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="video-frame flex h-full w-full items-center justify-center">
                      <span className="nano-orb h-10 w-10 rounded-full" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white shadow-lg backdrop-blur-sm">
                      <svg
                        viewBox="0 0 24 24"
                        className="ml-0.5 h-5 w-5 fill-current"
                        aria-hidden
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                  <span className="pointer-events-none absolute bottom-3 left-3 right-3 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-cyan-50">
                    AI · Ads · Solo
                  </span>
                </div>
              </EvidencePitchTrigger>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "about" || section.type === "stack") {
    const isStack = section.type === "stack";
    return (
      <section id={isStack ? "campus-stack" : "about"} className="scroll-mt-20 py-20">
        {dragHandle}
        <div className="mb-12">
          <Pill>{isStack ? "Campus page" : "Thesis"}</Pill>
          <PublicHeading
            as="h2"
            text={title}
            editable={editable}
            className="mt-4 text-4xl font-semibold tracking-tight text-cyan-50"
          />
          {section.subtitle || editable ? (
            <p className="mt-3 text-cyan-200/40">{subtitle}</p>
          ) : null}
          {isStack && (section.body || editable) ? (
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-cyan-100/50">
              {body}
            </p>
          ) : null}
        </div>
        <div className={`grid gap-6 ${isStack ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {itemNodes
            ? itemNodes
            : visibleItems.map((item, index) => (
                <Reveal key={item.id ?? item.title} delayMs={index * 70}>
                  <AboutCard item={item} index={index} />
                </Reveal>
              ))}
        </div>
      </section>
    );
  }

  if (section.type === "evidence") {
    return (
      <section id="evidence" className="scroll-mt-20 py-20">
        {dragHandle}
        <div className="mb-10">
          <Pill>Proof</Pill>
          <PublicHeading
            as="h2"
            text={title}
            editable={editable}
            className="mt-4 text-4xl font-semibold tracking-tight text-cyan-50"
          />
          {section.subtitle || editable ? (
            <p className="mt-3 max-w-3xl text-cyan-200/40">{subtitle}</p>
          ) : null}
          {section.body || editable ? (
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-cyan-100/50">
              {body}
            </p>
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {itemNodes
            ? itemNodes
            : visibleItems.map((item, index) => (
                <Reveal key={item.id ?? item.title} delayMs={index * 60}>
                  <EvidenceCard
                    item={item}
                    contrastVideoUrl={contrastFor(item.id)}
                    order={100 + index}
                  />
                </Reveal>
              ))}
        </div>
      </section>
    );
  }

  if (section.type === "projects") {
    return (
      <section id="projects" className="scroll-mt-20 py-20">
        {dragHandle}
        <div className="mb-10">
          <Pill>Work</Pill>
          <PublicHeading
            as="h2"
            text={title}
            editable={editable}
            className="mt-4 text-4xl font-semibold tracking-tight text-cyan-50"
          />
          {section.subtitle || section.body || editable ? (
            <p className="mt-3 max-w-2xl text-cyan-200/40">{body || subtitle}</p>
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {itemNodes
            ? itemNodes
            : visibleItems.map((item, index) => (
                <Reveal key={item.id ?? item.title} delayMs={index * 60}>
                  <ProjectCard item={item} order={200 + index} />
                </Reveal>
              ))}
        </div>
      </section>
    );
  }

  if (section.type === "briefing") {
    return (
      <section id="why-ai" className="scroll-mt-20 py-20">
        {dragHandle}
        <Pill>Why AI</Pill>
        <PublicHeading
          as="h2"
          text={title}
          editable={editable}
          className="mt-4 text-4xl font-semibold tracking-tight text-cyan-50"
        />
        {section.subtitle || editable ? (
          <p className="mt-3 max-w-3xl text-cyan-200/40">{subtitle}</p>
        ) : null}
        {section.body || editable ? (
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-cyan-100/50">
            {body}
          </p>
        ) : null}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {visibleItems.map((item, index) => {
            const watch = item.videoUrl || "";
            const sourceHref =
              item.articleUrl ||
              (item.url && item.url !== item.videoUrl ? item.url : "");
            const cues = item.timeRange ? timeCues(item.timeRange) : [];
            const youtube = /youtube\.com|youtu\.be/.test(watch);
            return (
              <article
                key={item.id ?? item.title}
                className="circuit-card rounded-2xl p-6"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-500/70">
                  Briefing {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-lg font-medium text-cyan-50">{item.title}</h3>
                {item.sourceLabel ? (
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-cyan-500/70">
                    {item.sourceLabel}
                  </p>
                ) : null}
                {item.timeRange ? (
                  <p className="mt-2 text-sm text-cyan-300/80">
                    Said at {item.timeRange}
                  </p>
                ) : null}
                {item.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-cyan-200/45">
                    {item.description}
                  </p>
                ) : null}
                {sourceHref || watch ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {sourceHref ? (
                      <a
                        href={sourceHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex text-sm text-cyan-300 hover:underline"
                      >
                        Source
                      </a>
                    ) : null}
                    {watch
                      ? (cues.length
                          ? cues
                          : [{ label: "Open video", start: "" }]
                        ).map((cue) => (
                          <a
                            key={cue.label}
                            href={
                              cue.start && youtube
                                ? youtubeAtTime(watch, cue.start)
                                : watch
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex text-sm text-cyan-300 hover:underline"
                          >
                            {cues.length
                              ? `Open video ${cue.label}`
                              : "Open video"}
                          </a>
                        ))
                      : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  if (section.type === "skills") {
    return (
      <section id="skills" className="scroll-mt-20 py-16">
        {dragHandle}
        <PublicHeading
          as="h2"
          text={title}
          editable={editable}
          className="text-3xl font-semibold tracking-tight text-cyan-50"
        />
        <div className="mt-8 flex flex-wrap gap-2">
          {itemNodes
            ? itemNodes.map((node, index) => <div key={index}>{node}</div>)
            : visibleItems.map((item) => (
                <span
                  key={item.title}
                  className="rounded-full border border-cyan-500/20 bg-cyan-950/40 px-4 py-2 text-sm text-cyan-100/80"
                >
                  {item.title}
                </span>
              ))}
        </div>
      </section>
    );
  }

  if (section.type === "contact") {
    return (
      <section id="contact" className="scroll-mt-20 py-20">
        {dragHandle}
        <Pill>Contact</Pill>
        <PublicHeading
          as="h2"
          text={title}
          editable={editable}
          className="mt-4 text-4xl font-semibold tracking-tight text-cyan-50"
        />
        {section.body || editable ? (
          <p className="mt-4 max-w-xl text-cyan-100/55">{body}</p>
        ) : null}
        {editable ? (
          <p className="mt-8 text-sm text-cyan-200/40">
            Visitors send a message here. Read them at Messages in admin.
          </p>
        ) : (
          <ContactForm />
        )}
      </section>
    );
  }

  if (section.type === "booking") {
    return (
      <section id="book" className="scroll-mt-20 py-20">
        {dragHandle}
        <Pill>Book</Pill>
        <PublicHeading
          as="h2"
          text={title}
          editable={editable}
          className="mt-4 text-4xl font-semibold tracking-tight text-cyan-50"
        />
        {section.body || editable ? (
          <p className="mt-4 max-w-xl text-cyan-100/55">{body}</p>
        ) : null}
        {editable ? (
          <p className="mt-8 text-sm text-cyan-200/40">
            Set dates and times under Slots in admin. Visitors book the open ones.
          </p>
        ) : (
          <BookingForm />
        )}
      </section>
    );
  }

  return (
    <section id={section.id} className="scroll-mt-20 py-16">
      {dragHandle}
      <PublicHeading
        as="h2"
        text={title}
        editable={editable}
        className="text-3xl font-semibold tracking-tight text-cyan-50"
      />
      {section.subtitle || editable ? (
        <p className="mt-2 text-cyan-200/40">{subtitle}</p>
      ) : null}
      {section.body || editable ? (
        <p className="mt-6 max-w-2xl whitespace-pre-wrap text-cyan-100/55">
          {body}
        </p>
      ) : null}
    </section>
  );
}

const CARD_ICONS: Record<string, string> = {
  "about-hire": "/icons/icon-hire.png",
  "about-world": "/icons/icon-world.png",
  "about-web": "/icons/icon-web.png",
  "about-ai-web": "/icons/icon-ai-web.png",
  "about-chat": "/icons/icon-chat.png",
  "about-ali": "/icons/icon-ali.png",
  "stack-search": "/icons/icon-web.png",
  "stack-ads": "/icons/icon-world.png",
  "stack-bot": "/icons/icon-chat.png",
  "stack-method": "/icons/icon-ai-web.png",
};

const CARD_ICON_FALLBACK = [
  "/icons/icon-hire.png",
  "/icons/icon-world.png",
  "/icons/icon-web.png",
  "/icons/icon-ai-web.png",
  "/icons/icon-chat.png",
  "/icons/icon-ali.png",
];

export function AboutCard({
  item,
  index,
  extra,
}: {
  item?: SectionItem;
  index: number;
  extra?: ReactNode;
}) {
  if (!item) {
    return extra;
  }
  const iconSrc =
    (item.id && CARD_ICONS[item.id]) || CARD_ICON_FALLBACK[index % CARD_ICON_FALLBACK.length];
  return (
    <article className="circuit-card rounded-2xl p-6">
      <div className="relative mb-5 inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-cyan-500/25 bg-cyan-950/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSrc}
          alt=""
          className="h-full w-full object-cover"
        />
        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-300 text-[10px] font-semibold text-cyan-950">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="text-lg font-medium text-cyan-50">
        {extra ? null : item.title}
      </h3>
      {item.description && !extra ? (
        <p className="mt-2 text-sm leading-relaxed text-cyan-200/45">
          {item.description}
        </p>
      ) : null}
      {extra}
    </article>
  );
}

export function ProjectCard({
  item,
  extra,
  contrastVideoUrl,
  order = 0,
}: {
  item?: SectionItem;
  extra?: ReactNode;
  contrastVideoUrl?: string;
  order?: number;
}) {
  if (!item) {
    return extra;
  }
  const card = (
    <article className="circuit-card overflow-hidden rounded-2xl">
      {!extra ? (
        <div className="relative">
          <ProjectMedia item={item} emptyHint={undefined} />
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-cyan-400/25 bg-cyan-950/75 px-2 py-0.5 text-[10px] uppercase tracking-wide text-cyan-200/90">
            Play
          </span>
        </div>
      ) : null}
      <div className="p-6">
        {!extra ? (
          <>
            <h3 className="text-lg font-medium text-cyan-50">{item.title}</h3>
            {item.description ? (
              <p className="mt-2 text-sm leading-relaxed text-cyan-200/45">
                {item.description}
              </p>
            ) : null}
            {item.url ? (
              <a
                href={item.url}
                className="mt-4 inline-block text-sm text-[var(--ice)] hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                View details →
              </a>
            ) : null}
          </>
        ) : (
          extra
        )}
      </div>
    </article>
  );

  if (extra) {
    return card;
  }

  return (
    <EvidencePitchTrigger
      item={item}
      contrastVideoUrl={contrastVideoUrl}
      order={order}
    >
      {card}
    </EvidencePitchTrigger>
  );
}

export function EvidenceCard({
  item,
  extra,
  contrastVideoUrl,
  order = 0,
}: {
  item?: SectionItem;
  extra?: ReactNode;
  contrastVideoUrl?: string;
  order?: number;
}) {
  if (!item) {
    return extra;
  }

  const card = (
    <article className="circuit-card overflow-hidden rounded-2xl">
      {!extra ? (
        <div className="relative">
          <ProjectMedia
            item={item}
            staticOnly
          />
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-cyan-400/25 bg-cyan-950/75 px-2 py-0.5 text-[10px] uppercase tracking-wide text-cyan-200/90">
            Play
          </span>
        </div>
      ) : null}
      <div className="p-6">
        {!extra ? (
          <>
            <h3 className="text-lg font-medium text-cyan-50">{item.title}</h3>
            {item.description ? (
              <p className="mt-2 text-sm leading-relaxed text-cyan-200/45">
                {item.description}
              </p>
            ) : null}
            {item.videoUrl ? (
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-3 mr-3 inline-block text-sm text-[var(--ice)] hover:underline"
              >
                Open video →
              </a>
            ) : null}
            {item.articleUrl || item.url ? (
              <a
                href={item.articleUrl || item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-3 inline-block text-sm text-[var(--ice)] hover:underline"
              >
                Open article →
              </a>
            ) : null}
          </>
        ) : (
          extra
        )}
      </div>
    </article>
  );

  if (extra) {
    return card;
  }

  return (
    <EvidencePitchTrigger
      item={item}
      contrastVideoUrl={contrastVideoUrl}
      order={order}
    >
      {card}
    </EvidencePitchTrigger>
  );
}

export function PublicSection({ section }: { section: Section }) {
  return <SectionView section={section} items={parseItems(section.items)} />;
}
