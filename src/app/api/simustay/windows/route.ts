import { body, safe } from "@/lib/simustay/safe";
import { getStore } from "@/lib/simustay/store";
import type { AppId } from "@/lib/simustay/types";
import { ALL_WINDOWS, applyWindowAction, type WindowAction } from "@/lib/simustay/windows";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface WindowsBody {
  action: WindowAction["action"];
  id: AppId;
  clientId: string;
  seq: number;
  openWindows: Partial<Record<AppId, boolean>>;
  focusedWindow: AppId | null;
}

const MAX_TRACKED_CLIENTS = 64;
const SINGLE: WindowAction["action"][] = ["open", "solo", "close", "focus"];

// Persists one window action (rules in lib/simustay/windows.ts). Requests carrying (clientId, seq) are applied
// at most once and in order per client; an older request that arrives late is dropped, never applied.
export const POST = safe(async (req) => {
  const b = await body<WindowsBody>(req);
  const action = b.action as WindowAction["action"];
  if (![...SINGLE, "preset", "sync"].includes(action)) throw new Error(`unknown action ${String(action)}`);
  if (SINGLE.includes(action) && !ALL_WINDOWS.includes(b.id as AppId)) throw new Error(`unknown window ${String(b.id)}`);
  const store = getStore();
  const clientId = typeof b.clientId === "string" && b.clientId.length <= 64 ? b.clientId : null;
  const seq = typeof b.seq === "number" && Number.isFinite(b.seq) ? b.seq : null;
  if (clientId && seq !== null && seq <= (store.state.ui.seqByClient[clientId] ?? 0)) {
    return { stale: true };
  }
  const act: WindowAction =
    action === "preset" ? { action } :
    action === "sync" ? { action, openWindows: b.openWindows ?? {}, focusedWindow: b.focusedWindow ?? null } :
    { action, id: b.id as AppId };
  const state = store.commit((s) => {
    const next = applyWindowAction(s.ui, act);
    s.ui.openWindows = next.openWindows;
    s.ui.focusedWindow = next.focusedWindow;
    s.ui.rev += 1;
    s.ui.writer = clientId;
    if (clientId && seq !== null) {
      s.ui.seqByClient[clientId] = seq;
      const ids = Object.keys(s.ui.seqByClient);
      if (ids.length > MAX_TRACKED_CLIENTS) for (const id of ids.slice(0, ids.length - MAX_TRACKED_CLIENTS)) delete s.ui.seqByClient[id];
    }
  });
  return { state };
});
