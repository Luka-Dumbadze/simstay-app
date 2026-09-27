# Bioli Pilot Production Blueprint

**Subject:** An execution-ready plan to take SimStay from the 90-second hackathon prototype to a production pilot at **Bioli Wellness Resort, Kojori** (formerly "Bioli Medical Wellness Resort").

**Date:** 2026-09-27.

**Inputs (read-only):**
- `wef_ai_first_enterprise_strategy.md` (`WEF-D`);
- `a2a_and_hospitality_os_research.md` (`A2A-D`);
- `prototype_spec_and_demo_architecture.md` (`PS`);
- `commercialization_dossier.md` (`CD`).

**Status of the relationship.** There is **no agreement with Bioli**. This document is a proposal. Everything about Bioli below is either verified from public sources (Appendix A) or marked for confirmation at the first on-site visit. Nothing here may be presented as Bioli's policy until Bioli's GM and medical director sign it.

---

## 0. Reading Guide

### 0.1 Labels

| Label | Meaning |
|---|---|
| **[V]** | Verified on 2026-09-27 against a public source (bioli.ge unless stated; Appendix A) |
| **[C]** | Conflicting public sources; resolved at the Week-1 visit |
| **[P]** | SimStay proposal (a candidate rule, design choice or target). Not Bioli policy until signed |
| **[G]** | Unknown; must be obtained from Bioli |
| **Tested** | SQL or JSON in this document was executed and validated on 2026-09-27 (PostgreSQL 16.15; JSON Schema Draft 2020-12 validator) |

### 0.2 Corrections to the dispatch brief (verified against public sources)

| Brief said | Verified finding | Consequence |
|---|---|---|
| Units: "Superior Rooms, Premium Cottages, Grand Premium **Chalets**" | bioli.ge lists **Grand Premium Cottage, Grand Chalet, Premium Cottage, Chalet** [V]. An older bioli.ge page lists **Superior Room, Premium Cottage, Grand Premium Cottage** and "three rooms … eleven double and two family-type cottages" (16 units) [V]. Michelin lists **17 rooms** [V] | The unit enum includes all five names; the Week-1 PMS import fixes the real unit master [C] |
| "32+ hectares" | bioli.ge (Corporate Wellness): **31 hectares, 70% forested** [V]. Third-party listings: 32 ha [C] | Use "31 ha (bioli.ge)" |
| Altitude not stated | bioli.ge: 1,200 m. Third-party listings: 1,150 m [C] | Not operationally relevant |
| Packages: Smart Detox, Anti-Stress & Rebalance, **Chronic Fatigue**, Art of Sleeping, Weight Management, **Immune Revival** | Programmes on bioli.ge [V]: Health Resource Management, **Smart Detox**, **Anti-Stress & Rebalance**, **Weight Management**, **Premium Revival**, **A Strong Immune System**, **The Art of Sleeping**, **Mental Detox**, Intro. **"Chronic Fatigue" was not found.** "Immune Revival" is "A Strong Immune System" | The catalogue uses the verified names only (§2.3) |
| "ECG **cardio-stress** testing" | "Diagnosis of cardio status": HRV, arteriography, ECG, echocardiography, 24-hour BP monitoring, doctor consultation, **200 USD** [V]. No stress test is listed | §2.5 |
| "Body composition **bioimpedance**" | Listed as "Diagnosis of the proportion of tissue components of the body" / "body composition analysis" [V]. The method is not named | The catalogue does not claim bioimpedance |
| Halotherapy, phyto-baths, kinesiotherapy, spectrometry | All verified. Salt room (halotherapy) **73 ₾**, Phytobath **145 ₾** [V]. Kinesiotherapy appears in programme contents [V]. "Spectrometry: micronutrients and heavy metals" [V] | §2.5–2.6 |
| Aroma menu: eucalyptus, lavender, **rosemary** | Bioli's aroma menu: **orange, eucalyptus, lavender, iris, ylang-ylang, pine, fir** [V]. **No rosemary** | Enum excludes rosemary. The tested schema *rejects* it (§5.4) |
| Pillow menu: herbal, **buckwheat**, feather | Bioli's pillow menu: **sintepon, feather, medicinal plants** [V]. **No buckwheat** | Enum excludes buckwheat. The tested schema *rejects* it |
| "Phyto-bar / organic bio-bar" | Not found on bioli.ge. Michelin mentions a bar and "organic wine by the lounge's fireplace"; accommodation amenities include a **minibar** [V] | Alcohol exists on property; bar and minibar prices come from Bioli's POS [G] |
| **Rule H: alcohol/minibar never covered by detox packages** | **Not published by Bioli.** Programme pages list inclusions; none mention alcohol | Candidate rule **[P]**; needs GM sign-off (§3.2) |
| **Rule H3: spectrometry must route to the package window** | Spectrometry is **included with accommodation** ("breakfast, 15-minute wellness consultation, spectrometry testing, and salt room access") [V], *and* inside several programmes | Rewritten as an entitlement rule: inclusions post at 0 against their entitlement source (§3.2 H1/H3) |
| **Rule P1: medical consultation required before thermal baths** | Bioli offers a **free "Express consultation with a specialist"** that "helps to choose the right procedure and exclude any counter-indications" [V]. Mandatory status is not published | Candidate clearance rule **[P]**; needs medical-director sign-off |
| Bioli is Michelin Guide 2025 | **Verified:** Michelin Guide lists Bioli as "Selected" [V]. The resort announced its Michelin Guide 2025 inclusion (Instagram, via search) | Usable with Bioli's consent |
| Guest reviews | TripAdvisor returned HTTP 403 and Booking.com returned no content to automated fetch | Review themes are **[G]**; collect in Week 1 (§7) |
| "Wellness agent **matches contraindications**" | Clinical suitability is a medical decision | The agent **enforces clinician-issued clearances**; it never decides them (HAS-5, §6) |

### 0.3 Corrections to SimStay's own demo fixture

`src/lib/simustay/fixtures/scenario.bioli-cottage.json` and `rules.bioli.json` were written before this research.

| Demo fixture | Verified reality | Action for the pilot build |
|---|---|---|
| "Smart Detox & De-Stress **Package**" | Programmes: "Smart Detox" and "Anti-Stress & Rebalance". Packages (a different catalogue): "Anti-Stress", "Back to Balance", "Corporate Wellness" and others [V] | Use real programme codes (§2.3) |
| "Cottage Stay (≈ $400) 1,080 GEL" | Accommodation rates are not published; programmes are priced separately in **USD** [V] | Accommodation rate from Bioli's PMS [G]; USD programme lines with a recorded FX rate |
| Halotherapy and spectrometry "in package" at 0 | Both are **accommodation inclusions** [V] (and programme inclusions) | Entitlement ledger with source = accommodation or program (§5) |
| D1 "aroma menu changes at the doctor's discretion" | Aroma is a guest preference menu [V] | Delete; aroma is HAS-1 dispatch from the guest's choice |
| "Grand Premium Cottage 12 (Bioli Forest)" | Grand Premium Cottage is a real type [V]. Unit numbering is unknown [G] | Keep as scenario label until the PMS import |
| Photo tag "ევკალიპტის არომატიზატორი ✓" (eucalyptus diffuser) | Eucalyptus is on the real aroma menu [V] | Keep; the tag is driven by the confirmed preference |

---

## 1. Executive Summary

**The pilot in one sentence.** For 30 days at Bioli, SimStay runs as a shadow-then-live operating layer over Bioli's existing systems. It does five things:
1. codifies Bioli's billing and entitlement rules into a GM-signed rule set;
2. turns guest preferences (aroma, pillow, sheets) into verified cottage-setup work orders;
3. schedules programme procedures against entitlements and resource calendars, enforcing clinician-issued clearances;
4. routes every folio line to the correct window (personal card, prepaid programme, corporate) before posting;
5. trains and drills front-office and cottage staff over messaging.

**Why Bioli is a hard, valuable first medical-wellness tenant [V]/[I]:**
- **Tri-source entitlements.** Accommodation includes breakfast, a 15-minute wellness consultation, spectrometry and salt-room access. Programmes include counted sessions: Anti-Stress & Rebalance includes, for example, phyto baths ×4 and halotherapy ×4. Corporate Wellness has its own inclusions. A procedure can be covered by any of them, or by none.
- **Two currencies.** Programmes are priced in **USD** ($800–$6,380). Procedures and consultations are priced in **GEL** (55–1,221 ₾).
- **Clinical boundary.** Doctors, a somnologist, psychologists and IV/OPL therapies sit next to hospitality tasks. Health data is special-category personal data under Georgian law (legal review [G]).
- **Premium expectation.** Michelin Guide selection [V]: the tolerance for a wrong aroma or a billing dispute is near zero.

**What already exists in SimStay (Today):**
- deterministic folio gate with rule citations;
- entitlement-style routing (package payer, 0-GEL inclusions);
- housekeeping mobile flow with a 5/5 checklist and photo;
- Bioli demo tenant (17 cottages);
- agent inspector drawers.

**What this blueprint adds, and has tested:**
- **Production PostgreSQL schema** with row-level security that separates tenant data *and* clinical-role data. Tested: 12/12 checks pass (§5.5).
- An **atomic entitlement ledger** that routes the 5th phyto bath of a 4-session programme to the personal card (tested).
- A **no-double-booking** exclusion constraint on treatment resources (tested).
- **Four signed-card-ready A2A v1.0 Agent Cards** and four payload JSON Schemas, all validated.
- A **22-task HAS matrix**, a **30-day playbook** and **measurable KPIs**.

---

## 2. Bioli Domain Reality (Verified)

### 2.1 Property

| Fact | Value | Label |
|---|---|---|
| Legal/brand name | BIOLI Wellness Resort (listed on OTAs as "Bioli Medical Wellness Resort") | [V] |
| Address | Bioli Street 1, Kojori, Tbilisi, Georgia, 0114; "15 km … from the center of Tbilisi" | [V] |
| Grounds | 31 ha, 70% forested (bioli.ge). 32 ha in third-party listings | [V]/[C] |
| Units | 17 (Michelin); 16 by an older bioli.ge inventory | [C] |
| Recognition | MICHELIN Guide: "Selected" | [V] |
| Languages served | Georgian, Russian, English (site languages) | [V] |
| Guest app | "special mobile application, an individual wellness therapist and fitness instructor" | [V] |
| Phone | +995 322 322 322; +995 595 801 003 | [V] |

### 2.2 Accommodation and in-room personalisation

| Type (current bioli.ge) | Description | Label |
|---|---|---|
| Grand Premium Cottage | Two floors; 2 bedrooms (king + queen); **private treatment room** and work room; forest and mountain views | [V] |
| Grand Chalet | One floor; 2 bedrooms (king + double) | [V] |
| Premium Cottage | 1 bedroom (king); windows on three sides; balcony and rooftop terrace | [V] |
| Chalet | Two floors; 1 bedroom (double); outside jacuzzi; lake views | [V] |
| Superior Room | Older site version only | [C] |

**Included with accommodation:** breakfast, a 15-minute wellness consultation, spectrometry testing, salt-room access [V]. **Amenities:** Wi-Fi, hypoallergenic linen, minibar, coffee/tea station, satellite TV, complimentary mineral water, robe, and hygiene items from a French brand [V].

**Personalisation menus [V]:**
- **Aroma:** orange, eucalyptus, lavender, iris, ylang-ylang, pine, fir.
- **Pillow:** sintepon, feather, medicinal plants.
- **Sheets:** cotton or linen.
- **Other bedding:** "pillows, covers and mattress types according to their preferences".

The Grand Premium Cottage's **private treatment room** matters operationally. In-cottage treatments are a scheduling resource tied to the unit [I].

### 2.3 Programmes (prices in USD) [V]

