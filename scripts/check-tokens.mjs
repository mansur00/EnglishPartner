#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');
const ALLOWLIST_FILE = path.resolve('scripts/token-allowlist.json');

// Read allowlist
let allowlist = { entries: [] };
if (fs.existsSync(ALLOWLIST_FILE)) {
  try {
    allowlist = JSON.parse(fs.readFileSync(ALLOWLIST_FILE, 'utf8'));
  } catch (e) {
    console.error('Failed to parse allowlist:', e);
  }
}

function isAllowlisted(relPath, ruleId) {
  return allowlist.entries.some(entry => {
    if (entry.file === relPath) {
      return entry.rule === 'all' || entry.rule === ruleId;
    }
    return false;
  });
}

function getAllFiles(dir, exts = ['.ts', '.tsx', '.css', '.js', '.mjs']) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, exts));
    } else if (exts.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = getAllFiles(SRC_DIR);

// Results collection
const violations = {
  a_colors: [],
  b_typography: [],
  c_radius: [],
  d_layout_magic: [],
  e_inline_styles: [],
  f_duplication: [],
  g_ts_data_colors: [],
  h_dark_mode: [],
  i_ui_primitives: []
};

// Patterns
// Rule a: Colors
const RAW_COLOR_PALETTES = '(white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)';
const RAW_COLOR_CLASS_REGEX = new RegExp(`\\b(bg|text|border|ring|stroke|fill)-${RAW_COLOR_PALETTES}(-[0-9]{2,3})?(\\/[0-9]{1,3})?\\b`, 'g');
const ARBITRARY_HEX_REGEX = /#[0-9a-fA-F]{3,8}\b/g;
const ARBITRARY_VAR_COLOR_REGEX = /\b(bg|text|border|ring)-\[var\(--[^\]]+\)\]/g;
const RGB_LITERAL_REGEX = /\b(rgb|rgba|hsl|oklch)\([^)]+\)/g;

// Rule b: Typography
const ARBITRARY_TEXT_REGEX = /\b(text|leading|tracking|font)-\[[^\]]+\]/g;
const DIRECT_TEXT_SCALE_REGEX = /\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)\b/g;
const DIRECT_FONT_WEIGHT_REGEX = /\bfont-(thin|light|normal|medium|semibold|bold|extrabold|black)\b/g;

// Rule c: Radius
const ARBITRARY_RADIUS_REGEX = /\brounded-\[[^\]]+\]/g;
const RAW_RADIUS_SCALE_REGEX = /\brounded-(sm|md|lg|xl|2xl|3xl)\b/g;

// Rule d: Layout & Magic Numbers
const ARBITRARY_PX_LAYOUT_REGEX = /\b(h|w|min-h|min-w|max-w|top|bottom|left|right|z)-\[[^\]]+\]/g;
const MAGIC_LAYOUT_CONSTANTS_REGEX = /\b(max-w-5xl|max-w-4xl|max-w-3xl|max-w-2xl|w-64|h-16|top-16|h-12|h-13|w-11|h-11|w-7|h-7|w-12|h-12|w-14|h-14|w-8|h-8|w-10|h-10|z-40|z-50)\b/g;

// Rule e: Inline styles
const INLINE_STYLE_VISUAL_REGEX = /style=\{\{[^}]*(color|background|fontSize|fontWeight|borderRadius|padding|margin|border|width|height)[^}]*\}\}/g;

// Rule h: Dark mode raw classes
const DARK_RAW_COLOR_REGEX = new RegExp(`\\bdark:(bg|text|border|ring)-(${RAW_COLOR_PALETTES}(-[0-9]{2,3})?(\\/[0-9]{1,3})?|brand-[0-9]{2,3}(\\/[0-9]{1,3})?)\\b`, 'g');

// Rule f: String duplication collector
const classStringMap = new Map();

