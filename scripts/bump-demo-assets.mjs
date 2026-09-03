import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "public/demos/brightsteps");
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html"))) {
  const p = path.join(dir, file);
  let html = fs.readFileSync(p, "utf8");
  html = html.replace(/js\/i18n\.js(?:\?v=[^"]*)?/g, "js/i18n.js?v=keyed5");
  html = html.replace(/js\/campus-bot\.js(?:\?v=[^"]*)?/g, "js/campus-bot.js?v=15");
  html = html.replace(/css\/campus-bot\.css(?:\?v=[^"]*)?/g, "css/campus-bot.css?v=15");
  fs.writeFileSync(p, html);
  console.log("bumped", file);
}