| Programme | Durations and prices | Notable inclusions (abridged) |
|---|---|---|
| **Smart Detox** | 3 d $800 · 7 d $2,400 · 10 d $3,680 | Chief Wellness Expert ×2, Chief Physician/Endocrinologist-Nutritionist ×2; spectrometry, thermography, vein function, body composition, lung function, liver markers, lipids; three-course wellness meals; supplements; infrared sauna, herbal steam, massage, vibroacoustic therapy; gender-specific extras |
| **Anti-Stress & Rebalance** | 7 d $2,060 · 14 d $3,560 | Chief doctor ×2, chief wellness expert ×2, psychologist ×1; spectrometry, HRV, spirometry, echocardiography, thyroid ultrasound, blood work, cortisol; bioidentical therapy ×7, **halotherapy ×4**, vagus nerve stimulation ×6, mitochondrial renewal ×5, vibro-acoustic ×5, **phyto baths ×4**, **infrared sauna ×4**, **wellness cocoon ×4** |
| **The Art of Sleeping** | 7 d $2,900 · 10 d $3,970 · 14 d $5,300 | Doctor, somnologist, wellness expert, psychotherapist; somnography, HRV, spectrometry; phyto bath, infrared sauna, magnetotherapy; kinesiotherapy; art therapy |
| **Weight Management** | 7 d $2,436 · 14 d $4,640 | Body composition, metabolic testing, cardio assessments; **wellness menu 1,300–1,400 kcal/day**; kinesiotherapy, aquatic exercise; 2 weeks of post-programme consultation |
| **A Strong Immune System** | 7 d $2,900 · 14 d $5,220 | Blood work, cardiac screening, thyroid ultrasound; **IV infusions with antioxidant and OPL therapy**; salt room; phyto-procedures |
| **Premium Revival** | 7 d $3,364 · 14 d $6,380 | Doctor, psychological, neurological consultations; labs; polysomnography; phyto baths, halotherapy; magnetic and art therapy |
| **Mental Detox** | 3 d $950 | Wellness coaching, chief doctor, psychologist (art therapy); spectrometry, HRV; qigong / yoga / 5 Rhythms; phyto bath, halotherapy, forest therapy |
| Health Resource Management, Intro | Listed; price not captured | [G] |

**Packages (a separate catalogue)** [V]: Wellness Day, Anti-Stress, Back to Balance, Freedom of Movement, Wellness Silhouette, Weight Expertise, French Pearl, Well-Skin, **Corporate Wellness**. Corporate Wellness offers conference facilities, three wellness meals daily, physical activities and massage; minimum one day from 12:00. Prices are not published [G].

**Whether programme prices include accommodation is not stated** on the programme pages. A 2026 Anti-Stress offer discounts "program and accommodation" separately, which suggests separate lines [V]/[I]. This is confirmed in Week 1 [G] and determines window design (§3.2).

### 2.4 Session counts are only partly published

Anti-Stress & Rebalance lists counts (e.g. phyto baths ×4). Smart Detox lists procedures **without counts**. The entitlement ledger (§5) therefore seeds counted entitlements only where published. All other counts come from Bioli's programme sheets in Week 1 [G].

### 2.5 Diagnostics [V]

| Diagnostic | Components | Price |
|---|---|---|
| Diagnosis of health resources | Doctor consultation, oxidative status, **spectrometry (micronutrients and heavy metals)**, thermography, tissue-composition diagnosis, Venoscreen, arteriography, HRV, thyroid ultrasound, ECG, echocardiography | 500 USD |
| Diagnosis of cardio status | HRV, arteriography, **ECG**, echocardiography, 24-h BP monitoring, doctor consultation | 200 USD |
| Stress level, Metabolism, Fitness status, Facial skin | Listed | [G] |

### 2.6 Procedures and consultations [V]

| Procedure (Revitalization) | Price |
|---|---|
| Phytobath | 145 ₾ |
| Experience Shower | 55 ₾ |
| Contrast Shower | 55 ₾ |
| **Salt room (halotherapy)** | **73 ₾** |
| Infrared full-spectrum medical sauna | 145 ₾ |
| Wellness Cocoon | 145 ₾ |
| OPL therapy (minimum 3 procedures) | 1,221 ₾ |
| Physiotherm | 102 ₾ |
| Bioidentical signaling therapy (NanoVi) | 58 ₾ |

| Consultation | Price |
|---|---|
| Doctor consultation | 174 ₾ |
| Wellness expert consultation (meal planning, formulas, medicinal plants, **aromatherapy**, lifestyle) | 174 ₾ |
| Consilium (two or more doctors) | 319 ₾ |
| Wellness coaching | 116 ₾ |
| **Express consultation with a specialist** ("exclude any counter-indications") | **Free** |

Massage, cosmetology and physical-activity price lists are on separate pages and are captured in Week 1 [G].

### 2.7 Dining

- **Bioli Hall** is both restaurant and event hall.
- Cuisine is "Georgian Wellness". The menu is "chosen individually based on medical diagnosis, by the recommendation of the Bioli nutritionist". Dishes are enriched with "endemic phyto elements"; produce comes from the Bioli hothouse.
- Reservations require 24 hours' notice [V].
- Every programme includes three-course wellness meals [V].

**Operational consequence.** Every in-house programme guest has a **nutritionist-set dietary plan** that the kitchen must receive as a ticket (§4, §5).

---

## 3. The Bioli Hospitality Ontology (Data, Logic, Actions; `WEF-D` §4.4)

### 3.1 Data layer

