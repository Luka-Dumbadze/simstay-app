"use client";
// Browser-side helpers: live state (SSE with polling fallback), actions, toasts, presenter hotkeys.
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ActResult, SimuState } from "./types";

export function useSimuStream(): SimuState | null {
  const [state, setState] = useState<SimuState | null>(null);
  const version = useRef(-1);
  const bootId = useRef<string | null>(null);
  useEffect(() => {
    let es: EventSource | null = null;
    let poll: ReturnType<typeof setInterval> | null = null;
    let reopen: ReturnType<typeof setTimeout> | null = null;
    let watchdog: ReturnType<typeof setInterval> | null = null;
    let lastHeard = Date.now();
    let alive = true;
    // Versions only grow within one server process, so older frames are dropped. A restarted server
    // starts again from 0 with a new bootId; without this reset the page would ignore it and look frozen.
    const accept = (s: SimuState) => {
      if (!s || typeof s.version !== "number") return;
      if (s.bootId !== bootId.current) {
        bootId.current = s.bootId;
        version.current = -1;
      }
      if (s.version > version.current) {
        version.current = s.version;
        setState(s);
      }
    };
    const stopPoll = () => { if (poll) { clearInterval(poll); poll = null; } };
    const startPoll = () => {
      if (poll) return;
      poll = setInterval(async () => {
        try { accept(await (await fetch("/api/simustay/state", { cache: "no-store" })).json()); } catch { /* keep polling */ }
      }, 1000);
    };
    const reconnect = (delayMs: number) => {
      es?.close();
      startPoll();
      if (reopen) clearTimeout(reopen);
      reopen = setTimeout(open, delayMs);
    };
    const open = () => {
      if (!alive) return;
      lastHeard = Date.now();
      es = new EventSource("/api/simustay/stream");
      es.onmessage = (e) => {
        lastHeard = Date.now();
        try { accept(JSON.parse(e.data)); } catch { /* ignore a torn frame */ }
        stopPoll();
      };
      es.addEventListener("ping", () => { lastHeard = Date.now(); });
      es.onerror = () => reconnect(2000);
    };
    // The server sends a heartbeat every 5 s. Silence means a dead or half-open connection (server restart,
    // laptop sleep, Wi-Fi drop) that the browser may never report as an error, so reconnect ourselves.
    watchdog = setInterval(() => { if (Date.now() - lastHeard > 12_000) reconnect(0); }, 3000);
    fetch("/api/simustay/state", { cache: "no-store" }).then((r) => r.json()).then(accept).catch(() => startPoll());
    open();
    return () => {
      alive = false;
      es?.close();
      stopPoll();
      if (reopen) clearTimeout(reopen);
      if (watchdog) clearInterval(watchdog);
    };
  }, []);
  return state;
}

