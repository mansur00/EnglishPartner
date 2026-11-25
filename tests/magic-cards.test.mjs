import { test } from "node:test";
import assert from "node:assert/strict";
import { MAGIC_CARDS, MAGIC_CARD_CATEGORIES } from "../src/content/seed/magic-cards.ts";

test("Vocabulary Magic Cards: exactly 40 cards with 20-40 words each", () => {
  assert.equal(MAGIC_CARDS.length, 40, "Must contain exactly 40 Magic Cards");
  assert.ok(MAGIC_CARD_CATEGORIES.length >= 6, "Must have category filters");

  const seenSlugs = new Set();
  for (const deck of MAGIC_CARDS) {
    assert.ok(!seenSlugs.has(deck.slug), `Duplicate deck slug: ${deck.slug}`);
    seenSlugs.add(deck.slug);
    assert.ok(deck.title.length > 3, `Deck ${deck.id} must have a title`);
    assert.ok(deck.emoji.length > 0, `Deck ${deck.id} must have an emoji`);
    assert.ok(
      deck.words.length >= 20 && deck.words.length <= 40,
      `Deck ${deck.id} (${deck.title}) has ${deck.words.length} words, expected 20-40`
    );

    for (const w of deck.words) {
      assert.ok(w.word.trim().length > 0, `Word missing in ${deck.id}`);
      assert.ok(w.meaning.trim().length > 0, `Meaning missing for ${w.word}`);
      assert.ok(w.example.trim().length > 0, `Example missing for ${w.word}`);
      assert.ok(w.ipa.trim().length > 0, `IPA missing for ${w.word}`);
    }
  }
});
