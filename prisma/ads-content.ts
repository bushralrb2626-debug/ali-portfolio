import type { Prisma } from "@prisma/client";

/** Shared ads / O-Level campus pitch portfolio sections */
export const adsPortfolioSections: Prisma.SectionCreateManyInput[] = [
  {
    type: "hero",
    title: "made by Ali",
    subtitle: "O-Level campus growth · AI ads · solo",
    body: "A new O-Level campus grows when AI-made ads reach parents who are choosing — I generate, cut, and run Meta/TikTok myself. Faster than a student film day. More accurate than hoping the feed helps. Built to get seen. I also make the campus website, school social pages, and a chatbot — then promote them faster.",
    imageUrl: "/evidence/hero.png",
    items: "[]",
    sortOrder: 0,
    visible: true,
  },
  {
    type: "about",
    title: "Don’t hire a recite-and-post camera. Hire growth.",
    subtitle: "What a new O-Level campus is about to hire — vs what the world actually does",
    body: "",
    imageUrl: "",
    items: JSON.stringify([
      {
        id: "about-hire",
        title: "What they want to hire",
        description:
          "One person filming students saying scripted lines, then uploading those clips. FIC has no original brand website and no authentic social home — a YouTube clip is not a school online. Parents who search don’t find a real campus story, so it doesn’t look original.",
      },
      {
        id: "about-world",
        title: "What the world does",
        description:
          "Famous brands and a university already ship AI-made ads — faster than a film crew, built to get seen. Local schools still film students reciting lines.",
      },
      {
        id: "about-web",
        title: "Why a campus webpage is necessary",
        description:
          "Parents decide on the phone: they search the campus name. No original page means not trusted. A site is the home — story, photos, O/A offer, apply path. Social posts die; the page stays. Ads need a landing URL. YouTube-only is not a conversion page.",
      },
      {
        id: "about-ai-web",
        title: "AI builds the site faster",
        description:
          "A normal web project takes weeks of copy rounds. Ali’s method: brief, generate layout and copy with AI, ship in days — the same week as the ads. Faster than a long agency build. Ali’s method, not a published study.",
      },
      {
        id: "about-chat",
        title: "Why a chatbot on that page",
        description:
          "Parents ask the same things at night — admissions, O vs A, location. A page without a bot loses them. Ali sends that traffic into a stack he uses (chatbot plus inbound/outbound) and still runs the ads. Faster than waiting for a call back. The bot can book appointments and hand off to a human when needed.",
      },
      {
        id: "about-ali",
        title: "What I do instead",
        description:
          "AI hooks, AI-assisted voice/edit, paid Meta/TikTok, a parent-facing campus page, and a chatbot. Brief, generate, cut, and run — solo. No student film day as the whole strategy.",
      },
    ]),
    sortOrder: 1,
    visible: true,
  },
  {
    type: "stack",
    title: "Why the campus page and chatbot matter",
    subtitle: "Parents search on the phone. Ads need a URL. Night questions need a bot.",
    body: "A YouTube clip is not a conversion page. Ali’s AI site method is faster than a long agency build — never a fake list of numbers.",
    imageUrl: "",
    items: JSON.stringify([
      {
        id: "stack-search",
        title: "Parents search on the phone",
        description:
          "They type the campus name. No original page means not trusted and not original. FIC has no original site — that is the hole ads cannot paper over.",
      },
      {
        id: "stack-ads",
        title: "Ads need a landing URL",
        description:
          "Paid Meta and TikTok send parents somewhere. YouTube-only is not conversion. The campus page holds story, photos, O vs A, and the apply path after the clip ends.",
      },
      {
        id: "stack-bot",
        title: "Chatbot for night questions",
        description:
          "Admissions, O vs A, location — parents ask after hours. A silent page loses the lead. The bot answers, books appointments, contacts a human when needed, and captures contact while Ali still runs the ads.",
      },
      {
        id: "stack-method",
        title: "Ali’s AI site method",
        description:
          "Brief, generate layout and copy, ship in days — the same week as the ads. Faster than a long web project. Ali’s method, not a published study.",
      },
    ]),
    sortOrder: 2,
    visible: true,
  },
  {
    type: "evidence",
    title: "Proof from the field",
    subtitle:
      "Famous original AI ads and articles — faster, more accurate, more popular than human recite-and-post",
    body: "Every cited source is an AI-made ad or an article on why AI video outperforms a traditional shoot. One local human-edit slot is contrast only — not a cited authority.",
    imageUrl: "",
    items: JSON.stringify([
      {
        id: "ev-ai-sora",
        title: "OpenAI — official Sora reel (millions of views)",
        description:
          "Original OpenAI channel. Every clip generated by Sora with no live shoot. This is the high-view original-source AI film — not a 300k brand teaser.",
        url: "https://www.youtube.com/watch?v=HK6y8DAPN_0",
        articleUrl: "https://openai.com/sora",
        sourceLabel: "OpenAI official",
        imageUrl: "/evidence/ev-ai-sora.png",
        videoUrl: "https://www.youtube.com/watch?v=HK6y8DAPN_0",
        whyAdded:
          "Use when they ask if AI video is actually popular. Highest-view original AI film we cite (~4.2M official YouTube).",
        whyVideo:
          "OpenAI’s own Sora reel. Every clip generated. Play next to the 1–2k human panel so the view gap is visible in the room.",
        whyArticle:
          "openai.com/sora is the original-source page: the company states clips were generated with no live shoot.",
        pitchLine:
          "This is OpenAI’s own Sora reel — millions of views, every frame generated. That is popularity plus speed: no film day.",
        timeRange: "0:09–0:22 dancing kangaroo / snow dogs — then skip to 1:21 astronaut trailer look",
      },
      {
        id: "ev-ai-coke",
        title: "Coca-Cola — AI ‘Holidays Are Coming’ (official, millions of views)",
        description:
          "Official Coca-Cola channel, Nov 2025. AI-made holiday spot (Sora, Veo, Luma in the pipeline). YouTube is already in the millions; the brand says the AI remake was seen by billions on TV and global media. Do not use the 1995 live-action truck ad — that one is not AI.",
        url: "https://www.youtube.com/watch?v=Yy6fByUmPuE",
        articleUrl:
          "https://www.marketingdive.com/news/why-coca-cola-keeps-pushing-limits-generative-ai-despite-backlash/804739/",
        sourceLabel: "Coca-Cola official + Marketing Dive",
        imageUrl: "/evidence/ev-ai-coke.png",
        videoUrl: "https://www.youtube.com/watch?v=Yy6fByUmPuE",
        whyAdded:
          "Most famous AI brand ad with a real official YouTube count in the millions. ~10× the Toys“R”Us teaser.",
        whyVideo:
          "Official Coca-Cola Nov 2025 AI holiday spot (~2.8M). Not the 1995 live truck film. Pair with the 1–2k human contrast in the briefing.",
        whyArticle:
          "Marketing Dive explains why Coke kept shipping AI holidays and that consumer tests scored the work strongly — article, not a talking-head school film.",
        pitchLine:
          "This is Coca-Cola’s official AI holiday film. Millions on YouTube, billions in the campaign. Recite-and-post never gets that.",
        timeRange: "0:00–1:00 — full official spot; trucks and animals, not a student talking-head",
      },
      {
        id: "ev-ai-toys",
        title: "Toys“R”Us — first Sora brand film (article, not the view-count proof)",
        description:
          "CNN: first brand film made with OpenAI Sora, Cannes premiere. The official YouTube teaser is only hundreds of thousands of views — do not play it as “popular.” Use CNN + Cannes. Play Sora and Coca-Cola for reach.",
        url: "https://www.cnn.com/2024/06/25/tech/toys-r-us-sora-ai",
        articleUrl: "https://www.cnn.com/2024/06/25/tech/toys-r-us-sora-ai",
        sourceLabel: "CNN — Toys“R”Us x Sora",
        imageUrl: "/evidence/ev-ai-toys.png",
        videoUrl: "",
        whyAdded:
          "Historic first Sora brand film. Not a view-count card — the teaser is ~292k.",
        whyVideo:
          "None. Do not embed the official teaser as ‘popular.’ Play Sora or Coca-Cola for reach.",
        whyArticle:
          "CNN documents the Cannes premiere and that the film was made with Sora. That is the source.",
        pitchLine:
          "Toys“R”Us proved a brand can ship Sora. For views, go to OpenAI’s reel and Coca-Cola’s official holiday film.",
        timeRange: "No clip — quote CNN / Cannes, then play Sora or Coca-Cola",
      },
      {
        id: "ev-ai-moto",
        title: "Motorola — ads with no camera, actor, or film crew",
        description:
          "Official Motorola AI campaign films. Every frame generated — no location shoot. Famous consumer brand shipping AI-first ads.",
        url: "https://youtu.be/0uF69-ZyNYc",
        articleUrl:
          "https://www.gogi.in/motorola-just-made-two-ads-without-a-single-camera-actor-or-film-crew.html",
        sourceLabel: "Motorola official + coverage",
        imageUrl: "/evidence/ev-ai-moto.png",
        videoUrl: "https://youtu.be/0uF69-ZyNYc",
        whyAdded:
          "Shows a global brand skipping the crew. Contrast with hiring someone only to film students saying lines.",
        whyVideo:
          "Official Motorola AI campaign film — no camera, actor, or crew. Method proof, not a 10M-view claim.",
        whyArticle:
          "Coverage states the ads were made without a film crew. Use with the time/cost charts.",
        pitchLine:
          "Motorola built campaign films with no camera and no actors. Put it next to Q Mobile’s live ad — same category, two methods.",
        timeRange: "0:00–0:20 — product/world build; no live-action set",
      },
      {
        id: "ev-qmobile",
        title: "Q Mobile — traditional live phone ad",
        description:
          "Official Q Mobile channel: ‘New Age. New Conversations.’ A conventional live-action phone ad — camera, crew, shoot. Contrast with Motorola’s no-crew AI films. Not an education clip.",
        url: "https://www.youtube.com/watch?v=XQ3X4CWStoM",
        articleUrl: "",
        sourceLabel: "Q Mobile official",
        imageUrl: "/evidence/ev-qmobile.png",
        videoUrl: "https://www.youtube.com/watch?v=XQ3X4CWStoM",
        whyAdded:
          "Phone-brand contrast for Motorola. Do not replace Motorola’s film or article. Admin can hide.",
        whyVideo:
          "Official Q Mobile ad XQ3X4CWStoM. Live shoot vs Motorola generated ads.",
        whyArticle: "None — contrast clip, not a second Motorola source.",
        pitchLine:
          "Same job: sell a phone. Q Mobile shot it. Motorola generated it — no camera, no crew.",
        timeRange: "0:00–0:20 — traditional phone commercial",
      },
      {
        id: "ev-ai-tunghai",
        title: "Tunghai University — official AI institutional film",
        description:
          "University source: 100% AI-generated campus/brand film (Einstein + airship campaign). Education using AI video, not a student talking-head upload.",
        url: "https://www.youtube.com/watch?v=x0KQfpqpq3Y",
        articleUrl: "https://eng.thu.edu.tw/web/news/detail.php?id=495",
        sourceLabel: "Tunghai University official news + film",
        imageUrl: "/evidence/ev-ai-tunghai.png",
        videoUrl: "https://www.youtube.com/watch?v=x0KQfpqpq3Y",
        whyAdded:
          "Closest famous education original: a university published an AI film. Use when they say “schools don’t use AI video.” Pair with Fazaia human admissions (~326 views) and the long-film card for ~2.9M.",
        whyVideo:
          "Tunghai’s official AI institutional film — short cutdown. Education source, not a student recite upload. Do not quote 2.9M on this clip.",
        whyArticle:
          "University news page describes a 100% AI-generated campus/brand film. Cite that page. Keep this URL.",
        pitchLine:
          "This is a university’s own AI film. Education already ships AI-made video. Schools will follow. Fazaia’s human admissions clip is ~326 views; the long Tunghai film is the million-view card.",
        timeRange: "0:00–0:15 short version — campus/AI look, not a recite-to-camera",
      },
      {
        id: "ev-ai-castlery",
        title: "Castlery — 100% AI ad, stronger watch time",
        description:
          "Article: furniture brand’s ‘Comfurtable’ spot made with Google Veo and related tools. Watch time 23% above industry benchmarks — AI faster and more watched than a traditional crew.",
        url: "https://lbbonline.com/news/castlery-google-gen-ai",
        articleUrl: "https://lbbonline.com/news/castlery-google-gen-ai",
        sourceLabel: "LBB — Castlery x Google GenAI",
        imageUrl: "/evidence/ev-ai-castlery.png",
        videoUrl: "",
        whyAdded:
          "Article that quantifies why AI is better: watch time up vs a live crew. Use after the brand ads.",
        whyVideo:
          "None — no official brand YouTube was confirmed. Do not invent an embed.",
        whyArticle:
          "LBB: Castlery ‘Comfurtable’ with Veo. Reported +23% watch time vs benchmarks.",
        pitchLine:
          "Castlery’s AI ad beat watch-time benchmarks. That’s faster to ship and more popular creative.",
        timeRange: "No clip — quote +23% watch time from the article",
      },
      {
        id: "ev-pk-school",
        title: "Local Pakistan school — human recite-and-post",
        description:
          "Contrast only — not a cited source. Film students, say lines, upload. Slow, poorly targeted, rarely popular. Drop a clip in admin if you have one.",
        url: "",
        articleUrl: "",
        sourceLabel: "",
        imageUrl: "/evidence/ev-pk-school.png",
        videoUrl: "",
        whyAdded:
          "Human-edit contrast after famous AI ads. Not an authority. Typical 1–2k views.",
        whyVideo:
          "Drop a local recite clip here. It appears as the 1–2k panel beside million-view AI films. Until then the briefing uses the poster only.",
        whyArticle:
          "None — do not add a fake source link. This card is contrast, not a citation.",
        pitchLine:
          "This is the human-edited default. Those AI ads already outpace it on speed, targeting, and popularity.",
        timeRange: "Once uploaded: first 5–8s of the student line vs Coca-Cola 0:00–0:20",
      },
      {
        id: "ev-ai-tunghai-long",
        title: "Tunghai University — official long AI film (~2.9M views)",
        description:
          "Complete version of the 100% AI institutional film. ~2.98M YouTube views, THUVideo ~1.6k subscribers, about 5 months. Universities already use AI — schools will follow.",
        url: "https://www.youtube.com/watch?v=H79QCj-gPlc",
        articleUrl: "https://eng.thu.edu.tw/web/news/detail.php?id=495",
        sourceLabel: "Tunghai University official long film",
        imageUrl: "/evidence/ev-ai-tunghai-long.png",
        videoUrl: "https://www.youtube.com/watch?v=H79QCj-gPlc",
        whyAdded:
          "View-count card. Do not replace the short-film card. Use vs Fazaia ~326 views.",
        whyVideo:
          "Official long AI film H79QCj-gPlc. This is the ~2.9M clip. Short cutdown stays on ev-ai-tunghai.",
        whyArticle:
          "Same university news page as the short card (id=495). Do not replace that URL on the original card.",
        pitchLine:
          "Universities already ship AI films. This long version: ~2.9 million views on a ~1.6k-sub channel in about 5 months. Fazaia’s human admissions film is ~326 views.",
        timeRange: "0:00–0:30 — long institutional AI film",
      },
      {
        id: "ev-fazaia",
        title: "Fazaia E-9 — human IGCSE / Pre-O admissions clip",
        description:
          "Official Fazaia Inter College E-9 Islamabad channel. Human-made admissions film. ~326 YouTube views. No original brand website and no authentic social home — a clip is not a school online. Contrast only — empty article field.",
        url: "https://www.youtube.com/watch?v=4ZtmP_QrErk",
        articleUrl: "",
        sourceLabel: "Fazaia Inter College E-9 Islamabad",
        imageUrl: "/evidence/ev-fazaia.png",
        videoUrl: "https://www.youtube.com/watch?v=4ZtmP_QrErk",
        whyAdded:
          "Named human contrast plus FIC web/social pain. Admin can hide. Cue: ficed.pk is a thin page, not an original brand home — do not say zero URLs exist.",
        whyVideo:
          "IGCSE | Pre-O | O-I admissions. Recite-and-post style. ~326 views. Not a homepage.",
        whyArticle:
          "None on the card. Do not paste ficed.pk as if it were a brand site.",
        pitchLine:
          "Same job as Tunghai: get students. This human clip has ~326 views. FIC has no original website and no authentic social page — parents who search don’t find a real campus. Ads still need a landing page and a chatbot.",
        timeRange: "First 8s of the admissions message",
      },
      {
        id: "ev-ai-dumpling",
        title: "Squishy dumplings — AI ads, kids’ demand jumped",
        description:
          "Article: AI-generated clips flooded social; search and toy-store demand jumped. No YouTube on this card.",
        url: "https://www.dailynorthern.com/21130/ai-generated-ads-fuel-squishy-dumplings-craze-among-children/",
        articleUrl:
          "https://www.dailynorthern.com/21130/ai-generated-ads-fuel-squishy-dumplings-craze-among-children/",
        sourceLabel: "Daily Northern",
        imageUrl: "/evidence/ev-ai-dumpling.png",
        videoUrl: "",
        whyAdded: "Kids/product demand via AI video. Article only.",
        whyVideo: "None — do not add a YouTube.",
        whyArticle:
          "Daily Northern: AI ads fuelled the squishy dumplings craze among children.",
        pitchLine:
          "AI clips moved kids to want a toy. We can move parents to want a campus.",
        timeRange: "No clip — quote the article",
      },
      {
        id: "ev-ai-heinz",
        title: "Heinz A.I. Ketchup — 850M+ earned impressions",
        description:
          "Article-first: Heinz AI ketchup campaign reported 850 million+ earned impressions. No new YouTube embed.",
        url: "https://www.adsoftheworld.com/campaigns/a-i-ketchup",
        articleUrl: "https://www.adsoftheworld.com/campaigns/a-i-ketchup",
        sourceLabel: "Ads of the World — Heinz A.I. Ketchup",
        imageUrl: "/evidence/ev-ai-heinz.png",
        videoUrl: "",
        whyAdded: "Published impression number for AI creative. Article only.",
        whyVideo: "None — article first.",
        whyArticle:
          "Campaign case: 850M+ earned impressions globally for A.I. Ketchup.",
        pitchLine:
          "Heinz’s AI work got 850 million+ impressions. Recite-and-post does not.",
        timeRange: "No clip — quote 850M impressions",
      },
      {
        id: "ev-slorsh",
        title: "Hidden gem — Slorsh",
        description:
          "Hidden gem Ali uses after the ads: campus site, chatbot, inbound and outbound parent calls. Live demo on click. Ali is a user of Slorsh, not the owner.",
        url: "https://genine-1bc47.web.app/",
        articleUrl: "https://genine-1bc47.web.app/",
        sourceLabel: "Slorsh",
        imageUrl: "/evidence/ev-slorsh.png",
        videoUrl: "",
        whyAdded:
          "Last card. Ali uses Slorsh as a landing stack. Do not pitch him as the founder.",
        whyVideo: "None.",
        whyArticle: "Open the demo. User of the product — site, bot, inbound/outbound.",
        pitchLine:
          "Hidden gem — Slorsh. Ali sends parents there like any user: webpage, chatbot, inbound and outbound calls. The graph is +80% more buyers vs no stack — briefing shape, not a published report.",
        timeRange: "No clip — open the live demo",
      },
    ]),
    sortOrder: 3,
    visible: true,
  },
  {
    type: "projects",
    title: "What Ali actually runs",
    subtitle: "My ops — not the Proof films",
    body: "The seat you hire: Meta, TikTok, and paid cutdowns. Add Ali’s own film in admin when it’s ready.",
    imageUrl: "",
    items: JSON.stringify([
      {
        id: "proj-meta",
        title: "Meta — parents in-radius",
        description:
          "Offer framing, 15s cuts, parent audiences around the campus, daily creative swaps. Solo.",
        url: "",
        imageUrl: "/evidence/proj-meta.png",
        videoUrl: "",
        whyAdded: "Ali’s Meta ops card. Do not paste Proof sources here.",
        whyVideo: "Empty until Ali’s campaign cuts are uploaded.",
        whyArticle: "None.",
        pitchLine:
          "You hire the Meta seat: parents near the campus, not the follower list.",
        timeRange: "No clip yet",
      },
      {
        id: "proj-tiktok",
        title: "TikTok — weekly parent tests",
        description:
          "Native lengths, new angles each week, kill losers, scale winners. Ali runs creative and the ads.",
        url: "",
        imageUrl: "/evidence/proj-tiktok.png",
        videoUrl: "",
        whyAdded: "Ali’s TikTok ops. Keep Proof comparisons off this card.",
        whyVideo: "Empty until native tests are uploaded.",
        whyArticle: "None.",
        pitchLine: "Weekly tests. Same operator on edit and ads.",
        timeRange: "No clip yet",
      },
      {
        id: "proj-cutdown",
        title: "Cutdowns for paid social",
        description:
          "One campus idea into 6s / 15s / 30s with AI assist, built for the ad account.",
        url: "",
        imageUrl: "/evidence/proj-cutdown.png",
        videoUrl: "",
        whyAdded: "Ali’s cutdown pipeline. No Proof URLs.",
        whyVideo: "Empty until the system film is ready.",
        whyArticle: "None.",
        pitchLine: "Many paid lengths from one brief.",
        timeRange: "No clip yet",
      },
    ]),
    sortOrder: 4,
    visible: true,
  },
  {
    type: "briefing",
    title: "Why AI now",
    subtitle: "Original clips — the founders speaking, not recap videos",
    body: "AI already does the digital work. SaaS-style site, chatbot, ads, and inbox can run without a campus staff team.",
    imageUrl: "",
    items: JSON.stringify([
      {
        id: "why-musk",
        title: "Elon Musk",
        description:
          "Nothing AI cannot do better than humans except being human. Digital jobs AI does better. Software AI already beats most engineers.",
        url: "https://www.youtube.com/watch?v=XuoqKYxDHVc&t=90",
        videoUrl: "https://www.youtube.com/watch?v=XuoqKYxDHVc&t=90",
        sourceLabel: "The Economist — official interview",
        pitchLine: "Source: The Economist",
        timeRange: "1:30–1:47 · 29:25–30:08",
      },
      {
        id: "why-zuck",
        title: "Mark Zuckerberg",
        description:
          "Mid-level engineer AI. Apps built by AI engineers instead of people engineers.",
        url: "https://www.youtube.com/watch?v=7k1ehaE0bdU&t=7680",
        videoUrl: "https://www.youtube.com/watch?v=7k1ehaE0bdU&t=7680",
        sourceLabel: "JRE #2255 — official",
        pitchLine: "Source: JRE",
        timeRange: "2:08:00–2:08:58",
      },
      {
        id: "why-jassy",
        title: "Andy Jassy",
        description:
          "Agents already do coding, research, and analytics. Fewer people needed on those jobs.",
        url: "https://www.youtube.com/watch?v=X1jpPk8hMVc&t=480",
        videoUrl: "https://www.youtube.com/watch?v=X1jpPk8hMVc&t=480",
        sourceLabel: "CNBC / Mad Money — Jassy on camera",
        pitchLine: "Source: CNBC",
        timeRange: "8:00–10:45",
      },
      {
        id: "why-saas",
        title: "SaaS without a staff team",
        description:
          "AI agents sit on the same stack as SaaS — site, chatbot, ads, inbox — so the campus does not need a human team to run those jobs. No staff needed. No humans needed.",
        url: "",
        videoUrl: "",
        sourceLabel: "",
        pitchLine: "Ali’s line, not a journal",
        timeRange: "",
      },
    ]),
    sortOrder: 5,
    visible: true,
  },
  {
    type: "skills",
    title: "Stack",
    subtitle: "Tools I run alone for a new campus",
    body: "",
    imageUrl: "",
    items: JSON.stringify([
      { title: "AI Creative Tools" },
      { title: "CapCut / Premiere" },
      { title: "Meta Ads" },
      { title: "TikTok Ads" },
      { title: "Parent Hook Writing" },
      { title: "A/B Creatives" },
      { title: "Short-Form Edit" },
      { title: "Solo Campaign Ops" },
    ]),
    sortOrder: 6,
    visible: false,
  },
  {
    type: "contact",
    title: "Launch the O-Level campus the modern way",
    subtitle: "Contact",
    body: "Hiring someone to film students saying lines and post them? Talk to me about AI creatives and ads that reach parents instead.",
    imageUrl: "",
    items: JSON.stringify([
      { title: "Email", url: "mailto:alimasterofall105@gmail.com" },
    ]),
    sortOrder: 7,
    visible: true,
  },
];