| Entity | Attributes (production table, §5) | System of record | Sensitivity |
|---|---|---|---|
| Property | tenant id, code, time zone, base currency GEL | SimStay | — |
| Unit (1–17) | unit no., type (5-value enum), status, status version, `attrs` (e.g. has treatment room) | **Bioli PMS** [G], mirrored | — |
| Guest | name, preferred language (ka/en/ru), VIP tier, `attrs` | Bioli PMS/CRM | Personal |
| Guest preference | aroma (7), pillow (3), sheets (2), `attrs` (mattress, covers), confirmed-by-guest flag | SimStay | Personal |
| **Dietary profile** | diet codes, allergen codes, kcal target, set by (doctor/nutritionist), validity | Set by clinicians in SimStay, or synced from Bioli's medical system | **Health (special category)** |
| **Procedure clearance** | procedure category (thermal, medical, …), status, clinician, validity, *external record pointer* | Set by clinicians | **Health**; status only, **no clinical values** |
| Catalogue item | code, names, category, list price, currency, clearance category, alcohol flag | Bioli price lists | — |
| Programme and entitlement template | programme code, duration, price (USD), item quotas | Bioli programme sheets | — |
| Stay | reservation ref, guest, unit, dates, status | Bioli PMS | Personal |
| Entitlement ledger | stay × item × source (accommodation / program / corporate), quota, consumed, priority | SimStay (derived at check-in) | — |
| Folio window, folio line | window 1–4, payer type, method; line currency, FX rate and source, GEL amount, entitlement source, rule-set version, gate verdict, idempotency key | Proposed in SimStay, **posted to the Bioli PMS** | Financial |
| Appointment | item, resource (salt room, phytobath 1, doctor, in-cottage treatment room), time range, status, clearance checked | SimStay (or Bioli's scheduling system [G]) | Personal |
| Work order | cottage setup / amenity / maintenance, payload, state, evidence | SimStay | — |
| Rule | tier, check kind, params, source doc/page/quote, status (candidate/signed), signer | SimStay | — |

**Data-minimisation principle [P].** SimStay stores **no clinical results**: no spectrometry values, ECG traces or diagnoses. Clinical records stay in Bioli's medical system. SimStay holds only the *operational flags* staff and agents need: a diet code, an allergen code, a kcal target, "cleared for thermal procedures until 10 Oct". This shrinks the regulatory surface and keeps SimStay out of clinical decision support.

### 3.2 Logic layer: the Bioli rule set (all **candidate [P]** until GM / medical-director signature)

| ID | Tier | Rule | Machine check | Evidence behind the proposal |
|---|---|---|---|---|
| **H1** | H | An item consumed against a remaining entitlement posts at **0.00** to the entitlement's window (accommodation or programme → prepaid W2; corporate → W3) | `consume_entitlement()` returns a source ⇒ `unit_price = 0` (DB check constraint) | Accommodation and programme inclusions [V] |
| **H2** | H | Alcohol and minibar are **never** covered by a programme or accommodation entitlement. They post to the guest's personal window (W1) unless a signed corporate agreement explicitly covers them (W3) | `is_alcohol` or category `minibar` ⇒ payer ∈ {guest, company-with-clause} | **Not published by Bioli**; wellness-programme logic [P] |
| **H3** | H | Accommodation inclusions (breakfast, 15-min wellness consultation, spectrometry, salt-room access) are posted as 0-GEL entitlement lines, never charged to W1 while the stay is active | Entitlement source = accommodation | [V] accommodation page |
| **H4** | H | Consumption beyond quota posts at **list price** to W1, with the guest informed *before* the service | `consume_entitlement()` returns NULL ⇒ W1, list price; Concierge notification required before confirmation | Anti-Stress counts [V]; list prices [V] |
| **H5** | H | Every non-guest window needs a payee and a method (prepaid programme; direct bill for corporate) | Window integrity (prototype check kind) | Prototype rule family |
| **H6** | H | USD lines carry an FX rate and its source; the GEL amount is computed and stored at posting | `fx_rate_to_gel`, `fx_source` NOT NULL; generated `amount_gel` | USD programmes [V]; FX policy [G] |
| **H7** | H | The folio balances at check-out: no unrouted line; every line re-graded against the current signed rule set | Balance + re-grade (prototype `gateFinish`) | Prototype |
| **P1** | P | A procedure whose catalogue item has a clearance category (thermal, medical) may be **confirmed** only if a valid clinician clearance exists for the guest. The free express consultation is the default path to obtain one | Appointment confirmation requires a `procedure_clearance` row, status `cleared`, not expired | Express consultation text [V]; mandatory status **[P]** for the medical director |
| **P2** | P | Dietary plans are set only by a doctor or nutritionist; the kitchen receives diet and allergen codes, never diagnoses | RLS write policy (§5) | Menu "based on medical diagnosis, by the recommendation of the Bioli nutritionist" [V] |
| **P3** | P | A unit is sellable only after supervisor inspection | Status = inspected | Prototype rule family |
| **P4** | P | Bioli Hall bookings need 24 hours' notice | Booking lead time ≥ 24 h | [V] |
| **P5** | P | The entitlement consumption order when two sources cover the same item (e.g. salt room: programme quota vs unlimited accommodation access) is a signed policy | `priority` column; the tested default is programme first | Business choice [G] |
| **D1** | D | Substituting one procedure for another within a programme (e.g. health reasons) is at the wellness expert's discretion; coached, never failed | None | Programme personalisation language [V] |
| **D2** | D | Late checkout is at the manager's discretion | None | Prototype |

**Removed from the demo rule set:** "aroma menu changes at the doctor's discretion" (invented; §0.3).

**How rules are signed.** Bioli's own documents (price lists, programme sheets, house rules) are ingested in Rule Studio. Each rule is linked to the exact page and quote, then signed by the GM (billing rules) or the medical director (P1, P2). Until then every row in `core.rule` has status `candidate`. The schema forbids `signed` without a signer and a timestamp.

### 3.3 Actions layer

| Action | Actor (HAS) | Preconditions (Logic) | Verification | Escalation |
|---|---|---|---|---|
| Materialise entitlements at check-in | System (HAS-1) | Stay in house; programme and accommodation known | Ledger rows = programme template + accommodation inclusions | Front desk if the programme is missing |
| Dispatch cottage setup | Cottage-ops agent (HAS-1) | Preference confirmed by the guest; due before arrival | Attendant checklist + photo; simulated AI photo tags **labelled as simulation** until a real model is validated | Housekeeping supervisor |
| Send kitchen ticket | Wellness agent (HAS-1) | Dietary profile set by a clinician | Ticket acknowledged by the kitchen lead | Nutritionist |
| Propose schedule | Wellness agent (HAS-2) | Entitlements; resource calendars; clearances | Exclusion constraint prevents double booking; the clinician reviews the plan | Wellness expert |
| Confirm a procedure needing clearance | Wellness agent (HAS-2) | P1 clearance valid | DB lookup under clinical-role RLS | `INPUT_REQUIRED` → express consultation booking |
| Record clearance | Doctor or wellness expert (**HAS-5**) | Clinical assessment in Bioli's system | RLS: only clinical roles can write; the signer's role is recorded | Medical director |
| Propose a posting | Folio agent (HAS-2) | H1–H6 | Gate verdict stored on the line | Front desk |
| Check-out settlement | Front desk + folio copilot (**HAS-3**) | H7 | Gate + human approval | Duty manager |
| Resolve a programme-inclusion dispute | Front desk (**HAS-4**) with the copilot citing inclusions | Programme sheet in the ontology | Decision + reason logged | GM |

---

## 4. A2A and MCP Agent Topology for Bioli

### 4.1 Topology

The architecture follows `A2A-D` §2.2: agent plane over A2A v1.0; tool plane via MCP / OpenAPI 3.1; state plane in PostgreSQL. Writes follow "hub for writes, mesh for reads" (`A2A-D` §2.6): the **Dispatcher** supervises every multi-intent turn and every write.

| Agent | Role | Reads | Writes (via tools) | Never |
|---|---|---|---|---|
| `bioli_concierge_agent` | Guest intake: WhatsApp, Telegram, web; ka/en/ru | Guest preferences, stay summary | Intents, guest notifications | Folio, clearances, schedules (untrusted-input boundary, `A2A-D` §4.2) |
| `bioli_wellness_agent` | Schedules diagnostics, consultations and procedures; entitlements; kitchen tickets | Entitlements, calendars, **clearance status**, diet codes | Appointments (proposed/confirmed), kitchen tickets | Clinical decisions; clearance writes |
| `bioli_cottage_ops_agent` | Cottage setup, amenities, maintenance | Preferences, unit status | Work orders | Unit "inspected" (supervisor only) |
| `bioli_folio_agent` | Multi-window posting and settlement proposals | Entitlements, catalogue, rules | Posting *proposals* | Commits without the gate; S3 commits without front-desk approval |
| Dispatcher (existing design, `A2A-D` §5) | Supervisor for multi-intent turns and writes | All task states | Routing, `interrupt()` for human review | — |

**Tool plane (MCP servers) [P]/[G]:**

| MCP server | Backing system | Scope |
|---|---|---|
| `pms` | Bioli's PMS (vendor unknown [G]); Mews-shaped dry-run, or CSV export until an API is confirmed (`PS` §6.6) | Unit status, stays, folio post |
| `scheduling` | SimStay `core.appointment` (or Bioli's scheduler [G]) | Availability, propose, confirm |
| `gate` | SimStay ontology gate | Validate posting and settlement proposals |
| `messaging` | WhatsApp Business / Telegram Bot | Send within the service window |
| `pos` | Bioli Hall / bar / minibar POS [G] | Charges feed (alcohol flag) |

### 4.2 Agent Cards (A2A v1.0, served at `/.well-known/agent-card.json`; validated JSON)

All four cards use the SimStay extension registry from `A2A-D` §2.3: skill schemas, stakes, trace context, delegation, rate limits, data residency. As `A2A-D` §2.3 notes, the exact JSON encoding of `securitySchemes` and `securityRequirements` should be validated against the official A2A SDK before publication. Cards are JWS-signed at deployment. The `signatures` field is added by the signing step and is not hand-authored.

**`bioli_concierge_agent`**

```json
{
  "name": "Bioli Concierge",
  "description": "Guest intake for Bioli Wellness Resort over WhatsApp, Telegram and web chat in Georgian, English and Russian. Extracts typed intents and delegates; never writes folios, clearances or schedules itself.",
  "supportedInterfaces": [
    {
      "url": "https://agents.simstay.example/a2a/bioli_concierge_agent",
      "protocolBinding": "JSONRPC",
      "protocolVersion": "1.0"
    }
  ],
  "provider": {
    "organization": "SimStay",
    "url": "https://simstay.example"
  },
  "version": "0.1.0",
  "documentationUrl": "https://docs.simstay.example/agents/bioli_concierge_agent",
  "capabilities": {
    "streaming": true,
    "pushNotifications": true,
    "extendedAgentCard": true,
    "extensions": [
      {
        "uri": "https://simstay.example/a2a/ext/skill-schemas/v1",
        "description": "JSON Schema 2020-12 for each skill's data-part input and artifact output.",
        "required": true,
        "params": {
          "handle_guest_message": {
            "input": "https://simstay.example/schemas/bioli/v1/guest-message.json",
            "output": "https://simstay.example/schemas/bioli/v1/intent-batch.json"
          },
          "notify_guest": {
            "input": "https://simstay.example/schemas/bioli/v1/guest-notification.json",
            "output": "https://simstay.example/schemas/bioli/v1/delivery-receipt.json"
          },
          "handoff_to_human": {
            "input": "https://simstay.example/schemas/bioli/v1/handoff.json",
            "output": "https://simstay.example/schemas/bioli/v1/handoff-receipt.json"
          }
        }
      },
      {
        "uri": "https://simstay.example/a2a/ext/stakes/v1",
        "description": "Stakes tier and Human Agency Scale level per skill; S3 effects require the deterministic gate or a human.",
        "required": true,
        "params": {
          "handle_guest_message": {
            "stakes": "S2",
            "has": "HAS-2"
          },
          "notify_guest": {
            "stakes": "S2",
            "has": "HAS-1"
          },
          "handoff_to_human": {
            "stakes": "S0",
            "has": "HAS-1"
          }
        }
      },
      {
        "uri": "https://simstay.example/a2a/ext/trace-context/v1",
        "description": "W3C traceparent required on every request and mirrored into Message.metadata.",
        "required": true
      },
      {
        "uri": "https://simstay.example/a2a/ext/delegation/v1",
        "description": "Actor chain (actor, onBehalfOf, scope) in Message.metadata for every write skill.",
        "required": true
      },
      {
        "uri": "https://simstay.example/a2a/ext/rate-limits/v1",
        "description": "Advertised client limits; enforced server-side with 429 and Retry-After.",
        "required": false,
        "params": {
          "requestsPerMinute": 60,
          "burst": 20,
          "maxConcurrentTasks": 10
        }
      },
      {
        "uri": "https://simstay.example/a2a/ext/data-residency/v1",
        "description": "Processes guest personal data only in the declared region; health classes restricted.",
        "required": true,
        "params": {
          "region": "GE",
          "piiClasses": [
            "contact",
            "preferences"
          ],
          "healthClasses": []
        }
      }
    ]
  },
  "securitySchemes": {
    "simstay_oauth": {
      "oauth2SecurityScheme": {
        "flows": {
          "clientCredentials": {
            "tokenUrl": "https://auth.simstay.example/oauth2/token",
            "scopes": {
              "concierge:converse": "Converse with guests on behalf of the property"
            }
          }
        }
      }
    }
  },
  "securityRequirements": [
    {
      "schemes": {
        "simstay_oauth": {
          "list": [
            "concierge:converse"
          ]
        }
      }
    }
  ],
  "defaultInputModes": [
    "application/json",
    "text/plain"
  ],
  "defaultOutputModes": [
    "application/json",
    "text/plain"
  ],
  "skills": [
    {
      "id": "handle_guest_message",
      "name": "Handle guest message",
      "description": "Turn a guest utterance into typed intents (preference, amenity, schedule request, dietary question, billing question) and route them.",
      "tags": [
        "concierge",
        "intake",
        "multilingual"
      ],
      "examples": [
        "Please prepare lavender aroma and a feather pillow",
        "Can I add a phytobath tomorrow morning?"
      ],
      "inputModes": [
        "text/plain",
        "application/json"
      ],
      "outputModes": [
        "application/json",
        "text/plain"
      ]
    },
    {
      "id": "notify_guest",
      "name": "Notify guest",
      "description": "Send a confirmation or status update to the guest in their preferred language within the messaging service window.",
      "tags": [
        "concierge",
        "notification"
      ],
      "inputModes": [
        "application/json"
      ],
      "outputModes": [
        "application/json"
      ]
    },
    {
      "id": "handoff_to_human",
      "name": "Hand off to human",
      "description": "Transfer the conversation to front desk or the wellness team with the full context and open tasks.",
      "tags": [
        "concierge",
        "escalation"
      ],
      "inputModes": [
        "application/json"
      ],
      "outputModes": [
        "application/json"
      ]
    }
  ]
}
```

**`bioli_wellness_agent`**

```json
{
  "name": "Bioli Wellness Scheduler",
  "description": "Schedules Bioli diagnostics, consultations and procedures against program entitlements and resource calendars. Enforces clinician-issued clearances; never decides clinical suitability.",
  "supportedInterfaces": [
    {
      "url": "https://agents.simstay.example/a2a/bioli_wellness_agent",
      "protocolBinding": "JSONRPC",
      "protocolVersion": "1.0"
    }
  ],
  "provider": {
    "organization": "SimStay",
    "url": "https://simstay.example"
  },
  "version": "0.1.0",
  "documentationUrl": "https://docs.simstay.example/agents/bioli_wellness_agent",
  "capabilities": {
    "streaming": true,
    "pushNotifications": true,
    "extendedAgentCard": true,
    "extensions": [
      {
        "uri": "https://simstay.example/a2a/ext/skill-schemas/v1",
        "description": "JSON Schema 2020-12 for each skill's data-part input and artifact output.",
        "required": true,
        "params": {
          "propose_schedule": {
            "input": "https://simstay.example/schemas/bioli/v1/schedule-request.json",
            "output": "https://simstay.example/schemas/bioli/v1/schedule-plan.json"
          },
          "book_procedure": {
            "input": "https://simstay.example/schemas/bioli/v1/appointment-request.json",
            "output": "https://simstay.example/schemas/bioli/v1/appointment.json"
          },
          "entitlement_status": {
            "input": "https://simstay.example/schemas/bioli/v1/stay-ref.json",
            "output": "https://simstay.example/schemas/bioli/v1/entitlement-status.json"
          }
        }
      },
      {
        "uri": "https://simstay.example/a2a/ext/stakes/v1",
        "description": "Stakes tier and Human Agency Scale level per skill; S3 effects require the deterministic gate or a human.",
        "required": true,
        "params": {
          "propose_schedule": {
            "stakes": "S2",
            "has": "HAS-2"
          },
          "book_procedure": {
            "stakes": "S2",
            "has": "HAS-2"
          },
          "entitlement_status": {
            "stakes": "S0",
            "has": "HAS-1"
          }
        }
      },
      {
        "uri": "https://simstay.example/a2a/ext/trace-context/v1",
        "description": "W3C traceparent required on every request and mirrored into Message.metadata.",
        "required": true
      },
      {
        "uri": "https://simstay.example/a2a/ext/delegation/v1",
        "description": "Actor chain (actor, onBehalfOf, scope) in Message.metadata for every write skill.",
        "required": true
      },
      {
        "uri": "https://simstay.example/a2a/ext/rate-limits/v1",
        "description": "Advertised client limits; enforced server-side with 429 and Retry-After.",
        "required": false,
        "params": {
          "requestsPerMinute": 60,
          "burst": 20,
          "maxConcurrentTasks": 10
        }
      },
      {
        "uri": "https://simstay.example/a2a/ext/data-residency/v1",
        "description": "Reads clearance status flags only; clinical records stay in Bioli's medical system.",
        "required": true,
        "params": {
          "region": "GE",
          "piiClasses": [
            "contact"
          ],
          "healthClasses": [
            "clearance_status",
            "diet_codes"
          ]
        }
      }
    ]
  },
  "securitySchemes": {
    "simstay_oauth": {
      "oauth2SecurityScheme": {
        "flows": {
          "clientCredentials": {
            "tokenUrl": "https://auth.simstay.example/oauth2/token",
            "scopes": {
              "wellness:schedule": "Propose and confirm appointments",
              "wellness:clearance.read": "Read clearance status (not clinical content)"
            }
          }
        }
      }
    }
  },
  "securityRequirements": [
    {
      "schemes": {
        "simstay_oauth": {
          "list": [
            "wellness:clearance.read",
            "wellness:schedule"
          ]
        }
      }
    }
  ],
  "defaultInputModes": [
    "application/json",
    "text/plain"
  ],
  "defaultOutputModes": [
    "application/json",
    "text/plain"
  ],
  "skills": [
    {
      "id": "propose_schedule",
      "name": "Propose schedule",
      "description": "Build a day-by-day plan for a program stay from its entitlements, resource availability and the guest's clearance status.",
      "tags": [
        "wellness",
        "scheduling",
        "entitlements"
      ],
      "examples": [
        "Plan the 7-day Anti-Stress & Rebalance schedule for cottage 12"
      ],
      "inputModes": [
        "application/json"
      ],
      "outputModes": [
        "application/json"
      ]
    },
    {
      "id": "book_procedure",
      "name": "Book procedure",
      "description": "Book one procedure or diagnostic slot; returns INPUT_REQUIRED when a clearance is missing or expired.",
      "tags": [
        "wellness",
        "booking"
      ],
      "inputModes": [
        "application/json"
      ],
      "outputModes": [
        "application/json"
      ]
    },
    {
      "id": "entitlement_status",
      "name": "Entitlement status",
      "description": "Return remaining and consumed entitlements per item and source (program, accommodation, corporate).",
      "tags": [
        "wellness",
        "entitlements"
      ],
      "inputModes": [
        "application/json"
      ],
      "outputModes": [
        "application/json"
      ]
    }
  ]
}
```

**`bioli_cottage_ops_agent`**

```json
{
  "name": "Bioli Cottage Operations",
  "description": "Dispatches personalised cottage setups (aroma, pillow, sheets, hypoallergenic linen check) and amenity or maintenance work orders; closes them only with attendant evidence.",
  "supportedInterfaces": [
    {
      "url": "https://agents.simstay.example/a2a/bioli_cottage_ops_agent",
      "protocolBinding": "JSONRPC",
      "protocolVersion": "1.0"
    }
  ],
  "provider": {
    "organization": "SimStay",
    "url": "https://simstay.example"
  },
  "version": "0.1.0",
  "documentationUrl": "https://docs.simstay.example/agents/bioli_cottage_ops_agent",
  "capabilities": {
    "streaming": true,
    "pushNotifications": true,
    "extendedAgentCard": true,
    "extensions": [
      {
        "uri": "https://simstay.example/a2a/ext/skill-schemas/v1",
        "description": "JSON Schema 2020-12 for each skill's data-part input and artifact output.",
        "required": true,
        "params": {
          "dispatch_cottage_setup": {
            "input": "https://simstay.example/schemas/bioli/v1/cottage-setup.json",
            "output": "https://simstay.example/schemas/bioli/v1/work-order.json"
          },
          "create_work_order": {
            "input": "https://simstay.example/schemas/v1/work-order.create.json",
            "output": "https://simstay.example/schemas/bioli/v1/work-order.json"
          },
          "get_work_order_status": {
            "input": "https://simstay.example/schemas/bioli/v1/work-order-ref.json",
            "output": "https://simstay.example/schemas/bioli/v1/work-order.json"
          }
        }
      },
      {
        "uri": "https://simstay.example/a2a/ext/stakes/v1",
        "description": "Stakes tier and Human Agency Scale level per skill; S3 effects require the deterministic gate or a human.",
        "required": true,
        "params": {
          "dispatch_cottage_setup": {
            "stakes": "S1",
            "has": "HAS-1"
          },
          "create_work_order": {
            "stakes": "S1",
            "has": "HAS-1"
          },
          "get_work_order_status": {
            "stakes": "S0",
            "has": "HAS-1"
          }
        }
      },
      {
        "uri": "https://simstay.example/a2a/ext/trace-context/v1",
        "description": "W3C traceparent required on every request and mirrored into Message.metadata.",
        "required": true
      },
      {
        "uri": "https://simstay.example/a2a/ext/delegation/v1",
        "description": "Actor chain (actor, onBehalfOf, scope) in Message.metadata for every write skill.",
        "required": true
      },
      {
        "uri": "https://simstay.example/a2a/ext/rate-limits/v1",
        "description": "Advertised client limits; enforced server-side with 429 and Retry-After.",
        "required": false,
        "params": {
          "requestsPerMinute": 60,
          "burst": 20,
          "maxConcurrentTasks": 10
        }
      }
    ]
  },
  "securitySchemes": {
    "simstay_oauth": {
      "oauth2SecurityScheme": {
        "flows": {
          "clientCredentials": {
            "tokenUrl": "https://auth.simstay.example/oauth2/token",
            "scopes": {
              "workorders:write": "Create and update work orders",
              "workorders:read": "Read work orders"
            }
          }
        }
      }
    }
  },
  "securityRequirements": [
    {
      "schemes": {
        "simstay_oauth": {
          "list": [
            "workorders:read",
            "workorders:write"
          ]
        }
      }
    }
  ],
  "defaultInputModes": [
    "application/json",
    "text/plain"
  ],
  "defaultOutputModes": [
    "application/json",
    "text/plain"
  ],
  "skills": [
    {
      "id": "dispatch_cottage_setup",
      "name": "Dispatch cottage setup",
      "description": "Create a pre-arrival setup work order from confirmed guest preferences with a due time before arrival.",
      "tags": [
        "housekeeping",
        "personalisation",
        "aroma",
        "pillow"
      ],
      "examples": [
        "Cottage 12: lavender aroma, medicinal-plant pillow, linen sheets, due 13:00"
      ],
      "inputModes": [
        "application/json"
      ],
      "outputModes": [
        "application/json"
      ]
    },
    {
      "id": "create_work_order",
      "name": "Create work order",
      "description": "Create an amenity, cleaning or maintenance work order for a unit.",
      "tags": [
        "housekeeping",
        "maintenance",
        "amenities"
      ],
      "inputModes": [
        "application/json"
      ],
      "outputModes": [
        "application/json"
      ]
    },
    {
      "id": "get_work_order_status",
      "name": "Get work order status",
      "description": "Return state, assignee, ETA and verification evidence.",
      "tags": [
        "housekeeping",
        "status"
      ],
      "inputModes": [
        "application/json"
      ],
      "outputModes": [
        "application/json"
      ]
    }
  ]
}
```

**`bioli_folio_agent`**

```json
{
  "name": "Bioli Folio",
  "description": "Prepares multi-window folio postings for Bioli stays (W1 personal card, W2 prepaid program, W3 corporate) from entitlements and signed rules. Every posting passes the ontology gate; S3 commits require front-desk approval.",
  "supportedInterfaces": [
    {
      "url": "https://agents.simstay.example/a2a/bioli_folio_agent",
      "protocolBinding": "JSONRPC",
      "protocolVersion": "1.0"
    }
  ],
  "provider": {
    "organization": "SimStay",
    "url": "https://simstay.example"
  },
  "version": "0.1.0",
  "documentationUrl": "https://docs.simstay.example/agents/bioli_folio_agent",
  "capabilities": {
    "streaming": true,
    "pushNotifications": true,
    "extendedAgentCard": true,
    "extensions": [
      {
        "uri": "https://simstay.example/a2a/ext/skill-schemas/v1",
        "description": "JSON Schema 2020-12 for each skill's data-part input and artifact output.",
        "required": true,
        "params": {
          "propose_posting": {
            "input": "https://simstay.example/schemas/bioli/v1/posting-request.json",
            "output": "https://simstay.example/schemas/bioli/v1/posting-proposal.json"
          },
          "propose_settlement": {
            "input": "https://simstay.example/schemas/bioli/v1/stay-ref.json",
            "output": "https://simstay.example/schemas/bioli/v1/settlement-proposal.json"
          },
          "explain_line": {
            "input": "https://simstay.example/schemas/bioli/v1/folio-line-ref.json",
            "output": "https://simstay.example/schemas/bioli/v1/line-explanation.json"
          }
        }
      },
      {
        "uri": "https://simstay.example/a2a/ext/stakes/v1",
        "description": "Stakes tier and Human Agency Scale level per skill; S3 effects require the deterministic gate or a human.",
        "required": true,
        "params": {
          "propose_posting": {
            "stakes": "S3",
            "has": "HAS-2"
          },
          "propose_settlement": {
            "stakes": "S3",
            "has": "HAS-3"
          },
          "explain_line": {
            "stakes": "S1",
            "has": "HAS-1"
          }
        }
      },
      {
        "uri": "https://simstay.example/a2a/ext/trace-context/v1",
        "description": "W3C traceparent required on every request and mirrored into Message.metadata.",
        "required": true
      },
      {
        "uri": "https://simstay.example/a2a/ext/delegation/v1",
        "description": "Actor chain (actor, onBehalfOf, scope) in Message.metadata for every write skill.",
        "required": true
      },
      {
        "uri": "https://simstay.example/a2a/ext/rate-limits/v1",
        "description": "Advertised client limits; enforced server-side with 429 and Retry-After.",
        "required": false,
        "params": {
          "requestsPerMinute": 60,
          "burst": 20,
          "maxConcurrentTasks": 10
        }
      }
    ]
  },
  "securitySchemes": {
    "simstay_oauth": {
      "oauth2SecurityScheme": {
        "flows": {
          "clientCredentials": {
            "tokenUrl": "https://auth.simstay.example/oauth2/token",
            "scopes": {
              "folio:propose": "Propose folio postings and splits",
              "folio:read": "Read folio state"
            }
          }
        }
      }
    }
  },
  "securityRequirements": [
    {
      "schemes": {
        "simstay_oauth": {
          "list": [
            "folio:propose",
            "folio:read"
          ]
        }
      }
    }
  ],
  "defaultInputModes": [
    "application/json",
    "text/plain"
  ],
  "defaultOutputModes": [
    "application/json",
    "text/plain"
  ],
  "skills": [
    {
      "id": "propose_posting",
      "name": "Propose posting",
      "description": "Propose the window and price for a charge: zero-priced against a remaining entitlement, else list price to the payer the rules require.",
      "tags": [
        "folio",
        "billing",
        "entitlements"
      ],
      "inputModes": [
        "application/json"
      ],
      "outputModes": [
        "application/json"
      ]
    },
    {
      "id": "propose_settlement",
      "name": "Propose settlement",
      "description": "Propose the check-out settlement across windows with per-line rule citations; returns INPUT_REQUIRED for front-desk approval.",
      "tags": [
        "folio",
        "checkout"
      ],
      "inputModes": [
        "application/json"
      ],
      "outputModes": [
        "application/json"
      ]
    },
    {
      "id": "explain_line",
      "name": "Explain line",
      "description": "Explain why a line sits in its window, citing the signed rule and its source.",
      "tags": [
        "folio",
        "explanation"
      ],
      "inputModes": [
        "application/json"
      ],
      "outputModes": [
        "application/json",
        "text/plain"
      ]
    }
  ]
}
```

### 4.3 End-to-end A2A sequence: arrival in Grand Premium Cottage 12 on Smart Detox (7 days)

**Scenario data:**
- Guest "Elena Rostova" is a **fictional persona**.
- The programme and its price are verified: Smart Detox, 7 days, $2,400 [V].
- The unit number is a scenario label [G].

```mermaid
sequenceDiagram
    autonumber
    participant PMS as Bioli PMS (MCP pms)
    participant D as Dispatcher
    participant C as bioli_concierge_agent
    participant G as Guest (WhatsApp)
    participant CO as bioli_cottage_ops_agent
    participant W as bioli_wellness_agent
    participant K as Bioli Hall kitchen (human)
    participant DR as Doctor / wellness expert (human)
    participant F as bioli_folio_agent
    participant FD as Front desk (human)
    PMS-->>D: event stay.arrival.due (T-24h, BW-0712, unit 12, program smart_detox/7)
    D->>C: SendMessage(contextId=BW-0712, collect preferences)
    C->>G: "Welcome to Bioli. Aroma: orange, eucalyptus, lavender, iris, ylang-ylang, pine or fir? Pillow: sintepon, feather or medicinal plants? Sheets: cotton or linen?"
    G->>C: "Lavender, medicinal plants, linen"
    C->>D: intent preference.confirmed (S1)
    D->>CO: SendMessage(dispatch_cottage_setup, dueBy arrival-2h, idempotencyKey)
    CO-->>D: Task COMPLETED (work order WO-… open, attendant assigned)
    D->>W: SendMessage(propose_schedule, stay BW-0712)
    W->>W: materialise entitlements (accommodation inclusions + Smart Detox template)
    W->>W: read clearance status (RLS role wellness_agent): thermal = none
    W-->>D: Task INPUT_REQUIRED (thermal procedures need clearance; propose express consultation Day 1 09:00)
    D->>DR: interrupt: approve plan + perform express consultation
    DR->>DR: consultation in Bioli medical system
    DR-->>W: write procedure_clearance(thermal, cleared, until departure) [HAS-5]
    DR-->>W: write dietary_profile(diet codes, allergens, kcal) [HAS-5]
    W->>K: kitchen ticket (diet + allergen codes only) — ack required
    K-->>W: acknowledged
    W-->>D: Task COMPLETED (schedule confirmed; no resource overlaps: DB exclusion constraint)
    Note over CO: attendant completes checklist + photo → work order done → supervisor verifies
    G->>C: Day 4: "Can I add a phytobath tomorrow?"
    C->>D: intent schedule.request (S2)
    D->>F: SendMessage(propose_posting, item phytobath)
    F->>F: consume_entitlement(stay, phytobath) → NULL (not in Smart Detox as published) ⇒ W1, 145 ₾ (H4)
    F-->>D: proposal {window 1, 145 GEL, rule H4, source: price list}
    D->>C: ask guest to accept a 145 ₾ charge before booking (H4)
    C->>G: "A phytobath is not included in Smart Detox. It is 145 ₾ on your card. Book it?"
    G->>C: "Yes"
    D->>W: SendMessage(book_procedure) → clearance valid → confirmed
    Note over F,FD: Check-out: F proposes settlement (W1 personal, W2 prepaid programme); gate re-grades every line (H7); FD approves (HAS-3); PMS posts
```

**What the sequence demonstrates:**
- Every write is a gated tool call.
- Every clinical decision is a human `interrupt`.
- Every paid add-on is agreed *before* service (H4). This is the dispute the brief's "zero minibar/alcohol package disputes" KPI targets, applied to all out-of-entitlement items.

---

## 5. Production Data Architecture

### 5.1 Migration from the prototype's in-memory store

| Prototype (`src/lib/simustay/types.ts`) | Production table | Note |
|---|---|---|
| `SimuState.property` (`PropertyInfo`) | `core.property` + configuration rows | `demoScript`, `photoTags_ka` become test fixtures, not production data |
| `Room` | `core.unit` | Status enum unchanged; add `unit_type` (5 verified names) |
| `Folio`, `FolioWindow`, `Charge` | `core.folio_window`, `core.folio_line` | Adds currency, FX, entitlement source, rule-set version, gate verdict, idempotency |
| (none) | `core.entitlement_ledger` + `core.consume_entitlement()` | New: the prototype modelled inclusions as 0-GEL charges only |
| `Rule` | `core.rule` | Adds version, status (candidate/signed), signer |
| `HkTask` | `core.work_order` | Adds the `cottage_setup` category and `payload` JSONB |
| `gateLog`, `adapterLog` | `core.domain_event` (partitioned) + `core.outbox` | CloudEvents envelope (`A2A-D` §4.2) |
| (none) | `health.dietary_profile`, `health.procedure_clearance` | New restricted schema |

### 5.2 DDL (Tested on PostgreSQL 16.15)

```sql
-- SimStay × Bioli pilot schema (PostgreSQL 16). Tested on 16.15.
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE SCHEMA core;
CREATE SCHEMA health;

-- Runtime role: the application connects as a login role that is a member of simstay_app.
-- simstay_app owns nothing, so row-level security always applies to it.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'simstay_app') THEN
    CREATE ROLE simstay_app NOLOGIN;
  END IF;
END $$;

-- ─── Enumerations (verified Bioli vocabularies where marked) ──────────────────────
CREATE TYPE core.unit_type AS ENUM
  ('grand_premium_cottage', 'grand_chalet', 'premium_cottage', 'chalet', 'superior_room');   -- bioli.ge accommodation pages
CREATE TYPE core.unit_status AS ENUM ('occupied', 'dirty', 'clean', 'inspected', 'ooo', 'oos');
CREATE TYPE core.aroma_choice AS ENUM ('orange', 'eucalyptus', 'lavender', 'iris', 'ylang_ylang', 'pine', 'fir');  -- bioli.ge aroma menu
CREATE TYPE core.pillow_choice AS ENUM ('sintepon', 'feather', 'medicinal_plants');                               -- bioli.ge pillow menu
CREATE TYPE core.sheet_choice AS ENUM ('cotton', 'linen');                                                         -- bioli.ge bedding options
CREATE TYPE core.item_category AS ENUM
  ('accommodation', 'program', 'diagnostic', 'procedure', 'consultation', 'fnb', 'minibar', 'bar', 'transfer', 'other');
CREATE TYPE core.payer_type AS ENUM ('guest', 'package', 'company');
CREATE TYPE core.payment_method AS ENUM ('card', 'prepaid', 'direct_bill');
CREATE TYPE core.entitlement_source AS ENUM ('accommodation', 'program', 'corporate');
CREATE TYPE core.stay_status AS ENUM ('booked', 'in_house', 'checked_out', 'cancelled');
CREATE TYPE core.appointment_status AS ENUM ('proposed', 'confirmed', 'done', 'cancelled', 'no_show');
CREATE TYPE core.work_order_state AS ENUM ('open', 'assigned', 'in_progress', 'done', 'verified', 'cancelled');
CREATE TYPE core.rule_tier AS ENUM ('H', 'P', 'D');
CREATE TYPE core.rule_status AS ENUM ('candidate', 'signed', 'retired');
CREATE TYPE health.clearance_status AS ENUM ('cleared', 'not_cleared', 'restricted');

-- ─── Property and units ────────────────────────────────────────────────────────────
CREATE TABLE core.property (
  tenant_id     uuid PRIMARY KEY,
  code          text NOT NULL UNIQUE,
  name          text NOT NULL,
  timezone      text NOT NULL DEFAULT 'Asia/Tbilisi',
  base_currency char(3) NOT NULL DEFAULT 'GEL'
);

CREATE TABLE core.unit (
  tenant_id      uuid NOT NULL REFERENCES core.property(tenant_id),
  unit_no        text NOT NULL,
  unit_type      core.unit_type NOT NULL,
  status         core.unit_status NOT NULL DEFAULT 'inspected',
  status_version bigint NOT NULL DEFAULT 1,
  attrs          jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(attrs) = 'object'),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, unit_no)
);
CREATE INDEX unit_attrs_gin ON core.unit USING gin (attrs jsonb_path_ops);

-- ─── Guests, preferences (operational) ─────────────────────────────────────────────
CREATE TABLE core.guest (
  tenant_id          uuid NOT NULL REFERENCES core.property(tenant_id),
  guest_id           uuid NOT NULL,
  full_name          text NOT NULL,
  preferred_language text NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('ka', 'en', 'ru')),
  vip_tier           smallint NOT NULL DEFAULT 0 CHECK (vip_tier BETWEEN 0 AND 3),
  attrs              jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(attrs) = 'object'),
  row_version        bigint NOT NULL DEFAULT 1,
  PRIMARY KEY (tenant_id, guest_id)
);
CREATE INDEX guest_attrs_gin ON core.guest USING gin (attrs jsonb_path_ops);

CREATE TABLE core.guest_preference (
  tenant_id          uuid NOT NULL,
  guest_id           uuid NOT NULL,
  aroma              core.aroma_choice,
  pillow             core.pillow_choice,
  sheets             core.sheet_choice,
  attrs              jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(attrs) = 'object'),
  confirmed_by_guest boolean NOT NULL DEFAULT false,
  updated_at         timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, guest_id),
  FOREIGN KEY (tenant_id, guest_id) REFERENCES core.guest (tenant_id, guest_id)
);
CREATE INDEX guest_preference_attrs_gin ON core.guest_preference USING gin (attrs jsonb_path_ops);

-- ─── Health (restricted schema). Operational flags only: no clinical values. ───────
CREATE TABLE health.dietary_profile (
  tenant_id       uuid NOT NULL,
  guest_id        uuid NOT NULL,
  diet_codes      text[] NOT NULL DEFAULT '{}',
  allergen_codes  text[] NOT NULL DEFAULT '{}',
  kcal_target     integer CHECK (kcal_target BETWEEN 800 AND 4000),
  set_by_staff_id uuid NOT NULL,
  set_by_role     text NOT NULL CHECK (set_by_role IN ('doctor', 'nutritionist')),
  valid_from      date NOT NULL,
  valid_to        date NOT NULL CHECK (valid_to >= valid_from),
  PRIMARY KEY (tenant_id, guest_id, valid_from),
  FOREIGN KEY (tenant_id, guest_id) REFERENCES core.guest (tenant_id, guest_id)
);

CREATE TABLE health.procedure_clearance (
  tenant_id           uuid NOT NULL,
  guest_id            uuid NOT NULL,
  procedure_category  text NOT NULL,          -- e.g. 'thermal', 'iv_therapy', 'massage', 'physical_activity'
  status              health.clearance_status NOT NULL,
  cleared_by_staff_id uuid NOT NULL,
  cleared_by_role     text NOT NULL CHECK (cleared_by_role IN ('doctor', 'wellness_expert')),
  valid_until         timestamptz NOT NULL,
  external_record_ref text,                   -- pointer into Bioli's medical record system; no clinical content here
  updated_at          timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, guest_id, procedure_category),
  FOREIGN KEY (tenant_id, guest_id) REFERENCES core.guest (tenant_id, guest_id)
);

-- ─── Catalogue, programs, entitlements ─────────────────────────────────────────────
CREATE TABLE core.catalog_item (
  tenant_id          uuid NOT NULL REFERENCES core.property(tenant_id),
  item_code          text NOT NULL,
  name_en            text NOT NULL,
  name_ka            text,
  category           core.item_category NOT NULL,
  list_price         numeric(12,2) NOT NULL CHECK (list_price >= 0),
  currency           char(3) NOT NULL CHECK (currency IN ('GEL', 'USD')),
  clearance_category text,                    -- non-null: a procedure_clearance must exist before booking
  is_alcohol         boolean NOT NULL DEFAULT false,
  PRIMARY KEY (tenant_id, item_code)
);

CREATE TABLE core.program (
  tenant_id     uuid NOT NULL REFERENCES core.property(tenant_id),
  program_code  text NOT NULL,
  name_en       text NOT NULL,
  duration_days integer NOT NULL CHECK (duration_days > 0),
  price         numeric(12,2) NOT NULL CHECK (price >= 0),
  currency      char(3) NOT NULL CHECK (currency IN ('GEL', 'USD')),
  PRIMARY KEY (tenant_id, program_code, duration_days)
);

CREATE TABLE core.program_entitlement (
  tenant_id     uuid NOT NULL,
  program_code  text NOT NULL,
  duration_days integer NOT NULL,
  item_code     text NOT NULL,
  quantity      integer CHECK (quantity IS NULL OR quantity > 0),   -- NULL = unlimited for the program's duration
  PRIMARY KEY (tenant_id, program_code, duration_days, item_code),
  FOREIGN KEY (tenant_id, program_code, duration_days) REFERENCES core.program (tenant_id, program_code, duration_days),
  FOREIGN KEY (tenant_id, item_code) REFERENCES core.catalog_item (tenant_id, item_code)
);

-- ─── Stays, folio ──────────────────────────────────────────────────────────────────
CREATE TABLE core.stay (
  tenant_id       uuid NOT NULL,
  stay_id         uuid NOT NULL,
  reservation_ref text NOT NULL,
  guest_id        uuid NOT NULL,
  unit_no         text NOT NULL,
  arrival         date NOT NULL,
  departure       date NOT NULL CHECK (departure > arrival),
  status          core.stay_status NOT NULL DEFAULT 'booked',
  PRIMARY KEY (tenant_id, stay_id),
  UNIQUE (tenant_id, reservation_ref),
  FOREIGN KEY (tenant_id, guest_id) REFERENCES core.guest (tenant_id, guest_id),
  FOREIGN KEY (tenant_id, unit_no) REFERENCES core.unit (tenant_id, unit_no)
);

CREATE TABLE core.stay_program (
  tenant_id     uuid NOT NULL,
  stay_id       uuid NOT NULL,
  program_code  text NOT NULL,
  duration_days integer NOT NULL,
  payer         core.payer_type NOT NULL,
  PRIMARY KEY (tenant_id, stay_id, program_code),
  FOREIGN KEY (tenant_id, stay_id) REFERENCES core.stay (tenant_id, stay_id),
  FOREIGN KEY (tenant_id, program_code, duration_days) REFERENCES core.program (tenant_id, program_code, duration_days)
);

CREATE TABLE core.entitlement_ledger (
  tenant_id  uuid NOT NULL,
  stay_id    uuid NOT NULL,
  item_code  text NOT NULL,
  source     core.entitlement_source NOT NULL,
  source_ref text NOT NULL,                   -- program code or 'accommodation'
  quota      integer CHECK (quota IS NULL OR quota > 0),
  consumed   integer NOT NULL DEFAULT 0,
  priority   smallint NOT NULL DEFAULT 100,   -- lower is consumed first; a signed Tier P policy sets the order
  PRIMARY KEY (tenant_id, stay_id, item_code, source),
  CHECK (consumed >= 0 AND (quota IS NULL OR consumed <= quota)),
  FOREIGN KEY (tenant_id, stay_id) REFERENCES core.stay (tenant_id, stay_id),
  FOREIGN KEY (tenant_id, item_code) REFERENCES core.catalog_item (tenant_id, item_code)
);

CREATE TABLE core.folio_window (
  tenant_id  uuid NOT NULL,
  stay_id    uuid NOT NULL,
  window_no  smallint NOT NULL CHECK (window_no BETWEEN 1 AND 4),
  payee      text NOT NULL,
  payer_type core.payer_type NOT NULL,
  method     core.payment_method NOT NULL,
  PRIMARY KEY (tenant_id, stay_id, window_no),
  FOREIGN KEY (tenant_id, stay_id) REFERENCES core.stay (tenant_id, stay_id)
);

CREATE TABLE core.folio_line (
  tenant_id          uuid NOT NULL,
  line_id            uuid NOT NULL DEFAULT gen_random_uuid(),
  stay_id            uuid NOT NULL,
  item_code          text NOT NULL,
  qty                integer NOT NULL DEFAULT 1 CHECK (qty > 0),
  unit_price         numeric(12,2) NOT NULL CHECK (unit_price >= 0),
  currency           char(3) NOT NULL CHECK (currency IN ('GEL', 'USD')),
  fx_rate_to_gel     numeric(12,6) NOT NULL CHECK (fx_rate_to_gel > 0),
  fx_source          text NOT NULL,           -- e.g. 'NBG official rate 2026-10-03'
  amount_gel         numeric(12,2) GENERATED ALWAYS AS (round(qty * unit_price * fx_rate_to_gel, 2)) STORED,
  window_no          smallint NOT NULL,
  entitlement_source core.entitlement_source, -- non-null means posted at 0 against an entitlement
  rule_set_version   integer NOT NULL,
  gate_verdict       jsonb NOT NULL,          -- {"ok":true,"ruleId":"OK"} or the blocking rule with source span
  idempotency_key    text NOT NULL,
  posted_at          timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, line_id),
  UNIQUE (tenant_id, idempotency_key),
  CHECK (entitlement_source IS NULL OR unit_price = 0),
  FOREIGN KEY (tenant_id, stay_id, window_no) REFERENCES core.folio_window (tenant_id, stay_id, window_no),
  FOREIGN KEY (tenant_id, item_code) REFERENCES core.catalog_item (tenant_id, item_code)
);

-- ─── Scheduling: resources can never be double-booked ─────────────────────────────
CREATE TABLE core.appointment (
  tenant_id         uuid NOT NULL,
  appointment_id    uuid NOT NULL DEFAULT gen_random_uuid(),
  stay_id           uuid NOT NULL,
  item_code         text NOT NULL,
  resource_code     text NOT NULL,            -- 'salt_room', 'phytobath_1', 'doctor_02', 'ecg_room'
  starts_at         timestamptz NOT NULL,
  ends_at           timestamptz NOT NULL CHECK (ends_at > starts_at),
  status            core.appointment_status NOT NULL DEFAULT 'proposed',
  clearance_checked boolean NOT NULL DEFAULT false,
  PRIMARY KEY (tenant_id, appointment_id),
  FOREIGN KEY (tenant_id, stay_id) REFERENCES core.stay (tenant_id, stay_id),
  FOREIGN KEY (tenant_id, item_code) REFERENCES core.catalog_item (tenant_id, item_code),
  CONSTRAINT appointment_no_overlap EXCLUDE USING gist
    (tenant_id WITH =, resource_code WITH =, tstzrange(starts_at, ends_at) WITH &&)
    WHERE (status IN ('proposed', 'confirmed'))
);

-- ─── Work orders (cottage setup, amenities, maintenance) ───────────────────────────
CREATE TABLE core.work_order (
  tenant_id       uuid NOT NULL,
  work_order_id   uuid NOT NULL DEFAULT gen_random_uuid(),
  unit_no         text NOT NULL,
  category        text NOT NULL CHECK (category IN ('cottage_setup', 'amenity', 'cleaning', 'maintenance', 'inspection')),
  payload         jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  state           core.work_order_state NOT NULL DEFAULT 'open',
  due_by          timestamptz,
  source_event_id uuid,
  idempotency_key text NOT NULL,
  row_version     bigint NOT NULL DEFAULT 1,
  created_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, work_order_id),
  UNIQUE (tenant_id, idempotency_key),
  FOREIGN KEY (tenant_id, unit_no) REFERENCES core.unit (tenant_id, unit_no)
);
CREATE INDEX work_order_payload_gin ON core.work_order USING gin (payload jsonb_path_ops);
CREATE INDEX work_order_open ON core.work_order (tenant_id, state, due_by) WHERE state IN ('open', 'assigned', 'in_progress');

-- ─── Signed rules ──────────────────────────────────────────────────────────────────
CREATE TABLE core.rule (
  tenant_id    uuid NOT NULL REFERENCES core.property(tenant_id),
  rule_id      text NOT NULL,
  version      integer NOT NULL,
  tier         core.rule_tier NOT NULL,
  check_kind   text,
  params       jsonb NOT NULL DEFAULT '{}'::jsonb,
  title_ka     text NOT NULL,
  title_en     text NOT NULL,
  source_doc   text NOT NULL,
  source_page  integer NOT NULL,
  source_quote text NOT NULL,
  status       core.rule_status NOT NULL DEFAULT 'candidate',
  signed_by    text,
  signed_at    timestamptz,
  PRIMARY KEY (tenant_id, rule_id, version),
  CHECK (status <> 'signed' OR (signed_by IS NOT NULL AND signed_at IS NOT NULL))
);

-- ─── Event log and transactional outbox (A2A research doc §4.1) ─────────────────────
CREATE TABLE core.domain_event (
  event_id       uuid NOT NULL,
  tenant_id      uuid NOT NULL,
  type           text NOT NULL,
  subject        text NOT NULL,
  occurred_at    timestamptz NOT NULL,
  trace_id       text NOT NULL,
  correlation_id text NOT NULL,
  causation_id   uuid,
  payload        jsonb NOT NULL,
  PRIMARY KEY (event_id, occurred_at)
) PARTITION BY RANGE (occurred_at);
CREATE TABLE core.domain_event_2026_10 PARTITION OF core.domain_event
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE INDEX domain_event_tenant_type_time ON core.domain_event (tenant_id, type, occurred_at);

CREATE TABLE core.outbox (
  id           bigserial PRIMARY KEY,
  tenant_id    uuid NOT NULL,
  event        jsonb NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
CREATE INDEX outbox_unpublished ON core.outbox (id) WHERE published_at IS NULL;

-- ─── Atomic entitlement consumption (race-free under concurrency) ──────────────────
CREATE FUNCTION core.consume_entitlement(p_stay uuid, p_item text)
RETURNS core.entitlement_source
LANGUAGE plpgsql
AS $$
DECLARE
  v_tenant uuid := current_setting('app.tenant_id')::uuid;
  v_source core.entitlement_source;
BEGIN
  SELECT e.source INTO v_source
  FROM core.entitlement_ledger e
  WHERE e.tenant_id = v_tenant AND e.stay_id = p_stay AND e.item_code = p_item
    AND (e.quota IS NULL OR e.consumed < e.quota)
  ORDER BY e.priority, e.source
  LIMIT 1
  FOR UPDATE;
  IF NOT FOUND THEN
    RETURN NULL;                              -- no remaining entitlement: the charge is personal (window 1)
  END IF;
  UPDATE core.entitlement_ledger e
  SET consumed = e.consumed + 1
  WHERE e.tenant_id = v_tenant AND e.stay_id = p_stay AND e.item_code = p_item AND e.source = v_source;
  RETURN v_source;
END;
$$;

-- ─── Row-level security ────────────────────────────────────────────────────────────
GRANT USAGE ON SCHEMA core, health TO simstay_app;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA core TO simstay_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA core TO simstay_app;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA health TO simstay_app;
GRANT EXECUTE ON FUNCTION core.consume_entitlement(uuid, text) TO simstay_app;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['property', 'unit', 'guest', 'guest_preference', 'catalog_item', 'program',
                           'program_entitlement', 'stay', 'stay_program', 'entitlement_ledger', 'folio_window',
                           'folio_line', 'appointment', 'work_order', 'rule', 'domain_event', 'outbox']
  LOOP
    EXECUTE format('ALTER TABLE core.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format($p$CREATE POLICY tenant_isolation ON core.%I TO simstay_app
                     USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
                     WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid)$p$, t);
  END LOOP;
END;
$$;

-- Health data: tenant AND clinical-role gates. Kitchen reads diets/allergens; nobody outside clinical roles reads clearances.
ALTER TABLE health.dietary_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY dietary_read ON health.dietary_profile FOR SELECT TO simstay_app
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid
         AND current_setting('app.staff_role', true) IN ('doctor', 'nutritionist', 'wellness_expert', 'kitchen_lead', 'wellness_agent'));
CREATE POLICY dietary_write ON health.dietary_profile FOR INSERT TO simstay_app
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid
              AND current_setting('app.staff_role', true) IN ('doctor', 'nutritionist')
              AND set_by_role = current_setting('app.staff_role', true));

ALTER TABLE health.procedure_clearance ENABLE ROW LEVEL SECURITY;
CREATE POLICY clearance_read ON health.procedure_clearance FOR SELECT TO simstay_app
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid
         AND current_setting('app.staff_role', true) IN ('doctor', 'wellness_expert', 'wellness_agent'));
CREATE POLICY clearance_insert ON health.procedure_clearance FOR INSERT TO simstay_app
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid
              AND current_setting('app.staff_role', true) IN ('doctor', 'wellness_expert')
              AND cleared_by_role = current_setting('app.staff_role', true));
CREATE POLICY clearance_update ON health.procedure_clearance FOR UPDATE TO simstay_app
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid
         AND current_setting('app.staff_role', true) IN ('doctor', 'wellness_expert'))
  WITH CHECK (cleared_by_role = current_setting('app.staff_role', true));
```

**Design notes:**
- **Typed columns first, JSONB second.** Fields every stay has are typed and constrained (the enums carry Bioli's verified vocabularies). `attrs`/`payload` JSONB with `jsonb_path_ops` GIN indexes hold sparse or tenant-specific attributes. This is the EAV alternative from `A2A-D` §4.1.
- **Health data lives in a separate schema** with policies gated on **both** tenant and `app.staff_role`.
  - The kitchen reads diet and allergen codes.
  - Nobody outside the clinical roles and the wellness agent reads clearances.
  - Only a doctor or nutritionist writes a dietary plan, and only a doctor or wellness expert writes a clearance. The signer's role must equal the session role.
- **The runtime role owns nothing**, so RLS always applies. Each request runs in a transaction that sets `app.tenant_id` and `app.staff_role` with `SET LOCAL`, derived from the verified access token. The A2A tenant field, the token claim and RLS must agree (`A2A-D` §2.5).
- **`consume_entitlement()`** locks the chosen ledger row (`FOR UPDATE`). Two concurrent bookings of the last included session cannot both consume it.
- **The exclusion constraint** makes double-booking a treatment resource impossible at the database level (requires the `btree_gist` extension).
- **`folio_line` check:** an entitlement-sourced line must be zero-priced. The generated `amount_gel` column makes the FX conversion reproducible.
- **Partitioned `domain_event` + `outbox`:** state change and event commit atomically; a relay publishes CloudEvents and marks `published_at`.

### 5.3 Verified catalogue seed (bioli.ge prices; loads cleanly on the DDL above)

```sql
-- Verified Bioli catalogue (bioli.ge, retrieved 2026-09-27). Tenant id assigned at provisioning.
INSERT INTO core.property (tenant_id, code, name) VALUES
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'bioli', 'Bioli Wellness Resort (Kojori)');

INSERT INTO core.program (tenant_id, program_code, name_en, duration_days, price, currency) VALUES
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'smart_detox',        'Smart Detox',              3,   800.00, 'USD'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'smart_detox',        'Smart Detox',              7,  2400.00, 'USD'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'smart_detox',        'Smart Detox',             10,  3680.00, 'USD'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'anti_stress',        'Anti-Stress & Rebalance',  7,  2060.00, 'USD'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'anti_stress',        'Anti-Stress & Rebalance', 14,  3560.00, 'USD'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'art_of_sleeping',    'The Art of Sleeping',      7,  2900.00, 'USD'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'art_of_sleeping',    'The Art of Sleeping',     10,  3970.00, 'USD'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'art_of_sleeping',    'The Art of Sleeping',     14,  5300.00, 'USD'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'weight_management',  'Weight Management',        7,  2436.00, 'USD'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'weight_management',  'Weight Management',       14,  4640.00, 'USD'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'strong_immune',      'A Strong Immune System',   7,  2900.00, 'USD'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'strong_immune',      'A Strong Immune System',  14,  5220.00, 'USD'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'premium_revival',    'Premium Revival',          7,  3364.00, 'USD'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'premium_revival',    'Premium Revival',         14,  6380.00, 'USD'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'mental_detox',       'Mental Detox',             3,   950.00, 'USD');

INSERT INTO core.catalog_item (tenant_id, item_code, name_en, category, list_price, currency, clearance_category) VALUES
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'dx_health_resources', 'Diagnosis of health resources',            'diagnostic',    500.00, 'USD', NULL),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'dx_cardio',           'Diagnosis of cardio status',               'diagnostic',    200.00, 'USD', NULL),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'phytobath',           'Phytobath',                                'procedure',     145.00, 'GEL', 'thermal'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'experience_shower',   'Experience Shower',                        'procedure',      55.00, 'GEL', NULL),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'contrast_shower',     'Contrast Shower',                          'procedure',      55.00, 'GEL', 'thermal'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'salt_room',           'Salt room (halotherapy)',                  'procedure',      73.00, 'GEL', NULL),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'infrared_sauna',      'Infrared full spectrum medical sauna',     'procedure',     145.00, 'GEL', 'thermal'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'wellness_cocoon',     'Wellness Cocoon',                          'procedure',     145.00, 'GEL', NULL),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'opl_therapy_course',  'OPL therapy (minimum 3 procedures)',       'procedure',    1221.00, 'GEL', 'medical'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'physiotherm',         'Physiotherm',                              'procedure',     102.00, 'GEL', 'thermal'),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'nanovi',              'Bioidentical signaling therapy (NanoVi)',  'procedure',      58.00, 'GEL', NULL),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'doctor_consult',      'Doctor consultation',                      'consultation',  174.00, 'GEL', NULL),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'wellness_expert',     'Wellness expert consultation',             'consultation',  174.00, 'GEL', NULL),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'consilium',           'Consilium',                                'consultation',  319.00, 'GEL', NULL),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'wellness_coaching',   'Wellness coaching',                        'consultation',  116.00, 'GEL', NULL),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'express_consult',     'Express consultation with a specialist',   'consultation',    0.00, 'GEL', NULL);

-- Anti-Stress & Rebalance published session counts (bioli.ge/en/programs/antistress). Assigned to the 7-day variant;
-- 14-day counts are confirmed at the FDS visit before seeding.
INSERT INTO core.program_entitlement (tenant_id, program_code, duration_days, item_code, quantity) VALUES
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'anti_stress', 7, 'nanovi',          7),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'anti_stress', 7, 'salt_room',       4),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'anti_stress', 7, 'phytobath',       4),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'anti_stress', 7, 'infrared_sauna',  4),
 ('6f1c2e9a-3b7d-4c55-9e21-0b8a4d7f5c13', 'anti_stress', 7, 'wellness_cocoon', 4);
```

Accommodation rates, bar/minibar/POS prices, massage and cosmetology prices, package prices, and Smart Detox session counts are **not published**. They are imported from Bioli's systems in Week 1 [G]. The test suite uses a clearly named test-fixture alcohol item for H2; it is not Bioli data.

### 5.4 Payload JSON Schemas (Draft 2020-12; validated)

**Validation results:**
- All four schemas pass the Draft 2020-12 meta-schema check, and the example instances validate.
- Two negative tests are **rejected as intended**:
  - a cottage setup with aroma "rosemary" and pillow "buckwheat" (the brief's values, absent from Bioli's menus);
  - a posting that charges 145 ₾ against a programme entitlement (H1).

**`cottage-setup.json`**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://simstay.example/schemas/bioli/v1/cottage-setup.json",
  "title": "Bioli cottage setup request",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "propertyId",
    "unit",
    "stayRef",
    "dueBy",
    "aroma",
    "pillow",
    "sheets",
    "idempotencyKey"
  ],
  "properties": {
    "propertyId": {
      "const": "prop_bioli"
    },
    "unit": {
      "type": "string",
      "pattern": "^[0-9]{1,2}$"
    },
    "stayRef": {
      "type": "string",
      "minLength": 3,
      "maxLength": 32
    },
    "dueBy": {
      "type": "string",
      "format": "date-time"
    },
    "aroma": {
      "enum": [
        "orange",
        "eucalyptus",
        "lavender",
        "iris",
        "ylang_ylang",
        "pine",
        "fir"
      ]
    },
    "pillow": {
      "enum": [
        "sintepon",
        "feather",
        "medicinal_plants"
      ]
    },
    "sheets": {
      "enum": [
        "cotton",
        "linen"
      ]
    },
    "hypoallergenicLinen": {
      "type": "boolean",
      "default": true
    },
    "notes": {
      "type": "string",
      "maxLength": 280
    },
    "idempotencyKey": {
      "type": "string",
      "minLength": 16,
      "maxLength": 128
    }
  }
}
```

**`kitchen-ticket.json`** (operational flags only; no clinical values)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://simstay.example/schemas/bioli/v1/kitchen-ticket.json",
  "title": "Bioli Hall dietary ticket (operational flags only)",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "propertyId",
    "stayRef",
    "validFrom",
    "validTo",
    "dietCodes",
    "allergenCodes",
    "setByRole"
  ],
  "properties": {
    "propertyId": {
      "const": "prop_bioli"
    },
    "stayRef": {
      "type": "string"
    },
    "validFrom": {
      "type": "string",
      "format": "date"
    },
    "validTo": {
      "type": "string",
      "format": "date"
    },
    "dietCodes": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-z0-9_]+$"
      },
      "uniqueItems": true
    },
    "allergenCodes": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-z0-9_]+$"
      },
      "uniqueItems": true
    },
    "kcalTarget": {
      "type": "integer",
      "minimum": 800,
      "maximum": 4000
    },
    "setByRole": {
      "enum": [
        "doctor",
        "nutritionist"
      ]
    }
  }
}
```

**`appointment-request.json`**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://simstay.example/schemas/bioli/v1/appointment-request.json",
  "title": "Bioli appointment request",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "propertyId",
    "stayRef",
    "itemCode",
    "window",
    "idempotencyKey"
  ],
  "properties": {
    "propertyId": {
      "const": "prop_bioli"
    },
    "stayRef": {
      "type": "string"
    },
    "itemCode": {
      "type": "string",
      "pattern": "^[a-z0-9_]+$"
    },
    "window": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "earliest",
        "latest"
      ],
      "properties": {
        "earliest": {
          "type": "string",
          "format": "date-time"
        },
        "latest": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "durationMinutes": {
      "type": "integer",
      "minimum": 10,
      "maximum": 240
    },
    "requestedBy": {
      "enum": [
        "guest",
        "staff",
        "system"
      ]
    },
    "idempotencyKey": {
      "type": "string",
      "minLength": 16,
      "maxLength": 128
    }
  }
}
```

**`posting-proposal.json`** (encodes H1 as a conditional: an entitlement source forces `unitPrice = 0`)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://simstay.example/schemas/bioli/v1/posting-proposal.json",
  "title": "Bioli folio posting proposal",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "stayRef",
    "itemCode",
    "window",
    "unitPrice",
    "currency",
    "gate"
  ],
  "properties": {
    "stayRef": {
      "type": "string"
    },
    "itemCode": {
      "type": "string"
    },
    "window": {
      "type": "integer",
      "minimum": 1,
      "maximum": 4
    },
    "unitPrice": {
      "type": "number",
      "minimum": 0
    },
    "currency": {
      "enum": [
        "GEL",
        "USD"
      ]
    },
    "entitlementSource": {
      "enum": [
        "accommodation",
        "program",
        "corporate",
        null
      ]
    },
    "gate": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "ok",
        "ruleId"
      ],
      "properties": {
        "ok": {
          "type": "boolean"
        },
        "ruleId": {
          "type": "string"
        },
        "source": {
          "type": "object",
          "required": [
            "doc",
            "page",
            "quote"
          ],
          "properties": {
            "doc": {
              "type": "string"
            },
            "page": {
              "type": "integer",
              "minimum": 1
            },
            "quote": {
              "type": "string"
            }
          }
        }
      }
    },
    "requiresApproval": {
      "type": "boolean"
    }
  },
  "if": {
    "properties": {
      "entitlementSource": {
        "enum": [
          "accommodation",
          "program",
          "corporate"
        ]
      }
    },
    "required": [
      "entitlementSource"
    ]
  },
  "then": {
    "properties": {
      "unitPrice": {
        "const": 0
      }
    }
  }
}
```

