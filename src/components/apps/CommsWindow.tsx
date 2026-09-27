"use client";

import { useEffect, useRef } from "react";
import {
  AtSign, Bold, CheckCheck, ChevronDown, Hash, Headphones, Italic, Link2, MoreVertical, Paperclip, Phone, Plus, Search, Send, SendHorizontal, Smile,
} from "lucide-react";
import { act, useChatLang, type ChatLang } from "@/lib/simustay/client";
import { PROPERTIES } from "@/lib/simustay/properties";
import type { ChatMessage, CommsSkin, QuickReply, SimuState } from "@/lib/simustay/types";

// Quick-reply button text: the property's short chip label when it has one, else the full reply.
const chipLabel = (state: SimuState, q: QuickReply) => PROPERTIES[state.property.id]?.chat?.chips?.[q.id]?.text_ka ?? q.text_ka;

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

const THEMES: Record<Exclude<CommsSkin, "slack">, Theme> = {
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

// `pitch`: the Pitch mode chat. WhatsApp only, guest bubbles spotlit at projector size, no quick replies or composer.
export default function CommsWindow({ state, pitch = false }: { state: SimuState; pitch?: boolean }) {
  if (pitch) return <PitchChat state={state} />;
  if (state.workspace.skins.comms === "slack") return <SlackChat state={state} />;
  return <DeskChat state={state} />;
}

function DeskChat({ state }: { state: SimuState }) {
  const skin = state.workspace.skins.comms === "telegram" ? "telegram" : "whatsapp";
  const th = THEMES[skin];
  const scroller = useRef<HTMLDivElement>(null);
  const lang = useChatLang();

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [state.chat.length]);

  const available = state.quickReplies.filter((q) => !state.usedReplies.includes(q.id));
  const header = PROPERTIES[state.property.id]?.chat?.header;

  return (
    <div data-testid="comms" data-skin={skin} className="flex h-full flex-col">
      <div className={`flex shrink-0 items-center gap-3 px-3 py-2 ${th.header} ${th.headerText}`}>
        <div className={`grid h-9 w-9 place-items-center rounded-full text-sm font-semibold ${th.avatar}`}>{state.folio.guest.split(/\s+/).map((p) => p[0]).join("").slice(0, 2)}</div>
        <div className="min-w-0 leading-tight">
          <div data-testid="comms-guest" className="truncate font-semibold">{header ? header.title : `${state.folio.guest} · ${state.folio.company_en}`}</div>
          <div className="truncate text-[12px] opacity-80">{header && `${header.subtitle} · `}{state.published ? (skin === "whatsapp" ? "ონლაინ" : "ახლახან იყო") : "ცვლა ჯერ არ დაწყებულა"}</div>
        </div>
        <div className="ml-auto flex items-center gap-3 opacity-90">
          {state.workspace.marketplace_apps?.includes("slack") && (
            <button
              data-testid="comms-to-slack"
              onClick={() => void act("workspace", { commsSkin: "slack" })}
              title="Open this conversation in the team's Slack channel"
              className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[12px] font-medium hover:bg-white/30"
            >
              <Hash className="h-3.5 w-3.5" /> Slack
            </button>
          )}
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
              title={`${q.text_ka} · ${q.text_en}`}
            >
              {chipLabel(state, q)}
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
          {skin === "telegram" ? <Send className="h-4 w-4" /> : <SendHorizontal className="h-4 w-4" />}
        </span>
      </div>
    </div>
  );
}

