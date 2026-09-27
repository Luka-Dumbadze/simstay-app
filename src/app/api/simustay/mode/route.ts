import { body, safe } from "@/lib/simustay/safe";
import { getStore } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = safe(async (req) => {
  const { mode, forceTimeout } = await body<{ mode: "online" | "offline"; forceTimeout: boolean }>(req);
  const state = getStore().commit((s) => {
    s.mode = mode === "online" || mode === "offline" ? mode : s.mode === "online" ? "offline" : "online";
    if (typeof forceTimeout === "boolean") s.forceTimeout = forceTimeout;
  });
  const note = state.mode === "online" && (process.env.OFFLINE_DEMO === "true" || !process.env.GEMINI_API_KEY)
    ? "online requested, but OFFLINE_DEMO / missing GEMINI_API_KEY keeps AI on the cached path"
    : undefined;
  return { state, note };
});
