"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bell, Bot, Building2, Check, ChevronDown, LayoutDashboard, LayoutGrid, Loader2, Minus, MonitorPlay, Moon, PanelLeft,
  PanelLeftClose, Presentation, Projector, RotateCcw, ShieldAlert, SkipForward, Sparkles, Wifi, WifiOff, X, type LucideIcon,
} from "lucide-react";
import { act, clock, DEMO_PHOTO, sharedHotkeys, toast, upload, useNow, usePresenterHotkeys, useSimuStream, useToasts } from "@/lib/simustay/client";
import { PMS_EDITIONS, PROPERTIES, PROPERTY_IDS } from "@/lib/simustay/properties";
import { gateMove } from "@/lib/simustay/grader";
import type { ActResult, AppId, PropertyId, SimuState, WindowNo } from "@/lib/simustay/types";
import { MARKETPLACE, type MarketAppId } from "@/lib/simustay/marketplace";
import { applyWindowAction, type WindowAction } from "@/lib/simustay/windows";
import { APP_ORDER, APPS } from "./appRegistry";
import AppLaunchpad from "./AppLaunchpad";
import BottomDock from "./BottomDock";
import SidebarDock from "./SidebarDock";
import AgentInspectorDrawer, { type AgentId } from "./inspectors/AgentInspectorDrawer";
import IngestWindow from "./apps/IngestWindow";
import PmsWindow from "./apps/PmsWindow";
import CommsWindow from "./apps/CommsWindow";
import BoardWindow from "./apps/BoardWindow";
import PhoneWindow from "./apps/PhoneWindow";
import AgentsWindow from "./apps/AgentsWindow";
import OpsWindow from "./apps/OpsWindow";
import AppStoreWindow, { MarketAppPanel } from "./apps/AppStoreWindow";
import PitchStage, { type PitchControls } from "./pitch/PitchStage";

interface Rect { x: number; y: number; w: number; h: number }
// Geometry and stacking are per-viewer only.
interface Win extends Rect { z: number }
// Which windows are open, and which has focus. This browser's copy is authoritative for its own actions;
// the server copy persists it and carries other operators' changes.
interface WindowSet { open: Record<AppId, boolean>; focused: AppId | null }

