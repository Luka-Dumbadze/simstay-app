"use client";

import { useState } from "react";
import { Check, FileSpreadsheet, Hash, Loader2, Lock, Plug, Plus, Trash2, X } from "lucide-react";
import { act, toast } from "@/lib/simustay/client";
import { MARKET_STATUS, MARKETPLACE, marketApp, type MarketAppId } from "@/lib/simustay/marketplace";
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

// One row per app, core or marketplace, so both sections render the same way.
interface Listing {
  id: string;
  name: string;
  name_ka: string;
  category: string;
  description: string;
  icon: (typeof MARKETPLACE)[number]["icon"];
  badge: string;
  glyph: string;
  core: boolean;
}

function listings(state: SimuState): Listing[] {
  const core: Listing[] = APP_ORDER.map((id) => {
    const a = APPS[id];
    return { id, name: a.name, name_ka: a.name_ka, category: a.tags.join(" · "), description: a.blurb(state), icon: a.icon, badge: a.badge, glyph: a.glyph, core: true };
  });
  const market: Listing[] = MARKETPLACE.map((m) => ({ ...m, core: false }));
  return [...core, ...market];
}

// One-click install / uninstall; the Launchpad and dock follow through the live state stream.
export async function setInstalled(id: string, name: string, install: boolean): Promise<boolean> {
  const out = await act("workspace", install ? { install: id } : { uninstall: id });
  if (out.ok) toast(install ? `✓ დაინსტალირდა · ${name} installed` : `წაიშალა · ${name} uninstalled`, install ? "ok" : "info");
  // Installing the Slack hub switches the guest chat to its #guest-requests view (uninstall reverts on the server).
  if (out.ok && install && id === "slack") await showSlackView();
  return out.ok;
}

async function showSlackView(): Promise<boolean> {
  const out = await act("workspace", { commsSkin: "slack" });
  if (out.ok) toast("Comms Hub · Slack #guest-requests", "info");
  return out.ok;
}

