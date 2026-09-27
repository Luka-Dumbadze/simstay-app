// Property registry: rules and scenario per client resort. Small JSON only, so the client can import it too.
import ambassadoriRules from "@/lib/simustay/fixtures/rules.ambassadori.json";
import ambassadoriScenario from "@/lib/simustay/fixtures/scenario.ambassadori-villa.json";
import bioliRules from "@/lib/simustay/fixtures/rules.bioli.json";
import bioliScenario from "@/lib/simustay/fixtures/scenario.bioli-cottage.json";
import type { ChatMessage, Folio, LateChargeSpec, MenuOption, PmsSkin, PropertyId, PropertyInfo, QuickReply, Rule, WindowNo } from "./types";

// PMS edition each skin simulates. The folio logic, routes and grader are identical; only the look differs.
// SimStay reproduces the front-desk workflow for training; it is not an Oracle product and connects to no Oracle tenant.
export const PMS_EDITIONS: Record<PmsSkin, { name: string; label: string; badge_ka: string; note: string }> = {
  modern: {
    name: "Oracle OPERA Cloud",
    label: "Oracle OPERA Cloud (ახალი ვერსია)",
    badge_ka: "ახალი ვერსია",
    note: "SimStay training simulation of the OPERA Cloud front-desk workflow · not affiliated with Oracle",
  },
  classic: {
    name: "Oracle OPERA v5",
    label: "Oracle OPERA v5 (კლასიკური / ძველი ვერსია)",
    badge_ka: "კლასიკური / ძველი ვერსია",
    note: "SimStay training simulation of the OPERA v5 front-desk workflow · not affiliated with Oracle",
  },
};

export interface PropertyPack {
  id: PropertyId;
  name: string;
  short: string;
  rules: Rule[];
  document: { fileName: string; pages: number };
  pmsSkin: PmsSkin; // default PMS edition, applied when the property is selected
  scenario: {
    shiftTitle_ka: string;
    shiftTitle_en: string;
    opening: Omit<ChatMessage, "id" | "t">[];
    quickReplies: QuickReply[];
    hkChecklist: { id: string; label_ka: string; label_en: string }[];
    invoices?: { primary: string; supplementary: string };
    lateCharge?: LateChargeSpec;
  };
  pdfShaEnv: string;
  chat?: ChatScript;
  // Loads with its rulebook already read and the shift open (guest greeting in the chat, folio live), so a
  // property switch lands on a playable desk. Without it the start state waits for Rule Studio.
  startsOpen?: boolean;
}

type ChatLine = Omit<ChatMessage, "id" | "t">;

// Property-specific WhatsApp lines driven by the folio. Moves and check-out push them in the same commit,
// so the SSE stream carries the folio change and the chat change together.
export interface ChatScript {
  header?: { title: string; subtitle: string }; // guest header in the chat window
  chips?: Record<string, { text_ka: string; text_en: string }>; // short quick-reply button labels, by reply id
  // Once every listed charge sits in `window`, post `message` (once per stay).
  onRouted?: { chargeIds: string[]; window: WindowNo; message: ChatLine }[];
  onBlocked?: boolean; // a blocked move also posts the coach's notice to the chat
  checkout?: (c: { invoiceNo: string; balance: number }) => { text_ka: string; text_en: string };
}

const bioliCottage = bioliScenario.folio.roomLabel_en.replace(/\s*\(.*\)$/, ""); // "Grand Premium Cottage 12"