**Outbox event example** (CloudEvents 1.0, as in `A2A-D` §4.2):

```json
{
  "specversion": "1.0",
  "id": "5d0b8c1e-2f4a-4a8e-9b61-7a2c3e9d1f40",
  "source": "simstay://prop_bioli/cottage_ops",
  "type": "ge.simstay.workorder.created.v1",
  "subject": "unit/12",
  "time": "2026-10-03T09:12:44Z",
  "datacontenttype": "application/json",
  "traceparent": "00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01",
  "tenantid": "prop_bioli",
  "data": {
    "category": "cottage_setup",
    "stayRef": "BW-0712",
    "aroma": "lavender",
    "pillow": "medicinal_plants",
    "sheets": "linen",
    "dueBy": "2026-10-03T13:00:00+04:00"
  }
}
```

### 5.5 Test evidence (executed 2026-09-27, PostgreSQL 16.15)

| # | Test (as runtime role `simstay_app`) | Expected | Result |
|---|---|---|---|
| T1 | Bioli session reads guests | Only Bioli's guest | **1 row** ✓ |
| T2 | Front-desk role reads clearances | None | **0 rows** ✓ |
| T3 | Wellness-agent role reads clearance status | Visible | **1 row** ✓ |
| T4 | Kitchen role reads clearances | None | **0 rows** ✓ |
| T5 | Kitchen role reads diet and allergens | Visible | **1 row** ✓ |
| T6 | Front desk writes a dietary profile | Rejected | **RLS violation** ✓ |
| T7 | Consume phyto bath 5× on Anti-Stress (quota 4) | 4 × program, then NULL (→ W1 at 145 ₾, H4) | **program ×4, NULL** ✓ |
| T8 | Consume salt room 6× (programme quota 4 + unlimited accommodation access) | 4 × program, then accommodation | **program ×4, accommodation ×2** ✓ |
| T9 | Overlapping booking of `phytobath_1` | Rejected | **exclusion_violation** ✓ |
| T10 | 145 ₾ line posted against a programme entitlement | Rejected | **check_violation** ✓ |
| T11 | 200 USD cardio diagnostic at a test FX rate of 2.70 | 540.00 GEL stored | **540.00** ✓ |
| T12 | Another tenant reads Bioli guests, stays, lines | Nothing | **0 / 0 / 0** ✓ |

