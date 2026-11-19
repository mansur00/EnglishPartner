import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GRAMMAR_CSS_PATH = path.resolve(__dirname, "../src/styles/grammar.css");
const GRAMMAR_TOKENS_PATH = path.resolve(__dirname, "../src/styles/grammar-tokens.css");

test("Grammar Token Mutation Test: Semantic CSS variable reactivity without hard-coded fallbacks", async (t) => {
  assert.ok(fs.existsSync(GRAMMAR_CSS_PATH), "src/styles/grammar.css must exist");
  assert.ok(fs.existsSync(GRAMMAR_TOKENS_PATH), "src/styles/grammar-tokens.css must exist");

  const grammarCss = fs.readFileSync(GRAMMAR_CSS_PATH, "utf-8");
  const grammarTokensCss = fs.readFileSync(GRAMMAR_TOKENS_PATH, "utf-8");

  await t.test("POS token mutation reactivity: --gram-pos-noun-ink", () => {
    // Assert grammar-tokens defines --gram-pos-noun-ink in :root and .dark
    assert.match(
      grammarTokensCss,
      /--gram-pos-noun-ink:\s*#[0-9a-fA-F]{6}/,
      "grammar-tokens.css must define --gram-pos-noun-ink in :root"
    );

    // Assert grammar.css references var(--gram-pos-noun-ink) for noun styling
    const nounRuleMatch = grammarCss.match(/\[data-gram-pos=["']noun["']\][^}]*color:\s*var\(--gram-pos-noun-ink\)/);
    assert.ok(
      nounRuleMatch,
      "data-gram-pos='noun' must directly consume var(--gram-pos-noun-ink)"
    );

    // Assert zero hard-coded literal color values inside .gram-token rules
    const literalColorInGramToken = grammarCss.match(/\.gram-token[^{]*\{[^}]*(?:color|background-color):\s*#(?:[0-9a-fA-F]{3,8})/);
    assert.equal(
      literalColorInGramToken,
      null,
      "No literal hex colors permitted in .gram-token selectors"
    );
  });

  await t.test("Role token mutation reactivity: --gram-role-subject-line", () => {
    assert.match(
      grammarTokensCss,
      /--gram-role-subject-line:\s*#[0-9a-fA-F]{6}/,
      "grammar-tokens.css must define --gram-role-subject-line"
    );

    const subjectRuleMatch = grammarCss.match(/\[data-gram-role=["']subject["']\][^}]*var\(--gram-role-subject-line\)/);
    assert.ok(
      subjectRuleMatch,
      "data-gram-role='subject' must directly consume var(--gram-role-subject-line)"
    );
  });

  await t.test("Tense hue token mutation reactivity: --gram-time-past", () => {
    assert.match(
      grammarTokensCss,
      /--gram-time-past:\s*#[0-9a-fA-F]{6}/,
      "grammar-tokens.css must define --gram-time-past"
    );

    const timePastMatch = grammarCss.match(/\[data-gram-time=["']past["']\][^}]*var\(--gram-time-past\)/);
    assert.ok(
      timePastMatch,
      "data-gram-time='past' must directly consume var(--gram-time-past)"
    );
  });

  await t.test("Pattern family token mutation reactivity: --gram-pattern-conditional-line", () => {
    assert.match(
      grammarTokensCss,
      /--gram-pattern-conditional-line:\s*#[0-9a-fA-F]{6}/,
      "grammar-tokens.css must define --gram-pattern-conditional-line"
    );

    const patternCondMatch = grammarCss.match(/\[data-gram-pattern\*?=["']conditional["']\][^}]*var\(--gram-pattern-conditional-line\)/);
    assert.ok(
      patternCondMatch,
      "data-gram-pattern='conditional' must directly consume var(--gram-pattern-conditional-line)"
    );
  });
});
