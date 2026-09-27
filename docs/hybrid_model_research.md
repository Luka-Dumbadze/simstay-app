# Hybrid Model Research: Forward-Deployed Simulation Academy & Seasonal Talent Marketplace

**Subject:** a hybrid hospitality training and talent platform built from four parts:
- a legally clean PMS-procedure simulator;
- a final-mile bridge onto a licensed OPERA Cloud training tenant;
- forward-deployed onboarding specialists who capture each hotel's rules on site;
- a winter/spring training academy that fills pre-sold summer jobs.

**Read-only inputs:**
- `pms_onboarding_research.md` (the problem baseline; cited as `BL`);
- `solution_redteam_audit.md` (cited as `RTA`);
- `hotel_simulator_redteam_audit.md` (cited as `HSA`).

**Date:** 2026-09-27.

**Evidence labels:**
- **[D]** documented fact from a named source (§9);
- **[I]** modelled derivation, design deduction or economic formula, with inputs stated;
- **[G]** a critical gap that no available evidence closes.

**Currency:** 2.7 GEL/USD and 3.1 GEL/EUR **[I]**.

**Not legal advice.** The Georgian law in §5 is taken from English translations on matsne.gov.ge and needs review by local counsel before any contract is drafted.

---

## 0. Verdict

The hybrid model is a direct answer to the two prior audits. It fixes **two of their S1 findings**, partly fixes **two more**, and leaves **one S1 (economic scale) only conditionally solved**. It is the first configuration in this research series with a plausible path to a Georgian pilot that is legally clean and has positive unit contribution. It is not yet shown to be a venture-scale business.

| Prior finding | Status under the hybrid | Mechanism | Label |
|---|---|---|---|
| `HSA` H1: setup burden leads to 57–92% abandonment | **Resolved (conditional).** GM time drops to ≈3 h. Modelled completion rises to ≈83–94% | Specialist on site 2–3 days, plus an automated ingestion pipeline with confidence routing (§2, §4) | [I] |
| `HSA` H3/H4: the interface trilemma (no surface is legal, transferable and orchestrable) | **Mostly resolved by splitting the curriculum.** | State-heavy drills (EOD, walks, routing edge cases) run in the original-UI simulator, where each trainee has an isolated business date. Navigation fidelity comes from a few hours on a **licensed** OPERA Cloud training tenant that the academy never has to reset per trainee (§1.5, §3.4) | [I] |
| `RTA` §1.2: fidelity versus liability squeeze | **Mitigated.** | Follows the Navitaire / SAS / Lotus boundary. Reproduce functional logic and command semantics. **Do not** reproduce graphical screens, icons, manual text or trade dress (§3.2) | [D]/[I] |
| `RTA` §1.3: the hotel's licence bars config export | **Sidestepped.** | Configuration is captured by the specialist from the hotel's own documents, interviews and floor observation. Nothing is extracted from OPERA's data structures (§2.1) | [I] |
| `HSA` H9: rule-conflict false failures | **Mitigated by design.** | A three-tier rubric removes discretionary rules from the certification stream (§2.6) | [I]/[G] |
| `HSA` H6/H7: seasonal subscribe-train-cancel; LTV:CAC 1.8 | **Reframed.** Revenue is no longer a subscription the hotel can cancel. It comes from a setup fee plus per-seat placement fees that recur with each hiring season | §4, §5 | [I] |
| `RTA` §3.3/§3.5: stipend and voice costs make placements negative; fixed-cost wall | **Partly open.** Text-first, no-stipend seats earn **≈300–900 GEL** each. Voice or a stipend erases most of that. Break-even needs **≈150–250 hotels, or ≈450–700 seats a year** | §6 | [I]/[G] |

**Five findings that decide the design:**

1. **ThinkBliss proves a licensed fictional OPERA Cloud property can be sold as training** **[D]**.
   - It runs a 99-room "Bliss Hotel" with 10 room types and a café on a real OPERA Cloud tenant.
   - Its self-paced course costs about $199 with 90 days of sandbox access.
   - It says nothing about how it licenses the tenant **[G]**.
   - Oracle's partner-programme rules forbid using partner demo tenants to train end users **[D]**. So the legitimate route is a **negotiated customer subscription whose licence names training use**, not an OPN demo licence **[I]**.
2. **The legal boundary for a clone is clearer than the prior audit implied** **[D]**.
   - *Navitaire v easyJet* (UK, 2004), an airline reservation system case, held the following were **not** protected: business logic, command names, the command set, character-based screens.
   - Only the **graphical screens and icons** were protected, as artistic works.
   - *SAS v WPL* (CJEU) adds that **manual text** is protected expression.
   - The design line follows directly: reproduce functions and semantics; author every pixel and every word yourself.
3. **Medium fidelity transfers best** **[D]**.
   - A 2022 meta-analysis found medium-fidelity simulators give the best transfer of training.
   - High fidelity helped only trainees who were already skilled.
   - This removes the pedagogical pressure toward a pixel clone. Negative-transfer risk is handled instead by a short final-mile session on the real UI (§3.4).
4. **Automated ingestion saves drafting time, not review time** **[D]/[I]**.
   - The best document parsers still fail ≈20% of olmOCR unit tests.
   - Zero-shot LLM contract clause extraction reaches F1 ≈0.52–0.64.
   - Natural-language-to-logic translation reaches 44–87% depending on formalism and domain.
   - Confidence routing, which sends the least-confident 20% of fields to a human, lifts accuracy on the automated remainder from 73% to 99% on invoices.
   - Net effect: specialist back-office time falls from `HSA`'s 21–50 h to **≈7–11 h per hotel**. Every house rule still gets a human read.
   - **Georgian-script OCR is unsupported or experimental on Azure, AWS and Google** **[D]**, a live gap for Georgian-language binders.
5. **The guaranteed-job academy is legally buildable in Georgia without debt instruments** **[D]/[I]**. The pieces:
   - Civil Code Art. 327 preliminary contracts with **objective** conditions (Art. 92 voids purely discretionary ones);
   - seasonal fixed-term employment (Labour Code Art. 12 exempts seasonal work from the 30-month conversion);
   - **no** candidate fees and **no** repayment clauses (no Georgian statutory basis for training repayment; `RTA` §1.5 precedents);
   - hotel reservation fees structured as prepayments, **not** as "ბე" earnest money, which would make the academy liable for double repayment on non-delivery (Civil Code Art. 421–423).

---

## 1. The "Virtual Hotel" Precedent and Oracle Licensing Pathways

### 1.1 Case study: ThinkBliss / Bliss Hotel Vancouver

| Attribute | Finding | Label |
|---|---|---|
| Operator | Bliss Hospitality Talent & Education, Vancouver, BC (thinkbliss.ca). A combined training, coaching and staffing firm | [D] |
| Environment | "Virtual Hotel Vancouver": "a fully functional Opera Cloud environment" covering front desk, housekeeping, café, spa and in-room dining. Students get "real log-ins" to a "cloud sandbox" | [D] |
| Property model | Fictional **Bliss Hotel**: 99 rooms, 10 room types (CK, C2Q, SK, S2Q, JSK, JS2Q, OBK, OB2Q, PS, RS), plus "Bliss Cafe" outlets | [D] |
| Platform | OPERA Cloud, not OPERA 5. OPERA 5 appears only as migration background | [D] |
| Products | Self-learning with system practice: ≈$199 (currency implied CAD), 37 lessons in 7 modules, **90 days of sandbox access**, certificate. Level 1 (beginner) and Level 2 (supervisor) one-day live online workshops inside the Virtual Hotel; prices unpublished | [D] |
| Scale claim | "Over 2,000" people trained | [D] (self-reported) |
| Credential claim | "Industry-recognized", "recognized by brands such as Four Seasons, Marriott and Hyatt" | [D] as a marketing claim; independent verification [G] |
| Licence basis | Not disclosed. No OPN, WDP or reseller relationship named | **[G]** |

**What the precedent proves [I]:**
- A third party can sell OPERA Cloud hands-on practice on a fictional property at consumer prices, in public, for years, with no reported enforcement.
- A **single shared tenant with a fictional catalogue** is commercially sufficient for navigation-fidelity training. The model does not need the placement hotel's own catalogue inside OPERA.

**What it does not prove [I]:**
- **Isolation and resets.** A 99-room shared tenant has one business date and one inventory (`HSA` §2.3). Self-paced learners working in parallel collide on inventory, and End of Day (EOD) can only be an instructor-run event. ThinkBliss's product shape fits this: self-paced navigation plus instructor-led one-day workshops, not per-learner night-audit drills.
- **Property fit.** Bliss Hotel codes are not the placement hotel's codes. The "nothing teaches this hotel's codes" gap (`BL` §1.1) stays open inside the tenant.
- **Licence form.** Whether ThinkBliss holds a standard subscription, a negotiated training licence or something else is unknown **[G]**. That determines whether the model can be replicated in Georgia.

### 1.2 How training providers obtain multi-user OPERA Cloud instances

