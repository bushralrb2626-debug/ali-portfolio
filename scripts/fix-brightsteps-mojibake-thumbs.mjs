import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const DEMO = path.join(ROOT, "public/demos/brightsteps");
const IMG = path.join(DEMO, "img");
const CLEAN_REV = "de754a6";

const htmlFiles = fs
  .readdirSync(DEMO)
  .filter((f) => f.endsWith(".html"));

function writeSafe(filePath, data) {
  let last;
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      fs.writeFileSync(filePath, data);
      return;
    } catch (err) {
      last = err;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150 * (attempt + 1));
    }
  }
  throw last;
}

function restoreCleanHtml() {
  for (const file of htmlFiles) {
    const blob = execSync(`git show ${CLEAN_REV}:public/demos/brightsteps/${file}`, {
      encoding: "buffer",
      maxBuffer: 20 * 1024 * 1024,
    });
    writeSafe(path.join(DEMO, file), blob);
    console.log("restored", file);
  }
}

function applyPhoneAndCache(html) {
  return html
    .replaceAll("+1 (555) 214-8800", "03066638854")
    .replaceAll("&#x2B;1 (555) 214-8800", "03066638854")
    .replace(/js\/campus-bot\.js(?:\?v=[^"]*)?/g, "js/campus-bot.js?v=21")
    .replace(/css\/campus-bot\.css(?:\?v=[^"]*)?/g, "css/campus-bot.css?v=21");
}

function collectUnsplash(html) {
  const urls = new Set();
  const re = /https:\/\/images\.unsplash\.com\/[^"'\\\s>]+/g;
  let m;
  while ((m = re.exec(html))) {
    urls.add(m[0].replace(/&amp;/g, "&"));
  }
  return urls;
}

function photoId(url) {
  const u = new URL(url);
  const parts = u.pathname.split("/").filter(Boolean);
  // /photo-xxx or /photo-xxx/extra
  const id = parts.find((p) => p.startsWith("photo-")) || parts[parts.length - 1];
  return id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) || "img";
}

const FALLBACK_EVIDENCE = [
  "public/evidence/ev-pk-school.jpg",
  "public/evidence/proj-campus.jpg",
  "public/evidence/proj-brightsteps.jpg",
  "public/evidence/hero.jpg",
  "public/evidence/ev-fazaia.jpg",
  "public/evidence/ev-cambridge.jpg",
];

const ALT_UNSPLASH = {
  "photo-1461896836934-ffe607ba6851":
    "https://images.unsplash.com/photo-1517649763962-0c623066027e?auto=format&fit=crop&w=1000&q=80",
  "photo-1464219789935-c2d9d9aba644":
    "https://images.unsplash.com/photo-1544620341-9bbdfe285ce7?auto=format&fit=crop&w=900&q=80",
  "photo-1557597774-9d273605dfa9":
    "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80",
};

async function fetchBuffer(url) {
  const tries = [
    url,
    url.replace(/[?].*$/, "") + "?auto=format&fit=crop&w=1000&q=80",
    url.replace("images.unsplash.com/", "images.unsplash.com/") ,
  ];
  const id = photoId(url);
  if (ALT_UNSPLASH[id]) tries.unshift(ALT_UNSPLASH[id]);

  for (const t of [...new Set(tries)]) {
    try {
      const res = await fetch(t, {
        headers: { "User-Agent": "ali-portfolio-demo-cache/1.0" },
        redirect: "follow",
      });
      if (res.ok) return Buffer.from(await res.arrayBuffer());
      console.log(`  miss ${res.status} ${t.slice(0, 70)}`);
    } catch (e) {
      console.log(`  err ${e.message}`);
    }
  }
  return null;
}

async function downloadAndOptimize(urls) {
  fs.mkdirSync(IMG, { recursive: true });
  const map = new Map(); // original (&amp; form too) -> local path
  let i = 0;
  let fb = 0;
  for (const url of urls) {
    i++;
    const id = photoId(url);
    const file = `${id}.jpg`;
    const dest = path.join(IMG, file);
    const local = `/demos/brightsteps/img/${file}`;

    if (!fs.existsSync(dest) || fs.statSync(dest).size < 2000) {
      process.stdout.write(`[${i}/${urls.size}] fetch ${id}… `);
      let buf = await fetchBuffer(url);
      if (!buf) {
        const fbPath = path.join(ROOT, FALLBACK_EVIDENCE[fb % FALLBACK_EVIDENCE.length]);
        fb++;
        buf = fs.readFileSync(fbPath);
        process.stdout.write(`fallback ${path.basename(fbPath)} `);
      }
      const out = await sharp(buf)
        .resize({ width: 1100, withoutEnlargement: true })
        .jpeg({ quality: 68, mozjpeg: true })
        .toBuffer();
      fs.writeFileSync(dest, out);
      console.log(`${Math.round(out.length / 1024)}KB`);
    } else {
      console.log(`[${i}/${urls.size}] keep ${id}`);
    }

    map.set(url, local);
    map.set(url.replace(/&/g, "&amp;"), local);
  }
  return map;
}

function rewriteHtml(html, map) {
  let out = applyPhoneAndCache(html);
  // Longer URLs first so partial replaces don't break
  const keys = [...map.keys()].sort((a, b) => b.length - a.length);
  for (const key of keys) {
    out = out.split(key).join(map.get(key));
  }
  return out;
}

async function main() {
  restoreCleanHtml();

  const allUrls = new Set();
  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(DEMO, file), "utf8");
    for (const u of collectUnsplash(html)) allUrls.add(u);
  }
  console.log("unique unsplash", allUrls.size);

  const map = await downloadAndOptimize(allUrls);

  for (const file of htmlFiles) {
    const p = path.join(DEMO, file);
    const html = fs.readFileSync(p, "utf8");
    const next = rewriteHtml(html, map);
    writeSafe(p, Buffer.from(next, "utf8"));
    const left = collectUnsplash(next).size;
    const bad = /Ã.|â.|Â·|ðŸ|â€|â†|â–|âœ|â­|âš/.test(next);
    console.log("wrote", file, "unsplashLeft=", left, "mojibake=", bad);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
