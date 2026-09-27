# SimStay Tokenomics & API Cost Audit

**Question audited:** does the commercialization dossier's "Cash COGS ≈ 45 GEL per season" (ICP 1) survive real LLM, vision and caching token consumption, per workflow, per trainee and per hotel season?

**Date:** 2026-09-27.

**Inputs (read-only):**
- `commercialization_dossier.md` (`CD`);
- `prototype_spec_and_demo_architecture.md` (`PS`);
- `wef_ai_first_enterprise_strategy.md` (`WEF-D`);
- `problem.md` (`PR`).

**Currency:** USD, and GEL at **2.7 GEL/USD** (`CD` assumption).

**Evidence labels (as required):**
- **[D]** vendor rate card or documentation, retrieved 2026-09-27 (Appendix A);
- **[I]** our derivation, calculation or measurement;
- **[G]** assumption that needs live telemetry.

**Reproducibility.** Every figure below was produced by one Python model with a single assumption set (§2). Changing an input changes every table consistently. The Georgian tokenizer ratios in §1.3 were **measured** with OpenAI's `tiktoken` on SimStay's own fixture text.

---

## 0. Verdict and Corrections to the Brief

### 0.1 Verdict

| Question | Answer |
|---|---|
| Does ICP 1 stay under 45 GEL/season? | **Yes, with the recommended stack: ≈ 5.4 GEL of API cost per season** [I]. That is 12% of the whole 45 GEL cash-COGS line, leaving about 40 GEL for messaging and storage |
| Is that robust? | **No, it holds only by design.** The same workload costs **28.7 GEL** on Gemini 3.8 Flash at its 2027 list price with caching, **53.9 GEL** without caching, **64.8 GEL** on GPT-4o, and **133.8 GEL** under the worst plausible configuration: no caching, no batch, high-resolution images, an LLM debrief, and 2× Georgian token inflation [I] |
| What protects the budget? | Four architectural choices:<br>(1) **grading, routing and verification are deterministic code: 0 tokens** (`grader.ts`);<br>(2) the static hotel rulebook is a **cached prefix**;<br>(3) simulation and vision go to **Flash-Lite / mini-class models**;<br>(4) ingestion is a **one-off batch job** |
| What does today's prototype actually spend? | Only Rule Studio extraction calls an LLM, and only in online mode with an API key. The synthetic guest is **scripted** and photo verification is **simulated**, so both are 0 tokens today. Extraction costs ≈ **$0.15 per onboarding** on Gemini 2.5 Flash [I] |
| ICP 2 compute line (`CD`: 120 GEL/season) | Recommended stack: **16.3 GEL** (60 rooms). Gemini 3.8 Flash (2027, cached): 88.5 GEL (passes). Claude Sonnet 5: 134 GEL (**fails**). GPT-4o: 199 GEL (**fails**) [I] |

### 0.2 Corrections to the brief (things the vendor documentation contradicts)

| Brief said | Current fact | Consequence |
|---|---|---|
| Benchmark **Claude 3.5 Haiku / 3.5 Sonnet** | Both are **retired** on the Claude API: Haiku 3.5 since 2026-02-19, Sonnet 3.5 since 2025-10-28 (remaining only on some clouds) [D] | Benchmarked **Claude Haiku 4.5** ($1/$5) and **Claude Sonnet 5** ($2/$10) instead |
| Gemini 2.5 Flash as Tier 1 | Still priced ($0.30/$2.50), but Google now limits 2.5 access to "users who have actively used them in the past" [D] | **A new SimStay Google project may be refused.** The prototype's default `SIMUSTAY_MODEL=gemini-2.5-flash` (`.env.demo`) should move to a 3.x model |
| "Gemini 3.8 Flash" | Exists: **$0.75 in / $3.75 out through 2026-12-31, then $1.50 / $7.50 from 2027-01-01** [D] | The pilot season (2027) runs at the **doubled** rate. Every Gemini 3.8 figure is modelled at both rates |
| Prompt caching gives 50–80% off input | Read discounts vary: **90%** (Gemini, GPT-5 family, Anthropic reads), **75%** (GPT-4.1 family), **50%** (GPT-4o family). Anthropic also charges **1.25× to write** (5-minute TTL) [D] | Net scenario savings range from **29% (GPT-4o family) to 51% (Gemini)** (§5.3) [I] |
| Claude image tokens ≈ width×height/750 | Current formula: **⌈w/28⌉ × ⌈h/28⌉** visual tokens. Caps: **1,568** tokens (standard tier, e.g. Haiku 4.5) or **4,784** (high-resolution tier, Claude 4.7+ incl. Sonnet 5) [D] | §6 uses the current formula |
| Downsizing photos to 512×512 cuts vision cost | True for Claude and OpenAI patch models. **Not true on Gemini 3.x**: tokens per image are fixed by `media_resolution` (280 / 560 / 1,120 / 2,240), not by pixels. On Gemini 2.5, a 512-px image costs the same as 1024 px (1,032 tokens); only ≤ 384 px drops it to 258 [D]/[I] | The optimisation lever differs per vendor (§6, §9) |
| A 4-turn LLM synthetic-guest scenario | The prototype's guest is **scripted by design** for deterministic assessment (`PS` §2.3). An LLM guest is a roadmap option | Workflow B is costed as a *forward-looking* LLM guest. Today's cost is 0 |

