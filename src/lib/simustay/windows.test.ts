// Window state machine. Run with `npm test`.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ALL_WINDOWS, DEMO_QUARTET, applyWindowAction, openIdsOf } from "./windows.ts";
import type { AppId } from "./types.ts";

const none = () => ({ openWindows: Object.fromEntries(ALL_WINDOWS.map((w) => [w, false])) as Record<AppId, boolean>, focusedWindow: null as AppId | null });
const quartetOpen = () => applyWindowAction(none(), { action: "preset" });

describe("window state machine", () => {
  it("a Launchpad card (solo) opens exactly one window, even when the demo quartet was open", () => {
    const s = applyWindowAction(quartetOpen(), { action: "solo", id: "pms" });
    assert.deepEqual(openIdsOf(s), ["pms"]);
    assert.equal(s.focusedWindow, "pms");
  });
  it("solo never resurrects windows that were closed with X", () => {
    let s = quartetOpen();
    s = applyWindowAction(s, { action: "close", id: "board" });
    s = applyWindowAction(s, { action: "solo", id: "comms" });
    assert.deepEqual(openIdsOf(s), ["comms"]);
  });
  it("only the preset produces the four-window demo layout", () => {
    assert.deepEqual(openIdsOf(quartetOpen()).sort(), [...DEMO_QUARTET].sort());
    for (const id of ALL_WINDOWS) {
      assert.equal(openIdsOf(applyWindowAction(none(), { action: "solo", id })).length, 1, id);
      assert.equal(openIdsOf(applyWindowAction(none(), { action: "open", id })).length, 1, id);
    }
  });
  it("open (inside the workspace) adds one window and leaves the others untouched", () => {
    let s = applyWindowAction(none(), { action: "solo", id: "pms" });
    s = applyWindowAction(s, { action: "open", id: "comms" });
    assert.deepEqual(openIdsOf(s), ["pms", "comms"]);
    assert.equal(s.focusedWindow, "comms");
  });
  it("closing keeps the window closed; focus never reopens it", () => {
    let s = applyWindowAction(quartetOpen(), { action: "close", id: "comms" });
    s = applyWindowAction(s, { action: "focus", id: "comms" });
    assert.equal(s.openWindows.comms, false);
    assert.notEqual(s.focusedWindow, "comms");
  });
  it("closing the focused window clears focus", () => {
    const s = applyWindowAction(quartetOpen(), { action: "close", id: "pms" });
    assert.equal(s.focusedWindow, null);
  });
});
