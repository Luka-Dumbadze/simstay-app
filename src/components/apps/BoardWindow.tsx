"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, Clock3, FileSpreadsheet, Loader2, PlugZap, ShieldAlert, Timer, UserCheck } from "lucide-react";
import { act, clock, duration, toast, unitName, useNow } from "@/lib/simustay/client";
import type { Room, RoomStatus, SimuState } from "@/lib/simustay/types";

export const STATUS_META: Record<RoomStatus, { color: string; code: string; ka: string }> = {
  occupied: { color: "#6366F1", code: "OCC", ka: "დაკავებული" },
  dirty: { color: "#EF4444", code: "DIRTY", ka: "დასალაგებელი" },
  clean: { color: "#22C55E", code: "CLEAN", ka: "დასუფთავებული" },
  inspected: { color: "#3B82F6", code: "INSP", ka: "შემოწმებული" },
  ooo: { color: "#111827", code: "OOO", ka: "მწყობრიდან გამოსული" },
  oos: { color: "#A855F7", code: "OOS", ka: "სერვისის გარეშე" },
};

// Illustrative assumption shown on screen: minutes of supervisor time per avoided intervention.
const MIN_PER_INTERVENTION = 6;

export default function BoardWindow({ state }: { state: SimuState }) {
  const now = useNow(500);
  const [importing, setImporting] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const m = state.metrics;
  const focusRoom = state.folio.room;

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [state.adapterLog.length]);

  const ready = m.checkoutAt ? (m.readyAt ? duration(m.readyAt - m.checkoutAt) : duration(now - m.checkoutAt)) : "—";
  const counts = state.rooms.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {} as Partial<Record<RoomStatus, number>>);

  const importCsv = async () => {
    setImporting(true);
    const out = await act("csv-import");
    setImporting(false);
    if (out.ok && out.note) toast(out.note, "ok");
  };

  return (
    <div className="flex h-full flex-col bg-os-panel text-[14px]">
      <div className="flex shrink-0 items-center gap-2 border-b border-white/5 px-3 py-1.5 text-[12px] text-slate-400">
        <PlugZap className="h-3.5 w-3.5 text-amber-400" />
        <span>Adapter: <b className="text-slate-200">Mews-shaped</b> (dry-run) · Mock PMS</span>
        <span className="ml-auto">{state.property.units_ka} · გასაყიდი {counts.inspected ?? 0}</span>
      </div>

      {/* Impact HUD */}
      <div data-testid="impact-hud" className="grid shrink-0 grid-cols-4 gap-px border-b border-white/5 bg-white/5 text-center">
        <Stat icon={ShieldAlert} tone="text-rose-300" label="ჩაწერამდე დაჭერილი შეცდომა" en="errors caught pre-posting" value={String(m.errorsCaught)} />
        <Stat icon={UserCheck} tone="text-sky-300" label="მენეჯერის თავიდან აცილებული ჩარევა" en="interventions avoided" value={String(m.interventionsAvoided)} />
        <Stat icon={Clock3} tone="text-amber-300" label="მენეჯერის დაზოგილი დრო" en={`est. ${MIN_PER_INTERVENTION} min / intervention`} value={`~${m.interventionsAvoided * MIN_PER_INTERVENTION} წთ`} />
        <Stat
          icon={Timer}
          tone={m.readyAt ? "text-emerald-300" : m.checkoutAt ? "text-amber-200" : "text-slate-400"}
          label={`${unitName(state.rooms, focusRoom)}: გასვლიდან მზადყოფნამდე`}
          en={m.readyAt ? "checkout → inspected" : m.checkoutAt ? "turnaround running…" : "turnaround"}
          value={ready}
        />
      </div>

      <div className="shrink-0 border-b border-white/5">
        <div className="flex items-center gap-2 px-3 pt-1.5 text-[12px] font-semibold text-slate-400">
          <Activity className="h-3.5 w-3.5" /> Adapter log
          <button
            onClick={() => void importCsv()}
            disabled={importing}
            className="ml-auto flex items-center gap-1.5 rounded bg-white/10 px-2 py-0.5 font-normal text-slate-200 hover:bg-white/20 disabled:opacity-50"
          >
            {importing ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileSpreadsheet className="h-3 w-3" />}
            PMS ექსპორტის იმპორტი (CSV)
          </button>
        </div>
        <div ref={logRef} data-testid="adapter-log" className="scroll-thin h-[92px] overflow-y-auto px-3 py-1 font-mono text-[12px] leading-relaxed">
          {state.adapterLog.map((l, i) => (
            <div key={`${l.t}-${i}`} className={`${l.line.startsWith("PATCH") ? "text-emerald-300" : "text-slate-400"} ${i === state.adapterLog.length - 1 ? "animate-slide-up" : ""}`}>
              <span className="text-slate-500" suppressHydrationWarning>{clock(l.t)}</span> {l.line}
            </div>
          ))}
        </div>
      </div>
      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto p-3">
        <div className={`grid gap-1.5 ${state.rooms.length > 24 ? "grid-cols-10" : "grid-cols-6"}`}>
          {state.rooms.map((r) => <RoomCell key={`${r.number}-${r.status}`} room={r} focus={r.number === focusRoom} now={now} />)}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">
          {(Object.keys(STATUS_META) as RoomStatus[]).map((s) => (
            <span key={s} className="flex items-center gap-1">
              <span className={`h-2.5 w-2.5 rounded-sm ${s === "ooo" ? "stripe-ooo" : ""}`} style={{ background: s === "ooo" ? undefined : STATUS_META[s].color }} />
              {STATUS_META[s].ka} {counts[s] ?? 0}
            </span>
          ))}
          <span className="text-slate-500">· იყიდება მხოლოდ შემოწმებული</span>
        </div>
      </div>

    </div>
  );
}

function Stat(props: { icon: typeof Timer; tone: string; label: string; en: string; value: string }) {
  const Icon = props.icon;
  return (
    <div className="bg-os-card px-2 py-2">
      <div className={`flex items-center justify-center gap-1.5 text-[22px] font-bold tabular-nums ${props.tone}`}>
        <Icon className="h-4 w-4" /> {props.value}
      </div>
      <div className="text-[11px] leading-tight text-slate-300">{props.label}</div>
      <div className="text-[10px] leading-tight text-slate-500">{props.en}</div>
    </div>
  );
}

function RoomCell({ room, focus, now }: { room: Room; focus: boolean; now: number }) {
  const meta = STATUS_META[room.status];
  const fresh = now - room.updatedAt < 1500;
  const light = room.status === "clean";
  return (
    <div
      data-testid={`room-${room.number}`}
      data-status={room.status}
      title={`${room.number} · ${room.type} · ${meta.ka}`}
      className={`relative flex h-12 flex-col items-center justify-center rounded-md text-white transition ${room.status === "ooo" ? "stripe-ooo" : ""} ${
        fresh ? "animate-pop" : ""
      } ${focus ? "ring-2 ring-white ring-offset-2 ring-offset-slate-950" : ""}`}
      style={{ background: room.status === "ooo" ? undefined : meta.color }}
    >
      <span className={`text-[15px] font-bold leading-none ${light ? "text-emerald-950" : ""}`}>{room.number}</span>
      <span className={`mt-0.5 text-[9px] font-semibold tracking-wide ${light ? "text-emerald-950/80" : "text-white/80"}`}>{meta.code}</span>
    </div>
  );
}
