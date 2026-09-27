"use client";

import { Check, FileSpreadsheet, Plug, Plus } from "lucide-react";
import { act, toast } from "@/lib/simustay/client";
import { PROFILES, SKIN_LABELS } from "@/lib/simustay/profiles";
import type { AppId, SimuState } from "@/lib/simustay/types";
import { APP_ORDER, APPS } from "../appRegistry";

// Honest labels: only the Mews-shaped adapter is wired (dry-run); the others are skins or CSV paths.
const INTEGRATIONS = [
  { id: "mews", name: "Mews", kind: "PMS connector", status: "Mews-shaped adapter · dry-run", color: "#22C55E", action: null },
  { id: "cloudbeds", name: "Cloudbeds", kind: "PMS UI skin", status: "modern folio skin · API planned", color: "#F59E0B", action: "modern" },
  { id: "otelms", name: "OtelMS", kind: "Daily export", status: "CSV import (room,status)", color: "#3B82F6", action: "csv" },
  { id: "opera", name: "Opera-style desk", kind: "PMS UI skin", status: "classic 4-window split folio", color: "#A1A1AA", action: "classic" },
] as const;

export default function StoreWindow({ state }: { state: SimuState }) {
  const ws = state.workspace;
  const installed = new Set(ws.installed_apps);

  const toggleApp = (id: AppId) => {
    if (id === "store") return;
    const next = installed.has(id) ? ws.installed_apps.filter((a) => a !== id) : [...ws.installed_apps, id];
    void act("workspace", { installed_apps: next });
  };

  const runIntegration = async (action: (typeof INTEGRATIONS)[number]["action"]) => {
    if (action === "csv") {
      const out = await act("csv-import");
      if (out.ok && out.note) toast(out.note, "ok");
    } else if (action === "modern" || action === "classic") {
      await act("workspace", { pmsSkin: action });
    }
  };

  return (
    <div className="scroll-thin h-full space-y-5 overflow-y-auto bg-os-panel p-4">
      <section>
        <h4 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-os-mute">Workspace profile</h4>
        <div className="grid grid-cols-2 gap-2">
          {PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => void act("workspace", { profileId: p.id })}
              className={`rounded-2xl border p-3 text-left transition ${ws.profileId === p.id ? "border-[#2563EB] bg-[#2563EB]/10" : "border-white/5 bg-os-card hover:bg-os-hover"}`}
            >
              <div className="text-[14px] font-semibold text-os-ink">{p.name}</div>
              <div className="mt-0.5 line-clamp-2 text-[12px] text-os-mute">{p.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h4 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-os-mute">Skins</h4>
        <div className="flex flex-wrap gap-2">
          {(["classic", "modern"] as const).map((v) => (
            <Pill key={v} active={ws.skins.pms === v} onClick={() => void act("workspace", { pmsSkin: v })}>PMS · {SKIN_LABELS.pms[v]}</Pill>
          ))}
          {(["whatsapp", "telegram"] as const).map((v) => (
            <Pill key={v} active={ws.skins.comms === v} onClick={() => void act("workspace", { commsSkin: v })}>Chat · {SKIN_LABELS.comms[v]}</Pill>
          ))}
        </div>
      </section>

      <section>
        <h4 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-os-mute">Integrations</h4>
        <div className="grid grid-cols-2 gap-2">
          {INTEGRATIONS.map((i) => (
            <div key={i.id} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-os-card p-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: `${i.color}22`, color: i.color }}>
                {i.action === "csv" ? <FileSpreadsheet className="h-5 w-5" /> : <Plug className="h-5 w-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-os-ink">{i.name}</div>
                <div className="truncate text-[12px] text-os-mute">{i.kind} · {i.status}</div>
              </div>
              {i.action && (
                <button onClick={() => void runIntegration(i.action)} className="rounded-full bg-white/10 px-3 py-1 text-[12px] text-os-ink hover:bg-white/20">
                  {i.action === "csv" ? "Import" : "Apply"}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h4 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-os-mute">Apps</h4>
        <div className="space-y-1.5">
          {APP_ORDER.map((id) => {
            const app = APPS[id];
            const Icon = app.icon;
            const on = installed.has(id);
            return (
              <div key={id} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-os-card px-3 py-2">
                <span className="grid h-8 w-8 place-items-center rounded-full" style={{ background: app.badge }}>
                  <Icon className="h-4 w-4" style={{ color: app.glyph }} />
                </span>
                <span className="flex-1 text-[14px] text-os-ink">{app.name}</span>
                <button
                  onClick={() => toggleApp(id)}
                  disabled={id === "store"}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-medium disabled:opacity-40 ${on ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-os-ink hover:bg-white/20"}`}
                >
                  {on ? <><Check className="h-3.5 w-3.5" /> Installed</> : <><Plus className="h-3.5 w-3.5" /> Install</>}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Pill(props: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={props.onClick}
      className={`rounded-full border px-3 py-1.5 text-[13px] ${props.active ? "border-[#2563EB] bg-[#2563EB]/15 text-white" : "border-white/10 text-os-mute hover:bg-white/5"}`}
    >
      {props.children}
    </button>
  );
}
