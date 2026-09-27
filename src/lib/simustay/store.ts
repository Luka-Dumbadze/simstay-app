// In-memory state singleton with snapshots and an event bus (spec §4.3).
import start from "@/lib/simustay/fixtures/snapshots/start.json";
import beforeCheckout from "@/lib/simustay/fixtures/snapshots/before-checkout.json";
import type { SimuState } from "./types";

type Listener = (s: SimuState) => void;
export type SnapshotId = "start" | "before-checkout";

export interface Store {
  state: SimuState;
  listeners: Set<Listener>;
  setMode(m: SimuState["mode"]): void;
  commit(mut: (s: SimuState) => void): SimuState;
  reset(snapshot?: SnapshotId): SimuState;
  subscribe(l: Listener): () => void;
}

declare global {
  // eslint-disable-next-line no-var
  var __simustay: Store | undefined;
}

const SNAPSHOTS: Record<SnapshotId, SimuState> = {
  start: start as unknown as SimuState,
  "before-checkout": beforeCheckout as unknown as SimuState,
};

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

function create(): Store {
  const initial = hydrate(SNAPSHOTS.start);
  initial.mode = process.env.OFFLINE_DEMO === "true" ? "offline" : "online";
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
      const s = hydrate(SNAPSHOTS[snapshot] ?? SNAPSHOTS.start);
      s.mode = store.state.mode;
      s.workspace = clone(store.state.workspace); // the hotel's app matrix survives a demo reset
      s.version = store.state.version + 1;
      store.state = s;
      notify(store, s);
      return s;
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
