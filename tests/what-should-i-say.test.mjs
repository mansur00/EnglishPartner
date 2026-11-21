import test from "node:test";
import assert from "node:assert/strict";
import { resolveSayItIntent } from "../src/lib/ai/say-it.ts";
import { SayItResponseSchema } from "../src/lib/ai/say-it-schema.ts";

test("What Should I Say? — Schema S1 Intent Engine (Milestone 2C)", async (t) => {
  await t.test("1. Canonical deadline extension intent (Brief §10.1)", () => {
    const input = "I want to tell my manager that I need two more days to finish the task.";
    const result = resolveSayItIntent({ intent: input });

    // Validate Schema S1 conformance
    const validated = SayItResponseSchema.parse(result);
    assert.ok(validated.understood_intent.length > 0);
    assert.equal(validated.clarifying_question, null);
    assert.ok(validated.options.length >= 2);

    // Verify tones
    const tones = validated.options.map((o) => o.tone);
    assert.ok(tones.includes("polite_professional"));
    assert.ok(tones.includes("casual"));

    // Verify placeholders (no invented commitment dates per Spec §3.4)
    const polite = validated.options.find((o) => o.tone === "polite_professional");
    assert.ok(polite);
    assert.ok(polite.placeholders.includes("[date]"));
    assert.match(polite.english, /\[date\]/);

    // Useful phrases
    assert.ok(validated.useful_phrases.length > 0);
    assert.ok(validated.useful_phrases.length <= 5);
  });

  await t.test("2. Discount negotiation in Bangla", () => {
    const input = "দাম কি একটু কম রাখা যাবে?";
    const result = resolveSayItIntent({ intent: input });
    const validated = SayItResponseSchema.parse(result);

    assert.ok(validated.options.length >= 2);
    const casual = validated.options.find((o) => o.tone === "casual");
    assert.ok(casual);
    assert.match(casual.english.toLowerCase(), /best price|little better/);
  });

  await t.test("3. Running late with time placeholders", () => {
    const input = "I am stuck in traffic and running late for the meeting";
    const result = resolveSayItIntent({ intent: input });
    const validated = SayItResponseSchema.parse(result);

    const hasPlaceholder = validated.options.some(
      (o) => o.placeholders && o.placeholders.length > 0
    );
    assert.equal(hasPlaceholder, true);
  });

  await t.test("4. Blank or too brief intent returns clarifying question", () => {
    const result = resolveSayItIntent({ intent: "hi" });
    assert.ok(result.clarifying_question !== null);
    assert.equal(result.options.length, 0);
  });

  await t.test("5. Fallback for unindexed intents preserves user intention", () => {
    const customIntent = "I want to request a replacement laptop battery from IT";
    const result = resolveSayItIntent({ intent: customIntent });
    const validated = SayItResponseSchema.parse(result);

    assert.ok(validated.understood_intent.includes(customIntent));
    assert.ok(validated.options.length >= 2);
    assert.equal(validated.clarifying_question, null);
  });
});
