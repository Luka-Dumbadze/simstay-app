import { body, safe } from "@/lib/simustay/safe";
import { getStore, type SnapshotId } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = safe(async (req) => {
  const { snapshot } = await body<{ snapshot: SnapshotId }>(req);
  const state = getStore().reset(snapshot === "before-checkout" ? "before-checkout" : "start");
  return { state };
});
