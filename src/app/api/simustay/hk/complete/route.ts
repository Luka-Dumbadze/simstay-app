import { pms } from "@/lib/simustay/pms";
import { body, safe } from "@/lib/simustay/safe";
import { getStore, pushLog } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PHOTO = 600_000;

export const POST = safe(async (req) => {
  const { taskId, photo } = await body<{ taskId: string; photo: string }>(req);
  const store = getStore();
  const task = store.state.tasks.find((x) => x.id === taskId);
  if (!task) throw new Error("დავალება ვერ მოიძებნა · Task not found");
  if (task.state !== "open") throw new Error("დავალება უკვე დასრულებულია · Task already finished");
  if (task.checklist.some((i) => !i.done)) throw new Error("ჩამონათვალი დაუსრულებელია · Checklist incomplete");
  const pic = typeof photo === "string" && photo.startsWith("data:image/") && photo.length <= MAX_PHOTO ? photo : null;
  if (!pic && !task.photo) throw new Error("საჭიროა ფოტო · A photo is required");
  const adapter = await pms().setRoomStatus(task.room, "clean");
  const state = store.commit((s) => {
    const t = s.tasks.find((x) => x.id === taskId)!;
    const now = Date.now();
    t.state = "cleaned";
    t.photo = pic ?? t.photo;
    const room = s.rooms.find((r) => r.number === t.room);
    if (room) { room.status = "clean"; room.updatedAt = now; }
    if (t.room === s.folio.room && s.metrics.checkoutAt) s.metrics.cleanedAt = now;
    pushLog(s, adapter.line);
  });
  return { state };
});
