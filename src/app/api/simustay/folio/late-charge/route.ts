import { PROPERTIES } from "@/lib/simustay/properties";
import { safe } from "@/lib/simustay/safe";
import { getStore, uid } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A charge that arrives after check-out (scenario "lateCharge"). It lands unrouted, and the supplementary
// window it belongs in gets its payee. Scenarios without a late charge answer ok with skipped: true.
export const POST = safe(() => {
  const store = getStore();
  const late = PROPERTIES[store.state.property.id].scenario.lateCharge;
  if (!late) return { skipped: true, note: "ამ სცენარში დაგვიანებული ხარჯი არ არის · No late charge in this scenario" };
  if (!store.state.checkedOut) throw new Error("დაგვიანებული ხარჯი მოდის გასვლის შემდეგ · Late charges arrive after check-out");
  if (store.state.folio.charges.some((c) => c.id === late.charge.id)) return { skipped: true, note: "უკვე გატარებულია · Already posted" };
  const state = store.commit((s) => {
    const now = Date.now();
    s.folio.charges.push({ ...late.charge, window: null, late: true });
    s.folio.windows = s.folio.windows.map((w) => (w.n === late.window.n && !w.closed ? { ...late.window } : w));
    s.chat.push({ id: uid("m"), from: "system", text_ka: late.message_ka, text_en: late.message_en, t: now });
  });
  return { state, note: late.message_ka };
});
