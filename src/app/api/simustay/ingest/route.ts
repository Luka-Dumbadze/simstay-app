import rulesFixture from "@/lib/simustay/fixtures/rules.alazani.json";
import { extractRules } from "@/lib/simustay/ai-gateway";
import { safe } from "@/lib/simustay/safe";
import { getStore } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 15 * 1024 * 1024;

export const POST = safe(async (req) => {
  let file = Buffer.alloc(0);
  let fileName = rulesFixture.document.fileName;
  let mime = "application/pdf";
  if ((req.headers.get("content-type") ?? "").includes("multipart/form-data")) {
    const form = await req.formData();
    const f = form.get("file");
    if (f && typeof f !== "string") {
      if (f.size > MAX_BYTES) throw new Error("ფაილი ძალიან დიდია (მაქს. 15 MB) · File too large");
      file = Buffer.from(await f.arrayBuffer());
      fileName = f.name || fileName;
      mime = f.type || mime;
    }
  }
  const ex = await extractRules(file, mime);
  const state = getStore().commit((s) => {
    s.rules = ex.rules;
    s.published = false;
    s.ingest = { fileName, pages: ex.pages, source: ex.source, note: ex.note, at: Date.now() };
  });
  return { state, note: ex.note, source: ex.source };
});
