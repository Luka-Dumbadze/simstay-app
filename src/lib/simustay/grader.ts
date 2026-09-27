// Deterministic, pure rule engine (spec §6.3). No LLM ever sits in the grading path.
import type { Folio, GateResult, Rule, RuleCheck, WindowNo } from "./types.ts";

const OK: GateResult = { ok: true, ruleId: "OK", tier: "H", message_ka: "სწორია", message_en: "Correct" };

const fail = (r: Rule): GateResult => ({
  ok: false,
  ruleId: r.id,
  tier: r.tier,
  source: r.source,
  message_ka: r.title_ka,
  message_en: r.title_en,
});

// Structural checks explain an empty or misconfigured window better than a routing rule would.
const PRIORITY: Record<RuleCheck["kind"], number> = {
  window_requires_payee: 0,
  route: 1,
  direct_bill_requires_letter: 2,
  balanced: 3,
  sell_requires: 4,
};

export function gradedRules(rules: Rule[]): Rule[] {
  return rules
    .filter((r) => r.tier !== "D" && r.check) // discretion is coached, never graded
    .sort((a, b) => PRIORITY[a.check!.kind] - PRIORITY[b.check!.kind]);
}

export function gateMove(folio: Folio, rules: Rule[], chargeId: string, target: WindowNo | null): GateResult {
  const charge = folio.charges.find((c) => c.id === chargeId);
  if (!charge) return { ok: false, ruleId: "SYS", tier: "H", message_ka: "უცნობი ხარჯი", message_en: "Unknown charge" };
  if (target === null) return OK; // un-routing a charge never posts anything
  const win = folio.windows.find((w) => w.n === target);
  if (!win) return { ok: false, ruleId: "SYS", tier: "H", message_ka: "უცნობი ფანჯარა", message_en: "Unknown window" };

  for (const r of gradedRules(rules)) {
    const check = r.check!;
    switch (check.kind) {
      case "window_requires_payee":
        if (!win.payee || !win.method) return fail(r);
        break;
      case "route":
        if (check.chargeCodes.includes(charge.code) && win.payerType !== check.payer) return fail(r);
        break;
      case "direct_bill_requires_letter":
        if (win.method === "direct_bill" && !folio.letterOnFile) return fail(r);
        break;
      default:
        break;
    }
  }
  return OK;
}

export function folioTotals(folio: Folio) {
  const total = folio.charges.reduce((a, c) => a + c.amount, 0);
  const byWindow = { 1: 0, 2: 0, 3: 0, 4: 0 } as Record<WindowNo, number>;
  let unrouted = 0;
  for (const c of folio.charges) {
    if (c.window === null) unrouted += c.amount;
    else byWindow[c.window] += c.amount;
  }
  const round = (n: number) => Math.round(n * 100) / 100;
  return {
    total: round(total),
    unrouted: round(unrouted),
    byWindow: { 1: round(byWindow[1]), 2: round(byWindow[2]), 3: round(byWindow[3]), 4: round(byWindow[4]) } as Record<WindowNo, number>,
  };
}

export function folioBalanced(folio: Folio): boolean {
  return Math.abs(folioTotals(folio).unrouted) < 0.005;
}

// Re-grades every routed charge, so a finished folio is correct even if rules changed after routing.
export function gateFinish(folio: Folio, rules: Rule[]): GateResult {
  const { unrouted } = folioTotals(folio);
  if (unrouted > 0.005) {
    return {
      ok: false,
      ruleId: "BAL",
      tier: "H",
      message_ka: `ფოლიო დაუბალანსებელია: ${unrouted.toFixed(2)} ₾ ჯერ არ არის განაწილებული`,
      message_en: `Folio not balanced: ${unrouted.toFixed(2)} GEL still unrouted`,
    };
  }
  for (const c of folio.charges) {
    const g = gateMove(folio, rules, c.id, c.window);
    if (!g.ok) return g;
  }
  return { ok: true, ruleId: "BAL", tier: "H", message_ka: "ფოლიო დაბალანსებულია", message_en: "Folio balanced" };
}

// Which graded rules the current folio already satisfies (drives the ✓ list in the grader HUD).
export function satisfiedRules(folio: Folio, rules: Rule[]): string[] {
  const out: string[] = [];
  for (const r of gradedRules(rules)) {
    const check = r.check!;
    if (check.kind === "route") {
      const relevant = folio.charges.filter((c) => check.chargeCodes.includes(c.code));
      const allRouted = relevant.length > 0 && relevant.every((c) => c.window !== null);
      if (allRouted && relevant.every((c) => folio.windows.find((w) => w.n === c.window)?.payerType === check.payer)) out.push(r.id);
    } else if (check.kind === "window_requires_payee") {
      const used = new Set(folio.charges.map((c) => c.window).filter((w): w is WindowNo => w !== null));
      if (used.size > 0 && [...used].every((n) => { const w = folio.windows.find((x) => x.n === n); return !!w?.payee && !!w?.method; })) out.push(r.id);
    } else if (check.kind === "direct_bill_requires_letter") {
      const billed = folio.charges.some((c) => folio.windows.find((w) => w.n === c.window)?.method === "direct_bill");
      if (billed && folio.letterOnFile) out.push(r.id);
    }
  }
  return out;
}
