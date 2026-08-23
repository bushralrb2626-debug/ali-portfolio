import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "public", "evidence");
fs.mkdirSync(dir, { recursive: true });

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function svg({ bg, accent, label, sub, icon }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <radialGradient id="g" cx="70%" cy="20%" r="60%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="d" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.8" fill="${accent}" opacity="0.25"/>
    </pattern>
  </defs>
  <rect width="800" height="450" fill="${bg}"/>
  <rect width="800" height="450" fill="url(#d)"/>
  <rect width="800" height="450" fill="url(#g)"/>
  <rect x="40" y="40" width="720" height="370" rx="24" fill="none" stroke="${accent}" stroke-opacity="0.35" stroke-width="2"/>
  <text x="70" y="120" fill="${accent}" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="600" letter-spacing="4">${esc(icon)}</text>
  <text x="70" y="200" fill="#e8f4f8" font-family="Segoe UI, Arial, sans-serif" font-size="36" font-weight="700">${esc(label)}</text>
  <text x="70" y="250" fill="#7dd3fc" font-family="Segoe UI, Arial, sans-serif" font-size="20" opacity="0.85">${esc(sub)}</text>
</svg>`;
}

const cards = [
  ["ev-harvard", "#1a0a0c", "#f87171", "HARVARD", "Yes. That Harvard — campaign", "◈"],
  ["ev-harvard-hub", "#1a0a0c", "#fb7185", "HARVARD DCE", "Campaign hub", "◉"],
  ["ev-cambridge", "#0a1220", "#93c5fd", "CAMBRIDGE", "YouTube recruitment system", "◆"],
  ["ev-mit", "#0b1020", "#67e8f9", "MIT", "Institutional video engine", "⬡"],
  ["ev-pk-school", "#0c1410", "#86efac", "PAKISTAN SCHOOL", "Recite lines & post (local)", "▣"],
  ["ev-src-mason", "#0a1018", "#22d3ee", "YOUTUBE + ADS", "Mason Interactive source", "▶"],
  ["ev-src-eddyn", "#0a1018", "#2dd4bf", "SHORT VIDEO", "EducationDynamics source", "◎"],
  ["ev-src-hem", "#0a1018", "#38bdf8", "SEQUENCING", "Higher Ed Marketing source", "☰"],
  ["ev-demo-reach", "#12080a", "#f87171", "−38% / −52%", "Reach & inquiries dying", "↓"],
  ["ev-demo-cpl", "#12080a", "#fb923c", "CPL ↑ LEADS ↓", "Recite-and-upload stall", "⚠"],
  ["ev-demo-retarget", "#12080a", "#fbbf24", "~0 RETARGET", "Untargeted posts", "○"],
  ["ev-demo-inq", "#041410", "#34d399", "+2.4× INQUIRIES", "Ads accelerating (90 days)", "↑"],
  ["ev-demo-ab", "#041410", "#2dd4bf", "HOOK A/B WINS", "Lower CPL vs one take", "⇄"],
  ["ev-demo-recover", "#041410", "#67e8f9", "RETARGET RECOVER", "Applications organic misses", "↻"],
  ["ev-demo-solo", "#041410", "#a7f3d0", "SOLO WEEKLY", "No student film day", "⚡"],
  ["ev-ali-1", "#0c1220", "#5eead4", "TARGETING", "Operator takeaway", "◎"],
  ["ev-ali-2", "#0c1220", "#5eead4", "A/B HOOKS", "Operator takeaway", "⇄"],
  ["ev-ali-3", "#0c1220", "#5eead4", "RETARGETING", "Operator takeaway", "↻"],
  ["ev-ali-4", "#0c1220", "#5eead4", "SOLO STACK", "Operator takeaway", "⚡"],
  ["proj-campus", "#061018", "#22d3ee", "CAMPUS → ADS", "Parent Meta push", "▣"],
  ["proj-hooks", "#061018", "#2dd4bf", "AI HOOK PACK", "Vs student lines", "⇄"],
  ["proj-meta", "#061018", "#38bdf8", "META ENROLL", "O-Level campaign", "◎"],
  ["proj-tiktok", "#061018", "#67e8f9", "TIKTOK TESTS", "Parent offer angles", "▶"],
  ["proj-cutdown", "#061018", "#a5f3fc", "CUTDOWN SYSTEM", "Paid social lengths", "☰"],
  ["ev-ai-sora", "#050816", "#67e8f9", "OPENAI SORA", "Official reel", "▶"],
  ["ev-ai-coke", "#1a0808", "#f87171", "COCA-COLA AI", "Holidays Are Coming", "◆"],
  ["ev-ai-toys", "#1a1008", "#fb923c", "TOYS R US", "First Sora brand · CNN", "◈"],
  ["ev-ai-moto", "#0a1220", "#38bdf8", "MOTOROLA", "No camera · no crew", "⬡"],
  ["ev-qmobile", "#12080c", "#fb7185", "Q MOBILE", "Live phone ad", "▣"],
  ["ev-ai-tunghai", "#081418", "#2dd4bf", "TUNGHAI", "University AI film", "◎"],
  ["ev-ai-tunghai-long", "#061018", "#5eead4", "TUNGHAI LONG", "~2.9M views", "◎"],
  ["ev-fazaia", "#141008", "#fbbf24", "FIC E-9", "Human admissions", "⚠"],
  ["ev-ai-castlery", "#08120e", "#34d399", "CASTLERY", "60% cheaper · LBB", "☰"],
  ["ev-ai-dumpling", "#101008", "#facc15", "SQUISHY DUMPLINGS", "AI ads · kids demand", "◎"],
  ["ev-ai-heinz", "#140808", "#ef4444", "HEINZ A.I.", "850M+ impressions", "↑"],
  ["ev-slorsh", "#0c1220", "#7dd3fc", "SLORSH", "Campus site pattern", "◇"],
];

for (const [id, bg, accent, label, sub, icon] of cards) {
  fs.writeFileSync(
    path.join(dir, `${id}.svg`),
    svg({ bg, accent, label, sub, icon }),
  );
}

console.log(`Wrote ${cards.length} thumbnails to ${dir}`);
