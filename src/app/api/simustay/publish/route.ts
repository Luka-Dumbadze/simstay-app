import { safe } from "@/lib/simustay/safe";
import { getStore, openShift } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = safe(() => {
  const state = getStore().commit((s) => {
    if (s.rules.length === 0) throw new Error("ჯერ ატვირთეთ წესების დოკუმენტი · Upload a rules document first");
    openShift(s);
  });
  const graded = state.rules.filter((r) => r.tier !== "D" && r.check).length;
  return { state, note: `სცენარების პაკეტი v1 გამოქვეყნდა: 3 სცენარი · ${graded} შეფასებადი წესი` };
});