---

## 1. Rate Cards and Tokenizer Facts

### 1.1 Price matrix: USD per 1 M tokens, standard tier [D]

| Tier | Model | Input | Cached input (read) | Cache write | Output | Batch | Notes |
|---|---|---|---|---|---|---|---|
| Google | **Gemini 3.8 Flash**, 2026 rate | 0.75 | 0.075 | — | 3.75 | 0.375 / 1.875 | Through 2026-12-31 |
| Google | **Gemini 3.8 Flash**, 2027 rate | **1.50** | 0.15 | — | **7.50** | 0.75 / 3.75 | From 2027-01-01 |
| Google | Gemini 3.1 Flash-Lite | 0.25 | 0.025 | — | 1.50 | 0.125 / 0.75 | |
| Google | Gemini 2.5 Flash | 0.30 | 0.03 | — | 2.50 | 0.15 / 1.25 | Access restricted to prior users |
| Google | *Explicit-cache storage* | — | — | $1.00 / 1 M tok / hour (3.1 Flash-Lite, 2.5); $0.50 on 3.8 Flash until 2026-12-31 | — | — | Storage applies to explicit caches (§8.3) |
| OpenAI | GPT-4o-mini | 0.15 | 0.075 | — | 0.60 | — | 50% cache discount |
| OpenAI | GPT-4o | 2.50 | 1.25 | — | 10.00 | — | |
| OpenAI | GPT-4.1-mini | 0.40 | 0.10 | — | 1.60 | — | 75% cache discount |
| OpenAI | GPT-5-mini | 0.25 | 0.025 | — | 2.00 | — | 90% cache discount |
| Anthropic | Claude Haiku 4.5 | 1.00 | 0.10 | 1.25 (5 min) / 2.00 (1 h) | 5.00 | 0.50 / 2.50 | Minimum cacheable prefix **4,096 tokens** |
| Anthropic | Claude Sonnet 5 | 2.00 | 0.20 | 2.50 (5 min) / 4.00 (1 h) | 10.00 | 1.00 / 5.00 | Minimum cacheable prefix 1,024; tokenizer ≈ **+30% tokens** vs pre-4.7 models [D] |

### 1.2 Image-token rules [D]

| Vendor / model | Rule |
|---|---|
| Gemini 3.x | Fixed per `media_resolution`: low **280**, medium **560**, high **1,120** (the image default), ultra-high 2,240. PDF pages: level tokens **+ native text**; `medium` is recommended for documents |
| Gemini 2.5 | **258** if both sides ≤ 384 px. Otherwise tiles: crop unit = ⌊min(w,h)/1.5⌋, tiles = ⌈w/unit⌉·⌈h/unit⌉, **258 per tile** |
| OpenAI tile models | Fit to 2048², shortest side to 768, then count 512-px tiles. **GPT-4o: 85 + 170/tile. GPT-4o-mini: 2,833 + 5,667/tile.** `detail: low` = base tokens only |
| OpenAI patch models | 32×32-px patches × multiplier (**GPT-4.1-mini 1.62**; most others 1.2) |
| Claude | ⌈w/28⌉·⌈h/28⌉; downscaled to the tier cap (standard 1,568 px / 1,568 tokens; high-res 2,576 px / 4,784 tokens) |

### 1.3 Georgian tokenization, measured [I]

Measured on SimStay's own fixture text: every `*_ka` / `*_en` field of both properties' scenarios and rules. `tiktoken` 2026-09.

| Corpus | Characters | Words | o200k tokens (GPT-4o/4.1/5) | Characters per token | Tokens per word | cl100k tokens (GPT-4-era) |
|---|---|---|---|---|---|---|
| Georgian text | 4,391 | 567 | **1,721** | 2.55 | **3.04** | 7,811 (0.56 chars/token) |
| Same content in English | 3,115 | 509 | **761** | 4.09 | 1.50 | 816 |
| 68 parallel ka/en field pairs | — | — | ka **1,060** vs en 668 | — | **Georgian = 1.59× English** | — |

**Reading:**
- On modern OpenAI tokenizers, Georgian costs **≈ 1.6×** English for the same content. On the older cl100k tokenizer it cost **≈ 9.6×**. Tokenizer generation matters more for a Georgian-first product than list price.
- Claude and Gemini tokenizers were **not** measured (their counting endpoints need API keys) [G]. That is why the stress case applies **×2.0** to simulation tokens.
- **Telemetry step 1** (§11) is `count_tokens` on these fixtures for every candidate model.