function Bubble({ m, th, lang }: { m: ChatMessage; th: Theme; lang: ChatLang }) {
  const [main, sub] = lang === "ka" ? [m.text_ka, m.text_en] : [m.text_en, m.text_ka];
  if (m.from === "system") {
    return <div data-testid="chat-msg" data-from="system" className={`mx-auto w-fit max-w-[90%] animate-slide-up rounded-md px-2.5 py-1 text-center text-[12px] ${th.system}`}>{main}</div>;
  }
  const out = m.from === "agent";
  return (
    <div data-testid="chat-msg" data-from={m.from} className={`flex animate-slide-up ${out ? "justify-end" : "justify-start"}`}>
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

function PitchChat({ state }: { state: SimuState }) {
  const th = THEMES.whatsapp;
  const messages = state.chat.filter((m) => m.from !== "system");
  return (
    <div data-testid="pitch-chat" className="flex h-full flex-col overflow-hidden rounded-2xl shadow-2xl">
      <div className={`flex shrink-0 items-center gap-4 px-5 py-3 ${th.header} ${th.headerText}`}>
        <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-full text-[26px] font-semibold ${th.avatar}`}>
          {state.folio.guest_en.split(/\s+/).map((p) => p[0]).join("").slice(0, 2)}
        </div>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[30px] font-semibold">{state.folio.guest_en}</div>
          <div className="truncate text-[24px] opacity-85">{state.folio.company_en?.split("·")[0].trim()} · WhatsApp</div>
        </div>
      </div>
      <div className={`min-h-0 flex-1 space-y-4 overflow-hidden px-5 py-6 ${th.body}`}>
        {messages.length === 0 && (
          <div className="mx-auto mt-10 w-fit rounded-xl bg-white/85 px-5 py-3 text-center text-[26px] text-slate-600">…</div>
        )}
        {messages.map((m) => {
          const out = m.from === "agent";
          return (
            <div key={m.id} className={`flex animate-slide-up ${out ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[94%] px-5 py-4 shadow-md ${out ? th.outBubble : th.inBubble}`}>
                <div className="text-[34px] leading-snug">{m.text_ka}</div>
                <div className="mt-2 text-[24px] italic leading-snug text-black/55">{m.text_en}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Slack-style view (Slack Workspace Hub add-on) --------------------------------
// The same guest conversation as the team sees it: relayed into #guest-requests, answered by the front desk.

const SLACK = {
  sidebar: "#3F0E40",
  sidebarHover: "#350D36",
  active: "#1164A3",
  ink: "#1D1C1D",
  mute: "#616061",
  line: "#DDDDDD",
};

const slackTime = (t: number) => new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

function SlackChat({ state }: { state: SimuState }) {
  const scroller = useRef<HTMLDivElement>(null);
  const lang = useChatLang();
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [state.chat.length]);
  const available = state.quickReplies.filter((q) => !state.usedReplies.includes(q.id));
  const trainee = /Trainee:\s*([^\s·,]+)/.exec(state.shiftTitle_en)?.[1] ?? "Ana";
  const guest = state.folio.guest_en;
  const workspace = state.property.short.split(" ")[0];
  const channels = ["front-desk", "guest-requests", "housekeeping", "supervisors"];

  return (
    <div data-testid="slack-view" className="flex h-full bg-white text-[#1D1C1D]" style={{ fontFamily: "Lato, Inter, system-ui, sans-serif" }}>
      <aside className="flex w-[124px] shrink-0 flex-col text-[#CFC3CF]" style={{ background: SLACK.sidebar }}>
        <div className="flex items-center gap-1 border-b border-white/10 px-3 py-2.5 text-[15px] font-bold text-white">
          <span className="truncate">{workspace}</span> <ChevronDown className="h-3.5 w-3.5 shrink-0" />
        </div>
        <div className="scroll-thin flex-1 overflow-y-auto py-2 text-[13px]">
          <div className="px-3 pb-1 text-[12px] font-medium opacity-80">Channels</div>
          {channels.map((c) => {
            const on = c === "guest-requests";
            return (
              <div key={c} className="mx-1.5 flex items-center gap-1.5 rounded px-1.5 py-[3px]" style={on ? { background: SLACK.active, color: "#fff", fontWeight: 700 } : undefined}>
                <Hash className="h-3.5 w-3.5 shrink-0 opacity-80" /> <span className="truncate">{c}</span>
              </div>
            );
          })}
          <div className="px-3 pb-1 pt-3 text-[12px] font-medium opacity-80">Direct messages</div>
          {[`${trainee} (you)`, "Supervisor", "Housekeeping"].map((n, i) => (
            <div key={n} className="mx-1.5 flex items-center gap-1.5 rounded px-1.5 py-[3px]">
              <span className="relative grid h-4 w-4 shrink-0 place-items-center rounded bg-white/20 text-[9px] font-bold text-white">
                {n[0]}
                <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-[#3F0E40] ${i < 2 ? "bg-[#2BAC76]" : "bg-transparent"}`} />
              </span>
              <span className="truncate">{n}</span>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b px-3 py-2" style={{ borderColor: SLACK.line }}>
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-[15px] font-bold"><Hash className="h-4 w-4" /> guest-requests <ChevronDown className="h-3.5 w-3.5" /></div>
            <div className="truncate text-[12px]" style={{ color: SLACK.mute }} title={`${guest} · relayed from WhatsApp`}>{guest} · via WhatsApp</div>
          </div>
          <div className="ml-auto flex items-center gap-2" style={{ color: SLACK.mute }}>
            <Headphones className="h-4 w-4" />
            <button
              data-testid="slack-to-whatsapp"
              onClick={() => void act("workspace", { commsSkin: "whatsapp" })}
              title="Back to the guest's WhatsApp view"
              className="rounded border px-2 py-0.5 text-[12px] font-medium hover:bg-[#F8F8F8]"
              style={{ borderColor: SLACK.line, color: SLACK.ink }}
            >
              WhatsApp view
            </button>
          </div>
        </div>

        <div ref={scroller} className="scroll-thin min-h-0 flex-1 overflow-y-auto py-2">
          {state.chat.length === 0 && (
            <div className="px-4 pt-6 text-[13px]" style={{ color: SLACK.mute }}>
              This is the very beginning of <b style={{ color: SLACK.ink }}>#guest-requests</b>. Guest messages appear once the shift starts.
            </div>
          )}
          {state.chat.map((m) => {
            const [main, sub] = lang === "ka" ? [m.text_ka, m.text_en] : [m.text_en, m.text_ka];
            const who = m.from === "guest" ? guest : m.from === "agent" ? `${trainee} · Front desk` : "SimStay";
            const initials = m.from === "system" ? "S" : who.split(/\s+/).map((p) => p[0]).join("").slice(0, 2);
            const tone = m.from === "guest" ? "#2BAC76" : m.from === "agent" ? "#1164A3" : "#4A154B";
            return (
              <div key={m.id} className="flex animate-slide-up gap-2 px-4 py-1.5 hover:bg-[#F8F8F8]">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-[13px] font-bold text-white" style={{ background: tone }}>{initials}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-1.5">
                    <span className="text-[15px] font-black">{who}</span>
                    {m.from !== "agent" && <span className="rounded-sm bg-[#E8E8E8] px-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: SLACK.mute }}>{m.from === "guest" ? "WhatsApp" : "App"}</span>}
                    <span className="text-[12px]" style={{ color: SLACK.mute }} suppressHydrationWarning>{slackTime(m.t)}</span>
                  </div>
                  <div className="text-[15px] leading-snug">{main}</div>
                  <div className="text-[13px] italic leading-snug" style={{ color: SLACK.mute }}>{sub}</div>
                </div>
              </div>
            );
          })}
          {state.published && available.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-1 pl-[60px] pt-1">
              {available.map((q) => (
                <button
                  key={q.id}
                  data-testid={`reply-${q.id}`}
                  onClick={() => void act("chat/reply", { replyId: q.id })}
                  title={`${q.text_ka} · ${q.text_en}`}
                  className="rounded border bg-white px-2.5 py-1 text-[13px] font-bold hover:bg-[#F8F8F8]"
                  style={{ borderColor: "#BBBBBB", color: SLACK.ink }}
                >
                  {chipLabel(state, q)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 px-3 pb-3">
          <div className="rounded-lg border" style={{ borderColor: "#BBBBBB" }}>
            <div className="flex items-center gap-3 border-b px-2 py-1" style={{ borderColor: SLACK.line, color: SLACK.mute }}>
              <Bold className="h-3.5 w-3.5" /><Italic className="h-3.5 w-3.5" /><Link2 className="h-3.5 w-3.5" />
            </div>
            <div className="px-2 py-1.5 text-[13px]" style={{ color: SLACK.mute }}>Message #guest-requests · button-first replies above</div>
            <div className="flex items-center gap-2 px-2 pb-1.5" style={{ color: SLACK.mute }}>
              <Plus className="h-4 w-4" /><Smile className="h-4 w-4" /><AtSign className="h-4 w-4" />
              <span className="ml-auto grid h-6 w-7 place-items-center rounded" style={{ background: "#007A5A", color: "#fff" }}><SendHorizontal className="h-3.5 w-3.5" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
