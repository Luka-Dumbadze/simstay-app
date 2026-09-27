// Run with `npm test` (node:test, no extra dependencies).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gateFinish, gateMove } from "./grader.ts";
import type { Folio, Rule } from "./types.ts";

const load = (p: string) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const rules = load("./fixtures/rules.alazani.json").rules as Rule[];
const folio = () => structuredClone(load("./fixtures/scenario.checkin-204.json").folio) as Folio;

describe("gateMove", () => {
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

describe("gateFinish", () => {
  it("refuses an unbalanced folio", () => assert.equal(gateFinish(folio(), rules).ruleId, "BAL"));
  it("accepts the correctly routed folio (W1 360.00 / W2 630.00)", () => {
    const f = folio();
    const route: Record<string, 1 | 2> = { "c-villa": 2, "c-golf": 2, "c-wine": 1, "c-rest": 1 };
    f.charges.forEach((c) => { c.window = route[c.id]; });
    assert.equal(gateFinish(f, rules).ok, true);
  });
});