export const PROPERTIES: Record<PropertyId, PropertyPack> = {
  ambassadori: {
    id: "ambassadori",
    name: ambassadoriScenario.property.name,
    short: ambassadoriScenario.property.short,
    rules: ambassadoriRules.rules as Rule[],
    document: ambassadoriRules.document,
    pmsSkin: "modern", // Oracle OPERA Cloud (new version)
    scenario: ambassadoriScenario as unknown as PropertyPack["scenario"],
    pdfShaEnv: "SIMUSTAY_DEMO_PDF_SHA",

    chat: {
      onRouted: [
        {
          chargeIds: ["c-villa", "c-golf"],
          window: 2,
          message: {
            from: "system",
            text_ka: "✓ ვილა და გოლფი საქართველოს ბანკის ანგარიშზეა (W2) · 630.00 ₾ · პირდაპირი ანგარიშსწორება",
            text_en: "✓ Villa and golf on the Bank of Georgia account (W2) · 630.00 GEL · direct bill",
          },
        },
        {
          chargeIds: ["c-wine", "c-rest"],
          window: 1,
          message: {
            from: "guest",
            text_ka: "კი, საფერავის 120 ₾ და ვახშმის 240 ₾ ჩემს პირად ბარათზე ჩაწერეთ.",
            text_en: "Yes, put the Saperavi (120 GEL) and dinner (240 GEL) on my personal card.",
          },
        },
      ],
    },
  },
  bioli: {
    id: "bioli",
    name: bioliScenario.property.name,
    short: bioliScenario.property.short,
    rules: bioliRules.rules as Rule[],
    document: bioliRules.document,
    pmsSkin: "classic", // Oracle OPERA v5 (classic / legacy)
    scenario: bioliScenario as unknown as PropertyPack["scenario"],
    pdfShaEnv: "SIMUSTAY_DEMO_PDF_SHA_BIOLI",
    startsOpen: true,
    chat: {
      header: { title: bioliScenario.folio.guest_en, subtitle: `${bioliCottage} • Smart Detox Program` },
      chips: {
        inclusions: { text_ka: "პაკეტის შემოწმება", text_en: "Check the package" },
        personal: { text_ka: "ფიტო-აბაზანის დადასტურება (145 ₾)", text_en: "Confirm the phytobath (145 GEL)" },
      },
      // One line per click: every package or personal charge answers in the chat the moment it lands.
      onRouted: [
        {
          chargeIds: ["c-halo"],
          window: 2,
          message: {
            from: "system",
            text_ka: "✓ მარილის ოთახი დადასტურებულია Smart Detox-ის პაკეტში (0.00 ₾)",
            text_en: "✓ Salt room confirmed in the Smart Detox package (0.00 GEL)",
          },
        },
        {
          chargeIds: ["c-spectro"],
          window: 2,
          message: {
            from: "system",
            text_ka: "✓ სპექტრომეტრია დადასტურებულია პაკეტში (0.00 ₾)",
            text_en: "✓ Spectrometry confirmed in the package (0.00 GEL)",
          },
        },
        {
          chargeIds: ["c-phyto"],
          window: 1,
          message: {
            from: "guest",
            text_ka: "✓ დიახ, დამატებითი ფიტო-აბაზანის 145 ₾ ჩემს პირად ბარათზე გამიწერეთ.",
            text_en: "✓ Yes, put the extra phytobath (145 GEL) on my personal card.",
          },
        },
        {
          chargeIds: ["c-bar"],
          window: 1,
          message: {
            from: "guest",
            text_ka: "✓ ღვინის 250 ₾ პირად ბარათზე გამიწერეთ.",
            text_en: "✓ Put the wine (250 GEL) on my personal card.",
          },
        },
      ],
      onBlocked: true,
      checkout: ({ invoiceNo, balance }) => ({
        text_ka: `✓ გასვლა დასრულდა · ${bioliCottage} · ინვოისი #${invoiceNo} დახურულია · ნაშთი ${balance} ₾ გადახდილია.`,
        text_en: `✓ Check-out complete · ${bioliCottage} · invoice #${invoiceNo} closed · balance ${balance} GEL paid.`,
      }),
    },
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

// Chat lines a successful move of `chargeId` unlocks: every cue whose charges now all sit in its window,
// not yet posted. Pure, so the route and tests share it.
export function routedCues(pack: PropertyPack, folio: Folio, chat: ChatMessage[], chargeId: string): ChatLine[] {
  return (pack.chat?.onRouted ?? [])
    .filter((cue) => cue.chargeIds.includes(chargeId))
    .filter((cue) => cue.chargeIds.every((id) => folio.charges.find((c) => c.id === id)?.window === cue.window))
    .filter((cue) => !chat.some((m) => m.text_ka === cue.message.text_ka))
    .map((cue) => cue.message);
}

// What the guest paid personally at check-out: the total of the guest-paid windows.
export function guestBalance(folio: Folio): number {
  const byWindow = folio.charges.reduce((acc, c) => {
    if (c.window !== null) acc[c.window] = (acc[c.window] ?? 0) + c.amount;
    return acc;
  }, {} as Partial<Record<WindowNo, number>>);
  const sum = folio.windows.filter((w) => w.payerType === "guest").reduce((a, w) => a + (byWindow[w.n] ?? 0), 0);
  return Math.round(sum * 100) / 100;
}
