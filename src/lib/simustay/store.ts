// In-memory state singleton with snapshots and an event bus (spec §4.3).
import ambassadoriStart from "@/lib/simustay/fixtures/snapshots/ambassadori/start.json";
import ambassadoriBefore from "@/lib/simustay/fixtures/snapshots/ambassadori/before-checkout.json";
import bioliStart from "@/lib/simustay/fixtures/snapshots/bioli/start.json";
import bioliBefore from "@/lib/simustay/fixtures/snapshots/bioli/before-checkout.json";
import { randomUUID } from "node:crypto";
import type { PropertyId, SimuState, UiState } from "./types";

type Listener = (s: SimuState) => void;
export type SnapshotId = "start" | "before-checkout";

export interface Store {
  state: SimuState;
  listeners: Set<Listener>;
  setMode(m: SimuState["mode"]): void;
  commit(mut: (s: SimuState) => void): SimuState;
  reset(snapshot?: SnapshotId): SimuState;
  switchProperty(id: PropertyId): SimuState;
  subscribe(l: Listener): () => void;
}

declare global {
  // eslint-disable-next-line no-var
  var __simustay: Store | undefined;
}

const SNAPSHOTS: Record<PropertyId, Record<SnapshotId, SimuState>> = {
  ambassadori: { start: ambassadoriStart as unknown as SimuState, "before-checkout": ambassadoriBefore as unknown as SimuState },
  bioli: { start: bioliStart as unknown as SimuState, "before-checkout": bioliBefore as unknown as SimuState },
};

// Window rules live in ./windows.ts (pure, unit-tested); re-exported for existing importers.
export { DEMO_QUARTET } from "./windows";

const clone = <T,>(v: T): T => structuredClone(v);

// Snapshots carry t=0 timestamps; stamp them with "now" so clocks and logs read naturally.
function hydrate(snapshot: SimuState): SimuState {
  const s = clone(snapshot);
  const now = Date.now();
  s.rooms.forEach((r) => { if (!r.updatedAt) r.updatedAt = now; });
  s.tasks.forEach((t) => { if (!t.createdAt) t.createdAt = now; });
  s.chat.forEach((m) => { if (!m.t) m.t = now; });
  s.adapterLog.forEach((l) => { if (!l.t) l.t = now; });
  s.gateLog.forEach((g) => { if (!g.at) g.at = now; });
  if (s.ingest && !s.ingest.at) s.ingest.at = now;
  return s;
}

function notify(store: Store, s: SimuState) {
  store.listeners.forEach((l) => {
    try { l(s); } catch { store.listeners.delete(l); } // a dead client never breaks a commit
  });
}

// Snapshots carry only the open/focus fields; fill the bookkeeping fields for a fresh process.
function normalizeUi(ui: Partial<UiState> | undefined): UiState {
  return {
    openWindows: { ...(ui?.openWindows ?? {}) } as UiState["openWindows"],
    focusedWindow: ui?.focusedWindow ?? null,
    rev: ui?.rev ?? 0,
    writer: ui?.writer ?? null,
    seqByClient: { ...(ui?.seqByClient ?? {}) },
  };
}

function create(): Store {
  const initial = hydrate(SNAPSHOTS.ambassadori.start);
  initial.bootId = randomUUID();
  initial.ui = normalizeUi(initial.ui);
  initial.mode = process.env.OFFLINE_DEMO === "true" ? "offline" : "online";
  // Mode, the app matrix and open windows are the presenter's desk, not demo data: they survive resets.
  const load = (snapshot: SimuState): SimuState => {
    const s = hydrate(snapshot);
    s.bootId = store.state.bootId;
    s.mode = store.state.mode;
    s.workspace = clone(store.state.workspace);
    s.ui = clone(store.state.ui);
    s.version = store.state.version + 1;
    store.state = s;
    notify(store, s);
    return s;
  };
  const store: Store = {
    state: initial,
    listeners: new Set(),
    setMode(m) {
      store.commit((s) => { s.mode = m; });
    },
    commit(mut) {
      const next = clone(store.state);
      mut(next); // may throw: the state is then left untouched
      next.version = store.state.version + 1;
      store.state = next;
      notify(store, next);
      return next;
    },
    reset(snapshot = "start") {
      const pack = SNAPSHOTS[store.state.property.id] ?? SNAPSHOTS.ambassadori;
      return load(pack[snapshot] ?? pack.start);
    },
    switchProperty(id) {
      return load(SNAPSHOTS[id].start);
    },
    subscribe(l) {
      store.listeners.add(l);
      return () => { store.listeners.delete(l); };
    },
  };
  return store;
}

// globalThis guarantees ONE instance across all route bundles in `next start`
export const getStore = (): Store => (globalThis.__simustay ??= create());

export const pushLog = (s: SimuState, line: string) => {
  s.adapterLog.push({ t: Date.now(), line });
  if (s.adapterLog.length > 60) s.adapterLog.splice(0, s.adapterLog.length - 60);
};

let seq = 0;
export const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(seq++).toString(36)}`;
