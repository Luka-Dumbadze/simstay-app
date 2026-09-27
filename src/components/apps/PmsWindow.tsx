"use client";

import { useState } from "react";
import { AlertTriangle, ArrowLeftRight, CheckCircle2, FileCheck2, FileX2, GripVertical, Loader2, LogOut, ShieldCheck, Undo2 } from "lucide-react";
import { act, money, toast, upload } from "@/lib/simustay/client";

const initials = (name: string) => name.split(/\s+/).map((p) => p[0]).join("").slice(0, 2);
import { folioTotals, gateMove, satisfiedRules } from "@/lib/simustay/grader";
import type { Charge, FolioWindow, GateEvent, PmsSkin, SimuState, WindowNo } from "@/lib/simustay/types";

const WINDOWS: WindowNo[] = [1, 2, 3, 4];

interface Ctx {
  state: SimuState;
  skin: PmsSkin;
  locked: boolean;
  shakeId: string | null;
  move: (chargeId: string, target: WindowNo | null) => void;
}

export default function PmsWindow({ state }: { state: SimuState }) {
  const skin = state.workspace.skins.pms;
  const [finishing, setFinishing] = useState(false);
  const last = state.gateLog.at(-1) ?? null;
  const shakeId = last && !last.ok && last.chargeId ? `${last.chargeId}` : null;
  const locked = state.checkedOut || !state.published;

  const move = (chargeId: string, target: WindowNo | null) => {
    if (locked) return;
    void act("folio/move", { chargeId, window: target });
  };

  const finish = async () => {
    setFinishing(true);
    const out = await act("folio/finish");
    setFinishing(false);
    if (out.ok && out.gate?.ok) toast(`✓ გასვლა დასრულდა · ${state.folio.roomLabel_ka} → დიასახლისობა`, "ok");
  };

  const ctx: Ctx = { state, skin, locked, shakeId, move };
  const classic = skin === "classic";

  return (
    <div className={`relative flex h-full flex-col ${classic ? "bg-[#D6D9DE] text-slate-900" : "bg-slate-50 text-slate-900"}`}>
      <ReservationHeader ctx={ctx} />
      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
        {classic ? <ClassicFolio ctx={ctx} /> : <ModernFolio ctx={ctx} />}
      </div>
      <GraderHud state={state} last={last} classic={classic} />
      <footer className={`flex items-center gap-3 px-3 py-2 ${classic ? "border-t border-slate-400 bg-[#C3C8CF]" : "border-t border-slate-200 bg-white"}`}>
        <Balance ctx={ctx} />
        <button
          onClick={() => void finish()}
          disabled={locked || finishing}
          className={`ml-auto flex items-center gap-2 px-4 py-2 text-[15px] font-semibold text-white disabled:opacity-50 ${
            classic ? "rounded-sm border border-[#0f2a47] bg-[#1E3A5F] hover:bg-[#274b78]" : "rounded-xl bg-sky-600 shadow hover:bg-sky-500"
          }`}
        >
          {finishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          გასვლის დასრულება · Finish check-out
        </button>
      </footer>
      {!state.published && <NotPublished rulesLoaded={state.rules.length > 0} />}
    </div>
  );
}

// ---- header -----------------------------------------------------------------------

function ReservationHeader({ ctx }: { ctx: Ctx }) {
  const { folio } = ctx.state;
  const classic = ctx.skin === "classic";
  const letter = (
    <button
      onClick={() => !ctx.locked && void act("folio/letter")}
      title="P1: direct bill requires a company letter (click to toggle for the second-run variant)"
      className={`flex items-center gap-1 rounded px-2 py-0.5 text-[12px] font-medium ${
        folio.letterOnFile ? "bg-emerald-600/15 text-emerald-700" : "bg-amber-500/20 text-amber-800"
      }`}
    >
      {folio.letterOnFile ? <FileCheck2 className="h-3.5 w-3.5" /> : <FileX2 className="h-3.5 w-3.5" />}
      {folio.letterOnFile ? "კომპანიის წერილი ✓" : "წერილი არ არის"}
    </button>
  );
  if (classic) {
    return (
      <div className="shrink-0 border-b border-slate-500 bg-[#1E3A5F] px-3 py-1.5 text-[13px] text-slate-100">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono">
          <span>RES <b>#{folio.reservationId}</b></span>
          <span>UNIT <b className="font-sans">{folio.roomLabel_en}</b></span>
          <span>GUEST <b className="font-sans">{folio.guest}</b> ({folio.guest_en})</span>
          <span>CO <b className="font-sans">{folio.company_en}</b></span>
          <span className={ctx.state.checkedOut ? "text-amber-300" : "text-emerald-300"}>{ctx.state.checkedOut ? "CHECKED OUT" : "IN HOUSE"}</span>
          <span className="ml-auto rounded bg-white/90 px-0.5">{letter}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-sky-100 font-semibold text-sky-700">{initials(folio.guest)}</div>
      <div className="min-w-0">
        <div className="font-semibold">{folio.guest} <span className="font-normal text-slate-500">· {folio.company} ({folio.company_en})</span></div>
        <div className="text-[12px] text-slate-500">ჯავშანი #{folio.reservationId} · {folio.roomLabel_ka} · {ctx.state.checkedOut ? "გასულია" : "სასტუმროშია"}</div>
      </div>
      <div className="ml-auto">{letter}</div>
    </div>
  );
}

// ---- classic (legacy-PMS, 4-window split) ----------------------------------------

function ClassicFolio({ ctx }: { ctx: Ctx }) {
  const { folio } = ctx.state;
  return (
    <div className="space-y-2 p-2">
      <div className="border border-slate-500 bg-[#EEF0F3]">
        <div className="bg-[#9AA5B1] px-2 py-0.5 text-[12px] font-bold uppercase tracking-wide text-slate-900">Postings · ხარჯები (გადაიტანეთ ფანჯარაში)</div>
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-slate-400 bg-[#DDE1E6] text-left text-[11px] uppercase text-slate-600">
              <th className="px-2 py-1">Code</th><th className="px-2">აღწერა</th><th className="px-2 text-right">თანხა</th><th className="px-2">Win</th><th className="px-2">გადატანა</th>
            </tr>
          </thead>
          <tbody>
            {folio.charges.map((c) => (
              <tr
                key={c.id}
                draggable={!ctx.locked}
                onDragStart={(e) => e.dataTransfer.setData("text/charge", c.id)}
                className={`border-b border-slate-300 ${c.window === null ? "bg-[#FFF8DC]" : "bg-white"} ${ctx.shakeId === c.id ? "animate-shake bg-red-100" : ""}`}
              >
                <td className="px-2 py-1 font-mono text-[12px]"><GripVertical className="mr-1 inline h-3 w-3 text-slate-400" />{c.code}</td>
                <td className="px-2">{c.label_ka} <span className="text-[11px] text-slate-500">{c.label_en}</span></td>
                <td className="px-2 text-right font-mono">{c.amount.toFixed(2)}</td>
                <td className="px-2 font-mono">{c.window ?? "—"}</td>
                <td className="px-2"><RouteButtons ctx={ctx} charge={c} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {WINDOWS.map((n) => <ClassicWindow key={n} ctx={ctx} win={folio.windows.find((w) => w.n === n)!} />)}
      </div>
    </div>
  );
}

function ClassicWindow({ ctx, win }: { ctx: Ctx; win: FolioWindow }) {
  const [over, setOver] = useState(false);
  const charges = ctx.state.folio.charges.filter((c) => c.window === win.n);
  const total = charges.reduce((a, c) => a + c.amount, 0);
  return (
    <div
      data-testid={`window-${win.n}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); const id = e.dataTransfer.getData("text/charge"); if (id) ctx.move(id, win.n); }}
      className={`flex min-h-[112px] flex-col border ${over ? "border-sky-600 bg-sky-50" : "border-slate-500 bg-white"}`}
    >
      <div className={`flex items-center px-2 py-0.5 text-[12px] font-bold ${win.payerType === "company" ? "bg-[#2F5D8A] text-white" : win.payerType === "guest" ? "bg-[#5B6B7C] text-white" : "bg-[#B8C0C9] text-slate-700"}`}>
        W{win.n} · {win.payee ?? "—"}
        <span className="ml-auto font-normal">{win.method === "direct_bill" ? "Direct bill" : win.method === "card" ? "Card" : "no payee"}</span>
      </div>
      <div className="flex-1 space-y-0.5 p-1.5 text-[14px]">
        {charges.map((c) => (
          <div key={c.id} className="flex items-center gap-2 font-mono">
            <span className="flex-1 font-sans">{c.label_ka}</span>
            <span>{c.amount.toFixed(2)}</span>
            {!ctx.locked && (
              <button onClick={() => ctx.move(c.id, null)} className="text-slate-400 hover:text-slate-700" title="Unroute"><Undo2 className="h-3.5 w-3.5" /></button>
            )}
          </div>
        ))}
        {charges.length === 0 && <div className="pt-4 text-center text-[12px] text-slate-400">ცარიელი</div>}
      </div>
      <div className="border-t border-slate-300 bg-[#EEF0F3] px-2 py-0.5 text-right font-mono text-[13px]">Balance {total.toFixed(2)}</div>
    </div>
  );
}

// ---- modern (cloud-PMS cards) ------------------------------------------------------

function ModernFolio({ ctx }: { ctx: Ctx }) {
  const { folio } = ctx.state;
  const unrouted = folio.charges.filter((c) => c.window === null);
  return (
    <div className="space-y-3 p-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">გაუნაწილებელი ხარჯები · Unassigned</div>
        <div className="flex min-h-[46px] flex-wrap gap-2">
          {unrouted.map((c) => <ModernChip key={c.id} ctx={ctx} charge={c} />)}
          {unrouted.length === 0 && <div className="flex items-center gap-2 text-sm text-emerald-600"><CheckCircle2 className="h-4 w-4" /> ყველა ხარჯი განაწილებულია</div>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {WINDOWS.map((n) => <ModernWindow key={n} ctx={ctx} win={folio.windows.find((w) => w.n === n)!} />)}
      </div>
    </div>
  );
}

function ModernChip({ ctx, charge }: { ctx: Ctx; charge: Charge }) {
  return (
    <div
      draggable={!ctx.locked}
      onDragStart={(e) => e.dataTransfer.setData("text/charge", charge.id)}
      className={`flex cursor-grab items-center gap-2 rounded-full border bg-white py-1 pl-3 pr-1 text-[14px] shadow-sm active:cursor-grabbing ${
        ctx.shakeId === charge.id ? "animate-shake border-red-400 bg-red-50" : "border-slate-200"
      }`}
    >
      <span className="font-medium">{charge.label_ka}</span>
      <span className="font-mono text-slate-600">{money(charge.amount)}</span>
      <RouteButtons ctx={ctx} charge={charge} />
    </div>
  );
}

function ModernWindow({ ctx, win }: { ctx: Ctx; win: FolioWindow }) {
  const [over, setOver] = useState(false);
  const charges = ctx.state.folio.charges.filter((c) => c.window === win.n);
  const total = charges.reduce((a, c) => a + c.amount, 0);
  const tone = win.payerType === "company" ? "from-sky-500 to-indigo-500" : win.payerType === "guest" ? "from-emerald-500 to-teal-500" : "from-slate-300 to-slate-300";
  return (
    <div
      data-testid={`window-${win.n}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); const id = e.dataTransfer.getData("text/charge"); if (id) ctx.move(id, win.n); }}
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${over ? "border-sky-400 ring-2 ring-sky-200" : "border-slate-200"}`}
    >
      <div className={`h-1.5 bg-gradient-to-r ${tone}`} />
      <div className="flex items-baseline gap-2 px-3 pt-2">
        <span className="text-[12px] font-semibold text-slate-400">ფანჯარა {win.n}</span>
        <span className="truncate font-semibold">{win.payee ?? "—"}</span>
        <span className="ml-auto text-[11px] text-slate-500">{win.method === "direct_bill" ? "პირდაპირი ანგარიშსწორება" : win.method === "card" ? "ბარათი" : "გადამხდელი არ არის"}</span>
      </div>
      <div className="min-h-[60px] space-y-1 px-3 py-2">
        {charges.map((c) => (
          <div key={c.id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1 text-[14px]">
            <span className="flex-1">{c.label_ka}</span>
            <span className="font-mono">{money(c.amount)}</span>
            {!ctx.locked && <button onClick={() => ctx.move(c.id, null)} className="text-slate-400 hover:text-slate-700" title="Unassign"><Undo2 className="h-3.5 w-3.5" /></button>}
          </div>
        ))}
        {charges.length === 0 && <div className="pt-3 text-center text-[12px] text-slate-400">ჩააგდეთ ხარჯი აქ</div>}
      </div>
      <div className="border-t border-slate-100 px-3 py-1.5 text-right text-[13px] text-slate-600">სულ <b className="font-mono">{money(total)}</b></div>
    </div>
  );
}

// ---- shared ------------------------------------------------------------------------

function RouteButtons({ ctx, charge }: { ctx: Ctx; charge: Charge }) {
  const classic = ctx.skin === "classic";
  return (
    <span className="inline-flex items-center gap-1">
      {([1, 2] as WindowNo[]).map((n) => (
        <button
          key={n}
          data-testid={`to-w${n}-${charge.id}`}
          disabled={ctx.locked || charge.window === n}
          onClick={() => ctx.move(charge.id, n)}
          className={`px-1.5 text-[12px] font-semibold disabled:opacity-30 ${
            classic ? "rounded-sm border border-slate-500 bg-[#E4E7EB] hover:bg-white" : "rounded-full bg-slate-100 py-0.5 hover:bg-sky-100"
          }`}
        >
          →W{n}
        </button>
      ))}
    </span>
  );
}

function Balance({ ctx }: { ctx: Ctx }) {
  const t = folioTotals(ctx.state.folio);
  const balanced = t.unrouted < 0.005;
  return (
    <div className="flex flex-wrap items-center gap-x-3 font-mono text-[14px]">
      <span>W1 {t.byWindow[1].toFixed(2)}</span>
      <span>W2 {t.byWindow[2].toFixed(2)}</span>
      {(t.byWindow[3] > 0 || t.byWindow[4] > 0) && <span>W3/4 {(t.byWindow[3] + t.byWindow[4]).toFixed(2)}</span>}
      {balanced ? (
        <span className="flex items-center gap-1 font-sans font-semibold text-emerald-700"><ShieldCheck className="h-4 w-4" /> დაბალანსებულია</span>
      ) : (
        <span className="text-amber-700">Unrouted {t.unrouted.toFixed(2)}</span>
      )}
    </div>
  );
}

function GraderHud({ state, last, classic }: { state: SimuState; last: GateEvent | null; classic: boolean }) {
  const satisfied = satisfiedRules(state.folio, state.rules);
  const ruleById = new Map(state.rules.map((r) => [r.id, r]));
  const correct = state.folio.charges.filter((c) => c.window !== null && gateMove(state.folio, state.rules, c.id, c.window).ok).length;
  const failed = last && !last.ok && last.ruleId !== "SYS";
  const chargeLabel = last?.chargeId ? state.folio.charges.find((c) => c.id === last.chargeId)?.label_ka : null;

  return (
    <div data-testid="gate" className={`shrink-0 px-3 py-2 text-[14px] ${classic ? "border-t border-slate-500 bg-[#1b2433] text-slate-100" : "border-t border-slate-200 bg-slate-900 text-slate-100"}`}>
      {failed && last ? (
        <div key={last.at} className="animate-slide-up flex items-start gap-3 rounded-lg bg-red-600/95 px-3 py-2 text-white shadow-lg">
          <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0" />
          <div className="min-w-0">
            <div className="text-[16px] font-bold">✗ {last.ruleId}: {last.message_ka}{last.source ? ` (ამბასადორის წესდება, გვ. ${last.source.page})` : ""}</div>
            <div className="text-[13px] text-red-100">{last.message_en}. {chargeLabel ? `«${chargeLabel}» → W${last.target} დაბლოკილია; ხარჯი დაბრუნდა.` : "Posting blocked."}</div>
            {last.source && (
              <div className="mt-1 text-[13px] text-red-50">წყარო: ამბასადორის წესდება, გვ. {last.source.page} · «{last.source.quote}»</div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-semibold text-slate-400">GRADER</span>
          {satisfied.length === 0 && <span className="text-slate-400">ყოველი გადატანა მოწმდება სასტუმროს წესებით, ჩაწერამდე</span>}
          {satisfied.map((id) => (
            <span key={id} className="flex items-center gap-1 text-emerald-300">
              <CheckCircle2 className="h-4 w-4" /> {id} {ruleById.get(id)?.title_ka.split("—")[0].trim()}
            </span>
          ))}
          {last?.ok && last.ruleId === "BAL" && <span className="text-emerald-300">✓ {last.message_ka}</span>}
        </div>
      )}
      <div className="mt-1 flex items-center gap-4 text-[12px] text-slate-400">
        <span>ქულა · Score <b className="text-slate-100">{correct}/{state.folio.charges.length}</b></span>
        <span>დაჭერილი შეცდომა · caught <b className="text-slate-100">{state.metrics.errorsCaught}</b></span>
        <span className="flex items-center gap-1"><ArrowLeftRight className="h-3 w-3" /> გადაიტანეთ ან →W1/→W2</span>
      </div>
    </div>
  );
}

function NotPublished({ rulesLoaded }: { rulesLoaded: boolean }) {
  const [busy, setBusy] = useState(false);
  const quickStart = async () => {
    setBusy(true);
    if (!rulesLoaded) await upload("ingest", new FormData());
    const out = await act("publish");
    setBusy(false);
    if (out.ok) toast(out.note ?? "გამოქვეყნდა", "ok");
  };
  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-slate-900/70 backdrop-blur-[2px]">
      <div className="max-w-sm rounded-xl bg-slate-800 p-5 text-center text-slate-100 shadow-2xl">
        <div className="text-lg font-semibold">ცვლა ჯერ არ დაწყებულა</div>
        <div className="mt-1 text-sm text-slate-400">გამოაქვეყნეთ წესები Rule Studio-დან: ფოლიოს ყოველი მოქმედება მათით შეფასდება. · Publish the rules first.</div>
        <button onClick={() => void quickStart()} disabled={busy} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500 disabled:opacity-60">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} {rulesLoaded ? "გამოქვეყნება" : "დემო პაკეტი + გამოქვეყნება"}
        </button>
      </div>
    </div>
  );
}
