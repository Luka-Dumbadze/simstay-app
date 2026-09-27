import { body, safe } from "@/lib/simustay/safe";
import { getStore, uid } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = safe(async (req) => {
  const { onFile } = await body<{ onFile: boolean }>(req);
  const state = getStore().commit((s) => {
    if (s.checkedOut) throw new Error("ფოლიო უკვე დახურულია · Folio already closed");
    s.folio.letterOnFile = typeof onFile === "boolean" ? onFile : !s.folio.letterOnFile;
    s.chat.push({
      id: uid("m"),
      from: "system",
      text_ka: s.folio.letterOnFile ? "📎 კომპანიის წერილი მიმაგრებულია რეზერვაციაზე" : "⚠ კომპანიის წერილი რეზერვაციაში არ არის",
      text_en: s.folio.letterOnFile ? "Company letter attached to the reservation" : "No company letter on the reservation",
      t: Date.now(),
    });
  });
  return { state };
});
