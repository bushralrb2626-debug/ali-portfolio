import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "public/demos/brightsteps");
const i18nPath = path.join(dir, "js/i18n.js");

function loadLookup() {
  const LOOKUP = Object.create(null);
  const norm = (s) =>
    String(s || "")
      .replace(/&#x2014;|&mdash;/gi, "—")
      .replace(/&#x2013;|&ndash;/gi, "–")
      .replace(/&#x27;|&apos;/gi, "'")
      .replace(/&amp;/g, "&")
      .replace(/&copy;/g, "©")
      .replace(/&#x2B;/g, "+")
      .replace(/&#x2026;/g, "…")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  const addRe =
    /add\(\s*"([^"]+)"\s*,\s*"((?:\\.|[^"\\])*)"\s*,\s*"((?:\\.|[^"\\])*)"(?:\s*,\s*\[([\s\S]*?)\])?/g;
  const src = fs.readFileSync(i18nPath, "utf8");
  let m;
  while ((m = addRe.exec(src))) {
    const key = m[1];
    LOOKUP[norm(JSON.parse(`"${m[2]}"`))] = key;
    LOOKUP[norm(JSON.parse(`"${m[3]}"`))] = key;
    if (m[4]) {
      const aliases = m[4].match(/"((?:\\.|[^"\\])*)"/g) || [];
      for (const a of aliases) LOOKUP[norm(JSON.parse(a))] = key;
    }
  }
  return { LOOKUP, norm };
}

const { LOOKUP, norm } = loadLookup();

const PUBLIC = new Set([
  "index.html",
  "about.html",
  "programs.html",
  "facilities.html",
  "teachers.html",
  "activities.html",
  "events.html",
  "gallery.html",
  "contact.html",
  "portal.html",
  "login.html",
]);

const TAGS = "p|h1|h2|h3|h4|h5|h6|span|small|a|button|label|strong|title|em|figcaption|li";

function decode(text) {
  return text
    .replace(/&#x2014;|&mdash;/gi, "—")
    .replace(/&#x2013;|&ndash;/gi, "–")
    .replace(/&#x27;|&apos;/gi, "'")
    .replace(/&amp;/g, "&")
    .replace(/&copy;/g, "©")
    .replace(/&#x2B;/g, "+")
    .replace(/&#x2026;/g, "…")
    .replace(/&quot;/g, '"');
}

function tagSimple(html) {
  const re = new RegExp(`<(${TAGS})(\\s[^>]*?)?>\\s*([^<]+?)\\s*<\\/\\1>`, "gi");
  return html.replace(re, (full, tag, attrs, inner) => {
    attrs = attrs || "";
    if (/data-i18n=/.test(attrs) || /data-no-translate/.test(attrs)) return full;
    const key = LOOKUP[norm(decode(inner))];
    if (!key) return full;
    return `<${tag}${attrs} data-i18n="${key}">${inner}</${tag}>`;
  });
}

function tagAttr(html, attr, dataAttr) {
  const re = new RegExp(`<(img|input|textarea|button|a|div|nav|header|label|form)\\b([^>]*?)\\s${attr}="([^"]+)"([^>]*)>`, "gi");
  return html.replace(re, (full, tag, pre, val, post) => {
    if (full.includes(`${dataAttr}=`)) return full;
    const key = LOOKUP[norm(decode(val))];
    if (!key) return full;
    return `<${tag}${pre} ${attr}="${val}" ${dataAttr}="${key}"${post}>`;
  });
}

const extra = [
  ['href="/demos/brightsteps/about.html">Chi siamo</a>', 'href="/demos/brightsteps/about.html" data-i18n="nav.about">Chi siamo</a>'],
  ['href="/demos/brightsteps/about.html">About</a>', 'href="/demos/brightsteps/about.html" data-i18n="nav.about">About</a>'],
  ['href="/demos/brightsteps/programs.html">Programmi</a>', 'href="/demos/brightsteps/programs.html" data-i18n="nav.programs">Programmi</a>'],
  ['href="/demos/brightsteps/programs.html">Programs</a>', 'href="/demos/brightsteps/programs.html" data-i18n="nav.programs">Programs</a>'],
  ['href="/demos/brightsteps/facilities.html">Strutture</a>', 'href="/demos/brightsteps/facilities.html" data-i18n="nav.facilities">Strutture</a>'],
  ['href="/demos/brightsteps/teachers.html">Insegnanti</a>', 'href="/demos/brightsteps/teachers.html" data-i18n="nav.teachers">Insegnanti</a>'],
  ['href="/demos/brightsteps/activities.html">Attività</a>', 'href="/demos/brightsteps/activities.html" data-i18n="nav.activities">Attività</a>'],
  ['href="/demos/brightsteps/events.html">Eventi</a>', 'href="/demos/brightsteps/events.html" data-i18n="nav.events">Eventi</a>'],
  ['href="/demos/brightsteps/gallery.html">Galleria</a>', 'href="/demos/brightsteps/gallery.html" data-i18n="nav.gallery">Galleria</a>'],
  ['href="/demos/brightsteps/contact.html">Contatti</a>', 'href="/demos/brightsteps/contact.html" data-i18n="nav.contact">Contatti</a>'],
  ['href="/demos/brightsteps/contact.html">Contact</a>', 'href="/demos/brightsteps/contact.html" data-i18n="nav.contact">Contact</a>'],
  ['href="/demos/brightsteps/index.html">Home</a>', 'href="/demos/brightsteps/index.html" data-i18n="nav.home">Home</a>'],
  ['>🔐 Accedi <span class="cta-arrow"', ' data-i18n="nav.loginCta">🔐 Accedi <span class="cta-arrow"'],
  ['>🔐 Login <span class="cta-arrow"', ' data-i18n="nav.loginCta">🔐 Login <span class="cta-arrow"'],
];

const headLink = '    <link rel="stylesheet" href="/demos/brightsteps/css/campus-bot.css" />\n';
const i18nScript = '    <script src="/demos/brightsteps/js/i18n.js"></script>\n';
const botScript = '    <script src="/demos/brightsteps/js/campus-bot.js"></script>\n';

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html"))) {
  const filePath = path.join(dir, file);
  let html = fs.readFileSync(filePath, "utf8");
  html = tagSimple(html);
  html = tagAttr(html, "placeholder", "data-i18n-placeholder");
  html = tagAttr(html, "aria-label", "data-i18n-aria");
  html = tagAttr(html, "alt", "data-i18n-alt");
  html = tagAttr(html, "title", "data-i18n-title");
  for (const [from, to] of extra) {
    if (html.includes(from) && !html.includes(to)) html = html.split(from).join(to);
  }

  if (file === "portal.html" || file === "login.html") {
    html = html.replace(/\sdata-no-translate/g, "");
  }

  if (PUBLIC.has(file)) {
    if (!html.includes("campus-bot.css") && html.includes("</head>")) {
      html = html.replace("</head>", `${headLink}</head>`);
    }
    if (!html.includes("js/i18n.js") && html.includes("</body>")) {
      html = html.replace("</body>", `${i18nScript}</body>`);
    }
    if (!html.includes("campus-bot.js") && html.includes("</body>")) {
      html = html.replace("</body>", `${botScript}</body>`);
    }
  }

  fs.writeFileSync(filePath, html);
  console.log("updated", file);
}
