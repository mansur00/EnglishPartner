import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const BASE_DIR = path.resolve('docs/screenshots');
const BASELINE_DIR = path.join(BASE_DIR, 'baseline');
const CURRENT_DIR = path.join(BASE_DIR, 'current');
const DIFF_DIR = path.join(BASE_DIR, 'diff');
const ARTIFACT_DIR = '/Users/mdmansur/.gemini/antigravity/brain/eae8b167-b213-49c8-b419-2baa5537d70f';

[BASE_DIR, BASELINE_DIR, CURRENT_DIR, DIFF_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const ROUTES = [
  { name: 'landing', url: 'http://localhost:3000/' },
  { name: 'dashboard', url: 'http://localhost:3000/dashboard' },
  { name: 'explore', url: 'http://localhost:3000/explore' },
  { name: 'category', url: 'http://localhost:3000/explore/category/shopping-and-money' },
  { name: 'reader', url: 'http://localhost:3000/conversations/asking-price-product-details' },
  { name: 'vocabulary', url: 'http://localhost:3000/vocabulary' },
  { name: 'admin', url: 'http://localhost:3000/admin' }
];

async function captureSet(targetDir) {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const stylesSnapshot = {};

  for (const r of ROUTES) {
    stylesSnapshot[r.name] = {};

    for (const width of [1280, 360]) {
      const height = width === 1280 ? 900 : 800;
      await page.setViewport({ width, height });

      for (const theme of ['light', 'dark']) {
        await page.goto(r.url, { waitUntil: 'networkidle0' });
        await page.evaluate((t) => {
          if (t === 'dark') document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');
        }, theme);
        await new Promise(res => setTimeout(res, 120));

        const filename = `${r.name}_${width}px_${theme}.png`;
        const filePath = path.join(targetDir, filename);
        await page.screenshot({ path: filePath, fullPage: true });

        // Copy openable screenshot to root docs/screenshots/ and brain artifact directory
        const openablePath = path.join(BASE_DIR, filename);
        fs.copyFileSync(filePath, openablePath);
        if (fs.existsSync(ARTIFACT_DIR)) {
          fs.copyFileSync(filePath, path.join(ARTIFACT_DIR, filename));
        }

        // Snapshot computed styles at 1280px light
        if (width === 1280 && theme === 'light') {
          const compStyles = await page.evaluate(() => {
            const getProps = (selector) => {
              const el = document.querySelector(selector);
              if (!el) return null;
              const cs = window.getComputedStyle(el);
              return {
                fontSize: cs.fontSize,
                fontWeight: cs.fontWeight,
                lineHeight: cs.lineHeight,
                backgroundColor: cs.backgroundColor,
                color: cs.color,
                borderRadius: cs.borderRadius,
                borderColor: cs.borderColor,
                height: cs.height,
                width: cs.width
              };
            };
            return {
              h1: getProps('h1'),
              heroCard: getProps('[data-slot="card"], .rainbow-border'),
              ctaButton: getProps('button[class*="bg-sun-500"], a[href*="asking"] button'),
              header: getProps('header'),
              todayPanel: getProps('.bg-white\\/10, [class*="bg-band-panel"]')
            };
          });
          stylesSnapshot[r.name] = compStyles;
        }
      }
    }
  }

  await browser.close();
  return stylesSnapshot;
}

function compareImages(baselinePath, currentPath, diffPath) {
  if (!fs.existsSync(baselinePath) || !fs.existsSync(currentPath)) {
    return { error: 'Missing image files' };
  }

  const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
  const img2 = PNG.sync.read(fs.readFileSync(currentPath));

  const width = Math.max(img1.width, img2.width);
  const height = Math.max(img1.height, img2.height);

  const canvas1 = new PNG({ width, height });
  const canvas2 = new PNG({ width, height });

  PNG.bitblt(img1, canvas1, 0, 0, img1.width, img1.height, 0, 0);
  PNG.bitblt(img2, canvas2, 0, 0, img2.width, img2.height, 0, 0);

  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(canvas1.data, canvas2.data, diff.data, width, height, { threshold: 0.1 });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  const totalPixels = width * height;
  const diffPercentage = parseFloat(((diffPixels / totalPixels) * 100).toFixed(2));
  const note = (img1.width !== img2.width || img1.height !== img2.height)
    ? `Size shift: ${img1.width}x${img1.height} vs ${img2.width}x${img2.height} (${diffPercentage}% diff)`
    : (diffPercentage === 0 ? 'Exact match' : `${diffPercentage}% visual diff`);

  return { diffPixels, totalPixels, diffPercentage, note };
}

async function run() {
  const mode = process.argv[2] || 'diff';

  if (mode === 'baseline') {
    console.log('Capturing BASELINE screenshots and computed styles...');
    const styles = await captureSet(BASELINE_DIR);
    fs.writeFileSync(path.join(BASE_DIR, 'baseline-styles.json'), JSON.stringify(styles, null, 2));
    console.log('✓ Baseline captured successfully into docs/screenshots/baseline/');
    return;
  }

  console.log('Capturing CURRENT screenshots and running visual diff against baseline...');
  const currentStyles = await captureSet(CURRENT_DIR);
  fs.writeFileSync(path.join(BASE_DIR, 'current-styles.json'), JSON.stringify(currentStyles, null, 2));

  const baselineStyles = fs.existsSync(path.join(BASE_DIR, 'baseline-styles.json'))
    ? JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'baseline-styles.json'), 'utf8'))
    : {};

  const diffReport = [];

  for (const r of ROUTES) {
    for (const width of [1280, 360]) {
      for (const theme of ['light', 'dark']) {
        const filename = `${r.name}_${width}px_${theme}.png`;
        const baseImg = path.join(BASELINE_DIR, filename);
        const currImg = path.join(CURRENT_DIR, filename);
        const diffImg = path.join(DIFF_DIR, filename);

        const result = compareImages(baseImg, currImg, diffImg);
        diffReport.push({
          route: r.name,
          viewport: `${width}px`,
          theme,
          filename,
          diffPercentage: result.diffPercentage ?? null,
          diffPixels: result.diffPixels ?? null,
          note: result.note || (result.diffPercentage === 0 ? 'Exact match' : 'Visual change detected')
        });
      }
    }
  }

  fs.writeFileSync(path.join(BASE_DIR, 'visual-diff-report.json'), JSON.stringify(diffReport, null, 2));

  console.log('\n================ VISUAL DIFF SUMMARY ================');
  console.table(diffReport.slice(0, 14));
  const changedScreens = diffReport.filter(d => (d.diffPercentage || 0) > 0.05);
  console.log(`\nTotal screens compared: ${diffReport.length}. Changed screens (>0.05%): ${changedScreens.length}`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

