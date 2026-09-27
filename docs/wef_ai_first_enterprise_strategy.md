# SimStay × The AI-First Operating System: Strategic Master Dossier

**Subject:** A full mapping of the World Economic Forum / Kearney white paper *The AI-First Operating System: A Blueprint for Operating and Business Model Innovation* (June 2026, 52 pp.) onto SimStay: its business model, operating model, frontline human-AI teaming, trust architecture and institutional positioning.

**Date:** 2026-09-27.

**Inputs (read-only):**
- the WEF white paper (`WEF`), cited by printed page number, e.g. **(WEF p.27)**;
- `problem.md` (`PR`);
- `commercialization_dossier.md` (`CD`);
- `prototype_spec_and_demo_architecture.md` (`PS`).

**Scope.** This is strategy, economics, organisational design and positioning. It is not a technical specification. Technology appears only where it changes a business decision.

---

## 0. How to Read This Dossier

### 0.1 Labels

| Label | Meaning |
|---|---|
| **(WEF p.N)** | Concept, figure, table, statistic or case study taken from the white paper, page N |
| **[D]** | Documented statistic from a named source (repo convention, `CD`/`PR`) |
| **[I]** | Our derivation or design proposal, with its logic shown |
| **[G]** | Unverified: needs pilot or field evidence |
| **Built** | Exists and runs in the current SimStay prototype (verified in this repository) |
| **Planned** | Specified here or in `PS`/`CD`, not yet built |
| **Hypothesis** | A strategic bet; the metric that would confirm it is named |

### 0.2 Corrections to the dispatch brief

The brief contained several claims that do not match the source. This dossier follows the source.

