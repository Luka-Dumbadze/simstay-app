import { APP_IDS, findProfile } from "@/lib/simustay/profiles";
import { body, safe } from "@/lib/simustay/safe";
import { getStore } from "@/lib/simustay/store";
import type { AppId, CommsSkin, PmsSkin } from "@/lib/simustay/types";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = safe(async (req) => {
  const b = await body<{ profileId: string; pmsSkin: PmsSkin; commsSkin: CommsSkin; installed_apps: AppId[]; install: string; uninstall: string }>(req);
  // One-click App Store actions (core apps and marketplace add-ons).
  if (b.install) return { state: getStore().installApp(b.install) };
  if (b.uninstall) {
    const store = getStore();
    store.uninstallApp(b.uninstall);
    // The Slack view belongs to the Slack add-on: removing it returns the chat to WhatsApp-style.
    if (b.uninstall === "slack" && store.state.workspace.skins.comms === "slack") store.commit((s) => { s.workspace.skins.comms = "whatsapp"; });
    return { state: store.state };
  }
  const state = getStore().commit((s) => {
    if (b.profileId) {
      const p = findProfile(b.profileId);
      if (!p) throw new Error(`unknown profile ${b.profileId}`);
      // A profile sets the core apps and skins; installed marketplace add-ons stay.
      s.workspace = { profileId: p.id, installed_apps: [...p.installed_apps], marketplace_apps: s.workspace.marketplace_apps, skins: { ...p.skins } };
    }
    if (b.pmsSkin === "classic" || b.pmsSkin === "modern") s.workspace.skins.pms = b.pmsSkin;
    if (b.commsSkin === "whatsapp" || b.commsSkin === "telegram") s.workspace.skins.comms = b.commsSkin;
    if (b.commsSkin === "slack") {
      if (!s.workspace.marketplace_apps?.includes("slack")) throw new Error("ჯერ დააინსტალირეთ Slack Workspace Hub · Install Slack Workspace Hub first");
      s.workspace.skins.comms = "slack";
    }
    // The App Store itself can never be uninstalled, or apps could not be re-installed.
    if (Array.isArray(b.installed_apps)) s.workspace.installed_apps = APP_IDS.filter((id) => id === "store" || b.installed_apps!.includes(id));
  });
  return { state };
});
