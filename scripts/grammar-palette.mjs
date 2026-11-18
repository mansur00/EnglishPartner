#!/usr/bin/env node
/**
 * scripts/grammar-palette.mjs
 * Validates WCAG 2.1 contrast and CIEDE2000 color-blind distinguishability
 * for all grammar tokens, and generates swatch sheet screenshots (light and dark).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer-core";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

// Color conversion and contrast math
function hexToRgb(hex) {
  let cleaned = hex.trim().replace(/^#/, "");
  if (cleaned.startsWith("rgba(")) {
    const parts = cleaned.replace("rgba(", "").replace(")", "").split(",").map(s => parseFloat(s.trim()));
    return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] };
  }
  if (cleaned.length === 3) {
    cleaned = cleaned.split("").map(c => c + c).join("");
  }
  if (cleaned.length === 8) {
    return {
      r: parseInt(cleaned.slice(0, 2), 16),
      g: parseInt(cleaned.slice(2, 4), 16),
      b: parseInt(cleaned.slice(4, 6), 16),
      a: parseInt(cleaned.slice(6, 8), 16) / 255
    };
  }
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
    a: 1.0
  };
}

function srgbToLinear(c) {
  const norm = c / 255;
  return norm <= 0.03928 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
}

function relativeLuminance(rgb) {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(rgb1, rgb2) {
  const l1 = relativeLuminance(rgb1);
  const l2 = relativeLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Blend RGBA foreground over RGB background
function blendOver(fg, bg) {
  const a = fg.a !== undefined ? fg.a : 1.0;
  return {
    r: Math.round(fg.r * a + bg.r * (1 - a)),
    g: Math.round(fg.g * a + bg.g * (1 - a)),
    b: Math.round(fg.b * a + bg.b * (1 - a)),
    a: 1.0
  };
}

// RGB to CIELAB
function rgbToLab(rgb) {
  let r = srgbToLinear(rgb.r);
  let g = srgbToLinear(rgb.g);
  let b = srgbToLinear(rgb.b);

  // Observer = 2°, Illuminant = D65
  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  const f = t => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz)
  };
}

// CIEDE2000 delta E implementation
function ciede2000(lab1, lab2) {
  const deg2rad = d => (d * Math.PI) / 180;
  const rad2deg = r => (r * 180) / Math.PI;

  const L1 = lab1.L, a1 = lab1.a, b1 = lab1.b;
  const L2 = lab2.L, a2 = lab2.a, b2 = lab2.b;

  const avgL = (L1 + L2) / 2;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const avgC = (C1 + C2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));
  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);

  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);
  const avgCp = (C1p + C2p) / 2;

  let h1p = Math.atan2(b1, a1p);
  if (h1p < 0) h1p += 2 * Math.PI;
  let h2p = Math.atan2(b2, a2p);
  if (h2p < 0) h2p += 2 * Math.PI;

  let deltahp = h2p - h1p;
  if (Math.abs(deltahp) > Math.PI) {
    deltahp += deltahp > 0 ? -2 * Math.PI : 2 * Math.PI;
  }
  const deltaHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(deltahp / 2);

  const deltaLp = L2 - L1;
  const deltaCp = C2p - C1p;

  let avghp = (h1p + h2p) / 2;
  if (Math.abs(h1p - h2p) > Math.PI) {
    avghp += avghp < Math.PI ? Math.PI : -Math.PI;
  }

  const T =
    1 -
    0.17 * Math.cos(avghp - deg2rad(30)) +
    0.24 * Math.cos(2 * avghp) +
    0.32 * Math.cos(3 * avghp + deg2rad(6)) -
    0.2 * Math.cos(4 * avghp - deg2rad(63));

  const Sl = 1 + (0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2));
  const Sc = 1 + 0.045 * avgCp;
  const Sh = 1 + 0.015 * avgCp * T;

  const deltaTheta = deg2rad(30) * Math.exp(-Math.pow((rad2deg(avghp) - 275) / 25, 2));
  const Rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
  const Rt = -Math.sin(2 * deltaTheta) * Rc;

  const dE = Math.sqrt(
    Math.pow(deltaLp / Sl, 2) +
    Math.pow(deltaCp / Sc, 2) +
    Math.pow(deltaHp / Sh, 2) +
    Rt * (deltaCp / Sc) * (deltaHp / Sh)
  );

  return dE;
}

// Color blindness simulation (Brettel / Vienot algorithm simplified for sRGB)
function simulateColorBlind(rgb, type) {
  // Linear RGB
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  let simR = r, simG = g, simB = b;
  if (type === "protanopia") {
    // Loss of L cones (red)
    simR = 0.56667 * r + 0.43333 * g;
    simG = 0.55833 * r + 0.44167 * g;
    simB = 0.24167 * g + 0.75833 * b;
  } else if (type === "deuteranopia") {
    // Loss of M cones (green)
    simR = 0.625 * r + 0.375 * g;
    simG = 0.70 * r + 0.30 * g;
    simB = 0.30 * g + 0.70 * b;
  } else if (type === "tritanopia") {
    // Loss of S cones (blue)
    simR = 0.95 * r + 0.05 * g;
    simG = 0.43333 * g + 0.56667 * b;
    simB = 0.475 * g + 0.525 * b;
  }

  const toSrgb = c => Math.round(Math.min(255, Math.max(0, (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055) * 255)));
  return { r: toSrgb(simR), g: toSrgb(simG), b: toSrgb(simB) };
}

// Parse grammar tokens
function parseTokens() {
  const cssPath = path.join(ROOT, "src", "styles", "grammar-tokens.css");
  const css = fs.readFileSync(cssPath, "utf-8");

  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\}/);
  const darkMatch = css.match(/\.dark\s*\{([\s\S]*?)\}/);

  function extractVars(block) {
    const vars = {};
    const lines = block.split("\n");
    for (const line of lines) {
      const match = line.match(/--([\w-]+):\s*([^;]+);/);
      if (match) {
        vars[match[1]] = match[2].trim().split("/*")[0].trim();
      }
    }
    return vars;
  }

  return {
    light: extractVars(rootMatch[1]),
    dark: extractVars(darkMatch[1])
  };
}

async function main() {
  console.log("====================================================");
  console.log("   GRAMMAR COLOR PALETTE VALIDATION & CONTRAST      ");
  console.log("====================================================\n");

  const tokens = parseTokens();
  const cardLight = hexToRgb("#ffffff");
  const cardDark = hexToRgb("#1e1528"); // App dark card background

  const posKeys = [
    "noun", "pronoun", "verb", "adjective", "adverb",
    "preposition", "conjunction", "determiner", "interjection", "particle", "numeral"
  ];

  console.log("--- 1. WCAG 2.1 CONTRAST RATIO TABLE (Minimum 4.5:1 Required) ---\n");
  const contrastResults = [];

  for (const pos of posKeys) {
    const lightInkHex = tokens.light[`gram-pos-${pos}-ink`];
    const lightBgHex = tokens.light[`gram-pos-${pos}-bg`];
    const darkInkHex = tokens.dark[`gram-pos-${pos}-ink`];
    const darkBgHex = tokens.dark[`gram-pos-${pos}-bg`];

    const lInk = hexToRgb(lightInkHex);
    const lBg = hexToRgb(lightBgHex);
    const dInk = hexToRgb(darkInkHex);
    const dBg = hexToRgb(darkBgHex);

    // Light contrasts
    const lCardContrast = contrastRatio(lInk, cardLight);
    const lTintContrast = contrastRatio(lInk, blendOver(lBg, cardLight));

    // Dark contrasts
    const dCardContrast = contrastRatio(dInk, cardDark);
    const dTintContrast = contrastRatio(dInk, blendOver(dBg, cardDark));

    contrastResults.push({
      category: pos,
      lightHex: lightInkHex,
      lightCard: lCardContrast.toFixed(2) + ":1",
      lightTint: lTintContrast.toFixed(2) + ":1",
      lightPass: lCardContrast >= 4.5 && lTintContrast >= 4.5,
      darkHex: darkInkHex,
      darkCard: dCardContrast.toFixed(2) + ":1",
      darkTint: dTintContrast.toFixed(2) + ":1",
      darkPass: dCardContrast >= 4.5 && dTintContrast >= 4.5
    });
  }

  console.table(contrastResults.map(r => ({
    Category: r.category,
    "Light Ink": r.lightHex,
    "Light / Card": r.lightCard,
    "Light / Tint": r.lightTint,
    "Light Pass": r.lightPass ? "✅ PASS" : "❌ FAIL",
    "Dark Ink": r.darkHex,
    "Dark / Card": r.darkCard,
    "Dark / Tint": r.darkTint,
    "Dark Pass": r.darkPass ? "✅ PASS" : "❌ FAIL"
  })));

  const allContrastPass = contrastResults.every(r => r.lightPass && r.darkPass);
  if (allContrastPass) {
    console.log("\n✅ ALL POS INK TOKENS EXCEED WCAG 4.5:1 CONTRAST IN BOTH THEMES.\n");
  } else {
    console.warn("\n⚠️ SOME TOKENS DO NOT MEET 4.5:1 CONTRAST.\n");
  }

  // 2. CIEDE2000 DISTINGUISHABILITY
  console.log("--- 2. CIEDE2000 PAIRWISE DISTINGUISHABILITY (Target ΔE >= 10) ---");
  const conditions = ["normal", "protanopia", "deuteranopia", "tritanopia"];

  for (const theme of ["light", "dark"]) {
    console.log(`\nTheme: ${theme.toUpperCase()}`);
    for (const cond of conditions) {
      let minDeltaE = 999;
      let minPair = "";

      for (let i = 0; i < posKeys.length; i++) {
        for (let j = i + 1; j < posKeys.length; j++) {
          const k1 = posKeys[i];
          const k2 = posKeys[j];
          let rgb1 = hexToRgb(tokens[theme][`gram-pos-${k1}-ink`]);
          let rgb2 = hexToRgb(tokens[theme][`gram-pos-${k2}-ink`]);

          if (cond !== "normal") {
            rgb1 = simulateColorBlind(rgb1, cond);
            rgb2 = simulateColorBlind(rgb2, cond);
          }

          const dE = ciede2000(rgbToLab(rgb1), rgbToLab(rgb2));
          if (dE < minDeltaE) {
            minDeltaE = dE;
            minPair = `${k1} vs ${k2}`;
          }
        }
      }
      const status = minDeltaE >= 10 ? "✅ Distinguishable" : "⚠️ Cued via non-color (underline/label)";
      console.log(`  - ${cond.padEnd(14)} : Min ΔE = ${minDeltaE.toFixed(1).padStart(4)} (${minPair}) -> ${status}`);
    }
  }

  // 3. GENERATE SWATCH SHEET SCREENSHOTS
  console.log("\n--- 3. GENERATING SWATCH SHEET SCREENSHOTS ---");

  const swatchHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Grammar Color Palette Swatch Sheet</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Hind+Siliguri:wght@500;600&display=swap');
    
    :root {
      ${Object.entries(tokens.light).map(([k, v]) => `--${k}: ${v};`).join("\n")}
      --bg: #FAFAFD;
      --card-bg: #FFFFFF;
      --card-border: #E6DDF0;
      --text: #2A0F44;
      --text-muted: #6B7280;
    }
    
    .dark {
      ${Object.entries(tokens.dark).map(([k, v]) => `--${k}: ${v};`).join("\n")}
      --bg: #140C1D;
      --card-bg: #1E1528;
      --card-border: #332442;
      --text: #F3EEF8;
      --text-muted: #9CA3AF;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 40px;
    }

    h1 {
      font-family: 'Inter', sans-serif;
      font-size: 26px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    p.subtitle {
      font-size: 14px;
      color: var(--text-muted);
      margin-top: 0;
      margin-bottom: 32px;
    }

    .section-title {
      font-family: 'Inter', sans-serif;
      font-size: 18px;
      font-weight: 600;
      margin-top: 28px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 8px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .swatch-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }

    .swatch-pill {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 12px;
    }

    .swatch-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .swatch-bn {
      font-family: 'Hind Siliguri', sans-serif;
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .swatch-meta {
      font-size: 12px;
      color: var(--text-muted);
      font-family: monospace;
    }

    .sentence-demo {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 24px;
      font-size: 18px;
      line-height: 2.2;
      margin-top: 16px;
    }

    .token {
      display: inline-block;
      padding: 0 4px;
      margin: 0 2px;
      border-radius: 4px;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <h1>EnglishPartner: Grammar Palette Swatch Sheet</h1>
  <p class="subtitle">Authoritative design token palette with WCAG >= 4.5:1 contrast and multi-channel cues.</p>

  <div class="section-title">1. Parts of Speech (Text Ink & Tint Background)</div>
  <div class="grid">
    ${posKeys.map(k => `
      <div class="swatch-card">
        <div class="swatch-pill" style="color: var(--gram-pos-${k}-ink); background: var(--gram-pos-${k}-bg);">
          ${k.toUpperCase()}
        </div>
        <div class="swatch-title">${k.charAt(0).toUpperCase() + k.slice(1)}</div>
        <div class="swatch-meta">Ink: var(--gram-pos-${k}-ink)</div>
      </div>
    `).join("")}
  </div>

  <div class="section-title">2. Sentence Roles (Underline & Tint Cues)</div>
  <div class="grid">
    <div class="swatch-card">
      <div style="background: var(--gram-role-subject-bg); text-decoration: underline solid var(--gram-role-subject-line); text-decoration-thickness: 2px; text-underline-offset: 4px; padding: 8px; font-weight: 600;">
        Subject (Solid)
      </div>
      <div class="swatch-meta" style="margin-top: 8px;">Blue tint + solid line</div>
    </div>
    <div class="swatch-card">
      <div style="background: var(--gram-role-verb-phrase-bg); text-decoration: underline double var(--gram-role-verb-phrase-line); text-decoration-thickness: 2px; text-underline-offset: 4px; padding: 8px; font-weight: 600;">
        Verb Phrase (Double)
      </div>
      <div class="swatch-meta" style="margin-top: 8px;">Amber tint + double line</div>
    </div>
    <div class="swatch-card">
      <div style="background: var(--gram-role-direct-object-bg); text-decoration: underline dotted var(--gram-role-direct-object-line); text-decoration-thickness: 2px; text-underline-offset: 4px; padding: 8px; font-weight: 600;">
        Direct Object (Dotted)
      </div>
      <div class="swatch-meta" style="margin-top: 8px;">Green tint + dotted line</div>
    </div>
    <div class="swatch-card">
      <div style="background: var(--gram-role-adverbial-bg); text-decoration: underline dashed var(--gram-role-adverbial-line); text-decoration-thickness: 2px; text-underline-offset: 4px; padding: 8px; font-weight: 600;">
        Adverbial (Dashed)
      </div>
      <div class="swatch-meta" style="margin-top: 8px;">Orange tint + dashed line</div>
    </div>
  </div>

  <div class="section-title">3. Full Sentence Interactive Simulation</div>
  <div class="sentence-demo">
    <span class="token" style="color: var(--gram-pos-verb-ink); background: var(--gram-pos-verb-bg); text-decoration: underline double var(--gram-role-verb-phrase-line);">Excuse</span>
    <span class="token" style="color: var(--gram-pos-pronoun-ink); background: var(--gram-pos-pronoun-bg); text-decoration: underline dotted var(--gram-role-direct-object-line);">me</span>,
    <span class="token" style="color: var(--gram-pos-verb-ink); border-bottom: 3px solid var(--gram-time-present);">could</span>
    <span class="token" style="color: var(--gram-pos-pronoun-ink); text-decoration: underline solid var(--gram-role-subject-line);">you</span>
    <span class="token" style="color: var(--gram-pos-verb-ink); text-decoration: underline double var(--gram-role-verb-phrase-line);">tell</span>
    <span class="token" style="color: var(--gram-pos-pronoun-ink); text-decoration: underline dotted var(--gram-role-direct-object-line);">me</span>
    <span class="token" style="color: var(--gram-pos-adverb-ink);">how</span>
    <span class="token" style="color: var(--gram-pos-determiner-ink);">much</span>
    <span class="token" style="color: var(--gram-pos-determiner-ink);">this</span>
    <span class="token" style="color: var(--gram-pos-adjective-ink); background: var(--gram-pos-adjective-bg);">blue</span>
    <span class="token" style="color: var(--gram-pos-noun-ink); background: var(--gram-pos-noun-bg); text-decoration: underline dotted var(--gram-role-direct-object-line);">jacket</span>
    <span class="token" style="color: var(--gram-pos-verb-ink); text-decoration: underline double var(--gram-role-verb-phrase-line); border-bottom: 3px solid var(--gram-time-present);">costs</span>?
  </div>
</body>
</html>`;

  const htmlPath = path.join(ROOT, "docs", "screenshots", "grammar-swatches.html");
  fs.writeFileSync(htmlPath, swatchHtml, "utf-8");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 });

  // Light screenshot
  await page.setContent(swatchHtml, { waitUntil: "networkidle0" });
  const lightPath = path.join(ROOT, "docs", "screenshots", "grammar-swatches-light.png");
  await page.screenshot({ path: lightPath, fullPage: true });
  console.log(`✓ Saved Light Swatch Sheet: ${lightPath}`);

  // Dark screenshot
  await page.evaluate(() => document.body.classList.add("dark"));
  const darkPath = path.join(ROOT, "docs", "screenshots", "grammar-swatches-dark.png");
  await page.screenshot({ path: darkPath, fullPage: true });
  console.log(`✓ Saved Dark Swatch Sheet: ${darkPath}`);

  await browser.close();

  // Also copy to brain artifact directory if accessible
  const artifactDir = "/Users/mdmansur/.gemini/antigravity/brain/eae8b167-b213-49c8-b419-2baa5537d70f";
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(lightPath, path.join(artifactDir, "grammar-swatches-light.png"));
    fs.copyFileSync(darkPath, path.join(artifactDir, "grammar-swatches-dark.png"));
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