---

## 6. Frontline Human-AI Teaming at Bioli (HAS; `WEF-D` §4.3)

**Principle for a medical-wellness resort.**
- **Clinical judgement is HAS-5, always.** SimStay may prepare, remind, schedule and enforce what a clinician decided. It never decides suitability, contraindications, dosage or diet.
- **Hospitality warmth is HAS-5.** This is a Michelin-selected property.
- Automation concentrates on bookkeeping, dispatch and verification.

| # | Task | HAS | AI role | Stakes (S0–S3) | Why |
|---|---|---|---|---|---|
| 1 | Unit status propagation to the PMS after a verified event | HAS-1 | Automate | S2 | Mechanical; audit-logged |
| 2 | Daily PMS export import (units, arrivals) | HAS-1 | Automate | S1 | CSV path until an API is confirmed |
| 3 | Materialise entitlements at check-in | HAS-1 | Automate | S3 (deterministic) | Rule-driven; drives billing |
| 4 | Route an entitlement-covered item to its window at 0 | HAS-1 | Automate | S3 (deterministic) | H1/H3; DB-enforced |
| 5 | Dispatch the cottage setup from confirmed preferences | HAS-1 | Automate | S1 | Guest-confirmed input |
| 6 | Send the kitchen ticket from a clinician-set diet | HAS-1 | Automate | S3 transport only | The content was set by a human |
| 7 | Pre-arrival preference collection (ka/en/ru) | HAS-2 | Automate + review | S2 | Guest-facing; the Concierge escalates ambiguity |
| 8 | Propose the programme schedule | HAS-2 | Automate + review | S2 | The wellness expert approves |
| 9 | Book an add-on procedure for a cleared guest | HAS-2 | Automate + review | S2 | H4 price consent first |
| 10 | Photo check of the cottage setup | HAS-2 | Augment | S2 | Simulated today, **labelled**; the supervisor samples |
| 11 | Night-time folio pre-validation for next-day departures | HAS-2 | Automate + review | S3 | The auditor resolves flags |
| 12 | Check-out settlement across W1/W2/W3 | **HAS-3** | Copilot | S3 | Receptionist + copilot; the gate re-grades |
| 13 | Programme-inclusion questions at the desk ("is the sauna included?") | HAS-3 | Copilot cites the programme sheet | S2 | Fast, sourced answers |
| 14 | Programme-inclusion **disputes** at check-out | HAS-4 | Copilot supplies inclusions, prior consents and limits | S3 | Empathy and authority are human |
| 15 | Complaint recovery (e.g. wrong aroma) | HAS-4 | Suggests recovery options within policy | S2 | Luxury recovery is personal |
| 16 | Corporate Wellness group billing (W3) | HAS-3 | Copilot | S3 | Contract terms vary [G] |
| 17 | Express consultation / contraindication screening | **HAS-5** | Stays out; schedules it | S3 | Clinical |
| 18 | Doctor, somnologist and psychologist consultations | **HAS-5** | Stays out | S3 | Clinical |
| 19 | IV infusions, OPL therapy | **HAS-5** | Stays out; logistics only | S3 | Medical procedures |
| 20 | Massage, physical therapy, kinesiotherapy delivery | **HAS-5** | Stays out; the AI may drill standards | S2 | Craft |
| 21 | Nutritionist diet plan; chef's functional dining presentation | **HAS-5** | Stays out; delivers the ticket | S3 | Clinical + craft |
| 22 | Final inspection sign-off ("sellable") | **HAS-5** | Supplies evidence | S2 | Accountability, skill retention (`WEF-D` §5.2) |
| 23 | Staff certification decision | **HAS-5** | Supplies evidence | S3 | Human confirmation (`CD` §5.5) |

