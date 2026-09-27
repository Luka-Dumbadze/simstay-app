// Single source of truth for the eight SimStay apps: launchpad cards, docks and windows all read it.
import {
  Blocks, BotMessageSquare, ConciergeBell, FileSearch, LayoutGrid, MessageCircle, Smartphone, Workflow, type LucideIcon,
} from "lucide-react";
import { folioTotals } from "@/lib/simustay/grader";
import type { AppId, SimuState } from "@/lib/simustay/types";

export interface AppMeta {
  id: AppId;
  name: string;
  name_ka: string;
  blurb: (s: SimuState) => string;
  icon: LucideIcon;
  badge: string; // badge background
  glyph: string; // icon colour on the badge
  min: { w: number; h: number };
  title: (s: SimuState) => string;
  stat: (s: SimuState) => string;
  tags: string[];
}

export const APP_ORDER: AppId[] = ["ingest", "pms", "comms", "phone", "board", "agents", "ops", "store"];

export const APPS: Record<AppId, AppMeta> = {
  ingest: {
    id: "ingest",
    name: "Rule Studio",
    name_ka: "წესების სტუდია",
    blurb: (s) => `PDF ingest of ${s.property.short} SOPs into graded H / P / D rules with verbatim sources.`,
    icon: FileSearch,
    badge: "#F59E0B",
    glyph: "#1A1203",
    min: { w: 360, h: 300 },
    title: (s) => `Rule Studio · ${s.property.short}`,
    stat: (s) => (s.rules.length ? `${s.rules.length} rules · ${s.published ? "published v1" : "draft"}` : "no document ingested"),
    tags: ["PDF", "Gemini / offline cache"],
  },
  pms: {
    id: "pms",
    name: "PMS Simulator",
    name_ka: "ფოლიო და ანგარიშსწორება",
    blurb: () => "Front-desk folio and billing routing with a deterministic error gate before posting.",
    icon: ConciergeBell,
    badge: "#3B82F6",
    glyph: "#FFFFFF",
    min: { w: 560, h: 420 },
    title: (s) => (s.published ? s.shiftTitle_ka : "PMS · ფოლიო"),
    stat: (s) => {
      const t = folioTotals(s.folio);
      return s.checkedOut ? `${s.folio.roomLabel_en} · checked out` : `W1 ${t.byWindow[1].toFixed(0)} · W2 ${t.byWindow[2].toFixed(0)} · open ${t.unrouted.toFixed(0)} GEL`;
    },
    tags: ["Folio", "Grader"],
  },
  comms: {
    id: "comms",
    name: "Comms Hub",
    name_ka: "სტუმართან მიმოწერა",
    blurb: () => "WhatsApp- or Telegram-style guest chat with button-first quick replies in Georgian.",
    icon: MessageCircle,
    badge: "#F4F4F5",
    glyph: "#18191E",
    min: { w: 320, h: 320 },
    title: (s) => `სტუმარი · ${s.workspace.skins.comms === "whatsapp" ? "WhatsApp-style" : "Telegram-style"}`,
    stat: (s) => `${s.workspace.skins.comms === "whatsapp" ? "WhatsApp" : "Telegram"}-style · ${s.chat.filter((m) => m.from !== "system").length} messages`,
    tags: ["Guest", "ka / en"],
  },
  phone: {
    id: "phone",
    name: "Housekeeping",
    name_ka: "დიასახლისობა",
    blurb: () => "Mobile inspection view: five big taps, one photo with AI check tags, supervisor sign-off.",
    icon: Smartphone,
    badge: "#EF4444",
    glyph: "#FFFFFF",
    min: { w: 240, h: 380 },
    title: () => "დიასახლისობა · /m/hk",
    stat: (s) => `${s.tasks.filter((t) => t.state === "open").length} open tasks · ${s.rooms.filter((r) => r.status === "clean").length} awaiting inspection`,
    tags: ["Mobile", "Photo proof"],
  },
  board: {
    id: "board",
    name: "Live PMS Board",
    name_ka: "ოთახების დაფა",
    blurb: (s) => `${s.property.short}: ${s.rooms.length} units, live status grid with the adapter log and impact HUD.`,
    icon: LayoutGrid,
    badge: "#22C55E",
    glyph: "#04210F",
    min: { w: 420, h: 360 },
    title: (s) => `Live PMS Board · ${s.property.short} (Mock PMS)`,
    stat: (s) => `${s.rooms.length} units · ${s.rooms.filter((r) => r.status === "inspected").length} sellable · ${s.rooms.filter((r) => r.status === "dirty").length} dirty`,
    tags: ["Mews-shaped", "Impact HUD"],
  },
  agents: {
    id: "agents",
    name: "AI Team",
    name_ka: "AI გუნდი",
    blurb: () => "Synthetic guest, rule extractor, grader and dispatcher: status and last action of every agent.",
    icon: BotMessageSquare,
    badge: "#EC4899",
    glyph: "#FFFFFF",
    min: { w: 420, h: 360 },
    title: () => "AI Team · Agents",
    stat: (s) => `${agentRoster(s).filter((a) => a.presence !== "idle").length}/4 agents active`,
    tags: ["Synthetic guest", "Grader"],
  },
  ops: {
    id: "ops",
    name: "Operations",
    name_ka: "ოპერაციები",
    blurb: () => "Task management and hand-offs from front desk to housekeeping to supervisor.",
    icon: Workflow,
    badge: "#8B5CF6",
    glyph: "#FFFFFF",
    min: { w: 480, h: 360 },
    title: () => "Operations · Tasks & hand-offs",
    stat: (s) => `${s.tasks.length} tasks · ${s.adapterLog.filter((l) => l.line.startsWith("PATCH")).length} PMS hand-offs`,
    tags: ["Kanban", "Timeline"],
  },
  store: {
    id: "store",
    name: "App Store",
    name_ka: "აპები და ინტეგრაციები",
    blurb: () => "Modular integrations (Mews, Cloudbeds, OtelMS), installed apps, skins and workspace profiles.",
    icon: Blocks,
    badge: "#2563EB",
    glyph: "#FFFFFF",
    min: { w: 480, h: 380 },
    title: () => "App Store · Integrations & workspace",
    stat: (s) => `${s.workspace.installed_apps.length} of ${APP_ORDER.length} apps installed`,
    tags: ["Mews", "Cloudbeds", "OtelMS"],
  },
};

