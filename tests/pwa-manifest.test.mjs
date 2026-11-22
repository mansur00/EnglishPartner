import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import manifest from "../src/app/manifest.ts";

test("Milestone 4C: manifest() returns valid PWA configuration", () => {
  const pwaManifest = manifest();

  assert.equal(pwaManifest.name, "EnglishPartner — English Learning Platform");
  assert.equal(pwaManifest.short_name, "EnglishPartner");
  assert.equal(pwaManifest.start_url, "/dashboard");
  assert.equal(pwaManifest.display, "standalone");
  assert.equal(pwaManifest.theme_color, "#4A1D6E");
  assert.equal(pwaManifest.background_color, "#FAF7FD");
  assert.ok(pwaManifest.icons && pwaManifest.icons.length > 0);
});

test("Milestone 4C: public/sw.js service worker file exists and contains offline cache strategy", () => {
  const swPath = path.resolve("public/sw.js");
  assert.ok(fs.existsSync(swPath), "public/sw.js must exist");

  const swContent = fs.readFileSync(swPath, "utf-8");
  assert.ok(swContent.includes("CACHE_NAME"));
  assert.ok(swContent.includes("caches.open"));
  assert.ok(swContent.includes("fetch(event.request)"));
});
