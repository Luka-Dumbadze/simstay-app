// App Store marketplace catalog: add-on integrations a hotel can install next to the eight core apps.
// Honest status: these are preview listings. Installing one adds it to the Launchpad and dock and shows
// what it will do; no connector is built yet and no data leaves SimStay.
import { Hash, Landmark, Luggage, Receipt, type LucideIcon } from "lucide-react";

export type MarketAppId = "slack" | "pos" | "valet" | "rsge";

export interface MarketApp {
  id: MarketAppId;
  name: string;
  name_ka: string;
  category: string;
  description: string;
  does: string[];
  icon: LucideIcon;
  badge: string;
  glyph: string;
}

export const MARKET_STATUS = "Preview · connector on roadmap";

export const MARKETPLACE: MarketApp[] = [
  {
    id: "slack",
    name: "Slack Workspace Hub",
    name_ka: "გუნდის არხი Slack-ში",
    category: "Team communication",
    description: "An alternative team channel: shift hand-offs, grader alerts and housekeeping escalations posted to Slack.",
    does: ["Shift hand-off summary to #front-desk", "Blocked postings flagged to the supervisor channel", "Room-ready pings for housekeeping"],
    icon: Hash,
    badge: "#4A154B",
    glyph: "#FFFFFF",
  },
  {
    id: "pos",
    name: "Syrve / iiko POS Bridge",
    name_ka: "რესტორნისა და ბარის POS",
    category: "Restaurant & bar POS",
    description: "Restaurant and bar checks from Syrve (iiko) land on the guest folio, ready to route and grade.",
    does: ["Closed checks posted to the room folio", "Outlet codes mapped to folio charge codes", "Minibar and bar charges kept on the guest window"],
    icon: Receipt,
    badge: "#F97316",
    glyph: "#1C0A00",
  },
  {
    id: "valet",
    name: "Luggage & Valet Dispatcher",
    name_ka: "ბარგი და ვალეტი",
    category: "Guest services",
    description: "Porter and valet jobs for arrivals, departures and transfers, with baggage tags tracked from car to room.",
    does: ["Departure triggers a porter job", "Baggage tag scan per stage", "Transfer pick-up times from the reservation"],
    icon: Luggage,
    badge: "#0EA5E9",
    glyph: "#04202E",
  },
  {
    id: "rsge",
    name: "RS.ge Tax Invoice Sync",
    name_ka: "საგადასახადო ანგარიშ-ფაქტურა",
    category: "Finance & compliance",
    description: "VAT tax invoices prepared from closed folios for the Revenue Service (rs.ge) declaration.",
    does: ["Company-window charges become an invoice draft", "VAT split per charge code", "Accountant approves before anything is filed"],
    icon: Landmark,
    badge: "#14B8A6",
    glyph: "#03201D",
  },
];

export const MARKET_IDS: MarketAppId[] = MARKETPLACE.map((m) => m.id);
export const isMarketAppId = (id: unknown): id is MarketAppId => typeof id === "string" && (MARKET_IDS as string[]).includes(id);
export const marketApp = (id: MarketAppId): MarketApp => MARKETPLACE.find((m) => m.id === id)!;
