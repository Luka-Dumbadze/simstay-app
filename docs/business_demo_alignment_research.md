# SimStay Demo Realignment Blueprint: From Operating System Tour to a 60-Second Business Story

**Goal:** make the live screen tell exactly the founder's pitch:

> Trainee practises front desk on an Opera-style PMS → a guest writes on WhatsApp → the SimStay Coach stops a mistake and teaches the correct move → a certified, Day-1-ready candidate is offered to the hotel.

**Audience:** hotel General Managers and GITA / investor judges. Not software developers.

**Date:** 2026-09-27.

**Inputs:**
- the current codebase;
- `prototype_spec_and_demo_architecture.md` (`PS`);
- `commercialization_dossier.md` (`CD`), for claim checking.

---

## 0. Summary

| Question | Answer |
|---|---|
| What is wrong today? | The screen tells an *operating-system* story: rule ingestion, a 40-room board with integration logs, housekeeping, agent drawers. The pitch tells a *people* story: a trainee learns, gets corrected and gets hired. A judge sees eight things moving and cannot tell which one is the product |
| What to build | A third view, **Pitch mode** (next to Launchpad and Workspace), showing only two panels (WhatsApp guest + Opera-style folio), a large **Coach** banner and a final **Certified candidate** card. Everything else stays in the app for Q&A |
| Can we reuse the code? | Yes. The folio (`PmsWindow`), the WhatsApp chat (`CommsWindow`), the rule check (`grader.ts`) and the scenario data already do the work. Pitch mode is a new *frame* around them plus three small new display pieces (Coach banner, highlight, certificate card) |
| Time | About **2 hours** of focused work (§4), plus rehearsal |
| Claims to fix before stage | Four pitch lines currently over-claim or contradict SimStay's own commercial plan (§1.3). Fix the words, not the product |

---

## 1. Story vs. Screen: The Disconnect Audit

### 1.1 What a GM sees today, and what they conclude

| On screen now | What a non-technical judge thinks | Keep in the pitch? |
|---|---|---|
| **Rule Studio**: PDF drop zone, rule cards tagged H/P/D, page numbers | "A document tool?" The letters H/P/D mean nothing to them | **Hide.** Mention in one sentence ("SimStay read the hotel's own rulebook"); show it in Q&A |
| **Live PMS Board**: 40 coloured room tiles | Busy but understandable | **Hide** in the 60-second story; Q&A only |
| **Adapter log**: `PATCH resources/update {"Id":"304","State":"Clean"} → 200 (mock)` | Code. Signals "developer demo". The word *mock* invites "so it's fake?" | **Hide**, always, in pitch mode |
| Impact counters: "interventions avoided", "est. 6 min / intervention", turnaround timer | Too many numbers, unclear meaning | **Replace** with one manager card at the end (§2.3) |
| **Housekeeping phone** (iframe) | A second product; splits attention | **Hide.** It belongs to a different story (room turnaround) |
| **Agent avatars and drawers** (ირ, GR, RX, HK) | Initials in circles; unclear | **Hide** |
| Dock with 8 app icons, Launchpad, top bar (profiles, offline chip, clock) | "An OS": impressive but off-message | **Hide** in pitch mode |
| **Folio** (Opera-style, 4 windows W1–W4, codes VILLA/GOLF/WINE/REST, "→W1/→W2" buttons) | The right thing, but small (text is 11–16 px) and has empty W3/W4 boxes | **Spotlight**: only W1 (guest) and W2 (company), large type |
| **Grader bar**: red block "✗ H2: …(ამბასადორის წესდება, გვ. 2)" | The right moment, but it looks like an error message, sits at the bottom and is small | **Turn into the Coach banner**: large, friendly, with a "correct move" highlight |
| **WhatsApp chat** with guest Irakli (Bank of Georgia retreat) | Instantly relatable to any hotel person | **Spotlight** |
| **Autopilot** (Ctrl+Shift+A) | Plays the whole operational loop, including housekeeping and inspection, in 20 seconds. Fast and technical | **Re-script** as the 5-step pitch story (§3.4) |

### 1.2 What the existing code already gives us for free

