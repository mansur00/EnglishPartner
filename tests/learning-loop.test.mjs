import { test, describe } from "node:test";
import assert from "node:assert/strict";

// Import modules under test
import { SEED_SCENARIOS } from "../src/content/seed/scenarios.ts";
import { SEED_DIALOGUES } from "../src/content/seed/dialogues.ts";
import { SEED_VOCABULARY, SEED_GRAMMAR_EXPLANATIONS } from "../src/content/seed/vocabulary.ts";
import { SHOPPING_MONEY_LADDER_STEPS } from "../src/content/seed/niche_shopping_money.ts";
import { SEED_EXERCISES_MAP } from "../src/content/seed/exercises.ts";
import {
  hasMinimumRole,
  canViewAdminPanel,
  canEditScenario,
  canPublishContent,
} from "../src/lib/auth/roles.ts";
import { validateForPublish } from "../src/lib/content/validator.ts";

describe("Milestone 1E: Core Learning Loop & System Integrity", () => {
  test("1. Seed Scenarios Data Integrity", () => {
    assert.ok(SEED_SCENARIOS.length >= 17, "Must contain at least 17 seed scenarios");

    const slugSet = new Set();
    for (const scenario of SEED_SCENARIOS) {
      assert.ok(scenario.title.length > 0, `Scenario ${scenario.id} missing English title`);
      assert.ok(scenario.titleBn.length > 0, `Scenario ${scenario.id} missing Bengali title`);
      assert.ok(scenario.slug.length > 0, `Scenario ${scenario.id} missing slug`);
      assert.ok(!slugSet.has(scenario.slug), `Duplicate slug found: ${scenario.slug}`);
      slugSet.add(scenario.slug);

      assert.ok(
        ["A1", "A2", "B1", "B2"].includes(scenario.level),
        `Invalid CEFR level in ${scenario.slug}: ${scenario.level}`
      );
      assert.ok(
        scenario.categories.length > 0,
        `Scenario ${scenario.slug} must belong to at least 1 category`
      );
    }
  });

  test("2. Bilingual Discovery & Search Matching", () => {
    const queryEn = "airport";
    const queryBn = "এয়ারপোর্ট";

    const matchEn = SEED_SCENARIOS.filter(
      (s) =>
        s.title.toLowerCase().includes(queryEn) ||
        s.description.toLowerCase().includes(queryEn)
    );
    const matchBn = SEED_SCENARIOS.filter(
      (s) =>
        s.titleBn.toLowerCase().includes(queryBn) ||
        s.descriptionBn.toLowerCase().includes(queryBn)
    );

    assert.ok(matchEn.length > 0, "Query 'airport' must match the airport scenario");
    assert.ok(matchBn.length > 0, "Query 'এয়ারপোর্ট' must match the airport scenario");
    assert.equal(
      matchEn[0].slug,
      matchBn[0].slug,
      "Both English and Bengali queries must resolve to the identical scenario"
    );
  });

  test("3. Dialogue Turns & Sequence Continuity", () => {
    for (const [slug, versions] of Object.entries(SEED_DIALOGUES)) {
      assert.ok(versions.length > 0, `Scenario ${slug} has no dialogue versions`);

      for (const version of versions) {
        assert.ok(version.lines.length >= 2, `${slug} version ${version.versionId} has fewer than 2 turns`);

        const speakerIds = new Set(version.speakers.map((s) => s.id));
        version.lines.forEach((line, index) => {
          assert.equal(
            line.sequenceNumber,
            index + 1,
            `Sequence gap in ${slug} at turn ${index + 1}`
          );
          assert.ok(
            speakerIds.has(line.speakerId),
            `Turn #${line.sequenceNumber} in ${slug} has invalid speaker ID: ${line.speakerId}`
          );
          assert.ok(
            line.englishText.trim().length > 0,
            `Turn #${line.sequenceNumber} in ${slug} has empty English text`
          );
          assert.ok(
            line.translationBn.trim().length > 0,
            `Turn #${line.sequenceNumber} in ${slug} has empty Bengali translation`
          );
        });
      }
    }
  });

  test("4. Role-Based Access Control (RBAC) Security Guards", () => {
    assert.equal(hasMinimumRole("admin", "editor"), true, "Admin must outrank editor");
    assert.equal(hasMinimumRole("learner", "editor"), false, "Learner must not outrank editor");

    // Learners are unauthorized to view admin
    assert.equal(canViewAdminPanel("learner"), false, "Learner role must be blocked from admin panel");
    assert.equal(canEditScenario("learner"), false, "Learner role must not be able to edit scenarios");
    assert.equal(canPublishContent("learner"), false, "Learner role must not be able to publish");

    // Translators can view admin
    assert.equal(canViewAdminPanel("translator"), true, "Translator can view admin");
    assert.equal(canEditScenario("translator"), false, "Translator cannot edit scenario metadata");

    // Editors can view and edit, but not publish
    assert.equal(canViewAdminPanel("editor"), true, "Editor can view admin");
    assert.equal(canEditScenario("editor"), true, "Editor can edit scenarios");
    assert.equal(canPublishContent("editor"), false, "Editor cannot publish content without review");

    // Reviewer and Admin can publish
    assert.equal(canPublishContent("reviewer"), true, "Reviewer can publish");
    assert.equal(canPublishContent("admin"), true, "Admin can publish");
  });

  test("5. Pre-Publish Validation Guard Checks", () => {
    // A. Valid scenario passes
    const validScenario = SEED_SCENARIOS[0];
    const validVersion = SEED_DIALOGUES[validScenario.slug][0];
    const passResult = validateForPublish(validScenario, validVersion);
    assert.equal(passResult.isValid, true, "Valid seed scenario must pass publish validation");
    assert.equal(passResult.errors.length, 0);

    // B. Incomplete scenario fails
    const brokenScenario = {
      title: "",
      titleBn: "",
      slug: "invalid slug with spaces",
      categories: [],
    };
    const failResult = validateForPublish(brokenScenario);
    assert.equal(failResult.isValid, false, "Broken scenario must fail validation");
    assert.ok(failResult.errors.length >= 3, "Must flag all missing required fields");
  });

  test("6. Vocabulary & Contextual Meaning Mapping", () => {
    assert.ok(Object.keys(SEED_VOCABULARY).length >= 10, "Vocabulary seed must contain at least 10 entries");

    for (const [key, entry] of Object.entries(SEED_VOCABULARY)) {
      assert.ok(entry.word, `Vocabulary entry ${key} missing word`);
      assert.ok(entry.ipa, `Vocabulary entry ${key} missing IPA`);
      assert.ok(entry.contextualMeaningBn, `Vocabulary entry ${key} missing contextual Bengali meaning`);
      assert.ok(entry.exampleSentence, `Vocabulary entry ${key} missing example sentence`);
    }

    assert.ok(
      Object.keys(SEED_GRAMMAR_EXPLANATIONS).length >= 3,
      "Grammar explanations seed must contain entries"
    );
  });

  test("7. 20-Step Progressive Conversation Ladder (Niche 01)", () => {
    assert.equal(
      SHOPPING_MONEY_LADDER_STEPS.length,
      20,
      "Niche 01 must have exactly 20 progressive steps"
    );

    SHOPPING_MONEY_LADDER_STEPS.forEach((step, idx) => {
      assert.equal(step.stepNumber, idx + 1, `Step sequence mismatch at index ${idx}`);
      assert.ok(step.title.length > 0, `Step ${step.stepNumber} missing title`);
      assert.ok(step.titleBn.length > 0, `Step ${step.stepNumber} missing Bengali title`);
      assert.ok(step.focus.length > 0, `Step ${step.stepNumber} missing grammar focus`);
      assert.ok(step.lines.length >= 5, `Step ${step.stepNumber} must have at least 5 lines`);
      assert.equal(
        step.lines.length,
        step.linesCount,
        `Step ${step.stepNumber} declared linesCount does not match parsed lines length`
      );

      // Verify continuous step linking
      if (idx > 0) {
        assert.equal(
          step.prevStepSlug,
          SHOPPING_MONEY_LADDER_STEPS[idx - 1].stepSlug,
          `Step ${step.stepNumber} prevStepSlug must point to step ${idx}`
        );
      }
      if (idx < 19) {
        assert.equal(
          step.nextStepSlug,
          SHOPPING_MONEY_LADDER_STEPS[idx + 1].stepSlug,
          `Step ${step.stepNumber} nextStepSlug must point to step ${idx + 2}`
        );
      }
    });

    // Step 20 is the C1 Story
    const step20 = SHOPPING_MONEY_LADDER_STEPS[19];
    assert.ok(step20.linesCount >= 50, "Step 20 story must have at least 50 lines");
    assert.equal(step20.title, "The Shop on Sheikh Mujib Road");
  });

  test("8. Phase 2 Milestone 2A: Exercises & Quizzes Integrity", () => {
    assert.ok(Object.keys(SEED_EXERCISES_MAP).length > 0, "Exercises map must contain entries");

    for (const [slug, exerciseSet] of Object.entries(SEED_EXERCISES_MAP)) {
      assert.equal(slug, exerciseSet.stepSlug);

      // Validate listening quizzes
      for (const quiz of exerciseSet.listeningQuizzes) {
        assert.ok(quiz.question.length > 0, "Quiz question missing");
        assert.ok(quiz.options.length >= 2, "Quiz must have at least 2 options");
        assert.ok(
          quiz.options.some((o) => o.id === quiz.correctOptionId),
          `Correct option ${quiz.correctOptionId} not found in options`
        );
        assert.ok(quiz.explanationBn.length > 0, "Bengali explanation missing");
      }

      // Validate complete line items
      for (const item of exerciseSet.completeLines) {
        assert.ok(item.maskedSentence.includes("___"), "Masked sentence must contain blank");
        assert.ok(item.blanks.length > 0, "Must contain at least 1 blank");
        item.blanks.forEach((b) => {
          assert.ok(b.options.includes(b.correctAnswer), "Correct answer must be among options");
        });
      }
    }
  });
});
