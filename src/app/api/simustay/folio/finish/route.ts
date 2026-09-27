import scenario from "@/lib/simustay/fixtures/scenario.checkin-204.json";
import { gateFinish } from "@/lib/simustay/grader";
import { pms } from "@/lib/simustay/pms";
import { safe } from "@/lib/simustay/safe";
import { getStore, pushLog, uid } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = safe(async () => {
  const store = getStore();
  if (!store.state.published) throw new Error("წესები ჯერ არ გამოქვეყნებულა · Rules are not published yet");
  if (store.state.checkedOut) throw new Error("გასვლა უკვე დასრულებულია · Check-out already finished");
  const gate = gateFinish(store.state.folio, store.state.rules);
  if (!gate.ok) {
    const state = store.commit((s) => {
      s.metrics.errorsCaught += 1;
      s.metrics.interventionsAvoided += 1;
      s.gateLog.push({ ...gate, chargeId: null, target: null, at: Date.now() });
    });
    return { gate, state };
  }
  const roomNo = store.state.folio.room;
  const adapter = await pms().setRoomStatus(roomNo, "dirty");
  const state = store.commit((s) => {
    const now = Date.now();
    s.checkedOut = true;
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
      checklist: scenario.hkChecklist.map((i) => ({ ...i, done: false })),
      photo: null,
      state: "open",
      createdAt: now,
    });
    s.gateLog.push({ ...gate, chargeId: null, target: null, at: now });
    s.chat.push({ id: uid("m"), from: "system", text_ka: `✓ გასვლა დასრულდა · ${s.folio.roomLabel_ka} გადაეცა დიასახლისობას`, text_en: `Check-out complete · ${s.folio.roomLabel_en} sent to housekeeping`, t: now });
    pushLog(s, adapter.line);
  });
  return { gate, state };
});
