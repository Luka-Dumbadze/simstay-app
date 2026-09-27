# Commercialization Dossier: Hospitality Operational Simulation & Talent Platform

**Product (refined scope):**
- Converts a hotel's own documents and house rules into **hotel-specific operational scenarios**.
- Trains and certifies frontline staff (front office, housekeeping, F&B) on a mobile messaging interface (WhatsApp / Telegram).
- Offers optional **certified-talent priority** through VET-college partners.

**Inputs (read-only):**
- `hybrid_model_research.md` (`HM`);
- `hotel_simulator_redteam_audit.md` (`HSA`);
- `pms_onboarding_research.md` (`BL`);
- `problem.md` (`PR`).

**Date:** 2026-09-27.

**Labels:**
- **[D]** documented statistic from a named source;
- **[I]** modelled derivation, with inputs shown;
- **[G]** unverified: needs field or pilot data.

**Currency:** GEL; 2.7 GEL/USD **[I]**.

**Reproducibility:** every financial table below comes from a single stated assumption set (§5.1). Changing an input changes every downstream figure consistently.

---

## 0. Executive Summary

| Question | Answer | Label |
|---|---|---|
| What is sold | Seasonal licences for hotel-specific staff onboarding and simulation (self-serve), an on-site digitisation package for larger properties, and cohort licences for VET colleges | — |
| Who pays | **ICP 1:** owner-run 15–35-room regional/boutique hotels (≈570 in Georgia). **ICP 2:** 36–120-room independent and regional-group hotels (≈175). **Channel 3:** hospitality VET providers | [D]/[I] |
| Georgian SAM | **≈750 hotels, ≈1.0–1.1M GEL/yr** at list prices | [I] |
| Year-1 SOM | **30 hotels** (23 ICP 1, 7 ICP 2) + 1 VET college ≈ **4% of SAM**; **≈50k GEL revenue** | [I] |
| Hotel payback | **≈10–41 days** of season (ICP 1) and **≈22–64 days** (ICP 2), depending on effect size (conservative / target) | [I]/[G] |
| Gross margin | **91.5% cash basis**; **77% with founder field labour imputed** | [I] |
| CAC | **≈100–250 GEL cash** per hotel (founder-led, barter lodging); ≈320–470 GEL with founder time imputed | [I] |
| LTV / CAC | ICP 1: **≈8–20× cash**, ≈4.2× fully loaded. ICP 2: **>20× on both bases** | [I]/[G] |
| Break-even | **Hotel #5–8** covers all cash operating costs (founders unpaid). Salaried-founder break-even arrives in **Year 2 at ≈65–75 hotels** | [I] |
| 10,000 GEL grant | Funds the 5-month pre-revenue build and pilot window. Cash never falls below **≈8.2k GEL** (Dec 2026). Closing cash Oct 2027 ≈ **38k GEL** before founder draws | [I] |

**Design decisions inherited from the prior red-team audits [I].** The commercial model deliberately **excludes** the elements `HSA` and the hybrid audits found fatal:
- no Oracle tenant dependency and no OPERA-branded credential;
- no guaranteed-job contracts, trainee stipends or repayment clauses;
- no realtime voice (text-first compute);
- no self-serve setup that demands 20–40 GM hours: ICP 1 ingestion is capped at ≈2–3 owner-hours, and ICP 2 uses a founder on-site visit.

The remaining open risks are listed in §6 with the pilot tests that close them.

---

## 1. Market Sizing

### 1.1 Anchor data

| Metric | Value | Label / source |
|---|---|---|
| Hotels and hotel-type establishments, Georgia 2025 | **2,783**; 54,300 rooms; 120,200 beds; 29,101 employees | [D] Geostat 2025 (via `PR` §2.1) |
| Mean size | ≈19.5 rooms | [I] |
| Individual-entrepreneur operators | 65.5% | [D] Geostat |
| Registered units incl. family hotels / guesthouses | 3,198 | [D] GNTA registry via PMCG (2024) |
| Size bands (GNTA) | ≤ 5 rooms 38%; 6–10: 18%; 11–20: 18%; **21+: 18%** (published bands sum to 92%) | [D] GNTA "Georgian Tourism in Figures 2023" |
| Branded hotels | **63 properties, 9,574 rooms** (18% of rooms) | [D] GNTA |
| Kakheti hotel establishments | **301** (Geostat 2025); 306 registered units (GNTA) | [D] |
| Registered units: Tbilisi / Adjara | 544 / 490 | [D] GNTA |
| Onboarding events per year, Georgia | ≈9,300–14,000 | [I] `PR` §2.4 |
| Annual onboarding damage pool, Georgia | **≈14–38M GEL** (floor), ≈66M GEL (Cornell benchmark) | [I] `PR` §2.4 |
| Line-level wage, accommodation & food (Q2 2026) | 1,918.88 GEL/month | [D] Geostat via `PR` |

### 1.2 TAM

**TAM: the value pool (damage the product addresses) [I]**
- Georgia: **≈14–38M GEL/yr** in onboarding damage (replacement, managerial time, ramp loss, turnaround friction), before review-driven revenue risk (`PR` §2.3–2.4).
- This is the problem's size, not revenue capacity.

