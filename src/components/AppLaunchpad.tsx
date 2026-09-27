"use client";

import { ArrowUpRight, Bot, MonitorPlay } from "lucide-react";
import { MARKET_STATUS, MARKETPLACE, type MarketAppId } from "@/lib/simustay/marketplace";
import { APP_ORDER, APPS } from "./appRegistry";
import type { AppId, SimuState } from "@/lib/simustay/types";

// Full-screen app grid: the installed core apps with live status lines, then installed marketplace add-ons.
// Both lists come from the live workspace state, so an App Store install or uninstall shows here at once.
// A card launches exactly one app: the workspace then shows that window alone (`onOpen` is a solo launch).
// Only the "Live workspace" button opens the four-window demo layout.
export default function AppLaunchpad(props: {
  state: SimuState;
  left: number;
  onOpen: (id: AppId) => void;
  onOpenMarket: (id: MarketAppId) => void;
  onStartDemo: () => void;
  onAutopilot: () => void;
  autopilot: boolean;
}) {
  const { state } = props;
  const installed = new Set(state.workspace.installed_apps);
  const market = MARKETPLACE.filter((m) => state.workspace.marketplace_apps?.includes(m.id));
  return (
    <main
      data-testid="launchpad"
      className="scroll-thin absolute inset-0 overflow-y-auto pb-32 pt-20"
      style={{ paddingLeft: props.left + 16, paddingRight: 32 }}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex flex-wrap items-end gap-4">
          <div>
            <div className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#C8A96A]">{state.property.name}</div>
            <h1 className="mt-1 text-[32px] font-semibold tracking-tight text-os-ink">Launchpad</h1>
            <p className="mt-1 text-[15px] text-os-mute">
              {state.folio.roomLabel_en} · {state.folio.guest_en} · {state.folio.company_en} · {state.rooms.length} units
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={props.onAutopilot}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-os-card px-4 py-2.5 text-[14px] font-medium text-os-ink hover:bg-os-hover"
            >
              <Bot className="h-4 w-4 text-[#EC4899]" /> {props.autopilot ? "Stop autopilot" : "Autopilot"}
            </button>
            <button
              data-testid="start-demo"
              onClick={props.onStartDemo}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-[#0B0C0E] hover:bg-white/90"
            >
              <MonitorPlay className="h-4 w-4" /> Live workspace
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {APP_ORDER.filter((id) => installed.has(id)).map((id) => {
            const app = APPS[id];
            const Icon = app.icon;
            return (
              <button
                key={id}
                data-testid={`card-${id}`}
                onClick={() => props.onOpen(id)}
                className="group relative flex min-h-[236px] flex-col rounded-3xl border border-white/5 bg-os-card p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10 hover:bg-os-hover"
              >
                <div className="flex items-start justify-between">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-full shadow-lg"
                    style={{ background: app.badge, boxShadow: `0 10px 30px -10px ${app.badge}` }}
                  >
                    <Icon className="h-[22px] w-[22px]" style={{ color: app.glyph }} />
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-os-mute opacity-0 transition group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="mt-6 text-[18px] font-semibold text-os-ink">{app.name}</h3>
                <div className="text-[13px] text-os-mute">{app.name_ka}</div>
                <p className="mt-2 line-clamp-2 text-[14px] leading-snug text-os-mute">{app.blurb(state)}</p>
                <div className="mt-auto flex items-center gap-2 pt-5 text-[12px] text-os-ink/80">
                  <span className="h-2 w-2 rounded-full" style={{ background: app.badge }} />
                  <span className="truncate">{app.stat(state)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {app.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-os-mute">{t}</span>
                  ))}
                </div>
              </button>
            );
          })}
          {market.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                data-testid={`card-${m.id}`}
                onClick={() => props.onOpenMarket(m.id)}
                className="group relative flex min-h-[236px] animate-card-in flex-col rounded-3xl border border-white/5 bg-os-card p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10 hover:bg-os-hover"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full shadow-lg" style={{ background: m.badge, boxShadow: `0 10px 30px -10px ${m.badge}` }}>
                    <Icon className="h-[22px] w-[22px]" style={{ color: m.glyph }} />
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-os-mute opacity-0 transition group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="mt-6 text-[18px] font-semibold text-os-ink">{m.name}</h3>
                <div className="text-[13px] text-os-mute">{m.name_ka}</div>
                <p className="mt-2 line-clamp-2 text-[14px] leading-snug text-os-mute">{m.description}</p>
                <div className="mt-auto flex items-center gap-2 pt-5 text-[12px] text-os-ink/80">
                  <span className="h-2 w-2 rounded-full" style={{ background: m.badge }} />
                  <span className="truncate">{MARKET_STATUS}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-os-mute">Marketplace</span>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-os-mute">{m.category}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
