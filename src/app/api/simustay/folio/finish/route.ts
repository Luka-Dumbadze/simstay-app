import { folioTotals, gateFinish, lateChargesOpen } from "@/lib/simustay/grader";
import { pms } from "@/lib/simustay/pms";
import { guestBalance, PROPERTIES } from "@/lib/simustay/properties";
import { safe } from "@/lib/simustay/safe";
import { getStore, pushLog, uid } from "@/lib/simustay/store";
import type { Folio, WindowNo } from "@/lib/simustay/types";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = safe(async () => {
  const store = getStore();
  if (!store.state.published) throw new Error("წესები ჯერ არ გამოქვეყნებულა · Rules are not published yet");
  const supplementary = store.state.checkedOut && lateChargesOpen(store.state.folio);
  if (store.state.checkedOut && !supplementary) throw new Error("გასვლა უკვე დასრულებულია · Check-out already finished");
  const gate = gateFinish(store.state.folio, store.state.rules);
  if (!gate.ok) {
    const state = store.commit((s) => {
      s.metrics.errorsCaught += 1;
      s.metrics.interventionsAvoided += 1;
      s.gateLog.push({ ...gate, chargeId: null, target: null, at: Date.now() });
    });
    return { gate, state };
  }
  const numbers = PROPERTIES[store.state.property.id].scenario.invoices;

  // Late charge after check-out: invoice only the still-open windows on a separate supplementary invoice.
  if (supplementary) {
    const no = numbers?.supplementary ?? `${store.state.folio.reservationId}-S1`;
    const state = store.commit((s) => {
      const now = Date.now();
      const inv = issue(s.folio, no, "supplementary", now);
      const done = { ...gate, message_ka: `დამატებითი ინვოისი #${no} გამოიწერა · ${inv.total.toFixed(2)} ₾`, message_en: `Supplementary invoice #${no} issued · ${inv.total.toFixed(2)} GEL` };
      s.gateLog.push({ ...done, chargeId: null, target: null, at: now });
      s.chat.push({ id: uid("m"), from: "system", text_ka: `🧾 ${done.message_ka}`, text_en: done.message_en, t: now });
    });
    return { gate: state.gateLog.at(-1), state };
  }

  const roomNo = store.state.folio.room;
  const adapter = await pms().setRoomStatus(roomNo, "dirty");
  const state = store.commit((s) => {
    const now = Date.now();
    s.checkedOut = true;
    const inv = issue(s.folio, numbers?.primary ?? `${s.folio.reservationId}-1`, "primary", now);
    s.metrics.checkoutAt = now;
    s.metrics.cleanedAt = null;
    s.metrics.readyAt = null;
    s.metrics.interventionsAvoided += 1; // folio closed without a supervisor override
    const room = s.rooms.find((r) => r.number === roomNo);
    if (room) { room.status = "dirty"; room.updatedAt = now; }
    s.tasks = s.tasks.filter((t) => !(t.room === roomNo && t.state === "open"));
    s.tasks.unshift({
      id: uid(`hk-${roomNo}`),
      room: roomNo,
      kind: "departure",
      checklist: PROPERTIES[s.property.id].scenario.hkChecklist.map((i) => ({ ...i, done: false })),
      photo: null,
      state: "open",
      createdAt: now,
    });
    s.gateLog.push({ ...gate, chargeId: null, target: null, at: now });
    const checkout = PROPERTIES[s.property.id].chat?.checkout;
    const line = checkout
      ? checkout({ invoiceNo: inv.no, balance: guestBalance(s.folio) })
      : { text_ka: `✓ გასვლა დასრულდა · ინვოისი #${inv.no} დაიხურა (${inv.total.toFixed(2)} ₾) · ${s.folio.roomLabel_ka} გადაეცა დიასახლისობას`, text_en: `Check-out complete · invoice #${inv.no} closed (${inv.total.toFixed(2)} GEL) · ${s.folio.roomLabel_en} sent to housekeeping` };
    s.chat.push({ id: uid("m"), from: "system", ...line, t: now });
    pushLog(s, adapter.line);
  });
  return { gate, state };
});

// Closes every open window that carries charges under one invoice number; closed windows become read-only.
function issue(folio: Folio, no: string, kind: "primary" | "supplementary", at: number) {
  const totals = folioTotals(folio).byWindow;
  const windows = folio.windows.filter((w) => !w.closed && totals[w.n] > 0).map((w) => w.n as WindowNo);
  for (const w of folio.windows) if (windows.includes(w.n)) { w.closed = true; w.invoiceNo = no; }
  const inv = { no, kind, windows, total: Math.round(windows.reduce((a, n) => a + totals[n], 0) * 100) / 100, at };
  folio.invoices = [...(folio.invoices ?? []), inv];
  return inv;
}