for (const filePath of allFiles) {
  const relPath = path.relative(process.cwd(), filePath);
  const isUiPrimitive = relPath.startsWith('src/components/ui/');
  const isTokenDefFile = relPath === 'src/app/globals.css' || relPath === 'src/styles/design-tokens.css' || relPath === 'src/styles/grammar-tokens.css';
  const isTsData = relPath.startsWith('src/content/') || relPath.endsWith('theme.ts') || relPath.endsWith('category-theme.ts');

  if (isTokenDefFile) continue;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Rule i: Check UI primitives specifically
  if (isUiPrimitive) {
    lines.forEach((line, lineIdx) => {
      // Check for raw hex or literal rgb in primitives
      const hexMatches = line.match(ARBITRARY_HEX_REGEX);
      if (hexMatches) {
        violations.i_ui_primitives.push({
          file: relPath,
          line: lineIdx + 1,
          detail: `Raw hex literal: ${hexMatches.join(', ')}`,
          code: line.trim()
        });
      }
      const rawColors = line.match(RAW_COLOR_CLASS_REGEX);
      if (rawColors) {
        violations.i_ui_primitives.push({
          file: relPath,
          line: lineIdx + 1,
          detail: `Direct palette color: ${rawColors.join(', ')}`,
          code: line.trim()
        });
      }
      const rawRadius = line.match(ARBITRARY_RADIUS_REGEX);
      if (rawRadius) {
        violations.i_ui_primitives.push({
          file: relPath,
          line: lineIdx + 1,
          detail: `Arbitrary radius: ${rawRadius.join(', ')}`,
          code: line.trim()
        });
      }
    });
    continue; // UI primitives are audited under rule i
  }

  // Rule g: Check TS Data files for color literals
  if (isTsData) {
    lines.forEach((line, lineIdx) => {
      if (line.match(ARBITRARY_HEX_REGEX) || line.match(RAW_COLOR_CLASS_REGEX) || line.match(RGB_LITERAL_REGEX)) {
        violations.g_ts_data_colors.push({
          file: relPath,
          line: lineIdx + 1,
          detail: 'Color literal or raw utility found in TS data file',
          code: line.trim()
        });
      }
    });
  }

  // Collect class strings for duplication rule f
  const classNameMatches = content.matchAll(/className=["']([^"']{40,})["']/g);
  for (const m of classNameMatches) {
    const cls = m[1].trim();
    if (!classStringMap.has(cls)) {
      classStringMap.set(cls, []);
    }
    classStringMap.get(cls).push(relPath);
  }

  // Scan line by line for rules a to e & h
  lines.forEach((line, lineIdx) => {
    const lineNum = lineIdx + 1;

    // Rule a: Colors
    if (!isAllowlisted(relPath, 'a_colors')) {
      const rawColorMatches = line.match(RAW_COLOR_CLASS_REGEX);
      if (rawColorMatches) {
        violations.a_colors.push({
          file: relPath,
          line: lineNum,
          detail: `Tailwind raw palette color: ${rawColorMatches.join(', ')}`,
          code: line.trim()
        });
      }
      const hexMatches = line.match(ARBITRARY_HEX_REGEX);
      if (hexMatches) {
        violations.a_colors.push({
          file: relPath,
          line: lineNum,
          detail: `Hex literal: ${hexMatches.join(', ')}`,
          code: line.trim()
        });
      }
      const arbitraryVarMatches = line.match(ARBITRARY_VAR_COLOR_REGEX);
      if (arbitraryVarMatches) {
        violations.a_colors.push({
          file: relPath,
          line: lineNum,
          detail: `Arbitrary var() color utility: ${arbitraryVarMatches.join(', ')}`,
          code: line.trim()
        });
      }
      const rgbMatches = line.match(RGB_LITERAL_REGEX);
      if (rgbMatches) {
        violations.a_colors.push({
          file: relPath,
          line: lineNum,
          detail: `Literal rgb/hsl/oklch: ${rgbMatches.join(', ')}`,
          code: line.trim()
        });
      }
    }

    // Rule b: Typography
    if (!isAllowlisted(relPath, 'b_typography')) {
      const arbitraryText = line.match(ARBITRARY_TEXT_REGEX);
      if (arbitraryText) {
        violations.b_typography.push({
          file: relPath,
          line: lineNum,
          detail: `Arbitrary typography class: ${arbitraryText.join(', ')}`,
          code: line.trim()
        });
      }
      const scaleText = line.match(DIRECT_TEXT_SCALE_REGEX);
      if (scaleText) {
        violations.b_typography.push({
          file: relPath,
          line: lineNum,
          detail: `Direct scale text utility in feature code: ${scaleText.join(', ')}`,
          code: line.trim()
        });
      }
      const weightText = line.match(DIRECT_FONT_WEIGHT_REGEX);
      if (weightText) {
        violations.b_typography.push({
          file: relPath,
          line: lineNum,
          detail: `Direct font-weight utility in feature code: ${weightText.join(', ')}`,
          code: line.trim()
        });
      }
    }

    // Rule c: Radius
    if (!isAllowlisted(relPath, 'c_radius')) {
      const arbRadius = line.match(ARBITRARY_RADIUS_REGEX);
      if (arbRadius) {
        violations.c_radius.push({
          file: relPath,
          line: lineNum,
          detail: `Arbitrary rounded-[..] in feature code: ${arbRadius.join(', ')}`,
          code: line.trim()
        });
      }
      const rawScaleRadius = line.match(RAW_RADIUS_SCALE_REGEX);
      if (rawScaleRadius) {
        violations.c_radius.push({
          file: relPath,
          line: lineNum,
          detail: `Raw scale rounded utility in feature code: ${rawScaleRadius.join(', ')}`,
          code: line.trim()
        });
      }
    }

    // Rule d: Layout constants & magic numbers
    if (!isAllowlisted(relPath, 'd_layout_magic')) {
      const arbLayout = line.match(ARBITRARY_PX_LAYOUT_REGEX);
      if (arbLayout) {
        violations.d_layout_magic.push({
          file: relPath,
          line: lineNum,
          detail: `Arbitrary layout [Npx] utility: ${arbLayout.join(', ')}`,
          code: line.trim()
        });
      }
      const magicConstants = line.match(MAGIC_LAYOUT_CONSTANTS_REGEX);
      if (magicConstants) {
        violations.d_layout_magic.push({
          file: relPath,
          line: lineNum,
          detail: `Hardcoded layout constant / magic number: ${magicConstants.join(', ')}`,
          code: line.trim()
        });
      }
    }

    // Rule e: Inline styles
    if (!isAllowlisted(relPath, 'e_inline_styles')) {
      const inlineStyle = line.match(INLINE_STYLE_VISUAL_REGEX);
      if (inlineStyle) {
        violations.e_inline_styles.push({
          file: relPath,
          line: lineNum,
          detail: 'Visual inline style in feature code',
          code: line.trim()
        });
      }
    }

    // Rule h: Dark mode raw classes
    if (!isAllowlisted(relPath, 'h_dark_mode')) {
      const darkRaw = line.match(DARK_RAW_COLOR_REGEX);
      if (darkRaw) {
        violations.h_dark_mode.push({
          file: relPath,
          line: lineNum,
          detail: `Raw color with dark: prefix: ${darkRaw.join(', ')}`,
          code: line.trim()
        });
      }
    }
  });
}

