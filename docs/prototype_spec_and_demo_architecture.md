# SimuStay Prototype Specification & Demo Blueprint

**Product:** SimuStay, an AI-native frontline operating system for hospitality.

**Target:** GITA SmartStay 3.0, Criterion 5 (Prototype Functionality & Viability), 8–10 points.

**Build base:** the existing `SmartStayOS` repository (Next.js 15, React 19, Tailwind 4, zustand, react-rnd windows, manifest-registered apps, grammY Telegram gateway, `@google/genai`).

**Inputs (read-only):**
- `commercialization_redteam_audit.md` (`CRA`);
- `commercialization_dossier.md` (`CD`);
- `hybrid_model_research.md` (`HM`);
- `pms_onboarding_research.md` (`BL`);
- `problem.md` (`PR`).

**Date:** 2026-09-27.

---

## 0. Decisions in One Table

| Decision | Choice | Why (Criterion 5 lens) |
|---|---|---|
| Runtime | **One Next.js process** (`next build && next start`), no FastAPI, no Streamlit | The repo already ships a windowed desktop shell (`src/os/shell/*`), an app registry and a demo mode that renders **without Supabase** (`src/app/page.tsx` `demoContext()`; `src/middleware.ts` skips auth when Supabase env is absent). A second runtime adds a second failure point on stage and a cross-language state bridge. Streamlit cannot render the multi-window desktop that is the product's visual thesis |
| App packaging | **4 new registry apps** under `apps/`: `simustay-ingest`, `simustay-desk`, `simustay-board`, `simustay-phone` | Adding an app needs only `apps/<id>/smartstay-app.json` + `ui/Window.tsx`, with no edits to hand-written `src/` (`apps/README.md`, "zero-code proof") |
| State | **In-memory singleton on `globalThis`** + JSON snapshots; no database on stage | Zero setup. Deterministic reset in < 50 ms. Immune to network |
| Live updates | **Server-Sent Events** (`/api/simustay/stream`) with a 1 s polling fallback | Same-machine loopback, no WebSocket server, no Supabase Realtime dependency |
| Mobile interface | **Embedded phone window** (`simustay-phone`, iframe of `/m/hk`) **plus** the same page opened on a real phone over the laptop's hotspot; live Telegram only as optional online extra | Stage-safe: the embedded phone never depends on a cellular signal |
| AI | `@google/genai` direct gateway (`gemini-2.5-flash` default) with **2.5 s timeout → fixture fallback**; `OFFLINE_DEMO=true` forces fixtures with 800 ms simulated latency | The demo can never hang or show an error |
| Grading | **Deterministic rule engine** (TypeScript), no LLM in the grading path | Instant, repeatable, explainable. Implements the three-tier rubric from `HM` §2.6 |
| PMS integration | **`PmsAdapter` interface** with three implementations: `MockPmsAdapter` (stage), `MewsShapedAdapter` (payloads shaped like the Mews Connector API `resources/update`), `CsvExportAdapter` (daily PMS export import) | Answers `CRA` K1 (P3 integration): a real integration seam with a documented target contract, and a universal fallback for PMSs with no API |
| Language | Georgian-first UI and content, English toggle; **button-first, text-second, no voice** | `CRA` §4.1: Whisper ≈105% WER on Georgian; no published ka-GE WER for other engines. Voice is out of the demo |
| Honesty layer | "Mock PMS" label and adapter log visible on stage | Judges trust a prototype that says what is simulated. It pre-empts the "is this real?" question |

---

## 1. Rubric Engineering: Criterion 5

### 1.1 Rubric deconstruction

Rubric text: *"The prototype is functional, well-prepared, demonstrates the viability of the idea, works smoothly, and communicates all key aspects of the solution."*

| Rubric term | What a judge must observe | Prototype mechanism | Evidence on stage |
|---|---|---|---|
| **Functional** | Real inputs produce real, different outputs; not a click-through video | Upload → structured rules (live Gemini or cached). Folio moves are graded by a running rule engine. Phone taps change server state that another window reflects | A judge may pick the wrong window. The gate fires with a *different* explanation than the scripted mistake |
| **Well-prepared** | No fumbling, no dead time, no login screens | Pre-arranged window layout. One-key reset. Preflight script. Production build | Reset between rehearsals in < 1 s; zero loading spinners > 1 s |
| **Viability** | This could run in a real Georgian hotel next month | Georgian content; PMS adapter seam with a named real API contract; CSV fallback; unit-economics tile | Adapter log line: `PATCH resources/update {State:"Inspected"}` (shaped like the Mews Connector API) |
| **Works smoothly** | No freezes, errors or waiting | Timeouts + fixtures; SSE with polling fallback; error boundaries (`AppErrorBoundary.tsx` already exists) | 90-s path rehearsed ≥ 20 times with automated e2e |
| **Communicates all key aspects** | Problem → mechanism → result, visible in the product itself | 4 pillars mapped to 4 screens; a live **Impact HUD** counting caught errors, room-ready time, manager interventions avoided (labelled "demo session") | Final frame shows all four screens with the HUD |

### 1.2 Point-loss risks and counters

| Typical deduction | Counter |
|---|---|
| "It's a chatbot / quiz" | Show the **PMS room board** change state from the phone, and the adapter payload |
| "The AI part is canned" | Toggle online mode for one live ingestion of a *judge-supplied* rule sentence (optional beat, §5.3). Otherwise say plainly: "offline cache for stage reliability; live mode available" |
| "Doesn't work in Georgian" | All trainee-facing and housekeeper-facing text is in Georgian; the ingested document is bilingual |
| "No integration" | Adapter interface + Mews-shaped payload + CSV import button on the board |
| Demo crash | §4 dual-mode architecture; backup laptop; recorded MP4 |

---

## 2. The 90-Second Happy Path

### 2.1 Demo narrative

**Setup:** the fictional **"Alazani Wine Hotel", 40 rooms, Telavi**. The corporate guest is **Giorgi Beridze from "Alazani Capital"**, a fictional company.

Do not use a real company (e.g., TBC Bank) as the corporate account. A real brand on stage implies a relationship that does not exist.

### 2.2 Second-by-second choreography

**Screen layout:**
- Projector 1920×1080.
- Desktop windows pre-positioned: Ingest (top-left), Desk (centre, large), Board (right), Phone (bottom-right).

