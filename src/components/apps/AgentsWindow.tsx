"use client";

import { Cpu } from "lucide-react";
import { agentRoster, PRESENCE_COLOR } from "../appRegistry";
import type { SimuState } from "@/lib/simustay/types";

export default function AgentsWindow({ state }: { state: SimuState }) {
  const agents = agentRoster(state);
  return (
    <div className="scroll-thin h-full space-y-3 overflow-y-auto bg-os-panel p-4">
      {agents.map((a) => (
        <div key={a.id} className="rounded-2xl border border-white/5 bg-os-card p-4">
          <div className="flex items-center gap-3">
            <span className="relative">
              <span className="grid h-11 w-11 place-items-center rounded-full text-[13px] font-bold text-white" style={{ background: a.gradient }}>{a.initials}</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-os-card" style={{ background: PRESENCE_COLOR[a.presence] }} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-os-ink">{a.name}</div>
              <div className="truncate text-[13px] text-os-mute">{a.role_ka}</div>
            </div>
            <span className="rounded-full px-2.5 py-0.5 text-[12px] font-medium" style={{ color: PRESENCE_COLOR[a.presence], background: `${PRESENCE_COLOR[a.presence]}1f` }}>
              {a.presence}
            </span>
          </div>
          <div className="mt-3 flex items-start gap-2 text-[12px] text-os-mute"><Cpu className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {a.engine}</div>
          <div className="mt-1 text-[13px] text-os-ink/90">{a.status}</div>
          <div className="mt-2 rounded-xl bg-black/25 px-3 py-2 font-mono text-[12px] text-os-mute">{a.lastAction}</div>
        </div>
      ))}
    </div>
  );
}
