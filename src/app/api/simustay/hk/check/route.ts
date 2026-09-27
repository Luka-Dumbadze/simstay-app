import { body, safe } from "@/lib/simustay/safe";
import { getStore } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = safe(async (req) => {
  const { taskId, itemId, done } = await body<{ taskId: string; itemId: string; done: boolean }>(req);
  const state = getStore().commit((s) => {
    const t = s.tasks.find((x) => x.id === taskId);
    if (!t) throw new Error("დავალება ვერ მოიძებნა · Task not found");
    if (t.state !== "open") throw new Error("დავალება უკვე დასრულებულია · Task already finished");
    const item = t.checklist.find((i) => i.id === itemId);
    if (!item) throw new Error("უცნობი პუნქტი · Unknown checklist item");
    item.done = typeof done === "boolean" ? done : !item.done;
  });
  return { state };
});
