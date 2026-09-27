"use client";

import { ArrowRightLeft, ClipboardList, ShieldAlert, ShieldCheck } from "lucide-react";
import { clock, unitName } from "@/lib/simustay/client";
import type { HkTask, SimuState } from "@/lib/simustay/types";

const COLUMNS: { state: HkTask["state"]; label: string; color: string }[] = [
  { state: "open", label: "ღია · Open", color: "#EF4444" },
  { state: "cleaned", label: "დასუფთავებული · Cleaned", color: "#22C55E" },
  { state: "inspected", label: "შემოწმებული · Inspected", color: "#3B82F6" },
];

interface Handoff { t: number; kind: "gate-fail" | "gate-ok" | "pms"; text: string }

export default function OpsWindow({ state }: { state: SimuState }) {
  const handoffs: Handoff[] = [
    ...state.gateLog
      .filter((g) => !g.ok || g.ruleId === "BAL")
      .map((g) => ({ t: g.at, kind: g.ok ? ("gate-ok" as const) : ("gate-fail" as const), text: g.ok ? `ფრონტ-ოფისი → დიასახლისობა · ${g.message_ka}` : `გრეიდერმა დაბლოკა · ${g.ruleId}: ${g.message_ka}` })),
    ...state.adapterLog.filter((l) => l.line.startsWith("PATCH") || l.line.startsWith("IMPORT")).map((l) => ({ t: l.t, kind: "pms" as const, text: l.line })),
  ].sort((a, b) => b.t - a.t);

  return (
    <div className="flex h-full flex-col bg-os-panel">
      <div className="grid shrink-0 grid-cols-3 gap-3 p-4">
        {COLUMNS.map((col) => {
          const tasks = state.tasks.filter((t) => t.state === col.state);
          return (
            <div key={col.state} className="rounded-2xl border border-white/5 bg-os-card p-3">
              <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-os-mute">
                <span className="h-2 w-2 rounded-full" style={{ background: col.color }} /> {col.label}
                <span className="ml-auto text-os-ink">{tasks.length}</span>
              </div>
              <div className="scroll-thin max-h-40 space-y-1.5 overflow-y-auto">
                {tasks.map((t) => (
                  <div key={t.id} className="rounded-xl bg-black/25 px-2.5 py-1.5 text-[13px]">
                    <div className="font-medium text-os-ink">{unitName(state.rooms, t.room)}</div>
                    <div className="text-[11px] text-os-mute">{t.kind === "departure" ? "გასვლა" : "დარჩენა"} · {t.checklist.filter((i) => i.done).length}/{t.checklist.length}{t.photo ? " · 📷" : ""}</div>
                  </div>
                ))}
                {tasks.length === 0 && <div className="py-2 text-center text-[12px] text-os-mute">—</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 px-4 text-[12px] font-semibold uppercase tracking-wide text-os-mute">
        <ArrowRightLeft className="h-3.5 w-3.5" /> Hand-offs
      </div>
      <div className="scroll-thin min-h-0 flex-1 space-y-1.5 overflow-y-auto px-4 pb-4 pt-2">
        {handoffs.length === 0 && (
          <div className="flex items-center gap-2 text-[13px] text-os-mute"><ClipboardList className="h-4 w-4" /> ჯერ გადაცემა არ ყოფილა</div>
        )}
        {handoffs.map((h, i) => (
          <div key={`${h.t}-${i}`} className="flex items-start gap-2 rounded-xl border border-white/5 bg-os-card px-3 py-2 text-[13px]">
            {h.kind === "gate-fail" ? <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" /> : h.kind === "gate-ok" ? <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> : <ArrowRightLeft className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />}
            <span className={`flex-1 ${h.kind === "pms" ? "font-mono text-[12px] text-os-mute" : "text-os-ink"}`}>{h.text}</span>
            <span className="shrink-0 font-mono text-[11px] text-os-mute" suppressHydrationWarning>{clock(h.t)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