// Rule f: Find duplicated className strings
for (const [cls, files] of classStringMap.entries()) {
  if (files.length >= 3) {
    violations.f_duplication.push({
      detail: `ClassName repeated ${files.length} times`,
      className: cls,
      files: [...new Set(files)]
    });
  }
}

// Report Output
console.log('====================================================');
console.log('       FULL "NO HARD-CODE" TOKEN & DESIGN AUDIT     ');
console.log('====================================================\n');

const summary = [
  { rule: 'a. Colors (raw palette, hex, var(), rgb)', count: violations.a_colors.length },
  { rule: 'b. Typography (raw scale text/weight, text-[..])', count: violations.b_typography.length },
  { rule: 'c. Radius (rounded-[..], raw rounded-xl/lg/2xl)', count: violations.c_radius.length },
  { rule: 'd. Layout & Magic Numbers (arbitrary [Npx], constants)', count: violations.d_layout_magic.length },
  { rule: 'e. Inline Styles (visual style={{...}})', count: violations.e_inline_styles.length },
  { rule: 'f. Duplication (classNames >= 40 chars repeated >= 3x)', count: violations.f_duplication.length },
  { rule: 'g. TS Data Files (colors in data models/helpers)', count: violations.g_ts_data_colors.length },
  { rule: 'h. Dark Mode (dark: + raw color classes)', count: violations.h_dark_mode.length },
  { rule: 'i. UI Primitives (shadcn components hard-coded values)', count: violations.i_ui_primitives.length }
];

console.table(summary);

// Write full detailed audit JSON for analysis
fs.writeFileSync(
  path.resolve('audit-no-hardcode-report.json'),
  JSON.stringify(violations, null, 2)
);
console.log('\nDetailed JSON report written to audit-no-hardcode-report.json');

const totalViolations = Object.values(violations).reduce((acc, v) => acc + v.length, 0);

if (process.env.STRICT_FAIL && totalViolations > 0) {
  console.error(`\n❌ Token check failed with ${totalViolations} violations.`);
  process.exit(1);
} else {
  console.log(`\nAudit complete: ${totalViolations} total violations discovered across rules a-i.`);
  process.exit(0);
}

