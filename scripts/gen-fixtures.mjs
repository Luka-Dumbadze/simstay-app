// Regenerates the demo fixtures for every property: state snapshots, the rules PDF and its SHA in .env.demo.
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

const profiles = read("profiles.json");
const profile = profiles.profiles.find((p) => p.id === profiles.default);
const APP_IDS = ["ingest", "pms", "comms", "phone", "board", "agents", "ops", "store"];

const PROPERTIES = [
  {
    id: "ambassadori",
    rules: "rules.ambassadori.json",
    scenario: "scenario.ambassadori-villa.json",
    doc: "ambassadori_kachreti_sops",
    envKey: "SIMUSTAY_DEMO_PDF_SHA",
    // Floors 1-2: resort rooms; 3xx: Kachreti Island villas; 4xx: lake villas.
    rooms() {
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
      const out = [];
      for (let f = 1; f <= 4; f++) for (let r = 1; r <= 10; r++) {
        out.push({ number: `${f}${String(r).padStart(2, "0")}`, type: TYPES[f][r - 1], status: PATTERN[(f - 1) * 10 + (r - 1)], updatedAt: 0 });
      }
      return out;
    },
  },
  {
    id: "bioli",
    rules: "rules.bioli.json",
    scenario: "scenario.bioli-cottage.json",
    doc: "bioli_kojori_wellness_protocols",
    envKey: "SIMUSTAY_DEMO_PDF_SHA_BIOLI",
    // 17 units (Michelin). Type names are Bioli's (bioli.ge); the per-unit mix is illustrative until the PMS import.
    rooms() {
      const PATTERN = ["inspected", "occupied", "dirty", "occupied", "inspected", "occupied", "dirty", "occupied", "clean", "inspected", "occupied", "occupied", "occupied", "inspected", "dirty", "occupied", "inspected"];
      return PATTERN.map((status, i) => {
        const n = i + 1;
        const type = n <= 8 ? "Premium კოტეჯი" : n <= 13 ? "Grand Premium კოტეჯი" : n <= 15 ? "Grand შალე" : "შალე";
        return { number: String(n), type, status, updatedAt: 0 };
      });
    },
  },
];

const ok = (chargeId, target) => ({ ok: true, ruleId: "OK", tier: "H", message_ka: "სწორია", message_en: "Correct", chargeId, target, at: 0 });