function newClientId(): string {
  // crypto.randomUUID needs a secure context; the phone reaches the laptop over plain http on the LAN.
  return typeof crypto !== "undefined" && "randomUUID" in crypto && window.isSecureContext
    ? crypto.randomUUID()
    : `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
type Preset = "wide" | "compact";
type View = "launchpad" | "workspace" | "pitch";
type Theme = "midnight" | "projector";

const TOP = 64; // below the top nav
const DOCK = 100; // above the floating bottom dock
const GAP = 12;
const SIDEBAR = 96; // floating pill (16 + 64) + gutter

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
  const commsH = Math.round(ah * 0.55);
  const phoneH = Math.min(700, Math.round(ah * (preset === "wide" ? 0.7 : 0.76)));
  const phoneW = Math.round((phoneH - 32) * 0.5) + 12;
  const center = (w: number, h: number, k: number): Rect => ({
    x: Math.round(left + (usable - w) / 2 + k * 28),
    y: Math.round(TOP + Math.max(0, (ah - h) / 2) + k * 24),
    w,
    h: Math.min(h, ah),
  });
  return {
    // Front-desk quartet: Rule Studio above the guest chat on the left, folio centre, room board right.
    ingest: { x: x1, y: TOP, w: c1, h: ah - commsH - GAP },
    comms: { x: x1, y: TOP + ah - commsH, w: c1, h: commsH },
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
  return Object.fromEntries(APP_ORDER.map((id, i) => [id, { ...rects[id], z: i + 1 }])) as Record<AppId, Win>;
}

const SESSION_KEY = "simstay_session_active";

export default function DesktopShell({ urlReset = false }: { urlReset?: boolean }) {
  const state = useSimuStream();
  const [wins, setWins] = useState<Record<AppId, Win> | null>(null);
  const [view, setView] = useState<View>("launchpad");
  const [sidebar, setSidebar] = useState(true);
  const [theme, setTheme] = useState<Theme>("midnight");
  const [buzz, setBuzz] = useState(false);
  const [menu, setMenu] = useState<"presenter" | "notifications" | "property" | null>(null);
  const [inspector, setInspector] = useState<{ id: AgentId; top: number } | null>(null);
  const [autopilot, setAutopilot] = useState(false);
  const [marketPanel, setMarketPanel] = useState<MarketAppId | null>(null);
  const zTop = useRef(20);
  const presetRef = useRef<Preset>("wide");
  const stateRef = useRef<SimuState | null>(null);
  const autoRef = useRef(false);
  const seenTasks = useRef<Set<string> | null>(null);
  stateRef.current = state;
  const left = sidebar ? SIDEBAR : 16;

  // ── Window set: local first, persisted in order, other operators' changes adopted ─────────────────
  const [wm, setWm] = useState<WindowSet | null>(null);
  const wmRef = useRef<WindowSet | null>(null);
  wmRef.current = wm;
  const clientId = useRef<string>("");
  const seq = useRef(0);
  const appliedRev = useRef(-1);
  const bootRef = useRef<string | null>(null);

  const persist = useCallback((payload: Record<string, unknown>) => {
    seq.current += 1;
    void act("windows", { ...payload, clientId: clientId.current, seq: seq.current });
  }, []);

  useEffect(() => {
    if (!state) return;
    const ui = state.ui;
    if (!clientId.current) clientId.current = newClientId();
    if (bootRef.current === null || wmRef.current === null) {
      bootRef.current = state.bootId;
      appliedRev.current = ui.rev;
      setWm({ open: { ...ui.openWindows }, focused: ui.focusedWindow });
      return;
    }
    if (state.bootId !== bootRef.current) {
      // The server restarted with default window state: re-publish this presenter's desk instead of adopting it.
      bootRef.current = state.bootId;
      appliedRev.current = ui.rev;
      persist({ action: "sync", openWindows: wmRef.current.open, focusedWindow: wmRef.current.focused });
      return;
    }
    if (ui.rev > appliedRev.current) {
      appliedRev.current = ui.rev;
      if (ui.writer !== clientId.current) setWm({ open: { ...ui.openWindows }, focused: ui.focusedWindow });
    }
  }, [state, persist]);

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

  // Pitch mode is entered deliberately each time (it resets the story), so a reload never lands in it.
  useEffect(() => {
    if (view === "pitch") return;
    try { localStorage.setItem("simustay.view", view); } catch { /* ignore */ }
  }, [view]);

  const applyPreset = useCallback((preset: Preset, sidebarLeft: number, announce = true) => {
    presetRef.current = preset;
    const rects = computeLayout(preset, window.innerWidth, window.innerHeight, sidebarLeft);
    setWins((w) => {
      if (!w) return w;
      const next = { ...w };
      for (const id of APP_ORDER) next[id] = { ...next[id], ...rects[id] };
      return next;
    });
    if (announce) toast(`განლაგება · Layout: ${preset === "wide" ? "1920×1080" : "1366×768"}`, "info");
  }, []);

  const toggleSidebar = () => {
    const next = !sidebar;
    setSidebar(next);
    applyPreset(presetRef.current, next ? SIDEBAR : 16, false);
  };

  const raise = useCallback((id: AppId) => {
    zTop.current += 1;
    const z = zTop.current;
    setWins((w) => (w ? { ...w, [id]: { ...w[id], z } } : w));
  }, []);

  // Every window change goes through the same pure state machine the server uses (lib/simustay/windows.ts):
  // applied locally first so the UI never waits or flickers, then persisted in order.
  const dispatch = useCallback((a: WindowAction) => {
    const cur = wmRef.current;
    if (!cur) return;
    const next = applyWindowAction({ openWindows: cur.open, focusedWindow: cur.focused }, a);
    const nextWm = { open: next.openWindows, focused: next.focusedWindow };
    wmRef.current = nextWm;
    setWm(nextWm);
    persist(a as unknown as Record<string, unknown>);
  }, [persist]);

  // Pointer-down inside an open window: bring it forward; persist only when focus actually moves.
  const focus = useCallback((id: AppId) => {
    const cur = wmRef.current;
    if (!cur?.open[id]) return;
    raise(id);
    if (cur.focused !== id) dispatch({ action: "focus", id });
  }, [raise, dispatch]);

  // Inside the workspace: add this one window (others untouched) and focus it.
  const openApp = useCallback((id: AppId) => {
    const cur = wmRef.current;
    if (!cur) return;
    setView("workspace");
    raise(id);
    if (!(cur.open[id] && cur.focused === id)) dispatch({ action: "open", id });
  }, [raise, dispatch]);

  // Launching from the Launchpad (card, dock, sidebar or inspector link): the workspace shows ONLY this app.
  // Every other window closes; nothing is resurrected. The demo quartet comes only from "Live workspace"/autopilot.
  const soloApp = useCallback((id: AppId) => {
    setView("workspace");
    raise(id);
    dispatch({ action: "solo", id });
  }, [raise, dispatch]);

  // Any launcher: solo from the Launchpad, additive once the presenter is already working in the workspace.
  const launchApp = useCallback((id: AppId) => {
    if (view === "launchpad") soloApp(id);
    else openApp(id);
  }, [view, soloApp, openApp]);

  // The X button: closed until someone deliberately opens it again.
  const closeApp = useCallback((id: AppId) => {
    if (wmRef.current?.open[id]) dispatch({ action: "close", id });
  }, [dispatch]);

  // Dock. From the Launchpad: solo launch. In the workspace, for that one app only:
  // closed → open; open but behind → focus; open and focused → close (minimise).
  const dockClick = useCallback((id: AppId) => {
    const cur = wmRef.current;
    if (!cur) return;
    if (view === "launchpad") { soloApp(id); return; }
    if (!cur.open[id]) { openApp(id); return; }
    if (cur.focused !== id) { focus(id); return; }
    closeApp(id);
  }, [view, soloApp, openApp, focus, closeApp]);

  // "Live workspace" (top nav, Launchpad button, empty-workspace button, autopilot): exactly the demo quartet.
  const liveWorkspace = useCallback(() => {
    setView("workspace");
    applyPreset(presetRef.current, sidebar ? SIDEBAR : 16, false);
    raise("pms");
    dispatch({ action: "preset" });
  }, [applyPreset, sidebar, raise, dispatch]);
  const liveWorkspaceRef = useRef(liveWorkspace);
  liveWorkspaceRef.current = liveWorkspace;

  // Clicks inside the phone iframe never reach this document; the window blurs instead. Treat that as focusing the phone.
  useEffect(() => {
    const onBlur = () => {
      setTimeout(() => {
        const el = document.activeElement;
        if (el instanceof HTMLIFrameElement && el.dataset.testid === "phone-frame") focus("phone");
      }, 0);
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [focus]);

  const switchProperty = useCallback(async (id: PropertyId) => {
    setMenu(null);
    setInspector(null);
    const out = await act("property", { propertyId: id });
    if (out.ok) toast(`🏨 ${PROPERTIES[id].name} · ${PMS_EDITIONS[PROPERTIES[id].pmsSkin].label}`, "ok");
  }, []);

  // Another operator's focus change brings that window to the front here too.
  const focusedId = wm?.focused ?? null;
  useEffect(() => { if (focusedId) raise(focusedId); }, [focusedId, raise]);

  // A new departure task makes the phone buzz and come to the front.
  useEffect(() => {
    if (!state) return;
    const ids = new Set(state.tasks.filter((t) => t.kind === "departure" && t.state === "open").map((t) => t.id));
    if (seenTasks.current) {
      const fresh = [...ids].some((id) => !seenTasks.current!.has(id));
      if (fresh && state.workspace.installed_apps.includes("phone") && wmRef.current?.open.phone) {
        raise("phone");
        setBuzz(true);
        setTimeout(() => setBuzz(false), 700);
      }
    }
    seenTasks.current = ids;
  }, [state, raise]);

  // Autopilot: the whole front-desk shift, paced for an audience. Check-in → routing (with the wine mistake the
  // coach stops) → check-out closes invoice #1 → a late restaurant check arrives → the trainee tries the closed
  // company invoice (stopped by the closed-invoice rule) → posts it to the supplementary window → invoice #2 →
  // housekeeping turns the villa around. Blocked moves hold longer so the coach banner can be read.
  const runAutopilot = useCallback(async () => {
    if (autoRef.current) { autoRef.current = false; setAutopilot(false); toast("ავტოპილოტი გაჩერდა · Autopilot stopped"); return; }
    autoRef.current = true;
    setAutopilot(true);
    liveWorkspaceRef.current();
    toast("▶ ავტოპილოტი · ჩასახლება → გასვლა → დაგვიანებული ხარჯი", "info");
    let cur: SimuState | null = stateRef.current;
    const pause = async (ms: number) => { for (let t = 0; t < ms && autoRef.current; t += 100) await new Promise((r) => setTimeout(r, 100)); };
    // Runs one beat, remembers the newest state, then holds: longer when the coach has just blocked a move.
    const beat = async (run: () => Promise<ActResult | void>, holdMs = 1600) => {
      if (!autoRef.current) return false;
      const out = await run();
      if (out?.state) cur = out.state;
      await pause(out?.gate && !out.gate.ok ? 3400 : holdMs);
      return autoRef.current;
    };
    const task = () => cur?.tasks.find((t) => t.kind === "departure" && t.state === "open");
    const lateCharge = () => cur?.folio.charges.find((c) => c.late && c.window === null) ?? null;

    const script: [() => Promise<ActResult | void>, number?][] = [
      [() => act("reset", { snapshot: "start" }), 900],
      [() => upload("ingest", new FormData()), 1200],
      [() => act("publish"), 2000], // check-in note and the guest's WhatsApp message
      ...(stateRef.current?.property.demoScript ?? []).map((m) => [() => act("folio/move", m), 1400] as [() => Promise<ActResult>, number]),
      [() => act("folio/finish"), 2600], // invoice #1 closed, villa to housekeeping
      [() => act("folio/late-charge"), 2400],
      // The instinctive mistake: the late charge onto the closed company invoice.
      [async () => {
        const c = lateCharge();
        const company = cur?.folio.windows.find((w) => w.closed && w.payerType === "company");
        return c && company ? act("folio/move", { chargeId: c.id, window: company.n }) : undefined;
      }],
      // The correction: the first window the rules accept (the supplementary window).
      [async () => {
        const c = lateCharge();
        const fix = c && cur ? ([1, 2, 3, 4] as WindowNo[]).find((w) => gateMove(cur!.folio, cur!.rules, c.id, w).ok) : undefined;
        return c && fix ? act("folio/move", { chargeId: c.id, window: fix }) : undefined;
      }, 1600],
      [async () => (cur?.folio.charges.some((c) => c.late) ? act("folio/finish") : undefined), 2400], // supplementary invoice
      ...["bed", "bath", "minibar", "amenities", "floor"].map((itemId) => [() => {
        const t = task();
        return t ? act("hk/check", { taskId: t.id, itemId, done: true }) : Promise.resolve();
      }, 700] as [() => Promise<ActResult | void>, number]),
      [() => { const t = task(); return t ? act("hk/complete", { taskId: t.id, photo: DEMO_PHOTO }) : Promise.resolve(); }, 1400],
      [() => act("hk/inspect", { room: cur?.folio.room }), 800],
    ];
    for (const [run, hold] of script) {
      if (!(await beat(run, hold))) return;
    }
    autoRef.current = false;
    setAutopilot(false);
    toast("✓ ავტოპილოტი დასრულდა · Autopilot finished", "ok");
  }, []);

  const toggleView = useCallback(() => setView((v) => (v === "launchpad" ? "workspace" : "launchpad")), []);

  // Clean slate: pristine start.json on the server (folio, chat, errors, property, add-ons, windows), any
  // running autopilot stopped, and this screen back on the Launchpad. Other open browsers follow via the stream.
  const resetDemo = useCallback(async (announce = true) => {
    autoRef.current = false;
    setAutopilot(false);
    setMenu(null);
    setInspector(null);
    setMarketPanel(null);
    setView("launchpad");
    const out = await act("reset", { full: true });
    if (out.ok && announce) toast("✓ დემო დაბრუნდა საწყის მდგომარეობაში", "ok");
  }, []);

  // A new session starts clean: a new tab or window, a restarted browser, or cleared site data all arrive
  // with empty sessionStorage. Reloading the same tab keeps the session and the demo where it was.
  // /?reset=true was already reset on the server before this page rendered; only the query is removed here.
  useEffect(() => {
    if (window.parent !== window) return; // an embedded page never resets the presenter's demo
    let fresh = false;
    try {
      fresh = sessionStorage.getItem(SESSION_KEY) === null;
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch { /* storage blocked: never auto-reset on every load */ }
    if (urlReset) {
      const url = new URL(window.location.href);
      url.searchParams.delete("reset");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      setView("launchpad");
      toast("✓ დემო დაბრუნდა საწყის მდგომარეობაში", "ok");
      return;
    }
    if (fresh) void resetDemo(false);
  }, [urlReset, resetDemo]);

  // Pitch mode (Ctrl+Shift+P, Esc to leave): the 60-second story on its own stage; the workspace autopilot stops.
  const pitchCtl = useRef<PitchControls | null>(null);
  const togglePitch = useCallback(() => {
    if (autoRef.current) { autoRef.current = false; setAutopilot(false); }
    setMenu(null);
    setInspector(null);
    setView((v) => (v === "pitch" ? "launchpad" : "pitch"));
  }, []);
  const exitPitch = useCallback(() => setView("launchpad"), []);

  usePresenterHotkeys({
    ...sharedHotkeys(),
    "1": () => applyPreset("wide", left),
    "2": () => applyPreset("compact", left),
    A: () => { if (view === "pitch") pitchCtl.current?.toggleAuto(); else void runAutopilot(); },
    L: toggleView,
    P: togglePitch,
  });

  const installed = useMemo(() => (state ? APP_ORDER.filter((id) => state.workspace.installed_apps.includes(id)) : []), [state]);
  const market = useMemo(() => (state ? MARKETPLACE.filter((m) => state.workspace.marketplace_apps?.includes(m.id)) : []), [state]);
  const openIds = useMemo(() => new Set(wm ? APP_ORDER.filter((id) => wm.open[id]) : []), [wm]);

  if (!state || !wins || !wm) {
    return (
      <div className="os-wallpaper flex h-screen items-center justify-center gap-3 text-os-mute">
        <Loader2 className="h-5 w-5 animate-spin" /> SimStay OS იტვირთება…
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
      case "store": return <AppStoreWindow state={state} />;
    }
  };

  return (
    <div className="os-wallpaper relative h-screen w-screen select-none overflow-hidden" data-view={view}>
      {view !== "pitch" && <TopNav
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
        onLiveWorkspace={liveWorkspace}
        onProperty={(id) => void switchProperty(id)}
        onPitch={togglePitch}
        onResetDemo={() => void resetDemo()}
      />}

      {view !== "pitch" && sidebar && (
        <SidebarDock
          state={state}
          activeAgent={inspector?.id ?? null}
          onAgent={(id, top) => setInspector(inspector?.id === id ? null : { id, top })}
          onSettings={() => launchApp("store")}
          onPresenter={() => setMenu(menu === "presenter" ? null : "presenter")}
        />
      )}

      {view !== "pitch" && sidebar && inspector && (
        <AgentInspectorDrawer
          agentId={inspector.id}
          state={state}
          anchorTop={inspector.top}
          onClose={() => setInspector(null)}
          onOpenApp={launchApp}
        />
      )}

      {view === "launchpad" && (
        <AppLaunchpad
          state={state}
          left={left}
          onOpen={soloApp}
          onOpenMarket={setMarketPanel}
          onStartDemo={liveWorkspace}
          onAutopilot={() => void runAutopilot()}
          autopilot={autopilot}
        />
      )}

      {/* Only open windows render; they stay mounted in launchpad view so the phone iframe survives. */}
      <div className={view === "workspace" ? "" : "hidden"}>
        {installed.filter((id) => openIds.has(id)).map((id) => (
          <WindowFrame
            key={id}
            id={id}
            win={wins[id]}
            title={APPS[id].title(state)}
            buzz={id === "phone" && buzz}
            onFocus={() => focus(id)}
            onClose={() => closeApp(id)}
            onRect={(r) => setWins((w) => (w ? { ...w, [id]: { ...w[id], ...r } } : w))}
          >
            {render(id)}
          </WindowFrame>
        ))}
      </div>

      {view === "workspace" && installed.every((id) => !openIds.has(id)) && (
        <div data-testid="workspace-empty" className="absolute inset-0 grid place-items-center" style={{ paddingLeft: left }}>
          <div className="max-w-sm rounded-3xl border border-white/5 bg-os-card p-8 text-center">
            <LayoutGrid className="mx-auto h-8 w-8 text-os-mute" />
            <div className="mt-3 text-[16px] font-semibold text-os-ink">ღია ფანჯარა არ არის</div>
            <div className="mt-1 text-[13px] text-os-mute">Open an app from the dock or the launchpad, or start the demo layout.</div>
            <button onClick={liveWorkspace} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#0B0C0E]">
              <MonitorPlay className="h-4 w-4" /> Live workspace
            </button>
          </div>
        </div>
      )}

      {view === "pitch" && <PitchStage state={state} onExit={exitPitch} controlRef={pitchCtl} />}

      {view !== "pitch" && (
        <>
          <BottomDock installed={installed} market={market} onMarket={setMarketPanel} openIds={openIds} focused={wm.focused} view={view === "workspace" ? "workspace" : "launchpad"} onLaunchpad={() => setView("launchpad")} onApp={dockClick} />
          <Toasts />
        </>
      )}
      {view !== "pitch" && marketPanel && market.some((m) => m.id === marketPanel) && (
        <MarketAppPanel id={marketPanel} onClose={() => setMarketPanel(null)} onOpenApp={launchApp} />
      )}
    </div>
  );
}

// ---- top navigation -----------------------------------------------------------------

interface NotificationItem { t: number; icon: LucideIcon; tone: string; text: string }

function notifications(s: SimuState): NotificationItem[] {
  const items: NotificationItem[] = [
    ...s.gateLog.filter((g) => !g.ok).map((g) => ({ t: g.at, icon: ShieldAlert, tone: "text-rose-400", text: `სასტუმროს წესდება: ${g.message_ka}` })),
    // Plain-language room updates, never raw integration calls.
    ...s.adapterLog.filter((l) => l.line.startsWith("PATCH")).map((l) => {
      const room = /"Id":"([^"]+)"/.exec(l.line)?.[1] ?? "?";
      const status = /"State":"([^"]+)"/.exec(l.line)?.[1] ?? "updated";
      return { t: l.t, icon: Sparkles, tone: "text-emerald-400", text: `PMS · ${room} → ${status}` };
    }),
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
  menu: "presenter" | "notifications" | "property" | null;
  setMenu: (m: "presenter" | "notifications" | "property" | null) => void;
  autopilot: boolean;
  onAutopilot: () => void;
  onPreset: (p: Preset) => void;
  onLiveWorkspace: () => void;
  onProperty: (id: PropertyId) => void;
  onPitch: () => void;
  onResetDemo: () => void;
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

      <button
        onClick={props.onResetDemo}
        data-testid="reset-demo"
        title="დემოს თავიდან დაწყება: საწყისი მდგომარეობა · Reset the demo to its clean start"
        className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 px-2.5 py-1 text-[12px] font-medium text-os-ink hover:bg-white/10"
      >
        <RotateCcw className="h-3.5 w-3.5" /> თავიდან დაწყება
      </button>

      <button
        onClick={props.onLiveWorkspace}
        data-testid="live-workspace"
        title="Front-desk layout: Rule Studio, guest chat, folio, room board"
        className="flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-1 text-[12px] font-semibold text-[#0B0C0E] hover:bg-white/90"
      >
        <MonitorPlay className="h-3.5 w-3.5" /> Live workspace
      </button>

      <button
        onClick={props.onPitch}
        data-testid="pitch-mode"
        title="Pitch mode: the 60-second story (Ctrl+Shift+P, Esc to leave)"
        className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-2.5 py-1 text-[12px] font-semibold text-[#0B0C0E] hover:bg-emerald-400"
      >
        <Presentation className="h-3.5 w-3.5" /> Pitch
      </button>

      <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
        <button
          data-testid="property-switcher"
          onClick={() => setMenu(menu === "property" ? null : "property")}
          className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-[14px] font-medium text-os-ink hover:bg-white/5"
        >
          <Building2 className="h-4 w-4 text-[#C8A96A]" />
          {state.property.name} <span className="text-os-mute">•</span> <span className="text-os-mute">SimStay OS</span>
          <ChevronDown className="h-4 w-4 text-os-mute" />
        </button>
        {menu === "property" && (
          <>
            <div className="fixed inset-0 z-[9060]" onClick={() => setMenu(null)} />
            <div className="absolute left-1/2 top-11 z-[9070] w-[420px] -translate-x-1/2 rounded-2xl border border-white/10 bg-os-card/95 p-1.5 shadow-2xl backdrop-blur-md">
              <div className="px-2 pb-1 pt-0.5 text-[12px] font-semibold uppercase tracking-wide text-os-mute">ობიექტი · Property</div>
              {PROPERTY_IDS.map((id) => {
                const p = PROPERTIES[id];
                const active = state.property.id === id;
                return (
                  <button
                    key={id}
                    data-testid={`property-${id}`}
                    onClick={() => props.onProperty(id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-white/5 ${active ? "bg-white/5" : ""}`}
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full text-[13px] font-bold" style={{ background: id === "bioli" ? "#1F3B2A" : "#3A2F1A", color: id === "bioli" ? "#86EFAC" : "#E7C98B" }}>
                      {p.short.slice(0, 1)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium text-os-ink">{p.name}</span>
                      <span className="block text-[12px] text-os-mute">{PMS_EDITIONS[p.pmsSkin].label} · {p.rules.length} rules</span>
                    </span>
                    {active && <Check className="h-4 w-4 text-emerald-400" />}
                  </button>
                );
              })}
              <div className="px-3 pb-1 pt-1.5 text-[11px] text-os-mute">გადართვა ტვირთავს ობიექტის საწყის მდგომარეობას · switching loads that property&apos;s start state</div>
            </div>
          </>
        )}
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
                <div className="text-[12px] text-os-mute">Front desk · {state.property.short}</div>
              </div>
              <div className="my-1 h-px bg-white/5" />
              <MenuItem icon={RotateCcw} k="R" label="სრული გადატვირთვა · Full reset" onClick={() => sharedHotkeys().R?.()} />
              <MenuItem icon={SkipForward} k="B" label="გასვლამდე · Jump to check-out" onClick={() => sharedHotkeys().B?.()} />
              <MenuItem icon={offline ? Wifi : WifiOff} k="O" label="ონლაინ/ოფლაინ · Toggle mode" onClick={() => sharedHotkeys().O?.()} />
              <MenuItem icon={Presentation} k="P" label="Pitch mode · 60-second story" onClick={props.onPitch} />
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
      onPointerDown={props.onFocus}
      className={`absolute flex flex-col overflow-hidden rounded-2xl border border-os-edge bg-os-panel shadow-[0_24px_70px_-20px_rgba(0,0,0,.85)] ${props.buzz ? "animate-buzz" : ""}`}
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
