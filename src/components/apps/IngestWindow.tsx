"use client";

import { useRef, useState } from "react";
import { CheckCircle2, FileText, Loader2, Send, Upload } from "lucide-react";
import rulesFixture from "@/lib/simustay/fixtures/rules.alazani.json";
import { act, toast, upload } from "@/lib/simustay/client";
import type { Rule, SimuState, Tier } from "@/lib/simustay/types";

const TIER_META: Record<Tier, { color: string; label_ka: string; label_en: string }> = {
  H: { color: "#EF4444", label_ka: "მკაცრი", label_en: "Hard invariant" },
  P: { color: "#F59E0B", label_ka: "პოლიტიკა", label_en: "Signed policy" },
  D: { color: "#94A3B8", label_ka: "შეხედულება", label_en: "Discretion" },
};

export default function IngestWindow({ state }: { state: SimuState }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const ingest = async (file: File | null) => {
    setBusy(file?.name ?? rulesFixture.document.fileName);
    const form = new FormData();
    if (file) form.append("file", file);
    const out = await upload("ingest", form);
    setBusy(null);
    if (out.ok && out.note) toast(out.note, "info");
  };

  const publish = async () => {
    setPublishing(true);
    const out = await act("publish");
    setPublishing(false);
    if (out.ok) toast(out.note ?? "გამოქვეყნდა · Published", "ok");
  };

  const graded = state.rules.filter((r) => r.tier !== "D").length;
  const coached = state.rules.length - graded;

  return (
    <div className="flex h-full flex-col bg-os-panel text-[15px]">
      <label
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); void ingest(e.dataTransfer.files?.[0] ?? null); }}
        className={`m-3 flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed px-4 py-3 transition ${
          drag ? "border-sky-400 bg-sky-500/10" : busy ? "animate-pulse border-violet-400 bg-violet-500/10" : "border-os-edge hover:border-white/30"
        }`}
      >
        <input
          ref={input}
          data-testid="ingest-drop"
          type="file"
          accept="application/pdf,image/*"
          className="hidden"
          onChange={(e) => { void ingest(e.target.files?.[0] ?? null); e.target.value = ""; }}
        />
        {busy ? <Loader2 className="h-7 w-7 shrink-0 animate-spin text-violet-300" /> : <Upload className="h-7 w-7 shrink-0 text-slate-400" />}
        <div className="min-w-0 flex-1">
          <div className="font-medium text-slate-100">
            {busy ? `ვკითხულობ ${state.ingest?.pages ?? 2} გვერდს… · Reading` : "ჩააგდეთ SOP / შიდა წესები (PDF)"}
          </div>
          <div className="truncate text-[13px] text-slate-400">
            {busy ?? state.ingest?.fileName ?? `Drop SOPs · ${rulesFixture.document.fileName} · ka/en`}
            {state.ingest && !busy && ` · ${state.ingest.pages} გვ. · ${state.ingest.source === "live" ? "live AI" : "offline cache"}`}
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); void ingest(null); }}
          className="shrink-0 rounded-md bg-white/10 px-2.5 py-1 text-[12px] text-slate-200 hover:bg-white/20"
          disabled={!!busy}
        >
          დემო პაკეტი
        </button>
      </label>

      {state.ingest?.note && (
        <div className="mx-3 -mt-1 mb-2 rounded bg-slate-700/50 px-3 py-1.5 text-[12px] text-slate-300">{state.ingest.note}</div>
      )}

      <div className="scroll-thin min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-3">
        {state.rules.length === 0 && !busy && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-slate-500">
            <FileText className="h-10 w-10" />
            <div>წესები ჯერ არ არის ამოღებული</div>
            <div className="text-[13px]">Rules appear here, tiered H / P / D, each linked to its source line</div>
          </div>
        )}
        {state.rules.map((r, i) => <RuleCard key={r.id} rule={r} index={i} />)}
      </div>

      {state.rules.length > 0 && (
        <footer className="flex items-center gap-3 border-t border-white/5 px-3 py-2.5 text-[13px]">
          <span className="text-slate-300">შეფასებადი H + P: <b>{graded}</b></span>
          <span className="text-slate-500">მხოლოდ რჩევა D: <b>{coached}</b></span>
          {state.published ? (
            <span className="ml-auto flex items-center gap-1.5 text-emerald-400"><CheckCircle2 className="h-4 w-4" /> გამოქვეყნებულია · Published v1</span>
          ) : (
            <button
              onClick={() => void publish()}
              disabled={publishing}
              className="ml-auto flex items-center gap-2 rounded-lg bg-violet-600 px-3.5 py-2 font-semibold text-white shadow hover:bg-violet-500 disabled:opacity-60"
            >
              {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Publish to training
            </button>
          )}
        </footer>
      )}
    </div>
  );
}

function RuleCard({ rule, index }: { rule: Rule; index: number }) {
  const meta = TIER_META[rule.tier];
  return (
    <div
      data-testid="rule-card"
      className="group animate-card-in rounded-xl border border-white/5 bg-os-card p-2.5"
      style={{ animationDelay: `${index * 90}ms`, borderLeft: `4px solid ${meta.color}` }}
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded text-[12px] font-black text-white" style={{ background: meta.color }} title={meta.label_en}>
          {rule.tier}
        </span>
        <div className="min-w-0 flex-1">
          <div className="leading-snug text-slate-100">
            <b className="mr-1.5 font-mono text-[13px]" style={{ color: meta.color }}>{rule.id}</b>
            {rule.title_ka}
          </div>
          <div className="text-[12px] text-slate-500">{rule.title_en}</div>
          <div className="mt-1 flex items-start gap-1.5 text-[13px] italic text-slate-300 group-hover:text-white">
            <span className="shrink-0 rounded bg-white/10 px-1.5 not-italic text-[11px] text-slate-300">გვ. {rule.source.page}</span>
            <span className="line-clamp-1 group-hover:line-clamp-none">«{rule.source.quote}»</span>
          </div>
          {rule.tier === "D" && (
            <div className="mt-1 text-[12px] text-slate-400">💬 მხოლოდ რჩევა, არასდროს ჩაიჭრება · coached, never failed</div>
          )}
        </div>
      </div>
    </div>
  );
}