**TAM: the spend pool (what the whole Georgian stock would pay at this product's list prices) [I]**

| Segment | Units | Price basis | Annual spend |
|---|---|---|---|
| ≤ 14 rooms (micro; would buy only a stripped tier) | ≈2,000 | 250 GEL/season [G: no such tier in Y1] | ≈0.50M |
| 15–35 rooms | ≈570 | 650 GEL/season | ≈0.37M |
| 36–120 rooms, non-brand | ≈175 | ≈3,560 GEL/yr (setup amortised over 3 years + season + fees; §2.3) | ≈0.62M |
| Branded / > 120 rooms | ≈85 | Talent-priority and VET-channel only | ≈0.10M [G] |
| VET / academies | ≈20 providers [G] | 3,000 GEL/yr | ≈0.06M |
| **Georgia spend TAM** | | | **≈1.65M GEL/yr (≈$0.6M)** |

**Regional expansion beachheads: unit TAM [D]/[I]/[G]**

| Market | Hotel stock | Mean size | Relevance / caveat |
|---|---|---|---|
| Azerbaijan | 859 hotel-type facilities; 31,750 rooms | ≈37 | Larger properties suit ICP 2. Needs a work permit + labour-market test for Georgian staff on site **[D]** |
| Kazakhstan | 4,303 establishments | ≈20 | Personal-data localisation (Law on Personal Data Art. 12(2)) requires an in-country stack **[D]** |
| Uzbekistan | 2,383 hotels; 38,075 rooms; 51 international-chain hotels (Aug 2026) | ≈16 | Localisation law (2021); relaxation pending **[D]/[G]** |
| Montenegro (Western Balkans) | 499 categorised hotels; 57% of hotel nights in Q3 | [G] | Extreme seasonality fits the seasonal licence **[D]** |
| Armenia | [G] | [G] | Armenian script unsupported by Azure/AWS OCR **[D]** |

- **[I]** At Georgian price points, the four quantified markets add ≈8,000 units. That is roughly **3× Georgia's spend TAM**, before localisation costs.
- **Georgia is a sustainable lean business, not a venture-scale market on its own.** Regional expansion (Year 3+) is the scale path, and each country requires the entry checks in §4.4.

### 1.3 SAM: 15–120-room independent and regional-group hotels, Georgia

**Derivation from GNTA bands [I]:**

| Step | Units |
|---|---|
| 11–20-room band (18% × 3,198) | 576 |
| … of which 15–20 rooms (≈45% of band, assumed) | ≈260 |
| 21+ band (18% × 3,198) | 575 |
| … of which 21–35 rooms (≈55% of band, assumed) | ≈315 |
| … of which 36+ rooms | ≈260 |
| Less branded (63) and non-brand > 120 rooms (≈20) | ≈175 |
| **SAM: ICP 1 (15–35)** | **≈570** |
| **SAM: ICP 2 (36–120, non-brand)** | **≈175** |
| **SAM total** | **≈745 hotels** |

- **SAM revenue [I]:** 570 × 650 + 175 × 3,557 + VET ≈60k ≈ **1.04M GEL/yr (≈$385k)**.
- **[G]** The within-band splits (45%, 55%) are assumptions; GNTA publishes no finer bands. The pilot sales list (§4.1) will count real properties per cluster.

**Excluded by design [D]/[I]:**
- Radisson-branded properties are covered by **Radisson Academy** (2,500+ programmes; `HSA` §3.3). Silk Hospitality's Radisson Blu Iveria (236 rooms), Radisson Blu Batumi and Tsinandali Estate (A Radisson Collection Hotel, ≈141 rooms) are **not ICP 2 targets**.
- Silk's **non-Radisson** properties are within reach for ICP 2 or talent-priority deals: The Telegraph, Park Hotel, Green Cape Botanico, Kokhta Bakuriani, Shenako Chalet, Republic **[D]** portfolio (room counts [G]).

### 1.4 SOM: Year 1–2 capture by cluster

| Cluster | Estimated SAM units in cluster [I] | Y1 target | Y2 target | Rationale |
|---|---|---|---|---|
| **Kakheti** (Telavi, Sighnaghi, Kvareli, Tsinandali) | ≈60–75 of 301 establishments in the 15–120 band; e.g., Kvareli Lake Resort (100 rooms **[D]**) | **12** (8 ICP 1, 4 ICP 2) | 22 | Founder base; wine-tourism seasonality (Q3 + Rtveli Sep–Oct); VET partners "Aisi" and "Prestige" in Telavi **[D]** (`PR` §3.2) |
| **Tbilisi boutique** | ≈150–170 of 544 units | **10** (8 ICP 1, 2 ICP 2) | 25 | Densest cluster; lowest travel cost; year-round hiring |
| **Batumi / Adjara coast** | ≈130–150 of 490 units | **8** (7 ICP 1, 1 ICP 2) | 20 | Strongest seasonality (Adjara Q3/Q1 visits ratio 4.22 **[D]**, `HSA` §3.2), so the seasonal licence fits exactly |
| **Other regions** | — | 0 | 8 | Referral-only in Y2 |
| **Total** | **≈745** | **30 (≈4.0%)** | **75 (≈10%)** | |

---

## 2. Ideal Customer Profiles and Packaging

### 2.1 ICP 1: Boutique / regional SME hotel (15–35 rooms)

| Attribute | Profile | Label |
|---|---|---|
| Ownership | Owner-GM, individual entrepreneur (65.5% of Georgian hotel entities) | [D] |
| Staff | ≈10–20; ≈10 onboarding events a year (6 of them in the first 60 days of the season) | [I] `PR` §2.2 |
| Pain | Owner absorbs ≈160 h/yr of explaining and correcting; WhatsApp/Viber voice notes are the current "system" | [I]/[D] `PR` §2.3, §5 |
| IT budget | New-software budget ≈4,000–5,400 GEL/yr at 20 rooms | [I] `HSA` §3.3 |
| Buying behaviour | Decides in Feb–Apr; pays per season; no procurement; referral-driven | [I] |

**Package: "Digital Self-Serve"**

| Component | Specification |
|---|---|
| Document ingestion | Owner uploads photos/PDFs of house rules, checklists, room standards and price lists. The pipeline drafts the hotel's SOP library and scenario set. The **owner reviews a one-page rule summary** (≈2–3 h total, the `HSA` §8 threshold) |
| Scenario sandbox | 30–40 scenarios: check-in, billing splits, room-status errors, VIP/early check-in, lost & found, complaint handling, room turnaround standards. **PMS-agnostic** (no vendor UI replication) |
| Trainee interface | WhatsApp or Telegram bot. No app install, no password (`PR` §4.2). Georgian-first, with English/Russian |
| Verification | Photo checks for room standards; hard-invariant checks for billing and room-status decisions; owner dashboard |
| Limits | Up to 15 active trainees per season; 1 property |

**Pricing:**

| Tier | Price | Notes |
|---|---|---|
| Seasonal licence, 15–24 rooms | **500 GEL / season** (6 months) | ≈83 GEL/month equivalent |
| Seasonal licence, 25–35 rooms | **800 GEL / season** | |
| Blended list price used in the model | **650 GEL** | |
| Off-season "Hibernate" | **Free**: SOP library and trainee records retained | Retention hook (§5.4) |
| Early renewal (paid by 31 Jan) | −10% | Pulls cash into the pre-season trough |

**Willingness-to-pay test [I]:**
- 650 GEL is **12–16%** of a 20-room hotel's annual new-software budget and ≈**3.8%** of its annual onboarding damage (17,160 GEL; `PR` §2.3).
- Priced below eduMe's ≈$4,200/yr minimum contract (`PR` §5) by ≈17×.
- **[G]** Stated willingness to pay must be confirmed in design-partner interviews (§4.1).

### 2.2 ICP 2: Premium independent / regional-group hotel (36–120 rooms)

| Attribute | Profile | Label |
|---|---|---|
| Examples | Kvareli Lake Resort (100 rooms **[D]**); Lopota, Ambassadori Kachreti (room counts [G]); Silk Hospitality non-Radisson properties | [D]/[G] |
| Staff | 28–70; ≈19–37 onboarding events a year | [I] `PR` §2.2 |
| Pain | Department heads spend 228–370 h/yr on onboarding; FO billing/routing and room-status errors; seasonal hiring scramble | [I] `PR` §2.3, `BL` §1.2 |
| Buyer | GM or HR/operations manager; may involve owner for sign-off | [I] |
| Budget | New-software budget ≈13,850–48,000 GEL/yr (50–100 rooms) | [I] `HSA` §3.3 |

**Package: "Enterprise Concierge"**

| Component | Specification |
|---|---|
| On-site digitisation visit | **2 days on site**: founder-specialist audits unwritten house rules, observes one live shift, digitises rate/package/billing conventions and department SOPs, secures GM sign-off on a versioned rule set. **GM time ≈3 h** (`HM` §4.1) |
| Bespoke rule set | Three-tier rubric: hard invariants / signed house policy / discretion. Discretion is coached, never failed (`HM` §2.6). This avoids the false-failure trap in `HSA` §4.2 |
| Multi-department scenarios | Front office, housekeeping, F&B; up to 60 active trainees per season |
| Talent-reservation priority | First access to certified graduates of partner VET cohorts. **Success fee only on hire**; no guarantee, no preliminary employment contract, no trainee fees |
| Reporting | Certification records per employee; season-over-season refresher |

**Pricing:**

| Line | 36–60 rooms | 61–120 rooms | Blended (model) |
|---|---|---|---|
| Setup / on-site digitisation (one-off) | **2,000 GEL** | **3,500 GEL** | 2,750 |
| Seasonal platform access (6 months) | 1,500 GEL | 2,400 GEL | 1,800 |
| Placement / certification success fee | 600 GEL per certified hire retained 30 days | 600 GEL | 600 (2 hires/yr × 70% realised) |
| Annual refresh visit (Y2+) | 500 GEL | 500 GEL | 500 |

**Price positioning [D]/[I]:**
- The 600 GEL success fee is **≈31–40% of one month's wage** (1,500–1,919 GEL; `PR` §2.2, Geostat). It sits **below** the direct replacement cost per hire of 500–700 GEL at 50–100 rooms (`PR` §2.3), so the hotel is no worse off than hiring on its own.
- This deliberately avoids the 1,500 GEL placement fee that the hybrid audit found exceeds realized hotel value.

### 2.3 Channel 3: VET colleges and tourism academies (B2B institutional)

| Attribute | Detail | Label |
|---|---|---|
| Targets | VET College "Aisi" and College "Prestige" (Telavi); Tbilisi/Batumi hospitality VET providers; Skills Agency-supported work-based-learning programmes (≈25 in hospitality nationally) | [D] `PR` §3.2 |
| Product | "Academy licence": the scenario bank with a generic Georgian hotel profile (a fictional 40-room Kakheti wine hotel), instructor dashboard, certification records | — |
| Price | **1,500 GEL per cohort** (≤ 25 students) or **3,000 GEL/yr** institutional licence (2 cohorts) | [I] |
| Value to the college | Practical, measurable skills module; placement outcomes via ICP 2 hotels' talent-priority demand | [I] |
| Value to the platform | Low-CAC candidate pipeline for ICP 2 talent priority; zero Oracle dependency; content reuse | [I] |
| Funding source | College budgets / state VET programmes; per-student state funding level [G] | [G] |

### 2.4 Packaging summary

| | Digital Self-Serve (ICP 1) | Enterprise Concierge (ICP 2) | Academy (Channel 3) |
|---|---|---|---|
| Onboarding | Self-serve upload, ≈2–3 owner-hours | 2-day founder visit, ≈3 GM-hours | Pre-built generic profile |
| Price | 500–800 GEL / season | 2,000–3,500 setup + 1,500–2,400 / season + 600 per hire | 1,500 / cohort |
| Year-1 accounts (model) | 23 | 7 | 1 |
| Cash COGS / account / season | ≈45 GEL | ≈420 GEL (travel 300 + compute 120) | ≈150 GEL |

---

## 3. Value Proposition, ROI and Payback

### 3.1 Status-quo cost baseline (per `PR` §2.3 archetypes) [I]

| Line (annual, GEL) | 20 rooms (ICP 1) | 50 rooms (ICP 2-S) | 100 rooms (ICP 2-L) |
|---|---|---|---|
| New hires onboarded | 10 | 19 | 37 |
| Manager hours on onboarding | 160 h | 228 h | 370 h |
| Managerial + senior shadowing cost | 5,200 | 11,286 | 25,900 |
| Ramp productivity loss (0.4 × monthly wage per hire) | 6,000 | 12,160 | 25,160 |
| Turnaround / service-failure compensation | 1,960 | 6,165 | 15,050 |
| **Per-hire addressable cost** (sum ÷ hires) | **1,316** | **1,558** | **1,786** |
| of which cash or cash-equivalent (ramp wage + compensation) | 796 | 964 | 1,087 |

**Supervisor-shadowing cross-check.** `BL` §2.5 reports 82 h per front-office hire at 20 GEL/h = **1,640 GEL**. That covers front office only (the heaviest role). The `PR` all-role average above is lower, so the ROI model uses the lower, more conservative `PR` figures.

### 3.2 Effect-size scenarios [G: to be measured in pilot]

| Effect on | Conservative | Target (hypothesis the pilot must confirm) |
|---|---|---|
| Manager / shadowing hours per hire | −40% | **−70%** |
| Ramp productivity loss | −20% | −35% |
| Training-attributable service failures | −20% | −40% |

The **−70% shadowing reduction is a pilot hypothesis, not a finding.** The only analogous documented evidence is directional:
- simulation-based training benefits of **+14% procedural knowledge** versus comparators (Sitzmann 2011, cited in `HSA` §2.1);
- LLM-assisted extraction time savings of 33–87% in other domains (`HM` §2.3).

The conservative column is what the business case must survive on.

### 3.3 Savings per hire [I]

| Archetype | Conservative saving per hire | Target saving per hire |
|---|---|---|
| 20 rooms | 0.4×520 + 0.2×600 + 0.2×196 = **367** | 0.7×520 + 0.35×600 + 0.4×196 = **652** |
| 50 rooms | 0.4×594 + 0.2×640 + 0.2×324 = **431** | 0.7×594 + 0.35×640 + 0.4×324 = **770** |
| 100 rooms | 0.4×700 + 0.2×680 + 0.2×407 = **497** | 0.7×700 + 0.35×680 + 0.4×407 = **891** |

### 3.4 Payback calculator [I]

**Method:**
- Payback hires = first-season investment ÷ saving per hire.
- Onboarding is front-loaded: the model assumes 6 / 10 / 18 hires in the first 60 days of the season for 20 / 50 / 100 rooms (≈60% of annual hires, reflecting spring seasonal hiring plus replacement churn) **[I]/[G]**.
- Payback day = payback hires ÷ (hires in 60 days ÷ 60).

| Archetype | First-season investment | Conservative: hires to payback | **Conservative payback** | Target: hires to payback | **Target payback** | Annual ROI (conservative) |
|---|---|---|---|---|---|---|
| ICP 1, 20 rooms | 650 | 1.8 | **≈18 days** | 1.0 | **≈10 days** | 10 × 367 ÷ 650 = **5.6×** |
| ICP 1, cash-only lines* | 650 | 4.1 | **≈41 days** | 2.4 | ≈24 days | 2.4× |
| ICP 2-S, 50 rooms | 3,500 (2,000 + 1,500) | 8.1 | **≈49 days** | 4.5 | **≈27 days** | 19 × 431 ÷ 3,500 = **2.3×** |
| ICP 2-L, 100 rooms | 5,900 (3,500 + 2,400) | 11.9 | **≈40 days** | 6.6 | **≈22 days** | 37 × 497 ÷ 5,900 = **3.1×** |
| ICP 2 using blended model price (4,550) at 50 rooms | 4,550 | 10.6 | ≈64 days | 5.9 | ≈35 days | 1.8× |

\* Cash-only counts only the ramp-wage and compensation lines. It excludes owner and manager time, which owner-operators often do not treat as cash **[I]**.

**Findings [I]:**
1. **ICP 1 recovers 100% of the licence within ≈10–41 days of the season** under every scenario, including cash-only.
2. **ICP 2 recovers within ≈22–49 days** at size-tiered prices. Only the blended-price, conservative case at 50 rooms (≈64 days) misses the 60-day target. **Size-tiered pricing (§2.2) is therefore required, not optional.**
3. **Success fees are excluded from payback** because each is offset by a 500–700 GEL avoided replacement cost (`PR` §2.3). A hotel paying a 600 GEL success fee is cash-neutral on that hire before any training effect.

### 3.5 Operational value claims: what is measurable and when

| Claim | Mechanism | Measurement in pilot | Label |
|---|---|---|---|
| Shadowing-hour reduction | Scenario practice + messaging micro-SOPs replace repeated verbal explanation | Manager time log, 2 weeks before vs 2 weeks after per hire | [G] |
| **Zero posting leakage on audited invariants** | Hard-invariant tier (folio balance, routing payee, tax follows room, OOO/OOS inventory effect) is trained and certified. Leakage on those invariants is measured, not assumed | Night-audit exception count on certified-staff shifts vs baseline | [G]: target, not claim |
| Faster check-in throughput | Pre-practised billing / exception flows | Stopwatch sample of 30 check-ins per hotel pre/post; queue model `BL` §2.4 | [G] |
| Fewer turnaround failures | Photo-verified room standards | "Room not ready" and re-clean counts | [G] |
| Reputation protection | Cleanliness and service lapses drive review scores (0.5-pt drop = −2.8% to −7.1% rooms revenue) | Booking.com score trend, 2 seasons | [D] mechanism / [G] effect |

---

## 4. Go-To-Market

### 4.1 Phase 1: first 5 design partners in 60 days (Nov–Dec 2026)

**Target mix:** 3 ICP 1 + 2 ICP 2, in Kakheti (3) and Tbilisi (2).

| Week | Action | Owner | Output |
|---|---|---|---|
| 1 | Build a **named target list of 60 properties** (Kakheti 30, Tbilisi 30) from Booking.com listings in the 15–120 room range, GNTA registry and hackathon contacts. Tag each by room count, review score and cleanliness-review mentions | Founder C | Scored list |
| 1–2 | **Warm intros:** hackathon exposure (Silk Hospitality non-Radisson properties; Episode Hotel [G: fit and room count]), VET colleges "Aisi" and "Prestige" (employer networks), Kakheti tourism contacts. GITA regional infrastructure in Kakheti, if available [G: a Telavi techpark is unverified] | Founders B, C | 20 meetings booked |
| 2–4 | **On-site demos, 3–4 per trip day**. Show the owner's own house-rule photo turned into a WhatsApp scenario **live, in 15 minutes** | Founder B | 20 demos |
| 3–6 | **Design-partner offer:** 50% off first season in exchange for (a) a baseline time log, (b) a case-study right, (c) 2 reference calls. ICP 2 partners host the founder-specialist (barter lodging) | Founder B | 5 signed |
| 5–8 | Onboard design partners; measure baseline (manager hours per hire; check-in stopwatch; room-not-ready count) | Founders A, B | Baseline dataset |
| 8–9 | Publish 2 one-page case studies in Georgian and English, with numbers | Founder C | Sales collateral for Phase 2 |

**Conversion arithmetic [I]:** 60 targets → 20 demos (33%) → 5 design partners (25% of demos). At 3–4 demos per trip day, that is ≈6 Kakheti trip days and ≈4 Tbilisi days.

### 4.2 Phase 2: 5 → 30 hotels (Jan–Apr 2027 pre-season ramp)

| Lever | Execution | Expected yield (Jan–Apr) | Label |
|---|---|---|---|
| **Case-study-led outbound** | Design-partner numbers sent to the remaining ≈55 listed properties plus Batumi (40 listed). Batumi demos in one 3-day trip in Feb | 12–15 hotels | [I] |
| **Referral loop** | Each paying hotel gets 1 free month-equivalent (≈100 GEL credit) per referred paying hotel. Owner-GM networks are dense in Kakheti (301 establishments) | 4–6 | [I] |
| **Hotel associations** | Present at national and regional hotel-association meetings; offer members −10% [G: association names and membership counts unverified] | 2–4 | [G] |
| **PMS vendor referrals** | Referral fee (15% of first season) to local PMS resellers and integrators. OtelMS operates in Georgia with Georgian support **[D]**; Cloudbeds local integrators [G] | 1–3 | [D]/[G] |
| **VET channel** | Sign 1 college academy licence (Feb). Its employer network feeds ICP 2 leads | 1 college + 1–2 hotels | [I] |
| **Rtveli mini-wave** | Kakheti harvest-season hires (Aug–Sep): July campaign to existing Kakheti accounts and new ones | 1–2 | [I] |
| **Total paid adds, Jan–Aug** | | **25** (20 ICP 1 + 5 ICP 2) → **30 accounts** with design partners | [I] |

### 4.3 CAC model

| Cost element | ICP 1 | ICP 2 | Label |
|---|---|---|---|
| Trip cost (fuel, food) per sales day | ≈150 GEL (Kakheti round trip) | ≈150 GEL | [I] |
| Demos per sales day | 3.5 | 3.5 | [I] |
| Demo-to-close | 30% (warm / referral) | 25% (longer decision) | [G] |
| **Trip cost per close** | 150 ÷ (3.5 × 0.30) ≈ **143 GEL** | 150 ÷ (3.5 × 0.25) ≈ **171 GEL** | [I] |
| Referral credit (share of accounts) | +≈30 GEL average | — | [I] |
| Collateral, printing, association fees (allocated) | ≈30 GEL | ≈30 GEL | [I] |
| Barter: hotel hosts founder during onboarding | — | Lodging cost 0 | [I] |
| **Cash CAC** | **≈100–200 GEL** | **≈200–250 GEL** | [I] |
| Founder time (≈6–8 h per close at 27 GEL/h imputed; 4,500 GEL/month ÷ 168 h) | +160–215 | +215 | [I] |
| **Fully loaded CAC** | **≈320–415 GEL** | **≈415–465 GEL** | [I] |

### 4.4 Regional expansion gates (Year 3+)

Enter a new country only when all of the following hold **[I]**:
1. Georgian net revenue retention ≥ 90%.
2. OCR and LLM field accuracy ≥ 95% after routing on the national script (Armenian fails today on Azure/AWS **[D]**).
3. Data-residency architecture costed (Kazakhstan and Uzbekistan localisation laws **[D]**).
4. A **local** founder-specialist hired: Azerbaijan requires a work permit and labour-market test for foreign staff **[D]**.
5. A named list shows ≥ 150 in-segment hotels in the first city cluster.

---

## 5. Financial Model

### 5.1 Assumption set (single source for all tables) [I]

| Parameter | Value |
|---|---|
| Model period | Nov 2026 (M1) – Oct 2027 (M12) |
| Team | 3 founders on sweat equity. **No salaries in Y1.** Roles: A product/engineering; B field operations, specialist visits and Kakheti sales; C partnerships (VET, associations), legal/finance, Tbilisi/Batumi sales |
| ICP 1 price | 650 GEL/season, billed at signing. Design partners 50% |
| ICP 2 price | Setup 2,750 at onboarding. Seasonal 1,800 billed 50% Apr / 50% Jul (or in full in Jul if signed after April). Design partners 50% |
| Success fees | 2 certified hires per ICP 2 hotel × 70% realised × 600 GEL, billed 60% Jun / 40% Sep (Rtveli) |
| VET | 1 college, 2 cohorts × 1,500 (Mar, Sep) |
| Customer adds (ICP 1 / ICP 2) | Nov 2/1 (design partners) · Dec 1/1 (design partners) · Jan 3/1 · Feb 5/2 · Mar 6/1 · Apr 4/1 · May 1/0 · Jul 1/0 (Rtveli) → **23 / 7** |
| Cash COGS | ICP 1: 45 GEL per season (LLM ingestion + inference on small/fast models, messaging, storage). ICP 2: 300 travel per onboarding + 120 compute per season. VET: 150 per cohort |
| Messaging | Telegram bots free **[D]**. WhatsApp non-template and utility-template messages free inside the 24-h service window since 1 Jul 2025 **[D]**. Outbound template reminders priced per message; Georgia's rate-card value [G] is budgeted within the 45 GEL |
| Cash opex | Infrastructure 150 + accounting 150 + software tools 100 per month. Sales travel 250/month Nov–Apr, 100 otherwise. Payments 1.5% of revenue |
| Grant-funded one-offs (10,000) | See §5.5 |
| Taxes | LLC under the Estonian model: 15% profit tax only on distribution **[D]**. VAT registration required above 100,000 GEL turnover **[D]**, not reached in Y1. (Individual-entrepreneur small-business status at 1% turnover tax is an alternative [G: current terms unverified]) |

### 5.2 12-month pro-forma P&L and cash flow (GEL) [I]

| Month | Hotels (cum.) | Revenue | Cash COGS | Gross profit | Cash opex | Grant-funded spend | Net cash flow | Cash balance (grant 10,000 at M0) |
|---|---|---|---|---|---|---|---|---|
| Nov-26 | 3 | 2,025 | 390 | 1,635 | 680 | 1,208 | −254 | 9,746 |
| Dec-26 | 5 | 1,700 | 345 | 1,355 | 676 | 2,208 | −1,529 | **8,217** (minimum) |
| Jan-27 | 9 | 4,700 | 435 | 4,265 | 720 | 2,875 | +670 | 8,887 |
| Feb-27 | 16 | 8,750 | 825 | 7,925 | 781 | 1,875 | +5,269 | 14,156 |
| Mar-27 | 23 | 8,150 | 720 | 7,430 | 772 | 1,250 | +5,408 | 19,563 |
| Apr-27 | 28 | 10,750 | 480 | 10,270 | 811 | 583 | +8,875 | 28,439 |
| May-27 | 29 | 650 | 45 | 605 | 510 | 0 | +95 | 28,534 |
| Jun-27 | 29 | 3,528 | 0 | 3,528 | 553 | 0 | +2,975 | 31,509 |
| Jul-27 | 30 | 6,050 | 885 | 5,165 | 591 | 0 | +4,574 | 36,083 |
| Aug-27 | 30 | 0 | 0 | 0 | 500 | 0 | −500 | 35,583 |
| Sep-27 | 30 | 3,852 | 150 | 3,702 | 558 | 0 | +3,144 | 38,728 |
| Oct-27 | 30 | 0 | 0 | 0 | 500 | 0 | −500 | **38,228** |
| **Total** | **30** | **50,155** | **4,275** | **45,880** | **7,652** | **10,000** | **+28,228** | |

**Revenue mix (Y1) [I]:**

| Stream | Revenue | Share |
|---|---|---|
| ICP 1 licences | 13,975 | 28% |
| ICP 2 setup | 16,500 | 33% |
| ICP 2 seasonal | 10,800 | 22% |
| Success fees | 5,880 | 12% |
| VET | 3,000 | 6% |

### 5.3 Margins and break-even [I]

| Metric | Value | Basis |
|---|---|---|
| **Gross margin, cash basis** | **91.5%** | 45,880 ÷ 50,155 |
| Gross margin, founder labour imputed (specialist visits 3.5 days × 214 GEL; ICP 1 support 3 h × 27 GEL) | **77.3%** | Loaded COGS 11,381 |
| Contribution per hotel (Y1 average) | ≈1,530 GEL | (Revenue − COGS) ÷ 30 |
| **Operating break-even (founders unpaid)** | **Hotel #5–8** | Recurring cash opex 7,652 ÷ 1,530 ≈ **5 hotels**. Including the non-development grant items (legal + VET kit, 4,000): 11,652 ÷ 1,530 ≈ **7.6 hotels** |
| Grant recovered in cash | By Feb 2027 (≈16 hotels) | Cash back above 10,000 |
| Y1 net cash before founder draws | **+28,228 GEL** | |
| Y1 net if founders drew 2,000 GEL gross each from May | −8,492 GEL | Y1 cannot fund salaries |
| **Salaried-founder break-even** | **Year 2, ≈65–75 hotels** | Y2 model (§5.6) |

**Seasonality warning [I]:**
- **65% of Y1 revenue lands Jan–Apr** (32,350 of 50,155 GEL). May, August and October are near zero.
- The cash buffer at M6 (≈28k) must carry the business into the next pre-season. The early-renewal discount (§2.1) moves part of Y2's ICP 1 revenue into Jan.

### 5.4 Unit economics [I]

| Metric | ICP 1 | ICP 2 (36–60 rooms) | Label |
|---|---|---|---|
| Year-1 revenue per account | 650 | 2,000 + 1,500 + 840 (fees) = 4,340 | [I] |
| Year-2+ revenue per account | 650 | 1,500 + 840 + 500 (refresh) = 2,840 | [I] |
| Cash gross margin | 93% | ≈88% | [I] |
| Seasonal renewal (retention) | 70% | 80% | **[G]** (`HSA` §3.2 assumed 30% annual logo loss for seasonal SMB) |
| Expected lifetime (seasons) | 1 ÷ 0.30 ≈ 3.3 | 1 ÷ 0.20 = 5 | [I] |
| **LTV (cash GP)** | 605 × 3.3 ≈ **2,000** | 3,820 + 2,500 × 4 ≈ **13,800** | [I] |
| Cash CAC | 100–250 | 200–250 | [I] |
| **LTV / CAC, cash basis** | **≈8–20×** | **≈55–69×** | [I] |
| LTV / CAC, fully loaded (loaded CAC; imputed support and specialist labour) | ≈**4.2×** ((605 − 81) × 3.33 ≈ 1,745 ÷ 415) | ≈**23×** | [I] |
| CAC payback | < 1 season | < 1 season | [I] |

**Reading [I]:**
- The **>5× LTV/CAC target holds for ICP 2 on every basis, and for ICP 1 on a cash basis.**
- ICP 1 fully loaded (≈4.2×) clears the common ≥ 3× threshold, but not 5×. ICP 1's economics depend on staying self-serve: every extra support hour per season costs ≈0.2× of LTV/CAC (27 GEL × 3.33 seasons ÷ 415).

**Churn mitigation for a seasonal buyer:**

| Lever | Mechanism |
|---|---|
| **Hibernate, don't cancel** | Free off-season retention of the hotel's SOP library, scenario set and staff certification history. Re-activation costs the hotel nothing in setup; leaving means rebuilding from WhatsApp voice notes |
| **Pre-season refresh campaign (Jan)** | Auto-generated "what changed" check on last season's rules plus a 20-min returning-staff refresher. Targets skill decay across the off-season (half of accuracy gains lost in ≈6.5 months **[D]**, Tatel & Ackerman 2025) |
| **Early-renewal discount** | −10% if renewed by 31 Jan |
| **Returning-staff credential** | Staff certified at one partner hotel carry the record to the next season. Hotels value re-hiring certified returners |
| **ICP 2 refresh visit** | 500 GEL annual 1-day visit updates the rule set; a service touchpoint before renewal |

### 5.5 Allocation of the 10,000 GEL GITA grant

| Line item | GEL | Detail | Months spent |
|---|---|---|---|
| **1. Core software infrastructure & AI ingestion pipeline** | **3,500** | | Nov–Apr |
| — LLM / vision API credits (ingestion of ≈40 hotels' documents + trainee inference, small/fast models; Georgian-script OCR test set of 200 pages) | 1,800 | | |
| — Hosting, database, storage, monitoring (12 months prepaid) | 900 | | |
| — WhatsApp Business Platform verification and outbound template budget; Telegram bot (free) | 300 | | |
| — Domain, email, security tooling (backups, secrets management) | 500 | | |
| **2. Pilot deployment & field testing, first 3 Kakheti partner hotels** | **2,500** | | Nov–Feb |
| — Travel: ≈12 Tbilisi–Kakheti round trips (fuel, tolls) | 1,300 | | |
| — Field validation: baseline time logs, stopwatch check-in samples, room-standard photo audits; printed QR / SOP cards for carts and desks | 700 | | |
| — Lodging when barter unavailable; meals | 500 | | |
| **3. Legal & data-protection compliance** | **2,000** | | Dec–Jan |
| — Terms of service, hotel licence agreement, success-fee agreement (prepayment structure; no earnest money) | 900 | | |
| — Personal Data Protection Law compliance: DPIA for automated assessment (Art. 31), consent flows, human confirmation of certification (Art. 19), DPO arrangement **[D]** (`HM` §5.4) | 800 | | |
| — Employment-agency status opinion (Georgia ratified ILO C181 in 2002 **[D]**) for the talent-priority feature | 300 | | |
| **4. Educational content & VET partnership pilot kit** | **2,000** | | Jan–Mar |
| — Generic "fictional Kakheti wine hotel" profile, 40 scenarios in Georgian + English | 1,000 | | |
| — Instructor guide, certification rubric, cohort dashboard setup | 500 | | |
| — Pilot cohort materials and assessment day with partner college | 500 | | |
| **Total** | **10,000** | | |

**Runway effect [I]:**
- The grant covers **all development and pilot cash** in the pre-revenue window (Nov–Jan).
- The lowest cash point in the pro-forma is **8,217 GEL (Dec 2026)**, so the plan survives even if **every design partner paid nothing** (worst case: 8,217 − 3,725 design-partner receipts = ≈4.5k GEL buffer).
- Operating cash flow is self-sustaining from Jan 2027.
- **[G]** GITA's rules on eligible spend for prize money were not verified. The line items above follow typical grant-eligible categories (development, piloting, legal, content).

### 5.6 Year-2 outlook (for salaried break-even) [I]

| Line | Y2 |
|---|---|
| ICP 1 accounts | 70% × 23 retained + 30 new = **46** × 650 = 29,900 |
| ICP 2 accounts | 80% × 7 retained (6 × 2,840 = 17,040) + 12 new (12 × 5,390 = 64,680) = **18** accounts; revenue ≈ 81,700 |
| VET | 3 colleges × 3,000 = 9,000 |
| **Revenue** | **≈120,600 GEL** (crosses the 100k VAT threshold, so VAT registration follows) |
| Cash COGS (≈10%) | ≈12,000 |
| Cash opex | ≈12,000 |
| Founder salaries (3 × 2,000 gross × 1.02 × 12) | ≈73,400 |
| **Net** | **≈+23,000 GEL** |

**Salaried break-even at ≈65–75 hotels** (64 hotel accounts in this Y2 case, plus 3 colleges) **[I]**.

**VAT effect [I]:**
- ICP 2 hotels that are VAT-registered reclaim VAT, so there is no price effect for them.
- ICP 1 individual entrepreneurs below the threshold bear the 18%. Keeping the ICP 1 list price VAT-inclusive at 650 cuts net ICP 1 revenue by ≈15%, about −4.5k GEL in Y2.

---

## 6. Risks to the Commercial Case and the Tests That Close Them

| # | Risk | Effect on this dossier | Pilot test (Nov 2026 – May 2027) | Label |
|---|---|---|---|---|
| C1 | Effect sizes below conservative (shadowing −40%) | Payback > 60 days for ICP 2-S; renewals fall | Time logs across 5 design partners, ≥ 30 hires; pass if median manager-hours per hire −40% or better | [G] |
| C2 | ICP 1 self-serve ingestion needs more than 3 owner-hours (paper binders, Georgian handwriting; `HM` §2.3: Georgian OCR unsupported or experimental) | Support cost erodes ICP 1 margin (each +1 h ≈ −27 GEL) | Measure owner-hours and support-hours on 10 ICP 1 onboardings; pass if median ≤ 3 h owner, ≤ 2 h support | [D]/[G] |
| C3 | Founder-specialist capacity in the Feb–Apr peak (`HSA` §5.3) | ICP 2 onboardings slip past season start | Cap ICP 2 at 7 in Y1 (the model does); Y2 hire a salaried specialist only after 12 signed ICP 2 LOIs | [I] |
| C4 | Seasonal renewal < 70% (ICP 1) | LTV falls ≈30% per −20 pp retention | Hibernate adoption and January renewal rate | [G] |
| C5 | Success fees under-realised (hires quit before 30 days; `PR` §3: high early attrition) | −≈2.9k GEL of Y1 revenue at 35% realisation instead of 70% | Track 30-day retention of certified hires | [G] |
| C6 | Willingness to pay below list price | Revenue −20–40% | Design-partner price interviews plus the Jan conversion rate at list | [G] |
| C7 | Scope creep into PMS replication or OPERA branding | IP exposure (`HM` §3.2) | Product stays PMS-agnostic; no vendor names in product or credential | [I] |
| C8 | Grant eligibility rules differ from the allocation | Re-allocation needed | Confirm GITA terms before first spend | [G] |

---

## 7. Sources

**Internal**
1. `problem.md` (§2.1–2.4 damage model and anchor data; §3.2 VET providers; §5 competitor pricing).
2. `hybrid_model_research.md` (§2 ingestion accuracy; §2.6 three-tier rubric; §4 specialist onboarding; §5.4 data protection).
3. `hotel_simulator_redteam_audit.md` (§1 setup burden; §3 seasonal SaaS economics, budgets, CAC; §3.3 chain academies; §5 services drag; §8 exit criteria).
4. `pms_onboarding_research.md` (§1.2 brittle workflows; §2.4 queue model; §2.5 supervisor shadowing tax).

**Georgian market**

5. Geostat hotels 2025 (via Georgia Today): https://georgiatoday.ge/georgias-hotel-numbers-rise-4-5-in-2025-geostat/ · Geostat 2024: https://geostat.ge/media/72876/Information-on-hotels-and-hotel-type-enterprises---2024.pdf
6. GNTA "Georgian Tourism in Figures 2023" (size bands, brand hotels, regional units): https://api.gnta.ge/storage/files/doc/eng(1).pdf
7. PMCG Hospitality Sector Snapshot (Nov 2024): https://pmcg-i.com/app/uploads/2024/11/Hospitality-Sector-Snapshot-new.pdf
8. Silk Hospitality portfolio: https://silkhospitality.com/ · Radisson Blu Iveria: https://en.wikipedia.org/wiki/Radisson_Blu_Iveria_Hotel · Kvareli Lake Resort: https://kvarelilakeresort.ge/
9. OtelMS (Georgian PMS vendor): https://otelms.com/
10. GITA programmes: https://gita.gov.ge/

**Regional**

11. Azerbaijan hotels: https://www.stat.gov.az/news/index.php?lang=en&id=6170 · Kazakhstan: https://www.ceicdata.com/en/kazakhstan/hotel-statistics/number-of-hotels · Uzbekistan: https://stat.uz/img/news/tourism-and-recreation_p37860.pdf · https://www.uzdaily.uz/en/international-hotel-chains-expand-presence-across-uzbekistan/ · Montenegro: https://monstat.org/eng/novosti.php?id=4094 · https://ec.europa.eu/eurostat/statistics-explained/index.php/Seasonality_in_the_tourist_accommodation_sector
12. OCR language support: https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/language-support/ocr?view=doc-intel-4.0.0 · https://docs.cloud.google.com/vision/docs/languages
13. Data localisation: Kazakhstan https://www.morganlewis.com/-/media/files/publication/outside-publication/article/2024/data-localization-laws-overview-kazakhstan.pdf · Uzbekistan https://www.loc.gov/item/global-legal-monitor/2021-05-07/uzbekistan-new-requirements-for-uzbek-citizens-personal-data-localization-enter-into-force/ · Azerbaijan work permits: https://migration.gov.az/en/page/75

**Costs, tax and law**

14. WhatsApp Business Platform pricing (per-message since 1 Jul 2025; service-window rules): https://developers.facebook.com/docs/whatsapp/pricing · Telegram Bot FAQ: https://core.telegram.org/bots/faq
15. Georgian taxation (profit tax 15% on distribution; PIT 20%; VAT 18%, threshold 100,000 GEL): https://en.wikipedia.org/wiki/Taxation_in_Georgia_(country) · Pension contributions: https://taxsummaries.pwc.com/georgia/individual/other-taxes
16. Georgia Personal Data Protection Law (2023): https://matsne.gov.ge/en/document/view/5827307 · ILO C181 ratifications: https://en.wikipedia.org/wiki/Private_Employment_Agencies_Convention,_1997

**Learning and decay evidence**

17. Sitzmann (2011): https://onlinelibrary.wiley.com/doi/10.1111/j.1744-6570.2011.01190.x · Tatel & Ackerman (2025): https://psycnet.apa.org/manuscript/2026-23054-001.pdf
