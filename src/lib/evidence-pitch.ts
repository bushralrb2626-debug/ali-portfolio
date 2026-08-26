export type PitchChartBar = {
  label: string;
  value: number;
  suffix?: string;
};

export type PitchChartSeries = {
  name: string;
  values: number[];
};

export type PitchChart = {
  title: string;
  caption?: string;
  kind?: "published" | "model";
  type: "bar" | "pie" | "line";
  bars?: PitchChartBar[];
  series?: PitchChartSeries[];
  xLabels?: string[];
};

export type PitchSlide = {
  title: string;
  subtitle?: string;
  bullets: string[];
  videoUrl?: string;
  videoSourceLabel?: string;
  contrastVideoUrl?: string;
  contrastVideoSourceLabel?: string;
  contrastPoster?: string;
  compareAiLabel?: string;
  compareHumanLabel?: string;
  chart?: PitchChart;
  charts?: PitchChart[];
  accent?: "default" | "warn" | "win";
};

export type PitchDeck = {
  id: string;
  title: string;
  slides: PitchSlide[];
};

function deriveBars(chart: PitchChart): PitchChartBar[] {
  if (chart.bars?.length) return chart.bars;
  return (chart.series ?? []).map((s) => ({
    label: s.name,
    value: s.values[s.values.length - 1] ?? 0,
  }));
}

function deriveSeries(chart: PitchChart): {
  series: PitchChartSeries[];
  xLabels: string[];
} {
  if (chart.series?.length) {
    return {
      series: chart.series,
      xLabels:
        chart.xLabels ??
        chart.series[0].values.map((_, i) => `M${i + 1}`),
    };
  }
  const bars = chart.bars ?? [];
  return {
    xLabels: bars.map((b) => b.label),
    series: [{ name: chart.title, values: bars.map((b) => b.value) }],
  };
}

/** Same series rendered as bar + line/area + doughnut. */
export function tripleChart(data: PitchChart): PitchChart[] {
  const bars = deriveBars(data);
  const { series, xLabels } = deriveSeries(data);
  const shared = { ...data, bars, series, xLabels };
  return [
    { ...shared, type: "bar" },
    { ...shared, type: "line" },
    { ...shared, type: "pie" },
  ];
}

export const CHART_TIME: PitchChart = {
  type: "bar",
  title: "Days to ship one parent hook",
  caption:
    "Film-day recite vs generate-and-cut the same week. Not a published campus study.",
  bars: [
    { label: "Human recite", value: 5, suffix: " days" },
    { label: "AI ads stack", value: 1, suffix: " day" },
  ],
};

export const CHART_TRAD_WEEK: PitchChart = {
  type: "pie",
  title: "Where a recite week actually goes",
  caption: "Mix of one human film week. Not a timesheet study.",
  bars: [
    { label: "Shoot day", value: 46, suffix: "%" },
    { label: "Waiting / unused takes", value: 33, suffix: "%" },
    { label: "Upload to followers", value: 21, suffix: "%" },
  ],
};

export const CHART_EFF: PitchChart = {
  type: "line",
  title: "Hooks shipped across seven days",
  caption: "Human stays at one take. AI stack adds variants. Model series, not an A/B paper.",
  xLabels: ["D1", "D2", "D3", "D4", "D5", "D6", "D7"],
  series: [
    { name: "Human one-take", values: [1, 1, 1, 1, 1, 1, 1] },
    { name: "AI variants", values: [1, 2, 3, 5, 6, 7, 8] },
  ],
};

export const CHART_PHONE: PitchChart = {
  type: "bar",
  title: "Crew days to finish a phone commercial",
  caption: "Comparison of methods. Not Motorola or Q Mobile published figures.",
  bars: [
    { label: "Q Mobile live crew", value: 9, suffix: " days" },
    { label: "Motorola generated", value: 2, suffix: " days" },
  ],
};

export const CHART_Q_MIX: PitchChart = {
  type: "pie",
  title: "Live phone ad — spend mix",
  caption: "Pie of a traditional shoot. Not a Q Mobile budget leak.",
  bars: [
    { label: "Camera + crew", value: 52, suffix: "%" },
    { label: "Talent / set", value: 31, suffix: "%" },
    { label: "Post", value: 17, suffix: "%" },
  ],
};

export const CHART_TUNG_VIEWS: PitchChart = {
  type: "bar",
  title: "Admissions film views — Fazaia vs Tunghai long AI",
  caption:
    "YouTube checked: Fazaia clip ~326 views. Tunghai long AI H79QCj-gPlc ~2.98M. Do not put 2.9M on the short cutdown.",
  bars: [
    { label: "Tunghai long AI", value: 2980, suffix: "k views" },
    { label: "Fazaia human clip", value: 0.3, suffix: "k views" },
  ],
};

export const CHART_TUNG_LIFT: PitchChart = {
  type: "line",
  kind: "model",
  title: "Popularity and income after the long AI film",
  caption:
    "Model: before vs after bars, five-month popularity + income line, doughnut mix. Not QS, THE, or an enrollment PDF. Cite YouTube ~2.9M vs Fazaia ~326 only.",
  xLabels: ["M1", "M2", "M3", "M4", "M5"],
  series: [
    { name: "Popularity index", values: [100, 118, 132, 148, 162] },
    { name: "Income index", values: [100, 112, 124, 141, 155] },
  ],
  bars: [
    { label: "Pop. before", value: 100 },
    { label: "Pop. after", value: 162 },
    { label: "Income before", value: 100 },
    { label: "Income after", value: 155 },
  ],
};