| Pathway | Who qualifies | What it grants | Commercial classroom use? | Cost | Label |
|---|---|---|---|---|---|
| **Oracle Workforce Development Program (WDP)** | Educational institutions | Rights to Oracle University curriculum, classroom software access, free support during membership, 50% off instructor courses, 25% off exam vouchers, WDP logo | Institution-delivered courses, yes. For-profit private trainers: eligibility not established | Membership fee not published; a snippet suggests it is waived for teaching departments (unverified) | [D] flyer 2018; [G] current OPERA terms (page unreachable) |
| **Oracle Academy (hospitality curriculum)** | Academic member institutions | Free OPERA Cloud PM and S&E digital courses and how-to guides in 5 languages | Curriculum only. **No evidence an OPERA Cloud tenant is included** | Free to members | [D] from snippets; tenant [G] |
| **OPN Level 1 (Principal)** | Commercial partners | Can order cloud services "for test, development and demonstration purposes" | **No.** OPN enablement benefits "may not … be extended to your end users, nor … used by you to provide training to your end users" | US$5,000/yr (Level 0 $500 gives no demo licences) | [D] OPN policy 2026 |
| **OHIP partner sandbox** | Integration partners | Shared, **API-only** sandbox. No OPERA UI | No (no UI to train on) | Pay per call; 2-hour consulting blocks | [D] |
| **Direct OPERA Cloud subscription for a fictional property** (the probable ThinkBliss route) | Any customer Oracle will contract with | A production-grade tenant | **Only if the order form or licence names training use**. The standard Cloud Services Agreement "competitive to Oracle" clause (`RTA` §1.3) is the risk | No list price. A third-party site claims ≈$2,500/month for 50 rooms, unverified | [D] clause; [I] route; [G] price |
| **Teaching-hotel model** (Auburn University / The Laurel Hotel) | A school operating a real hotel | Students use the hotel's production OPERA Cloud under its licence | Within the institution | Bundled with hotel operations | [D] |

**Inference [I]:** the only pathway that is both (a) open to a private Georgian venture and (b) clean for commercial classroom use is a **direct subscription for a fictional training property with explicit training-use language negotiated into the order**. The fallback is to **partner with an accredited Georgian VET or hospitality institution** that joins WDP or Oracle Academy and hosts the OPERA component inside its own programme, with the venture supplying the simulator, specialists and placement. Whether WDP currently grants an OPERA Cloud tenant is **[G]** and is the first question to put to Oracle.

### 1.3 Phase 1: the pre-licensing mimic (legal architecture)

Phase 1 needs no Oracle relationship. Its legal basis is not "we are too small to sue". It is that the artefact **reproduces only unprotected elements** (§3.2). Five controls:

1. **Clean-room authoring [I].**
   - The simulator's specification is written from functional descriptions: hotel accounting logic, what the specialist sees on the floor, and generic front-office textbooks.
   - Its UI is designed by people who have **not** been given OPERA screenshots.
   - Keep a dated specification log. *Rimini* (9th Cir. 2023/24) turned on copies of Oracle software held on Rimini's own systems ("cross-use"). *Epic v TCS* ($140M, affirmed 2020) turned on unauthorized downloading of portal documentation **[D]**.
   - Rule: **no OPERA install, portal content, manual text or screenshot enters the venture's systems.**
2. **Original naming layer [I].**
   - Concepts are generic: folio windows, routing, room/tax/incidentals, out-of-order versus out-of-service, business date. They exist across PMS vendors and in accounting practice.
   - OPERA-specific control names (`RTA` §1.2 rated these Medium–High) are **not** reproduced. The simulator uses its own policy-switch names.
3. **Data model independence.**
   - *Navitaire* found no infringement in the database schema **[D]**.
   - Build the state model from double-entry folio logic, not from OHIP schemas. The schemas are UPL-licensed (`RTA` §1.2), but using them invites an argument that the simulator is a derivative of OPERA's data structures **[I]**.
4. **Referential trademark use only.**
   - Acceptable: "Prepares front-office staff for properties running Oracle Hospitality OPERA Cloud, Cloudbeds and other PMSs. Not affiliated with or endorsed by Oracle."
   - Not acceptable: "OPERA Simulator", Oracle logos, or OPERA-styled credential names.
   - This meets the US *New Kids* three-part test and the EU Art. 14(1)(c) EUTMR honest-practices standard **[D]**, subject to the stricter 2024 CJEU *Audi* reading **[D]**.
5. **Credential naming.** The credential certifies **front-office transaction competence**, not "OPERA certification". This keeps clear of Oracle University credentials and of the false-endorsement exposure in `RTA` §1.4 **[I]**.

### 1.4 Phase 2: official licensing roadmap

