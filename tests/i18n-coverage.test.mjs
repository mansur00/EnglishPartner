import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enPath = path.resolve(__dirname, "../messages/en.json");
const bnPath = path.resolve(__dirname, "../messages/bn.json");

function flattenKeys(obj, prefix = "") {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      keys = keys.concat(flattenKeys(v, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

test("AUD-KI-05: Every message key in en.json must exist in bn.json (100% coverage)", () => {
  assert.ok(fs.existsSync(enPath), "messages/en.json must exist");
  assert.ok(fs.existsSync(bnPath), "messages/bn.json must exist");

  const enData = JSON.parse(fs.readFileSync(enPath, "utf-8"));
  const bnData = JSON.parse(fs.readFileSync(bnPath, "utf-8"));

  const enKeys = flattenKeys(enData);
  const bnKeys = new Set(flattenKeys(bnData));

  const missingInBn = enKeys.filter((k) => !bnKeys.has(k));

  assert.equal(
    missingInBn.length,
    0,
    `Missing keys in messages/bn.json: ${missingInBn.join(", ")}`
  );

  console.log(`✓ i18n coverage verified: ${enKeys.length}/${enKeys.length} keys present across en and bn.`);
});
