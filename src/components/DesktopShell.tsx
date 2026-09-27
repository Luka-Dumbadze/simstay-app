"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bell, Bot, LayoutDashboard, LayoutGrid, Loader2, Minus, Moon, PanelLeft, PanelLeftClose, Projector, RotateCcw,
  ShieldAlert, SkipForward, Sparkles, Wifi, WifiOff, X, type LucideIcon,
} from "lucide-react";
import { act, clock, DEMO_PHOTO, sharedHotkeys, toast, upload, useNow, usePresenterHotkeys, useSimuStream, useToasts } from "@/lib/simustay/client";
import type { AppId, SimuState } from "@/lib/simustay/types";
import { APP_ORDER, APPS } from "./appRegistry";
import AppLaunchpad from "./AppLaunchpad";
import BottomDock from "./BottomDock";
import SidebarDock from "./SidebarDock";
import IngestWindow from "./apps/IngestWindow";
import PmsWindow from "./apps/PmsWindow";
import CommsWindow from "./apps/CommsWindow";
import BoardWindow from "./apps/BoardWindow";
import PhoneWindow from "./apps/PhoneWindow";
import AgentsWindow from "./apps/AgentsWindow";
import OpsWindow from "./apps/OpsWindow";
import StoreWindow from "./apps/StoreWindow";

interface Rect { x: number; y: number; w: number; h: number }
interface Win extends Rect { open: boolean; z: number }
type Preset = "wide" | "compact";
type View = "launchpad" | "workspace";
type Theme = "midnight" | "projector";

const TOP = 64; // below the top nav
const DOCK = 100; // above the floating bottom dock
const GAP = 12;
const SIDEBAR = 96; // floating pill (16 + 64) + gutter
const DEMO_APPS: AppId[] = ["ingest", "pms", "comms", "board", "phone"];

function computeLayout(preset: Preset, vw: number, vh: number, left: number): Record<AppId, Rect> {
  const ah = vh - TOP - DOCK;
  const usable = vw - left - GAP;
  const [f1, f2] = preset === "wide" ? [0.26, 0.42] : [0.28, 0.44];
  const c1 = Math.round(usable * f1);
  const c2 = Math.round(usable * f2);
  const x1 = left;
  const x2 = x1 + c1 + GAP;
  const x3 = x2 + c2 + GAP;
  const c3 = Math.max(340, vw - x3 - GAP);
  const ingestH = Math.round(ah * (preset === "wide" ? 0.5 : 0.46));
  const phoneH = Math.min(700, Math.round(ah * (preset === "wide" ? 0.7 : 0.76)));
  const phoneW = Math.round((phoneH - 32) * 0.5) + 12;
  const center = (w: number, h: number, k: number): Rect => ({
    x: Math.round(left + (usable - w) / 2 + k * 28),
    y: Math.round(TOP + Math.max(0, (ah - h) / 2) + k * 24),
    w,
    h: Math.min(h, ah),
  });
  return {
    ingest: { x: x1, y: TOP, w: c1, h: ingestH },
    comms: { x: x1, y: TOP + ingestH + GAP, w: c1, h: ah - ingestH - GAP },
    pms: { x: x2, y: TOP, w: c2, h: ah },
    board: { x: x3, y: TOP, w: c3, h: ah },
    phone: { x: vw - GAP - phoneW, y: TOP + ah - phoneH, w: phoneW, h: phoneH },
    agents: center(560, 620, 0),
    ops: center(720, 580, 1),
    store: center(760, 640, 2),
  };
}

function initialWindows(preset: Preset, left: number): Record<AppId, Win> {
  const rects = computeLayout(preset, window.innerWidth, window.innerHeight, left);
  return Object.fromEntries(APP_ORDER.map((id, i) => [id, { ...rects[id], open: DEMO_APPS.includes(id), z: i + 1 }])) as Record<AppId, Win>;
}

