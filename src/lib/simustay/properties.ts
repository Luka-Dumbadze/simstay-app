// Property registry: rules and scenario per client resort. Small JSON only, so the client can import it too.
import ambassadoriRules from "@/lib/simustay/fixtures/rules.ambassadori.json";
import ambassadoriScenario from "@/lib/simustay/fixtures/scenario.ambassadori-villa.json";
import bioliRules from "@/lib/simustay/fixtures/rules.bioli.json";
import bioliScenario from "@/lib/simustay/fixtures/scenario.bioli-cottage.json";
import type { ChatMessage, MenuOption, PropertyId, PropertyInfo, QuickReply, Rule } from "./types";

export interface PropertyPack {
  id: PropertyId;
  name: string;
  short: string;
  rules: Rule[];
  document: { fileName: string; pages: number };
  scenario: {
    shiftTitle_ka: string;
    shiftTitle_en: string;
    opening: Omit<ChatMessage, "id" | "t">[];
    quickReplies: QuickReply[];
    hkChecklist: { id: string; label_ka: string; label_en: string }[];
  };
  pdfShaEnv: string;
}

export const PROPERTIES: Record<PropertyId, PropertyPack> = {
  ambassadori: {
    id: "ambassadori",
    name: ambassadoriScenario.property.name,
    short: ambassadoriScenario.property.short,
    rules: ambassadoriRules.rules as Rule[],
    document: ambassadoriRules.document,
    scenario: ambassadoriScenario as unknown as PropertyPack["scenario"],
    pdfShaEnv: "SIMUSTAY_DEMO_PDF_SHA",
  },
  bioli: {
    id: "bioli",
    name: bioliScenario.property.name,
    short: bioliScenario.property.short,
    rules: bioliRules.rules as Rule[],
    document: bioliRules.document,
    scenario: bioliScenario as unknown as PropertyPack["scenario"],
    pdfShaEnv: "SIMUSTAY_DEMO_PDF_SHA_BIOLI",
  },
};

export const PROPERTY_IDS = Object.keys(PROPERTIES) as PropertyId[];

export const isPropertyId = (v: unknown): v is PropertyId => typeof v === "string" && v in PROPERTIES;

// Georgian and English labels for the guest's confirmed card; null when the property publishes no menu.
export function guestCardLabels(p: PropertyInfo): { aroma: string; pillow: string; sheets: string; en: string } | null {
  const menu = p.preferenceMenu;
  const card = p.guestCard;
  if (!menu || !card) return null;
  const pick = (options: MenuOption[], id: string) => options.find((o) => o.id === id);
  const aroma = pick(menu.aroma, card.aroma);
  const pillow = pick(menu.pillow, card.pillow);
  const sheets = pick(menu.sheets, card.sheets);
  if (!aroma || !pillow || !sheets) return null;
  return {
    aroma: aroma.label_ka,
    pillow: pillow.label_ka,
    sheets: sheets.label_ka,
    en: `${aroma.label_en} · ${pillow.label_en} pillow · ${sheets.label_en} sheets`,
  };
}
