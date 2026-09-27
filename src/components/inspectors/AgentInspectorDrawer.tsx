"use client";

import { useEffect } from "react";
import { ArrowUpRight, FileText, Languages, X } from "lucide-react";
import { setChatLang, unitName, useChatLang } from "@/lib/simustay/client";
import { satisfiedRules } from "@/lib/simustay/grader";
import { guestCardLabels } from "@/lib/simustay/properties";
import type { AppId, SimuState, Tier } from "@/lib/simustay/types";
import { agentRoster, PRESENCE_COLOR } from "../appRegistry";

export type AgentId = "guest" | "grader" | "extractor" | "dispatcher";

const DRAWER_H = 540;

// Compact inspector anchored next to the sidebar avatar that opened it.
export default function AgentInspectorDrawer(props: {
  agentId: AgentId;
  state: SimuState;
  anchorTop: number;
  onClose: () => void;
  onOpenApp: (id: AppId) => void;
}) {
  const { state, agentId } = props;
  const agent = agentRoster(state).find((a) => a.id === agentId)!;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") props.onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [props]);

  const top = typeof window === "undefined" ? props.anchorTop : Math.max(16, Math.min(props.anchorTop - 20, window.innerHeight - DRAWER_H - 16));
  const target: Record<AgentId, { app: AppId; label: string }> = {
    guest: { app: "comms", label: "ჩატის გახსნა · Open chat" },
    grader: { app: "pms", label: "ფოლიოს გახსნა · Open folio" },
    extractor: { app: "ingest", label: "Rule Studio" },
    dispatcher: { app: "phone", label: "HK ტელეფონი · Open phone" },
  };

  return (
    <>
      {/* Below the sidebar (z 9100) so another avatar can be clicked straight away. */}
      <div className="fixed inset-0 z-[9095]" onClick={props.onClose} />
      <aside
        data-testid={`inspector-${agentId}`}
        className="animate-slide-up fixed left-[92px] z-[9130] flex w-[340px] flex-col rounded-2xl border border-white/10 bg-os-card/95 shadow-[0_24px_70px_-20px_rgba(0,0,0,.9)] backdrop-blur-md"
        style={{ top, maxHeight: DRAWER_H }}
      >
        <span className="absolute -left-1.5 h-3 w-3 rotate-45 border-b border-l border-white/10 bg-os-card" style={{ top: Math.max(14, props.anchorTop - top + 14) }} />
        <header className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
          <span className="relative">
            <span className="grid h-10 w-10 place-items-center rounded-full text-[12px] font-bold text-white" style={{ background: agent.gradient }}>{agent.initials}</span>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-os-card" style={{ background: PRESENCE_COLOR[agent.presence] }} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold text-os-ink">{agent.name}</div>
            <div className="truncate text-[12px] text-os-mute">{agent.role_ka}</div>
          </div>
          <button onClick={props.onClose} className="rounded-lg p-1 text-os-mute hover:bg-white/5 hover:text-os-ink" aria-label="Close inspector">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="scroll-thin min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 text-[13px]">
          {agentId === "guest" && <GuestPanel state={state} />}
          {agentId === "grader" && <GraderPanel state={state} />}
          {agentId === "extractor" && <ExtractorPanel state={state} />}
          {agentId === "dispatcher" && <DispatcherPanel state={state} />}
        </div>

        <footer className="border-t border-white/5 px-4 py-2.5">
          <button
            onClick={() => { props.onOpenApp(target[agentId].app); props.onClose(); }}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/5 py-2 text-[13px] font-medium text-os-ink hover:bg-white/10"
          >
            {target[agentId].label} <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </footer>
      </aside>
    </>
  );
}

function Row(props: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-os-mute">{props.label}</span>
      <span className="text-right text-os-ink">{props.children}</span>
    </div>
  );
}

function Section(props: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-os-mute">{props.title}</div>
      {props.children}
    </div>
  );
}