### 6.1 Drills against skill atrophy (`WEF-D` §5.2), adapted to Bioli

The **content** of emergency drills is owned by Bioli's medical director [G]. SimStay only delivers, schedules and scores them.

| Drill | Audience | Format | Cadence | Pass metric |
|---|---|---|---|---|
| **Emergency recognition**: guest unwell in the salt room, infrared sauna or phytobath; guest reports an allergic reaction at Bioli Hall | Attendants, therapists, front desk, kitchen | 2-minute scenario over messaging; "first three actions" in order | Fortnightly; before every shift for new hires in week 1 | 100% correct first action (call the on-duty doctor per protocol); response time trend |
| **Inclusion decide-first**: the guest asks "is X included?"; staff answer before seeing the system | Front desk | Decide-first (`WEF-D` §5.2) on real, anonymised questions | 3 per week | ≥ 90% agreement with the ontology [P] |
| **Price-consent script** before any add-on (H4) | Front desk, therapists | Synthetic guest in ka/en/ru | Weekly | Consent obtained before booking in 100% of drills |
| **Personalisation accuracy**: read a preference card and set up a mock cottage | Attendants | Photo of the mock setup vs the card | Weekly in the pilot, then monthly | 100% match on aroma, pillow and sheets |
| **Degraded mode**: PMS or SimStay down | Front desk, housekeeping | Paper folio worksheet, radio hand-offs | Pre-pilot + mid-pilot | Completion without billing error |
| **Luxury warmth**: arrival greeting, farewell, recovery language | All guest-facing staff | Coached by a senior host; AI only schedules and records | Monthly | Supervisor rubric (human-scored) |