| # | The brief said | The source says | How this dossier handles it |
|---|---|---|---|
| 1 | Contextere shows why **button-first** mobile messaging beats chat | Contextere's interface is **voice-first**: a 47-minute information-gathering process replaced by near-instant context, troubleshooting time cut by up to 80% (WEF p.41) | The transferable principle is *task-to-modality* (WEF p.41, Table 8), not "buttons". SimStay is button-first because Georgian speech recognition is not yet usable (`PS` §0: Whisper ≈105% WER on Georgian, via the red-team audit). See §8.2 |
| 2 | Table 9 defines **T0–T3 risk tiers** | Table 9 lists **four trust principles**. It has no numbered tiers (WEF p.42) | SimStay defines its own stakes tiers, named **S0–S3** (§8.3). "T0" is already used in `PS` §6.6 for the universal CSV-import integration tier |
| 3 | A **Palantir case study** | Palantir is the *source* of Table 5 (the ontology layers), not a case study (WEF p.29). The numbered case studies are Indeed, Gamma, Genesys, Cognizant, Rakuten, Contextere and Ant Group | Table 5 is used in full (§4.4); Palantir is credited as its source only |
| 4 | Onboarding compressed **"from 4 months to 30 minutes"** | Neither the paper nor SimStay's evidence supports this. Documented baseline: **3–6 weeks** of dependence on a senior colleague before a housekeeper works alone (`PR` §1.2 [D]). SimStay targets: rule-set codification in **≈2–3 owner-hours** (ICP 1) or a **2-day on-site visit with ≈3 GM-hours** (ICP 2) (`CD` §2); live demo of photo-to-scenario in **15 minutes** (`CD` §4.1) | The documented figures are used (§6.2). Staff time-to-independence reduction stays a pilot hypothesis (`CD` §3.2 [G]) |
| 5 | Ambassadori (Hotel #1) and Bioli (Hotel #2) as a live data flywheel | Both are **demo tenants** in the prototype. `CD` §2.2 lists Ambassadori Kachreti only as an ICP 2 *example*, room count [G]. No contract exists | The flywheel is described as a design scenario, marked [G] (§6.3). Real-brand use needs consent (§9.5) |
| 6 | The paper prescribes **outcome-based pricing** | The paper asks how AI enables new pricing models and revenue streams (canvas, WEF p.45) and describes the operational-leverage equation (WEF p.32). It does not prescribe outcome pricing | The pricing architecture in §3.3 is our derivation [I] |
| 7 | Page references (Fig. 12 p.23, Fig. 15 p.27, Table 5 p.29, Fig. 17 p.34, p.35, Table 7 p.36, Contextere p.41, Table 9 p.42, Table 10 p.43, Fig. 20 p.44, Fig. 21 p.45–46, BforeAI p.13) | All verified against the PDF | Kept |

### 0.3 Two terminology collisions to fix in all external material

1. **HAS levels vs SimStay rule tiers.** The paper's Human Agency Scale uses H1–H5 (WEF p.27). SimStay's rule rubric uses tiers H (hard invariant), P (signed policy) and D (discretion) (`PS` §3.3). This dossier writes HAS levels as **HAS-1 … HAS-5** and rule tiers as **Tier H / Tier P / Tier D**. Pitch decks should do the same.
2. **T0 vs stakes tiers.** `PS` uses "T0" for the universal CSV import. Stakes tiers are therefore **S0–S3**.

---

## 1. Executive Thesis

**The paper's core claim.** AI is a general-purpose technology like electricity. Early factory electrification replaced steam engines with motors inside unchanged layouts. It cut energy costs by 20–60% but produced *no productivity gains*. The breakthrough came when pioneers redesigned the whole production system around distributed power, as Ford did between 1919 and 1926 (WEF p.5). Today, AI investment exceeded an estimated $250 billion in 2025. Yet only 25% of companies say AI is transformative, and 84% have not redesigned jobs around it. The paper's diagnosis: AI is layered on top of existing processes (WEF p.7).

**Hotel frontline technology is the textbook steam-engine case.**
- A standard operating procedure (SOP) only creates value if it is codified, transmitted, verified and reinforced for every person on shift (`PR` §1.1).
- Each generation of hospitality technology digitised one *artefact* and left the operating logic untouched:
  - the PMS digitised the ledger;
  - the LMS digitised the binder;
  - WhatsApp digitised the voice note;
  - today's "AI copilot" summarises the binder.
- None of them verifies a new hire's action *before* it reaches a guest or a folio.
- Only 24% of frontline workers feel adequately trained (`PR` §1.3 [D]). Up to 70% of turnover cost is lost productivity (`PR` §1.2 [D]).

**SimStay's thesis.** Make the hotel *legible* to an intelligence engine, then run the frontline through it:
- **The ontology.** The hotel's rules, folios, units, tasks and staff credentials form one ontology (WEF p.29).
- **The gate.** Every consequential frontline action passes a deterministic gate that cites the hotel's own rule and source line before it posts (WEF p.29: "agent acts → system checks against ontology → validated output moves forward").
- **Simulation as the speed loop.** A new hire, a new package or a new SOP is exercised in simulation before it meets a guest (WEF p.10–11).

**Positioning statement.** SimStay is the operating substrate that moves a hotel from *AI-enabled* to *AI-first* on the frontline workflows where a new hire can lose money or a guest: folio routing and room release first, then each adjacent department.

**The five building blocks as SimStay commitments:**

| Building block (WEF p.8) | SimStay commitment | Proof in the prototype | Next milestone |
|---|---|---|---|
| Intelligence engine | Every graded action, override and photo verdict becomes a signal. Rule archetypes compound across properties | **Built:** one shared set of machine-check kinds grades two unrelated properties, a golf/wine resort and a medical-wellness resort | Cross-property rule-archetype library; % of a new property's rules instantiated from archetypes (§6.3) |
| Adaptive stack | Own the ontology, orchestration and adapters. The PMS stays the system of record | **Built:** PMS adapter seam in dry-run with a payload shaped like the Mews API, plus CSV import; offline-cache failsafe | Challenger/production evaluation for rule changes (§6.3) |
| Operations redesign | Redesign *departure → sellable room* end to end, with hand-offs replaced by events | **Built:** check-out → housekeeping task → cleaned → inspected → PMS update, live across screens | GM control tower with intervention controls (§4.6) |
| Human-AI teaming | AI absorbs the procedural middle layer; humans keep craft and judgement; drills prevent atrophy | **Built:** discretionary rules are coached, never failed; inspection stays a human sign-off | Exception-drill programme (§5.2) |
| New value creation | Price on outcomes where baselines exist; move from product to process, platform and eventually invisible infrastructure | **Built:** in-product impact HUD computed from session events | Outcome-indexed pricing pilot at ICP 2 (§3.3) |

**The honest constraint.**
- Georgia's serviceable market is **≈745 hotels and ≈1.0–1.1M GEL/yr** at list prices. `CD` §1.2 states plainly that Georgia is a lean business, not a venture-scale market on its own.
- A venture-scale outcome therefore depends on two things:
  - the **scale loop** across countries (≈3× Georgia's spend TAM in four quantified markets, `CD` §1.2);
  - the **scope loop** across departments and adjacent markets: certification, staffing, and agent-legible policy (§6.4).
- Both are explicit in the investor narrative (§9).

---

## 2. Diagnosis: Where the Hotel and SimStay Sit (Table 1 Archetypes)

The paper classifies enterprises as **AI-enabled**, **AI-first** or **AI-native**, each with a litmus test (WEF p.6).

| Entity | Litmus test (WEF p.6) | Answer today | Classification | Consequence for SimStay |
|---|---|---|---|---|
| Typical Georgian 15–120-room hotel | "If the AI tools were removed, would your workflows collapse?" | There are no AI tools. The "system" is owner voice notes on WhatsApp/Viber (`CD` §2.1) | **Pre-AI-enabled** | SimStay must reduce adoption cost to near zero: no install, no password, in the messaging app staff already use (`PR` §4.2) |
| Same hotel after a SimStay pilot | "If AI systems were removed, could your business still operate?" | Yes, deliberately, for Season 1. The workflows run through SimStay, and a printed degraded-mode SOP keeps them running if it fails | **AI-first on 2–4 workflows, with designed resilience** | "AI-first" must not mean fragile. The hotel becomes AI-first per workflow when *verification quality* on that workflow cannot be sustained without the engine, while *operation* can continue in degraded mode. This is the hotel-scale twin of the prototype's offline failsafe (`PS` §4) |
| SimStay (the company) | "If AI systems were removed, would your value proposition still exist?" | No. Rule extraction from Georgian documents, synthetic guests and cross-property compounding all depend on AI | **AI-native** | The grading core is deliberately *deterministic*, with no LLM in the grading path (`PS` §0). This is an AI-native company choosing a non-generative trust core; it is the answer to Table 9 principle 2 (§8.3) |

**The strategic reading.** SimStay is an AI-native company selling *AI-first transformation* to buyers who are not yet AI-enabled. Most failed hospitality tools sold "AI-enabled" features to AI-enabled buyers. SimStay's product must therefore do the transformation work itself: codify the hotel, redesign the workflow and train the people. It cannot sell a feature and hope the hotel redesigns itself.

---

## 3. Dimension 1: Business Model Innovation and the AI-First Canvas

### 3.1 The AI-first business model canvas, completed for SimStay (Figure 21, WEF p.45–46)

The paper keeps Strategyzer's nine blocks and adds AI-first questions to each (WEF p.45).

| Canvas block | WEF question (abridged) | SimStay answer | Status |
|---|---|---|---|
| **Key partners** | What data, models and infrastructure are strategic? What is proprietary vs commoditised? Build, buy or partner? | **Proprietary:**<br>• each hotel's signed rule ontology with verbatim source spans<br>• the cross-property library of rule archetypes and graded exceptions<br>• frontline performance and credential histories<br>• Georgian spoken-register hospitality content<br>**Commoditised (buy):** foundation models, OCR, WhatsApp/Telegram rails, hosting<br>**Partner:**<br>• PMS vendors: OtelMS locally, Mews API, Cloudbeds integrators; PMS resellers earn a 15% referral fee (`CD` §4.2)<br>• VET colleges "Aisi" and "Prestige" (Telavi)<br>• hotel associations<br>• GITA | Partly built (ontology, adapters); partnerships [G] |
| **Key activities** | Where does intelligence materially improve outcomes? What is automated, augmented or human-led? What can AI do after human work hours? | Allocation follows the HAS matrix in §4.3. **After-hours activities** (WEF p.45) are material in hotels:<br>• overnight pre-validation of next-day departures' folio routing<br>• 06:00 pre-shift briefings per role<br>• night-audit exception triage<br>• overnight generation of drills targeting each trainee's weak rules<br>• overnight diffs of SOP changes | Planned |
| **Key resources** | Which unique platforms can you make with your IP? Where should intelligence compound? Which roles stay distinctly human? Which data grows more valuable monthly? | **Platform:** the hospitality ontology plus the simulation and grading engine<br>**Compounding assets:** the exception library and rule archetypes<br>**Distinctly human:** forward-deployed specialists (FDS), GM rule owners, head housekeepers as owners of the quality bar<br>**Data growing monthly:** per-property error heatmaps, cross-season credential records, archetype reuse rates | Engine built v0; library Planned |
| **Value proposition** | What value is possible only because intelligence is embedded? What problems could humans not solve before? Where do feedback loops improve performance? | • **Verified competence before the first live guest.** Previously only chain academies could afford hotel-specific simulation; Radisson Academy runs 2,500+ programmes (`CD` §1.3)<br>• **Zero posting leakage on audited invariants** (`CD` §3.5; a target, not a claim)<br>• **Rooms sellable sooner:** the turnaround is event-driven, not radio-driven<br>Every caught error improves the next drill | Gate and turnaround Built; effect sizes [G] |
| **Customer relationships** | How is intelligence embedded into products, services and interactions? What new experiences become possible? | Staff experience SimStay inside WhatsApp/Telegram. GMs experience a live board and audit trail. The hotel's *own* rules speak back to staff in their own register. A synthetic guest persona lets a trainee meet the hardest guest of the season in week 1 | Built (demo); messaging bot Planned |
| **Channels** | Where should agents interact directly with customers, and at what autonomy? | **Staff-facing agents:** Level 3–4 autonomy within GM guardrails (§3.5)<br>**Guest-facing agents:** none until the trust tiers allow (§8.3)<br>**Sales channels:** founder-led demos, referrals, PMS resellers, VET employer networks (`CD` §4) | Planned |
| **Customer segments** | Which new verticals can you enter? Which customers were previously unservable? Who generates the most useful feedback? | • **Previously unservable:** ≈570 owner-run 15–35-room hotels, priced out by per-seat tools; eduMe's minimum contract is ≈$4,200/yr (`PR` §5, `CD` §2.1)<br>• **New verticals:** medical-wellness resorts (Bioli-type: package entitlements, medical boundaries), wine-tourism estates, VET academies<br>• **Richest feedback:** ICP 2 multi-department properties with 19–37 hires/yr (`CD` §2.2) | Segments [D]/[I]; verticals [G] |
| **Cost structure** | How does intelligence reshape cost structure and marginal economics? | §3.2 | — |
| **Revenue streams** | Where can operational leverage increase revenue? Which new pricing models become possible? | §3.3 | — |

### 3.2 Cost structure and marginal economics

Intelligence changes two cost structures: the hotel's and SimStay's.

**(a) The hotel's cost structure: supervision stops scaling with hires.**

In a traditional hotel, the scarce input in frontline quality is *senior attention*, and its cost scales with the number of hires. A hotel ramping from 8 to 20 staff cannot shadow 12 hires with 3 seniors (`PR` §1.2). SimStay converts supervision from a **variable cost per hire** into a **near-fixed cost per rule set**:
- the rule set is codified once (≈2–3 owner-hours, or a 2-day specialist visit);
- after that, every action is verified at near-zero marginal cost.

| Cost line (20 / 50 / 100 rooms, `CD` §3.1 [I]) | Traditional behaviour | AI-first behaviour | WEF mechanism |
|---|---|---|---|
| Manager hours on onboarding (160 / 228 / 370 h/yr) | Linear in hires; peaks in the pre-season crunch | Front-loaded into rule codification; residual time goes to exceptions and coaching | Operational leverage (WEF p.32) |
| Ramp productivity loss (0.4 × monthly wage per hire) | New hire at ≈60% output for ≈1 month (`PR` §2.2 [I]) | Simulation moves early errors out of live service; drills target weak rules | Speed loop (WEF p.10) |
| Service-failure compensation (1,960 / 6,165 / 15,050 GEL) | Discovered at guest complaint or night audit | Blocked pre-posting (folio) or pre-release (room) | Embedded verification (WEF p.31) |
| Re-onboarding seasonal returners | From zero each season (`PR` §1.4) | A portable credential plus a 20-minute refresher (`CD` §5.4) | Codified expertise (WEF p.35) |
| Room turnaround latency | Radio calls, a paper list, a PMS update when someone remembers | Event-driven: check-out → task → cleaned → inspected → PMS | Reallocating hand-offs (WEF p.31) |

**P&L linkage, following Claryo (WEF p.13).** Claryo moved warehouse monitoring from activity to **daily P&L and square-foot economics**, reporting a $2.56 annualised P&L gain per square foot. The hospitality equivalent is **per-room-night economics**. SimStay should express every KPI in money:
- **Unsellable-minute cost** = ADR ÷ 1,440 × minutes a clean unit waits for inspection *while demand exists* [I].
- **Leakage cost** = the value of mis-routed charges written off at night audit [G].
- **Supervision cost per hire** = manager hours × loaded hourly rate (`CD` §3.1).

The impact HUD already computes errors caught, interventions avoided and turnaround from session events (**Built**, demo definitions). Its money translation is **Planned**.

**The paper's caution applies (WEF p.32).** Costs do not fall automatically. The hotel trades its old cost lines for a new equation: SimStay fees, specialist time and the discipline of maintaining the rule set, weighed against performance gains. The conservative payback of **≈10–64 days of season** (`CD` §3.4 [I]) is the number that must survive pilot data.

**(b) SimStay's own cost structure: the binding cost is specialist labour, not compute.**

- Cash COGS is ≈45 GEL per ICP 1 season and ≈420 GEL per ICP 2 onboarding (travel 300 + compute 120). Cash gross margin is 91.5%, or 77% with founder field labour imputed (`CD` §5.3 [I]).
- The Gamma case shows how margins are made. Gamma's inference-related gross margin rose from ≈31% to ≈77% within six months, because it continuously reassigned each step to "the lowest-cost, highest-quality combination of model, system design and human input" (WEF p.22–23).

SimStay's allocation discipline:

| Step | Allocation | Marginal cost | Rationale |
|---|---|---|---|
| Grading every frontline action | Deterministic rule engine, no model call | ≈0 | Instant, repeatable, explainable (`PS` §0). Matches the "no error" accuracy target for finance tasks (WEF p.28) |
| Extracting rules from a hotel document | Frontier model **once per document version**, cached | Low, amortised | Complex, low-frequency reasoning belongs to frontier models (WEF p.28) |
| Trainee dialogue, classification, drill selection | Small or fast models | Low per interaction | High volume, narrow scope (WEF p.28) |
| Rule-set sign-off, unwritten-rule discovery | Human (GM, FDS) | High | Accountability and tacit knowledge |

**The unit-economics lever is therefore to convert FDS days into reusable archetypes.** This is the Osmo pattern: treat each deployment as a variation of the same system, cutting a development cycle from six months to 60 seconds (WEF p.14). The key metric is **FDS-hours per new property**. It should fall with every property onboarded. Founder-specialist capacity in the February–April peak is already a named commercial risk (`CD` C3).

### 3.3 Pricing: from seats, to seasons, to outcomes, to operated capacity

**Why seat pricing fails here.**
- Per-seat, per-month pricing penalises seasonal rosters (`PR` §5).
- AI products churn badly: fewer than 1 in 16 monthly subscribers of AI apps pay, 33% worse than non-AI apps, because AI "greatly reduces switching costs" (WEF p.40).
- Retention must therefore come from compounding, hotel-specific assets (the signed rule set, credential histories, the exception library), not from the novelty of the interface.

**A staged pricing architecture [I]/[G].** The stages track the positioning trajectory in §3.4. The paper notes that positioning choices "determine what customers pay for, where value accrues and what kind of business is being built" (WEF p.43).

| Stage | Positioning | Price metric | Existing basis | Gate to next stage |
|---|---|---|---|---|
| **1. Product/process (now)** | Rule Studio + simulation + gate | **Season licence:** ICP 1 500–800 GEL. ICP 2: setup 2,000–3,500, season fee 1,500–2,400, plus a **600 GEL success fee per certified hire retained 30 days** (`CD` §2) | Already partly outcome-based (the success fee) | Baselines measured at 5 design partners (`CD` §4.1): manager hours per hire, check-in stopwatch, room-not-ready count |
| **2. Process + outcome kicker (after pilot data)** | Workflows redesigned and measured | Platform fee (covers ontology upkeep) plus an **outcome kicker** on system-measured, GM-verifiable KPIs: certified-staff-seasons and a capped share of measured savings on night-audit exceptions or unsellable minutes | Baseline datasets from Stage 1 | Kicker revenue ≥ 20% of ICP 2 revenue with no disputes over measurement |
| **3. Platform/infrastructure** | Hospitality ontology, credential and adapters as rails | **Operated capacity:** per unit or room-night under management, plus API/credential fees from third parties (VET, staffing, distribution) | — | NRR ≥ 90% (`CD` §4.4), archetype reuse ≥ 50% [G] |
| **4. Invisible** | The hotel "just runs"; staff never "use AI" | A share of the labour-cost envelope managed (e.g. staffing marketplace take rate) | — | Legal clearance for any employment-agency role (§6.4) |

**Candidate outcome metrics, screened for perverse incentives:**

| Metric | Measurable by the system? | Aligned with the hotel? | Gaming risk | Verdict |
|---|---|---|---|---|
| Per error caught | Yes | **No.** It rewards more errors | High | **Reject** |
| Per certified employee-season | Yes (credential log with human confirmation, `CD` §5.5) | Yes | Low; certification needs human sign-off (Georgian PDPL Art. 19) | **Adopt** |
| Share of measured savings on night-audit exceptions | Partly; needs the PMS exception export | Yes | Medium (baseline definition) | Adopt at ICP 2 with a cap and a pre-agreed baseline |
| Per verified room release | Yes (adapter log) | Mostly | Medium (incentive to split tasks) | Use as a telemetry KPI, not a price metric |
| Talent success fee | Yes (30-day retention) | Yes | Low | Keep (`CD` §2.2) |

**Guardrail.** ICP 1 owner-operators get one simple season price. Outcome components apply only to ICP 2+, where baselines exist and a GM can audit them. Complexity would otherwise destroy the ≈4.2× fully loaded LTV/CAC that ICP 1 depends on (`CD` §5.4).

### 3.4 Market positioning: the five archetypes (Table 10, WEF p.43)

| Archetype (WEF p.43) | Source of value (WEF) | What it would mean for SimStay | Decision |
|---|---|---|---|
| **AI as a feature** | Better user experience and performance | An AI quiz or summary inside someone else's LMS or PMS | **Rejected as a destination.** Incumbents (eduMe, Beekeeper, Typsy; `PR` §5) can add it; there is no compounding asset |
| **AI as the product** | Direct utility, output or expertise | Rule Studio sold standalone: "photo of your house rules → graded scenarios in 15 minutes" | **The entry wedge** (demo moment; Year 0–1) |
| **AI as process and platform** | Productivity, standardisation, increasing returns to scale | SimStay reshapes check-out billing, room release, onboarding and night-audit coordination | **The core destination** (Years 1–2) |
| **AI as infrastructure** | Enablement and ecosystem dependency | The ontology, the certified-worker credential and the adapter layer become rails that PMS vendors, VET colleges, staffing and distribution build on | **The platform option** (Years 2–3), gated by §3.3 Stage 3 |
| **AI is invisible** | New user experiences and product categories | Staff experience "the hotel tells me what's next and catches my slips". The GM experiences "rooms are sellable sooner and nothing leaks". Nobody "uses AI" | **The end state** (Year 3+) |

**Trajectory logic.** Each step is paid for by the previous one. The wedge (product) earns the right to codify the hotel. The codified hotel enables process redesign. Redesign across many hotels creates the shared layer (infrastructure). The infrastructure lets the interface disappear. The paper's warning about churn (WEF p.40) is why SimStay must not stall at "AI as the product": products are easy to switch; processes and rails are not.

### 3.5 The five levels of agentic commerce, applied to hotel operations (Figure 20, WEF p.44)

The paper adapts five maturity levels from Stripe and notes that "most of the market today sits at the second level". It also argues that **B2B is the natural starting point**, because enterprise transactions have clearer rules, procurement workflows and decision criteria (WEF p.43–44). Hotel *operations* are exactly such a rule-bound B2B environment. SimStay therefore applies the ladder first to internal operations (the GM and staff as the principal), then to guest commerce.

**Track A: hotel operations agents.**

| Level (WEF p.44) | WEF definition | Hotel-operations capability | Guardrail | Status |
|---|---|---|---|---|
| **1. Eliminating web forms** | Agent completes routine steps after the user has decided | One-tap room-status change; one-tap folio routing (→W1/→W2); checklist taps; CSV import of the PMS export | Every step checked against the ontology | **Built** |
| **2. Descriptive search** | User describes needs; agent translates into search and options | The trainee or GM says in Georgian, "the guest says the company pays". The system retrieves the governing rule and the correct routing options. Rule Studio's "add a sentence" converts a spoken policy into a candidate rule | Suggestions only; the human decides | Planned (`PS` §5.3) |
| **3. Persistence** | Agent remembers preferences, constraints and prior interactions | Remembers each corporate account's billing terms, each package's entitlements (e.g. what the detox package includes), each trainee's weak rules across seasons, and each returning guest's preferences | Scoped to the property; no cross-tenant personal data | Partly built (per-property state); credential history Planned |
| **4. Delegation** | Agent evaluates and selects within user-defined guardrails | Auto-routes unambiguous folio lines, auto-dispatches housekeeping and balances attendant load, auto-releases rooms to "inspected" when a sampling policy allows | Only S0–S1 tasks, or S2 with sampling (§8.3); GM-set limits; everything reversible and logged | Planned |
| **5. Anticipation** | System predicts needs and acts before explicit demand | • **Predictive maintenance** from defect patterns in housekeeping photos and checklists<br>• **Pre-season roster planning** from occupancy forecasts and event calendars (Rtveli harvest Sep–Oct; Adjara Q3 peak with a Q3/Q1 ratio of 4.22, `CD` §1.4 [D])<br>• **Proactive VIP preparation:** arrival triggers unit readiness, amenity set-up and a staff brief<br>• **Proactive re-hiring** of certified returners before the season | Human approval for any spend or staffing commitment | Hypothesis |

**Track B: guest commerce and the three agent-ownership models (WEF p.44).**

The paper identifies three emerging models:
- **user-owned agents** acting across providers (open-source personal agents such as OpenClaw);
- **vendor-embedded agents** inside one ecosystem (Amazon's Rufus);
- **independent intermediaries** that compare and orchestrate on the user's behalf (shopping research in ChatGPT, Google's AI shopping).

What this means for SimStay:
- **The hotel's problem.** Bookings and pre-stay questions will increasingly arrive via agents that need **machine-readable policy**: package inclusions, cancellation terms, billing splits for corporate travellers.
- **SimStay's option.** The ontology's Logic layer (§4.4) *is* that machine-readable policy. The same signed rules that grade a trainee can answer a guest agent's question ("Is bar alcohol included in the Smart Detox package?" → no, Tier H rule H2, source page 1).
- **The position.** SimStay does not become a booking agent. It makes the hotel **agent-legible**, which is value that accrues to whoever holds the hotel's codified rules.
- **The caution.** Consumer contexts need more trust than B2B (WEF p.44). The guest-facing exposure of policy stays read-only and S2-governed (§8.3).

---

## 4. Dimension 2: Organisational Redesign and the "Octopus" Operating Model

The paper's metaphor (WEF p.23, Figure 12): an octopus has about 500 million neurons, two-thirds of them in its arms. "The brain sets the intent; the arms sense and coordinate and the cups execute." For an AI-first hotel:
- **Head** = business outcomes;
- **Arms** = the prioritised end-to-end workflows;
- **Cups** = tasks, each allocated to AI or humans.

The paper works through three levels: where to allocate intelligence, how to redesign work, and how to build intelligence-native operations (WEF p.24).

### 4.1 Head: outcome-driven allocation (Figure 13, WEF p.24)

The paper concentrates intelligence on **three to five priority workflows with defined outcomes**, owned by the C-suite and business-unit leaders (WEF p.24–25).

| Hotel outcome | KPI | Money translation | Measurement source |
|---|---|---|---|
| **Rate protection (RevPAR)** | Review score; cleanliness mentions | A 0.5-point score drop means −2.8% to −7.1% rooms revenue (`CD` §3.5 [D] mechanism) | Booking.com score trend across two seasons [G] |
| **Revenue integrity** | Posting-leakage count on audited invariants | Written-off or mis-billed amounts | Grader log (**Built**) + night-audit exception export [G] |
| **Labour efficiency** | Manager hours per hire; ramp duration | 160–370 manager hours/yr (`CD` §3.1) | Time logs at design partners (`CD` §4.1) |
| **Room turnaround** | Minutes from check-out to *inspected* | Unsellable-minute cost (§3.2) | Board and adapter log (**Built**, demo) |
| **Retention** | 90-day attrition of certified hires | Replacement cost 500–700 GEL per hire (`CD` §2.2) | Credential + HR roster [G] (industry reports put housekeeping 90-day exits near 55%, `PR` §1.4 [G]) |

### 4.2 Arms: selecting the priority workflows

The paper's selection criteria (WEF p.25):
- **scale and repetition**;
- **workflow friction** (hand-offs, multi-step coordination, manual review);
- **cognitive complexity** (decision-heavy or information-intensive work);
- rich data per cycle.

Genesys's playbook (inventory 200+ use cases → prioritise → redesign → build/buy/activate → measure, WEF p.25) is the procedural template.

| Candidate workflow | Scale & repetition | Friction | Cognitive complexity | Data per cycle | Score (max 12) | Decision |
|---|---|---|---|---|---|---|
| **Departure: folio settlement** (corporate, package, incidentals) | 3 | 3 | 3 | 3 | **12** | **Arm 1** |
| **Room release** (check-out → clean → inspected → sellable) | 3 | 3 | 2 | 3 | **11** | **Arm 2** |
| **Seasonal onboarding and certification** (the meta-workflow) | 2 | 3 | 3 | 3 | **11** | **Arm 3** |
| **Night-audit exception handling** | 3 | 2 | 3 | 2 | **10** | **Arm 4** |
| Check-in (ID, deposit, upsell) | 3 | 2 | 2 | 2 | 9 | Next |
| Complaint and service recovery | 2 | 2 | 3 | 2 | 9 | Next (Tier D/HAS-4 heavy) |
| VIP arrival preparation | 1 | 3 | 2 | 2 | 8 | Level 5 candidate |
| Minibar / F&B posting | 3 | 1 | 1 | 2 | 7 | Absorbed into Arm 1 |
| Lost and found | 1 | 2 | 1 | 1 | 5 | Later |

The scores are [I], set from `PR`/`CD` evidence. Design-partner time-and-motion observation validates them [G].

### 4.3 Cups: the Human Agency Scale (HAS) for hotels (Figure 15, WEF p.27)

The HAS has five levels (WEF p.27):
- **HAS-1:** the AI agent handles the task entirely, with no human involvement.
- **HAS-2:** the agent needs input at key points.
- **HAS-3:** equal partnership.
- **HAS-4:** the agent needs human input to complete the task.
- **HAS-5:** the task relies fully on humans.

The paper pairs this with **model-task fit**:
- **accuracy:** "no error" for finance or health; >90% for customer-facing outputs; 70–80% for internal copilots;
- **cost:** small models for routing, classification and scheduling; frontier models for complex synthesis; tuned models for domain IP;
- **latency:** <2 seconds for customer-facing support; minutes for internal synthesis (WEF p.28).

The vocabulary of Figure 14 (Objective / Automate / Augment / Review / Anticipate; WEF p.26) is used for the AI role.

| Task (cup) | Arm | HAS | AI role | Engine | Accuracy target | Latency | Why this allocation |
|---|---|---|---|---|---|---|---|
| Posting an unambiguous charge to the correct folio window | 1 | **HAS-1** (after go-live criteria, §6.3) | Automate | Deterministic rules | No error | < 1 s | Money; the rule is explicit and signed |
| Propagating room status to the PMS after a verified event | 2 | **HAS-1** | Automate | Adapter + rules | No error | Seconds | Mechanical; audit-logged (**Built**, dry-run) |
| Creating the housekeeping task at check-out | 2 | **HAS-1** | Automate | Rules | No error | Real time | Removes a hand-off (**Built**) |
| Generating pre-shift briefings per role | 3 | **HAS-1** | Anticipate | Small model + templates | 70–80% (internal) | Minutes | Low stakes; human reads it anyway |
| Detecting SOP changes between document versions | 3 | **HAS-2** | Automate + Review | Frontier model | >90% | Minutes | A GM confirms every changed rule |
| Extracting rules from SOP PDFs and photos | 3 | **HAS-2** | Automate + Review | Frontier model, cached | >90% field accuracy, GM-signed | ≤ 2.5 s live, else cache | Human input at key points: the GM signature (`CD` §2.2) |
| Photo check of room standards | 2 | **HAS-2** | Augment | Vision model | >90%, confidence shown | Seconds | The AI flags; a supervisor samples. The prototype's tags are simulated and labelled as such |
| Housekeeping room assignment and load balancing | 2 | **HAS-2** | Automate + Review | Small model / optimiser | 70–80% | Seconds | The supervisor confirms at peaks |
| Night-audit exception triage | 4 | **HAS-2** | Automate + Review | Rules + small model | >90% | Minutes | The auditor resolves flagged items |
| Corporate billing under ambiguous agreements | 1 | **HAS-3** | Augment | Rules + trainee | No error on outcome | Real time | The trainee decides; the gate blocks invariant breaches (**Built**) |
| Explaining package inclusions to a guest (e.g. detox package) | 1 | **HAS-3** | Augment | Ontology retrieval | >90% | < 2 s | Customer-facing; staff deliver it |
| Complaint intake and recovery options | — | **HAS-3** | Augment | Small model + policy | >90% | < 2 s | The AI proposes options within policy limits |
| Staff scheduling proposals | — | **HAS-3** | Anticipate | Optimiser | 70–80% | Minutes | The manager approves |
| Dispute de-escalation at the desk | 1 | **HAS-4** | Stays mostly out; supplies policy and compensation limits | Retrieval | — | Real time | Empathy and authority are human |
| Discretionary decisions (late checkout for a VIP) | 1 | **HAS-4** | Stays out (coached, never failed) | — | — | — | Tier D is coached, not graded (`PS` §5.1) (**Built**) |
| Medical-wellness guest intake (Bioli-type) | — | **HAS-4** | Stays out except logistics | — | No error | — | Health-care stakes (WEF p.28, "no error") |
| Welcome, warmth, reading the guest | — | **HAS-5** | Stays out | — | — | — | The product *is* the human |
| Sommelier and wine storytelling; spa craft | — | **HAS-5** | Stays out (the AI may train it) | — | — | — | Deep domain craft is the differentiator (WEF p.37, norm 5) |
| Final inspection sign-off ("Inspected / sellable") | 2 | **HAS-5** | Stays out; the AI supplies evidence | — | — | — | Accountability and skill retention (§5.2) (**Built** as a separate supervisor step; server-side role enforcement Planned) |
| Final certification of an employee | 3 | **HAS-5** | Stays out; the AI supplies evidence | — | — | — | Georgian PDPL requires human confirmation of automated assessment (`CD` §5.5) |

**Boundary dynamics.** "The boundary between the two is not fixed; it shifts as the intelligence engine improves" (WEF p.26). SimStay moves a cup down the scale (towards HAS-1) only through the acceptance criteria and challenger process in §6.3. It deliberately *never* automates two cups, even if accuracy allows:
- the **inspection sign-off**;
- the **certification decision**.

Both are kept for accountability and to prevent the skill atrophy described in §5.2.

### 4.4 The Enterprise Operations Ontology for hospitality (Table 5, WEF p.29)

Table 5 (source: Palantir) defines three layers:
- **Data:** "what is the current state of the business?";
- **Logic:** "how should the business reason about it?";
- **Actions:** "what can be done next?".

The paper lists what an ontology enables (WEF p.29): interpretability, governability, connectivity at scale, economies of scale ("one ontology supports multiple workflows") and an operational digital twin.

**Data layer: entities and their system of record.**

| Entity | Key attributes | System of record | In prototype |
|---|---|---|---|
| Property | Brand, location, unit mix, rulebook | SimStay | **Built** (two properties) |
| Unit (room / villa / cottage) | Number, type, status (occupied, dirty, clean, inspected, OOO, OOS) | PMS (mirrored) | **Built** (40 + 17 units) |
| Reservation and folio | Reservation id, guest, company or package, windows 1–4 | PMS | **Built** (simulated) |
| Folio window | Payee, payer type (guest / company / package), method (card / direct bill / prepaid) | PMS | **Built** |
| Charge | Code (e.g. VILLA, GOLF, WINE, REST, COTTAGE, HALO, SPECTRO, BAR), amount (including 0-GEL package inclusions), window | PMS | **Built** |
| Corporate agreement / package | Covered charge codes, documentation requirement, validity | SimStay (codified from contracts) | Partly (letter-on-file flag) |
| Rule | Tier (H / P / D), machine check, verbatim source span (page + quote), version, signer | SimStay | **Built** (no versioning yet) |
| Staff member and credential | Role, languages, certified rules, season history, drill results | SimStay | Planned |
| Task and evidence | Checklist items, photo, timestamps, verifier | SimStay → PMS status | **Built** |
| Adapter event | Operation, payload, response | SimStay | **Built** (dry-run log) |

**Logic layer: rule families.**

| Rule family | Example (signed, with source) | Machine check | Tier |
|---|---|---|---|
| Routing invariant | Wine tasting stays on the guest's personal account (Ambassadori, p.2). Alcohol and minibar are not in the detox package (Bioli, p.1) | charge code → required payer type | H |
| Window integrity | Every folio window needs a payee and a payment method | window has payee + method | H |
| Documentation policy | Direct bill requires a company letter or email | direct-bill window ⇒ letter on file | P |
| Sellability | A unit is sellable only after supervisor inspection | status = inspected | P |
| Balance | No unrouted amount at check-out | Σ unrouted = 0 | H |
| Package traceability | Package inclusions post to the package window, including at 0 GEL | route to payer = package | H |
| Tax | VAT 18% applies to taxable services (`CD` source 15 [D]); how it applies per hotel service line needs accountant confirmation [G] | tax line follows its base charge | H (planned) |
| Discretion | Late checkout to 14:00 for VIPs at the manager's discretion | none: coached, never failed | D |

**Source-authority precedence**, following the paper's "encode source-authority as weights" (WEF p.21): **GM-signed rule set > current SOP document > PMS configuration > oral practice.** When sources conflict, the higher authority wins by default and the conflict becomes an FDS review item.

**Actions layer: permitted actions, actor, verification and escalation.**

| Action | Allowed actor (HAS) | Precondition (Logic) | Verification | Escalation |
|---|---|---|---|---|
| Route charge to window | Trainee (HAS-3) → agent (HAS-1 once accepted) | Routing and integrity rules | Gate *before* posting; cites rule id + source quote (**Built**) | Duty manager if the rule is ambiguous |
| Finish check-out | Front desk | Folio balanced; all lines re-graded | Gate (**Built**) | — |
| Create housekeeping task | System (HAS-1) | Check-out event | Automatic (**Built**) | — |
| Mark cleaned | Room attendant | 5/5 checklist + photo | Server-enforced (**Built**) | Supervisor |
| Mark inspected (sellable) | Supervisor only (HAS-5) | Unit status = clean | Status precondition server-enforced (**Built**); supervisor-only role enforcement Planned | Head of housekeeping |
| Publish rule set | GM (HAS-5) | FDS review complete | Signature + version | FDS |
| Import PMS export (CSV) | System / FDS | Valid `room,status` rows | Adapter log (**Built**) | FDS |

**How this realises the paper's pattern.** "Agent acts → system checks against ontology → validated output moves forward" (WEF p.29) is precisely the prototype's gate:
- a mis-routed wine tasting is blocked *before posting*, with the hotel's own rule quoted back;
- the same check kinds grade both demo properties. This is the paper's "economies of scale: one ontology supports multiple workflows", demonstrated across two tenants (**Built**).

**Workflow ontology illustration** (Figure 16 analogue, WEF p.30), for *corporate departure folio settlement*:

| Task | Data | Logic | Actions |
|---|---|---|---|
| 1. Identify payer structure | Reservation, corporate agreement / package | Which charge codes each payer covers | Open folio; attach agreement |
| 2. Route charges | Charges, windows | Routing invariants, window integrity | Route / unroute; gate blocks breaches |
| 3. Verify documentation | Letter on file | Direct bill requires a letter | Request the letter via a guest quick reply |
| 4. Settle | Balances | Balance = 0; re-grade all lines | Finish check-out; decision record |
| 5. Monitor | Gate log, adapter log | Leakage thresholds | Alert, re-verify at night audit |

### 4.5 Redesigning *departure → sellable unit* end to end (Table 6, WEF p.31)

The paper names three tactics: **resequencing work** (work backwards from the outcome), **reallocating roles** at hand-off points, and **embedding verification** with explicit checkpoints and escalation (WEF p.31).

| Tactic | Today | Redesigned with SimStay | Status |
|---|---|---|---|
| **Resequencing** | Folio errors are found at the desk while the guest waits, or at night audit after the guest has left. Housekeeping learns of departures from a morning list | Next-day departures are pre-validated overnight (Level 5). Check-out itself *emits* the housekeeping task | Check-out → task **Built**; overnight pre-validation Planned |
| **Reallocating hand-offs** | Desk → housekeeping by phone or radio; housekeeping → supervisor by walking; supervisor → desk by call; desk → PMS by manual re-entry | All four hand-offs become ontology events on one live board. The PMS update is emitted by the adapter | **Built** (demo) |
| **Embedding verification** | Nobody verifies before the guest does | Four checkpoints: folio gate (pre-posting) → checklist + photo (pre-clean) → human inspection (pre-sell) → adapter audit log (post-sync) | **Built** |

**Hand-offs removed:** 4 manual → 0 manual. Human decisions are kept only where they carry accountability: routing choices under ambiguity, and inspection. Turnaround minutes are measured on the board; demo figures are *not* evidence of real-world effect [G].

### 4.6 Operational visibility: the GM control tower (WEF p.32; Cognizant case)

The paper defines good visibility as four capabilities (WEF p.32):
- real-time execution;
- traceability of inputs, reasoning and outcomes;
- intervention (pause, override, redirect);
- system-evolution tracking.

In the Cognizant case, sandboxed experimentation by 53,000 employees and a single multi-agent platform for 350,000 employees cut support tickets by 50% (WEF p.32).

| Capability | GM control tower feature | Status |
|---|---|---|
| Real-time execution | Live unit board; departure and task queues; agent presence | **Built** |
| Traceability | Every gate decision logged with rule id, page and verbatim quote; adapter payload log | **Built** |
| Intervention | Pause any HAS-1/2 automation per workflow; override with a mandatory reason (the reason becomes a training signal) | Planned |
| Evolution tracking | Rule-set versions, challenger results (§6.3), drift in error heatmaps | Planned |

### 4.7 Operational leverage: the new economics (WEF p.32)

The paper's end state is when "the distinction between 'AI in workflows' and 'the intelligence engine running operations' collapses" and "allocation becomes less a decision and more a property of the system itself" (WEF p.32). Until then, leverage must be earned workflow by workflow.

SimStay reports the hotel's leverage equation explicitly each season:
- gains: supervision hours released, leakage avoided, unsellable minutes recovered;
- set against the cost of intelligence: SimStay fees, FDS days and the GM's rule-maintenance hours.

This makes renewal a numbers conversation, not a sentiment one (`CD` §5.4, churn levers).

---

## 5. Dimension 3: Frontline Human-AI Teaming and the Skill Life Cycle (Block 4)

The paper's headline workforce signal: AI-first pioneers reach revenue thresholds with one-fifth to one-twentieth of prior headcount, which means significant workforce disruption. The differentiator shifts to talent: "who is hired, how they're developed and how the organization is designed to direct intelligence towards outcomes" (WEF p.33).

**SimStay's labour stance.** In a hospitality labour *shortage* (`PR` §3.1), SimStay does not position itself as a labour-substitution engine. It is a **competence and capacity engine**: the same staff deliver a verified standard sooner, and seniors are released from repetitive shadowing. This framing matters for hotels, workers and GITA (§9).

### 5.1 The T-shaped hospitality talent tree (Figure 17, WEF p.34)

The paper's T-shaped model:
- **four broad branches:** learning & adaptation; thinking & judgement; AI fluency & execution; collaboration & influence;
- **deep roots:** domain and functional expertise;
- **a technical "middle layer"** of execution that "is increasingly absorbed by AI, which is why both breadth and depth now carry more weight" (WEF p.34).

**The hotel's middle layer** is procedural mechanics:
- which window a charge goes to;
- PMS click-paths and status codes;
- recalling the 11 checks before a room release;
- remembering which corporate account needs a letter.

SimStay's ontology and gate absorb this layer. Human value concentrates at both ends.

| Role | Deep craft (roots) | Broad capabilities that gain weight | Middle layer absorbed by SimStay | What SimStay trains and measures |
|---|---|---|---|---|
| Front-desk agent | Guest reading, conflict handling, local knowledge | Judgement on exceptions; communicating policy warmly; AI fluency (when to trust the gate, when to escalate) | Folio routing mechanics, billing-term recall | Exception drills; the hardest synthetic guests; escalation quality |
| Room attendant | Craft standard, speed, discretion in guest spaces | Evidence capture (photo); flagging defects | Checklist recall; status updates | Photo-verified standards; defect-reporting accuracy |
| Housekeeping supervisor | Quality eye; team leadership | Orchestrating AI-dispatched queues; sampling policy; coaching | Assignment arithmetic; status propagation | Inspection calibration vs AI photo verdicts |
| Sommelier / spa / wellness staff | Wine or therapy knowledge (a differentiator) | Personalisation; cross-selling within policy | Package-entitlement recall; posting rules | Package-policy drills; guest-journey scenarios |
| GM / owner | Hospitality judgement; commercial sense | Rule ownership; reading the control tower; deciding automation boundaries | Explaining the same rules to every hire | Rule-set maintenance; approving the challenger (§6.3) |

**Frontline AI fluency is not prompt engineering.** For deskless workers, the paper's AI-fluency branch (task decomposition, context integration, workflow orchestration; WEF p.34) translates into five observable behaviours:
1. Act on the system's instruction when it is within scope.
2. Recognise when a situation is outside the system's boundary and escalate.
3. Capture evidence properly: photo, reason code.
4. Override *with a reason* when the system is wrong.
5. Report a wrong rule.

SimStay certifies these behaviours explicitly.

### 5.2 Managing the skill life cycle and skill atrophy (WEF p.35)

The paper identifies two disruptions:
- **tools evolve faster than skills can stabilise**;
- **deep expertise gets locked to an old context**.

It prescribes three practices: codify individual expertise into reusable AI skills; embed organisational practices into shared AI systems; and **manage skill atrophy**, because "organizations often only discover how critical that tacit knowledge was when AI breaks … Skills can be retrained; judgement is harder to restore" (WEF p.35).

Hotel translation of the disruptions:
- **Fast tool change** = SOPs, packages and PMS configuration change every season.
- **Context lock** = a returning seasonal worker's expertise is tied to last season's rules. Half of accuracy gains are lost within ≈6.5 months (`CD` §5.4 [D], Tatel & Ackerman 2025).

**Practice 1: codify individual expertise into reusable skills.**
- The head housekeeper's quality bar becomes the photo standard and checklist.
- The senior receptionist's hard-won billing knowledge becomes scenarios in the exception library.
- Contributions are **attributed** ("Nino's standard") and recognised in the GM dashboard. This directly addresses senior-staff burnout, where training is felt as unpaid extra work (`PR` §1.2).

**Practice 2: embed organisational practice into shared systems.** The signed rule set *is* the hotel's shared practice. Rule versions carry a signer and a date. The pre-season "what changed" check (`CD` §5.4) turns SOP changes into targeted refreshers.

**Practice 3: an exception-drill programme against skill atrophy** [I], all delivered over messaging in 1–3 minutes (`PR` §4.2):

| Drill | Mechanism | Cadence | Metric | Trigger |
|---|---|---|---|---|
| **Decide-first drill** | For a sample of real, gated actions, the system hides its verdict; the human decides first, then sees the gate's answer | 2–3 per week per trainee | Human-gate agreement (calibration) | < 85% agreement → targeted scenario set [G threshold] |
| **Exception micro-drill** | A synthetic guest presents an exception (disputed corporate charge, ambiguous package) | Weekly | Accuracy, time to decision | Two misses on the same rule family → refresher |
| **Degraded-mode drill** | "System down" rehearsal: manual folio check, paper room list, radio hand-offs | Pre-season plus mid-season | Completion without error | Failure → the degraded-mode SOP is revised |
| **Sampling duty** | For HAS-1/2 cups, a human reviews a fixed share of automated outputs (e.g. the supervisor re-inspects a sample of AI-verified releases) | Continuous | Discrepancy rate | Rising discrepancy → automation paused |
| **Pre-season refresh** | "What changed" plus a 20-minute returning-staff refresher | January | Refresher pass rate | Fail → full scenario path |

**The design principle.** Automation is never allowed to remove the *last* human repetition of a judgement that the hotel would need in a failure. That is why inspection and certification stay HAS-5 (§4.3).

### 5.3 Team archetypes and forward-deployed pods (Table 7, WEF p.36)

The paper finds that the most effective AI-first teams are cross-functional, typically **fewer than 10 people**, built around one product, workflow or customer problem, with flat hierarchies. Taking a prototype to reliable production can demand **ten times** the skills needed to build it (WEF p.36). Table 7 names three must-have team archetypes.

| Archetype (WEF p.36) | Composition (WEF) | SimStay instantiation | Operating rhythm and outputs |
|---|---|---|---|
| **Pilot and production** | AI researchers, engineers, product/project manager; production: operations lead, SME, infrastructure. "Built for production from day one; continuous exchange, not a handoff" | Product/engineering founder + ex-hotel operations lead (SME) + infrastructure | Preflight, offline failsafe and rehearsal culture (`PS` §4, §8) extended to production: grader regression suite, adapter contract tests |
| **Customer-embedded (core pod)** | Forward-deployed engineers + SMEs, with the customer. "Requirements shaped live; live feedback collapses silos" | **Forward-Deployed Specialist (FDS) pod:** an FDS (hospitality operator with AI fluency) + a part-time forward-deployed engineer (PMS adapter, CSV mapping) + the hotel's SMEs (GM, head of housekeeping, front-office manager) | **Day 1–2 on site:** audit unwritten rules, observe one live shift, digitise rate/package/billing conventions, obtain GM sign-off on a versioned rule set (`CD` §2.2). **Week 2:** remote tuning from gate and drill data. **Pre-season:** refresh visit. **Outputs:** signed rule set, exception library, go-live acceptance report (§6.3), new archetypes returned to the centre |
| **AI safety** | Legal and compliance, AI safety, evaluation engineers, responsible-AI team. "Safety engineered from the start; predefined evaluations and guardrails" | Fractional at seed stage: data-protection counsel (DPIA for automated assessment, PDPL Art. 31; human confirmation, Art. 19; `CD` §5.5), an employment-agency legal opinion for talent features (Georgia ratified ILO C181, `CD` §5.5), and an evaluation owner for extraction accuracy and grader regressions | Predefined evaluations before any rule set or model change goes live (§6.2) |

**FDS economics.** The FDS pod is the costliest resource and the main scaling constraint (`CD` C3). Its mandate is to make itself progressively unnecessary per property. It does this by feeding archetypes back to the centre, so the next hotel starts from confirmed candidates rather than a blank page (§6.3). KPI: **FDS-hours per property**, reported monthly.

### 5.4 Team norms, translated for hotel frontline teams (Figure 18, WEF p.37)

| WEF norm (WEF p.37) | Hotel-frontline translation | How SimStay makes it real |
|---|---|---|
| AI as the first tool for problem solving; "can AI do this better?" | "Check the hotel's rules in SimStay before interrupting a senior" | Quick-reply lookup of the governing rule in messaging |
| Test AI outputs against known data and common sense | "If the system's answer looks wrong for this guest, stop and escalate" | Override-with-reason; a "wrong rule" report button |
| AI drives, humans set direction | The GM owns the rule set; the system executes it | GM signature on every rule version |
| Metrics: adoption ≥ 50% of relevant tasks; productivity > 20%; de-siloing; quality evaluations | Share of departures routed through the gate; manager hours per hire; desk→housekeeping hand-off latency; gate precision | Control-tower KPIs (§4.6) |
| Core values: report hallucinations; learn across teams | Report wrong rules; share exceptions across departments | Exception library (cross-department) |
| AI is a tool, not a friend | The staff-facing system has *no* persona | Personality is reserved for synthetic guests (§8.1) |
| Human craft and taste ensure differentiation; disclose AI-generated vs human content | Hospitality warmth stays human; guest-facing AI text is disclosed | Guest-message disclosure policy (Planned) |

### 5.5 Federated organisation for hotel groups (Figure 19, WEF p.38; Rakuten, WEF p.39)

In the paper's federated model, a CEO-led centre owns shared tooling, approved models, evaluation and guardrails. Business units own budgets, execution and ROI. Embedded business-unit AI leads carry a dual reporting line (WEF p.38). Rakuten runs this across 70+ business services (WEF p.39).

| Level | Owns | SimStay product feature |
|---|---|---|
| **Group centre** (hotel group operations) | Group-wide Tier H invariants (billing integrity, safety); approved models; evaluation thresholds; brand standards | Rule-set **inheritance**: group invariants locked for properties |
| **Property** (GM as business-unit head) | Local Tier P policies, Tier D discretion, which workflows to automate, the ROI | Property overrides above the group floor; property-level control tower |
| **Property AI champion** (front-office manager or head of housekeeping; the paper's embedded CAIO analogue) | Adoption, drill cadence, feeding exceptions back to the group | Champion dashboard; dual visibility to the GM and the group |

**The intelligence engine as coordination backbone (WEF p.39).** When tribal knowledge and live signals run through a shared context layer, organisations shift "away from layered structures towards outcome-oriented roles". In a hotel this means fewer radio calls and relay messages between departments, and supervisors who own outcomes (turnaround, leakage) rather than relaying information. The live board is the first instance (**Built**, demo).

---

## 6. Dimension 4: Compounding Advantage and the Three Intelligence Loops (Block 1)

The paper's intelligence engine (Figure 2, WEF p.9) is "a self-reinforcing and data-driven flywheel" with six milestones across three loops. The **speed loop** unlocks the **scale loop**, which unlocks the **scope loop** (WEF p.9–16).

### 6.1 The six engine milestones, mapped

| # | Milestone (WEF p.9) | Data input (WEF) | SimStay | Status |
|---|---|---|---|---|
| 1 | Intelligence foundations | Context-rich training data | Signed per-property rule ontology with verbatim sources; outcome KPIs (§4.1) | **Built** v0 |
| 2 | Learning acceleration | Autonomous inference | Scenario sandbox, synthetic guests, simulated shifts | **Built** v0 (scripted synthetic guests; LLM paraphrase Planned) |
| 3 | Economic and operational alignment | Business case and performance | Impact metrics computed from events and tied to money (§3.2) | Demo **Built**; money translation and pilot baselines [G] |
| 4 | Production-grade autonomy | Multi-use platform | Go-live acceptance criteria; challenger/production for rule changes | Planned (§6.3) |
| 5 | New capability expansion | Edge-case and scope-expansion data | Housekeeping (done), F&B, spa/wellness, maintenance | Housekeeping **Built** v0 |
| 6 | Value creation and moonshot exploration | Frontier capabilities | Portable workforce credential; regional staffing; agent-legible hotel policy | Hypothesis |

### 6.2 The speed loop (WEF p.10–11)

**Objective.** "Run more experiments, generate and test hypotheses, and validate ideas before committing resources … Failures narrow the search space; successes become building blocks for the next cycle" (WEF p.10).

| Mechanism (WEF Table 2, p.11) | Case | SimStay translation |
|---|---|---|
| **Objective-led context building** | **Workera** builds two context layers, *individual* (a user's skills and experience) and *company* (the capabilities the organisation needs). Context is "good" when it sharpens assessment and tailors learning paths to business objectives | **Two-layer frontline context.** *Individual:* each trainee's role, languages, seasons worked, rule-level accuracy and drill history. *Company:* the hotel's signed rules, corporate accounts, packages and outcome KPIs. Drills are chosen where the two diverge, e.g. a trainee weak on package routing at a wellness resort |
| **Discover solutions and rapidly prototype** | **Formation Bio**'s Cassini predicts which Phase II trials will work before they start | **Simulate the change before the season.** A new package (e.g. a new detox tier), a new corporate agreement or a revised SOP is exercised by synthetic guests across all roles. Ambiguities and false blocks surface in simulation, not with the first real guest |
| **Evaluations, safety and governance** | **ServiceNow** agents must clear quantitative thresholds (task-completion rates typically 80–95%) before going live. Outputs outside bounds route to human checkpoints. In production, decision volume is 1,000× pre-production, so statistical evaluation replaces exhaustive review | **Thresholds before a rule set goes live** [I]: every Tier H rule has a verbatim source span; extraction agreement with GM review ≥ 95% (mirroring the ≥ 95% field-accuracy expansion gate, `CD` §4.4); scenario answer keys regression-tested. In production, sample-based review (§5.2 sampling duty) replaces full review |

**Onboarding compression, stated correctly (see §0.2 #4).**
- **Codifying a hotel.** Documents or oral practice (often never written; `PR` §1.3) become a signed, graded rule set in **≈2–3 owner-hours** (ICP 1) or a **2-day visit + ≈3 GM-hours** (ICP 2) (`CD` §2). The live demo converts a photo of house rules into a messaging scenario in **15 minutes** (`CD` §4.1). The prototype's offline ingestion responds in **≈0.8 s** from cache (**Built**, preflight-measured). This is a demo latency, not an onboarding claim.
- **Making a new hire independent.** The documented baseline is **3–6 weeks** (`PR` §1.2 [D]). The target is a **40–70% reduction in shadowing hours**, a pilot hypothesis (`CD` §3.2 [G]).
- **Adding property N.** The time and FDS-hours to add each new property fall as archetypes accumulate. This is the scale loop's KPI (§6.3).

### 6.3 The scale loop (WEF p.12–14)

**Objective.** "Operationalizes intelligence as a multi-use platform, applying the same models and workflows to increase output across adjacent functions … each use strengthens the system" (WEF p.12). Mechanisms are in Table 3 (WEF p.13–14).

**(a) Performance linked to outcomes (Claryo) and leverage points made observable (Taktile).**
- **Claryo:** see §3.2 for the per-room-night money translation.
- **Taktile:** lets regulated institutions "layer rules, agents and human judgement … in a common decisioning layer" at defined decision nodes (WEF p.13, p.26).
- **SimStay's decision nodes** are routing (Arm 1), release (Arm 2), certification (Arm 3) and audit exceptions (Arm 4). The gate is the common decisioning layer, and each node's rule / agent / human split is explicit (§4.3).

**(b) Industrial-grade reliability (Waymo).** Before driving without a safety driver in a new city, Waymo must satisfy **12 acceptance criteria**, evaluated with quantitative thresholds and **over 20 billion miles** of simulation that replays and varies real scenarios (WEF p.13). SimStay's equivalent is a **property go-live acceptance standard** [I]. A property may move a workflow to autonomous (HAS-1/2) operation only when all 12 criteria hold:

| # | Acceptance criterion |
|---|---|
| 1 | GM-signed rule-set version exists |
| 2 | 100% of Tier H rules carry a verbatim source span (page + quote) |
| 3 | Grader regression suite passes on the property's scenario bank |
| 4 | Every role has completed ≥ N simulated shifts (N set per role [G]) |
| 5 | Exception library holds ≥ M property-specific cases, including replays of last season's real incidents |
| 6 | PMS adapter dry-run matched ≥ 99% of status events against the PMS export [G threshold] |
| 7 | Degraded-mode SOP printed and rehearsed (§5.2) |
| 8 | Data-protection consents and DPIA in place (`CD` §5.5) |
| 9 | Certified staff confirmed by a human (PDPL Art. 19) |
| 10 | Sampling duty configured for every automated cup |
| 11 | Escalation paths mapped for every action in the ontology (§4.4) |
| 12 | Baseline KPIs captured for the leverage equation (§4.7) |

"Replaying real scenarios" is the hotel-scale version of Waymo's simulation. Every real exception from last season becomes a simulated scenario for next season's cohort.

**(c) Continuously improving without breaking production: challenger vs production (BforeAI).** BforeAI runs new detection models in parallel with the live system on the same data. It promotes a model only when it outperforms production and meets strict accuracy thresholds (e.g. over 90%), and it can predict threats up to 80% of the time before an attack begins (WEF p.13). SimStay applies the pattern to **SOP and rule-set changes**, the most frequent source of frontline confusion:
1. A proposed rule-set version (the challenger) runs **in shadow** against the same live events as the production version. Every folio move and release is graded by both.
2. The GM sees the difference *before* anyone is affected, e.g. "the new version would have blocked 3 moves this week: [list]; 1 looks like a false block."
3. The challenger is promoted only if it catches the intended errors, adds **no unexplained false blocks** on Tier H, and passes the regression suite.
4. The same harness governs model changes: extraction models, photo-check models.

This is also the paper's recommended bridge to the end state: "run parallel operating models … systematically measuring the differences in performance" (WEF p.47). It is **Planned**; the grader's determinism makes shadow evaluation cheap.

**(d) Scaling through reuse (Osmo) and the multi-hotel data flywheel.** Osmo treats "each deployment as a variation of the same system" and feeds each result back, so the next cycle is faster (WEF p.14). The prototype already demonstrates the architectural precondition:
- one shared set of four machine-check kinds (routing, window integrity, documentation, sellability) grades a golf/wine resort *and* a medical-wellness resort; the wellness resort uses three of them;
- adding the second property required one new *payer type* (package), not a new engine (**Built**).

**The flywheel as a design scenario [G].** Neither property is a customer (§0.2 #5).

| Stage | What the property contributes | What the next property receives at onboarding |
|---|---|---|
| **Hotel #1: a corporate golf/wine resort** (modelled on Ambassadori Kachreti) | Archetypes: *corporate direct-bill covers accommodation + activity; incidentals (wine, restaurant) stay personal; direct bill requires a letter*; exceptions such as "guest assumes the company pays for everything" | — |
| **Hotel #2: a medical-wellness resort** (modelled on Bioli) | New archetypes: *prepaid package as payer; 0-GEL inclusions must still be posted for traceability; alcohol excluded from detox packages; medical intake stays human*; a different persona ("assumes everything is included") | Starts from #1's routing and integrity archetypes. The FDS *confirms* rather than *authors* them |
| **Hotel #10** | Local policy and discretion only | A pre-populated candidate rule set: of all rules, the share that are **archetype instances needing only confirmation** is the scale metric (target ≥ 50% by Hotel #10 [G]); FDS-hours ≈ a fraction of Hotel #1's |

**What crosses tenants and what never does** (a data-governance commitment, written into the licence terms):

| Crosses tenants (abstracted) | Never crosses tenants |
|---|---|
| Rule archetypes (structure, not a hotel's text) | Guest personal data |
| Scenario templates and exception *patterns* | A hotel's rates, contracts, corporate-account names |
| Extraction prompts, evaluations, error priors | Identifiable staff performance records (these move only with the worker's consent, as their credential) |
| Aggregate benchmarks (opt-in, k-anonymous) | Raw documents |

### 6.4 The scope loop (WEF p.14–16)

**Objective.** "Reuse capabilities across workflows, share them among teams and recompose them into net-new products, services and markets … the constraint shifts from building intelligence to deciding where to apply it" (WEF p.14).

| Mechanism (WEF Table 4, p.15–16) | Case | SimStay translation |
|---|---|---|
| **Transfer across domains** | **Harvey** extended one legal architecture to tax (10+ jurisdictions, with PwC) and M&A. One workflow has run over 10,000 times | Same ontology + gate + simulation + credential, new context per department (table below) |
| **Shared intelligence layer** | **Stripe**'s payments foundation model is a shared embedding layer that every product builds on; it caught 95%+ of card-testing attacks, a 22% improvement | The **hospitality operations ontology plus the frontline-performance representation** is the shared layer. Every SimStay product reads the same rules, units, tasks and credentials |
| **Recomposing capabilities** | **Anthropic** recomposed Claude into Claude Code (≈$1B annualised within six months), then Cowork, Design and Small Business, with no new infrastructure underneath | New products recomposed from existing capabilities (second table below) |
| **Moonshot exploration** | **Isomorphic Labs** attacks the ≈85% of human proteins previously considered undruggable | A **national frontline-competence standard**: a portable, verifiable hospitality credential for Georgia (§9.3) |

**Department expansion (transfer across domains):**

| Domain | Reused capability | New context required | First workflow | Principal risk |
|---|---|---|---|---|
| Front office (done) | — | — | Departure folio settlement | — |
| Housekeeping (done v0) | Gate, tasks, evidence, board | Unit standards, photo standards | Room release | Photo-model accuracy (S2) |
| F&B / restaurant | Charge routing, simulation | Menus, allergen rules, outlet posting | Outlet → folio posting; allergen scenarios | Allergen errors are S3 (no-error, human) |
| Spa / wellness / medical-wellness | Package payer, entitlements, persona sim | Treatment protocols, contraindication boundaries | Package entitlement at booking and check-out | Medical boundaries (HAS-4/5; Ant Group privacy pattern, §8.3) |
| Maintenance | Tasks, evidence, adapter (OOO/OOS) | Asset register, defect taxonomy | Defect → OOO → repair → release | Asset data quality |
| HR / staffing | Credential, drills | Rosters, labour law | Pre-season rehiring of certified returners | Employment-agency status (ILO C181) |

**Recomposed products (no net-new infrastructure):**

| Recomposed product | Capabilities recombined | Buyer | Status |
|---|---|---|---|
| **Academy licence** | Scenario bank + generic property + credential | VET colleges (`CD` §2.3) | Planned (in the `CD` model) |
| **Returning-staff credential / talent priority** | Credential + drills + success fee | ICP 2 hotels (`CD` §2.2) | Planned |
| **Rule-compliance audit** | Ontology + gate log + night-audit import | Owners, hotel groups, lenders | Hypothesis |
| **Agent-legible policy endpoint** | Logic layer, read-only | Distribution partners and guest agents (§3.5) | Hypothesis |
| **Regional seasonal staffing marketplace** | Credential + availability + certified-hire matching (Kakheti Rtveli, Adjara peak) | Hotels, certified workers | Hypothesis, gated on legal opinion. No guaranteed-job contracts, no trainee fees (`CD` §0) |

---

## 7. The Adaptive Technology Stack (Block 2): Strategic Stance Only

The paper's four stack plays (Figure 7, WEF p.18) matter to SimStay as business choices about control, cost and vendor risk, not as architecture.

| Play (WEF) | Paper's point | SimStay stance | Business rationale |
|---|---|---|---|
| **Turn use into fuel** (WEF p.18) | Every output accepted, overridden or flagged becomes a signal. Separate operational data from training data. Use synthetic data for rare edge cases | Signals: gate verdicts, overrides with reasons, GM rule edits, drill answers, photo verdicts, adapter mismatches. Synthetic guests generate rare exceptions no hotel sees often | The exception library *is* the moat. It grows with every shift, in every hotel |
| **Own the control layers** (WEF p.19) | Own orchestration and the context layer; keep proprietary data behind internal APIs; core systems stay the source of truth (WEF p.17) | SimStay owns the ontology, the rules and the adapters. **The PMS remains the system of record; SimStay never replicates a PMS or its vendor UI** (`CD` C7) | Keeps SimStay PMS-agnostic across OtelMS, Mews, Cloudbeds and CSV-only properties; no switching fight with the PMS |
| **Model-agnostic portfolio** (WEF p.20) | Frontier models for complex work, small models for repeatable work, tuned models where proprietary data matters; evaluate before swapping | Deterministic engine for invariants; small models for classification and dialogue; frontier model for extraction; a tuned model only if Georgian spoken register proves decisive [G] | Keeps COGS at ≈45 GEL/season (`CD` §5.1) and removes single-vendor risk |
| **Dynamic context** (WEF p.21) | Pull live context; encode source authority; assemble just in time | The phone task shows live context ("VIP; late checkout approved; hypoallergenic linen"), not a static manual. Source-authority precedence as in §4.4 | Staff act on what is true *now*, which is the difference from the binder |

**The Indeed case** (WEF p.21): an MCP-based agent platform modularised models, data and applications, with automated guardrails, continuous evaluation and model swapping. It validates SimStay's adapter seam (Mews-shaped, CSV). Vendors can change without workflows being rebuilt.

---

## 8. Dimension 5: Frontline Product Design and Trust Architecture (Block 5.1–5.2)

### 8.1 The seven AI-first design principles (Table 8, WEF p.41)

The paper warns that more AI capability "can also create noise, friction and 'AI slop'", and that "the objective is not to maximize AI use, but to apply intelligence where it improves outcomes" (WEF p.41).

| Principle (WEF p.41) | SimStay implementation | Status |
|---|---|---|
| **Task to modality** | Housekeeping: phone, big buttons (≥ 56 px), photo. Front desk: folio board with drag *and* explicit buttons. GM: board and audit log. Guest: messaging. Voice is deferred (§8.2) | **Built** |
| **Create starting points** | Quick replies, checklists and a demo pack; never an empty prompt box for deskless staff | **Built** |
| **Progressive disclosure** | One checklist item at a time; the gate shows *one* violation with its source, not a report | **Built** |
| **Personalised feedback and retrieval** | Drills target each trainee's weak rules; the credential history persists across seasons | Planned |
| **Collaborative environments** | One shared live board across desk, housekeeping and supervisor; hand-offs visible to all | **Built** (demo) |
| **Intentional personality** | Personality is *deliberate and confined*: synthetic guests have distinct personas and moods (a corporate guest; a wellness guest who assumes everything is included). The staff-facing system has none, per the "a tool, not a friend" norm (WEF p.37) | **Built** |
| **Cultural interaction preferences** | Georgian-first in spoken register; ka/en toggle; Russian- and English-speaking guest personas; interaction patterns tested per market before regional entry (`CD` §4.4) | Partly built |

### 8.2 The Contextere lesson, applied correctly (WEF p.41)

**What the case actually shows.** Contextere built a **voice-first** interface "around how frontline workers already operate". It replaced a 47-minute information-gathering process with near-instant context and cut troubleshooting time by up to 80%. "AI performance gains come from meeting users where they are rather than forcing them into new workflows" (WEF p.41).

**The transferable principle is meet-them-where-they-are, not voice.** For Georgian deskless hotel workers, "where they are" has three parts:
- **The messaging app they already open daily.** In rural Georgia, 70.9% use the internet but only 40.6% use a computer (`PR` §3.3 [D]).
- **No passwords, no install** (`PR` §4.2).
- **Buttons over free text or speech.** Speech recognition for Georgian is not yet reliable (≈105% WER for Whisper, `PS` §0).

A basement linen room or a villa bathroom is SimStay's "factory floor". The Contextere-equivalent moment is the housekeeper tapping a unit and instantly seeing *this* unit's standard, *this* guest's context and the photo required. No search, no binder, no call to the head housekeeper.

**Voice re-entry gate.** Voice enters the product only after Georgian speech recognition passes a **300-utterance benchmark** on hotel vocabulary (`PS` §8). This is task-to-modality applied with evidence.

**The empty-prompt anti-pattern.** Table 8's "create starting points" is why SimStay rejects the generic "ask the AI anything about the SOP" chat. Deskless workers under time pressure do not compose queries; they recognise options.

### 8.3 Trust architecture (Table 9, WEF p.42)

**Table 9's four principles (WEF p.42):**
- protect identity, credentials and control;
- match accuracy to what is at stake;
- make confidence and boundaries visible;
- make it verifiable and auditable.

The paper's example: show why an item was recommended, its source, a confidence score where uncertainty remains, and require confirmation before checkout.

| Trust principle (WEF p.42) | SimStay feature | Status |
|---|---|---|
| **Protect identity, credentials and control** | Role-scoped actions (housekeeping cannot post charges; only supervisors can mark "inspected"). Today the prototype separates these steps by screen but has no authentication or server-side role checks; data minimisation; strict tenant isolation (§6.3); in-country hosting option for sensitive tenants. The **Ant Group** case (WEF p.42), a medical-grade platform with a privacy-preserving layer that encrypts and harmonises clinical data, is the reference for medical-wellness properties | Role separation by screen **Built**; authentication, role enforcement and hosting options Planned |
| **Match accuracy to what is at stake** | Stakes tiers S0–S3 (below); the grading path is deterministic (no generative model where money or compliance is at stake) | **Built** (deterministic gate); tiers formalised here |
| **Make confidence and boundaries visible** | Per-rule extraction confidence in Rule Studio; photo-check confidence; the "offline cache" chip when AI degrades to cached results; simulated features labelled as simulations (the prototype's photo-verification tags carry a "simulation" label) | Offline chip and simulation labels **Built**; confidence scores Planned |
| **Make it verifiable and auditable** | Every block cites rule id, page and verbatim source quote; gate log, adapter payload log, rule-version history, human confirmations | Gate and adapter logs **Built**; versioning Planned |

**SimStay stakes tiers (S0–S3)** [I]. Accuracy anchors come from the paper's model-task fit (WEF p.28): no error for finance/health; >90% customer-facing; 70–80% internal copilot.

| Tier | Stakes | Examples | Engine | Accuracy / autonomy | Human role |
|---|---|---|---|---|---|
| **S3** | Money, legal, health, guest safety | Folio posting and routing; tax lines; medical-wellness information; allergen information; certification decisions | Deterministic rules or human | **No error**; no generative output reaches the decision | Human decides or confirms; full audit |
| **S2** | Guest-facing or revenue-affecting | Unit sellability; package explanations to guests; photo verdicts; guest messages | Rules + models, confidence shown | **> 90%**; sampling review | Human samples; override with reason |
| **S1** | Internal guidance | Drills, briefings, scenario generation, rule-extraction drafts | Small or frontier models | **70–80%** acceptable because a human review sits in the loop (FDS or GM before publishing) | Review before publication |
| **S0** | Low risk | Scheduling suggestions, formatting, reminders | Small models | Autonomous | None |

---

## 9. Dimension 6: Institutional and Investor Positioning

### 9.1 The core narrative: the steam-engine mistake in hospitality

**The electricity analogy (WEF p.5).**
- Factories that swapped steam engines for electric motors while keeping their layouts saved 20–60% on energy and gained *no productivity*.
- Only those that redesigned the production system around distributed power transformed.
- Today 84% of companies have not redesigned jobs around AI, and only 25% report transformative effects (WEF p.7).

**Hospitality technology has repeated the mistake four times** (§1). Each wave digitised an artefact:
- ledger → PMS;
- binder → LMS;
- voice note → chat app;
- binder → AI summary.

None redesigned the four conditions that make a standard real: codified, transmitted, verified, reinforced (`PR` §1.1). The market evidence:
- **eduMe** requires a ≈$4,200/yr minimum;
- **Beekeeper** adds an app and a login;
- **7shifts** solves *who* works, not *whether they know how*;
- **Typsy** teaches generic content, not *this hotel's* SOP (`PR` §5).

These are AI-enabled layers on an unchanged operating model.

**SimStay's claim is structural.** It redesigns the operating logic of the frontline:
- rules become an ontology;
- actions pass a gate;
- hand-offs become events;
- people are certified against *their* hotel's standard before the first guest.

Intelligence is not bolted onto a process; the process runs on it. In the paper's language, this is Block 3 (operations redesign) delivered as a product to hotels that could never staff an internal AI function.

### 9.2 The blueprint claim, with proof status

"SimStay is a blueprint for the AI-first hotel" is credible only if each building block has a proof point and an honest status:

| Building block | Proof point | Status |
|---|---|---|
| Intelligence engine | Two unrelated properties graded by one engine with shared check kinds | **Built** (demo tenants) |
| Adaptive stack | PMS-agnostic adapter seam; offline failsafe; model-agnostic by design | **Built** (dry-run) |
| Operations redesign | Departure → sellable unit with 4 manual hand-offs removed; pre-posting error gate | **Built** (demo) |
| Human-AI teaming | HAS allocation; Tier D coached-never-failed; human-only inspection and certification | **Built** (rubric); drills Planned |
| New value creation | Outcome-linked metrics computed in product; staged pricing | Metrics **Built**; pricing [I]/[G] |
| **Measured real-world effect** | Shadowing-hour reduction, leakage reduction, turnaround gain | **Not yet measured**: design-partner pilot Nov 2026 – May 2027 (`CD` §4.1, §6) |

### 9.3 Audience-specific theses

**Venture investors**

| Element | Content |
|---|---|
| Thesis | An AI-native company building the frontline operating substrate for independent and regional hotels. Advantage compounds through the scale loop (archetype reuse lowers FDS cost per property) and the scope loop (departments, credential, staffing, agent-legible policy) |
| Evidence today | Working end-to-end prototype; 91.5% cash gross margin model; LTV/CAC ≈ 8–20× (ICP 1, cash) and > 20× (ICP 2) [I]; payback ≈ 10–64 days of season [I] (`CD` §0) |
| The honest ceiling | Georgia is ≈1.0–1.1M GEL/yr SAM: a lean business, not venture scale alone (`CD` §1.2). The venture case needs regional expansion (four quantified markets ≈ 3× Georgia's spend TAM, each gated, `CD` §4.4) *and* scope expansion. Headcount-leverage examples in the paper (Anthropic, Cursor; WEF p.33) describe frontier software firms and must not be used as SimStay projections |
| Fundable milestones [G] | ≥ 30 paying hotels; NRR ≥ 90%; FDS-hours per property falling quarter on quarter; archetype reuse ≥ 50% by Hotel #10; one outcome-kicker contract with undisputed measurement |
| What investors should challenge | Seasonal churn (`CD` C4); FDS capacity (`CD` C3); effect sizes (`CD` C1); legal status of staffing features |

**Hotel groups and premium independents**

| Element | Content |
|---|---|
| Thesis | Operational leverage without replacing the PMS: verified competence, zero leakage on audited invariants (a target), faster sellable units, measured per room-night |
| Operating model | Federated rule inheritance: group invariants centrally, property policy locally (§5.5); a GM control tower (§4.6) |
| Adoption path | A **parallel operating model**, as the paper recommends (WEF p.47): one cohort or department on SimStay, one on current practice, measured side by side for one season |
| Risk reversal | Degraded-mode SOP; the PMS stays the source of truth; pause-autonomy control; outcome kicker only on agreed baselines |

**GITA and government innovation agencies**

| Element | Content |
|---|---|
| Thesis | Georgian-language, Georgian-context AI that raises frontline competence in regional tourism: Kakheti, Adjara and SME owner-operators (65.5% of hotel entities are individual entrepreneurs, `CD` §1.1 [D]) |
| Public value | Portable worker credentials (seasonal workers are not re-onboarded from zero); VET integration (Aisi, Prestige; `CD` §2.3); regional hotels served at SME prices |
| Policy alignment | The paper asks policy-makers to monitor where AI-first models create value and where risks emerge (WEF p.4, p.47). SimStay offers opt-in, aggregate sector benchmarks on competence and turnover, and a labour stance of competence and capacity, not substitution (§5) |
| Moonshot | A national frontline-hospitality competence standard: a verifiable credential co-owned with VET and the Skills Agency (the scope loop's "value creation and moonshot", WEF p.15–16) [G] |

### 9.4 Claims discipline: what to say and what not to say

| Say | Do not say |
|---|---|
| "Errors are blocked before posting, citing the hotel's own rule and page" (**Built**, deterministic) | "SimStay eliminates billing errors" (not measured) |
| "Target: 40–70% fewer shadowing hours; the pilot measures it" (`CD` §3.2) | "Onboarding in 30 minutes" / "from 4 months to 30 minutes" (no evidence) |
| "Codifying a small hotel takes ≈2–3 owner-hours (target)" | "Fully autonomous hotel" (contradicts the HAS design) |
| "Photo verification is simulated in the demo" | Presenting simulated AI tags as live vision |
| "The PMS integration is a dry-run adapter shaped like the Mews API" (`PS` §2.3) | "Integrated with Mews" |

### 9.5 Real-brand use

The prototype's demo tenants use real resorts (Ambassadori Kachreti, Bioli) and a real bank (Bank of Georgia) as scenario content. SimStay's own spec warns that "a real brand on stage implies a relationship that does not exist" (`PS` §2.1).
- **Before any external use:** obtain written consent from each brand, or substitute fictional equivalents.
- **Label the demo documents** as non-official. They already carry this footer.

---

## 10. Roadmap: Running the Parallel Operating Model

The paper's closing advice for leaders is to build the capacity to learn, "run parallel operating models … and systematically measuring the differences in performance" (WEF p.47).

| Horizon | Building-block progress | Key deliverables | Gate to proceed |
|---|---|---|---|
| **0–3 months** (Nov 2026 – Jan 2027) | Foundations + speed loop | 5 design partners (`CD` §4.1); signed rule sets; baselines captured; messaging bot live; FDS playbook v1 | Baselines at ≥ 3 hotels; extraction agreement ≥ 95% after GM review |
| **3–9 months** (Feb – Jul 2027, the season) | Operations redesign (Arms 1–3) + human-AI teaming | Parallel cohorts (SimStay vs shadowing); exception drills; GM control tower with intervention; go-live acceptance standard applied | Median manager hours per hire −40% or better (`CD` C1); no Tier H false block left unexplained |
| **9–18 months** | Scale loop | Challenger/production for rule changes; archetype library; outcome-kicker pilot at ICP 2; federated rule inheritance | FDS-hours per property falling; NRR ≥ 90%; one undisputed outcome contract |
| **18–36 months** | Scope loop + positioning shift | F&B and spa/wellness arms; credential and Academy; agent-legible policy endpoint; first regional market through the `CD` §4.4 gates | Legal opinion on staffing; regional-entry gates met |

---

## 11. Risks, Anti-Patterns and Counter-Measures

| Risk / anti-pattern | Source in the paper | Counter-measure |
|---|---|---|
| **AI slop** in guest- or staff-facing text | WEF p.41 | Structured outputs; quick replies; S2 sampling; disclosure policy |
| **Over-automating hospitality warmth** | WEF p.37 (human craft and taste) | HAS-5 cups protected (§4.3); personality confined to synthetic guests |
| **Skill atrophy** makes the hotel fragile when AI fails | WEF p.35 | Drill programme and degraded-mode rehearsal (§5.2) |
| **False failures** on discretionary judgement | WEF p.26 (boundary between AI and human) | Tier D coached, never failed (**Built**) |
| **Pilots that never compound** (disconnected experiments) | WEF p.22 | One ontology across all arms; every workflow feeds the exception library |
| **Cross-tenant data leakage** in the flywheel | WEF p.42 (protect identity and control) | Tenant-isolation contract (§6.3); opt-in, k-anonymous benchmarks |
| **AI-app churn and low switching costs** | WEF p.40 | Compounding hotel-specific assets; Hibernate plan; credential portability (`CD` §5.4) |
| **Cost of intelligence exceeds gains** | WEF p.32 | Leverage equation reported per season; FDS-hours KPI; deterministic core keeps inference costs low |
| **Over-claiming to juries and investors** | — | Claims discipline (§9.4); [D]/[I]/[G] labels kept in all material |
| **Labour-displacement backlash** | WEF p.33 (workforce disruption) | Competence-and-capacity positioning; credentials that belong to workers |
| **Regulatory exposure** (automated assessment, employment agency) | WEF p.36 (AI safety archetype) | DPIA, human confirmation (PDPL Arts. 19 and 31), ILO C181 opinion before staffing features (`CD` §5.5) |
| **Unauthorised real-brand use** | — | §9.5 |

---

## Appendix A: Concept-to-SimStay Translation Index

Every framework, table, figure, statistic and case study in the paper, with its SimStay translation. Type: **F** = product feature, **P** = business process, **S** = strategic position or advantage.

| WEF concept | Page | SimStay translation | Type | Status |
|---|---|---|---|---|
| Electricity / steam-engine analogy | 5 | Core narrative: hospitality tech digitised artefacts, not operating logic (§9.1) | S | — |
| 82% of decision-makers use AI weekly (Wharton) | 5 | Adoption is no longer the barrier; redesign is | S | — |
| Four adoption drivers (democratised access, reasoning & agency, multimodality, parallel execution) | 5 | Button-first access; the gate as agency within guardrails; photo evidence; parallel desk/housekeeping/supervisor flows | F | Built (partial) |
| Table 1: AI-enabled / AI-first / AI-native litmus tests | 6 | Hotel moves AI-enabled → AI-first per workflow; SimStay is AI-native with a deterministic core (§2) | S | — |
| $250B investment; 25% transformative; 84% no job redesign | 7 | Market-timing evidence for the redesign thesis | S | — |
| 28 days → 2.8 hours; $100M ARR in months; 15× team productivity | 7 | Ambition benchmarks. Not projections for SimStay (§9.4) | S | — |
| Figure 1: five building blocks | 8 | Five SimStay commitments (§1) | S | — |
| Figure 2: intelligence engine, six milestones | 9 | Milestone map (§6.1) | S | Partial |
| Speed loop (Fig. 3, Table 2) | 10–11 | Simulation before live; two-layer context; go-live thresholds (§6.2) | F/P | Built v0 |
| Workera: individual + company context | 11 | Trainee profile × hotel rule set → targeted drills | F | Planned |
| Formation Bio: predict before committing | 11 | Simulate new packages and SOPs before the season | P | Planned |
| ServiceNow: 80–95% thresholds, human checkpoints, 1,000× production volume | 11 | Rule-set go-live thresholds; sampling in production | P | Planned |
| Scale loop (Fig. 4, Table 3) | 12–14 | Multi-property engine; archetype reuse (§6.3) | S | Built (2 tenants) |
| Claryo: P&L per square foot | 13 | Per-room-night money translation of KPIs (§3.2) | F | Planned |
| Taktile: rules + agents + human in one decisioning layer | 13, 26 | The gate as common decisioning layer at four decision nodes | F | Built |
| Waymo: 12 acceptance criteria, 20B simulated miles | 13 | 12-point property go-live standard; replay of real exceptions (§6.3) | P | Planned |
| BforeAI: challenger vs production, >90% threshold | 13 | Shadow evaluation of rule-set and model changes (§6.3) | F/P | Planned |
| Osmo: each deployment a variation; 6 months → 60 s | 14 | Archetype library; FDS-hours per property KPI | P/S | Planned |
| Scope loop (Fig. 5, Table 4) | 14–16 | Department expansion and recomposed products (§6.4) | S | Partial |
| Harvey: transfer across domains | 15 | Front office → housekeeping → F&B → spa → maintenance → HR | S | Housekeeping Built |
| Stripe PFM: shared embedding layer | 15 | Hospitality ontology + performance representation as shared layer | S | Built v0 |
| Anthropic: recomposition (Code, Cowork, Design, Small Business) | 15 | Academy, credential, audit, policy endpoint, staffing | S | Planned/Hypothesis |
| Isomorphic Labs: previously intractable problems | 16 | National frontline competence standard (moonshot) | S | Hypothesis |
| Fig. 6: modular stack layers | 17 | PMS stays system of record; SimStay owns context and orchestration (§7) | S | Built (seam) |
| Play 1: data flywheel; synthetic edge cases (Fig. 8) | 18 | Gate, override and drill signals; synthetic guests | F | Built (synthetic guests) |
| Play 2: own control layers (Fig. 9) | 19 | Ontology, rules and adapters owned; proprietary data behind internal APIs | S | Built |
| Play 3: model-agnostic portfolio (Fig. 10) | 20 | Deterministic / small / frontier / tuned allocation (§3.2) | S | Built (deterministic + cache) |
| Play 4: dynamic context; source-authority weights (Fig. 11) | 21 | Live unit context on the phone; authority precedence (§4.4) | F | Partial |
| Indeed: MCP-based modular agent platform (Case 1) | 21 | Adapter seam; vendor swaps without workflow rebuilds | S | Built (dry-run) |
| Gamma: allocation of intelligence; margin 31% → 77% (Case 2) | 22–23 | Allocation discipline for SimStay's own COGS (§3.2) | P | Built (deterministic core) |
| Octopus: head / arms / cups (Fig. 12) | 23 | Outcomes / 4 priority workflows / HAS-allocated tasks (§4) | S | — |
| Fig. 13: 3–5 priority workflows | 24 | Four arms selected by the paper's criteria (§4.2) | P | — |
| Genesys: 200-use-case inventory → playbook (Case 3) | 25 | FDS workflow inventory and scoring at every property | P | Planned |
| Fig. 14: vendor procurement workflow redesign | 26 | Departure → sellable unit redesign (§4.5) | P | Built (demo) |
| Fig. 15: HAS H1–H5 | 27 | Hotel HAS matrix, 20 tasks (§4.3) | P | Rubric Built |
| Model-task fit: accuracy / cost / latency | 28 | Stakes tiers S0–S3 and engine allocation (§8.3) | P | Formalised |
| Table 5: ontology (Data / Logic / Actions; source Palantir) | 29 | Hospitality ontology (§4.4) | F | Built v0 |
| "Agent acts → check against ontology → validated output" | 29 | The pre-posting gate | F | Built |
| Fig. 16: workflow ontology | 30 | Corporate departure folio settlement ontology (§4.4) | F | Built v0 |
| Table 6: resequencing, reallocating roles, embedding verification | 31 | Departure → sellable redesign (§4.5) | P | Built (demo) |
| Visibility: real-time, traceability, intervention, evolution tracking | 32 | GM control tower (§4.6) | F | Partial |
| Cognizant: sandboxed scale, 1C platform, −50% tickets (Case 4) | 32 | Sandboxed simulation before live; one operating surface | S | Built (demo) |
| Operational leverage: the new economic equation | 32 | Per-season leverage report; pricing stages (§3.3, §4.7) | P | Planned |
| Headcount leverage (Anthropic, Cursor, Google, Salesforce) | 33 | Context only; not a SimStay projection (§9.3) | S | — |
| Fig. 17: T-shaped talent tree; AI-absorbed middle layer | 34 | Hospitality T per role; five frontline AI-fluency behaviours (§5.1) | P | Planned (certification) |
| Skill life cycle; codify expertise; manage atrophy | 35 | Attributed expertise capture; exception-drill programme (§5.2) | F/P | Planned |
| Table 7: pilot & production / customer-embedded / AI safety | 36 | Production culture; FDS pods; fractional safety function (§5.3) | P | Partial |
| Teams < 10; prototype → production needs 10× the skills | 36 | Pod sizing; production-readiness investment | P | — |
| Fig. 18: team norms and metrics (50% adoption, >20% productivity) | 37 | Frontline norms and control-tower KPIs (§5.4) | P | Planned |
| Fig. 19: federated model; embedded BU CAIO | 38 | Group-vs-property rule inheritance; property AI champion (§5.5) | F/P | Planned |
| Rakuten: 70+ business services, dual reporting (Case 5) | 39 | Multi-property groups with local ownership of ROI | P | Planned |
| Intelligence engine as coordination backbone | 39 | Live board replaces radio relays; supervisors own outcomes | F | Built (demo) |
| AI-app churn: < 1 in 16 pay, 33% worse | 40 | Retention via compounding hotel-specific assets (§3.3) | S | Planned |
| Block 5 triad: design / trust / positioning | 40 | §3.4, §8 | S | — |
| Table 8: seven design principles | 41 | Principle-by-principle implementation (§8.1) | F | Mostly Built |
| Contextere: voice-first, 47 min → instant, −80% troubleshooting (Case 6) | 41 | Meet-them-where-they-are via messaging and buttons; voice gated on a Georgian ASR benchmark (§8.2) | F | Built (button-first) |
| Table 9: four trust principles | 42 | Trust features and stakes tiers (§8.3) | F | Partial |
| Ant Group: privacy-preserving medical platform (Case 7) | 42 | Pattern for medical-wellness tenants (§8.3) | S | Planned |
| Table 10: five positioning archetypes | 43 | Product → process → infrastructure → invisible trajectory (§3.4) | S | — |
| Most of the market at agentic Level 2 | 43 | SimStay operations track already spans L1 and targets L3–4 (§3.5) | S | — |
| Fig. 20: five levels of agentic commerce | 44 | Operations and guest-commerce tracks (§3.5) | F/S | L1 Built |
| B2B is the natural starting point | 44 | Operations agents before guest agents | S | — |
| Three agent-ownership models (user-owned, vendor-embedded, intermediary) | 44 | Agent-legible hotel policy endpoint (§3.5) | S | Hypothesis |
| Fig. 21: AI-first business model canvas | 45–46 | Completed canvas (§3.1) | S | — |
| Conclusion: run parallel operating models | 47 | Parallel cohorts; challenger rule sets; roadmap (§10) | P | Planned |

---

## Appendix B: Glossary

| Term | Meaning in this dossier |
|---|---|
| **HAS-1 … HAS-5** | The paper's Human Agency Scale levels (WEF p.27) |
| **Tier H / P / D** | SimStay rule tiers: hard invariant, signed house policy, discretion (`PS` §3.3) |
| **S0–S3** | SimStay stakes tiers for trust and accuracy (§8.3) |
| **Arm** | A prioritised end-to-end workflow (octopus model, WEF p.23) |
| **Cup** | A task allocated to AI or humans within an arm |
| **Gate** | SimStay's deterministic pre-posting / pre-release check against the ontology |
| **FDS** | Forward-Deployed Specialist: the hospitality operator in SimStay's customer-embedded pod |
| **Archetype** | An abstracted, reusable rule structure (e.g. "incidentals stay with the guest") instantiated per property |
| **Challenger** | A proposed rule-set or model version evaluated in shadow against production |
| **ICP 1 / ICP 2** | 15–35-room owner-run hotels / 36–120-room independents and regional groups (`CD` §2) |
