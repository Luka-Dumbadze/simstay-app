import scenario from "@/lib/simustay/fixtures/scenario.checkin-204.json";
import { safe } from "@/lib/simustay/safe";
import { getStore, uid } from "@/lib/simustay/store";
import type { ChatMessage } from "@/lib/simustay/types";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = safe(() => {
  const state = getStore().commit((s) => {
    if (s.rules.length === 0) throw new Error("ჯერ ატვირთეთ წესების დოკუმენტი · Upload a rules document first");
    s.published = true;
    s.shiftTitle_ka = scenario.shiftTitle_ka;
    s.shiftTitle_en = scenario.shiftTitle_en;
    if (s.chat.length === 0) {
      const now = Date.now();
      if (s.folio.letterOnFile) {
        s.chat.push({ id: uid("m"), from: "system", text_ka: `📎 ${s.folio.company}: საგარანტიო წერილი მიღებულია (ელფოსტა)`, text_en: `${s.folio.company_en}: guarantee letter received (email)`, t: now });
      }
      for (const m of scenario.opening) s.chat.push({ id: uid("m"), ...(m as Omit<ChatMessage, "id" | "t">), t: now });
    }
  });
  const graded = state.rules.filter((r) => r.tier !== "D").length;
  return { state, note: `სცენარების პაკეტი v1 გამოქვეყნდა: 3 სცენარი · ${graded} შეფასებადი წესი` };
});