| Pitch beat | Already working | File |
|---|---|---|
| Guest message on WhatsApp | Scripted guest Irakli Kapanadze: "…ვილისა და გოლფის საფასურს ბანკი იხდის" (the bank pays villa and golf). WhatsApp look and feel | `CommsWindow.tsx`, `scenario.ambassadori-villa.json` |
| Trainee works an Opera-style folio | Four-window split folio; charges Villa 450, Golf 180, Wine tasting 120, Restaurant 240 ₾ | `PmsWindow.tsx` (classic skin) |
| Mistake is caught before posting | Moving wine to the company window is blocked with the hotel's own rule and page | `grader.ts` → `folio/move` route |
| Balanced folio | W1 360.00 / W2 630.00, "დაბალანსებულია" (balanced) | `grader.ts` `gateFinish` |
| Scripted playback | Autopilot sequence runner (1.2-second spacing) | `DesktopShell.tsx` `runAutopilot` |
| Reset between rehearsals | Ctrl+Shift+R, under 1 second | `store.ts` |

**Nothing needed for the story is missing from the engine.** What is missing is *framing*: one focused screen, big type, a coach voice and a payoff card.

### 1.3 Claim check: say it so a judge cannot catch us out

| Pitch line today | Problem | Say instead |
|---|---|---|
| "Hotels pay **100% of the first month's salary** for a pre-trained hire" | Contradicts SimStay's own commercial plan. `CD` §2.2 sets a **600 GEL success fee (≈ 31–40% of one month's wage)**, paid only if the hire stays 30 days, and explicitly rejected even a 1,500 GEL placement fee as "exceeding realized hotel value". 100% of a ≈ 1,900 GEL wage is ≈ 3× the plan | "Hotels pay a **success fee only when the certified hire stays 30 days**, less than it costs them to replace a bad hire today" (`CD`: replacement cost 500–700 GEL) |
| "**82 supervisor hours saved**" | 82 hours is today's *baseline* of shadowing per front-desk hire (`CD` §3.1 cross-check), not a measured saving. The pilot target is 40–70% less, and it is unmeasured | "Today a new receptionist needs **up to 82 hours** of a senior colleague's time. SimStay's pilot goal: **cut that by half or more**" |
| "Training on **Opera**" / "Opera-certified" | Opera is Oracle's trademark. SimStay deliberately avoids any OPERA-branded credential (`CD` §0) and does not copy OPERA screens (`PS` §5.2) | "Practise on an **Opera-style** folio: the same split-billing logic used in Opera and other hotel systems" |
| "**AI Autopilot** corrects the trainee" | The *correction* is a rule check in code: instant, always identical, explainable. The *AI* part is reading the hotel's own rulebook and running the guest. Calling the checker "AI" invites "what if it hallucinates?" | "**SimStay Coach** checks every move against **your hotel's own rules** before anything is posted. It is never guessing" |
| "Certified Day-1 ready" (shown automatically) | Georgian data-protection law requires a **human to confirm** any automated assessment (`CD` §5.5) | Card says "**Exam passed** · certification confirmed by the hotel supervisor". Presenter: "the supervisor signs it off in one tap" |

---

## 2. The 60-Second Business Story (3 stages)

### 2.1 Screen layout: Pitch mode, 1920×1080

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  SimStay · Ambassadori Kachreti            ① Guest ──── ② Coach ──── ③ Certified     │  ← 40 px stepper
├───────────────────────────────┬──────────────────────────────────────────────────────┤
│  WhatsApp · Irakli Kapanadze  │  Front desk · Opera-style folio · Villa 304          │
│  (Bank of Georgia retreat)    │                                                      │
│                               │   Villa suite        450.00   [→ Guest] [→ Bank]     │
│  "Hello, I'm Irakli from the  │   Golf green fee     180.00   [→ Guest] [→ Bank]     │
│   Bank of Georgia retreat.    │   Wine tasting       120.00   [→ Guest] [→ Bank]     │
│   The bank pays the villa     │   Restaurant         240.00   [→ Guest] [→ Bank]     │
│   and golf."                  │                                                      │
│                               │   ┌ Guest card ──────┐   ┌ Bank of Georgia ─────┐    │
│  (≈ 34 px text)               │   │                  │   │                      │    │
│                               │   └──────────────────┘   └──────────────────────┘    │
├───────────────────────────────┴──────────────────────────────────────────────────────┤
│  COACH BANNER (appears on events; 56 px headline, 32 px detail)                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Rules for the pitch screen:**
- Only two folio windows: **Guest** and **Bank of Georgia**.
- Plain-language buttons ("→ Guest", "→ Bank"), not "→W1 / →W2".
- No codes (VILLA/GOLF), no logs, no dock, no sidebar, no clock.

