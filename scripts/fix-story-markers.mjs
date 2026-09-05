import fs from "node:fs";
import path from "node:path";

const dir = "public/demos/brightsteps";
const markers = ["1", "2", "3", "4"];

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html"))) {
  const p = path.join(dir, file);
  let html = fs.readFileSync(p, "utf8");
  const before = html;
  let i = 0;

  html = html.replace(
    /<div class="story-step__marker" aria-hidden="true">\/demos\/brightsteps\/img\/[^"<\n]+\.jpg>/g,
    () => {
      const n = markers[i++ % 4];
      return `<div class="story-step__marker" aria-hidden="true">${n}</div>`;
    }
  );

  // Catch any other .jpg> that ate a closing tag
  html = html.replace(
    /aria-hidden="true">\/demos\/brightsteps\/img\/[^\n<]+\.jpg>/g,
    () => {
      const n = markers[i++ % 4];
      return `aria-hidden="true">${n}</div>`;
    }
  );

  if (html !== before) fs.writeFileSync(p, html, "utf8");

  const bad = /Ã.|â.|Â·|ðŸ|â€|â†|â–/.test(html);
  const unsplash = (html.match(/images\.unsplash/g) || []).length;
  const broken = (html.match(/\.jpg>/g) || []).length;
  console.log(file, { changed: html !== before, bad, unsplash, brokenJpgGt: broken });
}