export default function AppStoreWindow({ state }: { state: SimuState }) {
  const ws = state.workspace;
  const on = new Set<string>([...ws.installed_apps, ...(ws.marketplace_apps ?? [])]);
  const all = listings(state);
  const installed = all.filter((l) => on.has(l.id));
  const available = all.filter((l) => !on.has(l.id));
  const [busy, setBusy] = useState<string | null>(null);

  const toggle = async (l: Listing, install: boolean) => {
    setBusy(l.id);
    await setInstalled(l.id, l.name, install);
    setBusy(null);
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
    <div data-testid="app-store" className="scroll-thin h-full space-y-6 overflow-y-auto bg-os-panel p-4">
      <section>
        <SectionHead title="Installed apps" sub={`დაინსტალირებული · ${installed.length}`} />
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {installed.map((l) => (
            <div key={l.id} data-testid={`installed-${l.id}`} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-os-card px-3 py-2">
              <Badge l={l} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium text-os-ink">{l.name}</div>
                <div className="truncate text-[12px] text-os-mute">{l.core ? l.category : `${l.category} · ${MARKET_STATUS}`}</div>
              </div>
              {l.id === "store" ? (
                <span className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[12px] text-os-mute"><Lock className="h-3.5 w-3.5" /> System</span>
              ) : (
                <button
                  data-testid={`uninstall-${l.id}`}
                  onClick={() => void toggle(l, false)}
                  disabled={busy === l.id}
                  className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[12px] font-medium text-os-ink hover:bg-rose-500/20 hover:text-rose-200 disabled:opacity-50"
                >
                  {busy === l.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Uninstall
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHead title="App Store Marketplace · Available integrations" sub={`ხელმისაწვდომი · ${available.length}`} />
        {available.length === 0 && <div className="rounded-2xl border border-white/5 bg-os-card p-4 text-[13px] text-os-mute">Everything is installed.</div>}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {available.map((l) => (
            <div key={l.id} data-testid={`market-${l.id}`} className="flex flex-col rounded-2xl border border-white/5 bg-os-card p-3">
              <div className="flex items-start gap-3">
                <Badge l={l} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-os-ink">{l.name}</div>
                  <div className="text-[12px] text-os-mute">{l.name_ka}</div>
                </div>
              </div>
              <p className="mt-2 line-clamp-3 text-[12px] leading-snug text-os-mute">{l.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="truncate rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-os-mute">{l.core ? "Core app" : l.category}</span>
                <button
                  data-testid={`install-${l.id}`}
                  onClick={() => void toggle(l, true)}
                  disabled={busy === l.id}
                  className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-[#2563EB] px-3 py-1 text-[12px] font-semibold text-white hover:bg-[#3b74f0] disabled:opacity-50"
                >
                  {busy === l.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Install
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHead title="Connected systems" sub="PMS · skins · exports" />
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
        <SectionHead title="Workspace profile & skins" sub="per-hotel look" />
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
        <div className="mt-2 flex flex-wrap gap-2">
          {(["classic", "modern"] as const).map((v) => (
            <Pill key={v} active={ws.skins.pms === v} onClick={() => void act("workspace", { pmsSkin: v })}>PMS · {SKIN_LABELS.pms[v]}</Pill>
          ))}
          {(ws.marketplace_apps?.includes("slack") ? (["whatsapp", "telegram", "slack"] as const) : (["whatsapp", "telegram"] as const)).map((v) => (
            <Pill key={v} active={ws.skins.comms === v} onClick={() => void act("workspace", { commsSkin: v })}>Chat · {SKIN_LABELS.comms[v]}</Pill>
          ))}
        </div>
      </section>
    </div>
  );
}

// Opened from a marketplace add-on's Launchpad card or dock icon: what it will do, and its honest status.
export function MarketAppPanel({ id, onClose, onOpenApp }: { id: MarketAppId; onClose: () => void; onOpenApp: (id: AppId) => void }) {
  const m = marketApp(id);
  const Icon = m.icon;
  const [busy, setBusy] = useState(false);
  return (
    <div className="fixed inset-0 z-[9200] grid place-items-center bg-black/50 backdrop-blur-[2px]" onClick={onClose}>
      <div data-testid={`market-panel-${id}`} onClick={(e) => e.stopPropagation()} className="w-[520px] max-w-[calc(100vw-32px)] rounded-3xl border border-white/10 bg-os-card p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full" style={{ background: m.badge }}>
            <Icon className="h-7 w-7" style={{ color: m.glyph }} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[20px] font-semibold text-os-ink">{m.name}</div>
            <div className="text-[13px] text-os-mute">{m.name_ka} · {m.category}</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full text-os-mute hover:bg-white/5 hover:text-os-ink"><X className="h-4 w-4" /></button>
        </div>
        <p className="mt-4 text-[14px] leading-relaxed text-os-ink">{m.description}</p>
        <ul className="mt-3 space-y-1.5">
          {m.does.map((d) => (
            <li key={d} className="flex items-start gap-2 text-[13px] text-os-mute"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> {d}</li>
          ))}
        </ul>
        <div className="mt-4 rounded-2xl bg-white/5 px-3 py-2 text-[12px] text-os-mute">
          <b className="text-os-ink">Installed · {MARKET_STATUS}.</b> No account is connected and no data leaves SimStay.
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            data-testid={`panel-uninstall-${id}`}
            disabled={busy}
            onClick={async () => { setBusy(true); if (await setInstalled(id, m.name, false)) onClose(); setBusy(false); }}
            className="flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-2 text-[13px] text-os-ink hover:bg-rose-500/20 hover:text-rose-200 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" /> Uninstall
          </button>
          {id === "slack" ? (
            <button
              data-testid="open-slack-view"
              onClick={async () => { if (await showSlackView()) { onOpenApp("comms"); onClose(); } }}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
              style={{ background: "#4A154B" }}
            >
              <Hash className="h-4 w-4" /> Open #guest-requests
            </button>
          ) : (
            <button onClick={onClose} className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#0B0C0E] hover:bg-white/90">Done</button>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-2 flex items-baseline gap-2">
      <h4 className="text-[12px] font-semibold uppercase tracking-wide text-os-ink">{title}</h4>
      <span className="text-[12px] text-os-mute">{sub}</span>
    </div>
  );
}

function Badge({ l, size }: { l: Listing; size: "sm" | "md" }) {
  const Icon = l.icon;
  const box = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const glyph = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <span className={`grid ${box} shrink-0 place-items-center rounded-full`} style={{ background: l.badge }}>
      <Icon className={glyph} style={{ color: l.glyph }} />
    </span>
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
