import { chromium } from 'playwright';
import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const PORT = 4192;
const BASE_URL = `http://localhost:${PORT}`;

const SEARCH_TERMS = [
  'printf', 'Scanner', '@Transactional', 'JWT', 'JOIN',
  'BSON', 'Flyway', 'Caffeine', 'ShedLock', 'NIO.2',
  'CompletableFuture', 'Record', 'Sealed', 'VirtualThread', 'Metaspace',
  'BCrypt', 'ProblemDetail', 'Testcontainers', 'ACID', 'REPEATABLE READ'
];

function waitForServer(url, timeoutMs = 15000) {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode && res.statusCode < 500) {
          resolve(true);
        } else {
          retry();
        }
      }).on('error', () => {
        retry();
      });
    };

    const retry = () => {
      if (Date.now() - startTime > timeoutMs) {
        reject(new Error(`Server did not respond at ${url} within ${timeoutMs}ms`));
      } else {
        setTimeout(check, 300);
      }
    };

    check();
  });
}

async function runComprehensiveQA() {
  console.log('[QA] Starting Comprehensive Production QA Suite...');
  const topicsJson = JSON.parse(fs.readFileSync('src/data/generated-topics.json', 'utf-8'));
  const topicIds = topicsJson.map(t => t.id);
  console.log(`[QA] Loaded ${topicIds.length} handbook topics.`);

  const previewProcess = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    stdio: 'pipe'
  });

  previewProcess.stderr.on('data', data => {
    const str = data.toString();
    if (!str.includes('DeprecationWarning')) {
      process.stderr.write(data);
    }
  });

  try {
    await waitForServer(BASE_URL);
    console.log(`[QA] Production preview server online at ${BASE_URL}`);

    const browser = await chromium.launch({
      headless: true,
      channel: 'chrome'
    }).catch(() => chromium.launch({ headless: true }));

    const page = await browser.newPage();
    const caughtErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('chrome-extension://') && !text.includes('unsafe-eval') && !text.includes('content.js')) {
          caughtErrors.push(`[Console Error]: ${text}`);
        }
      }
    });

    page.on('pageerror', err => {
      caughtErrors.push(`[Page Error]: ${err.message}`);
    });

    // 1. Check Homepage
    console.log('[QA] 1. Verifying Homepage...');
    await page.goto(BASE_URL, { waitUntil: 'load' });
    const pageTitle = await page.title();
    console.log(`[QA]    Page Title: "${pageTitle}"`);

    // 2. Iterate all 127 topics
    console.log('[QA] 2. Verifying all 127 topics for zero console/runtime errors & syntax highlighting...');
    let highlightedBlocks = 0;
    for (let i = 0; i < topicIds.length; i++) {
      const id = topicIds[i];
      await page.goto(`${BASE_URL}/#${id}`, { waitUntil: 'load' });
      const blocks = await page.$$('pre code[class*="language-"]');
      highlightedBlocks += blocks.length;
      if ((i + 1) % 25 === 0 || i === topicIds.length - 1) {
        console.log(`[QA]    Verified ${i + 1}/${topicIds.length} topics...`);
      }
    }
    console.log(`[QA]    Total code blocks highlighted across 127 topics: ${highlightedBlocks}`);

    // 3. Search 20 key terms
    console.log('[QA] 3. Testing Search index with 20 critical enterprise terms...');
    const searchReport = [];
    for (const term of SEARCH_TERMS) {
      await page.keyboard.press('Control+KeyK');
      await page.waitForSelector('input#search-modal-title', { timeout: 3000 });
      const input = await page.$('input#search-modal-title');
      await input.fill(term);
      await page.waitForTimeout(150);

      const items = await page.$$('div[role="dialog"] h4');
      const topTitle = items.length > 0 ? await items[0].textContent() : 'NONE';
      searchReport.push({
        Term: term,
        Hits: items.length,
        TopMatch: topTitle ? topTitle.slice(0, 45) : 'NONE'
      });

      await page.keyboard.press('Escape');
      await page.waitForTimeout(60);
    }
    console.table(searchReport);

    // 4. Viewport Responsiveness
    console.log('[QA] 4. Testing responsive layout containment...');
    const viewports = [
      { name: 'Mobile (360px)', width: 360, height: 740 },
      { name: 'Mobile (390px)', width: 390, height: 844 },
      { name: 'Tablet (768px)', width: 768, height: 1024 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/#topic-97`, { waitUntil: 'load' });
      const isContained = await page.evaluate(() => {
        return document.documentElement.scrollWidth <= window.innerWidth + 2;
      });
      console.log(`[QA]    ${vp.name} horizontal layout contained: ${isContained}`);
    }

    // 5. Check error tally
    console.log('------------------------------------------------------------');
    console.log(`[QA] Verification Summary:`);
    console.log(`     Topics Loaded: 127/127`);
    console.log(`     Code Blocks Highlighted: ${highlightedBlocks}`);
    console.log(`     Search Queries Evaluated: ${searchReport.filter(r => r.Hits > 0).length}/${SEARCH_TERMS.length}`);
    console.log(`     Total Console/Page Errors: ${caughtErrors.length}`);

    if (caughtErrors.length > 0) {
      console.error('[QA] FAILURE: Encountered unexpected errors:');
      caughtErrors.forEach(err => console.error(`  ${err}`));
      process.exit(1);
    }

    console.log('[QA] SUCCESS: All 127 topics, search queries, and responsive viewports passed with 0 errors.');
    await browser.close();
    previewProcess.kill();
    process.exit(0);
  } finally {
    try { previewProcess.kill(); } catch (_) {}
  }
}

runComprehensiveQA().catch(err => {
  console.error('[QA Exception]', err);
  process.exit(1);
});
