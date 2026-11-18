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
    } else if (extensions.some((ext) => file.endsWith(ext))) {
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

test("AUD-A11: Gemini code is gated on A-11 signature and isolated in _pending_a11", () => {
  // 1. Confirm active provider directory does NOT exist
  assert.equal(
    fs.existsSync("scripts/audio/providers/gemini_provider.py"),
    false,
    "Active gemini_provider.py must not exist before owner signs A-11"
  );

  // 2. Confirm pending directory exists with README
  const pendingDir = "scripts/audio/_pending_a11";
  assert.ok(fs.existsSync(pendingDir), "_pending_a11 directory must exist");
  assert.ok(fs.existsSync(path.join(pendingDir, "README.md")), "README must exist in _pending_a11");
  const readme = fs.readFileSync(path.join(pendingDir, "README.md"), "utf-8");
  assert.ok(readme.includes("Waiting for owner signature on A-11"));

  // 3. Confirm pending model is gemini-3.8-flash-tts
  const voicesJsonPath = path.join(pendingDir, "voices.json");
  if (fs.existsSync(voicesJsonPath)) {
    const voices = JSON.parse(fs.readFileSync(voicesJsonPath, "utf-8"));
    assert.equal(voices.approved_tts_model, "gemini-3.8-flash-tts");
  }
});
