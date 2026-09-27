import { getStore } from "@/lib/simustay/store";
import type { SimuState } from "@/lib/simustay/types";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEARTBEAT_MS = 5_000;

// Every open stream registers its closer here. On shutdown all streams are closed, so browsers reconnect to the
// next server process at once instead of staying attached to a draining process that never exits.
declare global {
  // eslint-disable-next-line no-var
  var __simstaySse: { closers: Set<() => void>; hooked: boolean } | undefined;
}
const sse = (globalThis.__simstaySse ??= { closers: new Set(), hooked: false });
if (!sse.hooked) {
  sse.hooked = true;
  for (const sig of ["SIGTERM", "SIGINT"] as const) {
    process.once(sig, () => {
      for (const close of [...sse.closers]) close();
    });
  }
}

export function GET(req: Request) {
  const store = getStore();
  const enc = new TextEncoder();
  let cleanup = () => {};
  const stream = new ReadableStream<Uint8Array>({
    start(ctrl) {
      let closed = false;
      const write = (chunk: string) => {
        if (closed) return;
        try { ctrl.enqueue(enc.encode(chunk)); } catch { cleanup(); }
      };
      const send = (s: SimuState) => write(`data: ${JSON.stringify(s)}\n\n`);
      write("retry: 1000\n\n");
      send(store.state);
      const unsub = store.subscribe(send);
      // A named event (not a comment) so the browser can see it: the client treats silence as a dead connection.
      const beat = () => write(`event: ping\ndata: ${JSON.stringify({ bootId: store.state.bootId, version: store.state.version })}\n\n`);
      const heartbeat = setInterval(beat, HEARTBEAT_MS);
      cleanup = () => {
        if (closed) return;
        closed = true;
        unsub();
        clearInterval(heartbeat);
        sse.closers.delete(cleanup);
        try { ctrl.close(); } catch { /* already closed */ }
      };
      sse.closers.add(cleanup);
      req.signal.addEventListener("abort", () => cleanup());
    },
    cancel() { cleanup(); },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