export default function DesktopShell() {
  const state = useSimuStream();
  const [wins, setWins] = useState<Record<AppId, Win> | null>(null);
  const [view, setView] = useState<View>("launchpad");
  const [sidebar, setSidebar] = useState(true);
  const [theme, setTheme] = useState<Theme>("midnight");
  const [buzz, setBuzz] = useState(false);
  const [menu, setMenu] = useState<"presenter" | "notifications" | null>(null);
  const [autopilot, setAutopilot] = useState(false);
  const zTop = useRef(20);
  const presetRef = useRef<Preset>("wide");
  const stateRef = useRef<SimuState | null>(null);
  const autoRef = useRef(false);
  const seenTasks = useRef<Set<string> | null>(null);
  stateRef.current = state;
  const left = sidebar ? SIDEBAR : 16;

  useEffect(() => {
    presetRef.current = window.innerWidth >= 1600 ? "wide" : "compact";
    setWins(initialWindows(presetRef.current, SIDEBAR));
    try {
      const saved = localStorage.getItem("simustay.theme");
      if (saved === "projector" || saved === "midnight") setTheme(saved);
      const savedView = localStorage.getItem("simustay.view");
      if (savedView === "workspace" || savedView === "launchpad") setView(savedView);
    } catch { /* storage unavailable: defaults are fine */ }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("simustay.theme", theme); } catch { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem("simustay.view", view); } catch { /* ignore */ }
  }, [view]);

  const applyPreset = useCallback((preset: Preset, sidebarLeft: number, announce = true) => {
    presetRef.current = preset;
    const rects = computeLayout(preset, window.innerWidth, window.innerHeight, sidebarLeft);
    setWins((w) => {
      if (!w) return w;
      const next = { ...w };
      for (const id of APP_ORDER) next[id] = { ...next[id], ...rects[id], open: DEMO_APPS.includes(id) ? true : next[id].open };
      return next;
    });
    if (announce) toast(`განლაგება · Layout: ${preset === "wide" ? "1920×1080" : "1366×768"}`, "info");
  }, []);

  const toggleSidebar = () => {
    const next = !sidebar;
    setSidebar(next);
    applyPreset(presetRef.current, next ? SIDEBAR : 16, false);
  };

  const focus = useCallback((id: AppId) => {
    setWins((w) => (w ? { ...w, [id]: { ...w[id], open: true, z: ++zTop.current } } : w));
  }, []);

  const openApp = useCallback((id: AppId) => {
    setView("workspace");
    focus(id);
  }, [focus]);

  const toggleFromDock = useCallback((id: AppId) => {
    if (view === "launchpad") { openApp(id); return; }
    setWins((w) => {
      if (!w) return w;
      const cur = w[id];
      const isTop = Object.values(w).every((o) => o.z <= cur.z);
      if (cur.open && isTop) return { ...w, [id]: { ...cur, open: false } };
      return { ...w, [id]: { ...cur, open: true, z: ++zTop.current } };
    });
  }, [view, openApp]);

  // A new departure task makes the phone buzz and come to the front.
  useEffect(() => {
    if (!state) return;
    const ids = new Set(state.tasks.filter((t) => t.kind === "departure" && t.state === "open").map((t) => t.id));
    if (seenTasks.current) {
      const fresh = [...ids].some((id) => !seenTasks.current!.has(id));
      if (fresh && state.workspace.installed_apps.includes("phone")) {
        focus("phone");
        setBuzz(true);
        setTimeout(() => setBuzz(false), 700);
      }
    }
    seenTasks.current = ids;
  }, [state, focus]);

  const runAutopilot = useCallback(async () => {
    if (autoRef.current) { autoRef.current = false; setAutopilot(false); toast("ავტოპილოტი გაჩერდა · Autopilot stopped"); return; }
    autoRef.current = true;
    setAutopilot(true);
    setView("workspace");
    toast("▶ ავტოპილოტი · Autopilot: scripted beats, 1.2 s apart", "info");
    const wait = () => new Promise((r) => setTimeout(r, 1200));
    const task = () => stateRef.current?.tasks.find((t) => t.kind === "departure" && t.state === "open");
    const steps: (() => Promise<unknown>)[] = [
      () => act("reset", { snapshot: "start" }),
      () => upload("ingest", new FormData()),
      () => act("publish"),
      () => act("folio/move", { chargeId: "c-villa", window: 2 }),
      () => act("folio/move", { chargeId: "c-golf", window: 2 }),
      () => act("folio/move", { chargeId: "c-wine", window: 2 }),
      () => act("folio/move", { chargeId: "c-wine", window: 1 }),
      () => act("folio/move", { chargeId: "c-rest", window: 1 }),
      () => act("folio/finish"),
      ...["bed", "bath", "minibar", "amenities", "floor"].map((itemId) => () => {
        const t = task();
        return t ? act("hk/check", { taskId: t.id, itemId, done: true }) : Promise.resolve();
      }),
      () => { const t = task(); return t ? act("hk/complete", { taskId: t.id, photo: DEMO_PHOTO }) : Promise.resolve(); },
      () => act("hk/inspect", { room: stateRef.current?.folio.room ?? "304" }),
    ];
    for (const step of steps) {
      if (!autoRef.current) return;
      await step();
      await wait();
    }
    autoRef.current = false;
    setAutopilot(false);
    toast("✓ ავტოპილოტი დასრულდა · Autopilot finished", "ok");
  }, []);

  const toggleView = useCallback(() => setView((v) => (v === "launchpad" ? "workspace" : "launchpad")), []);

  usePresenterHotkeys({
    ...sharedHotkeys(),
    "1": () => applyPreset("wide", left),
    "2": () => applyPreset("compact", left),
    A: () => { void runAutopilot(); },
    L: toggleView,
  });

  const installed = useMemo(() => (state ? APP_ORDER.filter((id) => state.workspace.installed_apps.includes(id)) : []), [state]);
  const openIds = useMemo(() => new Set(wins ? APP_ORDER.filter((id) => wins[id].open) : []), [wins]);

  if (!state || !wins) {
    return (
      <div className="os-wallpaper flex h-screen items-center justify-center gap-3 text-os-mute">
        <Loader2 className="h-5 w-5 animate-spin" /> SimuStay OS იტვირთება…
      </div>
    );
  }

  const render = (id: AppId) => {
    switch (id) {
      case "ingest": return <IngestWindow state={state} />;
      case "pms": return <PmsWindow state={state} />;
      case "comms": return <CommsWindow state={state} />;
      case "board": return <BoardWindow state={state} />;
      case "phone": return <PhoneWindow />;
      case "agents": return <AgentsWindow state={state} />;
      case "ops": return <OpsWindow state={state} />;
      case "store": return <StoreWindow state={state} />;
    }
  };

  return (
    <div className="os-wallpaper relative h-screen w-screen select-none overflow-hidden" data-view={view}>
      <TopNav
        state={state}
        left={left}
        sidebar={sidebar}
        onSidebar={toggleSidebar}
        view={view}
        setView={setView}
        theme={theme}
        onTheme={() => setTheme((t) => (t === "midnight" ? "projector" : "midnight"))}
        menu={menu}
        setMenu={setMenu}
        autopilot={autopilot}
        onAutopilot={runAutopilot}
        onPreset={(p) => applyPreset(p, left)}
      />

      {sidebar && (
        <SidebarDock
          state={state}
          onAgents={() => openApp("agents")}
          onSettings={() => openApp("store")}
          onPresenter={() => setMenu(menu === "presenter" ? null : "presenter")}
        />
      )}

      {view === "launchpad" && (
        <AppLaunchpad
          state={state}
          left={left}
          onOpen={openApp}
          onStartDemo={() => { setView("workspace"); applyPreset(presetRef.current, left, false); }}
          onAutopilot={() => void runAutopilot()}
          autopilot={autopilot}
        />
      )}

      {/* Windows stay mounted in launchpad view so the phone iframe and scroll positions survive. */}
      <div className={view === "workspace" ? "" : "hidden"}>
        {installed.map((id) => (
          <WindowFrame
            key={id}
            id={id}
            win={wins[id]}
            title={APPS[id].title(state)}
            buzz={id === "phone" && buzz}
            onFocus={() => focus(id)}
            onClose={() => setWins((w) => (w ? { ...w, [id]: { ...w[id], open: false } } : w))}
            onRect={(r) => setWins((w) => (w ? { ...w, [id]: { ...w[id], ...r } } : w))}
          >
            {render(id)}
          </WindowFrame>
        ))}
      </div>

      <BottomDock installed={installed} openIds={openIds} view={view} onLaunchpad={() => setView("launchpad")} onApp={toggleFromDock} />
      <Toasts />
    </div>
  );
}

