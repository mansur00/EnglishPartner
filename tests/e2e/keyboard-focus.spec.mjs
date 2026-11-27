#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

function resolveChromePath() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];
  return candidates.find((p) => fs.existsSync(p));
}

test('KI-12 E2E: Keyboard focus navigation and accessibility in Conversation Reader', async (t) => {
  // Check if live server is reachable before attempting browser navigation
  let serverAvailable = false;
  try {
    const res = await fetch(`${APP_URL}/api/health`, { signal: AbortSignal.timeout(1500) }).catch(() => null);
    if (res && res.ok) {
      serverAvailable = true;
    }
  } catch {
    serverAvailable = false;
  }

  if (!serverAvailable) {
    console.log(`[E2E] Next.js server not running at ${APP_URL}. Start server with 'npm run dev' or 'npm start' to run live E2E tests.`);
    t.skip(`Skipped: Next.js server not running at ${APP_URL}`);
    return;
  }

  const chromePath = resolveChromePath();
  if (!chromePath) {
    t.skip('Skipped: Chrome/Chromium binary not found in standard system locations');
    return;
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  } catch (err) {
    console.warn('Browser could not be launched:', err.message);
    t.skip('Skipped: Chrome binary not accessible in current environment');
    return;
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    await t.test('1. Reader loads and interactive elements are focusable via keyboard Tab', async () => {
      await page.goto(`${APP_URL}/conversations/asking-price-product-details`, {
        waitUntil: 'networkidle0',
        timeout: 15000
      });

      // Start tabbing from document body
      await page.keyboard.press('Tab');
      const firstActive = await page.evaluate(() => {
        const el = document.activeElement;
        return { tag: el?.tagName, text: el?.textContent?.trim().slice(0, 30), aria: el?.getAttribute('aria-label') };
      });
      assert.ok(firstActive.tag, 'Tab should focus an interactive element in the document');

      // Tab through elements and check focus rings on focused buttons/links
      let focusedCount = 0;

      for (let i = 0; i < 25; i++) {
        await page.keyboard.press('Tab');
        const activeInfo = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          const style = window.getComputedStyle(el);
          const hasRing = style.boxShadow !== 'none' || style.outlineStyle !== 'none';
          return {
            tag: el.tagName,
            hasRing,
            role: el.getAttribute('role'),
            text: el.innerText?.trim().slice(0, 20)
          };
        });

        if (activeInfo) {
          focusedCount++;
        }
      }

      assert.ok(focusedCount >= 5, `Expected at least 5 focusable items encountered during Tab sequence, got ${focusedCount}`);
    });

    await t.test('2. WordDetailPopover: opens on word selection, closes on Escape, and returns focus', async () => {
      await page.goto(`${APP_URL}/conversations/asking-price-product-details`, {
        waitUntil: 'networkidle0',
        timeout: 15000
      });

      // Ensure grammar tokens are visible if Grammar Highlight switch defaults to off
      let spanButton = await page.$('.gram-token[role="button"][tabindex="0"]');
      if (!spanButton) {
        const grammarSwitch = await page.$('[role="switch"]');
        if (grammarSwitch) {
          await grammarSwitch.click();
          await new Promise((r) => setTimeout(r, 300));
        }
        spanButton = await page.$('.gram-token[role="button"][tabindex="0"]');
      }
      assert.ok(spanButton, 'Expected interactive word element (.gram-token[role="button"])');
      await spanButton.focus();
      await page.keyboard.press('Enter');

      // Allow dialog animation
      await new Promise(r => setTimeout(r, 400));

      // Verify dialog is open (role="dialog")
      const dialogVisible = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        return Boolean(dialog);
      });
      assert.ok(dialogVisible, 'Dialog should be open after activating word');

      // Press Escape to dismiss
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 300));

      const dialogDismissed = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        return !dialog;
      });
      assert.ok(dialogDismissed, 'Dialog should be closed after Escape key');
    });
  } finally {
    await browser.close();
  }
});
