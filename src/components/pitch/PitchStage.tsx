"use client";
// Pitch mode: the 60-second business story on one 1920×1080 stage, scaled to whatever screen is attached.
// ① guest writes on WhatsApp → ② the coach stops a mistake before posting → ③ certified candidate.
// Every beat calls the same routes the workspace uses; the stage only frames them.
import { useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";
import { ChevronLeft, ChevronRight, Loader2, Pause, Play, X } from "lucide-react";
import { act, upload, useNow } from "@/lib/simustay/client";
import { folioTotals, gateMove } from "@/lib/simustay/grader";
import type { SimuState, WindowNo } from "@/lib/simustay/types";
import PmsWindow from "../apps/PmsWindow";
import CommsWindow from "../apps/CommsWindow";
import CoachBanner, { coachOf } from "./CoachBanner";
import CertificateCard from "./CertificateCard";

const W = 1920;
const H = 1080;
const AUTO_MS = 6000;
const MOVE_GAP_MS = 450;
const PITCH_PROPERTY = "ambassadori";

export interface PitchControls { toggleAuto: () => void }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// The window a charge may legally go to (1 guest, 2 company), per the published rules.
const fixOf = (s: SimuState, chargeId: string): WindowNo | null =>
  ([1, 2] as WindowNo[]).find((w) => gateMove(s.folio, s.rules, chargeId, w).ok) ?? null;

// Beat reached so far, read from shared state (0 guest message · 1 company split · 2 mistake stopped · 3 balanced · 4 certified).
function beatOf(s: SimuState): number {
  if (!s.published) return -1;
  if (s.checkedOut) return 4;
  const { unrouted } = folioTotals(s.folio);
  if (s.metrics.errorsCaught > 0) return unrouted < 0.005 ? 3 : 2;
  const companyDone = s.folio.charges.filter((c) => fixOf(s, c.id) === 2).every((c) => c.window === 2);
  return companyDone && s.folio.charges.some((c) => c.window !== null) ? 1 : 0;
}

export default function PitchStage(props: { state: SimuState; onExit: () => void; controlRef: MutableRefObject<PitchControls | null> }) {
  const { state, onExit, controlRef } = props;
  const now = useNow(500);
  const [scale, setScale] = useState(1);
  const [busy, setBusy] = useState(false);
  const [auto, setAuto] = useState(false);
  const busyRef = useRef(false);
  const autoRef = useRef(false);
  const alive = useRef(true);
  // Newest state known here: the stream, or an action's own reply when it is newer than the stream.
  const latest = useRef<SimuState>(state);
  if (state.bootId !== latest.current.bootId || state.version >= latest.current.version) latest.current = state;
  const take = (s: SimuState | undefined) => {
    if (s && (s.bootId !== latest.current.bootId || s.version >= latest.current.version)) latest.current = s;
    return latest.current;
  };

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Clean start: Ambassadori, start snapshot, its rulebook loaded and published, guest message on screen.
  const setup = useCallback(async (): Promise<boolean> => {
    if (latest.current.property.id !== PITCH_PROPERTY) {
      const p = await act("property", { propertyId: PITCH_PROPERTY });
      if (!p.ok) return false;
      take(p.state);
    }
    const r = await act("reset", { snapshot: "start" });
    if (!r.ok) return false;
    take(r.state);
    const i = await upload("ingest", new FormData());
    if (!i.ok) return false;
    take(i.state);
    const p = await act("publish");
    take(p.state);
    return p.ok;
  }, []);

  const moveAll = useCallback(async (moves: { chargeId: string; window: WindowNo }[]) => {
    for (const [k, m] of moves.entries()) {
      if (k > 0) await sleep(MOVE_GAP_MS);
      const out = await act("folio/move", m);
      take(out.state);
      if (!out.ok) return false;
    }
    return true;
  }, []);

  // One beat forward from wherever the folio is now, including after live clicks.
  const advanceOnce = useCallback(async (): Promise<boolean> => {
    const s = latest.current;
    if (!s.published) return setup();
    if (s.checkedOut) return false;
    const open = s.folio.charges.filter((c) => c.window === null);
    const company = open.filter((c) => fixOf(s, c.id) === 2);
    if (company.length) return moveAll(company.map((c) => ({ chargeId: c.id, window: 2 as WindowNo })));
    if (s.metrics.errorsCaught === 0 && open.length) {
      // The rookie mistake: a personal charge sent to the company.
      const personal = open.find((c) => fixOf(s, c.id) === 1);
      if (personal) return moveAll([{ chargeId: personal.id, window: 2 }]);
    }
    if (open.length) {
      const fixes = open.map((c) => ({ chargeId: c.id, window: fixOf(s, c.id) })).filter((m): m is { chargeId: string; window: WindowNo } => m.window !== null);
      return moveAll(fixes);
    }
    const out = await act("folio/finish");
    take(out.state);
    return out.ok;
  }, [setup, moveAll]);

  // One job at a time; a key press while a beat is running is ignored rather than queued. Returns the job's success.
  const guarded = useCallback(async (job: () => Promise<boolean>): Promise<boolean> => {
    if (busyRef.current) return false;
    busyRef.current = true;
    setBusy(true);
    try { return await job(); } catch { return false; /* act() never throws; belt and braces for the stage */ } finally {
      busyRef.current = false;
      if (alive.current) setBusy(false);
    }
  }, []);

  const stopAuto = useCallback(() => { autoRef.current = false; setAuto(false); }, []);

  const next = useCallback(() => { stopAuto(); void guarded(advanceOnce); }, [stopAuto, guarded, advanceOnce]);

  // One beat back: rebuild from a clean start up to the previous beat, so the result is always consistent.
  const back = useCallback(() => {
    stopAuto();
    void guarded(async () => {
      const target = Math.max(0, beatOf(latest.current) - 1);
      if (!(await setup())) return false;
      for (let b = 0; b < target; b++) if (!(await advanceOnce())) return false;
      return true;
    });
  }, [stopAuto, guarded, setup, advanceOnce]);

  // Autoplay: the remaining beats, AUTO_MS apart. Each run has its own token, so stop → start never
  // leaves two loops alive.
  const autoRun = useRef(0);
  const toggleAuto = useCallback(() => {
    if (autoRef.current) { stopAuto(); return; }
    const run = ++autoRun.current;
    const live = () => autoRef.current && alive.current && autoRun.current === run;
    autoRef.current = true;
    setAuto(true);
    void (async () => {
      // Waits in short slices so Stop, → or ← take effect at once; the stage is only busy while a beat runs.
      const pause = async (ms: number) => { for (let t = 0; t < ms && live(); t += 100) await sleep(100); };
      const beatWhenFree = async (job: () => Promise<boolean>) => {
        while (busyRef.current && live()) await sleep(100);
        return live() && guarded(job);
      };
      if ((latest.current.checkedOut || !latest.current.published) && !(await beatWhenFree(setup))) return;
      while (live() && !latest.current.checkedOut) {
        await pause(AUTO_MS);
        if (!live() || !(await beatWhenFree(advanceOnce))) break;
      }
    })().finally(() => {
      if (autoRun.current !== run) return;
      autoRef.current = false;
      if (alive.current) setAuto(false);
    });
  }, [stopAuto, guarded, setup, advanceOnce]);

  controlRef.current = { toggleAuto };

  // Entering Pitch mode always starts the story clean.
  const started = useRef(false);
  useEffect(() => {
    alive.current = true;
    if (!started.current) { started.current = true; void guarded(setup); }
    return () => { alive.current = false; autoRef.current = false; controlRef.current = null; };
  }, [guarded, setup, controlRef]);

  // Presenter clicker / keyboard: → or PageDown forward, ← or PageUp back, Esc leaves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); back(); }
      else if (e.key === "Escape") { e.preventDefault(); onExit(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, back, onExit]);

  const beat = beatOf(state);
  const stage = state.checkedOut ? 3 : state.metrics.errorsCaught > 0 ? 2 : 1;
  const coach = coachOf(state, now);
  const highlight = coach.kind === "stop" && coach.fix !== null ? { chargeId: coach.chargeId, window: coach.fix } : null;
  const ready = state.published && state.property.id === PITCH_PROPERTY;
  const trainee = /Trainee:\s*([^\s·,]+)/.exec(state.shiftTitle_en)?.[1] ?? "Ana";

  return (
    <div data-testid="pitch-stage" className="fixed inset-0 z-[9500] overflow-hidden bg-[#0B0C0E]">
      <style>{`
        @keyframes pitch-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,.85); transform: scale(1); } 50% { box-shadow: 0 0 0 18px rgba(16,185,129,0); transform: scale(1.06); } }
        .pitch-pulse { animation: pitch-pulse 1s ease-in-out infinite; }
      `}</style>
      <div
        className="absolute left-1/2 top-1/2 flex flex-col gap-4 bg-[radial-gradient(ellipse_at_top,#1b2433_0%,#0B0C0E_70%)] px-8 pb-6 pt-5 text-white"
        style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {/* stepper */}
        <div className="flex h-[72px] shrink-0 items-center gap-6">
          <div className="leading-tight">
            <div className="text-[30px] font-bold">SimStay · <span className="text-[#E7C98B]">{state.property.short}</span></div>
            <div className="text-[24px] text-slate-400">Trainee {trainee} · first shift at the front desk</div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {(["Guest", "Coach", "Certified"] as const).map((label, i) => {
              const n = i + 1;
              const on = stage === n;
              const done = stage > n;
              return (
                <div key={label} className="flex items-center gap-3">
                  {i > 0 && <div className={`h-1 w-16 rounded ${done || on ? "bg-emerald-400" : "bg-white/15"}`} />}
                  <div
                    data-testid={`pitch-step-${n}`}
                    data-active={on}
                    className={`flex items-center gap-2 rounded-full px-5 py-2 text-[28px] font-semibold ${
                      on ? (n === 2 && coach.kind === "stop" ? "bg-red-600" : "bg-emerald-500 text-[#0B0C0E]") : done ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-slate-400"
                    }`}
                  >
                    <span>{["①", "②", "③"][i]}</span> {label}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="ml-6 flex items-center gap-2 text-[24px] text-slate-400">
            {busy && <Loader2 className="h-7 w-7 animate-spin text-slate-300" />}
            <PitchButton label="Back (←)" onClick={back}><ChevronLeft className="h-8 w-8" /></PitchButton>
            <PitchButton label="Next (→)" onClick={next} testId="pitch-next"><ChevronRight className="h-8 w-8" /></PitchButton>
            <PitchButton label="Autoplay (Ctrl+Shift+A)" onClick={toggleAuto}>{auto ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}</PitchButton>
            <PitchButton label="Exit (Esc)" onClick={onExit} testId="pitch-exit"><X className="h-7 w-7" /></PitchButton>
          </div>
        </div>

        {/* stage */}
        <div className="grid min-h-0 flex-1 grid-cols-[36fr_64fr] gap-6">
          <CommsWindow state={state} pitch />
          <div className="relative min-h-0">
            <PmsWindow state={state} pitch highlight={highlight} />
            {!ready && (
              <div className="absolute inset-0 grid place-items-center rounded-2xl bg-[#0B0C0E]/80">
                <div className="flex items-center gap-4 text-[32px] text-slate-200"><Loader2 className="h-10 w-10 animate-spin" /> მზადდება ცვლა · Preparing the shift…</div>
              </div>
            )}
            {ready && beat === 4 && (
              <div className="absolute inset-0">
                <CertificateCard key={state.metrics.checkoutAt ?? 0} state={state} />
              </div>
            )}
          </div>
        </div>

        {/* coach */}
        <div className="h-[200px] shrink-0">
          <CoachBanner state={state} coach={coach} />
        </div>
      </div>
    </div>
  );
}

function PitchButton(props: { label: string; onClick: () => void; testId?: string; children: React.ReactNode }) {
  return (
    <button
      title={props.label}
      aria-label={props.label}
      data-testid={props.testId}
      onClick={props.onClick}
      className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white"
    >
      {props.children}
    </button>
  );
}
