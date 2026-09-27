import { gateMove, lateChargesOpen } from "@/lib/simustay/grader";
import { body, safe } from "@/lib/simustay/safe";
import { PROPERTIES, routedCues } from "@/lib/simustay/properties";
import { getStore, uid } from "@/lib/simustay/store";
import type { GateResult, WindowNo } from "@/lib/simustay/types";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = safe(async (req) => {
  const { chargeId, window } = await body<{ chargeId: string; window: WindowNo | null }>(req);
  const target = window === null ? null : (Number(window) as WindowNo);
  if (!chargeId) throw new Error("chargeId required");
  if (target !== null && ![1, 2, 3, 4].includes(target)) throw new Error("window must be 1-4 or null");
  const store = getStore();
  // After check-out the folio reopens only for a late charge; the grader then guards the closed invoice (H5).
  if (store.state.checkedOut && !lateChargesOpen(store.state.folio)) throw new Error("ფოლიო უკვე დახურულია · Folio already closed");
  let gate: GateResult;
  if (!store.state.published) {
    gate = { ok: false, ruleId: "SYS", tier: "H", message_ka: "წესები ჯერ არ გამოქვეყნებულა", message_en: "Rules are not published yet" };
    return { gate };
  }
  gate = gateMove(store.state.folio, store.state.rules, chargeId, target);
  const pack = PROPERTIES[store.state.property.id];
  const state = store.commit((s) => {
    const now = Date.now();
    s.metrics.movesGraded += 1;
    if (gate.ok) {
      const c = s.folio.charges.find((x) => x.id === chargeId);
      if (c) c.window = target;
      // The guest's chat follows the folio in the same commit (property chat script, e.g. Bioli).
      routedCues(pack, s.folio, s.chat, chargeId).forEach((m, i) => s.chat.push({ id: uid("m"), ...m, t: now + i }));
    } else if (gate.ruleId !== "SYS") {
      s.metrics.errorsCaught += 1;
      s.metrics.interventionsAvoided += 1; // a mistake stopped pre-posting is a supervisor call that never happens
      if (pack.chat?.onBlocked) {
        s.chat.push({ id: uid("m"), from: "system", text_ka: `⛔ ${gate.ruleId}: ${gate.message_ka}`, text_en: `Blocked by ${gate.ruleId}: ${gate.message_en}`, t: now });
      }
    }
    s.gateLog.push({ ...gate, chargeId, target, at: Date.now() });
    if (s.gateLog.length > 40) s.gateLog.splice(0, s.gateLog.length - 40);
  });
  return { gate, state };
});
