"use client";

import { useEffect, useRef } from "react";
import { CheckCheck, MoreVertical, Paperclip, Phone, Search, SendHorizontal, Smile } from "lucide-react";
import { act, useChatLang, type ChatLang } from "@/lib/simustay/client";
import type { ChatMessage, CommsSkin, SimuState } from "@/lib/simustay/types";

interface Theme {
  header: string;
  headerText: string;
  body: string;
  inBubble: string;
  outBubble: string;
  outMeta: string;
  system: string;
  chip: string;
  composer: string;
  send: string;
  avatar: string;
}

const THEMES: Record<CommsSkin, Theme> = {
  whatsapp: {
    header: "bg-[#008069]",
    headerText: "text-white",
    body: "chat-wa",
    inBubble: "bg-white text-[#111b21] rounded-lg rounded-tl-none",
    outBubble: "bg-[#d9fdd3] text-[#111b21] rounded-lg rounded-tr-none",
    outMeta: "text-[#53bdeb]",
    system: "bg-[#ffeecd] text-[#54656f]",
    chip: "border border-[#008069]/40 bg-white text-[#008069] hover:bg-[#e7f6f2]",
    composer: "bg-[#f0f2f5]",
    send: "bg-[#00a884]",
    avatar: "bg-[#dfe5e7] text-[#54656f]",
  },
  telegram: {
    header: "bg-[#517da2]",
    headerText: "text-white",
    body: "chat-tg",
    inBubble: "bg-white text-black rounded-2xl rounded-bl-md",
    outBubble: "bg-[#effdde] text-black rounded-2xl rounded-br-md",
    outMeta: "text-[#4fae4e]",
    system: "bg-black/25 text-white",
    chip: "border border-white/60 bg-white/85 text-[#3a6d99] hover:bg-white",
    composer: "bg-white",
    send: "bg-[#3390ec]",
    avatar: "bg-gradient-to-br from-[#ff885e] to-[#ff516a] text-white",
  },
};

const hhmm = (t: number) => new Date(t).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export default function CommsWindow({ state }: { state: SimuState }) {
  const skin = state.workspace.skins.comms;
  const th = THEMES[skin];
  const scroller = useRef<HTMLDivElement>(null);
  const lang = useChatLang();

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [state.chat.length]);

  const available = state.quickReplies.filter((q) => !state.usedReplies.includes(q.id));

  return (
    <div className="flex h-full flex-col">
      <div className={`flex shrink-0 items-center gap-3 px-3 py-2 ${th.header} ${th.headerText}`}>
        <div className={`grid h-9 w-9 place-items-center rounded-full text-sm font-semibold ${th.avatar}`}>{state.folio.guest.split(/\s+/).map((p) => p[0]).join("").slice(0, 2)}</div>
        <div className="min-w-0 leading-tight">
          <div className="truncate font-semibold">{state.folio.guest} · {state.folio.company_en}</div>
          <div className="text-[12px] opacity-80">{state.published ? (skin === "whatsapp" ? "ონლაინ" : "ახლახან იყო") : "ცვლა ჯერ არ დაწყებულა"}</div>
        </div>
        <div className="ml-auto flex items-center gap-3 opacity-90">
          {skin === "whatsapp" ? <Phone className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          <MoreVertical className="h-4 w-4" />
        </div>
      </div>

      <div ref={scroller} className={`scroll-thin min-h-0 flex-1 space-y-1.5 overflow-y-auto px-3 py-3 ${th.body}`}>
        {state.chat.length === 0 && (
          <div className="mx-auto mt-6 w-fit rounded-lg bg-white/80 px-3 py-1.5 text-center text-[13px] text-slate-600">
            სტუმარი გამოჩნდება წესების გამოქვეყნების შემდეგ
          </div>
        )}
        {state.chat.map((m) => <Bubble key={m.id} m={m} th={th} lang={lang} />)}
      </div>

      {state.published && available.length > 0 && (
        <div className={`scroll-thin flex shrink-0 gap-1.5 overflow-x-auto px-2 pb-1 pt-2 ${th.composer}`}>
          {available.map((q) => (
            <button
              key={q.id}
              data-testid={`reply-${q.id}`}
              onClick={() => void act("chat/reply", { replyId: q.id })}
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[14px] font-medium transition ${th.chip}`}
              title={q.text_en}
            >
              {q.text_ka}
            </button>
          ))}
        </div>
      )}
      <div className={`flex shrink-0 items-center gap-2 px-2 py-2 ${th.composer}`}>
        <Smile className="h-5 w-5 text-slate-500" />
        <Paperclip className="h-5 w-5 text-slate-500" />
        <div className="flex-1 rounded-full bg-white px-3 py-1.5 text-[13px] text-slate-400 ring-1 ring-black/5">
          აირჩიეთ სწრაფი პასუხი · button-first, no voice
        </div>
        <span className={`grid h-9 w-9 place-items-center rounded-full text-white ${th.send}`}>
          <SendHorizontal className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

function Bubble({ m, th, lang }: { m: ChatMessage; th: Theme; lang: ChatLang }) {
  const [main, sub] = lang === "ka" ? [m.text_ka, m.text_en] : [m.text_en, m.text_ka];
  if (m.from === "system") {
    return <div className={`mx-auto w-fit max-w-[90%] animate-slide-up rounded-md px-2.5 py-1 text-center text-[12px] ${th.system}`}>{main}</div>;
  }
  const out = m.from === "agent";
  return (
    <div className={`flex animate-slide-up ${out ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[82%] px-2.5 py-1.5 shadow-sm ${out ? th.outBubble : th.inBubble}`}>
        <div className="text-[15px] leading-snug">{main}</div>
        <div className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-black/45">
          <span className="mr-auto pr-3 italic">{sub}</span>
          <span suppressHydrationWarning>{hhmm(m.t)}</span>
          {out && <CheckCheck className={`h-3.5 w-3.5 ${th.outMeta}`} />}
        </div>
      </div>
    </div>
  );
}
