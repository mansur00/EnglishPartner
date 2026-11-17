import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('public/test-screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function inspectScenario(viewport, isDark) {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport(viewport);

  // Set theme before navigation
  await page.evaluateOnNewDocument((dark) => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, isDark);

  // --- 1. Dashboard ---
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
  await page.waitForSelector('h1');
  if (isDark) {
    await page.evaluate(() => document.documentElement.classList.add('dark'));
  } else {
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
  }
  // Wait a tick for CSS to update
  await new Promise(r => setTimeout(r, 100));

  const dashboardScreenshotPath = path.join(
    SCREENSHOT_DIR,
    `dashboard_${viewport.width}px_${isDark ? 'dark' : 'light'}.png`
  );
  await page.screenshot({ path: dashboardScreenshotPath, fullPage: true });

  const dashboardData = await page.evaluate(() => {
    // 1. CTA Button
    const ctaBtn = document.querySelector('a[href*="asking-price-product-details"] button');
    let cta = null;
    if (ctaBtn) {
      const cs = window.getComputedStyle(ctaBtn);
      cta = {
        text: ctaBtn.textContent.trim(),
        bg: cs.backgroundColor,
        color: cs.color,
        height: cs.height,
        borderRadius: cs.borderRadius,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight
      };
    }

    // 2. Header Band
    const headerBand = document.querySelector('div.bg-primary');
    let header = null;
    if (headerBand) {
      const cs = window.getComputedStyle(headerBand);
      header = {
        bg: cs.backgroundColor,
        width: cs.width,
        borderBottomLeftRadius: cs.borderBottomLeftRadius,
        borderBottomRightRadius: cs.borderBottomRightRadius
      };
    }

    // 3. Topic Cards
    const cards = Array.from(document.querySelectorAll('[data-slot="card"][data-topic]')).map(card => {
      const cs = window.getComputedStyle(card);
      const title = card.querySelector('h2, h3')?.textContent?.trim() || 'Card';
      return {
        topic: card.getAttribute('data-topic'),
        title,
        bg: cs.backgroundColor,
        borderColor: cs.borderColor,
        borderWidth: cs.borderWidth
      };
    });

    // 4. Emoji Tiles
    const emojiTiles = Array.from(document.querySelectorAll('.emoji-tile')).map(tile => {
      const cs = window.getComputedStyle(tile);
      return {
        text: tile.textContent.trim(),
        bg: cs.backgroundColor,
        borderColor: cs.borderColor,
        color: cs.color
      };
    });

    // 5. Dialogue Preview Bubbles
    const bubbles = Array.from(document.querySelectorAll('.lg\\:col-span-5 [class*="rounded-2xl rounded-t"]')).map(b => {
      const cs = window.getComputedStyle(b);
      return {
        text: b.querySelector('p')?.textContent?.trim()?.substring(0, 30),
        bg: cs.backgroundColor,
        borderColor: cs.borderColor,
        borderWidth: cs.borderWidth,
        borderRadius: cs.borderRadius
      };
    });

    // Avatars
    const avatars = Array.from(document.querySelectorAll('.lg\\:col-span-5 span[class*="rounded-full"][class*="w-8"]')).map(a => {
      const cs = window.getComputedStyle(a);
      return {
        text: a.textContent.trim(),
        bg: cs.backgroundColor,
        color: cs.color
      };
    });

    // 6. Font audit
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const under12 = [];
    const under14NonMeta = [];
    let node;
    while ((node = walker.nextNode())) {
      if (!node.textContent || !node.textContent.trim()) continue;
      const el = node.parentElement;
      if (!el) continue;
      const tag = el.tagName.toLowerCase();
      if (['script', 'style', 'noscript'].includes(tag)) continue;
      const cs = window.getComputedStyle(el);
      const fs = parseFloat(cs.fontSize);
      const text = node.textContent.trim().substring(0, 35);
      const className = el.className || '';

      const isChipOrBadge = el.closest('[data-slot="badge"]') !== null ||
        className.includes('badge') ||
        className.includes('rounded-full') && fs <= 13;
      const isNav = el.closest('nav') !== null || el.closest('header') !== null;

      if (fs < 11.99) {
        under12.push({ text, fs: cs.fontSize, tag, className });
      } else if (fs < 13.99 && !isChipOrBadge && !isNav) {
        under14NonMeta.push({ text, fs: cs.fontSize, tag, className });
      }
    }

    return { cta, header, cards, emojiTiles, bubbles, avatars, under12, under14NonMeta: under14NonMeta.slice(0, 5) };
  });

  // --- 2. Explore ---
  await page.goto('http://localhost:3000/explore', { waitUntil: 'networkidle0' });
  await page.waitForSelector('h1');
  if (isDark) {
    await page.evaluate(() => document.documentElement.classList.add('dark'));
  } else {
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
  }
  await new Promise(r => setTimeout(r, 100));

  const exploreScreenshotPath = path.join(
    SCREENSHOT_DIR,
    `explore_${viewport.width}px_${isDark ? 'dark' : 'light'}.png`
  );
  await page.screenshot({ path: exploreScreenshotPath, fullPage: true });

  const exploreData = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[data-slot="card"][data-topic]')).slice(0, 3).map(card => {
      const cs = window.getComputedStyle(card);
      const title = card.querySelector('h3')?.textContent?.trim() || 'Explore Card';
      return {
        topic: card.getAttribute('data-topic'),
        title,
        bg: cs.backgroundColor,
        borderColor: cs.borderColor,
        borderWidth: cs.borderWidth
      };
    });

    const categoryPills = Array.from(document.querySelectorAll('[data-topic] button')).slice(0, 3).map(btn => {
      const cs = window.getComputedStyle(btn);
      return {
        text: btn.textContent.trim(),
        bg: cs.backgroundColor,
        borderColor: cs.borderColor,
        color: cs.color
      };
    });

    return { cards, categoryPills };
  });

  await browser.close();

  return {
    mode: isDark ? 'dark' : 'light',
    viewport: `${viewport.width}x${viewport.height}`,
    dashboard: dashboardData,
    explore: exploreData
  };
}

async function run() {
  console.log('Running visual & computed-style verification...');
  const desktopLight = await inspectScenario({ width: 1280, height: 900 }, false);
  const mobileLight = await inspectScenario({ width: 360, height: 800 }, false);
  const desktopDark = await inspectScenario({ width: 1280, height: 900 }, true);
  const mobileDark = await inspectScenario({ width: 360, height: 800 }, true);

  console.log(JSON.stringify({ desktopLight, mobileLight, desktopDark, mobileDark }, null, 2));
}

run().catch(console.error);

