import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const file = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "prisma",
  "ads-content.ts",
);

const videos = {
  "ev-ai-toys": "https://www.youtube.com/watch?v=F_WfIzYGlg4",
  "ev-ai-moto": "https://youtu.be/0uF69-ZyNYc",
  "ev-ai-tunghai": "https://www.youtube.com/watch?v=x0KQfpqpq3Y",
};

let s = fs.readFileSync(file, "utf8");
for (const [id, url] of Object.entries(videos)) {
  console.log(id, s.includes(url) ? "ok" : "MISSING");
}
