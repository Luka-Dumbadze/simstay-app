// Run with `npm test` (node:test, no extra dependencies).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gateFinish, gateMove } from "./grader.ts";
import type { Folio, Rule } from "./types.ts";

const load = (p: string) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const rules = load("./fixtures/rules.ambassadori.json").rules as Rule[];
const folio = () => structuredClone(load("./fixtures/scenario.ambassadori-villa.json").folio) as Folio;

describe("gateMove · Ambassadori Kachreti", () => {
  it("accepts the villa to the company window", () => assert.equal(gateMove(folio(), rules, "c-villa", 2).ok, true));
  it("accepts golf to the company window", () => assert.equal(gateMove(folio(), rules, "c-golf", 2).ok, true));
  it("blocks wine tasting to the company window with H2, citing page 2", () => {
    const g = gateMove(folio(), rules, "c-wine", 2);
    assert.equal(g.ok, false);
    assert.equal(g.ruleId, "H2");
    assert.equal(g.message_ka, "ღვინის დეგუსტაცია რჩება სტუმრის პირად ანგარიშზე");
    assert.equal(g.source?.page, 2);
  });
  it("blocks the restaurant to the company window with H3", () => assert.equal(gateMove(folio(), rules, "c-rest", 2).ruleId, "H3"));
  it("blocks the villa to the guest window with H1", () => assert.equal(gateMove(folio(), rules, "c-villa", 1).ruleId, "H1"));
  it("blocks any charge to an unconfigured window with H4", () => assert.equal(gateMove(folio(), rules, "c-rest", 3).ruleId, "H4"));
  it("blocks direct bill without a company letter with P1", () => {
    const f = folio();
    f.letterOnFile = false;
    assert.equal(gateMove(f, rules, "c-villa", 2).ruleId, "P1");
  });
  it("never grades discretion rules", () => {
    const onlyD = rules.filter((r) => r.tier === "D");
    assert.equal(gateMove(folio(), onlyD, "c-wine", 2).ok, true);
  });
});

describe("gateFinish · Ambassadori Kachreti", () => {
  it("refuses an unbalanced folio", () => assert.equal(gateFinish(folio(), rules).ruleId, "BAL"));
  it("accepts the correctly routed folio (W1 360.00 / W2 630.00)", () => {
    const f = folio();
    const route: Record<string, 1 | 2> = { "c-villa": 2, "c-golf": 2, "c-wine": 1, "c-rest": 1 };
    f.charges.forEach((c) => { c.window = route[c.id]; });
    assert.equal(gateFinish(f, rules).ok, true);
  });
});

const bioliRules = load("./fixtures/rules.bioli.json").rules as Rule[];
const bioliFolio = () => structuredClone(load("./fixtures/scenario.bioli-cottage.json").folio) as Folio;

describe("gateMove · Bioli Wellness", () => {
  it("routes the prepaid cottage stay to W2 (H1)", () => assert.equal(gateMove(bioliFolio(), bioliRules, "c-cottage", 2).ok, true));
  it("routes stay inclusions (salt room, spectrometry) to W2 at 0 GEL (H3)", () => {
    const f = bioliFolio();
    assert.equal(gateMove(f, bioliRules, "c-halo", 2).ok, true);
    assert.equal(gateMove(f, bioliRules, "c-spectro", 2).ok, true);
    assert.equal(f.charges.find((c) => c.id === "c-halo")?.amount, 0);
    assert.equal(f.charges.find((c) => c.id === "c-spectro")?.amount, 0);
  });
  it("blocks a stay inclusion charged to the guest card with H3", () => assert.equal(gateMove(bioliFolio(), bioliRules, "c-halo", 1).ruleId, "H3"));
  it("blocks bar alcohol to the prepaid window with H2, citing page 1", () => {
    const g = gateMove(bioliFolio(), bioliRules, "c-bar", 2);
    assert.equal(g.ruleId, "H2");
    assert.equal(g.message_ka, "ალკოჰოლი და მინიბარი არ შედის დეტოქს-პაკეტში და რჩება სტუმრის პირად ანგარიშზე");
    assert.equal(g.source?.page, 1);
  });
  it("blocks the out-of-program phytobath (145 GEL) to the prepaid window with H4", () => {
    const f = bioliFolio();
    assert.equal(f.charges.find((c) => c.id === "c-phyto")?.amount, 145);
    assert.equal(gateMove(f, bioliRules, "c-phyto", 2).ruleId, "H4");
  });
  it("accepts the correctly routed folio (W1 395.00 / W2 1080.00)", () => {
    const f = bioliFolio();
    const route: Record<string, 1 | 2> = { "c-cottage": 2, "c-halo": 2, "c-spectro": 2, "c-phyto": 1, "c-bar": 1 };
    f.charges.forEach((c) => { c.window = route[c.id]; });
    assert.equal(gateFinish(f, bioliRules).ok, true);
  });
});

describe("Bioli fixture authenticity (bioli.ge, verified 2026-09-27)", () => {
  const property = load("./fixtures/scenario.bioli-cottage.json").property;
  it("aroma menu matches Bioli's published list", () =>
    assert.deepEqual(property.preferenceMenu.aroma.map((o: { id: string }) => o.id), ["orange", "eucalyptus", "lavender", "iris", "ylang_ylang", "pine", "fir"]));
  it("pillow menu matches Bioli's published list", () =>
    assert.deepEqual(property.preferenceMenu.pillow.map((o: { id: string }) => o.id), ["sintepon", "feather", "medicinal_plants"]));
  it("sheet options match Bioli's published list", () =>
    assert.deepEqual(property.preferenceMenu.sheets.map((o: { id: string }) => o.id), ["cotton", "linen"]));
  it("the guest card uses only published options", () => {
    for (const k of ["aroma", "pillow", "sheets"] as const) {
      assert.ok(property.preferenceMenu[k].some((o: { id: string }) => o.id === property.guestCard[k]), k);
    }
  });
  it("every rule quote appears verbatim in the demo rules document", () => {
    const html = readFileSync(new URL("./fixtures/docs/bioli_kojori_wellness_protocols.html", import.meta.url), "utf8");
    for (const r of bioliRules) assert.ok(html.includes(r.source.quote), r.id);
  });
});
