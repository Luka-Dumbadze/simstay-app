// Workspace profiles: which apps a hotel has installed and which skin each app wears.
import profilesJson from "@/lib/simustay/fixtures/profiles.json";
import type { AppId, WorkspaceProfile } from "./types";

export const PROFILES = profilesJson.profiles as WorkspaceProfile[];
export const DEFAULT_PROFILE_ID = profilesJson.default;

export const findProfile = (id: string | undefined): WorkspaceProfile | undefined => PROFILES.find((p) => p.id === id);

export const APP_IDS: AppId[] = ["ingest", "pms", "comms", "phone", "board", "agents", "ops", "store"];

export const SKIN_LABELS = {
  pms: { classic: "Opera-style · 4-window split", modern: "Modern cloud PMS" },
  comms: { whatsapp: "WhatsApp-style", telegram: "Telegram-style" },
} as const;