| Step | Trigger | Minimum requirement | Capital / cost | Label |
|---|---|---|---|---|
| 2a. Oracle inquiry | Pilot ≥ 3 hotels signed | Written request to Oracle Hospitality (Georgia's regional partner or Oracle direct) for a **training-use OPERA Cloud property**, asking explicitly about the "competitive" clause | Legal review ≈2–5k GEL | [I] |
| 2b. Training tenant | Oracle accepts | Fictional ≈40–60 room property (Georgian-style catalogue: wine packages, transfers, corporate AR) | If the unverified ≈$2,500/month for 50 rooms holds: **≈$10k for a 4-month pre-season window, ≈$30k/yr** | [D] claim / [G] actual |
| 2c. Institutional wrapper (alternative) | Oracle declines a direct training licence | MoU with an accredited Georgian VET college (Skills Agency-accredited) that joins WDP / Oracle Academy | Fee [G]; the college takes a share of trainee funding | [D] WDP benefits / [I] |
| 2d. OPN Level 1 | Only if the venture also builds integrations (e.g., DeskGuard-type verifiers from earlier research) | $5,000/yr. **Not** usable for training | [D] | |

**Capital requirement [I]:** Phase 2 is not capital-intensive by venture standards: ≈$10–30k a year for the tenant plus legal. The gating factor is **Oracle's willingness**, which is **[G]**. **ThinkBliss's continued operation is the strongest available evidence that such an arrangement is obtainable.**

### 1.5 Enforcement realities

| Evidence | Finding | Label |
|---|---|---|
| Oracle actions against training providers, bootcamps or educational simulators | **None found.** Oracle's documented copyright suits target support and hosting businesses (Rimini, SAP/TomorrowNow $356.7M, Perry Johnson) | [D] (absence of reports ≠ absence of letters) |
| Closest vendor–trainer disputes | SAP/BusinessObjects (2009) sent letters to training providers over screenshots (copyright) and product names (trademark). No lawsuit found. *Epic v TCS*: unauthorized portal access, $140M. Epicor: a services firm running a copied instance | [D] |
| Aviation analog | No Boeing, Airbus, Honeywell, Collins or Thales suits found against sim developers over cockpit or FMC replication. The only documented OEM intervention concerned **redistributed copyrighted manuals** (PMDG) | [D] |
| Third-party OPERA courses using screenshots and videos (Udemy, colleges, Reception Academy, South London College £349 diploma with "3 months software access") | Operating openly; licence status unknown | [D]/[G] |

**Enforcement model [I]:**

| Tier | Conduct | Likely consequence |
|---|---|---|
| 1 | Accessing or copying the real software or its protected content without authorization: portal documents, installs, screenshots | Litigated at scale (*Epic*, *Rimini*, *Epicor*) |
| 2 | Trademark and screenshot use in training marketing | Draws letters (SAP 2009) |
| 3 | Independently authored functional simulators | No recorded action |

Phase 1 must stay strictly in tier 3. The venture's small size in Georgia lowers the probability of action but not its impact. `RTA` §1.1's point stands: winning after years of litigation is still a commercial loss.

---

## 2. Automated Knowledge Ingestion: PDF to Scenario to Grading Logic

### 2.1 Pipeline architecture [I]

```
 SOURCES                     STAGE 1: PARSE              STAGE 2: EXTRACT              STAGE 3: COMPILE
 rate binders (PDF/scan) ──► layout model + VLM    ──►  typed facts with          ──►  Property Knowledge Graph (PKG)
 corporate contracts         (table structure,          provenance spans               rooms, rates, packages,
 house-policy docs           reading order)             {value, page, bbox,            trx-code map, corporate billing
 past folios (redacted)                                 confidence}                    conventions, policy rules
 specialist interview notes                                                            (defeasible: default + exceptions)
 specialist floor-observation log                                  │                            │
                                                                   ▼                            ▼
                                                     STAGE 2b: CONFIDENCE ROUTER     STAGE 4: SCENARIO SYNTHESIS
                                                     low-confidence 20% → human       scenario graphs generated
                                                     cross-checks (totals, dates,     from PKG × task-class templates
                                                     code uniqueness)                           │
                                                                                                ▼
                                                     STAGE 5: EXECUTABLE VALIDATION   ◄── every scenario is run by a
                                                     expected end state computed by        reference solver on the
                                                     the simulator engine, not by          simulator's state engine;
                                                     the LLM                                unreachable states rejected
                                                                                                │
                                                                                                ▼
                                                     STAGE 6: HUMAN SIGN-OFF  specialist (all rules) → GM (policy
                                                     summary + disputed exceptions only)
```

**Key design choice [I]:** the LLM **never writes the grading answer**.
- It proposes facts and scenario narratives.
- The expected transactional end state is **computed** by running a reference solution through the simulator's deterministic state engine against the property knowledge graph (PKG).
- Hallucinations therefore surface as **unreachable or inconsistent states** (a routing target with no payee, a package whose posting rhythm contradicts its rate), not as silently wrong answer keys.
- This is the main defence against the "configuration errors become correct answers" failure in `HSA` §1.4.

**Legal note [I]:** the pipeline ingests **the hotel's own documents** (binders, contracts, policies) plus specialist observation. It does **not** export OPERA configuration. This sidesteps the Cloud Services Agreement "data structures … produced by programs" clause (`RTA` §1.3). Any values the hotel types from its own PMS screens into a questionnaire are its own business data. The *schema* the venture uses is its own.

### 2.2 Scenario graph schema [I]

```yaml
scenario:
  id: CORP-SPLIT-017
  pkg_version: hotel-042@2027-03-14          # frozen snapshot of the property graph
  task_class: folio_routing                  # maps to BL §1.2 brittle workflow
  initial_state:
    business_date: 2027-05-12
    inventory: {K2: {sellable: 3}, T2: {sellable: 0, OOO: 1}}
    reservations: [{id: R1, guest: persona.corp_traveller, rate: CORPGEO, nights: 2}]
    profiles: [{company: "Kakheti Wine Co.", ar_account: AR-118, billing: {room: company, tax: company, incidentals: guest}}]
  persona:
    goal: check in, fast; mentions "company pays everything" (partially false)
    register: ka-informal                    # Georgian hospitality vernacular
    pressure: queue_length=3
  beats:
    - if: agent_asks_billing_instructions → reveal: "only room and tax"
    - if: agent_routes_all_to_company → inject at checkout: company rejects minibar charge
  expected_mutations:                         # computed by reference solver, not LLM
    - routing: {window: 2, payee: AR-118, codes: [ROOM, ROOM_TAX]}
    - window_1: {payee: guest, method: card_on_file}
  rubric:
    hard:  [routing_payee_correct, tax_follows_room, incidentals_to_guest]   # certification stream
    house: [corporate_id_verified_per_policy_P07]                            # signed, versioned
    discretion: [offered_late_checkout]                                     # coached, never pass/fail
```

### 2.3 Accuracy evidence by stage

| Stage | Best documented performance | Implication | Label |
|---|---|---|---|
| Layout and table parsing | OmniDocBench v1.6: specialist small models lead (PaddleOCR-VL 96.3 overall, TEDS 94.8). Gemini 3 Pro TEDS 89.2. olmOCR-Bench: best systems pass ≈80–82% of unit tests. RD-TableBench (vendor): Reducto 90.2%, Azure 82.7%, Textract 80.9% on complex merged-cell tables | Rate grids will have **5–20% cell or structure errors**. Row/column totals and re-render diffs are mandatory | [D]/[I] |
| Field extraction | DocVQA ≈96% (Qwen2.5-VL). DocILE invoices: LLM baseline **73.3% field accuracy**. Templated documents: fine-tuned small VLM F1 0.98, while a frontier zero-shot model scored F1 0.47 on dates through over-extraction | Zero-shot on idiosyncratic hotel binders sits near the invoice baseline. Accuracy comes from routing and validation, not the model alone | [D] |
| Contract clauses (corporate agreements) | CUAD via ContractEval: F1 0.52–0.64 for frontier models. "Laziness" (wrongly answering "no clause") is a named failure | Corporate billing terms (who pays incidentals, invoice requirements) **need human read-through** | [D] |
| Policy to formal rules | Natural language to temporal logic zero-shot: **44% exact match**. PolicyKG deontic classification 86.9%, rule-shape F1 0.87 in its home domain, **falling to 0.37 on leases**. Tax code to Prolog covered only 66% of rules. BREX names long-range rule dependencies as the "Logic Gap" | **15–40% of translated house rules need human correction** [I]. Exceptions and defeasible branches are the weak point | [D]/[I] |
| Long documents | Hallucination rises with context: best 1.2% at 32K tokens, best 3.2% at 128K, and no model under 10% at 200K | Chunk by document section. Never feed a whole binder in one call | [D] |
| Automated hallucination detection | FaithBench: detectors reach only 50–62% balanced accuracy | An LLM checking an LLM is **not** an acceptable verifier. Use deterministic checks (Stage 5) | [D] |
| Confidence routing | DocILE: routing the lowest-confidence **20%** of fields to a human lifts accuracy on the automated **80% from 73.3% to 99.1%**. Combined signal AUC 0.928 (token probability alone 0.705) | The load-bearing mechanism for keeping review hours low | [D] |
| Georgian script | Google Vision: Georgian **experimental**. Azure Document Intelligence v4: **not supported** for extraction. AWS Textract: **not supported**. Tesseract `kat`: anecdotally fine on clean fonts. **No published character error rate** for any system | Georgian binders depend on frontier multimodal LLMs, with **unmeasured** accuracy. An in-house Georgian test set of ≥200 pages is a pre-pilot requirement | [D]/[G] |

### 2.4 Human-in-the-loop overhead for a 50-room property [I]

**Extractable fact inventory:**

| Object | Count | Fields each | Fields |
|---|---|---|---|
| Rate codes | 30 | 6 | 180 |
| Packages | 10 | 5 | 50 |
| Transaction-code map | 80 | 2 | 160 |
| Corporate accounts | 15 | 6 | 90 |
| Room types | 6 | 4 | 24 |
| **Total** | | | **≈500 fields** |

**Review time per hotel (specialist unless noted):**

| Review task | Basis | Hours |
|---|---|---|
| Routed low-confidence fields | 20% × 500 = 100 fields at 0.5 min | 0.8 |
| Random audit of auto-accepted fields | 5% × 400 = 20 fields at 1 min | 0.3 |
| House rules: every rule read | 30 rules × 4 min | 2.0 |
| House rules: rewrite of failed translations | 15–40% × 30 = 5–12 rules × 10 min | 0.8–2.0 |
| Scenario review | 40 scenarios × 4–6 min; end states pre-validated by solver, so review checks narrative and relevance | 2.7–4.0 |
| Integration of floor-observation notes | | 0.5–1.0 |
| **Specialist back-office total** | | **≈7–10 h** |
| **GM time:** exception interview on disputed or unwritten rules, plus sign-off walkthrough | | **≈2–3 h (GM)** |

**Comparison:** `HSA` §5.2 estimated 21–50 h of vendor time and 22–45 h of implied GM time. The pipeline plus specialist brings this to **≈7–10 h of back-office work plus ≈16–20 h on site (§4), with ≈3 GM hours**. That meets the `HSA` §8 exit criterion of "≤ 3 GM-hours to first trainee" **[I]**. It does **not** meet the "≤ 5 h onboarding labour" criterion; §4 prices the remainder instead.

**[G]** None of these review timings is measured on hotel documents. No benchmark on hospitality rate binders exists.

### 2.5 Hallucination risk register for grading benchmarks

| Risk | Where it enters | Control | Residual | Label |
|---|---|---|---|---|
| Invented rate or package attribute | Stage 2 | Provenance span required; no span means rejection | Low | [I] |
| Table misparse (merged cells, wrong season column) | Stage 1 | Totals and re-render diff; routing | Low–Medium | [D]/[I] |
| Missed exception ("laziness") in a corporate contract | Stage 2 | Specialist reads every corporate contract in full | Medium | [D]/[I] |
| Wrong defeasible structure (exception encoded as default) | Stage 3 | Every rule human-read; GM exception interview | Medium | [D]/[I] |
| Impossible or contradictory scenario | Stage 4 | Reference solver rejects unreachable states | Low | [I] |
| Floor practice ≠ documented rule | Stage 3 | Specialist observes ≥ 1 live shift; conflicts go to the "house-disputed" tier (§2.6) | Medium | [I]/[G] |
| Staleness (new season's rates) | Over time | Seasonal refresh visit or remote refresh (§4.4); PKG versioned per scenario | Medium | [I] |

### 2.6 Determinism boundary: the three-tier rubric

`HSA` §4.2 showed that a 5% rate of conflicts between the configured rubric and the supervisor's rules turns certification into a coin flip (P(cert | p = 0.97) ≈ 48%). The fix is to **choose what gets certified**, not to make the grader smarter **[I]**:

| Tier | Content | Graded how | Enters certification (SPRT) stream? |
|---|---|---|---|
| **H: Hard invariants** | Accounting and inventory truths that hold in any PMS: folio balances, routing has a payee, tax follows room when room is routed, OOO removes inventory while OOS does not, EOD prerequisites (due-outs, cashier balance) | Deterministic, from the state engine | **Yes** |
| **P: Signed house policy** | Rules the specialist has seen practised on the floor **and** the GM has signed (versioned, dated) | Deterministic against the signed version | **Yes**, only once the rule has survived one cohort without a dispute |
| **D: Discretion / disputed** | Exception branches, "use judgement" rules, anything contested by a supervisor | Coach review: "escalated or justified" versus "unjustified" | **No.** Reported to the hotel as coaching data only |

**Effect [I]:**
- If tier P holds only floor-validated, signed rules, the conflict rate on the certified stream approaches the `HSA` §4.2 **0–2%** rows. At those rows P(cert | p = 0.97) is **96.9–84.8%** rather than 48%.
- Disputed rules generate **configuration tickets, not failed trainees**. That removes the trust-collapse loop in `HSA` §4.3.

**Still open [G]:**
- The true conflict rate after floor validation is unmeasured.
- `RTA` §4.3's finding that SPRT under correlated items gives 9–38% false certification is **not** fixed by tiering. The certification test should move to a fixed-length, stratified test with task-class quotas, or use a dependence-aware sequential test, before any "Day-1 ready" claim is marketed.

---

## 3. The Interface "Golden Middle"

### 3.1 The flight-simulator precedent

| Actor | Legal basis for complexity replication | Label |
|---|---|---|
| **PMDG** (737/777) | Boeing **trademark** licence (terms unpublished). EULA forbids any real-world training use. Boeing's own manuals were once bundled, then removed at Boeing's request or after a licence change | [D] |
| **Fenix A320; Aerosoft/ToLiss A330, A320/321** | Marketed as officially licensed by Airbus. Fenix built from its own 3D scans | [D] |
| **FlyByWire A32NX** | Open source (GPLv3 code, CC BY-NC assets). **No Airbus licence.** A "completely custom" FMS that reproduces Honeywell FMS behaviour. Years of operation, no reported action | [D]; "no action" [I] |
| **Nav data (Navigraph)** | **Licensed** from Jeppesen: data is bought, not recreated | [D] |
| **Professional FSTDs** | FAA Part 60: OEM data "preferred", other sources allowed if accepted. EASA procedures trainers (FNPT) may be **generic**, validated for "correct trend and magnitude". Many third-party 737 FNPT II devices exist | [D] |

**What transfers to a PMS simulator [I]:**
- **Brand and data are licensed; behaviour is rebuilt.** The aviation market separates three things:
  - trademarks, which are licensed for marketing;
  - reference data (navdata), which is licensed;
  - system behaviour (FMS logic), which is rebuilt from observation and public description.
- The PMS analogues:
  - the OPERA name is used only referentially;
  - the hotel's own catalogue is supplied by the hotel, the equivalent of licensed navdata;
  - folio, routing, inventory and EOD behaviour are rebuilt independently.
- **OEM enforcement targeted manuals, not behaviour.** The PMS equivalent: never embed Oracle user-guide text (SAS v WPL; the Oracle documentation notice quoted in `RTA` §1.2).
- **Generic procedures trainers are a recognised category.** EASA accepts generic FNPTs for procedural training. The simulator's positioning should be **"generic procedures trainer with type-bridging"**, not "OPERA replica".

### 3.2 The legal line, element by element

| Element | Reproduce? | Authority | Label |
|---|---|---|---|
| Business logic: routing semantics, window concept, tax dependency, OOO vs OOS inventory effect, EOD prerequisites | **Yes** | *Navitaire* (business logic not protected); SAS v WPL (functionality not protected); Lotus (method of operation) | [D] |
| Command and keyboard semantics: shortcut *functions*, three-letter code conventions | **Yes, as behaviour.** Use your own key assignments by default, with an optional "familiar keymap" layer | *Navitaire* (commands and command set not protected); Lotus. US circuit split noted in `RTA` §1.1 | [D]/[I] |
| Field sets required by the domain (arrival, departure, rate, payment, payee) | **Yes** | Scènes à faire / merger (*Apple v Microsoft*, *Data East*) | [D] |
| Step **sequence** that is domain-dictated (you cannot route before the reservation exists) | **Yes** | Merger / accounting logic | [D]/[I] |
| Step sequence and screen organisation copied from OPERA *by choice* ("same field order") | **No** | `RTA` §1.2 (Fed. Cir. SSO reasoning); *Navitaire* protected GUI screens | [D]/[I] |
| Graphical screen layouts, icons, colour schemes, trade dress | **No** | *Navitaire* (GUI screens and icons protected as artistic works) | [D] |
| Manual, help text, field help, error messages | **No** | SAS v WPL (manual text protected); Oracle documentation notice | [D] |
| OPERA Control names, numbering conventions such as windows 101–108 | **No.** Use your own names and numbering | `RTA` §1.2 (Medium–High) | [I] |
| Screenshots in marketing or teaching material | **No** | SAP 2009 letters | [D] |
| "OPERA" in product or credential name | **No.** Referential description only, with disclaimer | *New Kids*; EUTMR Art. 14(1)(c); CJEU *Audi* 2024 | [D] |

**US caveat [I]:** *Navitaire* is UK and *SAS* is EU law. In the US, Oracle's Federal Circuit SSO precedent was never repudiated (`RTA` §1.1). A US launch would need a fresh freedom-to-operate opinion. Georgia's copyright law follows the EU model (EU Association Agreement approximation), but no Georgian case law on UI protection was found **[G]**.

### 3.3 UI architecture: preserving complexity without cloning

The goal is **cognitive and functional fidelity**: the same decisions, dependencies, state traps and time pressure, delivered through an originally designed surface **[I]**.

| Complexity to preserve (from `BL` §1.2) | Simulator mechanism | Why it is not a clone |
|---|---|---|
| Multi-window state; nested modals; unsaved-state loss | A workspace with **stackable task panels**. Each panel owns a transaction draft with explicit commit, cancel and partial-save semantics. Abandoning mid-flow leaves the same half-configured state the real system would | Panel system, visual language and layout are original. Only the *state semantics* (drafts, partial commits) are reproduced |
| Billing windows and routing | A **folio split board**: N windows (property-configurable, default 8). Routing rules shown as rule cards (source code → target window, payee, limit type). Invisible-rule behaviour preserved: charges land by rule, not by where the user is looking | Window *concept* is generic across PMSs. Numbering, labels and layout are original. Comp windows use the venture's own convention |
| Alphanumeric codes | The hotel's own codes from the PKG (e.g., `CORPGEO`, `PKGWINE2`), the equivalent of licensed navdata | The codes belong to the hotel |
| Keyboard navigation under queue pressure | Full keyboard command layer. Default keymap original; optional per-PMS familiar-functions profile maps *functions* to keys | Commands and key functions are unprotected (*Navitaire*, Lotus). Visual cues remain original |
| Lookups (profile, AR account) with ambiguity | Deliberately *hard* lookups: near-duplicate profiles, similar AR names, stale records | Closes the "easy lookup" gap `RTA` §2.1 flagged |
| Property-specific behaviour switches | Policy switches from the PKG (e.g., "inspected status required") | Own names; driven by the hotel's reality, not an Oracle control catalogue |
| Per-trainee business date and EOD | Every trainee session owns an isolated tenant-in-memory with its own business date and inventory. Resets in milliseconds; EOD drills run in parallel | Solves `HSA` H4, which no shared real tenant can |
| Environmental stressors (`RTA` §2.2) | Scripted interruptions: phone ring, card-terminal timeout event, key-encoder fault, queue visualisation, colleague interruption | Partial. Physical device handling stays a live-shift skill **[G]** |

### 3.4 Mitigating negative skill transfer: the curriculum split

**Evidence [D]:**
- The 2022 meta-analysis found medium-fidelity simulators transfer best; high fidelity helps only skilled trainees, and only on electronic systems.
- Osgood's transfer surface: similar stimuli with different required responses produce maximal negative transfer (`HSA` §2.2).

**Design principle [I]:** the negative-transfer risk sits in **navigation habits** (where to click, which key), not in **decision logic**. So each skill goes to the surface that trains it best:

| Skill layer | Where trained | Hours | Rationale |
|---|---|---|---|
| Decision logic and state models: which payer, which window, OOO vs OOS, EOD prerequisites, exception detection | Original-UI simulator | 20–28 | Needs per-trainee isolation, resets, rare-event density: only the simulator can supply them |
| Detection in the wild (event not announced) | Simulator with **unlabelled, interleaved** scenarios: the walk trigger is an OOS flag set in an earlier session | Included above | Closes the "labelled practice" gap (`RTA` §2.3) |
| Navigation fidelity on the target PMS | **(a)** Licensed OPERA Cloud training tenant (Phase 2) or a ThinkBliss-type licensed partner. **(b)** For Cloudbeds / Otello hotels: vendor demo or partner test accounts | 3–5 | Low-state tasks only (lookup, create, route on the trainee's own reservation). No EOD on the shared tenant |
| Explicit **transfer bridging** | 30–45 min "differences drill": trainee performs the same routing task in both surfaces back to back, verbalising where the controls differ | 1 | Structured contrast reduces interference when stimuli are similar but responses differ [I] |
| First live shifts | Placement hotel, supervised, with a checklist of the hotel's top-10 transactions | 2 shifts | Physical devices, social pressure |

**Cost of the bridge [I]:**
- Buying ThinkBliss-type seats at ≈$199 CAD ≈ **$145 ≈ 390 GEL per trainee** is too expensive per seat (compare the §5.6 contribution).
- An academy-held training tenant at the unverified ≈$2,500/month, used for a 4-month pre-season, costs ≈27k GEL. Across 200 trainees that is ≈**135 GEL each**.
- Tenant cost is therefore **fixed, not variable**, and only pays off above ≈150 trainees a season.

**[G]** Transfer to live performance is unmeasured for any PMS simulator. The `HSA` §8 exit test stands: a controlled live-performance comparison is needed before transfer claims are made.

---

## 4. Forward-Deployed Specialist Onboarding Economics

### 4.1 Role definition [I]

A **forward-deployed onboarding specialist (FDS)** is a former front-office supervisor, bilingual in Georgian and English, trained in the ingestion pipeline. Per hotel:

| Phase | Activity | Where | Hours |
|---|---|---|---|
| Pre-visit | Document request; pipeline run on binders, contracts and policy documents; draft PKG | Remote | 2–3 |
| Day 1 | Walkthrough with the FOM or senior receptionist: validate extracted catalogue against live PMS screens (read-only, hotel's own login, **no export**); collect undocumented corporate conventions | On site | 7–8 |
| Day 2 | **Observe one live shift** (check-in peak or night audit); log floor practice versus stated policy; tacit-rule interview with senior staff | On site | 7–8 |
| Day 3 (optional, larger properties) | GM exception interview (≈1.5 h) and sign-off walkthrough (≈1 h); scenario spot-check with the FOM | On site | 4–8 |
| Post-visit | Rule translation fixes, scenario review, tier assignment (§2.6), publish PKG v1 | Remote | 5–7 |
| **Total** | | | **≈25–34 specialist-hours; ≈3 GM-hours** |

### 4.2 Cost per onboarding [I]

**Inputs [I]:**
- specialist loaded cost 4,500 GEL/month ≈ **214 GEL/day** (above the Geostat national average of 2,364–2,466 GEL **[D]**, to attract supervisor-level talent);
- ≈40 GEL pipeline compute and tooling;
- travel as listed.

| Location archetype | Specialist days (on site + back office) | Travel | **Cost per onboarding** |
|---|---|---|---|
| Tbilisi | 2 + 1.5 | ≈40 GEL | **≈830 GEL** |
| Kakheti, day trips from Tbilisi (Telavi ≈2 h) | 2 + 1.5 | ≈180 GEL | **≈970 GEL** |
| Kakheti, overnight, 3-day visit | 3 + 1.5 | ≈420 GEL | **≈1,420 GEL** |
| Batumi / Adjara, 3-day visit | 3 + 1.5 | ≈650 GEL | **≈1,650 GEL** |

### 4.3 Does a 1,500–3,000 GEL setup fee absorb it?

**Setup fee as a share of the annual new-software budget** (budget from `HSA` §3.3: tech 3–4% of rooms revenue, 23% of it for new software **[D]/[I]**):

| Rooms | 1,500 GEL | 2,250 GEL | 3,000 GEL |
|---|---|---|---|
| 20 | 28–37% | 41–55% | 55–74% |
| 50 | 8–11% | 12–16% | 16–22% |
| 100 | 3–4% | 5–6% | 6–8% |
| 150 | ≈2% | 2–3% | 3–4% |

**Contribution on the setup fee alone** (fee − onboarding cost):

| Fee | Tbilisi | Kakheti day | Kakheti overnight | Batumi |
|---|---|---|---|---|
| 1,500 GEL | +670 | +530 | +80 | −150 |
| 2,250 GEL | +1,420 | +1,280 | +830 | +600 |
| 3,000 GEL | +2,170 | +2,030 | +1,580 | +1,350 |

**Findings [I]:**
1. **The setup fee covers the specialist at ≥ 2,250 GEL in every region**, and at 1,500 GEL only for Tbilisi and nearby Kakheti.
2. **Fit by property size:**
   - For **≥ 50-room** properties the fee is a small share of discretionary budget.
   - For **20-room** properties even 1,500 GEL is a third of the annual new-software budget.
   - Sub-30-room hotels (most of Georgia; mean ≈19.5 rooms, `HSA` §3.3) should get a **lighter remote onboarding**: ≈1 specialist day, a generic catalogue plus the hotel's top-20 rules, ≈400 GEL cost. Or they can be served only through the talent marketplace (§5), where the fee is paid per seat when they hire.
3. **GM commitment ≈3 h** versus 22–45 h in `HSA` §1.1. Using `HSA`'s own abandonment model (P = (1−h)^(H/a)), completion at H = 3 h rises to **≈83–94%**, against 8–43% before.

**Alternative: fold the setup cost into an annual subscription [I].**
- A 150 GEL/month (1,800 GEL/yr) subscription recovers ≈1,000–1,400 GEL of onboarding only if the hotel stays ≥ 8–10 months. That is exactly the subscribe-train-cancel failure in `HSA` §3.2.
- **Recommendation:**
  - an **upfront setup fee (≈2,250 GEL list, credited 50% against the first season's placement fees)**;
  - a low **seasonal platform fee** (e.g., 100 GEL a month while active) for simulator access by the hotel's existing staff.
- The credit turns setup into a customer-acquisition wedge for the marketplace without giving it away.

### 4.4 Capacity, seasonality and scale [I]

**Capacity.**
- One FDS completes **≈1–1.4 onboardings a week** (3.5–4.5 days each).
- In the Jan–Apr pre-season window (≈17 weeks) that is **≈19–24 hotels per specialist**.
- Hotels decide to train in March–April (`HSA` §1.2), so onboarding must be **finished by mid-April**. The binding constraint is pre-season capacity, not annual capacity.

**Off-season utilisation.**
- May–June: specialists become **on-site placement coaches**, covering first-shift supervision of placed trainees and the 30/60-day retention check-ins that reduce q₉₀.
- August: Rtveli cohort support.
- Oct–Dec: **refresh visits** for next season's catalogue changes, at ≈1 day each (≈300–400 GEL; charge ≈500 GEL or include it in the seasonal fee).
- This turns a seasonal cost into a year-round role.

**Scale ceiling.**
- 5 FDS → ≈100–120 hotels per pre-season.
- That plausibly covers the Georgian ≥ 50-room independent segment (`HSA` §3.3 "low hundreds at most") within **2–3 seasons**.
- It is agency economics, as `HSA` §5.3 warned. The hybrid answer is that **the specialist sells placements**, so revenue per hotel scales with seats, not only with the setup fee (§6).

---

## 5. Seasonal Candidate Pipeline and the Guaranteed-Job Contract

### 5.1 Why candidates would commit to 30–40 hours

`RTA` §3.4 found an unpaid 40-hour academy has **negative expected value** for candidates unless the certificate lifts pay or hiring odds by more than ≈550 GEL. Hotels hire uncertified staff today, so that uplift is unproven. A **guaranteed offer** changes the payoff structure **[I]**:

| Payoff component | Without guarantee | With guaranteed seasonal offer | Label |
|---|---|---|---|
| P(job for the season) | Baseline job-search success | ≈P(certify) × P(hotel honours) ≈ 0.73 × 0.95 ≈ **0.69**. Most non-certifiers are screened out early, not at the end | [I] |
| Job-search cost avoided | 0 | Weeks of search in April–May; better hotel match | [I] |
| Opportunity cost of 35 h | ≈10 GEL/h × 35 ≈ 350 GEL at wage rates | **Lower in winter/spring for off-season hospitality workers**, whose market opportunity cost is near zero between November and April (Batumi / Kakheti seasonal layer) | [I]; wage basis [D] `RTA` |
| Earlier, surer start | — | Contract signed in March for a May start | [I] |

**The critical exception: competing winter demand [D]/[I].**
- **Gudauri runs December to mid-April and hires in October–November**. Experienced seasonal workers who go to ski resorts are **unavailable** for a winter academy.
- Recruit from:
  - the off-season Batumi and Kakheti layer;
  - vocational students and recent graduates;
  - career switchers;
  - returning workers who did not take winter jobs.

**Outside options abroad [D]/[I].**
- Germany's seasonal agricultural scheme for Georgians (since 2021; 90k+ registrations against a 5,000 quota in 2021) pays at least the German minimum wage. At €13.90/h in 2026 that is ≈**7,300 GEL/month** at full hours, versus Georgian front-desk pay of ≈1,500–1,900 GEL.
- Greece and Bulgaria recruit Georgian seasonal hotel labour.
- **Implication:** the academy competes for a *different* population: people who want domestic, customer-facing, career-track work, need Georgian and English, and will not do farm labour abroad.
- Pool size **[G]**. The sector median wage is ≈875 GEL/month (Georgia Fair Labor Platform **[D]**, year unclear). The national median is ≈900–1,000 GEL against a 2,364 GEL mean (Q1 2026 **[D]**). A 1,500–1,900 GEL front-desk job is therefore **above median pay**, which supports demand for it.

### 5.2 Calendar [I]

| Month | Hotel side | Candidate side | Platform |
|---|---|---|---|
| Oct–Dec | Season review; refresh visits | Recruitment opens (VET colleges, job boards, returning pool) | FDS refresh visits; scenario bank updates |
| **Jan–Feb** | **Seat reservation** (pre-sell): hotel signs framework agreement and pays reservation fee per seat | Screening: language, numeracy, 2-h aptitude trial | FDS onboarding of new hotels |
| **Mar–Apr** | Hotel interviews shortlist (2 candidates per seat); preliminary employment contract signed | **Academy: 35 h over 5–6 weeks** (evenings/weekends; hybrid online plus 2 in-person days); certification | Cohort delivery; FDS completes onboarding by mid-April |
| May | Start date; probation | Seasonal fixed-term contract begins; 2 supervised shifts | FDS as placement coach |
| Jun–Jul | 30/60-day retention checkpoints | Retention bonus milestones | Replacement from bench if needed |
| **Jul–Aug** | Rtveli seats (Kakheti, Sep–Oct) | Mini-cohort | |
| Sep–Oct | End of season; rehire option for next year | Returning-pool priority | Alumni refresh (≈2–4 h, `RTA` §2.4 decay risk) |

### 5.3 Employer pre-commitment: contract architecture

**Instrument: framework seat-reservation agreement** (civil contract, academy ↔ hotel).

| Clause | Design | Legal anchor | Label |
|---|---|---|---|
| Nature of payment | **Reservation fee as prepayment** credited to the placement fee. **Not** named or structured as "ბე" (earnest money) | Civil Code Arts. 421–423: with earnest money, the party at fault for non-performance loses it, and a recipient at fault returns **double**. That would expose the academy to 2× liability on any delivery shortfall | [D]/[I] |
| Reservation fee | ≈350–450 GEL per seat (≈25–30% of the placement fee), paid on signature (Jan–Feb) | Sized to cover acquisition and training cost per enrolee (§5.6) | [I] |
| Delivery obligation | The academy delivers a **shortlist of 2 certified candidates** per seat by a date (e.g., 20 April). Failure → **100% refund of the reservation fee plus a capped penalty** (e.g., 25% of the fee) | Penalty must be written (Art. 418). Courts may reduce disproportionate penalties (Art. 420). Keep it modest and proportionate | [D]/[I] |
| Hotel cancellation | Before 1 March: 50% refund. After: fee retained as liquidated damages covering sunk training cost | Art. 418–420 | [D]/[I] |
| Hotel refusal of both shortlisted candidates | Allowed once per seat with a written objective reason; academy provides a third. Further refusals → fee retained | Keeps the hotel's hiring discretion without making the academy's entitlement depend purely on hotel will (Art. 92 voids conditions that depend purely on one party's will) | [D]/[I] |
| Placement fee | E.g., **1,500 GEL** per seat: reservation (≈400) + at start (≈600) + at day 60 if the employee is still employed (≈500) | Payment milestones shift the q₉₀ risk the audits flagged (`RTA` §3.3) toward shared risk | [I] |
| Replacement | If an employee exits before day 60 for reasons not attributable to the hotel, one replacement from the bench; the day-60 tranche resets | Limits the "every exit is covered" moral hazard (`RTA` §3.3) through an attribution clause | [I] |

### 5.4 Trainee-side architecture: commitment without debt

**Principles:**
- **no fees charged to candidates**;
- **no training-repayment or stay-or-pay clauses**;
- **no debt**.

**Why [D]:**
- The Georgian Labour Code contains **no article** authorising repayment of training costs by departing employees. Art. 22 requires employer-directed training to be paid working time.
- Any clawback would rest on general freedom of contract and would be reducible under Civil Code Art. 420.
- Ratification by Georgia of ILO C181, which bans fees to workers, could not be confirmed **[G]**. The norm is still the reputational and regulatory baseline.
- Stay-or-pay terms are being banned or litigated abroad: California AB 692 (2026), Ontario's FDM ruling (2018), Revature's dropped bond.

| Mechanism | Design | Legal basis | Label |
|---|---|---|---|
| Training contract | Civil services agreement between **academy and candidate**, free to the candidate, signed *before* any employment exists. The academy, not the hotel, is the training provider | Avoids Labour Code Art. 22 (employer-directed training = paid work time) and Art. 18(2) (interns may not substitute for employees) | [D]/[I] |
| Conditional offer | **Preliminary employment contract** (Civil Code Art. 327) between hotel and candidate, in the main contract's form. Condition precedent: **objective**, e.g., "passes academy certification by 30 April" and "presents required documents". Not "if the hotel is satisfied" | Arts. 90–96. Art. 92 voids purely potestative conditions. Art. 95: a party obstructing the condition cannot rely on it | [D]/[I] |
| Main contract | Seasonal fixed-term contract (May–October) | Art. 12: seasonal work is an express exception to the 30-month rule for successive fixed-term contracts | [D] |
| Probation | Up to 6 months, **once per person per employer**, paid, in writing (Art. 17) | **Trap:** a returning seasonal worker cannot be put on probation again by the same hotel. Use probation in season 1 only | [D]/[I] |
| Hotel trial shifts during the academy | Only as **paid** internship or paid probation; never unpaid staff replacement | Art. 18 (unpaid internship ≤ 6 months, once; paid ≤ 1 year; Art. 18(2) anti-substitution) | [D] |
| Candidate commitment levers (non-monetary) | (1) Loss of the guaranteed slot and of returning-pool priority for no-shows. (2) Public-facing credential only on start. (3) Staged **positive** incentives: retention bonus funded from the day-60 tranche (e.g., 150 GEL at day 30, 250 GEL at day 90) | Rewards, not penalties; no debt | [I] |
| Training funding | The state job-seeker training programme has paid ≈150 GEL/month stipends and covered certification costs. Skills Agency short-term VET accreditation could make the academy eligible | Ministry programme (matsne 3632049); current amounts [G] | [D]/[G] |
| Non-compete | **Avoid.** Post-termination restriction allowed only up to 6 months **with full salary paid** by the employer | Labour Code (article number unconfirmed) | [D]/[G] |

**Personal data [D]/[I].** Law on Personal Data Protection (in force 1 March 2024):
- **Art. 19** gives a right not to be subject to decisions based solely on automated processing with significant effects, except with express consent, contractual necessity or a legal basis.
- **Art. 31** makes a data protection impact assessment mandatory for such processing.

The academy's certification decision is therefore designed as:
- **human-confirmed** (the coach signs every certification and every failure);
- with **express consent** at enrolment;
- with an explanation of the scoring logic;
- with a completed DPIA before the first cohort.

Voice and face data are avoided or strictly scoped (`RTA` §1.5). The State Audit Office now supervises (DLA Piper, 2026) **[D]**.

### 5.5 Yield and over-enrolment [I]

- **Inputs:** certification yield 0.73 (`SR` via `RTA` §3.4) and a start show-up rate of 0.85 **[I/G]**.
- Enrolment per delivered seat = 1 / (0.73 × 0.85) ≈ **1.61**.
- **Shortlist of 2 per seat:** certified output must be ≈2× seats at interview, and ≈1 per seat at start. Certified candidates not selected go to:
  - (a) the **bench** for 60-day replacements;
  - (b) walk-in placement with non-reserving hotels at full fee;
  - (c) the returning pool.
- **Bench cost is near zero** while candidates are unpaid and in other work. Its reliability decays with the same logic as `RTA` §3.3. So hold the bench only until 30 June **[I]**.

### 5.6 Unit economics per filled seat (GEL) [I]

**Inputs:**
- candidate acquisition 80 GEL per enrolee;
- coaching 234 per enrolee (`RTA` / `SR` basis: 3,000 GEL/month coach, 100 h per 12-person cohort, ×1.5 starts);
- compute 42 per enrolee for text, or 305 for realtime voice (`RTA` §4.1);
- 1.61 enrolees per seat;
- 120 GEL FDS placement coaching per seat;
- replacement cost = q₉₀ × first-pass cost.

| Placement fee | q₉₀ | Text, no stipend | Voice, no stipend | Text, 300 GEL completion stipend | Voice + stipend |
|---|---|---|---|---|---|
| 1,200 | 15% | +402 | −85 | +57 | −430 |
| 1,200 | 30% | +298 | −253 | −92 | −643 |
| **1,500** | 15% | +702 | +215 | +357 | −130 |
| **1,500** | **30%** | **+598** | +47 | **+208** | −343 |
| 1,500 | 45% | +494 | −120 | +59 | −555 |
| 1,800 | 15% | +1,002 | +515 | +657 | +170 |
| 1,800 | 30% | +898 | +347 | +508 | −43 |
| 1,800 | 45% | +794 | +180 | +359 | −255 |

**Reading [I]:**
- **Text-first is mandatory** at Georgian fee levels. Realtime voice turns most cells negative, as `RTA` §4.1 found.
  - Use voice only for a small number of high-value scenarios (≈1–2 h per trainee), or with cached TTS for guest lines and ASR only on trainee turns.
- A **1,500 GEL** fee with q₉₀ ≈ 30% yields **≈+600 GEL per seat text-only, or ≈+200 GEL with a 300 GEL completion stipend**.
- A **state-funded stipend** (the ≈150 GEL/month programme, §5.4) restores most of the no-stipend margin, **if eligibility is confirmed [G]**.
- **The hotel's side.** Realized value per certified hire is ≈910–1,430 GEL after early quits (`RTA` §3.2), below the 1,500 GEL fee. The fee is justified only because the package also includes:
  - (a) recruitment effort avoided;
  - (b) a guaranteed on-time start before peak;
  - (c) a replacement guarantee;
  - (d) the supervisor-hour saving.
  Recruitment fees alone are 15–25% of first-year salary **[D]** (`SR`), which is ≈1,500–2,700 GEL for a 6-month seasonal contract at 1,700 GEL/month. The fee is **priced at the bottom of the recruitment-fee market with training included** **[I]**.

### 5.7 Precedents for train-then-hire

| Programme | Structure | Outcome | Relevance | Label |
|---|---|---|---|---|
| UK Sector-based Work Academy Programme (SWAP) | ≤ 6 weeks pre-employment training + work placement + **guaranteed interview** | +13 per 100 in work; +90 days in work over 24 months; £1.83 returned per £1; ≈350k starts 2021–24, ≈⅔ completing | Closest structural analog; state-funded; guaranteed interview, not guaranteed job | [D] |
| Germany Einstiegsqualifizierung (SGB III §54a) | 4–12 months in-company, employer subsidy ≈€262–276/month | ≈60–70% progress to apprenticeship (chamber reports) | In-company, subsidised; shows subsidy plus employer commitment drives conversion | [D] |
| Youth Career Initiative (hotels) | 24-week in-hotel programme | Self-reported 100% placement in the first India cohort; independent rates not found | Hotel-sector precedent; weak evidence | [D]/[G] |
| Revature / FDM | Paid training + 2-year placement bonds | Bonds litigated or dropped; FDM repayment ruled illegal in Ontario (2018) | Negative precedent for stay-or-pay | [D] |

---

## 6. Integrated Economics

### 6.1 Year-one contribution per hotel, 50-room Kakheti archetype [I]

| Line | GEL |
|---|---|
| Setup fee (2,250 list − 50% credit applied to placements) | 2,250 |
| FDS onboarding cost (overnight) | −1,420 |
| 3 seats × 1,500 placement fee (credit already applied) | 4,500 − 1,125 credit = 3,375 |
| 3 seats × delivery cost (q₉₀ 30%, text, no stipend) | −2,706 |
| Seasonal platform fee (4 months × 100) | 400 |
| Infra and support | −100 |
| **Year-one contribution** | **≈1,800** |
| Year two and later: refresh visit (−350, fee +500) + 3 seats at full fee (4,500 − 2,706) + platform fee (400) − infra (100) | **≈+2,250/yr** |

### 6.2 Fixed-cost wall, revisited [I]

**Lean core team.** 2 engineers, 1 scenario and QA lead, 1 operations and sales lead, at ≈7,000 GEL/month loaded:

| Item | Annual cost |
|---|---|
| Core team | ≈336k GEL |
| Legal and privacy (DPIA, contracts, IP opinion) | ≈30k GEL |
| Optional OPERA Cloud training tenant | ≈27–80k GEL |
| **Total** | **≈390–450k GEL** |

`RTA` §3.5 had ≈576k GEL. Specialists and coaches are variable costs, already inside the contributions above.

| Revenue driver | Needed to break even | Share of addressable market |
|---|---|---|
| Hotels at ≈2,200 GEL/yr blended | **≈180–205 hotels** | Most of the ≥ 50-room Georgian independent tail (`HSA` §3.3: "low hundreds at most") [G] |
| Or seats at ≈600 GEL + hotels at ≈1,000 from setup and platform | e.g., **120 hotels + 450–550 seats** | Seats ≈20–25% of ≈2,200 Georgian front-office hires a year (`RTA` §3.5) |

**Verdict [I]:**
- The hybrid **clears unit economics**, which the SaaS variant did not.
- It **reaches break-even only at high penetration of a small national market**, the same structural limit as `RTA` §3.5, eased by ≈25%.
- The realistic escape is **regional replication** in markets without Oracle's litigation profile, with similar seasonality and small independents: Armenia, Azerbaijan, the Balkans, Central Asia resort markets **[G]**.
- The playbook (FDS + ingestion + academy) is portable. The scenario engine and rubric tiers are reusable. Local labour and civil law must be redone per country.

### 6.3 Where the moat actually is [I]

It is **not** the simulator UI, which is deliberately generic, nor OPERA access, which is replicable (ThinkBliss). The moat has three parts:
1. **The property knowledge graph corpus.** Floor-validated, signed house rules and corporate conventions across hundreds of hotels, which no PMS stores (`HSA` §1.1).
2. **The certified returning pool.** Seasonal workers with verified history across hotels, a two-sided asset that raises switching costs for hotels.
3. **Calendar lock-in.** Pre-season seat reservation in Jan–Feb makes the academy the default supply channel before competitors are in the conversation.

---

## 7. Consolidated Risk Register (Hybrid Model)

| ID | Risk | Severity | Mitigation in design | Residual | Label |
|---|---|---|---|---|---|
| X1 | Oracle refuses a training-use tenant; no Phase 2 | S2 | Phase 1 simulator is independent; Cloudbeds / other PMS bridges; institutional wrapper (§1.4) | OPERA navigation bridge absent → higher transfer risk for OPERA hotels | [G] |
| X2 | Clean-room discipline breaks (screenshots, manual text in the corpus) | S1 | Specification log; corpus allow-list; no OPERA artefacts on systems (§1.3) | Human error | [I] |
| X3 | US/Fed. Cir. SSO exposure on export | S2 | Keep behaviour-only reproduction; fresh FTO opinion per market | Unresolved law | [D]/[G] |
| X4 | Georgian-script extraction accuracy unknown | S2 | ≥ 200-page Georgian test set before pilot; manual entry fallback for Georgian binders | Adds 2–4 h per hotel if OCR fails | [G] |
| X5 | Rule-translation error enters certified tier | S2 | Three-tier rubric; floor validation; solver validation | Measured conflict rate unknown | [I]/[G] |
| X6 | SPRT false certification under dependence (`RTA` §4.3) | S2 | Fixed-length stratified test before any "Day-1 ready" claim | — | [D]/[I] |
| X7 | FDS pre-season capacity bottleneck | S3 | Hire and train FDS by November; remote-light onboarding for < 30 rooms | Missed window = zero value that season | [I] |
| X8 | Candidate no-show and early quit (q₉₀) above 30% | S2 | Staged retention bonus; placement coaching; bench until 30 June; day-60 fee tranche | Contribution falls ≈100 GEL per +15 pp q₉₀ | [I] |
| X9 | Contract instruments recharacterised (earnest money, potestative condition, disguised internship) | S2 | Prepayment, not earnest money; objective conditions; paid internships only | Needs local counsel | [D]/[I] |
| X10 | Automated-decision and PDP violations | S2 | Human-confirmed certification, express consent, DPIA, no biometrics | — | [D] |
| X11 | Small-market fixed-cost wall | S1 (scale) | Lean team; seats + hotels; regional replication | Break-even needs ≈180–205 hotels or equivalent seat mix | [I]/[G] |
| X12 | OPERA Cloud Assistant and vendor e-learning commoditise "how-to" | S3 | Differentiate on this hotel's rules, EOD and walk drills, and supply of certified staff, which a vendor assistant does not provide | — | [D]/[I] |
| X13 | Winter labour competition (ski resorts) and abroad seasonal schemes | S3 | Recruit from off-season coastal and Kakheti layer and VET graduates; domestic career track | Pool size unknown | [D]/[G] |

---

## 8. Validation Plan: Gates Before Scaling

| Gate | Test | Pass threshold | Addresses |
|---|---|---|---|
| G1 (legal) | Georgian counsel review of the four contracts (seat reservation, training, preliminary employment, seasonal); IP freedom-to-operate memo on the simulator UI | Signed opinions | X2, X3, X9, X10 |
| G2 (Oracle) | Written inquiry for a training-use OPERA Cloud property; ask WDP whether an OPERA tenant is included | Answer received (yes or no both unblock planning) | X1 |
| G3 (ingestion) | Run the pipeline on 5 hotels' real documents, including ≥ 2 Georgian-language binders | ≤ 10 h back-office per hotel; field accuracy ≥ 99% after routing; ≤ 3 GM-hours | X4, X5, `HSA` H1 |
| G4 (grading) | One cohort of ≥ 24 trainees across ≥ 4 hotels; log every grade dispute | Certified-stream conflict rate ≤ 2%; GM override rate ≤ 10% | X5, `HSA` H9/H10 |
| G5 (transfer) | Certified versus conventionally trained hires, matched by hotel; measure first-30-day routing, billing and EOD errors and service time live | Non-inferior on errors; service-time ratio sim-to-live ≤ 1.2 | `HSA` H3, `RTA` §2.2 |
| G6 (market) | Pre-season 2027: seat reservations signed with paid fees | ≥ 40 seats from ≥ 12 hotels by 1 March | X11 |
| G7 (retention) | q₉₀ and day-60 retention across placed trainees | q₉₀ ≤ 30% | X8 |

---

## 9. Sources

**Internal (read-only)**
1. `pms_onboarding_research.md`; `solution_redteam_audit.md`; `hotel_simulator_redteam_audit.md`. Secondary citations via those files: `solution_research.md` (`SR`), `problem.md`.

**Virtual Hotel and Oracle programmes**

2. ThinkBliss / Bliss Hotel: https://www.thinkbliss.ca/training-operapms · https://www.thinkbliss.ca/opera-cloud-self-learning-with-system-practice · https://www.thinkbliss.ca/view/courses/opera-cloud-self-learning-with-system-practice/2018961-welcome-to-bliss/6519878-welcome-to-the-bliss-hotel · https://www.thinkbliss.ca/ · https://www.collabs.io/mag/bliss-hospitality-talent-education/
3. Other OPERA training sellers: https://southlondoncollege.org/course/diploma-in-cloud-property-management-system-pms/ · https://www.receptionacademy.com/online-courses/opera-pms-hotel-software · https://www.globaledulink.co.uk/course/opera-cloud-property-management-system
4. Auburn / Laurel Hotel on OPERA Cloud: https://www.prnewswire.com/news-releases/auburn-university-and-ithaka-hospitality-partners-offer-hands-on-learning-for-future-hoteliers-with-oracle-cloud-301537884.html
5. Oracle WDP flyer: https://www.oracle.com/a/ocom/docs/dc/ww-wdp-flyer.pdf · OPERA WDP page (unreachable): https://education.oracle.com/opera-digital-training/workforce-development-program
6. Oracle Academy hospitality curriculum: https://academy.oracle.com/en/solutions-curriculum-hospitality.html
7. OPN level policies (2026): https://www.oracle.com/opn/manage/opn-level-policies-12405077.pdf
8. OHIP partner sandbox: https://docs.oracle.com/en/industries/hospitality/integration-platform/ohipu/t_quick_start_for_partners_using_the_partner_sandbox.htm · https://docs.oracle.com/en/industries/hospitality/integration-platform/stmig/c_faqs.htm
9. OPERA Cloud third-party price claim: https://www.pmscompare.com/pms/oracle-opera
10. Oracle Hospitality Digital Learning: https://docs.oracle.com/en/industries/hospitality/opera-cloud/25.2/ocsuh/c_getting_started_accessing_oracle_hospitality_digital_learning.htm · https://www.oracle.com/a/ocom/docs/industries/hospitality/hosp-training-complimentary-training.pdf
11. OPERA Cloud Assistant (16 June 2026): https://www.oracle.com/news/announcement/new-ai-capabilities-in-oracle-opera-cloud-supercharge-hotel-operations-2026-06-16/ · https://skift.com/2026/06/16/oracle-opera-cloud-ai-assistant-rooms-rates-2026/

**Enforcement**

12. Oracle v Rimini (2023): https://www.oracle.com/news/announcement/oracle-wins-copyright-case-against-repeat-violator-rimini-street-2023-07-25/ · 9th Cir.: https://law.justia.com/cases/federal/appellate-courts/ca9/22-15188/22-15188-2023-08-24.html
13. Oracle v SAP: https://en.wikipedia.org/wiki/Oracle_Corp._v._SAP_AG · Oracle licensing litigation overview: https://houseofbrick.com/blog/oracle-licensing-litigation/
14. SAP/BusinessObjects letters to trainers (2009): https://www.techdirt.com/articles/20090108/1409173336.shtml
15. Epic v TCS (7th Cir. 2020): https://law.justia.com/cases/federal/appellate-courts/ca7/19-1613/19-1613-2020-08-20.html · Epicor suit: https://www.computerworld.com/article/1404010/epicor-suit-claims-services-firm-hijacked-its-erp-software.html

**Flight simulation and training devices**

16. PMDG licence and EULA: https://manuals.pmdg.com/737/PMDG_737_MSFS_Introduction.pdf · https://forum.pmdg.com/forum/main-forum/general-discussion-news-and-announcements/277715-pmdg-and-the-boeing-company-license · manuals removal: https://www.avsim.com/forums/topic/559153-pmdg-and-boeing-manuals-gone-due-to-license-issue/
17. Boeing licensing: https://www.boeing.com/company/licensing · Fenix: https://flightsim.to/news/fenix-simulations-a320-now-available · Aerosoft/ToLiss: https://www.aerosoft.com/us/toliss/ · MSFS 2024: https://en.wikipedia.org/wiki/Microsoft_Flight_Simulator_2024
18. FlyByWire: https://github.com/flybywiresim/aircraft · https://docs.flybywiresim.com/aircraft/a32nx/feature-guides/cFMS/ · Navigraph: https://navigraph.com/legal/terms-of-service
19. FAA Part 60: https://www.ecfr.gov/current/title-14/chapter-I/subchapter-D/part-60 · https://www.federalregister.gov/documents/2016/03/30/2016-05860/ · EASA FNPT validation data: https://www.easa.europa.eu/sites/default/files/dfu/certification-flight-standards-doc-oeb-supporting-documents-fstd-FNPT-Validation-Data-Requirements.pdf · Frasca costs: https://www.frasca.com/how-much-does-a-frasca-simulator-cost/ · FNPT example: https://flyelite.com/boeing-b737-ng-fnptii-mcc/
20. Fidelity and transfer: https://www.tandfonline.com/doi/full/10.1080/24725838.2022.2099483 · https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7246118/ · https://commons.erau.edu/ijaaa/vol5/iss1/6/ · https://www.researchgate.net/publication/233163588

**Software UI and trademark law**

21. Navitaire v easyJet [2004] EWHC 1725 (Ch): https://en.wikipedia.org/wiki/Navitaire_Inc_v_Easyjet_Airline_Co._and_BulletProof_Technologies,_Inc. · https://www.scl.org/718-navitaire-v-easyjet-what-now-for-look-and-feel/
22. SAS Institute v WPL, C-406/10: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62010CJ0406
23. Nova v Mazooma [2007] EWCA Civ 219: https://caselaw.nationalarchives.gov.uk/ewca/civ/2007/219
24. Lotus v Borland: https://law.justia.com/cases/federal/appellate-courts/F3/49/807/551122/ · Apple v Microsoft: https://law.justia.com/cases/federal/appellate-courts/F3/35/1435/605245/ · Data East v Epyx: https://en.wikipedia.org/wiki/Data_East_USA,_Inc._v._Epyx,_Inc. · Google v Oracle: https://en.wikipedia.org/wiki/Google_LLC_v._Oracle_America,_Inc.
25. Nominative fair use: https://www.courtlistener.com/opinion/150282/toyota-motor-sales-usa-inc-v-tabari/ · https://www.arnoldporter.com/en/perspectives/publications/2016/11/2016_11_16_second_circuit_expands_split__13324 · EUTMR Art. 14: https://ipright.eu/trademark-regulation/en/Article-14 · CJEU Audi: https://www.fieldfisher.com/en/services/intellectual-property/intellectual-property-blog/running-rings-around-referential-use-of-trade-marks-the-cjeus-decision-in-audi-v-gq
26. Epic Playground: https://www.uperform.com/blog/epic-training-end-users/ · Certiport/GMetrix: https://certiport.pearsonvue.com/Certifications/Microsoft/MOS/Practice.aspx · Oracle hospitality training: https://www.oracle.com/education/training/hospitality/

**Document extraction and rule compilation**

27. OmniDocBench: https://arxiv.org/pdf/2606.03264 · https://github.com/opendatalab/OmniDocBench · olmOCR-Bench: https://arxiv.org/pdf/2510.19817 · https://arxiv.org/pdf/2512.02498 · ParseBench: https://arxiv.org/abs/2604.08538
28. RD-TableBench (vendor): https://llms.reducto.ai/table-extraction-accuracy-scanned-pdfs · MLLM table structure: https://aclanthology.org/2025.xllm-1.2/ · Textract best practices: https://docs.aws.amazon.com/textract/latest/dg/textract-best-practices.html
29. ContractEval / CUAD: https://arxiv.org/html/2508.03080 · DocVQA / SynthDocBench: https://arxiv.org/pdf/2607.10400 · CORD/SROIE: https://arxiv.org/pdf/2607.24745 · Templated documents: https://arxiv.org/html/2609.15706v1
30. DocILE confidence routing: https://arxiv.org/html/2606.24420
31. Hallucination: https://github.com/vectara/hallucination-leaderboard/ · long-context QA: https://arxiv.org/html/2603.08274v1 · FaithBench: https://arxiv.org/pdf/2410.13210
32. NL-to-logic: https://arxiv.org/html/2512.17334v1 · PolicyKG: https://arxiv.org/abs/2608.09028 · Tax-to-Prolog: https://arxiv.org/abs/2511.11954 · Catala: https://aclanthology.org/2025.nllp-1.4/ · BREX: https://arxiv.org/abs/2505.18542 · SOP-Bench: https://arxiv.org/abs/2506.08119 · JourneyBench: https://arxiv.org/abs/2601.00596
33. Review-time evidence: https://pubmed.ncbi.nlm.nih.gov/42501879/ · https://www.acpjournals.org/doi/10.7326/ANNALS-25-00739 · https://images.law.com/contrib/content/uploads/documents/397/5408/lawgeex.pdf
34. Georgian OCR support: https://docs.cloud.google.com/vision/docs/languages · https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/language-support/ocr?view=doc-intel-4.0.0 · Tesseract `kat`: https://groups.google.com/g/tesseract-ocr/c/R_-9cduyixc/m/XxV0Z64dS2AJ · GeoLogicQA: https://aclanthology.org/2025.lowresnlp-1.13/

**Georgian law and labour market**

35. Labour Code of Georgia (Arts. 12, 17, 18, 22, 24, 27, 48): https://matsne.gov.ge/en/document/view/1155567 · non-compete summary: https://ge.andersen.com/non-compete-clauses-georgian/
36. Civil Code of Georgia (Arts. 90–96, 327, 417–423): https://matsne.gov.ge/en/document/view/31702 · English translation: http://jafbase.fr/docEstEurope/Georgie/code_civil.pdf · preliminary-contract enforceability: https://rspublisher.org/index.php/ijitss/article/view/6109
37. Labour Inspection Service: https://www.matsne.gov.ge/en/document/view/5003057 · https://oc-media.org/georgia-beefs-up-labour-inspection-department/
38. Minimum wage status: https://www.interpressnews.ge/ka/article/855553 · https://commersant.ge/news/finances/saqartveloshi-shesadzloa-minimaluri-khelfasi-gaizardos-ra-tseria-sakanonmdeblo-tsinadadebashi
39. Employment facilitation and state training: https://matsne.gov.ge/en/document/view/4924109 · https://info.parliament.ge/file/1/BillReviewContent/255391 · https://matsne.gov.ge/ka/document/view/3632049 · https://mes.gov.ge/content.php?lang=geo&id=5948 · Skills Agency: https://www.etf.europa.eu/en/where-we-work/countries/georgia
40. Wages: https://georgiatoday.ge/geostat-average-salary-rises-8-9-to-2363-8-gel-in-q1-2026/ · https://shroma.ge/en/living-wage-en/
41. Hotel staffing shortages: https://commersant.ge/news/busuness/kadrebis-defitsiti-da-sezonuroba-ra-gamotsvevis-tsinashe-arian-kakhetis-sastumroebibmge · https://pmcg-i.com/app/uploads/2024/11/Hospitality-Sector-Snapshot-new.pdf
42. Gudauri season: https://www.mountainconnects.com/resorts/9 · Germany seasonal scheme: https://civil.ge/archives/410357 · Greece: https://greektriplanner.me/insights/greece-tourism-labour-shortage · Bulgaria: https://www.novinite.com/articles/232822
43. Personal Data Protection Law (2023): https://matsne.gov.ge/en/document/view/5827307 · https://www.dlapiperdataprotection.com/?t=law&c=GE · https://www.dataguidance.com/news/georgia-pdps-publishes-recommendations-automated

**Train-then-hire precedents and stay-or-pay**

44. UK SWAP impact assessment: https://www.gov.uk/government/publications/sector-based-work-academy-programme-a-quantitative-impact-assessment/sector-based-work-academy-programme-a-quantitative-impact-assessment · https://feweek.co.uk/swaps-is-for-keeps-despite-questions-over-its-success/
45. Einstiegsqualifizierung: https://www.foerderdatenbank.de/FDB/Content/DE/Foerderprogramm/Bund/BMAS/einstiegsqualifizierung-865274-2.html
46. Youth Career Initiative: https://sustainablehospitalityalliance.org/our-work/youth-employment/youth-employment-programme/
47. CFPB employer-driven debt: https://www.consumerfinance.gov/data-research/research-reports/issue-spotlight-consumer-risks-posed-by-employer-driven-debt/full-report/ · Revature: https://en.wikipedia.org/wiki/Revature · FDM Ontario: https://www.lexology.com/library/detail.aspx?g=0f7fb8b8-572d-476d-8ded-f7a3de3fb47c
