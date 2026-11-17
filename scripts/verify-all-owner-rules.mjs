import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('public/test-screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runAudit() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('--- 1. Evaluating Dashboard at 1280px (Light Mode) ---');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
  await page.waitForSelector('h1');

  // Measure alignment, sidebar scroll, radius, and typography
  const evalData = await page.evaluate(async () => {
    // 1. Sidebar fixed positioning test
    const sidebar = document.querySelector('aside');
    const header = document.querySelector('header');
    const sidebarTopBefore = sidebar ? sidebar.getBoundingClientRect().top : null;
    const headerTopBefore = header ? header.getBoundingClientRect().top : null;

    // Scroll 1200px
    window.scrollTo(0, 1200);
    await new Promise(r => setTimeout(r, 100));

    const sidebarTopAfter = sidebar ? sidebar.getBoundingClientRect().top : null;
    const headerTopAfter = header ? header.getBoundingClientRect().top : null;

    // Scroll back to top for accurate element measurements
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 100));

    // 2. Pixel alignment
    const greeting = document.querySelector('h1');
    const heroCard = document.querySelector('.rainbow-border') || document.querySelector('[data-slot="card"]');
    const todayPanel = document.querySelector('div.bg-white\\/10') || document.querySelector('div[class*="bg-white/"]');
    const headerBand = document.querySelector('div.bg-gradient-to-b') || document.querySelector('div[class*="from-brand-800"]');

    const greetingRect = greeting ? greeting.getBoundingClientRect() : null;
    const heroCardRect = heroCard ? heroCard.getBoundingClientRect() : null;
    const todayPanelRect = todayPanel ? todayPanel.getBoundingClientRect() : null;
    const bandRect = headerBand ? headerBand.getBoundingClientRect() : null;

    // Overlap: band bottom - hero top
    const overlap = (bandRect && heroCardRect) ? (bandRect.bottom - heroCardRect.top) : null;

    // 3. CTA button
    const ctaBtn = document.querySelector('a[href*="asking-price-product-details"] button') || document.querySelector('button[class*="bg-sun-500"]');
    let ctaStyle = null;
    if (ctaBtn) {
      const cs = window.getComputedStyle(ctaBtn);
      ctaStyle = {
        text: ctaBtn.textContent.trim(),
        bg: cs.backgroundColor,
        color: cs.color,
        height: cs.height,
        borderRadius: cs.borderRadius,
        fontWeight: cs.fontWeight,
        fontSize: cs.fontSize
      };
    }

    // 4. Hero Card Title
    const heroTitle = heroCard ? heroCard.querySelector('h2') : null;
    let heroTitleStyle = null;
    if (heroTitle) {
      const cs = window.getComputedStyle(heroTitle);
      const rect = heroTitle.getBoundingClientRect();
      const lineHeightPx = parseFloat(cs.lineHeight) || (parseFloat(cs.fontSize) * 1.25);
      const lines = Math.round(rect.height / lineHeightPx);
      heroTitleStyle = {
        text: heroTitle.textContent.trim(),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        height: `${rect.height}px`,
        estimatedLines: lines
      };
    }

    // 5. Header Band bottom radius
    let bandRadius = null;
    if (headerBand) {
      const cs = window.getComputedStyle(headerBand);
      bandRadius = {
        bl: cs.borderBottomLeftRadius,
        br: cs.borderBottomRightRadius,
        bg: cs.backgroundImage || cs.backgroundColor
      };
    }

    // 6. Dialogue preview and chat bubbles
    const dialoguePreview = document.querySelector('.lg\\:col-span-5 > div');
    let dialoguePreviewRadius = null;
    if (dialoguePreview) {
      dialoguePreviewRadius = window.getComputedStyle(dialoguePreview).borderRadius;
    }

    const bubbles = Array.from(document.querySelectorAll('.lg\\:col-span-5 [class*="rounded-[12px]"]')).map(b => {
      const cs = window.getComputedStyle(b);
      return {
        text: b.querySelector('p')?.textContent?.trim()?.substring(0, 25),
        radius: cs.borderRadius,
        bg: cs.backgroundColor
      };
    });

    // 7. Today Widget components
    const streakNum = todayPanel ? todayPanel.querySelector('.text-\\[28px\\], .text-2xl, .text-3xl') : null;
    let streakNumStyle = null;
    if (streakNum) {
      const cs = window.getComputedStyle(streakNum);
      streakNumStyle = {
        text: streakNum.textContent.trim(),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight
      };
    }

    const weekdayMarkers = todayPanel ? Array.from(todayPanel.querySelectorAll('.w-7.h-7, [class*="w-7 h-7"]')).map(m => {
      const cs = window.getComputedStyle(m);
      return {
        text: m.textContent.trim(),
        width: cs.width,
        height: cs.height,
        borderRadius: cs.borderRadius,
        fontSize: cs.fontSize
      };
    }) : [];

    // Segments count in today panel
    const segments = todayPanel ? Array.from(todayPanel.querySelectorAll('.h-2.rounded-\\[2px\\], [class*="rounded-[2px]"]')).map(s => {
      const cs = window.getComputedStyle(s);
      return {
        height: cs.height,
        bg: cs.backgroundColor,
        borderRadius: cs.borderRadius
      };
    }) : [];

    // Check for percentage ring
    const hasRing = document.querySelector('svg circle[stroke-dasharray]') !== null;

    // 8. Global Font Weight and Font Size Audit
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let minFontSize = 999;
    let maxFontWeight = 0;
    const under12Nodes = [];
    const over600WeightNodes = [];
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
        if (fsVal < 11.99) {
          under12Nodes.push({ text, tag, fontSize: cs.fontSize, class: el.className });
        }
      }
      if (!isNaN(fwVal) && fwVal > 0) {
        if (fwVal > maxFontWeight) maxFontWeight = fwVal;
        if (fwVal > 600) {
          over600WeightNodes.push({ text, tag, fontWeight: cs.fontWeight, class: el.className });
        }
      }
    }

    return {
      sidebarScroll: {
        sidebarTopBefore,
        sidebarTopAfter,
        headerTopBefore,
        headerTopAfter,
        fixedVerified: sidebarTopBefore === sidebarTopAfter && sidebarTopBefore !== null
      },
      alignment: {
        greetingLeft: greetingRect?.left,
        heroCardLeft: heroCardRect?.left,
        todayPanelRight: todayPanelRect?.right,
        heroCardRight: heroCardRect?.right,
        overlapPx: overlap
      },
      ctaStyle,
      heroTitleStyle,
      bandRadius,
      dialoguePreviewRadius,
      bubbles,
      streakNumStyle,
      weekdayMarkersCount: weekdayMarkers.length,
      sampleMarker: weekdayMarkers[0] || null,
      segmentsCount: segments.length,
      sampleSegment: segments[0] || null,
      hasPercentageRing: hasRing,
      fontAudit: {
        minFontSize,
        maxFontWeight,
        under12Count: under12Nodes.length,
        under12Nodes,
        over600Count: over600WeightNodes.length,
        over600WeightNodes: over600WeightNodes.slice(0, 5)
      }
    };
  });

  const screenshotPath = path.join(SCREENSHOT_DIR, 'dashboard_audit_1280px.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });

  // --- 2. Check Conversation Reader page ---
  console.log('--- 2. Evaluating Conversation Reader ---');
  await page.goto('http://localhost:3000/conversations/asking-price-product-details', { waitUntil: 'networkidle0' });
  const readerData = await page.evaluate(() => {
    const speechText = document.querySelector('.font-sans.text-lg, [class*="text-lg"], [class*="text-xl"]');
    const cs = speechText ? window.getComputedStyle(speechText) : null;
    const banglaText = document.querySelector('.font-bangla');
    const csBn = banglaText ? window.getComputedStyle(banglaText) : null;
    return {
      speechText: cs ? { fontSize: cs.fontSize, lineHeight: cs.lineHeight, fontWeight: cs.fontWeight } : null,
      banglaText: csBn ? { fontSize: csBn.fontSize, lineHeight: csBn.lineHeight, fontWeight: csBn.fontWeight } : null
    };
  });

  // --- 3. Check Vocabulary page ---
  console.log('--- 3. Evaluating Vocabulary Notebook ---');
  await page.goto('http://localhost:3000/vocabulary', { waitUntil: 'networkidle0' });
  const vocabData = await page.evaluate(() => {
    const card = document.querySelector('[class*="rounded-[16px]"]');
    const input = document.querySelector('input');
    const chip = document.querySelector('button[class*="rounded-full"]');
    return {
      cardRadius: card ? window.getComputedStyle(card).borderRadius : null,
      inputRadius: input ? window.getComputedStyle(input).borderRadius : null,
      inputHeight: input ? window.getComputedStyle(input).height : null,
      chipRadius: chip ? window.getComputedStyle(chip).borderRadius : null,
      chipHeight: chip ? window.getComputedStyle(chip).height : null
    };
  });

  await browser.close();

  console.log('\n================ AUDIT RESULTS ================');
  console.log(JSON.stringify({ evalData, readerData, vocabData }, null, 2));
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