---

## 2. Assumption Set (single source for every table)

Token volumes are expressed on the o200k basis. Everything in this table is **[I]**, and **[G]** until pilot telemetry replaces it.

| Parameter | Value | Derivation |
|---|---|---|
| Hotel rulebook in context | 40 rules × **125 tok** = 5,000 | Measured: 8 Bioli rules as JSON = 985 o200k tok (123/rule) |
| System + persona + output contract | 900 | Prompt budget |
| **Static cacheable prefix P** | **5,900** | 900 + 5,000; identical across every scenario and trainee of a hotel |
| Scenario context D (folio, guest, state) | 600 | Fixture folio + persona |
| Trainee message *u* per turn | 60 | Button-first quick replies are short, fixed texts |
| Guest reply *g* per turn | 180 | ≈ 60 Georgian words × 3.04 tok/word |
| Turns per scenario *n* | 4 | Brief |
| Scenarios per trainee × attempts | 30 × 1.3 = **39 runs** | Brief; 30% retries [G] |
| Trainees per season | ICP 1: 10 · ICP 2 (60 rooms): 30 · 50 rooms: 19 | Brief; `CD` §3.1 (19 hires at 50 rooms) |
| Room turnarounds (photos) per season | ICP 1: 600 · ICP 2: 2,500 · 50 rooms: **2,900** | Brief; 50 rooms × 65% occupancy × 180 d ÷ 2-night stays ≈ 2,925 [G] |
| Vision call | image + 350-token prompt (checklist + guest card) + 80-token JSON verdict | |
| Ingestion (ICP 1 / ICP 2) | 10 / 40 pages; 40 / 90 rules; 35 / 60 generated scenarios × 700 tok; **2 runs** (owner revision) | `CD` §2.1 (30–40 scenarios) |
| Page cost | Gemini: 560 (medium) + 600 text; Claude: 1,500 + 600 [G]; OpenAI: 1,100 + 600 [G] | [D] Gemini; others estimated |
| Messaging + storage share of 45 GEL | ≈ 12 GEL (ICP 1) · 20 GEL (50 rooms) | WhatsApp service-window messages free; template reminders [G] (`CD` §5.1) |

---

## 3. Workflow D: The Zero-Token Fortress (deterministic by design)

These operations consume **0 LLM tokens**, verified against the codebase:

| Operation | Implementation | Per-season volume (ICP 1) | Tokens |
|---|---|---|---|
| Grading every folio move against Tier H/P rules | `src/lib/simustay/grader.ts` (`gateMove`, `gateFinish`, `satisfiedRules`) | Hundreds per trainee | **0** |
| Check-out settlement and balance check | `gateFinish` | Every check-out | **0** |
| Button-first quick replies | Fixed `quickReplies` in fixtures; `chat/reply` route | Every chat turn | **0** |
| Housekeeping checklist, completion, inspection | `hk/check`, `hk/complete`, `hk/inspect` routes | Every turnaround | **0** |
| PMS status sync (Mews-shaped adapter) and CSV import | `pms.ts`, `csv-import` route | Every status change | **0** |
| Entitlement routing, window state, SSE fan-out | Store, routes, database functions (`bioli_pilot_production_blueprint.md` §5) | Continuous | **0** |
| Synthetic guest **today** | Scripted beats (`PS` §2.3) | Every scenario | **0** (§5 costs an LLM variant) |
| Photo "AI tags" **today** | Simulated and labelled (`/m/hk`) | Every photo | **0** (§6 costs a real model) |

**Why this is the business model, not a detail.** An LLM-graded design would add a grading call per move. At ≈ 5–10 moves per scenario with the full rulebook in context, that multiplies simulation cost by roughly 2–3× [I]. Deterministic grading is also what makes a verdict repeatable and explainable (`WEF-D` §8.3, stakes tier S3). The zero-token core carries the correctness; the LLM carries only language.

---

## 4. Workflow A: SOP and PDF Ingestion (Rule Studio)

**Formulas:**

$$T_{in}^{A} = R\cdot\big(N_{pages}\,(t_{page\_img}+t_{page\_text}) + t_{prompt}\big)\qquad T_{out}^{A} = R\cdot\big(N_{rules}\,t_{rule} + N_{scen}\,t_{scen}\big)$$

$$C^{A} = \frac{T_{in}^{A}\,p_{in} + T_{out}^{A}\,p_{out}}{10^{6}}\;(\times 0.5\ \text{via Batch API})$$

with R = 2 runs, t_rule = 125, t_scen = 700.