| t (s) | Presenter action | Screen response | Pillar | Spoken line (≤ 12 words) |
|---|---|---|---|---|
| 0–4 | Focus **Ingest** window; drag `alazani_house_rules.pdf` onto the dropzone | Dropzone pulses; "Reading 2 pages…" | 1 | "This is a real hotel's house-rules PDF, in Georgian." |
| 4–6 | — | 800 ms later: 6 rule cards animate in, colour-coded **H** (red), **P** (amber), **D** (grey). Each has a source quote with a page badge | 1 | "Rules extracted, tiered, each linked to its source line." |
| 6–10 | Click **"Publish to training"** | Toast: "Scenario pack v1 published: 3 scenarios". The Desk window title changes to "Shift: Check-in, Room 204" | 1→2 | "Published. Now a new receptionist's first shift." |
| 10–18 | Focus **Desk** | Guest chat bubble (Georgian): "გამარჯობა, გიორგი ვარ, Alazani Capital-დან. ოთახს კომპანია იხდის." (Hello, I'm Giorgi from Alazani Capital. The company pays for the room.) Folio shows charges: Room 180, Tax 32.40, Minibar 45, Restaurant 68 | 2 | "Corporate guest. Company pays the room." |
| 18–24 | Drag **Room** and **Tax** chips into **Window 2 (Alazani Capital, direct bill)** | Both chips turn green; HUD: "✓ H1 room and tax follow the corporate agreement" | 2 | — |
| 24–32 | Drag **Minibar** into **Window 2** (deliberate mistake) | **Error gate** slides up in red: "✗ H2: incidentals are guest-paid. Source: house rules p.1, «მინიბარი და რესტორანი — სტუმარს»". Posting blocked; chip snaps back | 3 | "Mistake caught *before* posting, with the hotel's own rule." |
| 32–38 | Drag Minibar and Restaurant into **Window 1 (Guest)** | Green; HUD score 4/4; banner "Folio balanced: W1 113.00 / W2 212.40" | 3 | "Corrected. Balanced. No supervisor needed." |
| 38–42 | Click **"Finish check-out"** | Board: room 204 → **Dirty** (red); phone window buzzes: new task | 4 | "Guest leaves. Housekeeping gets the room instantly." |
| 42–60 | In **Phone**, tap task "ოთახი 204" → checklist of 5 big buttons (bed, bathroom, minibar restock, amenities, floor) → tap all → tap 📷 (pre-loaded photo) → **"დასუფთავებულია" (Cleaned)** | Board: 204 → **Clean** (green); adapter log: `resources/update 204 Clean → 200 (mock)` | 4 | "Five taps, one photo. The PMS updates itself." |
| 60–70 | In Phone, switch role chip to **Supervisor**; tap **"შემოწმებულია" (Inspected)** | Board: 204 → **Clean & Inspected** (blue, "sellable"); log line appended | 4 | "Supervisor inspects; the room is sellable." |
| 70–85 | Point at the **Impact HUD** strip | "Errors caught before posting: 1 · Manager interventions avoided: 2 · Room 204 ready: 00:28 after checkout · Georgian ✓ · PMS: Mews-shaped adapter" | All | "Every step measured: that is our pilot metric." |
| 85–90 | — | Hold the frame | — | "SimuStay: trained, verified, integrated, in Georgian." |

**Timing budget:**
- Every server round-trip is ≤ 800 ms, whether simulated or local.
- Worst-case online path: 2.5 s timeout, then fixture. Only the ingestion beat is exposed to it.

### 2.3 What is real versus simulated (show on a slide, say once)

| Component | On stage | Real in prototype? |
|---|---|---|
| Rule extraction | Cached extraction of the demo PDF (offline) or live Gemini call (online) | **Real pipeline**: the same code path, with fixture fallback |
| Rule tiering and grading | Deterministic engine | **Real** |
| Guest dialogue | Scripted beats; online mode may paraphrase with the LLM | Scripted by design (deterministic assessment) |
| Housekeeping app | Real web app, same page on a phone | **Real** |
| PMS | `MockPmsAdapter` with the Mews-shaped payload log | **Mock**. Adapter interface real; Mews and CSV adapters stubbed / partial (§6.6) |
| Impact numbers | Computed from this session's events | **Real computation** on demo data |

---

## 3. Stack and Architecture

### 3.1 Stack

| Layer | Choice | Already in repo? |
|---|---|---|
| UI | Next.js 15 App Router, React 19, Tailwind 4, `motion`, `lucide-react`, `react-rnd` windows | Yes |
| Client state | zustand (window store exists) + a small `useSimuStream` hook | Yes / new hook |
| Server | Next.js Route Handlers (`runtime = "nodejs"`) | Yes |
| State | `globalThis.__simustay` singleton + `fixtures/*.json` | New |
| AI | `@google/genai` (direct, not via `src/lib/ai/router.ts`, which writes `ai_runs` to Supabase) | Package yes; gateway new |
| Telegram (optional) | grammY bot already in `src/lib/telegram/*`; SimuStay adds one command handler | Yes |
| Tests | vitest (grader), Playwright (happy path) | Yes |
| Fonts | `next/font/google` **Inter** + **Noto Sans Georgian** (self-hosted at build time) | Inter yes; Georgian font new |

**No new npm dependencies are required.** Ingestion sends the PDF to Gemini as `inlineData` (application/pdf). Offline mode keys fixtures by SHA-256 using `node:crypto`.

### 3.2 Component diagram

```
┌───────────────────────── Browser (projector laptop) ─────────────────────────┐
│ DesktopShell (existing)                                                        │
│  ┌ simustay-ingest ┐ ┌ simustay-desk ┐ ┌ simustay-board ┐ ┌ simustay-phone ┐    │
│  │ dropzone, rules │ │ folio + chat  │ │ room grid,     │ │ <iframe /m/hk> │    │
│  │ tier cards      │ │ + grader HUD  │ │ adapter log    │ │                │    │
│  └────────┬────────┘ └──────┬────────┘ └───────┬────────┘ └───────┬────────┘    │
│           │  fetch POST     │  fetch POST      │ EventSource       │ fetch POST  │
└───────────┼─────────────────┼──────────────────┼───────────────────┼────────────┘
            ▼                 ▼                  ▲                   ▼
┌──────────────────────── Next.js server (same laptop, :3000) ─────────────────────┐
│ /api/simustay/ingest  /folio/move  /folio/finish  /hk/complete  /hk/inspect      │
│ /stream (SSE)  /state  /reset  /mode  /health  /csv-import                       │
│        │                   │                      │                               │
│        ▼                   ▼                      ▼                               │
│  ai-gateway.ts ──►   grader.ts (pure)      pms/adapter.ts ─► MockPmsAdapter       │
│  (online|offline)          │                      │        ├► MewsShapedAdapter   │
│        │                   ▼                      │        └► CsvExportAdapter    │
│        └──────────►  store.ts (globalThis singleton, event bus, snapshots)        │
│                            ▲                                                       │
│                     fixtures/*.json (rules, scenarios, photos, snapshots)          │
└───────────────────────────────────────────────────────────────────────────────────┘
      optional: phone on laptop hotspot → http://<laptop-ip>:3000/m/hk
      optional: Telegram bot (online only) → same /api/simustay/hk/* handlers
```

### 3.3 Domain model

```ts
// src/lib/simustay/types.ts
export type Tier = "H" | "P" | "D";               // Hard invariant | signed Policy | Discretion
export type RoomStatus = "occupied" | "dirty" | "clean" | "inspected" | "ooo" | "oos";

export interface SourceSpan { page: number; quote: string }

export interface Rule {
  id: string;                    // "H2"
  tier: Tier;
  title_ka: string;
  title_en: string;
  source: SourceSpan;
  // machine form used by the grader (only H and P tiers are graded)
  check?:
    | { kind: "route"; chargeCodes: string[]; payer: "company" | "guest" }
    | { kind: "window_requires_payee" }
    | { kind: "balanced" }
    | { kind: "sell_requires"; status: "inspected" };
}

export interface Charge { id: string; code: "ROOM" | "TAX" | "MINIBAR" | "REST"; label_ka: string; amount: number; window: 1 | 2 | 3 | 4 | null }
export interface FolioWindow { n: 1 | 2 | 3 | 4; payee: string | null; payerType: "guest" | "company" | null; method: "card" | "direct_bill" | null }
export interface Folio { reservationId: string; room: string; guest: string; company: string | null; windows: FolioWindow[]; charges: Charge[] }

export interface Room { number: string; type: string; status: RoomStatus; updatedAt: number }
export interface HkTask { id: string; room: string; checklist: { id: string; label_ka: string; done: boolean }[]; photo: string | null; state: "open" | "cleaned" | "inspected" }

export interface GateResult { ok: boolean; ruleId: string; tier: Tier; message_ka: string; message_en: string; source?: SourceSpan }

export interface Metrics { errorsCaught: number; interventionsAvoided: number; checkoutAt: number | null; readyAt: number | null }

export interface SimuState {
  mode: "online" | "offline";
  rules: Rule[];
  published: boolean;
  folio: Folio;
  rooms: Room[];
  tasks: HkTask[];
  chat: { from: "guest" | "system"; text_ka: string; text_en: string }[];
  adapterLog: { t: number; line: string }[];
  metrics: Metrics;
  version: number;               // monotonically increasing; clients drop stale frames
  forceTimeout?: boolean;        // test hook: set via POST /mode {forceTimeout:true}
}
```

---

## 4. Failsafe Engineering ("Anti-Demo-Curse")

### 4.1 Failure matrix

| Failure on stage | Detection | Automatic response | Presenter action |
|---|---|---|---|
| Hall Wi-Fi slow or down | AI call exceeds 2.5 s, or DNS error | Gateway returns the fixture; `mode` flips to `offline` and a small grey "offline cache" chip appears | None |
| Gemini returns malformed JSON | Schema validation (zod) fails | Fixture fallback | None |
| Unknown PDF offline (judge hands a file) | SHA-256 not in fixtures | Returns the **closest fixture** with a banner "Offline: showing cached extraction of the demo pack" | Say so; offer the online beat later |
| SSE drops | `EventSource.onerror` | Client switches to polling `/api/simustay/state` every 1 s until SSE reconnects | None |
| Browser tab crash | — | Reopen; server state persists in memory | Ctrl+Shift+R restores the beat snapshot |
| Server process crash | `/api/simustay/health` fails in preflight | `npm run demo` restarts; state reloads from `fixtures/snapshots/start.json` | Restart (≈3 s on the production build) |
| Laptop failure | — | Backup laptop running the identical build, same layout | Swap HDMI |
| Projector resolution changes | — | Layout presets for 1920×1080 and 1366×768 (Ctrl+Shift+1 / 2) | Press preset |
| Everything fails | — | 90-s MP4 recording of the happy path, on desktop and USB | Play video |

### 4.2 Dual-mode AI gateway

```ts
// src/lib/simustay/ai-gateway.ts
import "server-only";
import { createHash } from "node:crypto";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import rulesFixture from "@/lib/simustay/fixtures/rules.alazani.json";
import { getStore } from "./store";

const RuleZ = z.object({
  id: z.string(), tier: z.enum(["H", "P", "D"]),
  title_ka: z.string(), title_en: z.string(),
  source: z.object({ page: z.number(), quote: z.string() }),
});
const ExtractionZ = z.object({ rules: z.array(RuleZ).min(1) });

const FIXTURES: Record<string, unknown> = {
  // sha256 of fixtures/docs/alazani_house_rules.pdf, filled by `npm run demo:fixtures`
  [process.env.SIMUSTAY_DEMO_PDF_SHA ?? "demo"]: rulesFixture,
};
const TIMEOUT_MS = Number(process.env.SIMUSTAY_AI_TIMEOUT_MS ?? 2500);
const SIM_LATENCY_MS = 800;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function extractRules(pdf: Buffer): Promise<{ rules: z.infer<typeof RuleZ>[]; source: "live" | "cache"; note?: string }> {
  const sha = createHash("sha256").update(pdf).digest("hex");
  const cached = FIXTURES[sha];
  const store = getStore();
  const offline = process.env.OFFLINE_DEMO === "true" || store.state.mode === "offline" || !process.env.GEMINI_API_KEY;

  if (offline) {
    await sleep(SIM_LATENCY_MS);
    const data = ExtractionZ.parse(cached ?? rulesFixture);
    return { rules: data.rules, source: "cache", note: cached ? undefined : "offline: cached demo pack shown" };
  }

  try {
    if (store.state.forceTimeout) throw new Error("forced timeout (test hook)");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const call = ai.models.generateContent({
      model: process.env.SIMUSTAY_MODEL ?? "gemini-2.5-flash",
      contents: [{ role: "user", parts: [
        { inlineData: { mimeType: "application/pdf", data: pdf.toString("base64") } },
        { text: EXTRACTION_PROMPT },
      ] }],
      config: { responseMimeType: "application/json", temperature: 0 },
    });
    const res = await Promise.race([call, sleep(TIMEOUT_MS).then(() => { throw new Error("timeout"); })]);
    const data = ExtractionZ.parse(JSON.parse(res.text ?? ""));
    return { rules: data.rules, source: "live" };
  } catch {
    store.setMode("offline");                          // circuit breaker: stay offline for the rest of the demo
    const data = ExtractionZ.parse(cached ?? rulesFixture);
    return { rules: data.rules, source: "cache", note: "network slow: cached extraction shown" };
  }
}

const EXTRACTION_PROMPT = `You extract hotel operating rules. Return JSON {"rules":[...]}.
Each rule: id (H1.. for accounting/inventory invariants, P1.. for signed house policy, D1.. for discretionary),
tier ("H"|"P"|"D"), title_ka (Georgian), title_en, source {page, quote} where quote is VERBATIM text from the document.
Never invent rules not present in the document. Discretionary rules ("at manager's discretion") are tier D.`;
```

**Rule:** the grader never calls the gateway. Only ingestion (and the optional chat paraphrase) touch the network.

### 4.3 Store with snapshots and event bus

```ts
// src/lib/simustay/store.ts
import "server-only";
import start from "@/lib/simustay/fixtures/snapshots/start.json";
import type { SimuState } from "./types";

type Listener = (s: SimuState) => void;
interface Store { state: SimuState; listeners: Set<Listener>; setMode(m: SimuState["mode"]): void; commit(mut: (s: SimuState) => void): SimuState; reset(snapshot?: SimuState): SimuState; subscribe(l: Listener): () => void }

declare global { var __simustay: Store | undefined } // eslint-disable-line no-var

const clone = <T,>(v: T): T => structuredClone(v);

function create(): Store {
  const initial = clone(start) as SimuState;
  initial.mode = process.env.OFFLINE_DEMO === "true" ? "offline" : "online";
  const store: Store = {
    state: initial,
    listeners: new Set(),
    setMode(m) { store.commit((s) => { s.mode = m; }); },
    commit(mut) {
      const next = clone(store.state);
      mut(next);
      next.version = store.state.version + 1;
      store.state = next;
      store.listeners.forEach((l) => { try { l(next); } catch { /* never let a dead client break a commit */ } });
      return next;
    },
    reset(snapshot) {
      const s = clone((snapshot ?? start) as SimuState);
      s.mode = store.state.mode;
      s.version = store.state.version + 1;
      store.state = s;
      store.listeners.forEach((l) => l(s));
      return s;
    },
    subscribe(l) { store.listeners.add(l); return () => store.listeners.delete(l); },
  };
  return store;
}

// globalThis guarantees ONE instance across all route bundles in `next start`
export const getStore = (): Store => (globalThis.__simustay ??= create());
```

### 4.4 SSE endpoint and client hook

```ts
// src/app/api/simustay/stream/route.ts
import { getStore } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const store = getStore();
  const enc = new TextEncoder();
  let unsub = () => {};
  let ping: ReturnType<typeof setInterval>;
  const stream = new ReadableStream({
    start(ctrl) {
      const send = (s: unknown) => ctrl.enqueue(enc.encode(`data: ${JSON.stringify(s)}\n\n`));
      send(store.state);
      unsub = store.subscribe(send);
      ping = setInterval(() => ctrl.enqueue(enc.encode(`: ping\n\n`)), 10_000);
    },
    cancel() { unsub(); clearInterval(ping); },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" } });
}
```

```ts
// src/lib/simustay/useSimuStream.ts
"use client";
import { useEffect, useRef, useState } from "react";
import type { SimuState } from "./types";

export function useSimuStream() {
  const [state, setState] = useState<SimuState | null>(null);
  const version = useRef(-1);
  useEffect(() => {
    let es: EventSource | null = null;
    let poll: ReturnType<typeof setInterval> | null = null;
    const accept = (s: SimuState) => { if (s.version > version.current) { version.current = s.version; setState(s); } };
    const startPoll = () => { if (!poll) poll = setInterval(async () => { try { accept(await (await fetch("/api/simustay/state", { cache: "no-store" })).json()); } catch {} }, 1000); };
    const open = () => {
      es = new EventSource("/api/simustay/stream");
      es.onmessage = (e) => { accept(JSON.parse(e.data)); if (poll) { clearInterval(poll); poll = null; } };
      es.onerror = () => { es?.close(); startPoll(); setTimeout(open, 2000); };
    };
    open();
    return () => { es?.close(); if (poll) clearInterval(poll); };
  }, []);
  return state;
}

export async function act(path: string, body?: unknown) {
  const res = await fetch(`/api/simustay/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body ?? {}) });
  return res.json();   // routes never throw to the client; they return { ok, gate?, state }
}
```

### 4.5 Route-handler contract (never throw)

Every POST route wraps its body:

```ts
// src/lib/simustay/safe.ts
import { getStore } from "./store";
export function safe<T>(fn: () => Promise<T> | T) {
  return async () => {
    try { return Response.json({ ok: true, ...(await fn()) }); }
    catch (e) { return Response.json({ ok: false, error: String(e), state: getStore().state }, { status: 200 }); }
  };
}
```

Status 200 even on failure. The UI shows a neutral toast, never an error page. Every failure path is covered by the e2e suite in §6.8.

### 4.6 Presenter controls (hidden, keyboard)

| Keys | Action |
|---|---|
| Ctrl+Shift+R | `POST /reset` to `start.json` (full reset) |
| Ctrl+Shift+B | Restore the "before check-out" snapshot (jump to beat 38 s) |
| Ctrl+Shift+O | Toggle online/offline (`POST /mode`) |
| Ctrl+Shift+1 / 2 | Window layout preset 1920×1080 / 1366×768 |
| Ctrl+Shift+A | **Autopilot**: plays the scripted beats with 1.2 s spacing (backup if the presenter's hands are busy with the clicker) |

---

## 5. Screens (UI/UX Specification)

**Visual system:**
- Existing dark OS theme.
- Tier colours: **H** `#EF4444`, **P** `#F59E0B`, **D** `#94A3B8`.
- Room status: occupied `#6366F1`, dirty `#EF4444`, clean `#22C55E`, inspected `#3B82F6`, OOO `#111827` with a stripe, OOS `#A855F7`.
- Minimum font size 16 px on projector windows; phone targets ≥ 56 px high.