---

## 7. Day-1 Pilot Launch Playbook (30 days, Kojori)

### 7.0 Prerequisites (before Day 1)

| # | Prerequisite | Owner |
|---|---|---|
| 1 | Pilot agreement and **data-processing agreement** with Bioli; named GM sponsor and medical-director sponsor | SimStay founders, Bioli GM |
| 2 | **DPIA** for health-adjacent flags (diet, allergen, clearance status). Legal review of Georgian personal-data law for special-category data and automated processing (`CD` §5.5: Art. 31 DPIA, Art. 19 human confirmation) [G] | Data-protection counsel |
| 3 | PMS vendor and access mode identified (API, CSV export, or read-only) [G] | Bioli IT + SimStay FDE |
| 4 | Written consent to use Bioli's name and marks in any external material (`WEF-D` §9.5) | Bioli marketing |
| 5 | Production environment: PostgreSQL 16 with the §5.2 schema, backups, in-region hosting [P] | SimStay engineering |

### 7.1 Week 1: on-site rule extraction and sign-off (FDS pod, `WEF-D` §5.3)

| Day | Activity | Output |
|---|---|---|
| 1 | Kick-off with the GM, medical director, front office manager and head of housekeeping. Observe one arrival and one check-out. **Collect guest-review themes and the complaint log** (the gap in §0.2) | Stakeholder map; baseline observations |
| 1–2 | Import the unit master (resolve 16 vs 17 units; unit types), programme sheets with **session counts per duration**, price lists (massage, cosmetology, bar, minibar), accommodation inclusions, corporate contracts | Seeded catalogue, programmes and entitlements |
| 2–3 | Rule Studio ingestion of Bioli's documents; the FDS reconciles the §3.2 candidate rules against the real text. Every rule is linked to page + quote | Candidate rule set v0.9 |
| 3 | Medical director session: P1 clearance categories (which procedures are "thermal" / "medical"), validity periods, the emergency-drill content; P2 diet and allergen code list | Signed P1/P2; drill scripts |
| 4 | GM sign-off on the Tier H/P/D rules (H1–H7, P3–P5, D1–D2); FX policy (H6) with finance | **Signed rule set v1** |
| 5 | Baseline measurement starts (§8): check-in stopwatch sample, preference-accuracy audit, billing-adjustment count from the last 30 days of folios | Baseline dataset |

