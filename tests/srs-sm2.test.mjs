import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateSM2,
  createDefaultSRSState,
  getDueReviewItems,
  ratingToQuality,
} from "../src/lib/srs/sm2.ts";

test("SM-2: ratingToQuality correctly maps learner ratings to 0-5 scale", () => {
  assert.equal(ratingToQuality("again"), 0);
  assert.equal(ratingToQuality("hard"), 3);
  assert.equal(ratingToQuality("good"), 4);
  assert.equal(ratingToQuality("easy"), 5);
});

test("SM-2: First success (stage 0 -> 1) yields interval of 1 day", () => {
  const base = createDefaultSRSState(new Date("2026-11-21T10:00:00Z"));
  const res = calculateSM2({
    reviewStage: base.reviewStage,
    easeFactor: base.easeFactor,
    intervalDays: base.intervalDays,
    lapseCount: base.lapseCount,
    rating: "good",
    now: new Date("2026-11-21T10:00:00Z"),
  });

  assert.equal(res.reviewStage, 1);
  assert.equal(res.intervalDays, 1);
  assert.equal(res.lapseCount, 0);
  assert.equal(res.nextReviewAt, new Date("2026-11-22T10:00:00Z").toISOString());
});

test("SM-2: Second success (stage 1 -> 2) yields interval of 6 days", () => {
  const res = calculateSM2({
    reviewStage: 1,
    easeFactor: 2.50,
    intervalDays: 1,
    lapseCount: 0,
    rating: "good",
    now: new Date("2026-11-21T10:00:00Z"),
  });

  assert.equal(res.reviewStage, 2);
  assert.equal(res.intervalDays, 6);
  assert.equal(res.nextReviewAt, new Date("2026-11-27T10:00:00Z").toISOString());
});

test("SM-2: Subsequent success uses previous_interval * ease_factor", () => {
  const res = calculateSM2({
    reviewStage: 2,
    easeFactor: 2.50,
    intervalDays: 6,
    lapseCount: 0,
    rating: "good",
    now: new Date("2026-11-21T10:00:00Z"),
  });

  assert.equal(res.reviewStage, 3);
  // Math.round(6 * 2.50) = 15
  assert.equal(res.intervalDays, 15);
  assert.equal(res.nextReviewAt, new Date("2026-12-06T10:00:00Z").toISOString());
});

test("SM-2: Maximum stage is capped at 8", () => {
  const res = calculateSM2({
    reviewStage: 8,
    easeFactor: 2.50,
    intervalDays: 60,
    lapseCount: 0,
    rating: "easy",
    now: new Date("2026-11-21T10:00:00Z"),
  });

  assert.equal(res.reviewStage, 8);
  assert.ok(res.intervalDays > 60);
});

test("SM-2: Failure reset (rating 'again') resets stage to 0, interval to 1, increments lapseCount", () => {
  const res = calculateSM2({
    reviewStage: 4,
    easeFactor: 2.50,
    intervalDays: 30,
    lapseCount: 1,
    rating: "again",
    now: new Date("2026-11-21T10:00:00Z"),
  });

  assert.equal(res.reviewStage, 0);
  assert.equal(res.intervalDays, 1);
  assert.equal(res.lapseCount, 2);
  assert.equal(res.nextReviewAt, new Date("2026-11-22T10:00:00Z").toISOString());
});

test("SM-2: Ease factor is floored at 1.30 strictly", () => {
  let ease = 1.35;
  for (let i = 0; i < 5; i++) {
    const res = calculateSM2({
      reviewStage: 1,
      easeFactor: ease,
      intervalDays: 1,
      lapseCount: 0,
      rating: "again",
    });
    ease = res.easeFactor;
  }

  assert.equal(ease, 1.30);
});

test("SM-2 Queue: Filters items where nextReviewAt <= now and orders correctly", () => {
  const now = new Date("2026-11-21T12:00:00Z");

  const items = [
    {
      lemma: "future",
      reviewStage: 1,
      easeFactor: 2.5,
      intervalDays: 2,
      nextReviewAt: "2026-11-23T12:00:00Z", // Future: not due
      lapseCount: 0,
    },
    {
      lemma: "overdue_older",
      reviewStage: 2,
      easeFactor: 2.5,
      intervalDays: 1,
      nextReviewAt: "2026-11-19T10:00:00Z", // Due earlier
      lapseCount: 0,
    },
    {
      lemma: "due_today_stage2",
      reviewStage: 2,
      easeFactor: 2.5,
      intervalDays: 1,
      nextReviewAt: "2026-11-21T08:00:00Z", // Due today, stage 2
      lapseCount: 0,
    },
    {
      lemma: "due_today_stage0",
      reviewStage: 0,
      easeFactor: 2.5,
      intervalDays: 1,
      nextReviewAt: "2026-11-21T08:00:00Z", // Due today, same time, stage 0 (should sort before stage 2)
      lapseCount: 0,
    },
  ];

  const due = getDueReviewItems(items, now);

  assert.equal(due.length, 3);
  assert.equal(due[0].lemma, "overdue_older");
  assert.equal(due[1].lemma, "due_today_stage0");
  assert.equal(due[2].lemma, "due_today_stage2");
});

test("SM-2 Queue: Returns empty array when no items are due", () => {
  const now = new Date("2026-11-21T12:00:00Z");
  const items = [
    {
      lemma: "future",
      reviewStage: 1,
      easeFactor: 2.5,
      intervalDays: 2,
      nextReviewAt: "2026-11-25T12:00:00Z",
      lapseCount: 0,
    },
  ];

  const due = getDueReviewItems(items, now);
  assert.deepEqual(due, []);
});
