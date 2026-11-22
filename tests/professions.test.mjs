import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PROFESSIONS_REGISTRY,
  ALL_PROFESSIONS,
  getProfessionBySlug,
} from "../src/lib/professions/registry.ts";
import { SEED_SCENARIOS } from "../src/content/seed/scenarios.ts";

test("Milestone 4A: PROFESSIONS_REGISTRY contains all 5 registered career paths", () => {
  const expectedSlugs = [
    "ui-ux-designer",
    "software-engineer",
    "remote-freelancer",
    "healthcare-worker",
    "teacher",
  ];

  for (const slug of expectedSlugs) {
    const prof = PROFESSIONS_REGISTRY[slug];
    assert.ok(prof, `Missing profession: ${slug}`);
    assert.ok(prof.name, `Missing English name for ${slug}`);
    assert.ok(prof.nameBn, `Missing Bengali name for ${slug}`);
    assert.ok(prof.taglineBn, `Missing Bengali tagline for ${slug}`);
    assert.ok(prof.descriptionBn, `Missing Bengali description for ${slug}`);
    assert.ok(prof.targetCefr, `Missing target CEFR for ${slug}`);
    assert.ok(prof.competenciesBn.length > 0, `Missing competencies for ${slug}`);
  }
});

test("Milestone 4A: getProfessionBySlug handles both direct slug and alias", () => {
  const designer = getProfessionBySlug("ui-ux-designer");
  assert.ok(designer);
  assert.equal(designer.id, "uiux");

  const alias = getProfessionBySlug("designer");
  assert.ok(alias);
  assert.equal(alias.id, "uiux");

  const swe = getProfessionBySlug("software-engineer");
  assert.ok(swe);
  assert.equal(swe.id, "swe");

  const nonexistent = getProfessionBySlug("astronaut");
  assert.equal(nonexistent, undefined);
});

test("Milestone 4A: ALL_PROFESSIONS list has 5 complete items", () => {
  assert.equal(ALL_PROFESSIONS.length, 5);
});

test("Milestone 4A: SEED_SCENARIOS contains scenarios for each registered profession", () => {
  const registeredSlugs = Object.keys(PROFESSIONS_REGISTRY);

  for (const slug of registeredSlugs) {
    const scenarios = SEED_SCENARIOS.filter((s) => s.profession?.slug === slug);
    assert.ok(
      scenarios.length > 0,
      `Profession ${slug} should have at least 1 scenario in SEED_SCENARIOS`
    );
  }
});
