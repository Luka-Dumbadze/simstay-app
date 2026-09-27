"use client";
// Pitch mode payoff: every figure is computed from this session's state; nothing is typed in.
// Certification stays "pending" until a supervisor confirms it (a human decides, not the software).
import { useState } from "react";
import { Award, CheckSquare, Square } from "lucide-react";
import { gateMove } from "@/lib/simustay/grader";
import type { SimuState } from "@/lib/simustay/types";

const mmss = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export default function CertificateCard({ state }: { state: SimuState }) {
  const [confirmed, setConfirmed] = useState(false);
  const { folio, metrics } = state;
  const trainee = /Trainee:\s*([^\s·,]+)/.exec(state.shiftTitle_en)?.[1] ?? "Ana";
  const correct = folio.charges.filter((c) => c.window !== null && gateMove(folio, state.rules, c.id, c.window).ok).length;
  const accuracy = folio.charges.length ? Math.round((100 * correct) / folio.charges.length) : 0;
  const startedAt = state.chat[0]?.t ?? null;
  const took = startedAt && metrics.checkoutAt ? mmss(metrics.checkoutAt - startedAt) : "—";
  const caught = metrics.errorsCaught;

  return (
    <div data-testid="certificate" className="animate-card-in flex h-full flex-col rounded-2xl border-4 border-emerald-500 bg-white p-8 text-slate-900 shadow-2xl">
      <div className="flex items-center gap-5">
        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-emerald-600 text-white"><Award className="h-14 w-14" /></div>
        <div className="leading-tight">
          <div className="text-[60px] font-extrabold text-emerald-700">✓ Exam passed</div>
          <div className="text-[32px] font-semibold">Front-desk folio &amp; billing · გამოცდა ჩაბარებულია</div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-4 text-[36px] font-bold">
        Certified Front-Desk Operator
        <span className={`rounded-full px-4 py-1 text-[24px] font-semibold ${confirmed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
          {confirmed ? "confirmed by supervisor" : "pending supervisor confirmation"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4">
        <Fact label="Candidate" value={`${trainee} · trainee`} />
        <Fact label="Day-1 ready for" value={state.property.short} />
        <Fact label="Final folio" value={`${accuracy}% correct`} tone="text-emerald-700" />
        <Fact label="Mistakes caught before posting" value={`${caught} · corrected`} />
        <Fact label="Time" value={took} />
        <Fact label="Guest / company" value={`${folio.charges.filter((c) => c.window === 1).reduce((a, c) => a + c.amount, 0)} ₾ / ${folio.charges.filter((c) => c.window === 2).reduce((a, c) => a + c.amount, 0)} ₾`} />
      </div>

      <div className="mt-auto flex items-end gap-6 pt-4">
        <div className="flex-1 text-[24px] leading-snug text-slate-500">
          Today: up to 82 h of senior-staff shadowing per new receptionist (baseline). Pilot goal: half or less.
        </div>
        <button
          data-testid="supervisor-confirm"
          onClick={() => setConfirmed((c) => !c)}
          className={`flex h-[72px] shrink-0 items-center gap-3 rounded-2xl px-6 text-[30px] font-bold ${confirmed ? "bg-emerald-600 text-white" : "border-4 border-slate-800 bg-white text-slate-900 hover:bg-slate-50"}`}
        >
          {confirmed ? <CheckSquare className="h-9 w-9" /> : <Square className="h-9 w-9" />}
          Supervisor confirms
        </button>
      </div>
    </div>
  );
}

function Fact({ label, value, tone = "text-slate-900" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="leading-tight">
      <div className="text-[24px] text-slate-500">{label}</div>
      <div className={`text-[40px] font-bold ${tone}`}>{value}</div>
    </div>
  );
}