function GuestPanel({ state }: { state: SimuState }) {
  const lang = useChatLang();
  const persona = state.property.persona;
  const last = state.gateLog.at(-1);
  const mood = !state.published
    ? { icon: "😶", label: "ელოდება · waiting", color: "#71717A" }
    : state.checkedOut
      ? { icon: "😊", label: "კმაყოფილი · satisfied", color: "#22C55E" }
      : last && !last.ok
        ? { icon: "😟", label: "შეშფოთებული · concerned about the bill", color: "#F59E0B" }
        : { icon: "🙂", label: "მშვიდი · calm", color: "#22C55E" };
  const lastGuest = [...state.chat].reverse().find((m) => m.from === "guest");
  const card = guestCardLabels(state.property);
  return (
    <>
      <Section title="პერსონა · Persona">
        <div className="text-os-ink">{persona.summary_ka}</div>
        <div className="text-[12px] text-os-mute">{persona.summary_en}</div>
      </Section>
      <Section title="მოთხოვნა · Current demand">
        <div className="rounded-xl bg-black/25 px-3 py-2 text-os-ink">{persona.demand_ka}</div>
        <div className="mt-1 text-[12px] text-os-mute">{persona.demand_en}</div>
      </Section>
      <Row label="განწყობა · Mood">
        <span className="font-medium" style={{ color: mood.color }}>{mood.icon} {mood.label}</span>
      </Row>
      <Row label="ენები · Languages">{persona.languages}</Row>
      {card && (
        <Section title="სტუმრის ბარათი · Guest card">
          <div data-testid="guest-card" className="rounded-xl bg-black/25 px-3 py-2 text-os-ink">
            არომატი: {card.aroma} · ბალიში: {card.pillow} · თეთრეული: {card.sheets}
          </div>
          <div className="mt-1 text-[12px] text-os-mute">{card.en}</div>
        </Section>
      )}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-os-mute"><Languages className="h-3.5 w-3.5" /> ჩატის ენა</span>
        <div className="flex rounded-lg border border-white/10 p-0.5">
          {(["ka", "en"] as const).map((l) => (
            <button
              key={l}
              data-testid={`chat-lang-${l}`}
              onClick={() => setChatLang(l)}
              className={`rounded-md px-2.5 py-0.5 text-[12px] font-medium ${lang === l ? "bg-white/15 text-os-ink" : "text-os-mute"}`}
            >
              {l === "ka" ? "ქართ." : "English"}
            </button>
          ))}
        </div>
      </div>
      {lastGuest && (
        <Section title="ბოლო რეპლიკა · Last line">
          <div className="italic text-os-mute">«{lang === "ka" ? lastGuest.text_ka : lastGuest.text_en}»</div>
        </Section>
      )}
    </>
  );
}

