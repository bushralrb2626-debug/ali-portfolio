import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const file = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "prisma",
  "ads-content.ts",
);

const ids = [
  "ev-harvard",
  "ev-harvard-hub",
  "ev-cambridge",
  "ev-mit",
  "ev-pk-school",
  "ev-src-mason",
  "ev-src-eddyn",
  "ev-src-hem",
  "ev-demo-reach",
  "ev-demo-cpl",
  "ev-demo-retarget",
  "ev-demo-inq",
  "ev-demo-ab",
  "ev-demo-recover",
  "ev-demo-solo",
  "ev-ali-1",
  "ev-ali-2",
  "ev-ali-3",
  "ev-ali-4",
  "proj-campus",
  "proj-hooks",
  "proj-meta",
  "proj-tiktok",
  "proj-cutdown",
];

let s = fs.readFileSync(file, "utf8");

for (const id of ids) {
  const re = new RegExp(`(id: "${id}"[\\s\\S]*?imageUrl: )""`);
  if (!re.test(s)) {
    console.error("miss", id);
    process.exit(1);
  }
  s = s.replace(re, `$1"/evidence/${id}.svg"`);
}

fs.writeFileSync(file, s);
console.log(`Updated ${ids.length} evidence imageUrls`);
