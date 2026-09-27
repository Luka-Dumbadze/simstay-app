// PMS adapter seam (spec §6.6). On stage everything is dry-run; the log line is the evidence.
import type { RoomStatus } from "./types";

export interface PmsAdapter {
  name: string;
  setRoomStatus(room: string, status: RoomStatus): Promise<{ ok: boolean; line: string }>;
}

// Payload shape follows the Mews Connector API "resources/update" operation
// (State: Dirty | Clean | Inspected | OutOfService | OutOfOrder).
const MEWS_STATE: Record<RoomStatus, string | null> = {
  dirty: "Dirty",
  clean: "Clean",
  inspected: "Inspected",
  oos: "OutOfService",
  ooo: "OutOfOrder",
  occupied: null,
};

export const mewsShaped = (dryRun = !process.env.MEWS_CLIENT_TOKEN): PmsAdapter => ({
  name: "Mews-shaped",
  async setRoomStatus(room, status) {
    const State = MEWS_STATE[status];
    if (!State) return { ok: true, line: `skip ${room} ${status} (no housekeeping state)` };
    if (dryRun) return { ok: true, line: `PATCH resources/update ${JSON.stringify({ Id: room, State })} → 200 (mock)` };
    return { ok: false, line: `live Mews call disabled in demo build (${room} ${State})` };
  },
});

export const pms = (): PmsAdapter => mewsShaped();

const CSV_STATUS: Record<string, RoomStatus> = {
  occupied: "occupied", occ: "occupied",
  dirty: "dirty", vd: "dirty",
  clean: "clean", vc: "clean",
  inspected: "inspected", insp: "inspected", vi: "inspected",
  ooo: "ooo", outoforder: "ooo",
  oos: "oos", outofservice: "oos",
};

// "T0 universal import": `room,status` rows from any PMS daily export.
export function parsePmsCsv(csv: string): { room: string; status: RoomStatus }[] {
  const rows: { room: string; status: RoomStatus }[] = [];
  for (const raw of csv.split(/\r?\n/)) {
    const [room, status] = raw.split(/[;,\t]/).map((x) => x?.trim());
    if (!room || !status || !/^\d{1,4}$/.test(room)) continue;
    const mapped = CSV_STATUS[status.toLowerCase().replace(/[\s_-]/g, "")];
    if (mapped) rows.push({ room, status: mapped });
  }
  return rows;
}
