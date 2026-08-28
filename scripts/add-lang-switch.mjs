import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "public/demos/brightsteps");
const block = `        <div class="lang-switch" id="langSwitch" role="group" aria-label="Language">
            <button type="button" class="lang-switch__btn" data-set-lang="en" aria-pressed="false">EN</button>
            <button type="button" class="lang-switch__btn" data-set-lang="it" aria-pressed="true">IT</button>
        </div>
`;
const needle = /\s*<\/nav>\r?\n\s*<\/div>\r?\n<\/header>/;

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html"))) {
  const filePath = path.join(dir, file);
  let html = fs.readFileSync(filePath, "utf8");
  if (html.includes('id="langSwitch"')) {
    console.log("skip", file);
    continue;
  }
  if (!needle.test(html)) {
    console.error("no needle", file);
    continue;
  }
  html = html.replace(needle, `\n        </nav>\n${block}    </div>\n</header>`);
  fs.writeFileSync(filePath, html);
  console.log("patched", file);
}