function GraderPanel({ state }: { state: SimuState }) {
  const m = state.metrics;
  const graded = state.rules.filter((r) => r.tier !== "D" && r.check);
  const passed = new Set(satisfiedRules(state.folio, state.rules));
  const failures = state.gateLog.filter((g) => !g.ok && g.ruleId !== "SYS");
  const byRule = new Map<string, { count: number; message: string }>();
  for (const f of failures) {
    const cur = byRule.get(f.ruleId) ?? { count: 0, message: f.message_ka };
    byRule.set(f.ruleId, { count: cur.count + 1, message: f.message_ka });
  }
  const passRate = m.movesGraded ? Math.round(((m.movesGraded - failures.length) / m.movesGraded) * 100) : 0;
  return (
    <>
      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat value={String(m.movesGraded)} label="შეფასდა" />
        <Stat value={String(m.errorsCaught)} label="დაიჭირა" tone="#F43F5E" />
        <Stat value={m.movesGraded ? `${passRate}%` : "—"} label="სწორი" tone="#22C55E" />
      </div>
      <Section title={`წესები · ${graded.length} graded`}>
        {graded.length === 0 && <div className="text-os-mute">წესები ჯერ არ არის გამოქვეყნებული</div>}
        <div className="space-y-1">
          {graded.map((r) => (
            <div key={r.id} className="flex items-start gap-2">
              <span className={`mt-0.5 font-mono text-[11px] ${passed.has(r.id) ? "text-emerald-400" : "text-os-mute"}`}>{passed.has(r.id) ? "✓" : "○"} {r.id}</span>
              <span className="flex-1 text-[12px] text-os-ink/90">{r.title_ka}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section title="შეცდომის მიზეზები · Error reasons">
        {byRule.size === 0 && <div className="text-os-mute">ჯერ შეცდომა არ ყოფილა</div>}
        {[...byRule.entries()].map(([id, v]) => (
          <div key={id} className="mb-1 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-[12px]">
            <span className="font-semibold text-rose-300">{id} ×{v.count}</span> <span className="text-os-ink">{v.message}</span>
          </div>
        ))}
      </Section>
    </>
  );
}

function ExtractorPanel({ state }: { state: SimuState }) {
  const counts = (["H", "P", "D"] as Tier[]).map((t) => ({ t, n: state.rules.filter((r) => r.tier === t).length }));
  const total = Math.max(1, state.rules.length);
  const color: Record<Tier, string> = { H: "#EF4444", P: "#F59E0B", D: "#94A3B8" };
  return (
    <>
      <Row label="სტატუსი · Status">
        {state.ingest ? <span className="text-emerald-400">დამუშავებულია · parsed</span> : <span className="text-amber-300">ელოდება PDF-ს</span>}
      </Row>
      <Row label="დოკუმენტი">
        <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5 text-os-mute" /> {state.ingest?.fileName ?? state.property.docFileName}</span>
      </Row>
      {state.ingest && <Row label="გვერდები · Source">{state.ingest.pages} · {state.ingest.source === "live" ? "live AI" : "offline cache"}</Row>}
      <Row label="რეჟიმი · Mode">{state.mode === "online" ? "Gemini 2.5 Flash" : "offline cache"}</Row>
      <Section title={`ამოღებული წესები · ${state.rules.length}`}>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-white/5">
          {counts.map((c) => <span key={c.t} style={{ width: `${(c.n / total) * 100}%`, background: color[c.t] }} />)}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          {counts.map((c) => <Stat key={c.t} value={String(c.n)} label={`Tier ${c.t}`} tone={color[c.t]} />)}
        </div>
      </Section>
      {state.ingest?.note && <div className="rounded-xl bg-black/25 px-3 py-2 text-[12px] text-os-mute">{state.ingest.note}</div>}
    </>
  );
}

function DispatcherPanel({ state }: { state: SimuState }) {
  const dirty = state.rooms.filter((r) => r.status === "dirty");
  const clean = state.rooms.filter((r) => r.status === "clean");
  const open = state.tasks.filter((t) => t.state === "open");
  return (
    <>
      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat value={String(dirty.length)} label="დასალაგებელი" tone="#EF4444" />
        <Stat value={String(clean.length)} label="შესამოწმებელი" tone="#22C55E" />
        <Stat value={String(state.rooms.filter((r) => r.status === "inspected").length)} label="გასაყიდი" tone="#3B82F6" />
      </div>
      <Section title="რიგი · Queue">
        <div className="space-y-1">
          {open.map((t) => (
            <div key={t.id} className="flex items-center gap-2 rounded-xl bg-black/25 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="flex-1 text-os-ink">{unitName(state.rooms, t.room)}</span>
              <span className="text-[11px] text-os-mute">{t.kind === "departure" ? "გასვლა" : "დარჩენა"} · {t.checklist.filter((i) => i.done).length}/{t.checklist.length}</span>
            </div>
          ))}
          {clean.map((r) => (
            <div key={r.number} className="flex items-center gap-2 rounded-xl bg-black/25 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="flex-1 text-os-ink">{unitName(state.rooms, r.number)}</span>
              <span className="text-[11px] text-os-mute">ელოდება შემოწმებას</span>
            </div>
          ))}
          {open.length === 0 && clean.length === 0 && <div className="text-os-mute">რიგი ცარიელია</div>}
        </div>
      </Section>
      {dirty.length > 0 && (
        <Row label="დასალაგებელი">{dirty.map((r) => r.number).join(", ")}</Row>
      )}
    </>
  );
}

function Stat(props: { value: string; label: string; tone?: string }) {
  return (
    <div className="rounded-xl bg-black/25 px-2 py-2">
      <div className="text-[18px] font-bold tabular-nums" style={{ color: props.tone ?? "rgb(var(--os-ink))" }}>{props.value}</div>
      <div className="text-[11px] text-os-mute">{props.label}</div>
    </div>
  );
}
