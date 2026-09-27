// Route-handler contract (spec §4.5): never throw, always HTTP 200, always carry the state.
import { getStore } from "./store";

type Handler = (req: Request) => Promise<Record<string, unknown>> | Record<string, unknown>;

export function safe(fn: Handler) {
  return async (req: Request): Promise<Response> => {
    try {
      const out = await fn(req);
      return Response.json({ ok: true, state: getStore().state, ...out }, { headers: { "Cache-Control": "no-store" } });
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      return Response.json({ ok: false, error, state: getStore().state }, { status: 200, headers: { "Cache-Control": "no-store" } });
    }
  };
}

export async function body<T extends object>(req: Request): Promise<Partial<T>> {
  try {
    const text = await req.text();
    return text ? (JSON.parse(text) as Partial<T>) : {};
  } catch {
    return {};
  }
}