export const CHART_CPL: PitchChart = {
  type: "pie",
  kind: "model",
  title: "Where O-Level inquiries would come from",
  caption: "Ali campus model mix. Not a published CPL study.",
  bars: [
    { label: "Paid parent ads", value: 47, suffix: "%" },
    { label: "Chatbot / site", value: 31, suffix: "%" },
    { label: "Walk-in / other", value: 22, suffix: "%" },
  ],
};

export const CHART_UNI_AI: PitchChart = {
  type: "pie",
  title: "Who already ships AI campus film",
  caption: "Mix: universities vs local recite habit. Not a ranking table.",
  bars: [
    { label: "University AI film", value: 64, suffix: "%" },
    { label: "Local recite posts", value: 36, suffix: "%" },
  ],
};

export const CHART_SORA_MIX: PitchChart = {
  type: "pie",
  title: "Sora reel — clip mix in the official cut",
  caption: "Share of the OpenAI reel. Not a shot list from OpenAI.",
  bars: [
    { label: "Animals / weather", value: 38, suffix: "%" },
    { label: "People / action", value: 34, suffix: "%" },
    { label: "Worlds / craft", value: 28, suffix: "%" },
  ],
};

export const CHART_COKE_SPLIT: PitchChart = {
  type: "bar",
  title: "Coca-Cola AI holiday — YouTube vs teaser scale",
  caption: "Official spot ~2.8M YouTube. Toys teaser is not this card. Different number set.",
  bars: [
    { label: "Coke AI spot", value: 2.8, suffix: "M" },
    { label: "Typical recite post", value: 0.002, suffix: "M" },
  ],
};

export const CHART_TOYS_ROLE: PitchChart = {
  type: "pie",
  title: "Toys“R”Us Sora — why this card exists",
  caption: "Historic first vs view-count. CNN is the source. Teaser is ~292k — not the pie of millions.",
  bars: [
    { label: "Cannes / first-mover", value: 78, suffix: "%" },
    { label: "View-count proof", value: 22, suffix: "%" },
  ],
};

export const CHART_FIC_STACK: PitchChart = {
  type: "pie",
  title: "What parents find when they search FIC",
  caption: "Mix: no original site, thin social, YouTube-only clip.",
  bars: [
    { label: "No original website", value: 44, suffix: "%" },
    { label: "No authentic social home", value: 31, suffix: "%" },
    { label: "YouTube clip only", value: 25, suffix: "%" },
  ],
};

/** Named public logos / case studies on vendor sites — not a market-share study. */
export const CHART_HOST_LOGOS: PitchChart = {
  type: "bar",
  title: "Named public company stories (sample)",
  caption:
    "Count of named logos/case studies: Vercel (Washington Post, eBay, Sonos, Box, Runway, HashiCorp), Supabase (Mozilla, GitHub, 1Password, Pika). Electrode.io is Walmart’s own React/Node kit. Not a market-share report.",
  kind: "model",
  bars: [
    { label: "Vercel", value: 6, suffix: " names" },
    { label: "Supabase", value: 4, suffix: " names" },
    { label: "Electrode.io", value: 1, suffix: " (Walmart)" },
  ],
};

export const CHART_HOST_OPS: PitchChart = {
  type: "bar",
  title: "What you still have to run yourself",
  caption:
    "Electrode is a scaffold — you still host servers, database, auth, files. Vercel + Supabase is hosted. Not a published ops audit.",
  kind: "model",
  bars: [
    { label: "Electrode.io", value: 4, suffix: " layers" },
    { label: "Vercel + Supabase", value: 0, suffix: " extra" },
  ],
};

export const CHART_DUMPLING: PitchChart = {
  type: "line",
  title: "Squishy dumpling demand after AI clips",
  caption: "Article-shaped weekly demand index. Not a retailer export.",
  xLabels: ["W1", "W2", "W3", "W4", "W5", "W6"],
  series: [
    { name: "Search interest", values: [22, 28, 41, 63, 71, 77] },
    { name: "Store ask index", values: [18, 21, 29, 48, 66, 74] },
  ],
};

export const CHART_HEINZ: PitchChart = {
  type: "pie",
  title: "Heinz A.I. Ketchup — impression mix",
  caption: "Campaign case: 850M+ earned impressions. Mix is a model shape, not a media audit.",
  bars: [
    { label: "Earned / PR", value: 51, suffix: "%" },
    { label: "Social cutdowns", value: 29, suffix: "%" },
    { label: "Other", value: 20, suffix: "%" },
  ],
};

export const CHART_CAST_COST: PitchChart = {
  type: "pie",
  title: "Castlery — live shoot vs AI ad share",
  caption: "LBB: AI ad watch time above benchmarks. Pie is 71 live / 29 AI of a 100-index mix.",
  bars: [
    { label: "Live-action shoot", value: 71, suffix: "%" },
    { label: "AI-made ad", value: 29, suffix: "%" },
  ],
};

export const CHART_CAST_WATCH: PitchChart = {
  type: "bar",
  title: "Castlery watch time vs industry",
  caption: "LBB: watch time 23% above industry benchmarks.",
  bars: [
    { label: "Industry benchmark", value: 100, suffix: "" },
    { label: "Castlery AI ad", value: 123, suffix: "" },
  ],
};

export const CHART_PK_REACH: PitchChart = {
  type: "line",
  title: "Local recite posts — weekly views",
  caption: "Contrast only. Typical 1–2k band. Not a cited school dashboard.",
  xLabels: ["W1", "W2", "W3", "W4", "W5"],
  series: [{ name: "Organic recite", values: [1100, 1480, 980, 1720, 1340] }],
};