| Model | ICP 1: T_in / T_out | ICP 1 cost | ICP 2: T_in / T_out | ICP 2 cost |
|---|---|---|---|---|
| Gemini 3.8 Flash (2026) | 24,800 / 59,000 | $0.24 | 94,400 / 106,500 | $0.47 |
| Gemini 3.8 Flash (2027) | 24,800 / 59,000 | $0.48 | 94,400 / 106,500 | $0.94 |
| Gemini 3.8 Flash (2027), **Batch** | same | **$0.24** | same | **$0.47** |
| Gemini 3.1 Flash-Lite | 24,800 / 59,000 | $0.095 | 94,400 / 106,500 | $0.18 |
| GPT-5-mini | 35,600 / 59,000 | $0.13 | 137,600 / 106,500 | $0.25 |
| Claude Haiku 4.5 | 43,600 / 59,000 | $0.34 | 169,600 / 106,500 | $0.70 |
| Claude Sonnet 5 | 43,600 / 59,000 | $0.68 | 169,600 / 106,500 | $1.40 |

**Observations [I]:**
- Ingestion is **output-dominated**: rules and scenarios cost more than reading the PDF.
- It is a one-off per onboarding, **under $1.50 on every model**. Quality, not price, should pick this model: this is where a frontier-tier model earns its cost.
- The Batch API halves it, and a 24-hour latency is acceptable for onboarding.

---

## 5. Workflow B: Front-Desk Simulation with an LLM Synthetic Guest

### 5.1 Token algebra per scenario

For turn t = 1…n, the model re-reads the prefix, the scenario context and the growing history:

$$T_{in}^{(t)} = P + D + (t-1)(u+g) + u,\qquad T_{out}^{(t)} = g$$

$$T_{in}=nP+nD+nu+\frac{n(n-1)}{2}(u+g),\qquad T_{out}=ng$$

Base case (P = 5,900; D = 600; u = 60; g = 180; n = 4):
- $T_{in}$ = 23,600 + 2,400 + 240 + 1,440 = **27,680**
- $T_{out}$ = **720**

**With prefix caching:**
- Turns 2…n read P from cache: $T_{cache}=(n-1)P$ = **17,700**; $T_{uncached}$ = **9,980**.
- **Anthropic:** turn 1 pays a cache write (1.25× on P), because a new trainee usually arrives after the 5-minute TTL (a conservative assumption).
- **Gemini and OpenAI:** no write premium; turn 1 is priced as uncached input [G on implicit hit behaviour].

$$C^{B}=\frac{T_{uncached}\,p_{in}+T_{cache}\,p_{cache}\,(+\,P\,p_{write})+T_{out}\,p_{out}}{10^{6}}$$

### 5.2 Cost per scenario and per trainee [I]

| Model | Per scenario, no cache | Per scenario, cached | Saving | **Per trainee (39 runs), cached** |
|---|---|---|---|---|
| Gemini 3.8 Flash (2026) | $0.0235 | $0.0115 | 51% | $0.45 (1.21 ₾) |
| Gemini 3.8 Flash (2027) | $0.0469 | $0.0230 | 51% | $0.90 (2.42 ₾) |
| **Gemini 3.1 Flash-Lite** | $0.0080 | **$0.0040** | 50% | **$0.16 (0.42 ₾)** |
| Gemini 2.5 Flash | $0.0101 | $0.0053 | 47% | $0.21 (0.56 ₾) |
| GPT-4o-mini | $0.0046 | $0.0033 | 29% | $0.13 (0.34 ₾) |
| GPT-4o | $0.0764 | $0.0543 | 29% | $2.12 (5.72 ₾) |
| GPT-4.1-mini | $0.0122 | $0.0069 | 43% | $0.27 (0.73 ₾) |
| **GPT-5-mini** | $0.0084 | **$0.0044** | 48% | **$0.17 (0.46 ₾)** |
| Claude Haiku 4.5 | $0.0313 | $0.0168 | 46% | $0.66 (1.77 ₾) |
| Claude Sonnet 5 | $0.0626 | $0.0336 | 46% | $1.31 (3.54 ₾) |

A "Scenario #204" run (4-turn corporate check-out) on the recommended model costs **$0.0040 ≈ 0.011 ₾** [I].

### 5.3 Sensitivities [I]

| Driver | Effect |
|---|---|
| **LLM debrief** at the end (+1 call: P + D + transcript in; 350 out) | $T_{in}$ 27,680 → 35,140; $T_{out}$ 720 → 1,070. The recommended design keeps the debrief **templated from gate results (0 tokens)** |
| **Reasoning tokens** billed as output (×3 output) | Gemini 3.8 Flash (2027) $0.0230 → $0.0338 per scenario (+47%). Flash-Lite $0.0040 → $0.0062. GPT-5-mini $0.0044 → $0.0073. Set thinking off or minimal for guest dialogue [G on per-model defaults] |
| **Tokenizer ×2** (Georgian on unmeasured tokenizers) | Simulation cost roughly ×2; included in the "stress" columns of §7 |
| Rulebook size | Each extra 1,000 tokens of rulebook = 4 reads per scenario: ≈ +$0.0003 per scenario cached on Flash-Lite, +$0.006 uncached on 3.8 Flash (2027) |

