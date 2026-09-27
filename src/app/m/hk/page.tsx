"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Check, ChevronLeft, ChevronRight, ClipboardCheck, ImageIcon, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { act, DEMO_PHOTO, sharedHotkeys, unitName, usePresenterHotkeys, useSimuStream, useToasts } from "@/lib/simustay/client";
import type { HkTask, SimuState } from "@/lib/simustay/types";

type Role = "hk" | "supervisor";

export default function HousekeepingPhone() {
  const state = useSimuStream();
  const [role, setRole] = useState<Role>("hk");
  const [openId, setOpenId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [flash, setFlash] = useState<string | null>(null);
  const [ring, setRing] = useState(false);
  const seen = useRef<Set<string> | null>(null);

  usePresenterHotkeys(sharedHotkeys());

  // New departure task: vibrate (real phone) and ring the banner.
  useEffect(() => {
    if (!state) return;
    const ids = new Set(state.tasks.filter((t) => t.state === "open").map((t) => t.id));
    if (seen.current && [...ids].some((id) => !seen.current!.has(id))) {
      setRing(true);
      setTimeout(() => setRing(false), 1200);
      try { navigator.vibrate?.([120, 60, 120]); } catch { /* not supported */ }
    }
    seen.current = ids;
  }, [state]);

  const task = state?.tasks.find((t) => t.id === openId && t.state === "open") ?? null;
  useEffect(() => { if (openId && state && !task) setOpenId(null); }, [openId, state, task]);

  const say = (text: string) => { setFlash(text); setTimeout(() => setFlash(null), 2200); };

  return (
    <main className="relative flex h-[100dvh] flex-col overflow-hidden bg-slate-100 text-slate-900" style={{ fontSize: 17 }}>
      <StatusBar />
      <header className="shrink-0 bg-white px-4 pb-3 pt-1 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-sky-500 to-rose-500 text-sm font-black text-white">S</span>
          <div className="leading-tight">
            <div className="font-semibold">SimuStay · {role === "hk" ? "ნინო" : "თამარი"}</div>
            <div className="text-[13px] text-slate-500">{role === "hk" ? "დიასახლისობა" : "ზედამხედველი"} · Ambassadori Kachreti</div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          <RoleChip id="role-hk" active={role === "hk"} onClick={() => { setRole("hk"); }} label="დამლაგებელი" />
          <RoleChip id="role-supervisor" active={role === "supervisor"} onClick={() => { setRole("supervisor"); setOpenId(null); }} label="ზედამხედველი" />
        </div>
      </header>

      <section className="scroll-thin min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {!state && <div className="flex items-center justify-center gap-2 pt-20 text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /> იტვირთება…</div>}
        {state && role === "hk" && !task && <TaskList state={state} ring={ring} onOpen={setOpenId} />}
        {state && role === "hk" && task && (
          <TaskDetail
            task={task}
            name={unitName(state.rooms, task.room)}
            photo={photos[task.id] ?? task.photo}
            onPhoto={(p) => setPhotos((x) => ({ ...x, [task.id]: p }))}
            onBack={() => setOpenId(null)}
            onDone={() => { setOpenId(null); say(`${unitName(state.rooms, task.room)} დასუფთავებულია ✓`); }}
          />
        )}
        {state && role === "supervisor" && <Supervisor state={state} onDone={(room) => say(`${unitName(state.rooms, room)} შემოწმებულია · იყიდება`)} />}
      </section>

      {flash && (
        <div className="pointer-events-none absolute inset-x-4 bottom-8 animate-slide-up rounded-2xl bg-emerald-600 px-4 py-3 text-center font-semibold text-white shadow-xl">{flash}</div>
      )}
      <PhoneToasts />
    </main>
  );
}

function StatusBar() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-8 shrink-0 items-center justify-between bg-white px-6 text-[13px] font-semibold">
      <span>{t}</span>
      <span className="text-slate-400">SimuStay</span>
      <span>5G ▮▮▮</span>
    </div>
  );
}

