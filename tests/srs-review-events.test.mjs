import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  recordReviewEvent,
} from "../src/lib/srs/review-service.ts";
import {
  getPendingLocalReviewEvents,
  clearPendingLocalReviewEvents,
} from "../src/lib/srs/review-client.ts";
import {
  formatChallengeDate,
  pickCandidateScenario,
  getOrCreateDailyChallenge,
} from "../src/lib/challenges/daily-challenge-service.ts";
import {
  reviewEvents,
  dailyChallenges,
  contentAuditLogs,
  srsRatingEnum,
  challengeStatusEnum,
} from "../src/lib/db/schema.ts";

describe("Milestone 2E Backend: Review Events & Daily Challenge Logging (KI-08)", () => {
  describe("1. Schema Definition & Enum Invariants", () => {
    it("exports reviewEvents, dailyChallenges, and contentAuditLogs tables", () => {
      assert.ok(reviewEvents, "reviewEvents table must be defined");
      assert.ok(dailyChallenges, "dailyChallenges table must be defined");
      assert.ok(contentAuditLogs, "contentAuditLogs table must be defined");
    });

    it("has exact required columns on reviewEvents per Spec §6.4", () => {
      const cols = Object.keys(reviewEvents);
      assert.ok(cols.includes("id"), "must have id column");
      assert.ok(cols.includes("userId"), "must have userId column");
      assert.ok(cols.includes("userVocabularyId"), "must have userVocabularyId column");
      assert.ok(cols.includes("rating"), "must have rating column");
      assert.ok(cols.includes("reviewedAt"), "must have reviewedAt column");
      assert.ok(cols.includes("reviewStage"), "must have reviewStage column");
      assert.ok(cols.includes("intervalDays"), "must have intervalDays column");
      assert.ok(cols.includes("easeFactor"), "must have easeFactor column");
    });

    it("has exact required columns on dailyChallenges per Spec §7", () => {
      const cols = Object.keys(dailyChallenges);
      assert.ok(cols.includes("id"), "must have id column");
      assert.ok(cols.includes("userId"), "must have userId column");
      assert.ok(cols.includes("challengeDate"), "must have challengeDate column");
      assert.ok(cols.includes("conversationVersionId"), "must have conversationVersionId column");
      assert.ok(cols.includes("scenarioSlug"), "must have scenarioSlug column");
      assert.ok(cols.includes("status"), "must have status column");
      assert.ok(cols.includes("completedAt"), "must have completedAt column");
    });

    it("defines approved SRS rating enum values strictly", () => {
      assert.deepEqual(srsRatingEnum.enumValues, ["again", "hard", "good", "easy"]);
    });

    it("defines approved challenge status enum values strictly", () => {
      assert.deepEqual(challengeStatusEnum.enumValues, [
        "assigned",
        "in_progress",
        "completed",
        "expired",
      ]);
    });
  });

  describe("2. Review Event Service Validation", () => {
    it("accepts valid SM-2 ratings ('again', 'hard', 'good', 'easy')", async () => {
      for (const rating of ["again", "hard", "good", "easy"]) {
        const result = await recordReviewEvent({
          lemma: "practice",
          rating,
          reviewStage: 1,
          intervalDays: 1,
          easeFactor: "2.50",
        });
        assert.equal(result.success, true);
        assert.ok(result.source === "db" || result.source === "local_queue");
      }
    });

    it("accepts numeric easeFactor without error", async () => {
      const result = await recordReviewEvent({
        lemma: "fluent",
        rating: "good",
        reviewStage: 2,
        intervalDays: 6,
        easeFactor: 2.6,
      });
      assert.equal(result.success, true);
    });

    it("rejects invalid ratings with clear error message", async () => {
      // @ts-expect-error testing invalid runtime rating
      const result = await recordReviewEvent({
        lemma: "practice",
        rating: "invalid_rating",
      });
      assert.equal(result.success, false);
      assert.match(result.error, /Invalid rating/);
    });

    it("handles pending local queue buffer helpers safely", () => {
      assert.deepEqual(getPendingLocalReviewEvents(), []);
      clearPendingLocalReviewEvents();
    });
  });

  describe("3. Daily Challenge Selection Rules (Spec §7)", () => {
    it("formats challenge date as ISO YYYY-MM-DD", () => {
      const fixedDate = new Date("2026-11-21T10:00:00Z");
      assert.equal(formatChallengeDate(fixedDate), "2026-11-21");
    });

    it("avoids scenarios seen in the last 7 days", () => {
      const recentSlugs = ["asking-price-product-details", "asking-bus-timings-routes"];
      const scenario = pickCandidateScenario([], recentSlugs, "A1");
      assert.ok(scenario);
      assert.ok(
        !recentSlugs.includes(scenario.slug),
        `Candidate ${scenario.slug} must not be in recent slugs`
      );
    });

    it("prioritizes unfinished scenarios over completed ones", () => {
      const completedSlugs = ["asking-price-product-details"];
      const scenario = pickCandidateScenario(completedSlugs, [], "A1");
      assert.ok(scenario);
      assert.notEqual(scenario.slug, "asking-price-product-details");
    });

    it("respects user preferred CEFR level if available", () => {
      const scenarioA1 = pickCandidateScenario([], [], "A1");
      assert.equal(scenarioA1.level.toUpperCase(), "A1");
    });

    it("creates challenge object with assigned status and no penalty copy", async () => {
      const challenge = await getOrCreateDailyChallenge("test-learner-1", "2026-11-21", "A1");
      assert.equal(challenge.userId, "test-learner-1");
      assert.equal(challenge.challengeDate, "2026-11-21");
      assert.equal(challenge.status, "assigned");
      assert.ok(challenge.scenarioTitle, "Must have scenario title");
      assert.equal(challenge.completedAt, null);
    });
  });
});
