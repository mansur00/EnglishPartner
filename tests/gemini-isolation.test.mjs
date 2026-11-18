import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function findFiles(dir, extensions) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(fullPath, extensions));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

test("AUD-A11: Static check — Product code (src/) must not import Gemini provider or @google/genai", () => {
  const srcFiles = findFiles("src", [".ts", ".tsx", ".js", ".jsx"]);
  const forbiddenPatterns = [
    /@google\/genai/,
    /gemini_provider/,
    /google\.genai/,
    /from ["']@google\/genai["']/,
    /from ["'].*gemini.*["']/,
  ];

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf-8");
    for (const pattern of forbiddenPatterns) {
      assert.equal(
        pattern.test(content),
        false,
        `Forbidden import in product code: ${file} matches pattern ${pattern}`
      );
    }
  }
});

test("AUD-A11: Gemini scripts and configs use approved model gemini-3.8-flash-tts, never unapproved medium", () => {
  const voicesJsonPath = "scripts/audio/voices.json";
  assert.ok(fs.existsSync(voicesJsonPath), "voices.json must exist in scripts/audio");
  const voices = JSON.parse(fs.readFileSync(voicesJsonPath, "utf-8"));

  assert.equal(voices.approved_tts_model, "gemini-3.8-flash-tts");
  for (const voice of voices.voices) {
    assert.equal(voice.model, "gemini-3.8-flash-tts");
  }

  // Check python provider
  const providerPath = "scripts/audio/providers/gemini_provider.py";
  assert.ok(fs.existsSync(providerPath), "gemini_provider.py must exist");
  const providerContent = fs.readFileSync(providerPath, "utf-8");
  assert.ok(providerContent.includes("gemini-3.8-flash-tts"));
  assert.equal(providerContent.includes("gemini-3.8-flash-medium"), false);
});