for (const p of PROPERTIES) {
  const rules = read(p.rules);
  const scenario = read(p.scenario);
  const property = { ...scenario.property, docFileName: rules.document.fileName };
  const rooms = p.rooms().map((r) => (r.number === scenario.folio.room ? { ...r, status: "occupied" } : r));
  const checklist = () => scenario.hkChecklist.map((i) => ({ ...i, done: false }));
  const stayoverTasks = rooms.filter((r) => r.status === "dirty").slice(0, 2).map((r) => ({
    id: `hk-${r.number}-0`, room: r.number, kind: "stayover", checklist: checklist(), photo: null, state: "open", createdAt: 0,
  }));

  const start = {
    mode: "offline",
    property,
    ui: { openWindows: Object.fromEntries(APP_IDS.map((id) => [id, false])), focusedWindow: null, rev: 0, writer: null, seqByClient: {} },
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
    adapterLog: [{ t: 0, line: `adapter: Mews-shaped (dry-run) · ${rooms.length} resources synced → 200 (mock)` }],
    metrics: { errorsCaught: 0, interventionsAvoided: 0, movesGraded: 0, checkoutAt: null, cleanedAt: null, readyAt: null },
    version: 0,
  };
  write(`snapshots/${p.id}/start.json`, start);

  // Before check-out (beat 38 s): rules published, folio routed per the demo script, one error caught.
  const finalWindow = {};
  const gateLog = [];
  for (const step of property.demoScript) {
    const charge = scenario.folio.charges.find((c) => c.id === step.chargeId);
    const win = scenario.folio.windows.find((w) => w.n === step.window);
    const blocking = rules.rules.find((r) => r.check?.kind === "route" && r.check.chargeCodes.includes(charge.code) && r.check.payer !== win.payerType);
    if (blocking) {
      gateLog.push({ ok: false, ruleId: blocking.id, tier: blocking.tier, message_ka: blocking.title_ka, message_en: blocking.title_en, source: blocking.source, chargeId: step.chargeId, target: step.window, at: 0 });
    } else {
      finalWindow[step.chargeId] = step.window;
      gateLog.push(ok(step.chargeId, step.window));
    }
  }
  const unrouted = scenario.folio.charges.filter((c) => !finalWindow[c.id]);
  if (unrouted.length) { console.error(`✗ ${p.id}: demo script leaves ${unrouted.map((c) => c.id)} unrouted`); process.exit(1); }
  const letter = scenario.folio.letterOnFile && scenario.folio.windows.some((w) => w.method === "direct_bill");
  const beforeCheckout = {
    ...structuredClone(start),
    rules: rules.rules,
    ingest: { fileName: rules.document.fileName, pages: rules.document.pages, source: "cache", at: 0 },
    published: true,
    shiftTitle_ka: scenario.shiftTitle_ka,
    shiftTitle_en: scenario.shiftTitle_en,
    folio: { ...structuredClone(scenario.folio), charges: scenario.folio.charges.map((c) => ({ ...c, window: finalWindow[c.id] })) },
    chat: [
      ...(letter ? [{ id: "m0", from: "system", text_ka: `📎 ${scenario.folio.company}: საგარანტიო წერილი მიღებულია (ელფოსტა)`, text_en: `${scenario.folio.company_en}: guarantee letter received (email)`, t: 0 }] : []),
      ...scenario.opening.map((m, i) => ({ id: `m${i + 1}`, ...m, t: 0 })),
    ],
    gateLog,
    metrics: { ...start.metrics, errorsCaught: gateLog.filter((g) => !g.ok).length, interventionsAvoided: gateLog.filter((g) => !g.ok).length, movesGraded: gateLog.length },
  };
  write(`snapshots/${p.id}/before-checkout.json`, beforeCheckout);
  console.log(`✓ ${p.id}: snapshots/${p.id}/start.json, before-checkout.json (${rooms.length} units)`);

  // Demo PDF (bilingual; every rule quote must appear verbatim).
  const htmlPath = join(fx, `docs/${p.doc}.html`);
  const html = readFileSync(htmlPath, "utf8");
  for (const r of rules.rules) {
    if (!html.includes(r.source.quote)) { console.error(`✗ ${p.id}: quote for ${r.id} is not verbatim in the demo document`); process.exit(1); }
  }
  const pdf = join(fx, `docs/${p.doc}.pdf`);
  const chrome = ["google-chrome", "chromium", "chromium-browser", "google-chrome-stable"].find((b) => {
    try { execFileSync("which", [b], { stdio: "ignore" }); return true; } catch { return false; }
  });
  if (chrome) {
    execFileSync(chrome, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${pdf}`, `file://${htmlPath}`], { stdio: "ignore" });
    console.log(`✓ ${p.id}: docs/${p.doc}.pdf (via ${chrome})`);
  } else if (!existsSync(pdf)) {
    console.warn(`! ${p.id}: no Chrome found, PDF not generated (offline mode serves the cached pack anyway)`);
  }
  if (existsSync(pdf)) {
    const sha = createHash("sha256").update(readFileSync(pdf)).digest("hex");
    const envPath = join(root, ".env.demo");
    let env = readFileSync(envPath, "utf8");
    const line = `${p.envKey}=${sha}`;
    env = new RegExp(`^${p.envKey}=.*$`, "m").test(env) ? env.replace(new RegExp(`^${p.envKey}=.*$`, "m"), line) : env.replace(/\n?$/, `\n${line}\n`);
    writeFileSync(envPath, env);
    console.log(`✓ ${p.id}: .env.demo ${p.envKey}=${sha.slice(0, 16)}…`);
  }
}
