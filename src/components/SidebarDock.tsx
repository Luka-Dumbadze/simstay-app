"use client";

import { Keyboard, Settings } from "lucide-react";
import { agentRoster, PRESENCE_COLOR } from "./appRegistry";
import type { SimuState } from "@/lib/simustay/types";
import type { AgentId } from "./inspectors/AgentInspectorDrawer";

// Left floating pill: brand at the top, live AI agents in the middle, settings at the bottom.
// Each avatar opens its own inspector drawer, anchored to the avatar's vertical position.
export default function SidebarDock(props: {
  state: SimuState;
  activeAgent: AgentId | null;
  onAgent: (id: AgentId, anchorTop: number) => void;
  onSettings: () => void;
  onPresenter: () => void;
}) {
  const agents = agentRoster(props.state);
  return (
    <aside
      data-testid="sidebar-dock"
      className="fixed bottom-4 left-4 top-4 z-[9100] flex w-16 flex-col items-center rounded-3xl border border-white/10 bg-os-panel/90 py-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,.8)] backdrop-blur-md"
    >
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#C8A96A] to-[#8C6A2F] text-[15px] font-black tracking-tight text-[#0B0C0E]" title={`SimStay OS · ${props.state.property.short}`}>
        S
      </div>
      <div className="my-4 h-px w-8 bg-white/10" />

      <div className="flex flex-1 flex-col items-center gap-3">
        {agents.map((a) => (
          <button
            key={a.id}
            data-testid={`agent-${a.id}`}
            onClick={(e) => props.onAgent(a.id as AgentId, e.currentTarget.getBoundingClientRect().top)}
            className="group relative"
            aria-label={a.name}
          >
            <span
              className={`grid h-10 w-10 place-items-center rounded-full text-[12px] font-bold text-white ring-2 transition group-hover:scale-105 ${props.activeAgent === a.id ? "ring-white/80" : "ring-os-panel"}`}
              style={{ background: a.gradient }}
            >
              {a.initials}
            </span>
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-os-panel ${a.presence === "live" || a.presence === "grading" ? "animate-pulse" : ""}`}
              style={{ background: PRESENCE_COLOR[a.presence], boxShadow: a.presence === "idle" ? "none" : `0 0 10px ${PRESENCE_COLOR[a.presence]}` }}
            />
            <span className={`pointer-events-none absolute left-14 top-1/2 z-10 w-56 -translate-y-1/2 rounded-xl border border-white/10 bg-os-card px-3 py-2 text-left text-[12px] opacity-0 shadow-xl transition ${props.activeAgent ? "" : "group-hover:opacity-100"}`}>
              <span className="block font-semibold text-os-ink">{a.name}</span>
              <span className="block text-os-mute">{a.role_ka}</span>
              <span className="mt-1 block" style={{ color: PRESENCE_COLOR[a.presence] }}>● {a.presence} · {a.status}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <button onClick={props.onPresenter} className="grid h-10 w-10 place-items-center rounded-2xl text-os-mute hover:bg-white/5 hover:text-os-ink" title="Presenter controls" aria-label="Presenter controls">
          <Keyboard className="h-5 w-5" />
        </button>
        <button onClick={props.onSettings} className="grid h-10 w-10 place-items-center rounded-2xl text-os-mute hover:bg-white/5 hover:text-os-ink" title="Settings · App Store" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </button>
        <span className="mt-1 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-slate-500 to-slate-700 text-[12px] font-semibold text-white" title="ანა · Trainee">
          ან
        </span>
      </div>
    </aside>
  );
}
