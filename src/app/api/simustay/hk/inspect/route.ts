import { pms } from "@/lib/simustay/pms";
import { body, safe } from "@/lib/simustay/safe";
import { getStore, pushLog } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = safe(async (req) => {
  const { room: roomNo } = await body<{ room: string }>(req);
  const store = getStore();
  const room = store.state.rooms.find((r) => r.number === String(roomNo));
  if (!room) throw new Error("ოთახი ვერ მოიძებნა · Room not found");
  if (room.status !== "clean") throw new Error("შემოწმება შეიძლება მხოლოდ დასუფთავებულ ოთახზე · Only clean rooms can be inspected");
  const adapter = await pms().setRoomStatus(room.number, "inspected");
  const state = store.commit((s) => {
    const now = Date.now();
    const r = s.rooms.find((x) => x.number === room.number)!;
    r.status = "inspected";
    r.updatedAt = now;
    s.tasks.forEach((t) => { if (t.room === r.number && t.state === "cleaned") t.state = "inspected"; });
    if (r.number === s.folio.room && s.metrics.checkoutAt && !s.metrics.readyAt) {
      s.metrics.readyAt = now;
      s.metrics.interventionsAvoided += 1; // status reached the PMS without a phone call to the desk
    }
    pushLog(s, adapter.line);
  });
  return { state };
});
