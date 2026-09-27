import { getStore } from "@/lib/simustay/store";
import type { SimuState } from "@/lib/simustay/types";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
      const ping = setInterval(() => write(": ping\n\n"), 10_000);
      cleanup = () => {
        if (closed) return;
        closed = true;
        unsub();
        clearInterval(ping);
        try { ctrl.close(); } catch { /* already closed */ }
      };
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