export const CHART_SLORSH_BUYERS: PitchChart = {
  type: "bar",
  kind: "model",
  title: "Buyers — campuses using Slorsh vs no stack",
  caption:
    "Model shape, not a Slorsh earnings report. +80% more buyers with the stack vs recite with no landing stack.",
  bars: [
    { label: "No Slorsh", value: 100, suffix: "" },
    { label: "Using Slorsh", value: 180, suffix: " (+80%)" },
  ],
};

export const CHART_SLORSH_INQ: PitchChart = {
  type: "line",
  kind: "model",
  title: "Weekly parent leads captured",
  caption:
    "Different series from the buyer bars: silent page vs chatbot + inbound/outbound over six weeks. Not CRM export.",
  xLabels: ["W1", "W2", "W3", "W4", "W5", "W6"],
  series: [
    { name: "Silent page", values: [7, 8, 6, 9, 8, 10] },
    { name: "Slorsh bot + calls", values: [9, 13, 17, 21, 25, 31] },
  ],
};

export const CHART_META_GEO: PitchChart = {
  type: "pie",
  title: "Meta — where parent spend goes",
  caption: "Ali ops mix. Not a Meta Ads Manager screenshot.",
  bars: [
    { label: "In-radius parents", value: 58, suffix: "%" },
    { label: "Lookalikes", value: 27, suffix: "%" },
    { label: "Site retarget", value: 15, suffix: "%" },
  ],
};

export const CHART_TT_TESTS: PitchChart = {
  type: "line",
  title: "TikTok — new angles tested per week",
  caption: "Ali ops series. Not a TikTok analytics CSV.",
  xLabels: ["W1", "W2", "W3", "W4", "W5"],
  series: [{ name: "Angles shipped", values: [3, 5, 4, 7, 6] }],
};

export const CHART_CUT_LEN: PitchChart = {
  type: "pie",
  title: "Cutdown mix from one campus brief",
  caption: "Ali pipeline mix. Not a Proof film.",
  bars: [
    { label: "6s", value: 42, suffix: "%" },
    { label: "15s", value: 35, suffix: "%" },
    { label: "30s", value: 23, suffix: "%" },
  ],
};

export const CHART_FALL: PitchChart = {
  type: "bar",
  title: "System vs recite — inquiry index",
  caption: "Fallback deck only. Different numbers from Slorsh +80%.",
  bars: [
    { label: "Recite-only", value: 64, suffix: "" },
    { label: "AI ads + stack", value: 151, suffix: "" },
  ],
};

const TRADITIONAL: PitchSlide = {
  title: "Human-edited recite-and-post is slow and small",
  subtitle: "No AI tools — film students, say lines, upload",
  accent: "warn",
  bullets: [
    "Time: a film day for one take. No A/B. The week is gone.",
    "Crew, location, and unused footage. Castlery’s published AI ad beat live-shoot watch time.",
    "Efficiency: one hook, aimed at people who already follow you — not parents choosing O-Level.",
    "Reach: typical organic recite lands around 1–2k views. Million-view AI films are a different sport.",
  ],
  charts: [CHART_TRAD_WEEK],
};

const OLEVEL: PitchSlide = {
  title: "What this means for a new O-Level campus",
  subtitle: "Faster · more accurate · more popular",
  bullets: [
    "Faster: generate AI hooks the same week as a student film day.",
    "Skip the crew day; Castlery documented stronger watch time than a live shoot.",
    "More accurate: Meta/TikTok aimed at parents in-radius.",
    "More popular: million-view AI films vs 1–2k typical recite posts.",
  ],
  charts: [CHART_EFF],
};

const WHY_ALI: PitchSlide = {
  title: "Why Ali — AI stack, solo, weekly",
  subtitle: "Not a recite-and-post camera",
  accent: "win",
  bullets: [
    "I brief, generate AI-assisted picture and voice/edit, cut for paid social, and run the ads.",
    "You get famous-method AI production plus parent targeting — not another unused talking-head.",
    "Work is reserved for my own edited AI film when it’s ready. Proof uses original-source AI ads and articles.",
  ],
};

const TUNG_SHORT = "https://www.youtube.com/watch?v=x0KQfpqpq3Y";
const TUNG_LONG = "https://www.youtube.com/watch?v=H79QCj-gPlc";
const FIC_CLIP = "https://www.youtube.com/watch?v=4ZtmP_QrErk";
const MOTO_CLIP = "https://www.youtube.com/watch?v=0uF69-ZyNYc";
const Q_MOBILE = "https://www.youtube.com/watch?v=XQ3X4CWStoM";

const EDUCATION_IDS = new Set([
  "hero",
  "ev-fazaia",
  "ev-ai-tunghai",
  "ev-ai-tunghai-long",
]);

function educationCompareSlide(leftVideo: string): PitchSlide {
  return {
    title: "Two education systems",
    subtitle:
      "Left: Tunghai University — official AI campus film. Right: FIC (Fazaia Inter College E-9) — human admissions clip.",
    accent: "win",
    bullets: [
      "Same job: get students. Tunghai shipped an AI university film. FIC posted a human admissions clip.",
      "Tunghai long film ~2.9M views on ~1.6k subs. FIC ~326 views, no original brand website, no authentic social home.",
    ],
    videoUrl: leftVideo,
    contrastVideoUrl: FIC_CLIP,
    videoSourceLabel: "Tunghai University official YouTube",
    contrastVideoSourceLabel: "Fazaia Inter College E-9 Islamabad YouTube",
    compareAiLabel: "Tunghai University · AI",
    compareHumanLabel: "FIC · human admissions",
  };
}

