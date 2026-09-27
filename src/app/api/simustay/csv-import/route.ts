import { parsePmsCsv, SAMPLE_PMS_EXPORT } from "@/lib/simustay/pms";
import { body, safe } from "@/lib/simustay/safe";
import { getStore, pushLog } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = safe(async (req) => {
  const { csv } = await body<{ csv: string }>(req);
  const rows = parsePmsCsv(typeof csv === "string" && csv.trim() ? csv : SAMPLE_PMS_EXPORT);
  if (rows.length === 0) throw new Error("CSV-ში სწორი სტრიქონი ვერ მოიძებნა · No valid room,status rows");
  let applied = 0;
  const state = getStore().commit((s) => {
    const now = Date.now();
    for (const row of rows) {
      const r = s.rooms.find((x) => x.number === row.room);
      if (!r || r.number === s.folio.room) continue; // the live demo room is owned by the scenario
      r.status = row.status;
      r.updatedAt = now;
      applied += 1;
    }
    pushLog(s, `IMPORT pms_export.csv · ${applied}/${rows.length} rows applied (CsvExportAdapter)`);
  });
  return { state, note: `CSV: ${applied} ოთახი განახლდა` };
});
