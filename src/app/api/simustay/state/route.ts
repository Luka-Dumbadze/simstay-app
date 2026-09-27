import { getStore } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(getStore().state, { headers: { "Cache-Control": "no-store" } });
}