### 5.1 Screen A: Ingest (`simustay-ingest`, 560×520)

```
┌ Rule Studio: Alazani Wine Hotel ───────────────────────── ● online ┐
│ ┌──────────────────────────────────────────────────────────────┐    │
│ │   ⤓  Drop house rules (PDF / photo)                          │    │
│ │      alazani_house_rules.pdf · 2 pages · ka/en               │    │
│ └──────────────────────────────────────────────────────────────┘    │
│  H  H1 Room & tax → company (corporate agreement)       p.1 ❝…❞    │
│  H  H2 Minibar & restaurant → guest                     p.1 ❝…❞    │
│  H  H3 Every non-guest window needs payee + method      p.1 ❝…❞    │
│  P  P1 Direct bill needs company letter or email        p.2 ❝…❞    │
│  P  P2 Room sellable only after inspection              p.2 ❝…❞    │
│  D  D1 Late checkout to 14:00 for VIP, manager decides  p.2 ❝…❞    │
│                                                                     │
│  Graded: H + P (5)   Coached only: D (1)      [ Publish to training ]│
└─────────────────────────────────────────────────────────────────────┘
```

- Hovering a card shows the verbatim Georgian quote.
- The **D** tier card carries the label "coached, never failed". This makes the false-failure protection from `HM` §2.6 visible.

