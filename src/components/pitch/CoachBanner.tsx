"use client";
// Pitch mode coach: turns the deterministic grader's last verdict into one large, friendly sentence.
// No model sits in this path; the rule and its page come from the hotel's own published rulebook.
import { CheckCircle2, Hand, ShieldCheck } from "lucide-react";
import { gateMove } from "@/lib/simustay/grader";
import type { SimuState, WindowNo } from "@/lib/simustay/types";

const CORRECT_MS = 4000;

// Plain-language lines for the Ambassadori rules the pitch exercises; any other rule falls back to its title.
const COACH_LINES: Record<string, { stop_ka: string; stop_en: string; ok_ka: string; ok_en: string }> = {
  H1: {
    stop_ka: "გაჩერდი! ვილასა და გოლფს ბანკი იხდის.",
    stop_en: "Stop! The bank pays for the villa and golf.",
    ok_ka: "სწორია! ვილა და გოლფი — ბანკის ანგარიშზე.",
    ok_en: "Correct. Villa and golf go to the bank.",
  },
  H2: {
    stop_ka: "გაჩერდი! ღვინის დეგუსტაცია სტუმრის პირად ანგარიშზე რჩება.",
    stop_en: "Stop! Wine tasting stays with the guest. Let me show you.",
    ok_ka: "სწორია! ღვინო — სტუმრის ბარათზე.",
    ok_en: "Correct. Wine goes on the guest's card.",
  },
  H3: {
    stop_ka: "გაჩერდი! რესტორანი სტუმრის პირად ანგარიშზე რჩება.",
    stop_en: "Stop! The restaurant stays with the guest.",
    ok_ka: "სწორია! რესტორანი — სტუმრის ბარათზე.",
    ok_en: "Correct. The restaurant goes on the guest's card.",
  },
};

export type Coach =
  | { kind: "idle" }
  | { kind: "stop"; ruleId: string; chargeId: string; page: number | null; fix: WindowNo | null }
  | { kind: "correct"; ruleId: string; chargeId: string }
  | { kind: "done" };

// Derived from shared state only, so live clicks, autoplay, hotkey resets and other screens all agree.
export function coachOf(state: SimuState, now: number): Coach {
  if (state.checkedOut) return { kind: "done" };
  const log = state.gateLog;
  let i = log.length - 1;
  while (i >= 0 && (log[i].ok || !log[i].chargeId || log[i].ruleId === "SYS")) i -= 1;
  if (i < 0) return { kind: "idle" };
  const miss = log[i];
  const chargeId = miss.chargeId!;
  const fixed = log.slice(i + 1).find((g) => g.ok && g.chargeId === chargeId && g.target !== null);
  if (!fixed) {
    const fix = ([1, 2] as WindowNo[]).find((w) => gateMove(state.folio, state.rules, chargeId, w).ok) ?? null;
    return { kind: "stop", ruleId: miss.ruleId, chargeId, page: miss.source?.page ?? null, fix };
  }
  return now - fixed.at < CORRECT_MS ? { kind: "correct", ruleId: miss.ruleId, chargeId } : { kind: "idle" };
}

export default function CoachBanner({ state, coach }: { state: SimuState; coach: Coach }) {
  if (coach.kind === "idle") {
    return (
      <div data-testid="coach-idle" className="flex h-full items-center gap-5 rounded-3xl border border-white/10 bg-white/5 px-8">
        <ShieldCheck className="h-12 w-12 shrink-0 text-emerald-300" />
        <div className="leading-tight">
          <div className="text-[32px] font-semibold text-white">SimStay Coach · ყოველი მოქმედება მოწმდება ჩაწერამდე</div>
          <div className="text-[26px] text-slate-300">Every move is checked against {state.property.short}&apos;s own rules before it reaches the bill.</div>
        </div>
      </div>
    );
  }
  if (coach.kind === "done") {
    return (
      <div data-testid="coach-done" className="animate-slide-up flex h-full items-center gap-5 rounded-3xl bg-emerald-600 px-8 text-white shadow-2xl">
        <CheckCircle2 className="h-14 w-14 shrink-0" />
        <div className="leading-tight">
          <div className="text-[56px] font-bold">ფოლიო დაბალანსებულია!</div>
          <div className="text-[30px] text-emerald-50">Folio balanced and closed. Exam passed.</div>
        </div>
      </div>
    );
  }
  const rule = state.rules.find((r) => r.id === coach.ruleId);
  const lines = COACH_LINES[coach.ruleId] ?? {
    stop_ka: `გაჩერდი! ${rule?.title_ka ?? ""}`,
    stop_en: `Stop! ${rule?.title_en ?? ""}`,
    ok_ka: "სწორია!",
    ok_en: "Correct.",
  };
  if (coach.kind === "correct") {
    return (
      <div key={`ok-${coach.chargeId}`} data-testid="coach-correct" className="animate-slide-up flex h-full items-center gap-5 rounded-3xl bg-emerald-600 px-8 text-white shadow-2xl">
        <CheckCircle2 className="h-14 w-14 shrink-0" />
        <div className="leading-tight">
          <div className="text-[56px] font-bold">{lines.ok_ka}</div>
          <div className="text-[30px] text-emerald-50">{lines.ok_en}</div>
        </div>
      </div>
    );
  }
  return (
    <div key={`stop-${coach.chargeId}`} data-testid="coach-stop" className="animate-slide-up flex h-full items-center gap-5 rounded-3xl bg-red-600 px-8 text-white shadow-2xl">
      <Hand className="h-14 w-14 shrink-0" />
      <div className="min-w-0 leading-tight">
        <div className="text-[56px] font-bold">{lines.stop_ka}</div>
        <div className="mt-1 text-[30px] text-red-50">
          {lines.stop_en}
          {coach.page !== null && <span className="ml-3 rounded-lg bg-white/15 px-2">{state.property.rulebook_ka}, გვ. {coach.page} · hotel rules, p. {coach.page}</span>}
        </div>
      </div>
    </div>
  );
}