### 2.2 Second-by-second script

| t (s) | Stage | Screen | Presenter does | Presenter says (≤ 15 words) |
|---|---|---|---|---|
| 0–5 | Setup | Pitch mode opens; stepper on **① Guest** | Presses **Ctrl+Shift+P** | "Meet Ana, a new receptionist. First shift, Ambassadori Kachreti." |
| 5–14 | ① Guest | WhatsApp bubble slides in: Irakli, Bank of Georgia: "the bank pays the villa and golf" | — | "A corporate guest writes on WhatsApp: the bank pays villa and golf." |
| 14–22 | ① Guest | Ana moves **Villa → Bank**, **Golf → Bank**; each line turns **green ✓** | Clicks, or presses → (auto-step) | "Ana splits the bill between the guest and the bank." |
| 22–34 | **② Coach** | Ana moves **Wine tasting → Bank**. The line shakes red. The **Coach banner** rises (red): **"Stop! Wine tasting stays with the guest."** Small line: *"Hotel rules, page 2."* The **→ Guest** button on the wine line **pulses green** | → | "A typical rookie mistake. SimStay stops it before it reaches the bill." |
| 34–42 | ② Coach | Banner turns green: **"Correct. Wine goes to the guest's card."** Wine and Restaurant move to Guest; totals show **Guest 360 · Bank 630 · Balanced ✓** | → | "The coach explains, using the hotel's own rules. Ana fixes it." |
| 42–52 | **③ Certified** | Stepper on **③**. The **Certified candidate card** slides over the folio (§2.3) | → | "Ana passes. The hotel gets a trained receptionist before day one." |
| 52–60 | ③ Certified | Card holds; bottom line: *"Supervisor confirms in one tap."* | Pause | "No shadowing weeks. Success fee only if she stays. That's SimStay." |

**Spare time:** 0 seconds. The presenter must not explain anything the screen does not show.

### 2.3 The payoff card: "Certified candidate"

| Line | Content | Source (computed, not typed) |
|---|---|---|
| Title | **✓ Exam passed: Front-desk folio & billing** | `gateFinish` ok |
| Candidate | **Ana** · trainee | Scenario |
| Hotel | Day-1 ready for **Ambassadori Kachreti** | Property |
| Accuracy | **Final folio 100% correct** · 1 mistake caught and corrected before posting | Grader: balanced + `errorsCaught` |
| Rules practised | Split billing · Wine and restaurant to guest · Company letter on file | `satisfiedRules` (H1, H2, H3, P1), plain-language titles |
| Time | Scenario completed in **0:38** | Timestamps |
| Supervisor time | *"Today: up to 82 h of shadowing per new receptionist. Pilot goal: half or less."* | `CD` §3.1 baseline; labelled as a goal |
| Footer | **Supervisor confirms certification ▢** (tap) | Human sign-off (law) |

**Honesty rule on the card:** the card never says "82 hours saved". It shows the measured facts from this session (1 mistake caught, 100% final accuracy, 38 seconds) and one clearly labelled industry baseline.

---

## 3. Simplification Architecture (reuse, don't rebuild)

### 3.1 One new view, not a new app

`DesktopShell` already switches between two views: **Launchpad** and **Workspace**. Add a third: **Pitch**.

| View | Audience | What renders |
|---|---|---|
| Launchpad | Product tour | App cards |
| Workspace | Q&A deep-dive, operations story | Draggable windows, board, phone, logs |
| **Pitch** *(new)* | The 60-second story | `PitchStage`: WhatsApp + folio + Coach banner + certificate card. **No** top bar, sidebar, dock, toasts, logs or drawers |

- **Entering Pitch mode** (Ctrl+Shift+P or a top-bar button) runs, silently: reset to start → load the hotel rules → publish. The guest message is on screen from second 0.
- **Leaving** (Esc or Ctrl+Shift+P) returns to the Launchpad with nothing changed. Q&A can then open the Workspace to show the board, housekeeping and rule ingestion.

### 3.2 Component reuse map

