// Regenerates the demo fixtures: state snapshots, the house-rules PDF and its SHA in .env.demo.
// Usage: npm run demo:fixtures   (the PDF step needs Google Chrome/Chromium; it is skipped if absent)
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fx = join(root, "src/lib/simustay/fixtures");
const read = (p) => JSON.parse(readFileSync(join(fx, p), "utf8"));
const write = (p, v) => { mkdirSync(dirname(join(fx, p)), { recursive: true }); writeFileSync(join(fx, p), JSON.stringify(v, null, 2) + "\n"); };

const rules = read("rules.alazani.json");
const scenario = read("scenario.checkin-204.json");
const profiles = read("profiles.json");
const profile = profiles.profiles.find((p) => p.id === profiles.default);

// ---- 40-room board: floors 1-4, rooms x01-x10, deterministic mix -----------------
// Floors 1-2: resort rooms; 3xx: Kachreti Island villas; 4xx: lake villas.
const TYPES = {
  1: ["დელუქსი", "დელუქსი", "სუპერიორი", "სუპერიორი", "დელუქსი", "ტყუპი", "ტყუპი", "დელუქსი", "სუპერიორი", "ლუქსი"],
  2: ["დელუქსი", "სუპერიორი", "სუპერიორი", "ტყუპი", "დელუქსი", "ტყუპი", "დელუქსი", "სუპერიორი", "ლუქსი", "ლუქსი"],
  3: Array(10).fill("ვილა · კაჭრეთის კუნძული"),
  4: Array(10).fill("ვილა · ტბის ნაპირი"),
};
const PATTERN = [
  "inspected", "occupied", "dirty", "occupied", "clean", "inspected", "ooo", "occupied", "oos", "inspected",
  "occupied", "inspected", "dirty", "occupied", "clean", "occupied", "occupied", "inspected", "dirty", "occupied",
  "inspected", "occupied", "occupied", "clean", "inspected", "occupied", "dirty", "occupied", "inspected", "occupied",
  "occupied", "clean", "inspected", "occupied", "occupied", "dirty", "inspected", "occupied", "occupied", "inspected",
];
const rooms = [];
for (let f = 1; f <= 4; f++) for (let r = 1; r <= 10; r++) {
  const number = `${f}${String(r).padStart(2, "0")}`;
  const status = number === scenario.folio.room ? "occupied" : PATTERN[(f - 1) * 10 + (r - 1)];
  rooms.push({ number, type: TYPES[f][r - 1], status, updatedAt: 0 });
}

const checklist = () => scenario.hkChecklist.map((i) => ({ ...i, done: false }));
const stayoverTasks = rooms.filter((r) => r.status === "dirty").slice(0, 2).map((r) => ({
  id: `hk-${r.number}-0`, room: r.number, kind: "stayover", checklist: checklist(), photo: null, state: "open", createdAt: 0,
}));

const start = {
  mode: "offline",
  workspace: { profileId: profile.id, installed_apps: profile.installed_apps, skins: profile.skins },
  rules: [],
  ingest: null,
  published: false,
  shiftTitle_ka: "ცვლა ჯერ არ დაწყებულა — გამოაქვეყნეთ წესები",
  shiftTitle_en: "Shift not started: publish the rules",
  folio: scenario.folio,
  checkedOut: false,
  rooms,
  tasks: stayoverTasks,
  chat: [],
  quickReplies: scenario.quickReplies,
  usedReplies: [],
  gateLog: [],
  adapterLog: [{ t: 0, line: "adapter: Mews-shaped (dry-run) · 40 resources synced → 200 (mock)" }],
  metrics: { errorsCaught: 0, interventionsAvoided: 0, movesGraded: 0, checkoutAt: null, cleanedAt: null, readyAt: null },
  version: 0,
};
write("snapshots/start.json", start);

// ---- before check-out (beat 38 s): rules published, folio routed, one error caught ----
const route = { "c-villa": 2, "c-golf": 2, "c-wine": 1, "c-rest": 1 };
const h2 = rules.rules.find((r) => r.id === "H2");
const beforeCheckout = {
  ...structuredClone(start),
  rules: rules.rules,
  ingest: { fileName: rules.document.fileName, pages: rules.document.pages, source: "cache", at: 0 },
  published: true,
  shiftTitle_ka: scenario.shiftTitle_ka,
  shiftTitle_en: scenario.shiftTitle_en,
  folio: { ...structuredClone(scenario.folio), charges: scenario.folio.charges.map((c) => ({ ...c, window: route[c.id] })) },
  chat: [
    { id: "m0", from: "system", text_ka: `📎 ${scenario.folio.company}: საგარანტიო წერილი მიღებულია (ელფოსტა)`, text_en: `${scenario.folio.company_en}: guarantee letter received (email)`, t: 0 },
    ...scenario.opening.map((m, i) => ({ id: `m${i + 1}`, ...m, t: 0 })),
  ],
  gateLog: [
    { ok: true, ruleId: "OK", tier: "H", message_ka: "სწორია", message_en: "Correct", chargeId: "c-villa", target: 2, at: 0 },
    { ok: true, ruleId: "OK", tier: "H", message_ka: "სწორია", message_en: "Correct", chargeId: "c-golf", target: 2, at: 0 },
    { ok: false, ruleId: "H2", tier: "H", message_ka: h2.title_ka, message_en: h2.title_en, source: h2.source, chargeId: "c-wine", target: 2, at: 0 },
    { ok: true, ruleId: "OK", tier: "H", message_ka: "სწორია", message_en: "Correct", chargeId: "c-wine", target: 1, at: 0 },
    { ok: true, ruleId: "OK", tier: "H", message_ka: "სწორია", message_en: "Correct", chargeId: "c-rest", target: 1, at: 0 },
  ],
  metrics: { ...start.metrics, errorsCaught: 1, interventionsAvoided: 1, movesGraded: 5 },
};
write("snapshots/before-checkout.json", beforeCheckout);
console.log("✓ snapshots/start.json, snapshots/before-checkout.json");

// ---- demo PDF (bilingual house rules, quotes verbatim) -----------------------------
const html = readFileSync(join(fx, "docs/ambassadori_kachreti_sops.html"), "utf8");
for (const r of rules.rules) {
  if (!html.includes(r.source.quote)) { console.error(`✗ quote for ${r.id} is not verbatim in the demo document`); process.exit(1); }
}
const pdf = join(fx, "docs/ambassadori_kachreti_sops.pdf");
const chrome = ["google-chrome", "chromium", "chromium-browser", "google-chrome-stable"].find((b) => {
  try { execFileSync("which", [b], { stdio: "ignore" }); return true; } catch { return false; }
});
if (chrome) {
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${pdf}`, `file://${join(fx, "docs/ambassadori_kachreti_sops.html")}`], { stdio: "ignore" });
  console.log(`✓ docs/ambassadori_kachreti_sops.pdf (via ${chrome})`);
} else if (!existsSync(pdf)) {
  console.warn("! no Chrome found: PDF not generated (upload any file; offline mode serves the cached pack)");
}
if (existsSync(pdf)) {
  const sha = createHash("sha256").update(readFileSync(pdf)).digest("hex");
  const envPath = join(root, ".env.demo");
  const env = readFileSync(envPath, "utf8").replace(/^SIMUSTAY_DEMO_PDF_SHA=.*$/m, `SIMUSTAY_DEMO_PDF_SHA=${sha}`);
  writeFileSync(envPath, env);
  console.log(`✓ .env.demo SIMUSTAY_DEMO_PDF_SHA=${sha.slice(0, 16)}…`);
}