### 5.2 Screen B: Front-Desk Virtual OS (`simustay-desk`, 1100×640)

```
┌ Shift: Check-in · Room 204 · Trainee: Ana ─────────────────────────────────────────┐
│ ┌ FOLIO · Res #A-1042 · Giorgi Beridze ──────────┐ ┌ GUEST ─────────────────────────┐│
│ │ Charges (drag to a window)                      │ │ 🧑 გამარჯობა, გიორგი ვარ,        ││
│ │ [ROOM 180.00] [TAX 32.40] [MINIBAR 45] [REST 68]│ │   Alazani Capital-დან. ოთახს     ││
│ │                                                 │ │   კომპანია იხდის.               ││
│ │ ┌W1 Guest · card───┐ ┌W2 Alazani Capital·DB ─┐  │ │                                 ││
│ │ │                   │ │                        │  │ │ Quick replies:                  ││
│ │ └───────────────────┘ └────────────────────────┘ │ │ [გთხოვთ, კომპანიის წერილი]       ││
│ │ ┌W3 — ─────────────┐ ┌W4 — ──────────────────┐  │ │ [ოთახი მზადაა]  [დიახ]           ││
│ │ └───────────────────┘ └────────────────────────┘ │ │                                 ││
│ │ Balance W1 0.00 · W2 0.00 · Unrouted 325.40      │ │                                 ││
│ └─────────────────────────────────────────────────┘ └─────────────────────────────────┘│
│ ┌ GRADER HUD ────────────────────────────────────────────────────────────────────────┐│
│ │ ✓ H1 room & tax → company   ✗ H2 minibar must stay with guest (p.1 «…»)  Score 3/4   ││
│ └─────────────────────────────────────────────────────────────────────────────────────┘│
│ [ Finish check-out ]                                                                   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Four folio windows, generic naming.** Windows 101–108, OPERA control names and OPERA screen layouts are deliberately **not** reproduced (`HM` §3.2 legal line).
- **The quick reply "Please, a company letter"** satisfies P1. If the trainee routes to W2 without it, the gate reports P1, and the second demo run can show it.
- **Drag-and-drop** uses native HTML5 DnD. Every chip also has an explicit "→W1 / →W2" button pair so the clicker-only fallback works.

### 5.3 Optional online beat (15 s, only if Wi-Fi is healthy)

- A judge dictates one rule, e.g., "Spa charges go to the company".
- The presenter types it into the Rule Studio "Add sentence" field.
- A live Gemini call returns an **H** card with the typed text as the source.
- Show this only if `/api/simustay/health` reports `ai: ok` < 1.5 s during the preceding minute.

### 5.4 Screen C: Housekeeping phone (`/m/hk`, embedded 390×780 and on a real phone)

```
┌──────────── 9:41 ────────────┐
│ SimuStay · ნინო (Housekeeping)│
│ [ HK ] [ Supervisor ]         │
│ ┌───────────────────────────┐ │
│ │ 🔴 ოთახი 204 · გასვლა     │ │
│ │    დაწყება →               │ │
│ └───────────────────────────┘ │
│ ☐ საწოლი (Bed)                │
│ ☐ სააბაზანო (Bathroom)        │
│ ☐ მინიბარი შევსებულია (Minibar)│
│ ☐ აქსესუარები (Amenities)     │
│ ☐ იატაკი (Floor)              │
│ [ 📷  ფოტო ]                   │
│ ┌───────────────────────────┐ │
│ │    დასუფთავებულია ✓        │ │  ← disabled until 5/5 + photo
│ └───────────────────────────┘ │
└───────────────────────────────┘
```

- Tap targets ≥ 56 px; no text entry needed; **no voice** (`CRA` §4.1).
- The photo input uses `<input type="file" accept="image/*" capture="environment">`. On stage it takes the pre-loaded image, and the upload is optional offline.
- **Supervisor** tab: a list of rooms in "Clean" with a single **"შემოწმებულია" (Inspected)** button.

### 5.5 Screen D: PMS Live Board (`simustay-board`, 520×560)

```
┌ PMS Live Board · Alazani (Mock PMS) ─────────────── Adapter: Mews-shaped ▾ ┐
│ 201 ■occ  202 ■insp 203 ■dirty 204 ■occ  205 ■clean                         │
│ 206 ■insp 207 ■OOO  208 ■occ  209 ■OOS  210 ■insp                           │
│ … (40 rooms, 5×8 grid, colour + text label for colour-blind safety)         │
│ ─────────────────────────────────────────────────────────────────────────── │
│ Adapter log                                                                 │
│ 12:04:31 PATCH resources/update {Id:"204",State:"Dirty"}        → 200 (mock) │
│ 12:04:49 PATCH resources/update {Id:"204",State:"Clean"}        → 200 (mock) │
│ 12:04:58 PATCH resources/update {Id:"204",State:"Inspected"}    → 200 (mock) │
│ [ Import PMS export (CSV) ]                                                 │
│ ═══ IMPACT (this session) ══════════════════════════════════════════════════ │
│ Errors caught pre-posting 1 · Interventions avoided 2 · 204 ready 00:28     │
└─────────────────────────────────────────────────────────────────────────────┘
```

- The status cell animates (scale 1.08, 300 ms) when its state changes.
- The Impact strip reads from `state.metrics` only: computed, not typed in.

---

## 6. Code Scaffolding

### 6.1 File tree (new files only)

```
apps/
  simustay-ingest/
    smartstay-app.json
    ui/Window.tsx
  simustay-desk/
    smartstay-app.json
    ui/Window.tsx
    ui/FolioBoard.tsx
    ui/GuestChat.tsx
    ui/GraderHud.tsx
  simustay-board/
    smartstay-app.json
    ui/Window.tsx
  simustay-phone/
    smartstay-app.json
    ui/Window.tsx                  # <iframe src="/m/hk" />