| Component | Reused as-is | Surgical addition |
|---|---|---|
| `PmsWindow.tsx` | Folio state, move logic, balance, drag-and-drop | A `pitch` prop that:<br>• shows only windows 1–2;<br>• relabels them "Guest" / "Bank of Georgia";<br>• hides the code column, the letter chip and the bottom grader bar;<br>• uses "→ Guest / → Bank" button text;<br>• adds a `highlight={{ chargeId, window }}` prop that pulses the correct button |
| `CommsWindow.tsx` | Chat bubbles, WhatsApp skin, scripted guest | A `pitch` prop that hides the quick-reply row and the "button-first, no voice" composer hint |
| `grader.ts` | Unchanged: it is the Coach's brain | — |
| Folio routes (`folio/move`, `folio/finish`) | Unchanged | — |
| `runAutopilot` | Its runner pattern | A new 5-step **pitch script** (§3.4); the existing full autopilot stays for the Workspace |
| **New:** `pitch/PitchStage.tsx` | — | Layout, stepper, font scaling |
| **New:** `pitch/CoachBanner.tsx` | Reads the last grader event from `state.gateLog` | Red "Stop!" / green "Correct" banner with the rule in plain words |
| **New:** `pitch/CertificateCard.tsx` | Reads `state.metrics`, `gateLog`, `satisfiedRules` | The payoff card (§2.3) |

### 3.3 Readable from 10 metres

**Sizing basis [assumption]:** a ≈ 3 m wide projected image at 1920 px gives ≈ 1.6 mm per pixel. Comfortable reading at 10 m needs letters ≈ 5 cm tall, roughly **40–45 px** of font size. So:

| Element | Minimum size | Today |
|---|---|---|
| Coach headline ("Stop! Wine tasting stays with the guest.") | **56 px**, bold | 16 px |
| Coach detail ("Hotel rules, page 2") | 32 px | 13 px |
| Folio line items and amounts | **36 px** | 14 px |
| Buttons "→ Guest / → Bank" | 32 px, ≥ 64 px tall | 12 px |
| WhatsApp bubble text | 34 px | 15 px |
| Stepper labels | 28 px | — |
| Certificate title / key figures | 64 px / 44 px | — |
| **Anything** | **never below 24 px** | 11 px exists today |

**Implementation:**
- `PitchStage` renders the existing components inside a container with CSS `zoom: 2.2` (Chrome, the stage browser, supports it). Existing 14–16 px text becomes ≈ 31–35 px with no restyling.
- New elements are sized directly in px from the table.

**Colour and motion:**
- **Red** means *stopped before posting*, never "system error"; the banner uses a friendly tone ("Stop! Let me show you").
- **Green** means correct.
- One motion at a time: banner slides up in 300 ms; the highlighted button pulses 3 times.
- No other animation during the coach moment.

**Language:**
- Coach headline in **Georgian first, English beneath** (both ≥ 32 px). The GITA and hotel jury read Georgian.
- Amounts in ₾.

### 3.4 The pitch "Autopilot": step-by-step, presenter-paced

The current autopilot fires every 1.2 seconds and runs housekeeping too. For the pitch, replace it with **five presenter-paced steps**: the → key or clicker advances; Ctrl+Shift+A runs them automatically at 6-second spacing. Every step calls the *same* existing endpoints:

| Step | Existing call | Screen result |
|---|---|---|
| 0 (on entry) | `reset` → `ingest` → `publish` | Guest message visible; folio empty |
| 1 | `folio/move` villa → 2; golf → 2 | Two green ticks |
| 2 | `folio/move` wine → 2 | Blocked by rule H2 → **Coach banner red**, wine's "→ Guest" highlighted |
| 3 | `folio/move` wine → 1; restaurant → 1 | Coach banner green; "Balanced ✓" |
| 4 | `folio/finish` | Certificate card |

Because every step runs the real rule check, the presenter can also **click the wrong button live**, or let a judge click it, and the Coach reacts the same way. That is the strongest possible answer to "is this real?".

---

## 4. Implementation Plan: the Next 2 Hours

