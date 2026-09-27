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
} catch (e) {
  check(false, "server reachable", String(e));
}
console.log(failures ? `\n${failures} check(s) failed` : "\nAll preflight checks passed: stage-ready.");
process.exit(failures ? 1 : 0);
