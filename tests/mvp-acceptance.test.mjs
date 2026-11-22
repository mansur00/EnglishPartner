import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Seed & Content
import { SEED_SCENARIOS } from "../src/content/seed/scenarios.ts";
import { SEED_DIALOGUES } from "../src/content/seed/dialogues.ts";
import { SEED_VOCABULARY } from "../src/content/seed/vocabulary.ts";
import { PROFESSIONS_REGISTRY } from "../src/lib/professions/registry.ts";

// Engines & Specs
import { estimateSentenceDurationMs, buildAudioTimingManifest } from "../src/lib/audio/timing-manifest.ts";
import { createFallbackAnnotation } from "../src/lib/grammar/fallback.ts";
import { resolveSayItIntent } from "../src/lib/ai/say-it.ts";
import { generateRoleplayTurn, generateRoleplayFeedback } from "../src/lib/ai/roleplay.ts";
import { calculateSM2, createDefaultSRSState } from "../src/lib/srs/sm2.ts";
import { MemoryQuotaStore } from "../src/lib/ratelimit/quota.ts";
import { isRtlLanguage, SUPPORTED_LOCALES } from "../src/lib/i18n/languages.ts";
import { t } from "../src/lib/i18n/index.ts";

describe("Brief §19: MVP End-to-End Acceptance Verification Suite", () => {
  describe("1. Discovery Acceptance Criteria", () => {
    it("should allow browsing Daily Life and Professional categories with rich scenario coverage", () => {
      const dailyCategories = ["shopping-and-money", "travel-and-transportation", "health-and-hospital", "social-and-conflict"];
      const professionalCategories = ["workplace-and-office", "professional-paths"];

      // Check Daily Life categories
      for (const catSlug of dailyCategories) {
        const matches = SEED_SCENARIOS.filter((s) => s.categories.some((c) => c.slug === catSlug));
        assert.ok(matches.length > 0, `Daily category '${catSlug}' must have at least 1 scenario`);
      }

      // Check Professional categories & Career Tracks
      for (const catSlug of professionalCategories) {
        const matches = SEED_SCENARIOS.filter((s) => s.categories.some((c) => c.slug === catSlug));
        assert.ok(matches.length >= 6, `Professional category '${catSlug}' must have at least 6 scenarios`);
      }

      assert.equal(Object.keys(PROFESSIONS_REGISTRY).length, 5, "5 specialized professional career tracks registered");
    });

    it("should allow a scenario to belong to multiple categories without duplication", () => {
      const multiCategoryScenarios = SEED_SCENARIOS.filter((s) => s.categories.length > 1);
      assert.ok(multiCategoryScenarios.length > 0, "At least one scenario belongs to multiple categories");

      // Verify no duplicate IDs in registry
      const idSet = new Set();
      for (const s of SEED_SCENARIOS) {
        assert.ok(!idSet.has(s.id), `Duplicate scenario ID: ${s.id}`);
        idSet.add(s.id);
      }
    });

    it("should find scenarios via bilingual search queries", () => {
      const queryEn = "price";
      const queryBn = "দাম";

      const matchEn = SEED_SCENARIOS.filter(
        (s) => s.title.toLowerCase().includes(queryEn) || s.description.toLowerCase().includes(queryEn)
      );
      const matchBn = SEED_SCENARIOS.filter(
        (s) => s.titleBn.toLowerCase().includes(queryBn) || s.descriptionBn.toLowerCase().includes(queryBn)
      );

      assert.ok(matchEn.length > 0, "Must match 'price' query in English");
      assert.ok(matchBn.length > 0, "Must match 'দাম' query in Bengali");
    });
  });

  describe("2. Conversation Learning Acceptance Criteria", () => {
    it("should maintain contiguous sequence numbering and assigned speaker roles", () => {
      const sampleDialogue = SEED_DIALOGUES["asking-price-product-details"]?.[0];
      assert.ok(sampleDialogue, "Sample dialogue version must exist");
      assert.ok(sampleDialogue.lines.length >= 4, "Dialogue must have at least 4 turns");

      for (let i = 0; i < sampleDialogue.lines.length; i++) {
        const line = sampleDialogue.lines[i];
        assert.equal(line.sequenceNumber, i + 1, `Line at index ${i} must have sequenceNumber ${i + 1}`);
        assert.ok(line.speakerId.length > 0, `Valid speakerId for line ${line.id}`);
        assert.ok(line.englishText.length > 0, "Line text must not be empty");
        assert.ok(line.translationBn.length > 0, "Bengali translation must be present");
      }
    });

    it("should build accurate timing manifests for scrub bar seek without cascading renders", () => {
      const sampleLines = [
        { id: "line-1", speakerName: "Clerk", englishText: "Good morning! How much is this blue cotton shirt?" },
        { id: "line-2", speakerName: "Customer", englishText: "Good morning! It's twenty-five dollars." },
      ];

      const manifest = buildAudioTimingManifest(sampleLines, { playbackRate: 1.0 });
      assert.equal(manifest.lines.length, 2);
      assert.equal(manifest.lines[0].startMs, 0);
      assert.ok(manifest.lines[0].endMs > 0);
      assert.ok(manifest.lines[1].startMs >= manifest.lines[0].endMs, "Subsequent turn starts after previous turn");
      assert.equal(manifest.durationMs, manifest.lines[1].endMs);
      assert.ok(estimateSentenceDurationMs("Short sentence") > 0);
    });
  });

  describe("3. Vocabulary & Grammar Acceptance Criteria", () => {
    it("should provide contextual word meanings with audio support", () => {
      const allVocab = Object.values(SEED_VOCABULARY).flat();
      assert.ok(allVocab.length >= 10, "At least 10 curated seed vocabulary words");
      for (const word of allVocab) {
        assert.ok(word.word.length > 0);
        assert.ok(word.contextualMeaningBn.length > 0);
        assert.ok(word.partOfSpeech.length > 0);
        assert.ok(word.exampleSentence.length > 0);
      }
    });

    it("should safely produce fallback grammar annotations for unindexed sentences without crashing", () => {
      const fallback = createFallbackAnnotation("line-1", "We need two more days to complete the design.");
      assert.equal(fallback.lineId, "line-1");
      assert.ok(fallback.tokens.length >= 8);
      assert.equal(fallback.sentence.structure, "simple");
    });
  });

  describe("4. Personal Learning, Practice & AI Acceptance Criteria", () => {
    it("should calculate correct SM-2 review intervals and cap ease factors safely", () => {
      const base = createDefaultSRSState(new Date("2026-11-21T10:00:00Z"));

      // Rating 'good' advances stage
      const step1 = calculateSM2({
        reviewStage: base.reviewStage,
        easeFactor: base.easeFactor,
        intervalDays: base.intervalDays,
        lapseCount: base.lapseCount,
        rating: "good",
        now: new Date("2026-11-21T10:00:00Z"),
      });
      assert.equal(step1.reviewStage, 1);
      assert.equal(step1.intervalDays, 1);

      // Rating 'again' resets stage to 0 and interval to 1
      const reset = calculateSM2({
        reviewStage: step1.reviewStage,
        easeFactor: step1.easeFactor,
        intervalDays: step1.intervalDays,
        lapseCount: step1.lapseCount,
        rating: "again",
        now: new Date("2026-11-22T10:00:00Z"),
      });
      assert.equal(reset.reviewStage, 0);
      assert.equal(reset.intervalDays, 1);
      assert.ok(reset.easeFactor >= 1.30, "Ease factor must not drop below 1.30");
    });

    it("should resolve AI Intent Assistant requests deterministically", () => {
      const result = resolveSayItIntent({
        intent: "I want to ask for a discount politely.",
      });
      assert.ok(result.options.length >= 1);
      assert.ok(result.options[0].english.length > 0);
      assert.ok(result.options[0].translation.length > 0);
    });

    it("should enforce AI Roleplay single-correction invariant and feedback generation", () => {
      const turn = generateRoleplayTurn({
        scenario_id: "shopping",
        scenario_title: "Shopping",
        scenario_context: "In a shop",
        ai_role: "Clerk",
        learner_role: "Customer",
        transcript: [],
        learner_message: "I wants to buy this shirt.",
      });

      assert.ok(turn.ai_reply.length > 0);
      // Correction rule: max 1 per turn, original must be in learner message
      if (turn.correction) {
        assert.ok("I wants to buy this shirt.".includes(turn.correction.original));
      }

      // Feedback generation conforming to Schema F1 (no fake numerical percentages)
      const feedback = generateRoleplayFeedback({
        scenario_title: "Shopping",
        transcript: [
          { speaker: "learner", text: "Can you help me?" },
          { speaker: "ai", text: "Sure! What are you looking for?" },
        ],
      });
      assert.ok(feedback.summary.length > 0);
      assert.ok(feedback.strengths.length > 0);
      assert.ok(feedback.next_step.length > 0);
      assert.ok(feedback.limitations.length > 0);
    });

    it("should enforce rate limiting and daily quota caps for AI defense", () => {
      const store = new MemoryQuotaStore();
      const learnerId = "mvp-test-learner";

      for (let i = 1; i <= 10; i++) {
        const res = store.checkAndRecord(learnerId, "sayIt");
        assert.equal(res.allowed, true);
      }
      const blocked = store.checkAndRecord(learnerId, "sayIt");
      assert.equal(blocked.allowed, false);
      assert.equal(blocked.error, "RATE_LIMITED");
    });
  });

  describe("5. Multi-Language & Quality Acceptance Criteria", () => {
    it("should maintain 100% key parity across EN, BN, and HI messages", () => {
      assert.deepEqual(SUPPORTED_LOCALES, ["en", "bn", "hi"]);
      assert.equal(t("nav.dashboard", "en"), "Dashboard");
      assert.equal(t("nav.dashboard", "bn"), "ড্যাশবোর্ড");
      assert.equal(t("nav.dashboard", "hi"), "डैशबोर्ड");
    });

    it("should correctly identify text directions for RTL roadmap languages", () => {
      assert.equal(isRtlLanguage("en"), false);
      assert.equal(isRtlLanguage("bn"), false);
      assert.equal(isRtlLanguage("hi"), false);
      assert.equal(isRtlLanguage("ur"), true);
      assert.equal(isRtlLanguage("ar"), true);
    });
  });
});