function phoneCompareSlide(leftVideo: string): PitchSlide {
  return {
    title: "Two phone brands",
    subtitle:
      "Left: Motorola — AI film, no camera, no crew. Right: Q Mobile — traditional live-action ad.",
    accent: "win",
    bullets: [
      "Same category: phones. Motorola generated the commercial. Q Mobile shot a conventional TV-style ad.",
      "Motorola skipped the crew. That is faster to make than a live shoot — Ali’s method, not a numbers list.",
    ],
    videoUrl: leftVideo,
    contrastVideoUrl: Q_MOBILE,
    videoSourceLabel: "Motorola official YouTube",
    contrastVideoSourceLabel: "Q Mobile official YouTube",
    compareAiLabel: "Motorola · AI, no crew",
    compareHumanLabel: "Q Mobile · live ad",
  };
}

const VIDEO_SOURCES: Record<string, string> = {
  hero: "Tunghai University official YouTube",
  "ev-ai-sora": "OpenAI official YouTube",
  "ev-ai-coke": "Coca-Cola official YouTube",
  "ev-ai-moto": "Motorola official YouTube",
  "ev-qmobile": "Q Mobile official YouTube",
  "ev-ai-tunghai": "Tunghai University official YouTube",
  "ev-ai-tunghai-long": "Tunghai University official YouTube",
  "ev-fazaia": "Fazaia Inter College E-9 Islamabad YouTube",
  "why-musk": "The Economist — official interview",
  "why-zuck": "Joe Rogan Experience #2255 — official",
  "why-jassy": "CNBC Mad Money — Jassy on camera",
  "why-gates": "The Tonight Show Starring Jimmy Fallon — official NBC",
  "why-amodei": "CNN — Anderson Cooper, Amodei on camera",
  "why-hastings": "Semafor — The CEO Signal, Hastings speaking",
};

function deck(
  id: string,
  title: string,
  hook: PitchSlide,
  proofs: PitchSlide,
  extra?: PitchSlide[],
  videoUrl?: string,
): PitchDeck {
  const slides: PitchSlide[] = [
    {
      ...hook,
      videoUrl: hook.videoUrl ?? videoUrl,
      videoSourceLabel:
        hook.videoSourceLabel ??
        (hook.videoUrl || videoUrl ? VIDEO_SOURCES[id] : undefined),
    },
    proofs,
  ];
  const alreadyCompare = [hook, proofs, ...(extra ?? [])].some(
    (slide) => slide.compareHumanLabel,
  );
  if (!alreadyCompare) {
    if (EDUCATION_IDS.has(id)) {
      slides.push(
        educationCompareSlide(id === "ev-fazaia" ? TUNG_LONG : videoUrl ?? TUNG_LONG),
      );
    } else if (id === "ev-ai-moto" || id === "ev-qmobile") {
      slides.push(
        phoneCompareSlide(id === "ev-qmobile" ? MOTO_CLIP : videoUrl ?? MOTO_CLIP),
      );
    }
  }
  if (extra?.length) slides.push(...extra);
  if (id === "hero") {
    slides.push(TRADITIONAL, OLEVEL, WHY_ALI);
  }
  return { id, title, slides };
}

function withContrast(deckIn: PitchDeck, contrastVideoUrl?: string): PitchDeck {
  if (!contrastVideoUrl) return deckIn;
  return {
    ...deckIn,
    slides: deckIn.slides.map((slide) =>
      slide.compareHumanLabel
        ? { ...slide, contrastVideoUrl }
        : slide,
    ),
  };
}

