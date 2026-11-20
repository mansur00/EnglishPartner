import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/mdmansur/.gemini/antigravity/brain/eae8b167-b213-49c8-b419-2baa5537d70f';
const DOCS_SCREENSHOTS = path.resolve('docs/screenshots');
if (!fs.existsSync(DOCS_SCREENSHOTS)) {
  fs.mkdirSync(DOCS_SCREENSHOTS, { recursive: true });
}

const ROUTES = [
  { name: 'Landing', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Explore', path: '/explore' },
  { name: 'Category', path: '/explore/category/shopping-and-money' },
  { name: 'Reader', path: '/conversations/asking-price-product-details' },
  { name: 'Vocabulary', path: '/vocabulary' },
  { name: 'Admin', path: '/admin' }
];

const TRANSITION_RESET = ' *, *::before, *::after { transition: none !important; animation-duration: 0s !important; }';

const MUTATIONS = [
  {
    token: '--brand-800',
    override: 'hotpink',
    css: `:root { --brand-800: hotpink !important; --color-brand-800: hotpink !important; }${TRANSITION_RESET}`
  },
  {
    token: '--radius-card',
    override: '0px',
    css: `:root { --radius-card: 0px !important; } [data-slot="card"], .topic-card { border-radius: var(--radius-card) !important; }${TRANSITION_RESET}`
  },
  {
    token: '--radius-control',
    override: '0px',
    css: `:root { --radius-control: 0px !important; } button:not([class*="rounded-pill"]):not([class*="rounded-full"]), input, select { border-radius: var(--radius-control) !important; }${TRANSITION_RESET}`
  },
  {
    token: '--font-weight-heading',
    override: '300',
    css: `:root { --font-weight-heading: 300 !important; } h1, h2, h3, h4, .font-heading { font-weight: var(--font-weight-heading) !important; }${TRANSITION_RESET}`
  },
  {
    token: '--text-page-title',
    override: '60px',
    css: `:root { --text-page-title: 60px !important; } .text-page-title { font-size: var(--text-page-title) !important; }${TRANSITION_RESET}`
  },
  {
    token: '--header-h',
    override: '96px',
    css: `:root { --header-h: 96px !important; } header, .h-header { height: var(--header-h) !important; }${TRANSITION_RESET}`
  },
  {
    token: '--container-max',
    override: '800px',
    css: `:root { --container-max: 800px !important; } .container-app, .max-w-5xl { max-width: var(--container-max) !important; }${TRANSITION_RESET}`
  },
  {
    token: '--topic-tile',
    override: 'lime',
    css: `:root { --topic-tile: lime !important; --color-topic-tile: lime !important; } [data-topic] { --topic-tile: lime !important; --color-topic-tile: lime !important; } .emoji-tile, [class*="bg-topic-tile"] { background-color: var(--topic-tile) !important; }${TRANSITION_RESET}`
  },
  {
    token: '--sun-500',
    override: 'cyan',
    css: `:root { --sun-500: cyan !important; --color-sun-500: cyan !important; } .bg-cta, [class*="bg-sun-500"] { background-color: var(--sun-500) !important; }${TRANSITION_RESET}`
  }
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // --- PART 1: CAPTURE FRESH SCREENSHOTS (1280px & 360px, Light & Dark) ---
  console.log('Capturing fresh screenshots for key pages into docs/screenshots/ and brain artifact dir...');
  const keyPages = [
    { name: 'landing', url: 'http://localhost:3000/' },
    { name: 'dashboard', url: 'http://localhost:3000/dashboard' },
    { name: 'explore', url: 'http://localhost:3000/explore' },
    { name: 'reader', url: 'http://localhost:3000/conversations/asking-price-product-details' },
    { name: 'vocabulary', url: 'http://localhost:3000/vocabulary' }
  ];

  for (const p of keyPages) {
    for (const width of [1280, 360]) {
      const height = width === 1280 ? 900 : 800;
      await page.setViewport({ width, height });

      for (const theme of ['light', 'dark']) {
        await page.goto(p.url, { waitUntil: 'networkidle0' });
        await page.evaluate((t) => {
          if (t === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }, theme);
        await new Promise(r => setTimeout(r, 100));

        const filename = `${p.name}_${width}px_${theme}.png`;
        const localPath = path.join(DOCS_SCREENSHOTS, filename);
        const artifactPath = path.join(ARTIFACT_DIR, filename);

        await page.screenshot({ path: localPath, fullPage: true });
        fs.copyFileSync(localPath, artifactPath);
        console.log(`  ✓ Saved screenshot: ${filename}`);
      }
    }
  }

  // --- PART 2: TOKEN MUTATION TESTS ---
  console.log('\nRunning Token Mutation Tests across routes...');
  const mutationResults = [];

  for (const mut of MUTATIONS) {
    console.log(`\nTesting mutation: ${mut.token} -> ${mut.override}`);
    const unmutatedElements = [];

    for (const route of ROUTES) {
      await page.setViewport({ width: 1280, height: 900 });
      await page.goto(`http://localhost:3000${route.path}`, { waitUntil: 'networkidle0' });

      // Apply mutation override via style tag
      await page.addStyleTag({ content: mut.css });
      await new Promise(r => setTimeout(r, 100));

      const evaluation = await page.evaluate((tok) => {
        const failures = [];

        if (tok === '--brand-800') {
          // Brand buttons, brand logo badges, header band
          const brandItems = document.querySelectorAll('.bg-brand-800, [class*="from-brand-800"], .text-brand-800, [class*="text-brand-800"]');
          brandItems.forEach((el) => {
            const cs = window.getComputedStyle(el);
            const bg = cs.backgroundImage !== 'none' ? cs.backgroundImage : cs.backgroundColor;
            const color = cs.color;
            const isMutated = bg.includes('255, 105, 180') || bg.includes('hotpink') || color.includes('255, 105, 180') || color.includes('hotpink');
            if (!isMutated) {
              failures.push({
                element: `${el.tagName.toLowerCase()}.${el.className.split(' ').slice(0, 4).join('.')}`,
                text: el.textContent.trim().substring(0, 25),
                property: 'background/color',
                expected: 'hotpink / rgb(255, 105, 180)',
                actual: `${bg} | ${color}`,
                hint: 'Element bound to static class rather than dynamic --brand-800'
              });
            }
          });
        } else if (tok === '--radius-card') {
          // Cards should be 0px
          const cards = document.querySelectorAll('[data-slot="card"], [class*="rounded-[16px]"], .rounded-card');
          cards.forEach((el) => {
            const cs = window.getComputedStyle(el);
            if (cs.borderRadius !== '0px') {
              failures.push({
                element: `${el.tagName.toLowerCase()}.${el.className.split(' ').slice(0, 3).join('.')}`,
                property: 'borderRadius',
                expected: '0px',
                actual: cs.borderRadius,
                hint: 'Card radius hard-coded via rounded-[16px] rather than rounded-card token'
              });
            }
          });
        } else if (tok === '--radius-control') {
          // Buttons and inputs should be 0px (excluding pill buttons like language badge and avatars)
          const controls = document.querySelectorAll('button:not([class*="rounded-pill"]):not([class*="rounded-full"]), input, select');
          controls.forEach((el) => {
            const cs = window.getComputedStyle(el);
            if (cs.borderRadius !== '0px') {
              failures.push({
                element: `${el.tagName.toLowerCase()}.${el.className.split(' ').slice(0, 3).join('.')}`,
                property: 'borderRadius',
                expected: '0px',
                actual: cs.borderRadius,
                hint: 'Control radius hard-coded via rounded-[12px] or rounded-xl rather than rounded-control token'
              });
            }
          });
        } else if (tok === '--font-weight-heading') {
          // Headings should be 300
          const headings = document.querySelectorAll('h1, h2, h3');
          headings.forEach((el) => {
            const cs = window.getComputedStyle(el);
            if (cs.fontWeight !== '300') {
              failures.push({
                element: `${el.tagName.toLowerCase()}: "${el.textContent.trim().substring(0, 20)}"`,
                property: 'fontWeight',
                expected: '300',
                actual: cs.fontWeight,
                hint: 'Heading weight hard-coded via font-semibold rather than --font-weight-heading'
              });
            }
          });
        } else if (tok === '--text-page-title') {
          // H1 should be 60px
          const h1 = document.querySelector('h1');
          if (h1) {
            const cs = window.getComputedStyle(h1);
            if (cs.fontSize !== '60px') {
              failures.push({
                element: `h1: "${h1.textContent.trim().substring(0, 25)}"`,
                property: 'fontSize',
                expected: '60px',
                actual: cs.fontSize,
                hint: 'Page title size hard-coded via text-3xl / clamp rather than text-page-title utility'
              });
            }
          }
        } else if (tok === '--header-h') {
          // Header should be 96px
          const header = document.querySelector('header');
          if (header) {
            const cs = window.getComputedStyle(header);
            if (cs.height !== '96px') {
              failures.push({
                element: 'header',
                property: 'height',
                expected: '96px',
                actual: cs.height,
                hint: 'Header height hard-coded via h-16 rather than --header-h'
              });
            }
          }
        } else if (tok === '--container-max') {
          // Container should be 800px
          const containers = document.querySelectorAll('.container-app, .max-w-5xl, .max-w-4xl');
          containers.forEach((el) => {
            const cs = window.getComputedStyle(el);
            if (cs.maxWidth !== '800px') {
              failures.push({
                element: `${el.tagName.toLowerCase()}.${el.className.split(' ').slice(0, 2).join('.')}`,
                property: 'maxWidth',
                expected: '800px',
                actual: cs.maxWidth,
                hint: 'Container max-width hard-coded via max-w-5xl rather than container-app token'
              });
            }
          });
        } else if (tok === '--topic-tile') {
          // Emoji tile background should be lime
          const tiles = document.querySelectorAll('.emoji-tile, [class*="bg-topic-tile"]');
          tiles.forEach((el) => {
            const cs = window.getComputedStyle(el);
            if (!cs.backgroundColor.includes('0, 255, 0') && !cs.backgroundColor.includes('lime')) {
              failures.push({
                element: `${el.tagName.toLowerCase()}.${el.className}`,
                property: 'backgroundColor',
                expected: 'lime / rgb(0, 255, 0)',
                actual: cs.backgroundColor,
                hint: 'Tile background not connected to dynamic token'
              });
            }
          });
        } else if (tok === '--sun-500') {
          // CTA buttons should be cyan
          const ctas = document.querySelectorAll('.bg-cta, button[class*="bg-sun-500"]');
          ctas.forEach((el) => {
            const cs = window.getComputedStyle(el);
            if (!cs.backgroundColor.includes('0, 255, 255') && !cs.backgroundColor.includes('cyan')) {
              failures.push({
                element: `button: "${el.textContent.trim().substring(0, 20)}"`,
                property: 'backgroundColor',
                expected: 'cyan / rgb(0, 255, 255)',
                actual: cs.backgroundColor,
                hint: 'CTA background hardcoded rather than semantic --sun-500 / bg-cta token'
              });
            }
          });
        }

        return failures;
      }, mut.token);

      if (evaluation.length > 0) {
        unmutatedElements.push({
          route: route.name,
          path: route.path,
          count: evaluation.length,
          sample: evaluation.slice(0, 3)
        });
      }
    }

    mutationResults.push({
      token: mut.token,
      override: mut.override,
      failedRoutesCount: unmutatedElements.length,
      routes: unmutatedElements
    });
  }

  await browser.close();

  fs.writeFileSync(
    path.resolve('mutation-test-report.json'),
    JSON.stringify(mutationResults, null, 2)
  );

  console.log('\n======================================================');
  console.log('       TOKEN MUTATION AUDIT COMPLETE                   ');
  console.log('======================================================');
  console.log('Report saved to mutation-test-report.json');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