---

## 6. Workflow C: Computer-Vision Room Verification

### 6.1 Image tokens per photo [D rules → I counts]

| Model | Raw phone 12 MP (4032×3024) | 1024×768 JPEG | 512×512 JPEG | 384×384 JPEG |
|---|---|---|---|---|
| Gemini 3.x (`media_resolution: medium`) | 560 | 560 | 560 | 560 |
| Gemini 3.x (`low`) | 280 | 280 | 280 | 280 |
| Gemini 2.5 Flash | 1,032 | 1,032 | 1,032 | **258** |
| GPT-4o-mini (tile) | **25,501** | **25,501** | **8,500** | 8,500 |
| GPT-4o (tile) | 765 | 765 | 255 | 255 |
| GPT-4.1-mini (patch ×1.62; 1,536-patch cap [G]) | 2,488 | 1,244 | 415 | 233 |
| GPT-5-mini (patch ×1.2 assumed [G]) | 1,843 | 922 | 307 | 173 |
| Claude Haiku 4.5 (standard tier) | 1,530 | 1,036 | 361 | 196 |
| Claude Sonnet 5 (high-res tier) | **4,661** | 1,036 | 361 | 196 |

**Worked examples:**
- GPT-4o-mini at 1024×768: the shortest side is already 768, so 2×2 = 4 tiles → 2,833 + 4 × 5,667 = **25,501 tokens**. Its low per-token price is **cancelled by its image-token multiplier**: never use it for vision.
- Claude Haiku 4.5 at 1024×768: ⌈1024/28⌉ × ⌈768/28⌉ = 37 × 28 = **1,036 tokens**.

### 6.2 Cost per verified room (1024×768; Gemini 3.x medium) [I]

$$C^{C}=\frac{(t_{img}+350)\,p_{in}+80\,p_{out}}{10^{6}}$$

| Model | Tokens per image | Per photo | Per 1,000 rooms |
|---|---|---|---|
| **Gemini 3.1 Flash-Lite** | 560 | **$0.00035** | **$0.35** |
| GPT-5-mini | 922 | $0.00048 | $0.48 |
| Gemini 2.5 Flash | 1,032 | $0.00061 | $0.61 |
| GPT-4.1-mini | 1,244 | $0.00077 | $0.77 |
| Gemini 3.8 Flash (2026 / 2027) | 560 | $0.00098 / $0.00197 | $0.98 / $1.97 |
| Claude Haiku 4.5 | 1,036 | $0.00179 | $1.79 |
| GPT-4o | 765 | $0.0036 | $3.59 |
| Claude Sonnet 5 | 1,036 | $0.0036 | $3.57 |
| GPT-4o-mini | 25,501 | $0.0039 | $3.93 |

**Seasonal volume:** ICP 1 = 600 photos → **$0.21** on Flash-Lite. A 50-room hotel = 2,900 photos → **$1.01** [I].