// ---- top navigation -----------------------------------------------------------------

interface NotificationItem { t: number; icon: LucideIcon; tone: string; text: string }

function notifications(s: SimuState): NotificationItem[] {
  const items: NotificationItem[] = [
    ...s.gateLog.filter((g) => !g.ok).map((g) => ({ t: g.at, icon: ShieldAlert, tone: "text-rose-400", text: `${g.ruleId}: ${g.message_ka}` })),
    ...s.adapterLog.filter((l) => l.line.startsWith("PATCH")).map((l) => ({ t: l.t, icon: Sparkles, tone: "text-emerald-400", text: l.line })),
  ];
  return items.sort((a, b) => b.t - a.t).slice(0, 8);
}

function TopNav(props: {
  state: SimuState;
  left: number;
  sidebar: boolean;
  onSidebar: () => void;
  view: View;
  setView: (v: View) => void;
  theme: Theme;
  onTheme: () => void;
  menu: "presenter" | "notifications" | null;
  setMenu: (m: "presenter" | "notifications" | null) => void;
  autopilot: boolean;
  onAutopilot: () => void;
  onPreset: (p: Preset) => void;
}) {
  const { state, menu, setMenu } = props;
  const now = useNow();
  const offline = state.mode === "offline";
  const items = notifications(state);
  const [seenAt, setSeenAt] = useState(0);
  const unseen = items.filter((i) => i.t > seenAt).length;

  return (
    <header
      className="absolute right-4 top-3 z-[9050] flex h-12 items-center gap-3 whitespace-nowrap rounded-2xl border border-white/5 bg-os-panel/80 px-3 backdrop-blur-md"
      style={{ left: props.left }}
    >
      <button onClick={props.onSidebar} className="grid h-8 w-8 place-items-center rounded-xl text-os-mute hover:bg-white/5 hover:text-os-ink" aria-label="Toggle sidebar">
        {props.sidebar ? <PanelLeftClose className="h-[18px] w-[18px]" /> : <PanelLeft className="h-[18px] w-[18px]" />}
      </button>
      <div className="flex items-center rounded-xl border border-white/5 bg-black/20 p-0.5 text-[12px]">
        {(["launchpad", "workspace"] as const).map((v) => (
          <button
            key={v}
            data-testid={`view-${v}`}
            onClick={() => props.setView(v)}
            className={`flex items-center gap-1.5 rounded-[10px] px-2.5 py-1 font-medium ${props.view === v ? "bg-white/10 text-os-ink" : "text-os-mute hover:text-os-ink"}`}
          >
            {v === "launchpad" ? <LayoutDashboard className="h-3.5 w-3.5" /> : <LayoutGrid className="h-3.5 w-3.5" />}
            {v === "launchpad" ? "Launchpad" : "Workspace"}
          </button>
        ))}
      </div>

      <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 text-[14px] font-medium text-os-ink lg:block">
        Ambassadori Kachreti Island &amp; Golf Resort <span className="px-1.5 text-os-mute">•</span> <span className="text-os-mute">SimuStay OS</span>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {props.autopilot && <span className="mr-1 flex items-center gap-1 text-[12px] text-pink-300"><Bot className="h-3.5 w-3.5" /> autopilot</span>}
        <button
          data-testid="mode-chip"
          onClick={() => void act("mode")}
          title="Ctrl+Shift+O"
          className={`mr-1 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ${offline ? "bg-white/5 text-os-mute" : "bg-emerald-500/15 text-emerald-300"}`}
        >
          {offline ? <WifiOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
          {offline ? "offline cache" : "online"}
        </button>
        <button onClick={props.onTheme} className="grid h-8 w-8 place-items-center rounded-xl text-os-mute hover:bg-white/5 hover:text-os-ink" title={props.theme === "midnight" ? "Projector theme" : "Midnight theme"} aria-label="Theme">
          {props.theme === "midnight" ? <Moon className="h-[18px] w-[18px]" /> : <Projector className="h-[18px] w-[18px]" />}
        </button>
        <div className="relative">
          <button
            onClick={() => { setMenu(menu === "notifications" ? null : "notifications"); setSeenAt(Date.now()); }}
            className="relative grid h-8 w-8 place-items-center rounded-xl text-os-mute hover:bg-white/5 hover:text-os-ink"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unseen > 0 && <span className="absolute right-1 top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-rose-500 px-0.5 text-[9px] font-bold text-white">{unseen}</span>}
          </button>
          {menu === "notifications" && (
            <Popover onClose={() => setMenu(null)} width="w-96">
              <div className="px-2 pb-1 pt-0.5 text-[12px] font-semibold uppercase tracking-wide text-os-mute">შეტყობინებები · this session</div>
              {items.length === 0 && <div className="px-2 py-3 text-[13px] text-os-mute">ჯერ არაფერია</div>}
              {items.map((n, i) => {
                const Icon = n.icon;
                return (
                  <div key={`${n.t}-${i}`} className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-[13px] hover:bg-white/5">
                    <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${n.tone}`} />
                    <span className="flex-1 whitespace-normal text-os-ink">{n.text}</span>
                    <span className="font-mono text-[11px] text-os-mute" suppressHydrationWarning>{clock(n.t).slice(0, 5)}</span>
                  </div>
                );
              })}
            </Popover>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setMenu(menu === "presenter" ? null : "presenter")}
            className="ml-1 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#C8A96A] to-[#8C6A2F] text-[12px] font-semibold text-[#0B0C0E]"
            aria-label="User menu and presenter controls"
          >
            ან
          </button>
          {menu === "presenter" && (
            <Popover onClose={() => setMenu(null)} width="w-72">
              <div className="px-2 pb-1.5 pt-0.5">
                <div className="text-[14px] font-semibold text-os-ink">ანა · Trainee</div>
                <div className="text-[12px] text-os-mute">Front desk · Ambassadori Kachreti</div>
              </div>
              <div className="my-1 h-px bg-white/5" />
              <MenuItem icon={RotateCcw} k="R" label="სრული გადატვირთვა · Full reset" onClick={() => sharedHotkeys().R?.()} />
              <MenuItem icon={SkipForward} k="B" label="გასვლამდე · Jump to check-out" onClick={() => sharedHotkeys().B?.()} />
              <MenuItem icon={offline ? Wifi : WifiOff} k="O" label="ონლაინ/ოფლაინ · Toggle mode" onClick={() => sharedHotkeys().O?.()} />
              <MenuItem icon={LayoutDashboard} k="L" label="Launchpad ↔ Workspace" onClick={() => props.setView(props.view === "launchpad" ? "workspace" : "launchpad")} />
              <MenuItem icon={LayoutGrid} k="1" label="განლაგება 1920×1080" onClick={() => props.onPreset("wide")} />
              <MenuItem icon={LayoutGrid} k="2" label="განლაგება 1366×768" onClick={() => props.onPreset("compact")} />
              <MenuItem icon={Bot} k="A" label={props.autopilot ? "ავტოპილოტის გაჩერება · Stop" : "ავტოპილოტი · Autopilot"} onClick={props.onAutopilot} />
            </Popover>
          )}
        </div>
        <span className="ml-2 tabular-nums text-[13px] text-os-mute" suppressHydrationWarning>{clock(now).slice(0, 5)}</span>
      </div>
    </header>
  );
}

function Popover(props: { onClose: () => void; width: string; children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 z-[9060]" onClick={props.onClose} />
      <div className={`absolute right-0 top-10 z-[9070] ${props.width} rounded-2xl border border-white/10 bg-os-card/95 p-1.5 shadow-2xl backdrop-blur-md`}>
        {props.children}
      </div>
    </>
  );
}

function MenuItem(props: { icon: LucideIcon; k: string; label: string; onClick: () => void }) {
  const Icon = props.icon;
  return (
    <button onClick={props.onClick} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] text-os-ink hover:bg-white/5">
      <Icon className="h-4 w-4 text-os-mute" />
      <span className="flex-1">{props.label}</span>
      <kbd className="rounded bg-white/10 px-1.5 text-[11px] text-os-mute">⌃⇧{props.k}</kbd>
    </button>
  );
}

// ---- windows ------------------------------------------------------------------------

function WindowFrame(props: {
  id: AppId;
  win: Win;
  title: string;
  buzz: boolean;
  onFocus: () => void;
  onClose: () => void;
  onRect: (r: Partial<Rect>) => void;
  children: React.ReactNode;
}) {
  const { win } = props;
  const app = APPS[props.id];
  const Icon = app.icon;

  const startDrag = (e: React.PointerEvent, mode: "move" | "resize") => {
    if (e.button !== 0) return;
    e.preventDefault();
    props.onFocus();
    const sx = e.clientX;
    const sy = e.clientY;
    const start = { x: win.x, y: win.y, w: win.w, h: win.h };
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (mode === "move") {
        props.onRect({
          x: Math.min(window.innerWidth - 80, Math.max(-start.w + 120, start.x + dx)),
          y: Math.min(window.innerHeight - 60, Math.max(TOP - 4, start.y + dy)),
        });
      } else {
        props.onRect({ w: Math.max(app.min.w, start.w + dx), h: Math.max(app.min.h, start.h + dy) });
      }
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      document.body.style.cursor = "";
    };
    document.body.style.cursor = mode === "move" ? "grabbing" : "nwse-resize";
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <section
      data-testid={`win-${props.id}`}
      onPointerDownCapture={props.onFocus}
      className={`absolute flex flex-col overflow-hidden rounded-2xl border border-os-edge bg-os-panel shadow-[0_24px_70px_-20px_rgba(0,0,0,.85)] ${props.buzz ? "animate-buzz" : ""} ${win.open ? "" : "hidden"}`}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }}
    >
      <header
        onPointerDown={(e) => startDrag(e, "move")}
        className="flex h-9 shrink-0 cursor-grab items-center gap-2.5 border-b border-os-edge bg-os-card px-3 active:cursor-grabbing"
      >
        <span className="grid h-5 w-5 place-items-center rounded-full" style={{ background: app.badge }}>
          <Icon className="h-3 w-3" style={{ color: app.glyph }} />
        </span>
        <span className="truncate text-[13px] font-medium text-os-ink">{props.title}</span>
        <div className="ml-auto flex items-center gap-1" onPointerDown={(e) => e.stopPropagation()}>
          <button onClick={props.onClose} className="rounded-md p-0.5 text-os-mute hover:bg-white/10 hover:text-os-ink" aria-label="Minimize">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button onClick={props.onClose} className="rounded-md p-0.5 text-os-mute hover:bg-rose-500/70 hover:text-white" aria-label="Close">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>
      <div className="relative min-h-0 flex-1 select-text">{props.children}</div>
      <div
        onPointerDown={(e) => startDrag(e, "resize")}
        className="absolute bottom-0 right-0 z-10 h-4 w-4 cursor-nwse-resize"
        style={{ background: "linear-gradient(135deg, transparent 50%, rgba(255,255,255,.18) 50%)" }}
      />
    </section>
  );
}

function Toasts() {
  const toasts = useToasts();
  return (
    <div className="pointer-events-none absolute left-1/2 top-20 z-[9500] flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-slide-up rounded-xl px-4 py-2 text-sm shadow-xl backdrop-blur ${
            t.kind === "ok" ? "bg-emerald-600/90 text-white" : t.kind === "warn" ? "bg-amber-500/95 text-slate-950" : "border border-white/10 bg-os-card/95 text-os-ink"
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
