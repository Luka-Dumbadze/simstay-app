"use client";

import { LayoutDashboard } from "lucide-react";
import { APPS } from "./appRegistry";
import type { AppId } from "@/lib/simustay/types";

// Centered floating pill with quick-launch icons; the first button returns to the launchpad.
export default function BottomDock(props: {
  installed: AppId[];
  openIds: Set<AppId>;
  view: "launchpad" | "workspace";
  onLaunchpad: () => void;
  onApp: (id: AppId) => void;
}) {
  return (
    <nav
      data-testid="bottom-dock"
      className="fixed bottom-6 left-1/2 z-[9100] flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-os-panel/90 px-4 py-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,.8)] backdrop-blur-md"
    >
      <button
        onClick={props.onLaunchpad}
        title="Launchpad (Ctrl+Shift+L)"
        aria-label="Launchpad"
        className={`grid h-11 w-11 place-items-center rounded-full transition ${props.view === "launchpad" ? "bg-white text-[#0B0C0E]" : "bg-white/5 text-os-ink hover:bg-white/10"}`}
      >
        <LayoutDashboard className="h-5 w-5" />
      </button>
      <span className="h-7 w-px bg-white/10" />
      {props.installed.map((id) => {
        const app = APPS[id];
        const Icon = app.icon;
        const active = props.view === "workspace" && props.openIds.has(id);
        return (
          <button key={id} data-testid={`dock-${id}`} onClick={() => props.onApp(id)} title={app.name} aria-label={app.name} className="group relative flex flex-col items-center">
            <span className="grid h-11 w-11 place-items-center rounded-full transition group-hover:-translate-y-1" style={{ background: app.badge }}>
              <Icon className="h-5 w-5" style={{ color: app.glyph }} />
            </span>
            <span className={`absolute -bottom-2 h-1 w-1 rounded-full ${active ? "bg-os-ink" : "bg-transparent"}`} />
          </button>
        );
      })}
    </nav>
  );
}