const DECKS: Record<string, PitchDeck> = {
  hero: deck(
    "hero",
    "Ali — AI ads for a new O-Level campus",
    {
      title: "Don’t hire a recite-and-post camera. Hire growth.",
      subtitle: "Solo creative + Meta/TikTok aimed at parents",
      accent: "win",
      bullets: [
        "A new O-Level campus grows when AI-made ads reach parents who are choosing — not when students recite lines on a timeline.",
        "Universities already ship AI films. Schools will follow. Tunghai long AI ~2.9M views on ~1.6k subs in ~5 months vs Fazaia human admissions ~326 views.",
        "FIC has no original website and no authentic social page. Parents who search don’t find a real campus. Ads still need a landing page.",
        "I generate, cut, and run Meta/TikTok myself. One seat.",
      ],
      chart: CHART_TIME,
    },
    {
      title: "What you get from this briefing",
      bullets: [
        "Official AI films on their own cards. Education compare is Tunghai vs FIC only.",
        "Phone compare is Motorola vs Q Mobile only.",
        "Work decks for how Ali would run parent ads — no third-party demo URLs.",
      ],
    },
    [
      {
        title: "Ali campus model after the real clips",
        subtitle: "Graph, not a published ranking",
        accent: "win",
        bullets: [
          "Real: YouTube counts on the Tunghai long-film card. Invented: inquiry mix for an O-Level campus.",
          "Popularity line lives on the long Tunghai card so the numbers are not repeated here.",
        ],
        charts: [CHART_CPL],
      },
      {
        title: "A webpage is the home. Ads need a URL.",
        subtitle: "How a campus page helps — necessary, not optional",
        accent: "win",
        bullets: [
          "Parents search the campus name on the phone. No original page = not trusted, not original.",
          "The site holds story, photos, O/A offer, apply path. Posts die; the page stays. YouTube-only is not a conversion page.",
          "Pattern: Ali sends paid parents to a stack like Slorsh (site, bot, calls). He uses that product. He does not own it.",
        ],
      },
      {
        title: "AI builds the site faster",
        subtitle: "Ali’s method — not a published web study",
        accent: "win",
        bullets: [
          "Agency site: weeks of copy rounds. Ali + AI: brief, generate layout and copy, ship in days — same week as the ads.",
          "Faster than a long web project.",
        ],
      },
      {
        title: "Put a chatbot on that page",
        subtitle: "Night questions, captured leads",
        accent: "win",
        bullets: [
          "Parents ask admissions, O vs A, location, after hours. A silent page loses them.",
          "The bot answers instantly and captures the lead. Ali still runs the ads. Faster than a call-back. Faster than staffing every first question.",
        ],
      },
    ],
    TUNG_LONG,
  ),
  "ev-ai-sora": deck(
    "ev-ai-sora",
    "OpenAI — official Sora reel",
    {
      title: "The original-source AI film with millions of views",
      subtitle: "OpenAI channel — every clip generated by Sora",
      accent: "win",
      bullets: [
        "Official reel: ~4.2 million YouTube views. Every frame generated. No live shoot.",
        "OpenAI’s own channel — this card is Sora only.",
      ],
      charts: [CHART_SORA_MIX],
    },
    {
      title: "What to say in the room",
      bullets: [
        "Play 0:09–0:22, then the astronaut beat.",
        "Cite openai.com/sora. Do not mix this reel with Coca-Cola or a school clip.",
      ],
    },
    undefined,
    "https://www.youtube.com/watch?v=HK6y8DAPN_0",
  ),
  "ev-ai-coke": deck(
    "ev-ai-coke",
    "Coca-Cola — AI Holidays Are Coming",
    {
      title: "A global brand shipped an AI holiday film",
      subtitle: "Official Coca-Cola YouTube — millions of views",
      accent: "win",
      bullets: [
        "Nov 2025 official spot (~2.8M on YouTube). Not the 1995 live-action truck ad.",
        "This card is Coca-Cola only — not a school, not Motorola.",
      ],
      charts: [CHART_COKE_SPLIT],
    },
    {
      title: "What to say in the room",
      bullets: [
        "Play the official 60 seconds. Marketing Dive is the article.",
        "Do not put FIC or another brand on this slide.",
      ],
    },
    undefined,
    "https://www.youtube.com/watch?v=Yy6fByUmPuE",
  ),
  "ev-ai-toys": deck(
    "ev-ai-toys",
    "Toys“R”Us — first Sora brand film",
    {
      title: "Historic first — not the view-count card",
      subtitle: "CNN + Cannes. Teaser ~292k — do not call it popular.",
      accent: "win",
      bullets: [
        "First brand film made with Sora. CNN is the source.",
        "Teaser ~292k — do not call it popular. This card is Toys“R”Us only.",
      ],
      charts: [CHART_TOYS_ROLE],
    },
    {
      title: "What to say in the room",
      bullets: [
        "Open CNN. Stay on this article. Do not play Sora or Coke on this card.",
        "Never claim the Toys“R”Us teaser has 10 million views.",
      ],
    },
  ),
  "ev-ai-moto": deck(
    "ev-ai-moto",
    "Motorola — no camera, no crew",
    {
      title: "A global brand generated the commercial",
      subtitle: "Official Motorola AI films",
      accent: "win",
      bullets: [
        "No actors on a set. Frames generated. Still a real product campaign.",
        "Compare with Q Mobile’s live phone ad — camera and crew vs no crew.",
      ],
      charts: [CHART_PHONE],
    },
    {
      title: "What to say in the room",
      bullets: [
        "If Motorola can skip the crew, a campus can skip the recite day.",
        "Play Motorola 0:00–0:20. Then Q Mobile’s live ad on the right.",
      ],
    },
    undefined,
    MOTO_CLIP,
  ),
  "ev-qmobile": deck(
    "ev-qmobile",
    "Q Mobile — live phone ad",
    {
      title: "Traditional phone commercial",
      subtitle: "Official Q Mobile — New Age. New Conversations",
      accent: "warn",
      bullets: [
        "Live-action ad: camera, talent, crew. The old way to sell a handset.",
        "Put Motorola on the left: no camera, no crew, still a real brand film.",
      ],
      charts: [CHART_Q_MIX],
    },
    {
      title: "What to say in the room",
      bullets: [
        "Same category. Two methods. Motorola is the AI side.",
        "Play Q Mobile, then Motorola. Faster to generate than to shoot.",
      ],
    },
    undefined,
    "https://www.youtube.com/watch?v=XQ3X4CWStoM",
  ),
  "ev-ai-tunghai": deck(
    "ev-ai-tunghai",
    "Tunghai University — official AI film",
    {
      title: "A university published AI-made video",
      subtitle: "Original education source",
      accent: "win",
      bullets: [
        "Tunghai’s own news: 100% AI institutional film (short cutdown on this card).",
        "Universities already ship AI video. Schools will follow. Pair with Fazaia’s human admissions clip (~326 views) and the long film card (~2.9M).",
      ],
      charts: [CHART_UNI_AI],
    },
    {
      title: "What to say in the room",
      bullets: [
        "University original — not a random AI meme. Cite the university news page.",
        "Short version 0:00–0:15. For 2.9M views, open the long-film card — not this cutdown.",
      ],
    },
    undefined,
    TUNG_SHORT,
  ),
  "ev-ai-tunghai-long": deck(
    "ev-ai-tunghai-long",
    "Tunghai — official long AI film (~2.9M)",
    {
      title: "Same university. The long film is the view-count card.",
      subtitle: "~2.98M views · ~1.6k subs · ~5 months · THUVideo",
      accent: "win",
      videoUrl: "https://www.youtube.com/watch?v=H79QCj-gPlc",
      videoSourceLabel: "Tunghai University official YouTube",
      bullets: [
        "Official complete version. Universities already use AI. Schools will follow.",
        "Two education systems: Tunghai AI film vs FIC human admissions (~326 views, no original website).",
      ],
      charts: [CHART_TUNG_VIEWS],
    },
    {
      title: "Ali campus model — not a published ranking",
      bullets: [
        "Invented graph: popularity and campus income index after the long AI film. Model shape, not a ranking PDF.",
        "Cite YouTube for views (~2.9M vs Fazaia ~326). Do not cite QS or THE for this lift.",
      ],
      charts: [CHART_TUNG_LIFT],
    },
    undefined,
    "https://www.youtube.com/watch?v=H79QCj-gPlc",
  ),
  "ev-fazaia": deck(
    "ev-fazaia",
    "Fazaia E-9 — human admissions clip",
    {
      title: "Human recite-and-post, named school",
      subtitle: "Fazaia Inter College E-9 Islamabad · ~326 views",
      accent: "warn",
      bullets: [
        "Official college channel. IGCSE / Pre-O / O-I admissions. Not a paid ad.",
        "No original brand website and no authentic social home. A ~326-view clip is not a school online.",
        "Put next to Tunghai’s long AI film (~2.9M). Same job: get students.",
      ],
      charts: [CHART_FIC_STACK],
    },
    {
      title: "What to say",
      bullets: [
        "This is what a campus posts when it films the message. Slow reach.",
        "Parents who search FIC don’t find an original site. Ads still need a landing page and a chatbot.",
      ],
    },
    undefined,
    FIC_CLIP,
  ),
  "ev-ai-dumpling": deck(
    "ev-ai-dumpling",
    "Squishy dumplings — AI clips, kids demand",
    {
      title: "Product demand jumped after AI clips",
      subtitle: "Daily Northern / SVT — article only",
      accent: "win",
      bullets: [
        "AI-generated ads flooded social. Search and toy-store demand for squishy dumplings jumped.",
        "No new YouTube on this card. Cite the article.",
      ],
      charts: [CHART_DUMPLING],
    },
    {
      title: "What to say",
      bullets: [
        "AI video moved children/product demand — not a talking-head school film.",
        "Then: a campus can move parents the same way.",
      ],
    },
  ),
  "ev-ai-heinz": deck(
    "ev-ai-heinz",
    "Heinz A.I. Ketchup — 850M+ impressions",
    {
      title: "AI creative, published impression count",
      subtitle: "Ads of the World / campaign case — article only",
      accent: "win",
      bullets: [
        "Heinz A.I. Ketchup: 850M+ earned impressions. AI-made images, not a student recite.",
        "No new YouTube embed on this card.",
      ],
      charts: [CHART_HEINZ],
    },
    {
      title: "What to say",
      bullets: [
        "Open the article. Quote 850M impressions.",
        "That is popularity at brand scale. Recite-and-post is not.",
      ],
    },
  ),
  "ev-slorsh": deck(
    "ev-slorsh",
    "Hidden gem — Slorsh",
    {
      title: "All-in-one stack Ali uses after the ad",
      subtitle: "Hidden gem — Slorsh. Ali is a user, not the owner.",
      accent: "win",
      bullets: [
        "Site, chatbot, inbound and outbound parent calls — one place parents land.",
        "Ali runs the ads. Slorsh is the product he points those ads at. Same as any campus that buys the stack.",
        "Open the live demo on click.",
      ],
    },
    {
      title: "Shape: +80% more buyers with the stack",
      subtitle: "Graph, not a published Slorsh study",
      accent: "win",
      bullets: [
        "Campuses using Slorsh vs no stack: buyers index 180 vs 100 — eighty percent more in this model.",
        "Weekly leads on the line chart are a different series — not the same 100 vs 180 bars.",
      ],
      charts: [CHART_SLORSH_BUYERS, CHART_SLORSH_INQ],
    },
  ),
  "ev-ai-castlery": deck(
    "ev-ai-castlery",
    "Castlery — AI ad that beat watch time",
    {
      title: "Published numbers: stronger watch time",
      subtitle: "LBB — Castlery ‘Comfurtable’ x Google Veo",
      accent: "win",
      bullets: [
        "Skip the live-action crew day.",
        "Watch time 23% above industry benchmarks — more watched creative.",
      ],
      charts: [CHART_CAST_COST, CHART_CAST_WATCH],
    },
    {
      title: "What to say in the room",
      bullets: [
        "Open the LBB article. Quote +23% watch time.",
        "Human crew day is the slow default.",
      ],
    },
  ),
  "ev-pk-school": deck(
    "ev-pk-school",
    "Local school — recite lines and post",
    {
      title: "The 1–2k human default",
      subtitle: "Contrast only — not a cited source",
      accent: "warn",
      bullets: [
        "Film students, say lines, upload. Slow, one take.",
        "Typical reach is 1–2k. Do not present this as a published authority.",
      ],
      charts: [CHART_PK_REACH],
    },
    {
      title: "Upgrade path without a Hollywood crew",
      bullets: [
        "Keep campus faces — cut for hooks and parent ads.",
        "Million-view AI method + in-radius targeting is the hire.",
      ],
    },
  ),
  "why-musk": deck(
    "why-musk",
    "Elon Musk — original interview",
    {
      title: "AI is already better at the digital job",
      subtitle: "The Economist — official interview",
      accent: "win",
      bullets: [
        "There is nothing AI cannot do better than humans, except be human.",
        "Digital jobs, including software, are already work AI does better than most engineers.",
        "Campus line: site, chatbot, ads, and inbox do not need a human staff team.",
      ],
    },
    {
      title: "What to say",
      bullets: [
        "Play the original timestamps. This is Musk on camera, not a recap.",
        "1:30–1:47 and 29:25–30:08.",
      ],
    },
    undefined,
    "https://www.youtube.com/watch?v=XuoqKYxDHVc&t=90",
  ),
  "why-zuck": deck(
    "why-zuck",
    "Mark Zuckerberg — original interview",
    {
      title: "The engineering seat is already an AI seat",
      subtitle: "Joe Rogan Experience #2255 — official",
      accent: "win",
      bullets: [
        "A mid-level engineer is an AI engineer.",
        "New applications are built by AI engineers, not by people in those seats.",
        "Campus line: site, chatbot, ads, and inbox do not need a human staff team.",
      ],
    },
    {
      title: "What to say",
      bullets: ["Play 2:08:00–2:08:58 on the official JRE cut."],
    },
    undefined,
    "https://www.youtube.com/watch?v=7k1ehaE0bdU&t=7680",
  ),
  "why-jassy": deck(
    "why-jassy",
    "Andy Jassy — original interview",
    {
      title: "Agents do the job. Fewer people on that job.",
      subtitle: "CNBC Mad Money — Jassy on camera",
      accent: "win",
      bullets: [
        "Agents already handle coding, research, and analytics.",
        "Those jobs need fewer people because the agent is doing the work.",
        "Campus line: site, chatbot, ads, and inbox do not need a human staff team.",
      ],
    },
    {
      title: "What to say",
      bullets: ["Play 8:00–10:45 on the CNBC cut."],
    },
    undefined,
    "https://www.youtube.com/watch?v=X1jpPk8hMVc&t=480",
  ),
  "why-gates": deck(
    "why-gates",
    "Bill Gates — original interview",
    {
      title: "Humans are not needed for most things",
      subtitle: "The Tonight Show Starring Jimmy Fallon — official NBC",
      accent: "win",
      bullets: [
        "Asked if we still need humans: not for most things.",
        "Expert help becomes ordinary. Making, moving, and growing food become solved problems.",
        "Campus line: site, chatbot, ads, and inbox do not need a human staff team.",
      ],
    },
    {
      title: "What to say",
      bullets: ["Play 7:00–8:45 on the official NBC cut."],
    },
    undefined,
    "https://www.youtube.com/watch?v=uHY5i9-0tJM&t=420",
  ),
  "why-amodei": deck(
    "why-amodei",
    "Dario Amodei — original interview",
    {
      title: "Entry-level digital work is already the model’s job",
      subtitle: "CNN — Anderson Cooper, Amodei on camera",
      accent: "win",
      bullets: [
        "Models already sit in the middle of entry-level office work — the college-student layer that writes reports and code.",
        "Half of those jobs can go. Machines can do pretty much everything better.",
        "Campus line: site, chatbot, ads, and inbox do not need a human staff team.",
      ],
    },
    {
      title: "What to say",
      bullets: ["Play 0:36–1:58, 4:39–5:52, and 6:03–6:16. Source is Amodei on camera."],
    },
    undefined,
    "https://www.youtube.com/watch?v=zju51INmW7U&t=36",
  ),
  "why-hastings": deck(
    "why-hastings",
    "Reed Hastings — original recording",
    {
      title: "Same business with half the humans",
      subtitle: "Semafor — The CEO Signal, Hastings speaking",
      accent: "win",
      bullets: [
        "AI getting twice as good each year is like doubling the workforce.",
        "A CEO can cut the workforce in half and still run the same business lines.",
        "Campus line: site, chatbot, ads, and inbox do not need a human staff team.",
      ],
      videoUrl:
        "https://share.snipd.com/episode/44100913-1e27-4568-9d61-d1375d5e9763",
      videoSourceLabel: "Semafor — The CEO Signal, Hastings speaking",
    },
    {
      title: "What to say",
      bullets: ["Open the original recording at 30:44–36:30. Do not use a recap."],
    },
  ),
  "why-saas": deck(
    "why-saas",
    "Campus stack without a staff team",
    {
      title: "The same idea on a campus",
      subtitle: "Ali’s implementation — not a third-party clip",
      accent: "win",
      bullets: [
        "Site, chatbot, ads, and inbox run as an AI stack.",
        "Those jobs do not need a human team on payroll.",
      ],
    },
    {
      title: "What to remember",
      bullets: ["This card is Ali’s method. The speaker cards above are the original clips."],
    },
  ),
  "stack-vercel-supabase": deck(
    "stack-vercel-supabase",
    "Vercel + Supabase, not Electrode.io",
    {
      title: "Big names already sit on this stack",
      subtitle: "Named public stories — not a market-share study",
      accent: "win",
      bullets: [
        "Vercel case studies name The Washington Post, eBay, Sonos, Box, Runway, HashiCorp.",
        "Supabase customer lists name Mozilla, GitHub, 1Password, Pika.",
        "Electrode.io is Walmart’s open-source React/Node kit. Walmart built it for Walmart. You still run the servers and the database.",
        "A campus site needs a host and a database. Vercel + Supabase is that pair. Electrode is not a host.",
      ],
      charts: [CHART_HOST_LOGOS, CHART_HOST_OPS],
    },
    {
      title: "What to say",
      bullets: [
        "Point at named logos on vercel.com and supabase.com. Do not invent a Fortune 500 percentage.",
        "Electrode is a DIY platform. Vercel ships the site. Supabase holds the data.",
      ],
    },
  ),
  "why-vercel-supabase": deck(
    "why-vercel-supabase",
    "Vercel + Supabase over Electrode.io",
    {
      title: "Same stack the big sites already use",
      subtitle: "Host + database, not a Walmart scaffold",
      accent: "win",
      bullets: [
        "Washington Post ran election night pages on Vercel. That is a named Vercel story.",
        "Mozilla and GitHub show up on Supabase’s public customer list.",
        "Electrode.io does not replace that. It is a React/Node toolkit. You still operate the farm.",
      ],
      charts: [CHART_HOST_LOGOS, CHART_HOST_OPS],
    },
    {
      title: "What to remember",
      bullets: [
        "Logos are from vendor sites. The bar chart is a count of those names, not market share.",
      ],
    },
  ),
  "proj-meta": deck(
    "proj-meta",
    "Meta — parents in-radius",
    {
      title: "The Meta seat you are hiring",
      subtitle: "Paid social on Meta",
      accent: "win",
      bullets: [
        "Offer, 15s cuts, parents near the campus, daily creative swaps.",
        "One seat: Ali runs the ads himself.",
      ],
      charts: [CHART_META_GEO],
    },
    {
      title: "What to say",
      bullets: [
        "Proof is other people’s ads. This is the buy Ali runs.",
        "Film slot stays empty until Ali’s cut is uploaded.",
      ],
    },
  ),
  "proj-tiktok": deck(
    "proj-tiktok",
    "TikTok — weekly parent tests",
    {
      title: "Test on TikTok. Same operator.",
      subtitle: "Weekly tests, same operator",
      accent: "win",
      bullets: [
        "New angles weekly. Kill losers. Scale winners.",
        "Ali runs the cuts and the ads.",
      ],
      charts: [CHART_TT_TESTS],
    },
    {
      title: "What to say",
      bullets: [
        "Creative and ads are one seat.",
        "Upload native tests here when they exist.",
      ],
    },
  ),
  "proj-cutdown": deck(
    "proj-cutdown",
    "Cutdowns for paid social",
    {
      title: "One brief → paid lengths",
      subtitle: "Paid lengths from one campus brief",
      accent: "win",
      bullets: [
        "6s / 15s / 30s with AI assist, built for the ad account.",
        "Same idea, many placements — Ali cuts and ships.",
      ],
      charts: [CHART_CUT_LEN],
    },
    {
      title: "What to say",
      bullets: [
        "This is how Ali packages the campus idea for paid.",
        "Proof stays in Proof.",
      ],
    },
  ),
};

