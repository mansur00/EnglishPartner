import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  LANGUAGES_REGISTRY,
  SUPPORTED_LOCALES,
  isRtlLanguage,
  getLanguageMeta,
  getAllLanguages,
  getAvailableLanguages,
} from "../src/lib/i18n/languages.ts";
import { t, getDictionary, isRtlLocale } from "../src/lib/i18n/index.ts";

function flattenKeys(obj, prefix = "") {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      keys = keys.concat(flattenKeys(v, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

describe("Milestone 4B: Multi-Language Strategy & Translation Parity", () => {
  const enPath = path.resolve("messages/en.json");
  const bnPath = path.resolve("messages/bn.json");
  const hiPath = path.resolve("messages/hi.json");

  const enMessages = JSON.parse(fs.readFileSync(enPath, "utf-8"));
  const bnMessages = JSON.parse(fs.readFileSync(bnPath, "utf-8"));
  const hiMessages = JSON.parse(fs.readFileSync(hiPath, "utf-8"));

  const enKeys = flattenKeys(enMessages);
  const bnKeys = flattenKeys(bnMessages);
  const hiKeys = flattenKeys(hiMessages);

  it("should have 100% key parity across EN, BN, and HI messages", () => {
    assert.equal(enKeys.length, 296, "Expected 296 English message keys");
    assert.equal(bnKeys.length, 296, "Expected 296 Bengali message keys");
    assert.equal(hiKeys.length, 296, "Expected 296 Hindi message keys");

    const missingInBn = enKeys.filter((k) => !bnKeys.includes(k));
    const missingInHi = enKeys.filter((k) => !hiKeys.includes(k));

    assert.deepEqual(missingInBn, [], "No keys should be missing in Bengali translation");
    assert.deepEqual(missingInHi, [], "No keys should be missing in Hindi translation");
  });

  it("should ensure all translation values are non-empty strings", () => {
    for (const key of hiKeys) {
      const parts = key.split(".");
      let val = hiMessages;
      for (const p of parts) {
        val = val[p];
      }
      assert.equal(typeof val, "string", `Key ${key} in hi.json must be a string`);
      assert.ok(val.trim().length > 0, `Key ${key} in hi.json must not be empty`);
    }
  });

  it("should enforce supported locales as en, bn, and hi", () => {
    assert.deepEqual(SUPPORTED_LOCALES, ["en", "bn", "hi"]);
    const available = getAvailableLanguages();
    assert.equal(available.length, 3);
    assert.ok(available.some((l) => l.code === "en"));
    assert.ok(available.some((l) => l.code === "bn"));
    assert.ok(available.some((l) => l.code === "hi"));
  });

  it("should correctly identify RTL and LTR scripts", () => {
    // RTL languages
    assert.equal(isRtlLanguage("ur"), true, "Urdu must be identified as RTL");
    assert.equal(isRtlLanguage("ar"), true, "Arabic must be identified as RTL");
    assert.equal(isRtlLocale("ur"), true);
    assert.equal(isRtlLocale("ar"), true);

    // LTR languages
    assert.equal(isRtlLanguage("en"), false, "English must be identified as LTR");
    assert.equal(isRtlLanguage("bn"), false, "Bengali must be identified as LTR");
    assert.equal(isRtlLanguage("hi"), false, "Hindi must be identified as LTR");
    assert.equal(isRtlLocale("en"), false);
    assert.equal(isRtlLocale("bn"), false);
    assert.equal(isRtlLocale("hi"), false);
  });

  it("should validate language metadata in LANGUAGES_REGISTRY", () => {
    assert.ok(LANGUAGES_REGISTRY.hi, "Hindi must be registered in LANGUAGES_REGISTRY");
    const metaHi = getLanguageMeta("hi");
    assert.ok(metaHi);
    assert.equal(metaHi.name, "Hindi");
    assert.equal(metaHi.nativeName, "हिन्दी");
    assert.equal(metaHi.script, "Devanagari");
    assert.equal(metaHi.status, "beta");

    const metaUr = getLanguageMeta("ur");
    assert.ok(metaUr);
    assert.equal(metaUr.direction, "rtl");
    assert.equal(metaUr.status, "planned");

    const all = getAllLanguages();
    assert.equal(all.length, 5, "Registry contains 5 tracked languages");
  });

  it("should resolve translations correctly across all supported locales with fallback", () => {
    // Known key
    assert.equal(t("nav.dashboard", "en"), "Dashboard");
    assert.equal(t("nav.dashboard", "bn"), "ড্যাশবোর্ড");
    assert.equal(t("nav.dashboard", "hi"), "डैशबोर्ड");

    // Fallback on invalid key returns key
    assert.equal(t("non.existent.key", "hi"), "non.existent.key");

    // Dictionary helper check
    const enDict = getDictionary("en");
    assert.ok(enDict.nav);
    const hiDict = getDictionary("hi");
    assert.ok(hiDict.nav);
  });
});
