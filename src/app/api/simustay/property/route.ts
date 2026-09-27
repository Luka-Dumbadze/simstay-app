import { isPropertyId } from "@/lib/simustay/properties";
import { body, safe } from "@/lib/simustay/safe";
import { getStore } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Swaps rules, scenario, room board and persona by loading the property's start snapshot.
export const POST = safe(async (req) => {
  const { propertyId } = await body<{ propertyId: string }>(req);
  if (!isPropertyId(propertyId)) throw new Error(`უცნობი ობიექტი · Unknown property ${String(propertyId)}`);
  const state = getStore().switchProperty(propertyId);
  return { state, note: state.property.name };
});