| # | Time | Task | Files | Done when |
|---|---|---|---|---|
| 1 | 0:00–0:15 | Add view `"pitch"`: hide `TopNav`, `SidebarDock`, `BottomDock`, `Toasts` and windows when active. Hotkey **P** added to the presenter keys; Esc exits | `DesktopShell.tsx`, `lib/simustay/client.ts` (`PRESENTER_KEYS` += `"P"`) | Ctrl+Shift+P shows a blank dark stage; Esc returns |
| 2 | 0:15–0:40 | `PitchStage.tsx`: two-column grid (WhatsApp 36% / folio 64%), stepper, bottom banner slot, `zoom: 2.2` wrapper. Entry sequence: reset → ingest → publish | new `components/pitch/PitchStage.tsx` | Guest message and folio readable from the back of a room |
| 3 | 0:40–1:00 | `pitch` props: `PmsWindow` (windows 1–2 only, "Guest"/"Bank of Georgia" labels, hide code column, letter chip and grader bar, plain button text, `highlight` pulse); `CommsWindow` (hide quick replies and composer hint) | `PmsWindow.tsx`, `CommsWindow.tsx` | Workspace unchanged; pitch shows the simplified folio |
| 4 | 1:00–1:20 | `CoachBanner.tsx`: watches the newest `gateLog` entry. On a block, red banner with the plain-language rule (Georgian + English) plus "Hotel rules, page N", and it sets `highlight` to the correct window. On a correct move after a block, green "Correct" banner for 4 s | new `components/pitch/CoachBanner.tsx` | Moving wine to Bank shows the red banner and pulses "→ Guest" |
| 5 | 1:20–1:35 | `CertificateCard.tsx` computed from state (§2.3), including the "Supervisor confirms ▢" toggle | new `components/pitch/CertificateCard.tsx` | Finishing the folio shows the card with 100% final accuracy, 1 caught mistake and the elapsed time |
| 6 | 1:35–1:45 | Pitch script: presenter-paced steps (→ key) + Ctrl+Shift+A auto-run at 6 s; the existing full autopilot stays for the Workspace | `PitchStage.tsx` | Five → presses tell the whole story |
| 7 | 1:45–2:00 | Verify: `npm test`, `npm run demo:check`, real-browser run at 1920×1080. **Phone test:** photograph the screen from 10 m (or view it at 25% size); every word must be legible | — | All green; legible |

**Suggested plain-language Coach texts** (from the existing rules; no rule changes needed):

| Rule | Red banner (ka / en) | Green banner (ka / en) |
|---|---|---|
| H2 wine tasting | "გაჩერდი! ღვინის დეგუსტაცია სტუმრის ანგარიშზე რჩება." / "Stop! Wine tasting stays with the guest." | "სწორია! ღვინო — სტუმრის ბარათზე." / "Correct. Wine goes on the guest's card." |
| H3 restaurant | "გაჩერდი! რესტორანი სტუმრის ანგარიშზეა." / "Stop! Restaurant stays with the guest." | "სწორია!" / "Correct." |
| H1 villa/golf | "ვილასა და გოლფს ბანკი იხდის." / "The bank pays villa and golf." | "სწორია!" / "Correct." |

**If time runs out (zero-code fallback, 5 minutes):**
1. Launchpad → PMS card.
2. Dock → Comms (two windows only).
3. Browser zoom 175%.
4. Present manually with the existing red grader bar as the "coach".

The payoff card is then a slide.

---

## 5. Rehearsal Checklist

| Check | Pass criterion |
|---|---|
| Timing | 5 run-throughs in 55–60 s each, stopwatch |
| Legibility | Photo from the back row: Coach headline and totals readable |
| Live-click robustness | A volunteer clicks a wrong button; the Coach reacts correctly |
| Reset | Ctrl+Shift+R, then Ctrl+Shift+P → clean start in < 2 s |
| Offline | Wi-Fi off; the story runs (all steps use local routes; rules come from the offline cache) |
| Words | The four claim fixes in §1.3 are in the script and slides |
| Q&A readiness | Esc → Workspace → Live workspace shows rule ingestion, the room board and housekeeping for "how does it scale?" |

---

## 6. What the Judges Should Remember

| They see | They conclude |
|---|---|
| A real guest message and a real-looking hotel bill | "This is our front desk." |
| A mistake stopped *before* it reaches the bill, citing the hotel's own rule | "This protects revenue and teaches at the same time." |
| A certificate with measured accuracy and a supervisor sign-off | "I can hire someone who is ready on day one, and pay only if it works." |
