// `npm run demo:check`: exits non-zero if the running demo server is not stage-ready.
// Drives the full 90-second path over HTTP, then resets to start.json.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.SIMUSTAY_URL ?? "http://localhost:3000";
let failures = 0;
const check = (ok, label, extra = "") => {
  console.log(`${ok ? "✓" : "✗"} ${label}${extra ? `  ${extra}` : ""}`);
  if (!ok) failures += 1;
  return ok;
};
const post = async (path, body = {}) => (await fetch(`${BASE}/api/simustay/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })).json();

try {
  const t0 = performance.now();
  const health = await (await fetch(`${BASE}/api/simustay/health`)).json();
  const ms = Math.round(performance.now() - t0);
  check(health.store === "ok" && health.sse === "ok", "health", `${ms} ms · ai=${health.ai} · mode=${health.mode}`);

  const v0 = health.version;
  const reset = await post("reset");
  check(reset.ok && reset.state.version > v0, "reset increments version");

  const envSha = /^SIMUSTAY_DEMO_PDF_SHA=(.*)$/m.exec(readFileSync(join(root, ".env.demo"), "utf8"))?.[1];
  const pdf = readFileSync(join(root, "src/lib/simustay/fixtures/docs/ambassadori_kachreti_sops.pdf"));
  check(createHash("sha256").update(pdf).digest("hex") === envSha, "demo PDF sha matches .env.demo");

  check((await fetch(`${BASE}/m/hk`)).status === 200, "GET /m/hk → 200");

  const ctrl = new AbortController();
  const sse = await fetch(`${BASE}/api/simustay/stream`, { signal: ctrl.signal });
  const reader = sse.body.getReader();
  const first = new TextDecoder().decode((await reader.read()).value ?? new Uint8Array());
  check(sse.headers.get("content-type")?.includes("text/event-stream") && /retry|data:/.test(first), "SSE stream delivers frames");
  ctrl.abort();

  const form = new FormData();
  form.append("file", new Blob([pdf], { type: "application/pdf" }), "ambassadori_kachreti_sops.pdf");
  const t1 = performance.now();
  const ing = await (await fetch(`${BASE}/api/simustay/ingest`, { method: "POST", body: form })).json();
  check(ing.ok && ing.state.rules.length === 7, "ingest → 7 rules", `${Math.round(performance.now() - t1)} ms · ${ing.source}`);
  check((await post("publish")).ok, "publish");
  check((await post("folio/move", { chargeId: "c-villa", window: 2 })).gate?.ok === true, "villa → W2 accepted");
  check((await post("folio/move", { chargeId: "c-golf", window: 2 })).gate?.ok === true, "golf → W2 accepted");
  check((await post("folio/move", { chargeId: "c-wine", window: 2 })).gate?.ruleId === "H2", "wine → W2 blocked by H2");
  check((await post("folio/move", { chargeId: "c-wine", window: 1 })).gate?.ok === true, "wine → W1 accepted");
  check((await post("folio/move", { chargeId: "c-rest", window: 1 })).gate?.ok === true, "restaurant → W1 accepted");
  const fin = await post("folio/finish");
  check(fin.gate?.ok && fin.state.rooms.find((r) => r.number === "304").status === "dirty", "finish → 304 dirty + task");
  const task = fin.state.tasks.find((t) => t.room === "304" && t.state === "open");
  for (const i of task.checklist) await post("hk/check", { taskId: task.id, itemId: i.id, done: true });
  const photo = "data:image/svg+xml;base64," + Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'/>").toString("base64");
  const done = await post("hk/complete", { taskId: task.id, photo });
  check(done.ok && done.state.rooms.find((r) => r.number === "304").status === "clean", "HK complete → 304 clean");
  const insp = await post("hk/inspect", { room: "304" });
  check(insp.ok && insp.state.rooms.find((r) => r.number === "304").status === "inspected", "inspect → 304 inspected");
  check(insp.state.adapterLog.some((l) => l.line.includes('"State":"Inspected"')), "adapter log has Mews-shaped Inspected PATCH");
  check(insp.state.metrics.errorsCaught === 1 && insp.state.metrics.readyAt > 0, "impact metrics computed");
  const bad = await post("hk/inspect", { room: "999" });
  check(bad.ok === false && typeof bad.error === "string", "failing route returns 200 {ok:false}");
  check((await post("reset")).ok, "reset to start.json");

  // Bioli Wellness: property switch swaps rules, board and persona; the alcohol trap fires H2.
  const sw = await post("property", { propertyId: "bioli" });
  check(sw.ok && sw.state.property.id === "bioli" && sw.state.rooms.length === 17, "switch → Bioli (17 cottages)");
  const bioliPdf = readFileSync(join(root, "src/lib/simustay/fixtures/docs/bioli_kojori_wellness_protocols.pdf"));
  const bioliSha = /^SIMUSTAY_DEMO_PDF_SHA_BIOLI=(.*)$/m.exec(readFileSync(join(root, ".env.demo"), "utf8"))?.[1];
  check(createHash("sha256").update(bioliPdf).digest("hex") === bioliSha, "Bioli PDF sha matches .env.demo");
  const bform = new FormData();
  bform.append("file", new Blob([bioliPdf], { type: "application/pdf" }), "bioli_kojori_wellness_protocols.pdf");
  const bing = await (await fetch(`${BASE}/api/simustay/ingest`, { method: "POST", body: bform })).json();
  check(bing.ok && bing.state.rules.length === 8, "Bioli ingest → 8 rules");
  await post("publish");
  const trap = await post("folio/move", { chargeId: "c-bar", window: 2 });
  check(trap.gate?.ruleId === "H2", "alcohol → package blocked by H2");
  for (const m of bing.state.property.demoScript) await post("folio/move", m);
  const bfin = await post("folio/finish");
  check(bfin.gate?.ok && bfin.state.rooms.find((r) => r.number === "12").status === "dirty", "Bioli finish → cottage 12 dirty");
  const back = await post("property", { propertyId: "ambassadori" });
  check(back.ok && back.state.property.id === "ambassadori" && back.state.rooms.length === 40, "switch back → Ambassadori");

  const savedWindows = (await (await fetch(`${BASE}/api/simustay/state`)).json()).ui.openWindows;
  const win = await post("windows", { action: "preset" });
  const open = Object.entries(win.state.ui.openWindows).filter(([, v]) => v).map(([k]) => k).sort().join(",");
  check(open === "board,ingest,phone,pms", "Live workspace preset opens the quartet", open);
  const closed = await post("windows", { action: "close", id: "board" });
  const stillClosed = (await post("reset")).state.ui.openWindows.board === false;
  check(closed.ok && stillClosed, "closed window stays closed across reset");
  const cid = `preflight-${Date.now()}`;
  await post("windows", { action: "close", id: "comms", clientId: cid, seq: 2 });
  const late = await post("windows", { action: "open", id: "comms", clientId: cid, seq: 1 });
  check(late.stale === true && late.state.ui.openWindows.comms === false, "late (older) window request cannot undo a newer close");
  const foc = await post("windows", { action: "focus", id: "comms", clientId: cid, seq: 3 });
  check(foc.ok && foc.state.ui.openWindows.comms === false, "focus never reopens a closed window");
  await post("windows", { action: "preset", clientId: cid, seq: 4 });
  const solo = await post("windows", { action: "solo", id: "pms", clientId: cid, seq: 5 });
  const soloOpen = Object.entries(solo.state.ui.openWindows).filter(([, v]) => v).map(([k]) => k).join(",");
  check(soloOpen === "pms", "Launchpad card (solo) after Live workspace shows only that app", soloOpen);
  for (const [id, isOpen] of Object.entries(savedWindows)) await post("windows", { action: isOpen ? "open" : "close", id });
} catch (e) {
  check(false, "server reachable", String(e));
}
console.log(failures ? `\n${failures} check(s) failed` : "\nAll preflight checks passed: stage-ready.");
process.exit(failures ? 1 : 0);