// Routes never throw to the client; they return { ok, gate?, state }.
export async function act(path: string, payload?: unknown): Promise<ActResult> {
  try {
    const res = await fetch(`/api/simustay/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload ?? {}),
    });
    const out = (await res.json()) as ActResult;
    if (!out.ok && out.error) toast(out.error, "warn");
    return out;
  } catch (e) {
    toast("კავშირი სერვერთან დროებით შეწყდა · Server unreachable, retrying", "warn");
    return { ok: false, error: String(e) };
  }
}

export async function upload(path: string, form: FormData): Promise<ActResult> {
  try {
    const res = await fetch(`/api/simustay/${path}`, { method: "POST", body: form });
    const out = (await res.json()) as ActResult;
    if (!out.ok && out.error) toast(out.error, "warn");
    return out;
  } catch (e) {
    toast("კავშირი სერვერთან დროებით შეწყდა · Server unreachable", "warn");
    return { ok: false, error: String(e) };
  }
}

// ---- toasts -----------------------------------------------------------------------

export type ToastKind = "info" | "ok" | "warn";
export interface Toast { id: number; text: string; kind: ToastKind }

let toasts: Toast[] = [];
let nextToast = 1;
const toastListeners = new Set<() => void>();
const emitToasts = () => toastListeners.forEach((l) => l());

export function toast(text: string, kind: ToastKind = "info") {
  const id = nextToast++;
  toasts = [...toasts.slice(-3), { id, text, kind }];
  emitToasts();
  setTimeout(() => { toasts = toasts.filter((t) => t.id !== id); emitToasts(); }, 3600);
}

const EMPTY: Toast[] = [];
export function useToasts(): Toast[] {
  return useSyncExternalStore(
    (l) => { toastListeners.add(l); return () => { toastListeners.delete(l); }; },
    () => toasts,
    () => EMPTY,
  );
}

// ---- presenter hotkeys (Ctrl+Shift+…) ---------------------------------------------

export type HotkeyMap = Partial<Record<string, () => void>>;

const PRESENTER_KEYS = new Set(["R", "B", "O", "L", "A", "P", "1", "2"]);
const HOTKEY_MESSAGE = "simstay-hotkey";

// When a page runs embedded (the phone iframe inside the desktop), key presses land in the iframe and never
// reach the desktop. The embedded page therefore forwards every presenter hotkey to its parent instead of
// handling it, so each key press triggers exactly one action (and never a browser shortcut such as tab search).
export function usePresenterHotkeys(map: HotkeyMap) {
  const ref = useRef(map);
  ref.current = map;
  useEffect(() => {
    const embedded = window.parent !== window;
    const onKey = (e: KeyboardEvent) => {
      if (!e.ctrlKey || !e.shiftKey || e.altKey || e.metaKey) return;
      const key = e.code.startsWith("Key") ? e.code.slice(3) : e.code.startsWith("Digit") ? e.code.slice(5) : "";
      if (!PRESENTER_KEYS.has(key)) return;
      e.preventDefault();
      e.stopPropagation();
      if (embedded) {
        window.parent.postMessage({ type: HOTKEY_MESSAGE, key }, window.location.origin);
        return;
      }
      ref.current[key]?.();
    };
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as { type?: string; key?: string } | null;
      if (data?.type !== HOTKEY_MESSAGE || typeof data.key !== "string" || !PRESENTER_KEYS.has(data.key)) return;
      ref.current[data.key]?.();
    };
    window.addEventListener("keydown", onKey, { capture: true });
    if (!embedded) window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("keydown", onKey, { capture: true });
      window.removeEventListener("message", onMessage);
    };
  }, []);
}

export const sharedHotkeys = (): HotkeyMap => ({
  R: () => { void act("reset", { snapshot: "start" }).then((r) => r.ok && toast("↺ სრული გადატვირთვა · Full reset", "ok")); },
  B: () => { void act("reset", { snapshot: "before-checkout" }).then((r) => r.ok && toast("⏭ გასვლამდე მდგომარეობა · Jumped to before check-out", "ok")); },
  O: () => { void act("mode").then((r) => r.ok && r.state && toast(`რეჟიმი · Mode: ${r.state.mode}`, "info")); },
});

// ---- formatting -------------------------------------------------------------------

export const money = (n: number) => `${n.toFixed(2)} ₾`;

export const clock = (t: number) =>
  new Date(t).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

export const duration = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

// Tiny SVG "photo" for the stage path (autopilot and the phone's demo-photo button): no camera needed.
const DEMO_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="#e7e1d6"/>' +
  '<rect x="30" y="80" width="200" height="90" rx="8" fill="#fff" stroke="#cbd5e1"/><rect x="40" y="62" width="70" height="30" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>' +
  '<rect x="250" y="40" width="44" height="130" fill="#a3b18a"/><text x="20" y="30" font-family="sans-serif" font-size="16" fill="#334155">Unit ready - clean</text></svg>';
export const DEMO_PHOTO = `data:image/svg+xml;base64,${btoa(DEMO_SVG)}`;

// "ვილა 304", "კოტეჯი 12", "შალე 16" or "ოთახი 101", from the unit's type.
export function unitName(rooms: { number: string; type: string }[], roomNo: string): string {
  const type = rooms.find((r) => r.number === roomNo)?.type ?? "";
  const kind = type.includes("ვილა") ? "ვილა" : type.includes("კოტეჯი") ? "კოტეჯი" : type.includes("შალე") ? "შალე" : "ოთახი";
  return `${kind} ${roomNo}`;
}

// Chat display language (guest inspector toggle); per-viewer, not shared state.
export type ChatLang = "ka" | "en";
let chatLang: ChatLang = "ka";
const chatLangListeners = new Set<() => void>();
export function setChatLang(l: ChatLang) {
  chatLang = l;
  chatLangListeners.forEach((f) => f());
}
export function useChatLang(): ChatLang {
  return useSyncExternalStore(
    (l) => { chatLangListeners.add(l); return () => { chatLangListeners.delete(l); }; },
    () => chatLang,
    () => "ka" as ChatLang,
  );
}
