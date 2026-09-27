import { body, safe } from "@/lib/simustay/safe";
import { getStore, uid } from "@/lib/simustay/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = safe(async (req) => {
  const { replyId } = await body<{ replyId: string }>(req);
  const state = getStore().commit((s) => {
    if (!s.published) throw new Error("ცვლა ჯერ არ დაწყებულა · Shift not started");
    const qr = s.quickReplies.find((q) => q.id === replyId);
    if (!qr) throw new Error("უცნობი პასუხი · Unknown reply");
    const now = Date.now();
    s.chat.push({ id: uid("m"), from: "agent", text_ka: qr.text_ka, text_en: qr.text_en, t: now });
    s.chat.push({ id: uid("m"), from: "guest", text_ka: qr.reply_ka, text_en: qr.reply_en, t: now + 1 });
    if (qr.effect === "letter" && !s.folio.letterOnFile) {
      s.folio.letterOnFile = true;
      s.chat.push({ id: uid("m"), from: "system", text_ka: "📎 კომპანიის წერილი მიმაგრებულია რეზერვაციაზე", text_en: "Company letter attached to the reservation", t: now + 2 });
    }
    if (!s.usedReplies.includes(qr.id)) s.usedReplies.push(qr.id);
  });
  return { state };
});
