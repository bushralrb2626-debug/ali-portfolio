import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "public/demos/brightsteps");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));
const texts = new Set();

function decode(t) {
  return t
    .replace(/&amp;/g, "&")
    .replace(/&#x2014;/g, "—")
    .replace(/&#x27;/g, "'")
    .replace(/&copy;/g, "©")
    .replace(/&#x2B;/g, "+")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

for (const file of files) {
  let html = fs.readFileSync(path.join(dir, file), "utf8");
  html = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ");
  const re = />([^<]+)</g;
  let m;
  while ((m = re.exec(html))) {
    const t = decode(m[1]);
    if (t && t.length > 1 && /[A-Za-zÀ-ÿ]/.test(t) && t !== "f" && t !== "ig") {
      texts.add(t);
    }
  }
  for (const a of ["placeholder", "aria-label", "alt", "title"]) {
    const r = new RegExp(`${a}="([^"]+)"`, "gi");
    let mm;
    while ((mm = r.exec(html))) {
      const t = decode(mm[1]);
      if (t && /[A-Za-zÀ-ÿ]/.test(t)) texts.add(`${a}: ${t}`);
    }
  }
}

const out = [...texts].sort().join("\n");
fs.writeFileSync(path.join(process.cwd(), "scripts/i18n-strings.txt"), out);
console.log("COUNT", texts.size);
console.log(out);
