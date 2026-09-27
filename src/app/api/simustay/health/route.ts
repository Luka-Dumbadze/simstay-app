import { aiHealth } from "@/lib/simustay/ai-gateway";
import { getStore } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = getStore();
    const ai = await aiHealth();
    return Response.json({ ok: true, store: "ok", sse: "ok", ai, mode: store.state.mode, version: store.state.version, clients: store.listeners.size });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) });
  }
}