### 7.2 Week 2: mobile onboarding (button-first Telegram/WhatsApp)

| Activity | Detail |
|---|---|
| Staff enrolment | Front office, cottage attendants, therapists, kitchen lead. No app install; bot link via QR |
| Role flows | **Attendants:** setup work orders with the 5-item checklist + photo. **Front desk:** inclusion lookup, price-consent script, settlement copilot. **Kitchen:** ticket acknowledgement. **Clinicians:** clearance and diet entry (web form) |
| Certification | Scenario sets per role; certification confirmed by a human supervisor |
| Guest pre-arrival messaging | Preference collection in ka/en/ru for arrivals from Week 3; opt-in consent recorded |

### 7.3 Weeks 3–4: shadow mode, then gated live

| Days | Mode | What runs |
|---|---|---|
| 15–21 | **Shadow** (challenger vs production, `WEF-D` §6.3) | SimStay grades every real folio line and setup in parallel and **posts nothing**. Discrepancies are reviewed daily with the front office manager |
| 22–30 | **Gated live**, scoped | Live: cottage-setup work orders, kitchen tickets, entitlement routing *proposals* with human approval, pre-arrival preference collection. Still shadow: automatic PMS posting (enabled only if Week-3 discrepancies are fully explained) |

**Go/no-go for gated live** (a subset of `WEF-D` §6.3's 12 criteria): signed rule set v1; 100% of Tier H rules carry source spans; zero unexplained shadow discrepancies on Tier H during the final 3 shadow days; clearances entered by clinicians for all in-house programme guests; degraded-mode drill passed; DPIA approved.

**Rollback:** disable agent writes per workflow (pause control); staff revert to the degraded-mode procedure; no data loss (the event log is append-only).

---

## 8. Pilot KPIs

Baseline = Week 1 measurement or the prior 30 days of records. Targets are **[P]** and must be agreed with the GM.

| KPI | Definition | Measurement | Target (Day 30) |
|---|---|---|---|
| **Check-in queue latency** | Guest arrival at desk → key/cottage handover (median, p90) | Stopwatch sample of ≥ 20 arrivals in Week 1 vs Week 4 | Median −30% [P] (pre-arrival preferences and pre-validated folios remove desk work) |
| **Package/entitlement billing disputes** | Guest-contested lines at check-out related to inclusions, alcohol or minibar | Front-desk dispute log + folio adjustments | **0** in the gated-live period for guests whose add-ons went through H4 price consent [P] |
| **Post-check-out billing adjustments** | Folio corrections after check-out (count and GEL) | PMS adjustment export | −50% vs baseline [P] |
| **Tier H shadow discrepancies** | SimStay verdict ≠ actual posting on a Tier H rule | Shadow log | 0 unexplained by Day 21 |
| **Aroma/pillow/sheet accuracy** | Setup matches the confirmed preference card | Attendant photo + supervisor sample (≥ 30% of setups) + guest confirmation message | **100%** of sampled setups [P] |
| **Setup on time** | Setup verified before arrival time | Work-order timestamps | ≥ 95% [P] |
| **Room-status mismatch minutes** | Minutes a unit's status in SimStay differs from the PMS | Adapter comparison log | −80% vs Week-3 shadow baseline [P] |
| **Clearance compliance** | Procedures needing clearance (P1) confirmed without a valid clearance | DB query (must be impossible by design) | **0** |
| **Kitchen-ticket acknowledgement** | Tickets acknowledged before the first meal of the stay | Ticket log | 100% [P] |
| **Staff adoption** | Share of eligible tasks run through SimStay (`WEF-D` §5.4 norm: 50%) | Event log | ≥ 50% of setups and folios [P] |
| **Drill performance** | Emergency first-action accuracy; inclusion decide-first agreement | Drill log | 100% / ≥ 90% [P] |

---

## 9. Commercial and Legal Frame

**Commercial.** Bioli does not fit `CD`'s ICP split neatly:
- By size (16–17 units) it is ICP 1.
- By operational complexity (clinical boundary, tri-source entitlements, USD/GEL, year-round operation) it is ICP 2.

**Proposal [P]:** the *Enterprise Concierge* package at the 36–60-room tier (setup 2,000 GEL; platform 1,500 GEL per six months), billed **annually**, because Bioli operates year-round. The pilot runs at the `CD` §4.1 design-partner terms (50% off in exchange for baseline data, a case-study right and reference calls). Nothing is agreed.

**Legal [G]; counsel must confirm:**
- **Health data.** Diet, allergen and clearance flags are health-adjacent personal data. They are handled as special-category data: DPIA, explicit consent, minimisation, access logging, in-region hosting.
- **Clinical boundary.** SimStay records clinician decisions and never makes them. This keeps it outside clinical decision support. Confirm the regulatory position in Georgia before any feature that *suggests* a clinical outcome.
- **Messaging.** WhatsApp template and consent rules for pre-arrival outreach (`CD` §5.1 messaging assumptions).
- **Brand use.** No Bioli marks in the hackathon or marketing material without written consent.

---

## 10. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Programme session counts and accommodation-in-programme status differ from assumptions | Wrong W1/W2 routing | Week-1 import is a gate; the shadow week catches mismatches |
| Clinical-boundary creep ("the agent suggests contraindications") | Regulatory and safety exposure | HAS-5 hard line; clearance written only by clinical roles (RLS-enforced) |
| USD/GEL conversion disputes | Guest disputes; accounting mismatch | H6 records the rate and source per line; finance signs the FX policy |
| PMS without an API | Manual double entry | CSV import + dry-run adapter (`PS` §6.6); shadow mode first |
| Premium-guest irritation with bot messaging | Brand damage | Opt-in, short, button-first; human handoff always one tap away; frequency cap |
| Photo-verification tags presented as real AI | Trust violation | Keep the "simulation" label until a model is validated on Bioli photos |
| Staff turnover during the pilot | Knowledge loss | Messaging onboarding; certification; drills |

---

## Appendix A: Sources (retrieved 2026-09-27)

1. Bioli home page (programmes, packages, diagnostics, contacts, languages): https://bioli.ge/en
2. Accommodation (current types, inclusions, amenities): https://bioli.ge/en/accommodation
3. Accommodation (older page; Superior Room; 3 + 11 + 2 inventory; aroma and pillow menus; sheets): https://www.bioli.ge/en/page/accommodation
4. Smart Detox: https://bioli.ge/en/programs/smart-detox
5. Anti-Stress & Rebalance: https://bioli.ge/en/programs/antistress
6. The Art of Sleeping: https://bioli.ge/en/programs/art-of-sleeping
7. Weight Management: https://bioli.ge/en/programs/weight-management
8. A Strong Immune System: https://bioli.ge/en/programs/strong-immune-system
9. Premium Revival: https://bioli.ge/en/programs/premium-revival
10. Mental Detox: https://bioli.ge/en/programs/mental-detox
11. Diagnostics index; Health resources; Cardio status: https://bioli.ge/en/diagnostics · https://bioli.ge/en/diagnostics/diagnosis-of-health-resources · https://bioli.ge/en/diagnostics/diagnosis-of-cardio-status
12. Revitalization procedures and prices: https://bioli.ge/en/page/revitalization
13. Consultations and prices: https://bioli.ge/en/page/consultations
14. Restaurant (Bioli Hall): https://bioli.ge/en/page/restaurant
15. Corporate Wellness (31 ha, inclusions): https://bioli.ge/en/wellness/package/corporate-wellness
16. MICHELIN Guide entry (Selected; 17 rooms; bar; organic wine): https://guide.michelin.com/en/hotels-stays/Kojori/bioli-wellness-resort-15024
17. Search-surfaced sources for "Michelin Guide 2025", "17 cottages", "32-hectare", 1,150 m (third-party; not independently fetched): https://www.michelinkeyhotels.com/hotels/bioli-wellness-resort · https://www.instagram.com/p/DNqaVV4I0x-/
18. Not retrievable by automated fetch: TripAdvisor (HTTP 403), Booking.com (empty response)