src/
  app/
    m/hk/page.tsx                  # mobile housekeeping page (also used on a real phone)
    api/simustay/
      state/route.ts               # GET current state
      stream/route.ts              # GET SSE
      ingest/route.ts              # POST multipart PDF → rules
      publish/route.ts             # POST publish rules → scenario pack
      folio/move/route.ts          # POST {chargeId, window} → gate result
      folio/finish/route.ts        # POST → room dirty + HK task
      hk/check/route.ts            # POST {taskId, itemId}
      hk/complete/route.ts         # POST {taskId} → clean
      hk/inspect/route.ts          # POST {room} → inspected
      csv-import/route.ts          # POST CSV → room statuses
      mode/route.ts                # POST {mode}
      reset/route.ts               # POST {snapshot?}
      health/route.ts              # GET {ai, store, sse}
  lib/simustay/
    types.ts
    store.ts
    safe.ts
    grader.ts
    grader.test.ts
    ai-gateway.ts
    useSimuStream.ts
    i18n.ts                        # ka/en strings
    pms/
      adapter.ts                   # interface
      mock.ts
      mews-shaped.ts
      csv-export.ts
      csv-export.test.ts
    fixtures/
      rules.alazani.json
      scenario.checkin-204.json
      snapshots/start.json
      snapshots/before-checkout.json
      docs/alazani_house_rules.pdf
      photos/room204_clean.jpg
