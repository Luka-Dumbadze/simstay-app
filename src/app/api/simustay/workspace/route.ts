import { APP_IDS, findProfile } from "@/lib/simustay/profiles";
import { body, safe } from "@/lib/simustay/safe";
import { getStore } from "@/lib/simustay/store";
import type { AppId, CommsSkin, PmsSkin } from "@/lib/simustay/types";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = safe(async (req) => {
  const b = await body<{ profileId: string; pmsSkin: PmsSkin; commsSkin: CommsSkin; installed_apps: AppId[] }>(req);
  const state = getStore().commit((s) => {
    if (b.profileId) {
      const p = findProfile(b.profileId);
      if (!p) throw new Error(`unknown profile ${b.profileId}`);
      s.workspace = { profileId: p.id, installed_apps: [...p.installed_apps], skins: { ...p.skins } };
    }
    if (b.pmsSkin === "classic" || b.pmsSkin === "modern") s.workspace.skins.pms = b.pmsSkin;
    if (b.commsSkin === "whatsapp" || b.commsSkin === "telegram") s.workspace.skins.comms = b.commsSkin;
    // The App Store itself can never be uninstalled, or apps could not be re-installed.
    if (Array.isArray(b.installed_apps)) s.workspace.installed_apps = APP_IDS.filter((id) => id === "store" || b.installed_apps!.includes(id));
  });
  return { state };
});