function RoleChip(props: { id: string; active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      data-testid={props.id}
      onClick={props.onClick}
      className={`h-11 rounded-xl text-[15px] font-semibold transition ${props.active ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}
    >
      {props.label}
    </button>
  );
}

function TaskList({ state, ring, onOpen }: { state: SimuState; ring: boolean; onOpen: (id: string) => void }) {
  const open = state.tasks.filter((t) => t.state === "open").sort((a, b) => (a.kind === b.kind ? b.createdAt - a.createdAt : a.kind === "departure" ? -1 : 1));
  const done = state.tasks.filter((t) => t.state !== "open");
  return (
    <div className="space-y-3">
      <div className="text-[14px] font-semibold uppercase tracking-wide text-slate-500">დღევანდელი დავალებები · {open.length}</div>
      {open.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-center text-slate-500 shadow-sm">
          <Sparkles className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
          ღია დავალება არ არის
        </div>
      )}
      {open.map((t) => (
        <button
          key={t.id}
          onClick={() => onOpen(t.id)}
          className={`flex min-h-[76px] w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left shadow-sm active:scale-[.99] ${
            t.kind === "departure" ? "border-l-8 border-red-500" : "border-l-8 border-amber-400"
          } ${ring && t.kind === "departure" ? "animate-buzz" : ""}`}
        >
          <span className="text-2xl">{t.kind === "departure" ? "🔴" : "🟠"}</span>
          <div className="flex-1">
            <div className="text-[20px] font-bold">{unitName(state.rooms, t.room)}</div>
            <div className="text-[14px] text-slate-500">{t.kind === "departure" ? "გასვლა · Departure" : "დარჩენა · Stayover"} · {t.checklist.filter((i) => i.done).length}/{t.checklist.length}</div>
          </div>
          <span className="flex items-center gap-1 font-semibold text-sky-600">დაწყება <ChevronRight className="h-5 w-5" /></span>
        </button>
      ))}
      {done.length > 0 && (
        <>
          <div className="pt-3 text-[14px] font-semibold uppercase tracking-wide text-slate-400">დასრულებული</div>
          {done.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 text-slate-500">
              <Check className="h-5 w-5 text-emerald-500" /> {unitName(state.rooms, t.room)} · {t.state === "inspected" ? "შემოწმებული" : "დასუფთავებული"}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function TaskDetail(props: { task: HkTask; name: string; photo: string | null; onPhoto: (p: string) => void; onBack: () => void; onDone: () => void }) {
  const { task, photo } = props;
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const doneCount = task.checklist.filter((i) => i.done).length;
  const ready = doneCount === task.checklist.length && !!photo;

  const complete = async () => {
    setBusy(true);
    const out = await act("hk/complete", { taskId: task.id, photo });
    setBusy(false);
    if (out.ok) props.onDone();
  };

  return (
    <div className="space-y-3">
      <button onClick={props.onBack} className="flex h-10 items-center gap-1 text-[15px] font-semibold text-sky-600">
        <ChevronLeft className="h-5 w-5" /> დავალებები
      </button>
      <div className="flex items-baseline justify-between">
        <div className="text-[26px] font-bold">{props.name}</div>
        <div className="text-[15px] font-semibold text-slate-500">{doneCount}/{task.checklist.length}</div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(doneCount / task.checklist.length) * 100}%` }} />
      </div>

      {task.checklist.map((i) => (
        <button
          key={i.id}
          data-testid={`chk-${i.id}`}
          onClick={() => void act("hk/check", { taskId: task.id, itemId: i.id, done: !i.done })}
          className={`flex min-h-[60px] w-full items-center gap-3 rounded-2xl px-4 text-left text-[18px] font-semibold shadow-sm transition active:scale-[.99] ${
            i.done ? "bg-emerald-500 text-white" : "bg-white text-slate-800"
          }`}
        >
          <span className={`grid h-8 w-8 place-items-center rounded-lg border-2 ${i.done ? "border-white bg-white/20" : "border-slate-300"}`}>
            {i.done && <Check className="h-5 w-5" />}
          </span>
          <span className="flex-1">{i.label_ka}</span>
          <span className="text-[13px] font-normal opacity-70">{i.label_en}</span>
        </button>
      ))}

      <div className="flex gap-2">
        <button
          data-testid="hk-photo"
          onClick={() => file.current?.click()}
          className={`flex min-h-[60px] flex-1 items-center justify-center gap-2 rounded-2xl text-[18px] font-semibold shadow-sm ${photo ? "bg-sky-100 text-sky-800" : "bg-white text-slate-800"}`}
        >
          <Camera className="h-6 w-6" /> {photo ? "ფოტო ✓" : "ფოტო"}
        </button>
        <button
          data-testid="hk-demo-photo"
          onClick={() => props.onPhoto(DEMO_PHOTO)}
          className="flex min-h-[60px] items-center gap-1.5 rounded-2xl bg-white px-4 text-[14px] font-medium text-slate-600 shadow-sm"
          title="Pre-loaded stage photo"
        >
          <ImageIcon className="h-5 w-5" /> დემო
        </button>
        <input
          ref={file}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) props.onPhoto(await downscale(f).catch(() => DEMO_PHOTO));
          }}
        />
      </div>
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="room" className="h-28 w-full rounded-2xl object-cover shadow-sm" />
      )}

      <button
        data-testid="hk-complete"
        disabled={!ready || busy}
        onClick={() => void complete()}
        className="flex min-h-[72px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-[22px] font-bold text-white shadow-lg transition disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
      >
        {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : <ClipboardCheck className="h-7 w-7" />}
        დასუფთავებულია
      </button>
      {!ready && <div className="text-center text-[13px] text-slate-500">ჩართეთ 5-ვე პუნქტი და გადაიღეთ ფოტო</div>}
    </div>
  );
}

