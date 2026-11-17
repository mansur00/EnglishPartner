import puppeteer from 'puppeteer-core';

const ROUTES = [
  { name: 'Landing', path: '/', hasSidebar: false, hasBand: false },
  { name: 'Dashboard', path: '/dashboard', hasSidebar: true, hasBand: true },
  { name: 'Explore', path: '/explore', hasSidebar: true, hasBand: false },
  { name: 'Category', path: '/explore/category/shopping-and-money', hasSidebar: true, hasBand: false },
  { name: 'Conversation', path: '/conversations/asking-price-product-details', hasSidebar: true, hasBand: false },
  { name: 'Vocabulary', path: '/vocabulary', hasSidebar: true, hasBand: false },
  { name: 'Admin', path: '/admin', hasSidebar: false, hasBand: false }
];

const VIEWPORTS = [1280, 360];
const THEMES = ['light', 'dark'];
const SCROLLS = [0, 1200];

async function run() {
  console.log('======================================================');
  console.log('       RUNNING LAYOUT INVARIANTS AUDIT SUITE          ');
  console.log('======================================================\n');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  let totalAssertions = 0;
  let failures = [];

  for (const route of ROUTES) {
    for (const width of VIEWPORTS) {
      const height = width === 1280 ? 900 : 800;
      await page.setViewport({ width, height });

      for (const theme of THEMES) {
        await page.goto(`http://localhost:3000${route.path}`, { waitUntil: 'networkidle0' });
        await page.evaluate((t) => {
          if (t === 'dark') document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');
        }, theme);

        let sidebarTopAt0 = null;
        let sidebarTopAt1200 = null;

        for (const scrollY of SCROLLS) {
          if (scrollY > 0) {
            await page.evaluate((y) => window.scrollTo(0, y), scrollY);
            await new Promise(r => setTimeout(r, 50));
          } else {
            await page.evaluate(() => window.scrollTo(0, 0));
            await new Promise(r => setTimeout(r, 50));
          }

          const metrics = await page.evaluate((hasSidebar, hasBand, isDesktop) => {
            const header = document.querySelector('header');
            const sidebar = document.querySelector('aside');
            const band = document.querySelector('[class*="from-brand-800"]');

            const docEl = document.documentElement;
            const computedStyle = window.getComputedStyle(docEl);
            const tokenHeaderH = computedStyle.getPropertyValue('--header-h').trim();

            const hRect = header ? header.getBoundingClientRect() : null;
            const sRect = sidebar ? sidebar.getBoundingClientRect() : null;
            const bRect = band ? band.getBoundingClientRect() : null;

            // Check elements above header at scrollY=0
            let elementsAboveHeader = [];
            if (window.scrollY === 0) {
              const all = document.querySelectorAll('body *');
              all.forEach(el => {
                const r = el.getBoundingClientRect();
                const cs = window.getComputedStyle(el);
                if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return;
                // Exclude intentional negative margins or subpixel offsets (like rainbow-border -2px inset)
                if (r.top < -2.5 && r.height > 0 && r.width > 0 && cs.position !== 'fixed' && cs.position !== 'absolute') {
                  elementsAboveHeader.push({
                    tag: el.tagName,
                    class: el.className,
                    top: r.top
                  });
                }
              });
            }

            return {
              headerTop: hRect ? hRect.top : null,
              headerHeight: hRect ? hRect.height : null,
              tokenHeaderH,
              sidebarTop: sRect ? sRect.top : null,
              sidebarRight: sRect ? sRect.right : null,
              bandLeft: bRect ? bRect.left : null,
              scrollWidth: docEl.scrollWidth,
              clientWidth: window.innerWidth,
              elementsAboveHeader
            };
          }, route.hasSidebar, route.hasBand, width === 1280);

          const context = `${route.name} (${width}px, ${theme}, scrollY=${scrollY})`;

          // 1. Invariant: header rect.top === 0 at all scroll positions
          totalAssertions++;
          if (metrics.headerTop === null || Math.abs(metrics.headerTop) > 0.5) {
            failures.push(`[${context}] Header rect.top is ${metrics.headerTop}px (expected 0px)`);
          }

          // 2. Invariant: header height === var(--header-h)
          totalAssertions++;
          // Parse tokenHeaderH (e.g. 4rem = 64px)
          const expectedHeaderH = parseFloat(metrics.tokenHeaderH) * 16;
          if (Math.abs(metrics.headerHeight - expectedHeaderH) > 1.0) {
            failures.push(`[${context}] Header height is ${metrics.headerHeight}px (expected ${expectedHeaderH}px based on --header-h)`);
          }

          // 3. Invariant: desktop sidebar rect.top === header height
          if (width === 1280 && route.hasSidebar) {
            totalAssertions++;
            if (metrics.sidebarTop === null || Math.abs(metrics.sidebarTop - expectedHeaderH) > 1.0) {
              failures.push(`[${context}] Desktop sidebar rect.top is ${metrics.sidebarTop}px (expected ${expectedHeaderH}px)`);
            }
            if (scrollY === 0) sidebarTopAt0 = metrics.sidebarTop;
            if (scrollY === 1200) sidebarTopAt1200 = metrics.sidebarTop;
          }

          // 4. Invariant: nothing visible above the header at scrollY=0
          if (scrollY === 0) {
            totalAssertions++;
            if (metrics.elementsAboveHeader.length > 0) {
              failures.push(`[${context}] Elements visible above header at scrollY=0: ${JSON.stringify(metrics.elementsAboveHeader)}`);
            }
          }

          // 5. Invariant: header band left edge equals sidebar right edge on desktop
          if (width === 1280 && route.hasBand) {
            totalAssertions++;
            if (metrics.bandLeft === null || metrics.sidebarRight === null || Math.abs(metrics.bandLeft - metrics.sidebarRight) > 1.0) {
              failures.push(`[${context}] Header band left (${metrics.bandLeft}px) != sidebar right (${metrics.sidebarRight}px)`);
            }
          }

          // 6. Invariant: no horizontal page overflow
          totalAssertions++;
          if (metrics.scrollWidth > metrics.clientWidth) {
            failures.push(`[${context}] Horizontal overflow detected: scrollWidth ${metrics.scrollWidth}px > clientWidth ${metrics.clientWidth}px`);
          }
        }

        // Check sidebar unchanged between scroll 0 and 1200
        if (width === 1280 && route.hasSidebar && sidebarTopAt0 !== null && sidebarTopAt1200 !== null) {
          totalAssertions++;
          if (Math.abs(sidebarTopAt0 - sidebarTopAt1200) > 0.5) {
            failures.push(`[${route.name} (${width}px, ${theme})] Sidebar top moved during scroll: at 0=${sidebarTopAt0}px, at 1200=${sidebarTopAt1200}px`);
          }
        }
      }
    }
  }

  // 7. Invariant Mutation: mutate --header-h to 96px and assert header.top is 0 and sidebar.top is 96px
  console.log('Testing dynamic mutation: --header-h -> 96px...');
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
  await page.addStyleTag({
    content: ':root { --header-h: 96px !important; } *, *::before, *::after { transition: none !important; }'
  });
  await new Promise(r => setTimeout(r, 100));

  const mutationMetrics = await page.evaluate(() => {
    const header = document.querySelector('header');
    const sidebar = document.querySelector('aside');
    return {
      headerTop: header ? header.getBoundingClientRect().top : null,
      headerHeight: header ? header.getBoundingClientRect().height : null,
      sidebarTop: sidebar ? sidebar.getBoundingClientRect().top : null
    };
  });

  totalAssertions += 3;
  if (mutationMetrics.headerTop === null || Math.abs(mutationMetrics.headerTop) > 0.5) {
    failures.push(`[Mutation --header-h: 96px] Header rect.top is ${mutationMetrics.headerTop}px (expected 0px)`);
  }
  if (mutationMetrics.headerHeight === null || Math.abs(mutationMetrics.headerHeight - 96) > 1.0) {
    failures.push(`[Mutation --header-h: 96px] Header height is ${mutationMetrics.headerHeight}px (expected 96px)`);
  }
  if (mutationMetrics.sidebarTop === null || Math.abs(mutationMetrics.sidebarTop - 96) > 1.0) {
    failures.push(`[Mutation --header-h: 96px] Sidebar rect.top is ${mutationMetrics.sidebarTop}px (expected 96px)`);
  }

  await browser.close();

  console.log(`Executed ${totalAssertions} assertions across 7 routes, 2 viewports, 2 themes, and 2 scroll states.`);

  if (failures.length > 0) {
    console.error(`\n❌ FAILED with ${failures.length} layout invariant violations:`);
    failures.forEach(f => console.error(`  - ${f}`));
    process.exit(1);
  } else {
    console.log(`\n✅ ALL ${totalAssertions} LAYOUT INVARIANTS PASSED STRICTLY.`);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