**Vision is not the cost risk; model choice is.** GPT-4o-mini would make vision the most expensive line of the season ($2.36 of ICP 1's $3.67).

---

## 7. Season Synthesis and the 45 GEL Audit

### 7.1 ICP 1: boutique, 20 rooms (10 trainees = 390 runs; 600 photos; 1 onboarding) [I]

| Model (single model everywhere) | Ingest | Simulation | Vision | **Total** | **GEL** | No cache | Stress* |
|---|---|---|---|---|---|---|---|
| Gemini 3.8 Flash (2026) | $0.24 | $4.49 | $0.59 | $5.32 | 14.36 ₾ | 26.94 ₾ | 32.64 ₾ |
| Gemini 3.8 Flash (2027) | $0.48 | $8.98 | $1.18 | $10.64 | **28.72 ₾** | **53.89 ₾** | **65.29 ₾** |
| Gemini 3.1 Flash-Lite | $0.09 | $1.57 | $0.21 | $1.87 | 5.05 ₾ | 9.24 ₾ | 11.52 ₾ |
| Gemini 2.5 Flash | $0.15 | $2.08 | $0.37 | $2.60 | 7.02 ₾ | 12.05 ₾ | 15.83 ₾ |
| GPT-4o-mini | $0.04 | $1.27 | $2.36 | $3.67 | 9.90 ₾ | 11.30 ₾ | 15.19 ₾ |
| GPT-4o | $0.68 | $21.17 | $2.15 | $24.00 | **64.80 ₾** | 88.09 ₾ | 153.06 ₾ |
| GPT-4.1-mini | $0.11 | $2.70 | $0.46 | $3.26 | 8.81 ₾ | 14.41 ₾ | 19.83 ₾ |
| GPT-5-mini | $0.13 | $1.71 | $0.29 | $2.12 | 5.73 ₾ | 9.92 ₾ | 12.94 ₾ |
| Claude Haiku 4.5 | $0.34 | $6.56 | $1.07 | $7.97 | 21.52 ₾ | 36.75 ₾ | 47.45 ₾ |
| Claude Sonnet 5 | $0.68 | $13.12 | $2.14 | $15.94 | **43.05 ₾** | 73.49 ₾ | 94.91 ₾ |

\* Stress = cached, plus an LLM debrief, plus ×2 simulation tokens (unmeasured Georgian tokenization).

**Recommended mix** [I]: extraction on Gemini 3.8 Flash (2027) via Batch; simulation and vision on Gemini 3.1 Flash-Lite, prefix-cached, `media_resolution: medium`.

| | Ingest | Simulation | Vision | **Total** |
|---|---|---|---|---|
| ICP 1 | $0.24 | $1.57 | $0.21 | **$2.02 = 5.44 ₾** |
| Same with GPT-5-mini for simulation + vision | | | | $2.23 = 6.03 ₾ |
| **Worst plausible** (3.8 Flash 2027 everywhere; no cache; no batch; high resolution; debrief; ×2 tokens) | $0.48 | $47.37 | $1.68 | **$49.54 = 133.75 ₾** |

### 7.2 The audit, stated exactly [I]

`CD` §5.1 books **45 GEL** of cash COGS per ICP 1 season for "LLM ingestion + inference on small/fast models, messaging, storage". Reserving ≈ **12 GEL** for messaging templates and storage [G] leaves an **API allowance of ≈ 33 GEL**.

| Configuration | API GEL/season | vs 33 GEL allowance | vs 45 GEL total |
|---|---|---|---|
| Recommended mix | 5.44 | **−27.6 (passes, 84% headroom)** | passes |
| GPT-5-mini everywhere | 5.73 | passes | passes |
| Claude Haiku 4.5 everywhere | 21.52 | passes | passes |
| Gemini 3.8 Flash (2027), cached | 28.72 | passes (4.3 GEL headroom) | passes |
| Claude Sonnet 5, cached | 43.05 | **+10.1 deficit** | fails once messaging is added |
| Gemini 3.8 Flash (2027), **no cache** | 53.89 | **+20.9 deficit** | **+8.9 deficit** |
| GPT-4o, cached | 64.80 | **+31.8 deficit** | **+19.8 deficit** |
| Worst plausible | 133.75 | **+100.8 deficit** | **+88.8 deficit** |

**The required caching optimisation**, for the case that fails:

$$C(h)=C_{nocache}-h\,(C_{nocache}-C_{cached})\le 33\ ₾ \;\Rightarrow\; h\ge\frac{53.89-33}{53.89-28.72}=0.83$$

On Gemini 3.8 Flash at 2027 prices, at least **83% of the cacheable prefix reads** must actually hit cache to stay in budget. That depends on implicit-cache behaviour [G]. The robust fix is **model routing**: Flash-Lite or mini-class models for dialogue and vision need no caching to pass (9.24 GEL uncached).

### 7.3 ICP 2 and the 50-room hotel [I]

| Hotel | Model | Ingest | Simulation | Vision | Total | GEL | No cache | Stress |
|---|---|---|---|---|---|---|---|---|
| ICP 2, 60 rooms (30 trainees; 2,500 photos) | **Recommended mix** | $0.47 | $4.70 | $0.87 | **$6.04** | **16.31 ₾** | — | — |
| | Gemini 3.8 Flash (2027) | $0.94 | $26.94 | $4.91 | $32.79 | 88.54 ₾ | 164.02 ₾ | 198.23 ₾ |
| | Claude Haiku 4.5 | $0.70 | $19.69 | $4.46 | $24.85 | 67.10 ₾ | 112.76 ₾ | 144.89 ₾ |
| | Claude Sonnet 5 | $1.40 | $39.37 | $8.93 | $49.70 | **134.20 ₾** | 225.53 ₾ | 289.78 ₾ |
| | GPT-4o | $1.41 | $63.50 | $8.97 | $73.88 | **199.47 ₾** | 269.37 ₾ | 464.28 ₾ |
| 50 rooms (19 trainees; 2,900 photos) | **Recommended mix** | $0.47 | $2.98 | $1.01 | **$4.45** | **12.03 ₾** | — | — |
| | Worst plausible | $0.94 | $90.01 | $8.13 | $99.08 | 267.53 ₾ | — | — |

`CD`'s ICP 2 compute line is **120 GEL per season**:
- **Passes** with the recommended mix, Gemini 3.8 Flash (2027, cached) and Haiku 4.5.
- **Fails** with Sonnet 5 or GPT-4o as the dialogue model.

---

## 8. Prompt-Caching Economics

### 8.1 Break-even per vendor [D multipliers → I]

| Vendor | Read price | Write price | Break-even |
|---|---|---|---|
| Anthropic (5-min TTL) | 0.1× input | 1.25× input | **2 requests**: 1.25 + 0.1 = 1.35 < 2 uncached |
| Anthropic (1-hour TTL) | 0.1× | 2× | **3 requests**: 2 + 0.2 = 2.2 < 3 |
| Gemini, GPT-5 family | 0.1× | none | First hit |
| GPT-4.1 family | 0.25× | none | First hit |
| GPT-4o family | 0.5× | none | First hit (smaller gain) |

**A 4-turn scenario reads the prefix 3 times**, so caching always pays within one scenario, even on Anthropic with a cold write per scenario.

### 8.2 Minimum-prefix traps [D]

- **Claude Haiku 4.5 will not cache prefixes under 4,096 tokens.** A small hotel with an 8-rule rulebook has P ≈ 1,900 and **silently gets no caching** on Haiku 4.5. Sonnet 5 caches from 1,024 tokens.
- Mitigation: keep one shared, versioned "SimStay frontline core" block (tone, output contract, generic hospitality SOPs) *before* the hotel rules. It lifts every hotel's prefix above the minimum and is itself shared.

### 8.3 Explicit-cache storage trap (Gemini) [D → I]

Keeping a 5,900-token explicit cache alive 24/7 all season:

$$5{,}900 \times \frac{\$1.00}{10^{6}\,\text{tok}\cdot\text{h}} \times 24 \times 182\ \text{days} \approx \$25.8\ \text{per hotel season}$$

That is **more than the whole ICP 1 API budget**.
- Use **implicit/ephemeral caching** during active training sessions, or create explicit caches **per session** with a short TTL.
- Never keep a persistent per-hotel cache.

### 8.4 Cache-hit engineering

- **Byte-identical prefix:** rulebook serialised with sorted keys; no timestamps or IDs before the breakpoint.
- **Order:** core → hotel rulebook (versioned) → scenario context → conversation.
- **Rule updates:** new rule-set versions (challenger/production, `WEF-D` §6.3) create a new prefix. The first scenario after publication pays one write.
- **Measure:** `cache_read_input_tokens` (Anthropic), `cached_tokens` (OpenAI), `cached_content_token_count` (Gemini) per call. Alert when the hit rate falls below 80%.

---

## 9. Token-Optimisation Playbook: Quantified

| # | Technique | Mechanism | Saving (from the model) | Label |
|---|---|---|---|---|
| 1 | **Deterministic grading, routing and verification** | No LLM in the S3 path (§3) | Avoids an estimated **2–3×** simulation multiplier | [I] |
| 2 | **Static-prefix caching** | Rulebook + core cached; turns 2…n read at 0.1× | **46–51%** per scenario (29% on GPT-4o family) | [I] |
| 3 | **Model routing** | Frontier model only for one-off extraction; Flash-Lite / mini for dialogue and vision | ICP 1: 28.72 → **5.44 GEL (−81%)** vs 3.8 Flash everywhere (2027) | [I] |
| 4 | **Batch API for ingestion** | 50% off; onboarding tolerates latency | Ingest $0.48 → **$0.24** (ICP 1) | [D]/[I] |
| 5 | **Templated debrief** | Coaching text built from gate verdicts and rule quotes | Avoids +27% input and +49% output per scenario | [I] |
| 6 | **Vendor-specific image sizing** | Gemini 3: `media_resolution` low/medium (560 → 280 halves image tokens). Claude/OpenAI patch models: resize to 1024 or 512 px (Haiku 1,530 → 361). Gemini 2.5: ≤ 384 px (1,032 → 258). **Never** GPT-4o-mini for vision | Per photo −50% to −75% | [D]/[I] |
| 7 | **Output caps + JSON schemas** | `max_tokens` ≈ 250 for guest turns, 120 for vision verdicts; thinking off/minimal for dialogue | Protects against the ×3 reasoning overhead (§5.3) | [I]/[G] |
| 8 | **History pruning** (last 2 turns + a state summary) | Bounds $\frac{n(n-1)}{2}(u+g)$ growth | ≈ 0 at n = 4 (history is only 1,440 tokens); **matters only for free-form sessions of 10+ turns**, where history grows quadratically | [I] |
| 9 | **Offline cache for the demo and fallback** | `OFFLINE_DEMO` / 2.5-s timeout → fixture (`PS` §4.2) | Demo and rehearsal runs cost **0 tokens** | [I] |
| 10 | **Georgian-efficient tokenizer choice** | Measure each vendor on the fixture corpus (§1.3) | A 1.6× vs 9.6× spread was observed across tokenizer generations | [I] |

**Combined effect** (3.8 Flash 2027 everywhere, uncached, debrief, stress tokens → recommended mix): **133.75 → 5.44 GEL per ICP 1 season, −96%** [I].

---

## 10. Scorecard for Jury and Investors (copy-ready)

| Metric | Value (recommended stack) | Bound (worst plausible) | Label |
|---|---|---|---|
| **Cost per trainee trained** (30 scenarios × 1.3 attempts) | **$0.16 ≈ 0.42 ₾** | $3.54 (Sonnet 5) | [I] |
| **Cost per room verified** (1 photo + verdict) | **$0.00035 ≈ 0.001 ₾** ($0.35 per 1,000 rooms) | $0.0039 (GPT-4o-mini) | [I] |
| **Cost per onboarding** (rules + 35 scenarios) | **$0.24** (Batch) | $1.40 (Sonnet 5, ICP 2) | [I] |
| **Monthly API bill, 50-room hotel** (season ÷ 6) | **$0.74 ≈ 2.0 ₾ / month** | $16.51 ≈ 44.6 ₾ / month | [I] |
| **ICP 1 season API cost** | **5.44 ₾** (12% of the 45 ₾ COGS line) | 133.75 ₾ | [I] |
| **Software gross margin, ICP 1** (650 ₾; API + 12 ₾ messaging/storage) | **97.3%** | 77.6% | [I] |
| **Software gross margin, 50 rooms** (`CD` Y1 revenue 4,340 ₾; API + 20 ₾) | **99.3%** | 93.4% | [I] |
| Operations using 0 LLM tokens | Grading, settlement, routing, checklists, PMS sync, CSV import, quick replies | — | [I] |

**One-line message:** "An AI tutor that costs under half a lari per trainee, because the part that must be right is code, not a model."

---

## 11. Telemetry Plan: Turning [G] into [D]

| # | Measurement | How | Replaces |
|---|---|---|---|
| 1 | Georgian token counts per vendor | `count_tokens` (Anthropic), `countTokens` (Gemini) on the §1.3 fixture corpus | The ×2 stress factor |
| 2 | Real prefix size per hotel | Log P per published rule-set version | P = 5,900 |
| 3 | Cache hit rate | Vendor usage fields (§8.4) per call; daily hit-rate report | The 83% threshold |
| 4 | Turns, reply length and retries per scenario | Session log: turns, `usage.output_tokens`, attempt count | n = 4, g = 180, 1.3 attempts |
| 5 | Photos per turnaround; verdict accuracy vs supervisor | Work-order evidence table | 1 photo per room; `media_resolution` choice |
| 6 | Reasoning-token share | `usage` reasoning/thinking fields | The ×3 sensitivity |
| 7 | Messaging cost | WhatsApp template invoices | 12 GEL reserve |

**Budget guardrail (implementation):** per-tenant monthly token ledger with alerts at 50% and 80% of the tier allowance. Automatic downgrade to the cached-prefix Flash-Lite route when exceeded. Hard stop on non-essential generative features, such as the optional LLM guest paraphrase.

---

## Appendix A: Sources (retrieved 2026-09-27)

1. Anthropic pricing (model rates, cache multipliers, Batch, retired models): https://platform.claude.com/docs/en/about-claude/pricing
2. Anthropic vision (⌈w/28⌉·⌈h/28⌉ visual tokens; 1,568 / 4,784 caps): https://platform.claude.com/docs/en/build-with-claude/vision
3. Anthropic prompt caching (minimum cacheable prefix per model; TTLs): https://platform.claude.com/docs/en/build-with-claude/prompt-caching
4. Gemini API pricing (2.5 Flash, 3.1 Flash-Lite, 3.5/3.6/3.7/3.8 Flash incl. the 2027 change; caching and storage): https://ai.google.dev/gemini-api/docs/pricing
5. Gemini image understanding (258 tokens ≤ 384 px; 768-px tiles): https://ai.google.dev/gemini-api/docs/image-understanding
6. Gemini media resolution (280 / 560 / 1,120 / 2,240; PDF pages): https://ai.google.dev/gemini-api/docs/media-resolution
7. Gemini deprecations (2.5 access limited to prior users): https://ai.google.dev/gemini-api/docs/deprecations
8. OpenAI API pricing (GPT-4o, 4o-mini, 4.1-mini, 5-mini): https://developers.openai.com/api/docs/pricing
9. OpenAI images and vision (tile vs patch tokenization; per-model constants): https://developers.openai.com/api/docs/guides/images-vision
10. Tokenizer measurement: `tiktoken` o200k_base / cl100k_base on `src/lib/simustay/fixtures/*.json` (this repository)
