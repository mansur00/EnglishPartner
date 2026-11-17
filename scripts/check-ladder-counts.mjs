#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoContentPath = path.resolve(__dirname, "../content/ECP_Conversations_Shopping_Money.md");
const parentContentPath = path.resolve(__dirname, "../../Conversation/ECP_Conversations_Shopping_Money.md");
const markdownPath = fs.existsSync(repoContentPath) ? repoContentPath : parentContentPath;
if (!fs.existsSync(markdownPath)) {
  console.error(`Cannot find markdown file at ${markdownPath}`);
  process.exit(1);
}

const content = fs.readFileSync(markdownPath, "utf-8");
const rawSteps = content.split(/^### Step /m).slice(1);
const targets = [5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 12, 14, 16, 18, 20, 22, 25, 30, 55];

if (rawSteps.length !== 20) {
  console.error(`Expected 20 steps, found ${rawSteps.length}`);
  process.exit(1);
}

let hasError = false;

rawSteps.forEach((s, idx) => {
  const stepNum = idx + 1;
  const target = targets[idx];
  const speakers = s.match(/^\*\*[^*]+:\*\*/gm) || [];
  const quotes = s.match(/^> /gm) || [];
  const lineMatch = s.match(/- Lines:\s*(\d+)/);
  const declared = lineMatch ? parseInt(lineMatch[1], 10) : null;

  const valid = (target === declared && declared === speakers.length && speakers.length === quotes.length);
  if (!valid) {
    hasError = true;
    console.error(`❌ Step ${stepNum.toString().padStart(2, "0")}: target=${target}, declared=${declared}, speakers=${speakers.length}, quotes=${quotes.length}`);
  } else {
    console.log(`✓ Step ${stepNum.toString().padStart(2, "0")}: ${target} lines (speakers=${speakers.length}, quotes=${quotes.length})`);
  }
});

if (hasError) {
  console.error("\nLadder line count check FAILED.");
  process.exit(1);
} else {
  console.log("\n✓ All 20 ladder steps strictly conform to exact ladder counts.");
}