scripts/
  demo-preflight.ts
  demo-fixtures.ts                 # computes PDF sha → .env.demo
e2e/
  simustay-happy-path.spec.ts
.env.demo                          # OFFLINE_DEMO, SIMUSTAY_DEMO_PDF_SHA; no Supabase vars
```

### 6.2 App manifest (example; the other three follow the same shape)

```json
{
  "$schema": "../../src/os/registry/smartstay-app.schema.json",
  "manifestVersion": 1,
  "id": "simustay-desk",
  "name": "SimuStay Desk",
  "tagline": "Front-desk shift simulator with live error gates",
  "description": "Trainee handles a corporate check-in on a four-window folio; hotel rules grade every move before posting.",
  "version": "0.1.0",
  "icon": { "lucide": "concierge-bell", "background": "#0EA5E9", "foreground": "#FFFFFF" },
  "window": { "defaultSize": { "w": 1100, "h": 640 }, "minSize": { "w": 760, "h": 480 }, "resizable": true },
  "entry": { "window": "./ui/Window.tsx" },
  "permissions": [],
  "events": { "emits": [], "subscribes": [] }
}
```

Run `npm run registry` (automatic via `predev`/`prebuild`). The generator validates the manifest and registers the window. **No edits to `src/os/*`.**

### 6.3 Grader (deterministic, pure)

```ts
// src/lib/simustay/grader.ts
import type { Folio, GateResult, Rule } from "./types";

export function gateMove(folio: Folio, rules: Rule[], chargeId: string, target: 1 | 2 | 3 | 4): GateResult {
  const charge = folio.charges.find((c) => c.id === chargeId);
  const win = folio.windows.find((w) => w.n === target);
  if (!charge || !win) return { ok: false, ruleId: "SYS", tier: "H", message_ka: "უცნობი მოქმედება", message_en: "Unknown action" };

  for (const r of rules) {
    if (r.tier === "D" || !r.check) continue;                         // discretion is never graded
    if (r.check.kind === "route" && r.check.chargeCodes.includes(charge.code) && win.payerType !== r.check.payer) {
      return { ok: false, ruleId: r.id, tier: r.tier, source: r.source,
        message_ka: `${r.title_ka}`, message_en: `${r.title_en}` };
    }
    if (r.check.kind === "window_requires_payee" && (!win.payee || !win.method)) {
      return { ok: false, ruleId: r.id, tier: r.tier, source: r.source, message_ka: r.title_ka, message_en: r.title_en };
    }
  }
  return { ok: true, ruleId: "OK", tier: "H", message_ka: "სწორია", message_en: "Correct" };
}

export function folioBalanced(folio: Folio): boolean {
  const total = folio.charges.reduce((a, c) => a + c.amount, 0);
  const routed = folio.charges.filter((c) => c.window !== null).reduce((a, c) => a + c.amount, 0);
  return Math.abs(total - routed) < 0.005;
}
```

```ts
// src/lib/simustay/grader.test.ts  (vitest; excerpt)
import { describe, expect, it } from "vitest";
import scenario from "./fixtures/scenario.checkin-204.json";
import rules from "./fixtures/rules.alazani.json";
import { gateMove } from "./grader";

describe("gateMove", () => {
  it("accepts room to company window", () => expect(gateMove(scenario.folio as any, rules.rules as any, "c-room", 2).ok).toBe(true));
  it("blocks minibar to company window with H2", () => {
    const g = gateMove(scenario.folio as any, rules.rules as any, "c-minibar", 2);
    expect(g.ok).toBe(false); expect(g.ruleId).toBe("H2"); expect(g.source?.page).toBe(1);
  });
  it("never grades discretion rules", () => {
    const onlyD = (rules.rules as any[]).filter((r) => r.tier === "D");
    expect(gateMove(scenario.folio as any, onlyD, "c-minibar", 2).ok).toBe(true);
  });
});
```

### 6.4 Folio move route (illustrates the route pattern)

```ts
// src/app/api/simustay/folio/move/route.ts
import { getStore } from "@/lib/simustay/store";
import { gateMove } from "@/lib/simustay/grader";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const store = getStore();
  try {
    const { chargeId, window } = await req.json();
    const gate = gateMove(store.state.folio, store.state.rules, chargeId, window);
    const state = store.commit((s) => {
      if (gate.ok) {
        const c = s.folio.charges.find((x) => x.id === chargeId);
        if (c) c.window = window;
      } else {
        s.metrics.errorsCaught += 1;
      }
    });
    return Response.json({ ok: true, gate, state });
  } catch (e) {
    return Response.json({ ok: false, error: String(e), state: store.state });
  }
}
```

### 6.5 Housekeeping complete and inspect routes (core logic)

```ts
// inside hk/complete/route.ts (wrapped with safe())
const taskRoom = store.state.tasks.find((x) => x.id === taskId)?.room ?? "";
const state = store.commit((s) => {
  const t = s.tasks.find((x) => x.id === taskId);
  if (!t || t.checklist.some((i) => !i.done)) throw new Error("checklist incomplete");
  t.state = "cleaned";
  const room = s.rooms.find((r) => r.number === t.room)!;
  room.status = "clean"; room.updatedAt = Date.now();
});
await pms().setRoomStatus(taskRoom, "clean");          // adapter call → log line (mock) or real HTTP (Mews-shaped)

// inside hk/inspect/route.ts
store.commit((s) => {
  const room = s.rooms.find((r) => r.number === roomNo)!;
  if (room.status !== "clean") throw new Error("only clean rooms can be inspected");
  room.status = "inspected"; room.updatedAt = Date.now();
  s.metrics.readyAt = Date.now();
});
await pms().setRoomStatus(roomNo, "inspected");
```

### 6.6 PMS adapter seam (P3 integration answer)

```ts
// src/lib/simustay/pms/adapter.ts
import type { RoomStatus } from "../types";
export interface PmsAdapter {
  name: string;
  setRoomStatus(room: string, status: RoomStatus): Promise<{ ok: boolean; line: string }>;
  listRooms(): Promise<{ number: string; status: RoomStatus }[]>;
}

// src/lib/simustay/pms/mews-shaped.ts
// Payload shape follows the Mews Connector API "resources/update" operation (State: Dirty|Clean|Inspected|OutOfService|OutOfOrder).
// On stage it runs in dry-run mode (logs the payload, returns 200 mock). With MEWS_* env vars it posts to the Mews demo environment.
const map: Record<RoomStatus, string | null> = { dirty: "Dirty", clean: "Clean", inspected: "Inspected", oos: "OutOfService", ooo: "OutOfOrder", occupied: null };
export const mewsShaped = (dryRun = !process.env.MEWS_CLIENT_TOKEN): PmsAdapter => ({
  name: "Mews-shaped",
  async setRoomStatus(room, status) {
    const State = map[status];
    if (!State) return { ok: true, line: `skip ${room} ${status}` };
    const body = { ResourceUpdates: [{ ResourceId: room, State: { Value: State } }] };
    if (dryRun) return { ok: true, line: `PATCH resources/update ${JSON.stringify({ Id: room, State })} → 200 (mock)` };
    // Online path (post-hackathon): real call with ClientToken/AccessToken; kept out of the stage path.
    return { ok: false, line: "live Mews call disabled in demo build" };
  },
  async listRooms() { return []; },
});
```

Notes:
- `ResourceId` is a GUID in the real API; the demo maps room numbers to fixture GUIDs.
- The body shape must be verified against `api.mews.com/Swagger/connector/swagger.yaml` before any live call. The stage path is dry-run only.

**CSV import** (`csv-export.ts`) accepts `room,status` rows from any PMS daily export, the `CRA` §1.4 "T0 universal import". On stage, one button imports `fixtures/pms_export_sample.csv` to show the path for PMSs without an API (e.g., OtelMS, OPERA 5).

### 6.7 Fixtures (excerpts)

```json
// src/lib/simustay/fixtures/rules.alazani.json
{
  "rules": [
    { "id": "H1", "tier": "H", "title_ka": "ოთახი და გადასახადი — კომპანიის ანგარიშზე (კორპორატიული ხელშეკრულება)", "title_en": "Room and tax go to the company (corporate agreement)",
      "source": { "page": 1, "quote": "კორპორატიული სტუმრებისთვის ოთახი და გადასახადი ეკისრება კომპანიას" },
      "check": { "kind": "route", "chargeCodes": ["ROOM", "TAX"], "payer": "company" } },
    { "id": "H2", "tier": "H", "title_ka": "მინიბარი და რესტორანი — სტუმრის ანგარიშზე", "title_en": "Minibar and restaurant stay with the guest",
      "source": { "page": 1, "quote": "მინიბარი და რესტორანი — სტუმარს" },
      "check": { "kind": "route", "chargeCodes": ["MINIBAR", "REST"], "payer": "guest" } },
    { "id": "H3", "tier": "H", "title_ka": "ყოველ არა-სტუმრის ფანჯარას სჭირდება გადამხდელი და გადახდის მეთოდი", "title_en": "Every non-guest window needs a payee and method",
      "source": { "page": 1, "quote": "კომპანიის ანგარიში — პირდაპირი ანგარიშსწორებით" },
      "check": { "kind": "window_requires_payee" } },
    { "id": "P1", "tier": "P", "title_ka": "კომპანიის ანგარიშზე გადატანა — მხოლოდ კომპანიის წერილით ან ელფოსტით", "title_en": "Direct bill only with a company letter or email",
      "source": { "page": 2, "quote": "საჭიროა კომპანიის წერილი ან ელფოსტა" } },
    { "id": "P2", "tier": "P", "title_ka": "ოთახი იყიდება მხოლოდ შემოწმების შემდეგ", "title_en": "Room is sellable only after inspection",
      "source": { "page": 2, "quote": "ოთახი გაიყიდება მხოლოდ შემოწმების შემდეგ" },
      "check": { "kind": "sell_requires", "status": "inspected" } },
    { "id": "D1", "tier": "D", "title_ka": "გვიანი გასვლა 14:00-მდე VIP სტუმრებისთვის — მენეჯერის შეხედულებით", "title_en": "Late checkout to 14:00 for VIPs, at manager's discretion",
      "source": { "page": 2, "quote": "მენეჯერის შეხედულებით" } }
  ]
}
```

**The demo PDF must contain these quotes verbatim.** Generate it once from a Markdown/HTML source with Noto Sans Georgian embedded. Have a native speaker proofread the Georgian before the event.

### 6.8 End-to-end rehearsal test

```ts
// e2e/simustay-happy-path.spec.ts
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ request }) => { await request.post("/api/simustay/reset"); });

test("90-second happy path, offline", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("ingest-drop").setInputFiles("src/lib/simustay/fixtures/docs/alazani_house_rules.pdf");
  await expect(page.getByTestId("rule-card")).toHaveCount(6, { timeout: 3000 });
  await page.getByRole("button", { name: /Publish/ }).click();
  await page.getByTestId("to-w2-c-room").click();
  await page.getByTestId("to-w2-c-tax").click();
  await page.getByTestId("to-w2-c-minibar").click();
  await expect(page.getByTestId("gate")).toContainText("H2");
  await page.getByTestId("to-w1-c-minibar").click();
  await page.getByTestId("to-w1-c-rest").click();
  await page.getByRole("button", { name: /Finish/ }).click();
  const phone = page.frameLocator("[data-testid=phone-frame]");
  await phone.getByText("204").click();
  for (const id of ["bed", "bath", "minibar", "amenities", "floor"]) await phone.getByTestId(`chk-${id}`).click();
  await phone.getByTestId("hk-complete").click();
  await expect(page.getByTestId("room-204")).toHaveAttribute("data-status", "clean", { timeout: 2000 });
  await phone.getByTestId("role-supervisor").click();
  await phone.getByTestId("inspect-204").click();
  await expect(page.getByTestId("room-204")).toHaveAttribute("data-status", "inspected", { timeout: 2000 });
});

test("AI timeout falls back to cache without error", async ({ page, request }) => {
  await request.post("/api/simustay/mode", { data: { mode: "online", forceTimeout: true } });
  await page.goto("/");
  await page.getByTestId("ingest-drop").setInputFiles("src/lib/simustay/fixtures/docs/alazani_house_rules.pdf");
  await expect(page.getByTestId("rule-card")).toHaveCount(6, { timeout: 4000 });
  await expect(page.getByTestId("mode-chip")).toContainText("offline");
});
```

### 6.9 Dependencies and scripts

`requirements.txt`: **not applicable** (no Python).

`package.json` additions (scripts only):

```json
{
  "scripts": {
    "demo:fixtures": "node --import tsx scripts/demo-fixtures.ts",
    "demo:build": "npm run registry && next build",
    "demo": "env $(grep -v '^#' .env.demo | xargs) next start -p 3000 -H 0.0.0.0",
    "demo:check": "node --import tsx scripts/demo-preflight.ts",
    "demo:e2e": "OFFLINE_DEMO=true playwright test e2e/simustay-happy-path.spec.ts"
  }
}
```

`.env.demo`:

```sh
OFFLINE_DEMO=true
SIMUSTAY_DEMO_PDF_SHA=<written by demo:fixtures>
SIMUSTAY_AI_TIMEOUT_MS=2500
# GEMINI_API_KEY=...            # only for the optional online beat
# NEXT_PUBLIC_SUPABASE_URL deliberately unset → demo context, middleware skips auth
```

Layout font addition (`src/app/layout.tsx`):

```ts
import { Inter, Noto_Sans_Georgian } from "next/font/google";
const georgian = Noto_Sans_Georgian({ subsets: ["georgian"], variable: "--font-georgian" });
// <html className={`${inter.variable} ${georgian.variable}`}>; CSS: font-family: var(--font-inter), var(--font-georgian)
```

### 6.10 Launch

```sh
npm install
npm run demo:fixtures          # hashes the demo PDF into .env.demo
npm run demo:build             # production build (fonts self-hosted; no CDN at runtime)
npm run demo                   # http://localhost:3000  and  http://<laptop-ip>:3000/m/hk on the phone
npm run demo:check             # preflight: health, SSE, reset, fixtures, fonts, layout preset
npm run demo:e2e               # full rehearsal, must pass 3× in a row before going on stage
```

**Preflight checks** (`scripts/demo-preflight.ts`) exit non-zero on any failure:
1. `GET /api/simustay/health` → `{store:"ok", sse:"ok"}` in < 200 ms.
2. `POST /reset` → version increments.
3. Fixture PDF SHA matches `.env.demo`.
4. `GET /m/hk` returns 200.
5. No network request to any host other than localhost during a scripted run. Playwright request interception verifies this in `demo:e2e`.

---

## 7. 12-Hour Build Plan (3 people)

| Hour | Dev A (server / engine) | Dev B (desk + ingest UI) | Dev C (phone + board + demo ops) |
|---|---|---|---|
| 0–1 | `types.ts`, `store.ts`, `safe.ts`; `start.json` snapshot | 4 manifests; registry runs; empty windows render | Demo PDF authored (ka/en) + native proofread started; fixtures skeleton |
| 1–3 | `grader.ts` + vitest; folio/move, finish routes | Folio board (chips, 4 windows, click-to-route buttons) | `/m/hk` page (checklist, photo, complete); hk routes with A |
| 3–5 | SSE `stream` + `state` + `useSimuStream`; reset / mode / health | Grader HUD + gate animation; guest chat scripted beats | Board grid + adapter log + CSV import |
| 5–7 | `ai-gateway.ts` (online + timeout + fixtures); ingest + publish routes | Rule Studio dropzone + tier cards + source quotes | Phone window iframe; layout presets; presenter hotkeys |
| 7–8 | PMS adapter seam (mock + Mews-shaped dry-run + CSV) | Georgian i18n pass; Noto Sans Georgian | Impact HUD metrics |
| 8–10 | Playwright happy path + failure tests | Visual polish (motion on state change; contrast on projector) | Rehearsal ×10 with a stopwatch; record MP4 backup |
| 10–11 | Bug fixes from rehearsal | Bug fixes | Backup laptop: identical build, preflight |
| 11–12 | **Feature freeze.** `demo:e2e` 3× green | — | Final rehearsal ×5; script cards |

**Cut list (if behind schedule, in this order):**
1. Optional online beat.
2. CSV import button.
3. Real-phone access (keep the embedded phone).
4. Drag-and-drop (keep the click-to-route buttons).
5. Chat quick replies.

**Never cut:** reset, the offline fixtures and the e2e run.

---

## 8. Stage-Day Runbook

| When | Check |
|---|---|
| T−60 min | Both laptops: `npm run demo`, `demo:check`, `demo:e2e` green. Wi-Fi **off** on the primary (offline mode is the default) |
| T−30 min | Projector resolution confirmed; layout preset applied; font size readable from the back row |
| T−10 min | Ctrl+Shift+R reset; phone connected to the laptop hotspot showing `/m/hk` (optional); MP4 loaded in a background tab |
| On stage | Follow §2.2. If any beat stalls > 2 s: Ctrl+Shift+B (snapshot) or Ctrl+Shift+A (autopilot). Never debug live |
| Q&A | "What's mocked?": show the §2.3 slide. "Integration?": show the adapter seam and CSV import. "Georgian voice?": say voice is deliberately off until Georgian ASR passes a 300-utterance benchmark (`CRA` §9 K4) |

---

## 9. Residual Risks

| Risk | Mitigation in this spec | Residual |
|---|---|---|
| Judges discount a mock PMS | Visible adapter seam with a named real-API payload shape; CSV path; honest labelling | Moderate: a live PMS sandbox call would be stronger (post-hackathon: Mews demo environment) |
| Georgian text errors in fixtures | Native-speaker proofread; single source file for PDF and fixtures | Low |
| Dev-mode compile lag | Production build only on stage | Low |
| Hot-reload duplicate stores | `globalThis` singleton; production build | Low |
| Projector colour washes out tier / status colours | Colour + text labels on every cell and card | Low |
| Over-claiming impact numbers | HUD labelled "this session"; the pilot metrics described in the pitch are the ones defined in `CRA` §9 K2 / K10 | Low |
