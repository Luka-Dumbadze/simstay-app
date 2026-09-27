// Window state machine, shared by the server route and the unit tests. Pure: no I/O, no clock.
import type { AppId, UiState } from "./types.ts";

export const ALL_WINDOWS: AppId[] = ["ingest", "pms", "comms", "phone", "board", "agents", "ops", "store"];

// The core demo quartet opened by "Live workspace" and by autopilot ("desk" is the PMS folio window).
export const DEMO_QUARTET: AppId[] = ["ingest", "pms", "board", "phone"];

export type WindowAction =
  | { action: "open"; id: AppId }    // add one window (others unchanged) and focus it
  | { action: "solo"; id: AppId }    // launch from the Launchpad: exactly this window, every other one closed
  | { action: "close"; id: AppId }   // the X button: closed until deliberately reopened
  | { action: "focus"; id: AppId }   // focus an already-open window; never opens one
  | { action: "preset" }             // "Live workspace": exactly the demo quartet
  | { action: "sync"; openWindows: Partial<Record<AppId, boolean>>; focusedWindow: AppId | null };

type WindowSet = Pick<UiState, "openWindows" | "focusedWindow">;

export function applyWindowAction(ui: WindowSet, a: WindowAction): WindowSet {
  const open = { ...ui.openWindows };
  let focused = ui.focusedWindow;
  switch (a.action) {
    case "open":
      open[a.id] = true;
      focused = a.id;
      break;
    case "solo":
      for (const w of ALL_WINDOWS) open[w] = w === a.id;
      focused = a.id;
      break;
    case "close":
      open[a.id] = false;
      if (focused === a.id) focused = null;
      break;
    case "focus":
      if (open[a.id]) focused = a.id;
      break;
    case "preset":
      for (const w of ALL_WINDOWS) open[w] = DEMO_QUARTET.includes(w);
      focused = "pms";
      break;
    case "sync":
      for (const w of ALL_WINDOWS) open[w] = a.openWindows[w] === true;
      focused = a.focusedWindow && open[a.focusedWindow] ? a.focusedWindow : null;
      break;
  }
  return { openWindows: open, focusedWindow: focused };
}

export const openIdsOf = (ui: WindowSet): AppId[] => ALL_WINDOWS.filter((w) => ui.openWindows[w]);
