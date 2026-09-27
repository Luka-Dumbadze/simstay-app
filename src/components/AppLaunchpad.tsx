"use client";

import { ArrowUpRight, Bot, Lock, MonitorPlay } from "lucide-react";
import { APP_ORDER, APPS } from "./appRegistry";
import type { AppId, SimuState } from "@/lib/simustay/types";

// Full-screen app grid: eight modular enterprise apps with live status lines.
export default function AppLaunchpad(props: {
  state: SimuState;
  left: number;
  onOpen: (id: AppId) => void;
  onStartDemo: () => void;
  onAutopilot: () => void;
  autopilot: boolean;
}) {
  const { state } = props;
  const installed = new Set(state.workspace.installed_apps);
  return (
    <main
      data-testid="launchpad"
      className="scroll-thin absolute inset-0 overflow-y-auto pb-32 pt-20"
      style={{ paddingLeft: props.left + 16, paddingRight: 32 }}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex flex-wrap items-end gap-4">
          <div>
            <div className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#C8A96A]">Ambassadori Kachreti Island &amp; Golf Resort</div>
            <h1 className="mt-1 text-[32px] font-semibold tracking-tight text-os-ink">Launchpad</h1>
            <p className="mt-1 text-[15px] text-os-mute">
              {state.folio.roomLabel_en} · {state.folio.guest_en} · {state.folio.company_en}
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
          {APP_ORDER.map((id) => {
            const app = APPS[id];
            const Icon = app.icon;
            const on = installed.has(id);
            return (
              <button
                key={id}
                data-testid={`card-${id}`}
                onClick={() => props.onOpen(on ? id : "store")}
                className={`group relative flex min-h-[236px] flex-col rounded-3xl border border-white/5 bg-os-card p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10 hover:bg-os-hover ${on ? "" : "opacity-50"}`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-full shadow-lg"
                    style={{ background: app.badge, boxShadow: `0 10px 30px -10px ${app.badge}` }}
                  >
                    <Icon className="h-[22px] w-[22px]" style={{ color: app.glyph }} />
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-os-mute opacity-0 transition group-hover:opacity-100">
                    {on ? <ArrowUpRight className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </span>
                </div>
                <h3 className="mt-6 text-[18px] font-semibold text-os-ink">{app.name}</h3>
                <div className="text-[13px] text-os-mute">{app.name_ka}</div>
                <p className="mt-2 line-clamp-2 text-[14px] leading-snug text-os-mute">{app.blurb}</p>
                <div className="mt-auto flex items-center gap-2 pt-5 text-[12px] text-os-ink/80">
                  <span className="h-2 w-2 rounded-full" style={{ background: on ? app.badge : "#52525B" }} />
                  <span className="truncate">{on ? app.stat(state) : "not installed · open App Store"}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {app.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-os-mute">{t}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