function Supervisor({ state, onDone }: { state: SimuState; onDone: (room: string) => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const clean = state.rooms.filter((r) => r.status === "clean").sort((a, b) => b.updatedAt - a.updatedAt);
  const inspect = async (room: string) => {
    setBusy(room);
    const out = await act("hk/inspect", { room });
    setBusy(null);
    if (out.ok) onDone(room);
  };
  return (
    <div className="space-y-3">
      <div className="text-[14px] font-semibold uppercase tracking-wide text-slate-500">შესამოწმებელი ოთახები · {clean.length}</div>
      {clean.length === 0 && <div className="rounded-2xl bg-white p-6 text-center text-slate-500 shadow-sm">დასუფთავებული ოთახი არ არის</div>}
      {clean.map((r) => {
        const photo = state.tasks.find((t) => t.room === r.number && t.photo)?.photo;
        return (
          <div key={r.number} className="rounded-2xl bg-white p-3 shadow-sm">
            <div className="flex items-center gap-3">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" className="h-14 w-14 rounded-xl object-cover" />
              ) : (
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-emerald-100 text-2xl">🟢</span>
              )}
              <div className="flex-1">
                <div className="text-[20px] font-bold">{unitName(state.rooms, r.number)}</div>
                <div className="text-[13px] text-slate-500">{r.type} · დასუფთავებული</div>
              </div>
            </div>
            <button
              data-testid={`inspect-${r.number}`}
              disabled={busy === r.number}
              onClick={() => void inspect(r.number)}
              className="mt-3 flex min-h-[60px] w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-[19px] font-bold text-white shadow active:scale-[.99] disabled:opacity-60"
            >
              {busy === r.number ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-6 w-6" />}
              შემოწმებულია
            </button>
          </div>
        );
      })}
    </div>
  );
}

function PhoneToasts() {
  const toasts = useToasts();
  return (
    <div className="pointer-events-none absolute inset-x-3 top-24 flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="animate-slide-up rounded-xl bg-amber-500 px-3 py-2 text-center text-[14px] font-medium text-slate-950 shadow-lg">{t.text}</div>
      ))}
    </div>
  );
}

// Phone cameras produce multi-MB images; the server accepts ≤ 600 kB, so shrink to a 640 px JPEG.
function downscale(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 640 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("image decode failed")); };
    img.src = url;
  });
}