const FALLBACK: PitchDeck = deck(
  "fallback",
  "School growth pitch",
  {
    title: "Modern school growth is a media system",
    bullets: [
      "Human recite without tools is slow, expensive, and inefficient.",
      "AI ads plus parent targeting is the hire.",
    ],
    charts: [CHART_FALL],
  },
  {
    title: "What to remember",
    bullets: [
      "Million-view official AI films vs 1–2k typical human posts.",
      "Cite articles for performance. Do not invent campus metrics.",
    ],
  },
);

export function getEvidencePitch(
  id?: string,
  contrastVideoUrl?: string,
  options?: { cues?: boolean },
): PitchDeck {
  const contrast = EDUCATION_IDS.has(id ?? "")
    ? contrastVideoUrl || FIC_CLIP
    : id === "ev-ai-moto" || id === "ev-qmobile"
      ? contrastVideoUrl || Q_MOBILE
      : undefined;
  const base = id && DECKS[id] ? DECKS[id] : FALLBACK;
  const withClips = withContrast(base, contrast);
  const seenTitles = new Set<string>();
  const unique = withClips.slides.filter((slide) => {
    const key = slide.title.trim().toLowerCase().replace(/\s+/g, " ");
    const stem = key.replace(/\s+[—-].*$/, "");
    if (seenTitles.has(key) || seenTitles.has(stem)) return false;
    seenTitles.add(key);
    seenTitles.add(stem);
    return true;
  });
  const seenCharts = new Set<string>();
  const slidesDeduped = unique.map((slide) => {
    const list = [
      ...(slide.chart ? [slide.chart] : []),
      ...(slide.charts ?? []),
    ].filter((chart) => {
      const fp = JSON.stringify({
        t: chart.title,
        b: chart.bars,
        s: chart.series,
        x: chart.xLabels,
      });
      if (seenCharts.has(fp) || seenCharts.has(chart.title)) return false;
      seenCharts.add(fp);
      seenCharts.add(chart.title);
      return true;
    });
    const next = { ...slide };
    delete next.chart;
    delete next.charts;
    if (list.length === 1) next.chart = list[0];
    else if (list.length > 1) next.charts = list;
    return next;
  });
  const slides = options?.cues
    ? slidesDeduped
    : slidesDeduped.filter(
        (slide) => !/^what to (say|remember)/i.test(slide.title.trim()),
      );
  return { ...withClips, slides };
}
