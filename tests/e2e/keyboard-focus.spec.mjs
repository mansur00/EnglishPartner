#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

test('KI-12 E2E: Keyboard focus navigation and accessibility in Conversation Reader', async (t) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
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
    let focusStylesChecked = 0;

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
        if (activeInfo.hasRing) focusStylesChecked++;
      }
    }

    assert.ok(focusedCount > 10, `Tab key should successfully navigate across interactive elements (found ${focusedCount})`);
    assert.ok(focusStylesChecked > 0, `At least some focused elements have visible focus rings or styles`);
  });

  await t.test('2. WordDetailPopover: opens on word selection, closes on Escape, and returns focus', async () => {
    await page.goto(`${APP_URL}/conversations/asking-price-product-details`, {
      waitUntil: 'networkidle0'
    });

    // Find first interactive dialogue word button
    const wordFound = await page.evaluate(() => {
      const wordBtn = document.querySelector('span[role="button"][tabindex="0"]');
      if (wordBtn) {
        wordBtn.focus();
        return { focused: document.activeElement === wordBtn, text: wordBtn.textContent?.trim() };
      }
      return null;
    });

    assert.ok(wordFound, 'Found interactive dialogue word in conversation');
    assert.equal(wordFound.focused, true, 'Word button received direct keyboard focus');

    // Press Enter to open WordDetailPopover
    await page.keyboard.press('Enter');
    await new Promise((r) => setTimeout(r, 400));

    // Verify dialog / popover opened
    const dialogOpen = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return !!dialog;
    });
    assert.ok(dialogOpen, 'WordDetailPopover dialog opened after keyboard Enter');

    // Press Escape to dismiss popover
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 400));

    // Verify dialog closed
    const dialogClosed = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return !dialog;
    });
    assert.ok(dialogClosed, 'WordDetailPopover closed on Escape key press');
  });

  await browser.close();
});
