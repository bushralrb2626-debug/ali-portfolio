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

export const CHART_TIME: PitchChart = {
  type: "bar",
  title: "Days to ship one parent hook",
  caption:
    "Briefing shape: film-day recite vs generate-and-cut the same week. Not a published campus study.",
  bars: [
    { label: "Human recite", value: 5, suffix: " days" },
    { label: "AI ads stack", value: 1, suffix: " day" },
  ],
};

export const CHART_TRAD_WEEK: PitchChart = {
  type: "pie",
  title: "Where a recite week actually goes",
  caption: "Briefing mix of one human film week. Not a timesheet study.",
  bars: [
    { label: "Shoot day", value: 46, suffix: "%" },
    { label: "Waiting / unused takes", value: 33, suffix: "%" },
    { label: "Upload to followers", value: 21, suffix: "%" },
  ],
};

export const CHART_EFF: PitchChart = {
  type: "line",
  title: "Hooks shipped across seven days",
  caption: "Human stays at one take. AI stack adds variants. Briefing series, not an A/B paper.",
  xLabels: ["D1", "D2", "D3", "D4", "D5", "D6", "D7"],
  series: [
    { name: "Human one-take", values: [1, 1, 1, 1, 1, 1, 1] },
    { name: "AI variants", values: [1, 2, 3, 5, 6, 7, 8] },
  ],
};

export const CHART_PHONE: PitchChart = {
  type: "bar",
  title: "Crew days to finish a phone commercial",
  caption: "Briefing comparison of methods. Not Motorola or Q Mobile published cost.",
  bars: [
    { label: "Q Mobile live crew", value: 9, suffix: " days" },
    { label: "Motorola generated", value: 2, suffix: " days" },
  ],
};

