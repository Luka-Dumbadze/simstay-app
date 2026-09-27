"use client";

import { LayoutDashboard } from "lucide-react";
import type { MarketApp, MarketAppId } from "@/lib/simustay/marketplace";
import { APPS } from "./appRegistry";
import type { AppId } from "@/lib/simustay/types";

// Centered floating pill: the first button returns to the Launchpad. Each app icon acts on that one app only
// (solo launch from the Launchpad; open / focus / minimise inside the workspace) and never opens the demo layout.
export default function BottomDock(props: {
  installed: AppId[];
  market: MarketApp[]; // installed marketplace add-ons, after a divider
  openIds: Set<AppId>;
  focused: AppId | null;
  view: "launchpad" | "workspace";
  onLaunchpad: () => void;
  onApp: (id: AppId) => void;
  onMarket: (id: MarketAppId) => void;
}) {
  return (
    <nav
      data-testid="bottom-dock"
      className="fixed bottom-6 left-1/2 z-[9100] flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-os-panel/90 px-4 py-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,.8)] backdrop-blur-md"
    >
      <button
        onClick={props.onLaunchpad}
        title="Launchpad (Ctrl+Shift+L)"
        aria-label="Launchpad"
        className={`grid h-11 w-11 place-items-center rounded-full transition ${props.view === "launchpad" ? "bg-white text-[#0B0C0E]" : "bg-white/5 text-os-ink hover:bg-white/10"}`}
      >
        <LayoutDashboard className="h-5 w-5" />
      </button>
      <span className="h-7 w-px bg-white/10" />
      {props.installed.map((id) => {
        const app = APPS[id];
        const Icon = app.icon;
        const active = props.view === "workspace" && props.openIds.has(id);
        return (
          <button key={id} data-testid={`dock-${id}`} onClick={() => props.onApp(id)} title={app.name} aria-label={`Open ${app.name}`} className="group relative flex flex-col items-center">
            <span
              className={`grid h-11 w-11 place-items-center rounded-full transition group-hover:-translate-y-1 ${props.view === "workspace" && props.focused === id ? "ring-2 ring-white/70 ring-offset-2 ring-offset-os-panel" : ""}`}
              style={{ background: app.badge }}
            >
              <Icon className="h-5 w-5" style={{ color: app.glyph }} />
            </span>
            <span className={`absolute -bottom-2 h-1 w-1 rounded-full ${active ? "bg-os-ink" : "bg-transparent"}`} />
          </button>
        );
      })}
      {props.market.length > 0 && <span className="h-7 w-px bg-white/10" />}
      {props.market.map((m) => {
        const Icon = m.icon;
        return (
          <button key={m.id} data-testid={`dock-${m.id}`} onClick={() => props.onMarket(m.id)} title={m.name} aria-label={`Open ${m.name}`} className="group relative flex flex-col items-center">
            <span className="grid h-11 w-11 animate-pop place-items-center rounded-full transition group-hover:-translate-y-1" style={{ background: m.badge }}>
              <Icon className="h-5 w-5" style={{ color: m.glyph }} />
            </span>
          </button>
        );
      })}
    </nav>
  );
}
