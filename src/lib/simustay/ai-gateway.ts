// Dual-mode AI gateway (spec §4.2). Offline: fixture after a fixed simulated latency.
// Online: one Gemini call with a hard timeout; any failure trips the breaker to offline.
import { createHash } from "node:crypto";
import rulesFixture from "@/lib/simustay/fixtures/rules.alazani.json";
import { getStore } from "./store";
import type { Rule, RuleCheck, Tier } from "./types";

const TIMEOUT_MS = Number(process.env.SIMUSTAY_AI_TIMEOUT_MS ?? 2500);
const SIM_LATENCY_MS = Number(process.env.SIMUSTAY_SIM_LATENCY_MS ?? 800);
const FIXTURE_RULES = rulesFixture.rules as Rule[];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const EXTRACTION_PROMPT = `You extract hotel operating rules. Return JSON {"rules":[...]}.
Each rule: id (H1.. for accounting/inventory invariants, P1.. for signed house policy, D1.. for discretionary),
tier ("H"|"P"|"D"), title_ka (Georgian), title_en, source {page, quote} where quote is VERBATIM text from the document.
Never invent rules not present in the document. Discretionary rules ("at manager's discretion") are tier D.`;

export interface Extraction {
  rules: Rule[];
  pages: number;
  source: "live" | "cache";
  note?: string;
}

function validate(raw: unknown): Rule[] {
  const list = (raw as { rules?: unknown })?.rules;
  if (!Array.isArray(list) || list.length === 0) throw new Error("schema: rules[] missing");
  return list.map((r, i) => {
    const x = r as Record<string, unknown>;
    const src = x.source as Record<string, unknown> | undefined;
    const tier = x.tier as Tier;
    if (typeof x.id !== "string" || !["H", "P", "D"].includes(tier)) throw new Error(`schema: rule ${i} id/tier`);
    if (typeof x.title_ka !== "string" || typeof x.title_en !== "string") throw new Error(`schema: rule ${i} titles`);
    if (!src || typeof src.page !== "number" || typeof src.quote !== "string") throw new Error(`schema: rule ${i} source`);
    return { id: x.id, tier, title_ka: x.title_ka, title_en: x.title_en, source: { page: src.page, quote: src.quote } };
  });
}

// Live extraction yields text only; machine checks for known rule ids come from the reviewed fixture.
function attachChecks(rules: Rule[]): Rule[] {
  const known = new Map<string, RuleCheck | undefined>(FIXTURE_RULES.map((r) => [r.id, r.check]));
  return rules.map((r) => (r.check || !known.get(r.id) ? r : { ...r, check: known.get(r.id) }));
}

const cachedPack = (): Rule[] => structuredClone(FIXTURE_RULES);

async function callGemini(pdf: Buffer, mimeType: string, signal: AbortSignal): Promise<Rule[]> {
  const model = process.env.SIMUSTAY_MODEL ?? "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY ?? "" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ inlineData: { mimeType, data: pdf.toString("base64") } }, { text: EXTRACTION_PROMPT }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0 },
    }),
  });
  if (!res.ok) throw new Error(`gemini http ${res.status}`);
  const json = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  return attachChecks(validate(JSON.parse(text)));
}

export async function extractRules(file: Buffer, mimeType = "application/pdf"): Promise<Extraction> {
  const store = getStore();
  const sha = createHash("sha256").update(file).digest("hex");
  const isDemoPack = file.length === 0 || sha === process.env.SIMUSTAY_DEMO_PDF_SHA;
  const pages = rulesFixture.document.pages;
  const offline = process.env.OFFLINE_DEMO === "true" || store.state.mode === "offline" || !process.env.GEMINI_API_KEY;

  if (offline) {
    await sleep(SIM_LATENCY_MS);
    return {
      rules: cachedPack(),
      pages,
      source: "cache",
      note: isDemoPack ? undefined : "ოფლაინ: ნაჩვენებია დემო პაკეტის ქეშირებული ამოღება · Offline: cached extraction of the demo pack",
    };
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    if (store.state.forceTimeout) {
      await sleep(TIMEOUT_MS);
      throw new Error("forced timeout (test hook)");
    }
    const rules = await callGemini(file, mimeType, ctrl.signal);
    return { rules, pages, source: "live" };
  } catch {
    store.setMode("offline"); // circuit breaker: stay offline for the rest of the demo
    return { rules: cachedPack(), pages, source: "cache", note: "ქსელი ნელია: ნაჩვენებია ქეშირებული ამოღება · Network slow: cached extraction shown" };
  } finally {
    clearTimeout(timer);
  }
}

export async function aiHealth(): Promise<"ok" | "offline" | "down"> {
  const store = getStore();
  if (process.env.OFFLINE_DEMO === "true" || store.state.mode === "offline" || !process.env.GEMINI_API_KEY) return "offline";
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 1500);
  try {
    const model = process.env.SIMUSTAY_MODEL ?? "gemini-2.5-flash";
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}`, {
      signal: ctrl.signal,
      headers: { "x-goog-api-key": process.env.GEMINI_API_KEY ?? "" },
    });
    return res.ok ? "ok" : "down";
  } catch {
    return "down";
  } finally {
    clearTimeout(timer);
  }
}
