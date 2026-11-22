import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  computeProgressMetrics,
  generatePersonalizedRecommendations,
  LearnerMetricsSummarySchema,
  PersonalizedRecommendationSchema,
} from "../src/lib/analytics/progress-metrics.ts";

describe("Milestone 3D & 3E: Learner Progress Analytics & Recommendations Engine", () => {
  describe("1. Progress Metrics Computation", () => {
    it("handles zero/initial learner stats safely", () => {
      const stats = {
        currentStreak: 0,
        bestStreak: 0,
        practiceTimeMinutes: 0,
        completedScenariosCount: 0,
      };

      const metrics = computeProgressMetrics(stats);
      const validated = LearnerMetricsSummarySchema.parse(metrics);

      assert.equal(validated.currentStreak, 0);
      assert.equal(validated.bestStreak, 0);
      assert.equal(validated.practiceTimeMinutes, 0);
      assert.equal(validated.vocabulary.totalSaved, 0);
      assert.equal(validated.vocabulary.retentionRate, 0);
      assert.equal(validated.practiceAccuracy, 100);
      assert.equal(validated.weeklyActivity.length, 7);
    });

    it("correctly categorizes SM-2 vocabulary stages into retention tiers", () => {
      const stats = {
        currentStreak: 5,
        bestStreak: 7,
        practiceTimeMinutes: 45,
        completedScenariosCount: 3,
        totalQuizAnswers: 20,
        correctQuizAnswers: 16,
        userVocabularyItems: [
          { reviewStage: 0 },
          { reviewStage: 1 },
          { reviewStage: 2 }, // 3 learning (0-2)
          { reviewStage: 3 },
          { reviewStage: 4 }, // 2 reviewing (3-5)
          { reviewStage: 6 },
          { reviewStage: 7 }, // 2 mastered (6-8)
        ],
      };

      const metrics = computeProgressMetrics(stats);
      assert.equal(metrics.vocabulary.totalSaved, 7);
      assert.equal(metrics.vocabulary.learning, 3);
      assert.equal(metrics.vocabulary.reviewing, 2);
      assert.equal(metrics.vocabulary.mastered, 2);
      // Retention rate: (2 reviewing + 2 mastered) / 7 = 4/7 = 57%
      assert.equal(metrics.vocabulary.retentionRate, 57);
      assert.equal(metrics.practiceAccuracy, 80); // 16/20 = 80%
    });
  });

  describe("2. Personalized Pedagogical Recommendations", () => {
    it("prioritizes due vocabulary review when spaced repetition items are pending", () => {
      const recs = generatePersonalizedRecommendations({
        dueVocabularyCount: 5,
        nextStepSlug: "shopping-money-step-02",
        nextStepTitle: "Asking for a Discount",
        quizAccuracy: 90,
        hasTriedRoleplay: false,
      });

      assert.ok(recs.length >= 2);
      assert.equal(recs[0].type, "review_vocabulary");
      assert.equal(recs[0].priority, "high");
      assert.match(recs[0].title, /5 Due Words/);
      assert.equal(recs[0].actionUrl, "/vocabulary");
    });

    it("prioritizes next sequential lesson when no vocabulary is overdue", () => {
      const recs = generatePersonalizedRecommendations({
        dueVocabularyCount: 0,
        nextStepSlug: "shopping-money-step-03",
        nextStepTitle: "Cash or Card?",
        quizAccuracy: 85,
        hasTriedRoleplay: true,
      });

      assert.equal(recs[0].type, "continue_scenario");
      assert.equal(recs[0].priority, "high");
      assert.match(recs[0].title, /Cash or Card\?/);
      assert.equal(recs[0].actionUrl, "/conversations/shopping-money-step-03");
    });

    it("recommends comprehension quiz focus when accuracy is below 75%", () => {
      const recs = generatePersonalizedRecommendations({
        lastCompletedStepSlug: "shopping-money-step-01",
        dueVocabularyCount: 0,
        quizAccuracy: 60,
        hasTriedRoleplay: true,
      });

      const quizRec = recs.find((r) => r.type === "practice_quiz");
      assert.ok(quizRec);
      assert.match(quizRec.reason, /below 75%/);
      assert.equal(quizRec.badge, "Skill Focus");
    });

    it("validates all generated recommendations against Zod schema", () => {
      const recs = generatePersonalizedRecommendations({
        dueVocabularyCount: 2,
        nextStepSlug: "test-step",
        quizAccuracy: 70,
        hasTriedRoleplay: false,
      });

      for (const rec of recs) {
        const validated = PersonalizedRecommendationSchema.safeParse(rec);
        assert.equal(validated.success, true);
        assert.ok(rec.titleBn.length > 0);
        assert.ok(rec.reasonBn.length > 0);
      }
    });
  });
});
