import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  resolveSpeakerPerspective,
  isLearnerLine,
  evaluateLearnerTurn,
} from "../src/lib/practice/hide-speaker.ts";

describe("Milestone 2C: Hide Speaker (Roleplay) Practice Mode", () => {
  const mockSpeakers = [
    {
      id: "spk-1",
      name: "Rafi",
      nameBn: "রফি",
      role: "Shopkeeper",
      roleBn: "দোকানদার",
      avatarChar: "R",
      colorScheme: "brand",
    },
    {
      id: "spk-2",
      name: "Nabila",
      nameBn: "নাবিলা",
      role: "Customer",
      roleBn: "ক্রেতা",
      avatarChar: "N",
      colorScheme: "accent",
    },
  ];

  describe("1. Speaker Perspective Resolution", () => {
    it("correctly identifies learner and partner speakers", () => {
      const perspective = resolveSpeakerPerspective(mockSpeakers, "spk-2");
      assert.equal(perspective.learnerSpeaker.id, "spk-2");
      assert.equal(perspective.partnerSpeaker.id, "spk-1");
    });

    it("falls back gracefully when selected ID is not found", () => {
      const perspective = resolveSpeakerPerspective(mockSpeakers, "non-existent");
      assert.ok(perspective.learnerSpeaker);
      assert.ok(perspective.partnerSpeaker);
    });
  });

  describe("2. Turn Assignment", () => {
    it("distinguishes learner turns from partner turns accurately", () => {
      const learnerTurn = {
        id: "line-1",
        sequenceNumber: 1,
        speakerId: "spk-2",
        speakerName: "Nabila",
        speakerRole: "Customer",
        englishText: "How much is this bag?",
        translationBn: "এই ব্যাগটার দাম কত?",
      };
      const partnerTurn = {
        id: "line-2",
        sequenceNumber: 2,
        speakerId: "spk-1",
        speakerName: "Rafi",
        speakerRole: "Shopkeeper",
        englishText: "It is five hundred taka.",
        translationBn: "এটির দাম পাঁচশত টাকা।",
      };

      assert.equal(isLearnerLine(learnerTurn, "spk-2"), true);
      assert.equal(isLearnerLine(partnerTurn, "spk-2"), false);
    });
  });

  describe("3. Learner Turn Evaluation", () => {
    it("gives 100% score for exact normalized match", () => {
      const res = evaluateLearnerTurn(
        "How much is this bag?",
        "how much is this bag"
      );
      assert.equal(res.isMatch, true);
      assert.equal(res.score, 100);
    });

    it("evaluates partial token overlap accurately", () => {
      const res = evaluateLearnerTurn(
        "how much is the bag",
        "how much is this bag"
      );
      assert.equal(res.isMatch, true);
      assert.ok(res.score >= 70);
    });

    it("rejects dissimilar input", () => {
      const res = evaluateLearnerTurn("I like this color", "how much is this bag");
      assert.equal(res.isMatch, false);
      assert.ok(res.score < 50);
    });
  });
});
