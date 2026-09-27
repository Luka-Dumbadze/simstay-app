import { body, safe } from "@/lib/simustay/safe";
import { getStore, type SnapshotId } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = safe(async (req) => {
  const { snapshot, full } = await body<{ snapshot: SnapshotId; full: boolean }>(req);
  // full: a new visitor's clean slate (property, desk and windows too); otherwise only the story restarts.
  if (full === true) return { state: getStore().resetAll() };
  const state = getStore().reset(snapshot === "before-checkout" ? "before-checkout" : "start");
  return { state };
});
