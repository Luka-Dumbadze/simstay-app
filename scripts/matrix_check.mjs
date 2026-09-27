// `npm run test:matrix`: the 8-way matrix, [Ambassadori, Bioli] × [OPERA Cloud, OPERA v5] × [WhatsApp, Telegram],
// against the running demo server (`npm run demo`, or SIMUSTAY_URL).
//
// Each combination plays the full check-out story: A load · B package/company routing · C H2 gate · D guest
// consent + balance · E check-out invoice + room status · F late charge (Ambassadori; Bioli has none).
//
// With Chrome available (google-chrome / chromium, or CHROME=path) the PMS moves and check-out are clicked in a
// real headless browser, and after every action the script waits for the SSE frame to reach the rendered
// WhatsApp/Telegram and OPERA windows. Without Chrome, or with --api, the same steps run over the HTTP API only.
// The presenter's property, skins and windows are restored at the end.
import { spawn, execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.SIMUSTAY_URL ?? "http://localhost:3000";
const API = `${BASE}/api/simustay`;
const UI_TIMEOUT = 5000;

const PROPS = {
  ambassadori: {
    label: "Ambassadori",
    pdf: "ambassadori_kachreti_sops.pdf",
    guest: "ირაკლი კაპანაძე",
    room: "304",
    w2: ["c-villa", "c-golf"],
    trap: "c-wine",
    w1: ["c-wine", "c-rest"],
    // Chat line each move must add in the same commit (Ambassadori confirms per pair, on its second charge).
    lines: { "c-golf>2": "ვილა და გოლფი", "c-rest>1": "საფერავის 120 ₾ და ვახშმის 240 ₾" },
    startsOpen: false,
    invoice: "INV-1042",
    supplementary: { chargeId: "c-late-rest", no: "INV-1043", total: 80 },
  },
  bioli: {
    label: "Bioli",
    pdf: "bioli_kojori_wellness_protocols.pdf",
    guest: "Elena Rostova",
    room: "12",
    w2: ["c-cottage", "c-halo", "c-spectro"],
    trap: "c-bar",
    w1: ["c-bar", "c-phyto"],
    // Bioli answers every single click.
    lines: {
      "c-halo>2": "მარილის ოთახი დადასტურებულია",
      "c-spectro>2": "სპექტრომეტრია დადასტურებულია",
      "c-bar>1": "ღვინის 250 ₾ პირად ბარათზე",
      "c-phyto>1": "ფიტო-აბაზანის 145 ₾",
    },
    balance: { 1: 395, 2: 1080 },
    startsOpen: true, // a switch lands on a live desk: rules read, shift open, Elena's greeting
    invoice: "BW-0712-1",
    checkoutLine: "ნაშთი 395 ₾",
    supplementary: null,
  },
};
const PMS = { modern: { label: "OPERA Cloud", edition: "opera-cloud" }, classic: { label: "OPERA v5", edition: "opera-v5" } };
const COMMS = { whatsapp: { label: "WhatsApp", header: "rgb(0, 128, 105)" }, telegram: { label: "Telegram", header: "rgb(81, 125, 162)" } };
const STEPS = ["A", "B", "C", "D", "E", "F"];
const STEP_NAMES = { A: "load", B: "W2 routing", C: "H2 gate", D: "consent", E: "check-out", F: "late charge" };

const post = async (path, body = {}) =>
  (await fetch(`${API}/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })).json();
const getState = async () => (await fetch(`${API}/state`, { cache: "no-store" })).json();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class StepFail extends Error {}
const expect = (ok, msg) => { if (!ok) throw new StepFail(msg); };

// ---- headless Chrome over the DevTools protocol (no npm dependency) ----------------

function findChrome() {
  if (process.argv.includes("--api")) return null;
  if (process.env.CHROME) return process.env.CHROME;
  for (const bin of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    try { return execFileSync("which", [bin], { encoding: "utf8" }).trim(); } catch { /* next */ }
  }
  return null;
}

async function launchBrowser(bin) {
  const profile = mkdtempSync(join(tmpdir(), "simstay-matrix-"));
  const proc = spawn(bin, [
    "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
    "--no-first-run", "--no-default-browser-check", "--disable-gpu", "--window-size=1600,1000", "about:blank",
  ], { stdio: "ignore" });
  const portFile = join(profile, "DevToolsActivePort");
  for (let i = 0; i < 100 && !existsSync(portFile); i++) await sleep(100);
  if (!existsSync(portFile)) throw new Error("Chrome did not start");
  const port = readFileSync(portFile, "utf8").split("\n")[0];
  const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const ws = new WebSocket(pages.find((p) => p.type === "page").webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  };
  const send = (method, params = {}) => new Promise((res, rej) => {
    const n = ++id;
    pending.set(n, (m) => (m.error ? rej(new Error(m.error.message)) : res(m.result)));
    ws.send(JSON.stringify({ id: n, method, params }));
  });
  const evaluate = async (fn, ...args) => {
    const r = await send("Runtime.evaluate", { expression: `(${fn})(...${JSON.stringify(args)})`, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
    return r.result.value;
  };
  await send("Page.enable");
  await send("Runtime.enable");
  // Open straight into the workspace (the shell remembers its view in localStorage).
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "try { localStorage.setItem('simustay.view', 'workspace') } catch {}" });
  // A new tab is a new demo session: the shell fully resets the desk on first load (DesktopShell). Let that
  // happen once here, so it never lands in the middle of a combination.
  await send("Page.navigate", { url: `${BASE}/` });
  for (let i = 0; i < 100; i++) {
    if (await evaluate(() => sessionStorage.length > 0).catch(() => false)) break;
    await sleep(100);
  }
  await sleep(1000);
  return {
    evaluate,
    async load() {
      await send("Page.navigate", { url: `${BASE}/` });
      for (let i = 0; i < 100; i++) {
        if (await evaluate(() => !!document.querySelector('[data-testid="comms"]') && !!document.querySelector('[data-testid="pms"]')).catch(() => false)) return;
        await sleep(100);
      }
      throw new Error("workspace with PMS + Comms windows did not render");
    },
    async close() {
      const exited = new Promise((r) => proc.once("exit", r));
      try { ws.close(); proc.kill(); } catch { /* ignore */ }
      await Promise.race([exited, sleep(3000)]);
      try { rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* temp dir; best effort */ }
    },
  };
}

// What the rendered windows show right now.
const readUi = () => {
  const comms = document.querySelector('[data-testid="comms"]');
  const pms = document.querySelector('[data-testid="pms"]');
  const header = comms?.firstElementChild;
  return {
    commsSkin: comms?.dataset.skin ?? null,
    headerBg: header ? getComputedStyle(header).backgroundColor : null,
    guest: document.querySelector('[data-testid="comms-guest"]')?.textContent ?? "",
    msgs: [...(comms?.querySelectorAll('[data-testid="chat-msg"]') ?? [])].map((m) => ({ from: m.dataset.from, text: m.textContent })),
    replies: [...(comms?.querySelectorAll('[data-testid^="reply-"]') ?? [])].map((b) => b.dataset.testid.slice(6)),
    pmsSkin: pms?.dataset.skin ?? null,
    edition: pms?.querySelector('[data-testid="pms-edition"]')?.dataset.edition ?? null,
    invoices: document.querySelector('[data-testid="invoices"]')?.textContent ?? "",
    finishDisabled: document.querySelector('[data-testid="pms-finish"]')?.disabled ?? null,
  };
};

// ---- one combination --------------------------------------------------------------

async function runCombo(propId, pmsSkin, commsSkin, browser) {
  const P = PROPS[propId];
  const result = { steps: {}, maxSyncMs: 0 };
  let last = null; // newest server state

  // Waits until the rendered chat shows every message of `state` (count, order and senders) and the extra predicate holds.
  const synced = async (state, extra = () => true) => {
    if (!browser) return;
    const t0 = performance.now();
    let ui;
    while (performance.now() - t0 < UI_TIMEOUT) {
      ui = await browser.evaluate(readUi);
      const same = ui.msgs.length === state.chat.length &&
        state.chat.every((m, i) => ui.msgs[i].from === m.from && (ui.msgs[i].text.includes(m.text_ka) || ui.msgs[i].text.includes(m.text_en)));
      if (same && extra(ui)) {
        result.maxSyncMs = Math.max(result.maxSyncMs, Math.round(performance.now() - t0));
        return ui;
      }
      await sleep(25);
    }
    if (process.env.MATRIX_DEBUG) console.log("\nUI:", JSON.stringify(ui), "\nserver version", (await getState()).version, "expected", state.version);
    throw new StepFail(`UI out of sync after ${UI_TIMEOUT} ms (chat ${ui?.msgs.length}/${state.chat.length})`);
  };

  // A PMS action: clicked in the browser when one is attached, else posted. Resolves with the server's gate + state.
  const click = async (testid) => {
    const before = last.version;
    const ok = await browser.evaluate((id) => {
      const b = document.querySelector(`[data-testid="${id}"]`);
      if (!b || b.disabled) return false;
      b.click();
      return true;
    }, testid);
    expect(ok, `button ${testid} missing or disabled in the ${PMS[pmsSkin].label} UI`);
    for (let i = 0; i < 200; i++) {
      const s = await getState();
      if (s.version > before) { last = s; return { gate: s.gateLog.at(-1), state: s }; }
      await sleep(25);
    }
    throw new StepFail(`no state change after clicking ${testid}`);
  };
  const move = async (chargeId, window) => {
    if (browser) return click(`to-w${window}-${chargeId}`);
    const r = await post("folio/move", { chargeId, window });
    expect(r.ok, r.error);
    last = r.state;
    return r;
  };
  const finish = async () => {
    if (browser) return click("pms-finish");
    const r = await post("folio/finish");
    expect(r.ok, r.error);
    last = r.state;
    return r;
  };

  // One accepted move; its own chat line (if the property has one) must be the newest message and on screen.
  const routed = async (id, w) => {
    const r = await move(id, w);
    expect(r.gate?.ok, `${id} → W${w} refused: ${r.gate?.ruleId} ${r.gate?.message_en}`);
    const want = P.lines[`${id}>${w}`];
    if (want) expect(last.chat.at(-1)?.text_ka.includes(want), `${id} → W${w}: chat line missing`);
    await synced(last);
  };

  const step = async (id, fn) => {
    try {
      await fn();
      result.steps[id] = "PASS";
    } catch (e) {
      result.steps[id] = e.message === "n/a" ? "n/a" : "FAIL";
      if (e.message !== "n/a") result.error = `${id}: ${e.message}`;
    }
    return result.steps[id] !== "FAIL";
  };

  // A · clean load of the property in this PMS edition and chat channel.
  const loaded = await step("A", async () => {
    let r = await post("property", { propertyId: propId });
    expect(r.ok && r.state.property.id === propId, `property switch: ${r.error}`);
    expect(r.state.folio.charges.every((c) => c.window === null) && !r.state.checkedOut, "switch did not reset the folio");
    if (P.startsOpen) {
      expect(r.state.published && r.state.rules.length === 8, "switch did not open the shift");
      expect(r.state.chat.some((m) => m.from === "guest"), "switch did not load the guest greeting");
      expect(r.state.workspace.skins.pms === "classic", "switch did not apply OPERA v5");
    }
    r = await post("workspace", { pmsSkin, commsSkin });
    expect(r.ok && r.state.workspace.skins.pms === pmsSkin && r.state.workspace.skins.comms === commsSkin, `skins: ${r.error}`);
    r = await post("windows", { action: "preset" });
    expect(r.ok, `windows: ${r.error}`);
    const form = new FormData();
    form.append("file", new Blob([readFileSync(join(root, "src/lib/simustay/fixtures/docs", P.pdf))], { type: "application/pdf" }), P.pdf);
    r = await (await fetch(`${API}/ingest`, { method: "POST", body: form })).json();
    expect(r.ok && r.state.rules.length === 8, `ingest: ${r.error}`);
    r = await post("publish");
    expect(r.ok && r.state.published, `publish: ${r.error}`);
    last = r.state;
    expect(last.chat.some((m) => m.from === "guest"), "no guest greeting");
    expect(last.folio.charges.every((c) => c.window === null), "folio not pristine");
    if (browser) {
      await browser.load();
      const ui = await synced(last, (u) => u.replies.length === last.quickReplies.length);
      expect(ui.commsSkin === commsSkin, `chat renders as ${ui.commsSkin}`);
      expect(ui.headerBg === COMMS[commsSkin].header, `${COMMS[commsSkin].label} header colour ${ui.headerBg}`);
      expect(ui.guest.includes(P.guest), `guest header "${ui.guest}"`);
      expect(ui.pmsSkin === pmsSkin && ui.edition === PMS[pmsSkin].edition, `PMS renders as ${ui.pmsSkin}/${ui.edition}`);
    }
  });
  if (!loaded) { for (const s of STEPS.slice(1)) result.steps[s] ??= "skip"; return result; }

  // B · package/company charges to W2, then the confirmation line in the chat.
  await step("B", async () => {
    for (const id of P.w2) await routed(id, 2);
  });

  // C · the alcohol trap: H2 blocks it and nothing posts.
  await step("C", async () => {
    const caught = last.metrics.errorsCaught;
    const r = await move(P.trap, 2);
    expect(r.gate?.ok === false && r.gate.ruleId === "H2", `expected H2, got ${r.gate?.ruleId}`);
    expect(last.folio.charges.find((c) => c.id === P.trap).window === null, "blocked charge was posted");
    expect(last.metrics.errorsCaught === caught + 1, "error not counted");
    await synced(last);
  });

  // D · guest charges to W1: the guest agrees in the chat and the folio balances.
  await step("D", async () => {
    for (const id of P.w1) await routed(id, 1);
    expect(last.folio.charges.every((c) => c.window !== null), "folio not balanced");
    if (P.balance) {
      const by = { 1: 0, 2: 0 };
      for (const c of last.folio.charges) by[c.window] = (by[c.window] ?? 0) + c.amount;
      expect(by[1] === P.balance[1] && by[2] === P.balance[2], `W1 ${by[1]} / W2 ${by[2]}, expected ${P.balance[1]} / ${P.balance[2]}`);
    }
  });

  // E · check-out: invoice closes, room goes dirty with a housekeeping task, the chat says so.
  await step("E", async () => {
    const r = await finish();
    expect(r.gate?.ok, `finish refused: ${r.gate?.ruleId} ${r.gate?.message_en}`);
    const s = last;
    expect(s.checkedOut, "not checked out");
    expect(s.folio.invoices?.[0]?.no === P.invoice, `invoice ${s.folio.invoices?.[0]?.no}`);
    expect(s.folio.windows.filter((w) => w.closed && w.invoiceNo === P.invoice).length >= 2, "windows not locked");
    expect(s.rooms.find((x) => x.number === P.room)?.status === "dirty", `room ${P.room} not dirty`);
    expect(s.tasks.some((t) => t.room === P.room && t.state === "open"), "no housekeeping task");
    const line = s.chat.at(-1)?.text_ka ?? "";
    expect(line.includes(P.invoice) && (!P.checkoutLine || line.includes(P.checkoutLine)), "check-out line missing from chat");
    await synced(s, (u) => u.invoices.includes(P.invoice) && u.finishDisabled === true);
  });

  // F · a late charge after check-out goes on a supplementary invoice (Ambassadori only).
  await step("F", async () => {
    const r = await post("folio/late-charge");
    expect(r.ok, r.error);
    if (!P.supplementary) {
      expect(r.skipped === true, "late charge posted on a property without one");
      throw new Error("n/a");
    }
    last = r.state;
    await synced(last);
    const { chargeId, no, total } = P.supplementary;
    const blocked = await move(chargeId, 2);
    expect(blocked.gate?.ruleId === "H5", `closed invoice not guarded (got ${blocked.gate?.ruleId})`);
    const ok = await move(chargeId, 3);
    expect(ok.gate?.ok, `late charge → W3 refused: ${ok.gate?.ruleId}`);
    await finish();
    const inv = last.folio.invoices?.at(-1);
    expect(inv?.no === no && inv.total === total, `supplementary invoice ${inv?.no} ${inv?.total}`);
    await synced(last, (u) => u.invoices.includes(no));
  });

  return result;
}

// ---- main ---------------------------------------------------------------------------

const pad = (s, n) => String(s).padEnd(n);
const green = (s) => (process.stdout.isTTY ? `\x1b[32m${s}\x1b[0m` : s);
const red = (s) => (process.stdout.isTTY ? `\x1b[31m${s}\x1b[0m` : s);

let browser = null;
let saved = null;
let failed = 0;
try {
  const health = await (await fetch(`${API}/health`)).json().catch(() => null);
  if (health?.store !== "ok") throw new Error(`server not reachable at ${BASE} (start it with npm run demo)`);
  saved = await getState();

  const chrome = findChrome();
  if (chrome) {
    try { browser = await launchBrowser(chrome); } catch (e) { console.log(`(browser unavailable: ${e.message}; running API-only)`); }
  }
  console.log(`SimStay 8-way matrix · ${BASE} · ${browser ? "headless Chrome, clicks + live UI sync" : "API only"}\n`);

  const rows = [];
  let n = 0;
  for (const propId of ["ambassadori", "bioli"]) {
    for (const pmsSkin of ["modern", "classic"]) {
      for (const commsSkin of ["whatsapp", "telegram"]) {
        n += 1;
        const r = await runCombo(propId, pmsSkin, commsSkin, browser);
        const pass = !Object.values(r.steps).some((v) => v === "FAIL" || v === "skip");
        if (!pass) failed += 1;
        rows.push({ n, combo: `${PROPS[propId].label} × ${PMS[pmsSkin].label} × ${COMMS[commsSkin].label}`, ...r, pass });
        process.stdout.write(pass ? "." : "F");
      }
    }
  }
  console.log("\n");

  const header = `| # | ${pad("Combination", 39)} | ${STEPS.map((s) => pad(s, 4)).join(" | ")} | ${pad("UI sync", 7)} | Result |`;
  const rule = header.replace(/[^|]/g, "-");
  console.log(rule);
  console.log(header);
  console.log(rule);
  for (const r of rows) {
    const cells = STEPS.map((s) => pad(r.steps[s] === "PASS" ? "ok" : r.steps[s], 4));
    const sync = browser ? `${r.maxSyncMs} ms` : "-";
    const verdict = r.pass ? green("[PASS]") : red("[FAIL]");
    console.log(`| ${r.n} | ${pad(r.combo, 39)} | ${cells.join(" | ")} | ${pad(sync, 7)} | ${verdict} |`);
  }
  console.log(rule);
  console.log(`Steps: ${STEPS.map((s) => `${s} ${STEP_NAMES[s]}`).join(" · ")}  (n/a: Bioli has no late charge)`);
  for (const r of rows.filter((x) => !x.pass)) console.log(red(`  #${r.n} ${r.combo}: ${r.error}`));
  console.log(failed ? red(`\n${failed} of 8 combinations failed.`) : green("\nAll 8 combinations PASS."));
} catch (e) {
  console.log(red(`matrix aborted: ${e.message}`));
  failed = failed || 1;
} finally {
  await browser?.close();
  // Give the presenter's desk back: property (fresh start snapshot), PMS/chat skins and open windows.
  if (saved) {
    await post("property", { propertyId: saved.property.id }).catch(() => {});
    await post("workspace", { pmsSkin: saved.workspace.skins.pms, commsSkin: saved.workspace.skins.comms }).catch(() => {});
    await post("windows", { action: "sync", openWindows: saved.ui.openWindows, focusedWindow: saved.ui.focusedWindow }).catch(() => {});
  }
}
process.exit(failed ? 1 : 0);