export const CHART_Q_MIX: PitchChart = {
  type: "pie",
  title: "Live phone ad — spend mix",
  caption: "Briefing pie of a traditional shoot. Not a Q Mobile budget leak.",
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
  title: "Five-month campus model after the long AI film",
  caption:
    "Invented monthly series. Not QS, THE, or an enrollment PDF. YouTube H79QCj-gPlc is the real film.",
  xLabels: ["M1", "M2", "M3", "M4", "M5"],
  series: [
    { name: "Popularity index", values: [100, 108, 118, 127, 135] },
    { name: "Students index", values: [100, 105, 114, 123, 132] },
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
  caption: "Briefing mix: universities vs local recite habit. Not a ranking table.",
  bars: [
    { label: "University AI film", value: 64, suffix: "%" },
    { label: "Local recite posts", value: 36, suffix: "%" },
  ],
};

export const CHART_SORA_MIX: PitchChart = {
  type: "pie",
  title: "Sora reel — clip mix in the official cut",
  caption: "Briefing share of the OpenAI reel. Not a shot list from OpenAI.",
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
  caption: "Briefing mix: no original site, thin social, YouTube-only clip.",
  bars: [
    { label: "No original website", value: 44, suffix: "%" },
    { label: "No authentic social home", value: 31, suffix: "%" },
    { label: "YouTube clip only", value: 25, suffix: "%" },
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
  caption: "Campaign case: 850M+ earned impressions. Mix is briefing shape, not a media audit.",
  bars: [
    { label: "Earned / PR", value: 51, suffix: "%" },
    { label: "Social cutdowns", value: 29, suffix: "%" },
    { label: "Other", value: 20, suffix: "%" },
  ],
};

export const CHART_CAST_COST: PitchChart = {
  type: "pie",
  title: "Castlery — live shoot vs AI ad cost share",
  caption: "LBB: AI ad ~60% cheaper. Pie is 71 live / 29 AI of a 100-index budget.",
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
    "Briefing graph, not a Slorsh earnings report. +80% more buyers with the stack vs recite with no landing stack.",
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
  title: "Human-edited recite-and-post is slow, expensive, and small",
  subtitle: "No AI tools — film students, say lines, upload",
  accent: "warn",
  bullets: [
    "Time: a film day for one take. No A/B. The week is gone.",
    "Cost: crew, location, and unused footage. Castlery’s published AI ad was ~60% cheaper than a live shoot.",
    "Efficiency: one hook, aimed at people who already follow you — not parents choosing O-Level.",
    "Reach: typical organic recite lands around 1–2k views. Million-view AI films are a different sport.",
  ],
  charts: [CHART_TRAD_WEEK],
};

const OLEVEL: PitchSlide = {
  title: "What this means for a new O-Level campus",
  subtitle: "Faster · cheaper · more accurate · more popular",
  bullets: [
    "Faster: generate AI hooks the same week as a student film day.",
    "Cheaper: skip the crew day; Castlery documented ~60% lower production cost.",
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

const TUNG_LONG = "https://www.youtube.com/watch?v=H79QCj-gPlc";
const FIC_CLIP = "https://www.youtube.com/watch?v=4ZtmP_QrErk";
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
      "Motorola skipped the crew. That is faster and cheaper to make than a live shoot — Ali’s method, not a price list.",
    ],
    videoUrl: leftVideo,
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
};

function deck(
  id: string,
  title: string,
  hook: PitchSlide,
  proofs: PitchSlide,
  extra?: PitchSlide[],
  videoUrl?: string,
): PitchDeck {
  const slides: PitchSlide[] = [hook, proofs];
  const alreadyCompare = [hook, proofs, ...(extra ?? [])].some(
    (slide) => slide.compareHumanLabel,
  );
  if (videoUrl && !alreadyCompare) {
    if (EDUCATION_IDS.has(id)) {
      slides.push(
        educationCompareSlide(id === "ev-fazaia" ? TUNG_LONG : videoUrl),
      );
    } else if (id === "ev-ai-moto" || id === "ev-qmobile") {
      slides.push(
        phoneCompareSlide(
          id === "ev-qmobile" ? "https://youtu.be/0uF69-ZyNYc" : videoUrl,
        ),
      );
    } else if (!hook.videoUrl) {
      slides[0] = {
        ...hook,
        videoUrl,
        videoSourceLabel: VIDEO_SOURCES[id] ?? hook.videoSourceLabel,
      };
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
        title: "AI builds the site faster — and cheaper",
        subtitle: "Ali’s method — not a published web-cost study",
        accent: "win",
        bullets: [
          "Agency site: weeks of copy rounds. Ali + AI: brief, generate layout and copy, ship in days — same week as the ads.",
          "Cheaper than a long web project.",
        ],
      },
      {
        title: "Put a chatbot on that page",
        subtitle: "Night questions, captured leads",
        accent: "win",
        bullets: [
          "Parents ask admissions, O vs A, location, after hours. A silent page loses them.",
          "The bot answers instantly and captures the lead. Ali still runs the ads. Faster than a call-back. Cheaper than staffing every first question.",
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
    "https://youtu.be/0uF69-ZyNYc",
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
        "Play Q Mobile, then Motorola. Faster and cheaper to generate than to shoot.",
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
    "https://www.youtube.com/watch?v=x0KQfpqpq3Y",
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
        "Invented graph: popularity / students / ranking +30–40% in 5 months after the AI film.",
        "Cite YouTube for views. Do not cite QS or THE for this lift.",
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
    TUNG_LONG,
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
        "Campuses using Slorsh vs no stack: buyers index 180 vs 100 — eighty percent more in this briefing graph.",
        "Weekly leads on the line chart are a different series — not the same 100 vs 180 bars.",
      ],
      charts: [CHART_SLORSH_BUYERS, CHART_SLORSH_INQ],
    },
  ),
  "ev-ai-castlery": deck(
    "ev-ai-castlery",
    "Castlery — AI ad that beat cost and watch time",
    {
      title: "Published numbers: cheaper and stronger watch time",
      subtitle: "LBB — Castlery ‘Comfurtable’ x Google Veo",
      accent: "win",
      bullets: [
        "Reported ~60% lower production cost vs a live-action shoot.",
        "Watch time 23% above industry benchmarks — more efficient creative, not just cheaper.",
      ],
      charts: [CHART_CAST_COST, CHART_CAST_WATCH],
    },
    {
      title: "What to say in the room",
      bullets: [
        "Open the LBB article. Quote 60% and +23%.",
        "Human crew day is the expensive, slow default.",
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
        "Film students, say lines, upload. Slow, costly, one take.",
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
      "Cite articles for cost/performance. Do not invent campus metrics.",
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
    : slidesDeduped.filter((slide) => !/^what to say/i.test(slide.title.trim()));
  return { ...withClips, slides };
}
