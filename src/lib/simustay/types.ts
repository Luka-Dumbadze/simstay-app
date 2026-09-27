// SimuStay domain model (spec §3.3), extended with the configurable workspace matrix.

export type Tier = "H" | "P" | "D"; // Hard invariant | signed Policy | Discretion
export type RoomStatus = "occupied" | "dirty" | "clean" | "inspected" | "ooo" | "oos";
export type WindowNo = 1 | 2 | 3 | 4;
export type ChargeCode = "VILLA" | "GOLF" | "WINE" | "REST";

export interface SourceSpan {
  page: number;
  quote: string;
}

export type RuleCheck =
  | { kind: "route"; chargeCodes: ChargeCode[]; payer: "company" | "guest" }
  | { kind: "window_requires_payee" }
  | { kind: "direct_bill_requires_letter" }
  | { kind: "balanced" }
  | { kind: "sell_requires"; status: "inspected" };

export interface Rule {
  id: string;
  tier: Tier;
  title_ka: string;
  title_en: string;
  source: SourceSpan;
  check?: RuleCheck; // machine form used by the grader (only H and P tiers are graded)
}

export interface Charge {
  id: string;
  code: ChargeCode;
  label_ka: string;
  label_en: string;
  amount: number;
  window: WindowNo | null;
}

export interface FolioWindow {
  n: WindowNo;
  payee: string | null;
  payerType: "guest" | "company" | null;
  method: "card" | "direct_bill" | null;
}

export interface Folio {
  reservationId: string;
  room: string;
  roomLabel_ka: string;
  roomLabel_en: string;
  guest: string;
  guest_en: string;
  company: string | null;
  company_en: string | null;
  letterOnFile: boolean;
  windows: FolioWindow[];
  charges: Charge[];
}

export interface Room {
  number: string;
  type: string;
  status: RoomStatus;
  updatedAt: number;
}

export interface HkChecklistItem {
  id: string;
  label_ka: string;
  label_en: string;
  done: boolean;
}

export interface HkTask {
  id: string;
  room: string;
  kind: "departure" | "stayover";
  checklist: HkChecklistItem[];
  photo: string | null;
  state: "open" | "cleaned" | "inspected";
  createdAt: number;
}

export interface GateResult {
  ok: boolean;
  ruleId: string;
  tier: Tier;
  message_ka: string;
  message_en: string;
  source?: SourceSpan;
}

export interface GateEvent extends GateResult {
  chargeId: string | null;
  target: WindowNo | null;
  at: number;
}

export interface Metrics {
  errorsCaught: number;
  interventionsAvoided: number;
  movesGraded: number;
  checkoutAt: number | null;
  cleanedAt: number | null;
  readyAt: number | null;
}

export interface ChatMessage {
  id: string;
  from: "guest" | "agent" | "system";
  text_ka: string;
  text_en: string;
  t: number;
}

export interface QuickReply {
  id: string;
  text_ka: string;
  text_en: string;
  reply_ka: string;
  reply_en: string;
  effect?: "letter";
}

export interface IngestInfo {
  fileName: string;
  pages: number;
  source: "live" | "cache";
  note?: string;
  at: number;
}

// ---- Configurable multi-app matrix -------------------------------------------------

export type AppId = "ingest" | "pms" | "comms" | "phone" | "board" | "agents" | "ops" | "store";
export type PmsSkin = "classic" | "modern";
export type CommsSkin = "whatsapp" | "telegram";

export interface WorkspaceProfile {
  id: string;
  name: string;
  description: string;
  installed_apps: AppId[];
  skins: { pms: PmsSkin; comms: CommsSkin };
}

export interface Workspace {
  profileId: string;
  installed_apps: AppId[];
  skins: { pms: PmsSkin; comms: CommsSkin };
}

export interface SimuState {
  mode: "online" | "offline";
  workspace: Workspace;
  rules: Rule[];
  ingest: IngestInfo | null;
  published: boolean;
  shiftTitle_ka: string;
  shiftTitle_en: string;
  folio: Folio;
  checkedOut: boolean;
  rooms: Room[];
  tasks: HkTask[];
  chat: ChatMessage[];
  quickReplies: QuickReply[];
  usedReplies: string[];
  gateLog: GateEvent[];
  adapterLog: { t: number; line: string }[];
  metrics: Metrics;
  version: number; // monotonically increasing; clients drop stale frames
  forceTimeout?: boolean; // test hook: set via POST /mode {forceTimeout:true}
}

export interface ActResult {
  ok: boolean;
  error?: string;
  gate?: GateResult;
  note?: string;
  state?: SimuState;
}
