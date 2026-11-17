import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('public/test-screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function verifyLanding() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('Evaluating Landing Page at 1280px...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.waitForSelector('h1');

  const data = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const h1Cs = h1 ? window.getComputedStyle(h1) : null;

    const heroCta = document.querySelector('section a[href="/dashboard"] button');
    const ctaCs = heroCta ? window.getComputedStyle(heroCta) : null;
    let heroCtaStyle = null;
    if (heroCta && ctaCs) {
      heroCtaStyle = {
        text: heroCta.textContent.trim(),
        bg: ctaCs.backgroundColor,
        color: ctaCs.color,
        height: ctaCs.height,
        borderRadius: ctaCs.borderRadius,
        fontWeight: ctaCs.fontWeight,
        fontSize: ctaCs.fontSize
      };
    }

    const disabledBtns = Array.from(document.querySelectorAll('nav button[disabled]')).map(b => {
      const cs = window.getComputedStyle(b);
      return {
        text: b.textContent.trim(),
        disabled: b.disabled,
        ariaDisabled: b.getAttribute('aria-disabled'),
        cursor: cs.cursor,
        color: cs.color
      };
    });

    const card = document.querySelector('[data-slot="card"]');
    const cardCs = card ? window.getComputedStyle(card) : null;

    // Check all text nodes for weights and font floor
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let minFontSize = 999;
    let maxFontWeight = 0;
    const under12 = [];
    const over600 = [];
    let node;

    while ((node = walker.nextNode())) {
      if (!node.textContent || !node.textContent.trim()) continue;
      const el = node.parentElement;
      if (!el) continue;
      const tag = el.tagName.toLowerCase();
      if (['script', 'style', 'noscript'].includes(tag)) continue;
      const cs = window.getComputedStyle(el);
      const fsVal = parseFloat(cs.fontSize);
      const fwVal = parseInt(cs.fontWeight, 10);
      const text = node.textContent.trim().substring(0, 30);

      if (!isNaN(fsVal) && fsVal > 0) {
        if (fsVal < minFontSize) minFontSize = fsVal;
        if (fsVal < 11.99) under12.push({ text, tag, fs: cs.fontSize, class: el.className });
      }
      if (!isNaN(fwVal) && fwVal > 0) {
        if (fwVal > maxFontWeight) maxFontWeight = fwVal;
        if (fwVal > 600) over600.push({ text, tag, fw: cs.fontWeight, class: el.className });
      }
    }

    return {
      h1: h1Cs ? {
        text: h1.textContent.trim(),
        fontSize: h1Cs.fontSize,
        fontWeight: h1Cs.fontWeight,
        lineHeight: h1Cs.lineHeight
      } : null,
      cta: heroCtaStyle,
      disabledBtns,
      cardRadius: cardCs ? cardCs.borderRadius : null,
      fontAudit: {
        minFontSize,
        maxFontWeight,
        under12Count: under12.length,
        over600Count: over600.length
      }
    };
  });

  const desktopScreenshot = path.join(SCREENSHOT_DIR, 'landing_1280px.png');
  await page.screenshot({ path: desktopScreenshot, fullPage: true });

  // Mobile screenshot
  await page.setViewport({ width: 360, height: 800 });
  await page.reload({ waitUntil: 'networkidle0' });
  const mobileScreenshot = path.join(SCREENSHOT_DIR, 'landing_360px.png');
  await page.screenshot({ path: mobileScreenshot, fullPage: true });

  await browser.close();

  console.log('LANDING AUDIT RESULT:');
  console.log(JSON.stringify(data, null, 2));
}

verifyLanding().catch(err => {
  console.error(err);
  process.exit(1);
});