// ---- AI team roster (sidebar avatars + AI Team window) ------------------------------

export type Presence = "live" | "grading" | "standby" | "idle";

export interface Agent {
  id: string;
  name: string;
  role_ka: string;
  initials: string;
  gradient: string;
  presence: Presence;
  engine: string;
  status: string;
  lastAction: string;
}

export const PRESENCE_COLOR: Record<Presence, string> = {
  live: "#22C55E",
  grading: "#A855F7",
  standby: "#F59E0B",
  idle: "#52525B",
};

export function agentRoster(s: SimuState): Agent[] {
  const lastGuest = [...s.chat].reverse().find((m) => m.from === "guest");
  const lastGate = s.gateLog.at(-1);
  const lastPatch = [...s.adapterLog].reverse().find((l) => l.line.startsWith("PATCH"));
  const openTasks = s.tasks.filter((t) => t.state === "open").length;
  return [
    {
      id: "guest",
      name: "Synthetic Guest",
      role_ka: `სინთეზური სტუმარი · ${s.folio.guest}`,
      initials: s.folio.guest.split(/\s+/).map((p) => p[0]).join("").slice(0, 2),
      gradient: s.property.id === "bioli" ? "linear-gradient(135deg,#86EFAC,#15803D)" : "linear-gradient(135deg,#34D399,#0EA5E9)",
      presence: s.published && !s.checkedOut ? "live" : "idle",
      engine: "Scripted beats (deterministic) · LLM paraphrase online only",
      status: s.published ? (s.checkedOut ? "checked out" : "in conversation") : "waiting for published rules",
      lastAction: lastGuest ? lastGuest.text_ka : "—",
    },
    {
      id: "grader",
      name: "Grader",
      role_ka: "შემფასებელი · წესების ძრავა",
      initials: "GR",
      gradient: "linear-gradient(135deg,#A855F7,#6366F1)",
      presence: s.published ? "grading" : "idle",
      engine: "Deterministic TypeScript rule engine · no LLM in the grading path",
      status: `${s.rules.filter((r) => r.tier !== "D").length} graded rules · ${s.metrics.movesGraded} moves graded · ${s.metrics.errorsCaught} caught`,
      lastAction: lastGate ? `${lastGate.ok ? "✓" : "✗"} ${lastGate.ruleId === "OK" ? "move accepted" : `${lastGate.ruleId}: ${lastGate.message_ka}`}` : "—",
    },
    {
      id: "extractor",
      name: "Rule Extractor",
      role_ka: "წესების ამომღები · SOP → წესები",
      initials: "RX",
      gradient: "linear-gradient(135deg,#F59E0B,#EF4444)",
      presence: s.mode === "online" ? "live" : "standby",
      engine: s.mode === "online" ? "Gemini 2.5 Flash · 2.5 s timeout → cache" : "Offline cache (stage mode)",
      status: s.ingest ? `${s.ingest.fileName} · ${s.ingest.source}` : "no document yet",
      lastAction: s.ingest ? `${s.rules.length} rules extracted` : "—",
    },
    {
      id: "dispatcher",
      name: "HK Dispatcher",
      role_ka: "დიასახლისობის დისპეჩერი",
      initials: "HK",
      gradient: "linear-gradient(135deg,#F43F5E,#EC4899)",
      presence: openTasks > 0 ? "live" : "idle",
      engine: "Event rules · Mews-shaped PMS adapter (dry-run)",
      status: `${openTasks} open tasks`,
      lastAction: lastPatch ? lastPatch.line : "—",
    },
  ];
}
