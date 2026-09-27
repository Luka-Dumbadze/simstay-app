// SimStay domain model (spec §3.3), extended with the configurable workspace matrix.

export type Tier = "H" | "P" | "D"; // Hard invariant | signed Policy | Discretion
export type RoomStatus = "occupied" | "dirty" | "clean" | "inspected" | "ooo" | "oos";
export type WindowNo = 1 | 2 | 3 | 4;
export type ChargeCode =
  | "VILLA" | "GOLF" | "WINE" | "REST" | "LATE_REST" // Ambassadori Kachreti (LATE_REST: arrives after check-out)
  | "COTTAGE" | "HALO" | "SPECTRO" | "PHYTO" | "BAR"; // Bioli Wellness
export type PayerType = "guest" | "company" | "package";
export type PropertyId = "ambassadori" | "bioli";

export interface SourceSpan {
  page: number;
  quote: string;
}

export type RuleCheck =
  | { kind: "route"; chargeCodes: ChargeCode[]; payer: PayerType }
  | { kind: "window_requires_payee" }
  | { kind: "direct_bill_requires_letter" }
  | { kind: "closed_invoice" } // a closed invoice window is never edited; late charges go to a supplementary window
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
  late?: boolean; // posted after check-out: belongs on a supplementary invoice
}

export interface FolioWindow {
  n: WindowNo;
  payee: string | null;
  payerType: PayerType | null;
  method: "card" | "direct_bill" | "prepaid" | null;
  closed?: boolean; // invoiced at check-out: read-only from then on
  invoiceNo?: string;
}

export interface Invoice {
  no: string;
  kind: "primary" | "supplementary";
  windows: WindowNo[];
  total: number;
  at: number;
}

// Optional post-check-out beat of a scenario: a late charge and the supplementary window it belongs in.
export interface LateChargeSpec {
  charge: Omit<Charge, "window" | "late">;
  window: FolioWindow;
  message_ka: string;
  message_en: string;
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
  invoices?: Invoice[];
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
export type CommsSkin = "whatsapp" | "telegram" | "slack"; // slack: only while the Slack Workspace Hub add-on is installed

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
  marketplace_apps?: string[]; // installed App Store add-ons (lib/simustay/marketplace.ts); absent = none
  skins: { pms: PmsSkin; comms: CommsSkin };
}

export interface MenuOption {
  id: string;
  label_ka: string;
  label_en: string;
}

// In-room personalisation menus as the property publishes them, and one guest's confirmed choices.
export interface PreferenceMenu {
  aroma: MenuOption[];
  pillow: MenuOption[];
  sheets: MenuOption[];
}

// Per-property demo context: brand, persona, AI photo-check tags and the scripted autopilot route.
export interface PropertyInfo {
  id: PropertyId;
  name: string;
  name_ka: string;
  short: string;
  location: string;
  rulebook_ka: string;
  units_ka: string;
  docFileName: string;
  photoTags_ka: string[];
  persona: { summary_ka: string; summary_en: string; demand_ka: string; demand_en: string; languages: string };
  preferenceMenu?: PreferenceMenu;
  guestCard?: { aroma: string; pillow: string; sheets: string };
  demoScript: { chargeId: string; window: WindowNo }[];
  csvSample: string;
}

// Which windows are open is persisted server-side so a close survives reloads, resets and property switches.
// Each browser applies its own changes locally first; `writer` + `seqByClient` let the server drop stale
// requests and let clients adopt only other operators' changes.
export interface UiState {
  openWindows: Record<AppId, boolean>;
  focusedWindow: AppId | null;
  rev: number;
  writer: string | null;
  seqByClient: Record<string, number>;
}

export interface SimuState {
  bootId: string; // changes when the server process restarts; clients reset version tracking on change
  mode: "online" | "offline";
  property: PropertyInfo;
  ui: UiState;
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
