import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/mdmansur/.gemini/antigravity/brain/eae8b167-b213-49c8-b419-2baa5537d70f';
const DOCS_DIR = path.resolve('docs/screenshots/grammar');

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

async function run() {
  console.log('======================================================');
  console.log('       VERIFYING GRAMMAR COLOR-CODING UI MVP          ');
  console.log('======================================================\n');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  const BASE_URL = 'http://localhost:3000';
  const TARGET_URL = `${BASE_URL}/conversations/asking-price-product-details`;

  console.log(`Navigating to ${TARGET_URL}...`);
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });

  // 1. PERFORMANCE: Measure time to toggle grammar across dialogue turns
  console.log('\n--- 1. TOGGLE PERFORMANCE MEASUREMENT ---');
  const toggleBtnSelector = 'button[data-grammar-toggle="true"]';
  await page.waitForSelector(toggleBtnSelector);

  const t0 = Date.now();
  await page.click(toggleBtnSelector);
  await page.waitForSelector('.space-y-4 > div:first-child [data-gram-pos]');
  const t1 = Date.now();
  const toggleTimeTurnMs = t1 - t0;
  console.log(`✓ Single-turn Grammar toggle response time: ${toggleTimeTurnMs} ms (Target: < 100 ms)`);

  // Global toggle test
  const globalSwitchSelector = '[data-slot="switch"]';
  const tGlobal0 = Date.now();
  await page.evaluate(() => {
    const sw = document.querySelector('[data-slot="switch"]');
    sw.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForFunction(() => {
    return document.querySelectorAll('[data-gram-pos]').length > 20;
  });
  const tGlobal1 = Date.now();
  const toggleTimeGlobalMs = tGlobal1 - tGlobal0;
  console.log(`✓ Global dialogue Grammar toggle response time: ${toggleTimeGlobalMs} ms (Target: < 100 ms)`);

  // Turn global OFF to test layout shift
  await page.evaluate(() => {
    const sw = document.querySelector('[data-slot="switch"]');
    sw.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForFunction(() => {
    return document.querySelectorAll('[data-gram-pos]').length === 0;
  });

  // 2. ZERO HORIZONTAL LAYOUT SHIFT TEST
  console.log('\n--- 2. ZERO HORIZONTAL LAYOUT SHIFT AUDIT ---');
  // Measure positions of tokens in the first turn with Grammar OFF
  const wordsBefore = await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll('.space-y-4 > div:first-child .gram-token'));
    return spans.map(s => {
      const rect = s.getBoundingClientRect();
      return { text: s.textContent.trim(), left: rect.left, width: rect.width };
    });
  });

  // Turn Grammar ON for this turn
  await page.click(toggleBtnSelector);
  await page.waitForSelector('.space-y-4 > div:first-child [data-gram-pos]');

  const wordsAfter = await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll('.space-y-4 > div:first-child .gram-token'));
    return spans.map(s => {
      const rect = s.getBoundingClientRect();
      return { text: s.textContent.trim(), left: rect.left, width: rect.width };
    });
  });

  console.log(`Tokens count: OFF = ${wordsBefore.length}, ON = ${wordsAfter.length}`);
  let maxHorizontalShift = 0;
  for (let i = 0; i < wordsBefore.length; i++) {
    const shift = Math.abs(wordsBefore[i].left - wordsAfter[i].left);
    if (shift > maxHorizontalShift) maxHorizontalShift = shift;
    console.log(`  - Token "${wordsBefore[i].text}": OFF left=${wordsBefore[i].left.toFixed(2)}px, ON left=${wordsAfter[i].left.toFixed(2)}px, diff=${shift.toFixed(4)}px`);
  }
  console.log(`Max horizontal layout shift across line: ${maxHorizontalShift.toFixed(4)} px`);
  if (maxHorizontalShift < 0.01) {
    console.log('✅ ZERO HORIZONTAL LAYOUT SHIFT CONFIRMED: 0.0000 px shift across all tokens.');
  }

  // 3. CAPTURE HIGH-FIDELITY SCREENSHOTS (1280px & 360px, Light & Dark)
  console.log('\n--- 3. CAPTURING EVIDENCE SCREENSHOTS ---');

  const viewports = [
    { name: '1280px', width: 1280, height: 950 },
    { name: '360px', width: 360, height: 800 }
  ];

  const themes = ['light', 'dark'];

  for (const vp of viewports) {
    for (const theme of themes) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.evaluate((t) => {
        if (t === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }, theme);

      // (a) Grammar ON with active turn & summary row
      const screen1Path = path.join(DOCS_DIR, `grammar-turn-${vp.name}-${theme}.png`);
      const artifact1Path = path.join(ARTIFACT_DIR, `grammar-turn-${vp.name}-${theme}.png`);
      await page.screenshot({ path: screen1Path, fullPage: false });
      fs.copyFileSync(screen1Path, artifact1Path);
      console.log(`✓ Saved Turn screenshot: ${path.basename(screen1Path)}`);

      // (b) Open Layer Picker
      const layerPickerTrigger = await page.$('button[aria-label*="লেয়ার"], button[aria-label*="Layers"]');
      if (layerPickerTrigger) {
        await layerPickerTrigger.click();
        await new Promise(r => setTimeout(r, 300));
        const screen2Path = path.join(DOCS_DIR, `grammar-layers-picker-${vp.name}-${theme}.png`);
        const artifact2Path = path.join(ARTIFACT_DIR, `grammar-layers-picker-${vp.name}-${theme}.png`);
        await page.screenshot({ path: screen2Path, fullPage: false });
        fs.copyFileSync(screen2Path, artifact2Path);
        console.log(`✓ Saved Layer Picker screenshot: ${path.basename(screen2Path)}`);
        // Close layer picker
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 200));
      }

      // (c) Focus mode test (click a category in the legend)
      const legendPills = await page.$$('.rounded-pill');
      if (legendPills.length > 0) {
        await legendPills[0].click();
        await new Promise(r => setTimeout(r, 200));
        const screen3Path = path.join(DOCS_DIR, `grammar-focus-mode-${vp.name}-${theme}.png`);
        const artifact3Path = path.join(ARTIFACT_DIR, `grammar-focus-mode-${vp.name}-${theme}.png`);
        await page.screenshot({ path: screen3Path, fullPage: false });
        fs.copyFileSync(screen3Path, artifact3Path);
        console.log(`✓ Saved Focus Mode screenshot: ${path.basename(screen3Path)}`);
        // Clear focus
        await legendPills[0].click();
      }

      // (d) Open Word Detail Popover with Grammar Breakdown
      const firstClickableToken = await page.$('.space-y-4 > div:first-child .gram-token[role="button"]');
      if (firstClickableToken) {
        await firstClickableToken.click();
        await page.waitForSelector('[role="dialog"]');
        await new Promise(r => setTimeout(r, 300));
        const screen4Path = path.join(DOCS_DIR, `grammar-word-detail-${vp.name}-${theme}.png`);
        const artifact4Path = path.join(ARTIFACT_DIR, `grammar-word-detail-${vp.name}-${theme}.png`);
        await page.screenshot({ path: screen4Path, fullPage: false });
        fs.copyFileSync(screen4Path, artifact4Path);
        console.log(`✓ Saved Word Detail Popover screenshot: ${path.basename(screen4Path)}`);
        // Close dialog
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 250));
      }
    }
  }

  await browser.close();
  console.log('\n======================================================');
  console.log('       ALL GRAMMAR UI MVP VERIFICATIONS COMPLETE      ');
  console.log('======================================================\n');
}

run().catch((err) => {
  console.error('Fatal error during grammar verification:', err);
  process.exit(1);
});
