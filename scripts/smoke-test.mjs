import { chromium } from 'playwright';
import { spawn } from 'child_process';
import http from 'http';

const PORT = 4178;
const BASE_URL = `http://localhost:${PORT}`;

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

async function runSmokeTest() {
  console.log(`[smoke-test] Starting preview server on port ${PORT}...`);
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
    console.log(`[smoke-test] Preview server online at ${BASE_URL}`);

    const browser = await chromium.launch({
      headless: true,
      channel: 'chrome'
    }).catch(() => chromium.launch({ headless: true }));

    const page = await browser.newPage();
    const caughtErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('chrome-extension://') && !text.includes('unsafe-eval')) {
          caughtErrors.push(`[Console Error]: ${text}`);
        }
      }
    });

    page.on('pageerror', err => {
      caughtErrors.push(`[Page Error]: ${err.message}`);
    });

    // 1. Load Homepage
    console.log('[smoke-test] Checking Homepage...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'load' });
    await page.waitForTimeout(800);

    // 2. Open at least 5 topics across different domains
    const testTopics = [
      'topic-01', // Java SE Core
      'topic-03', // Java SE (printf)
      'topic-67', // Jakarta EE (Servlets)
      'topic-97', // Spring Boot (@Transactional)
      'topic-124' // Database (Visual SQL JOINs)
    ];

    for (const topicId of testTopics) {
      console.log(`[smoke-test] Opening ${topicId}...`);
      await page.goto(`${BASE_URL}/#${topicId}`, { waitUntil: 'load' });
      await page.waitForTimeout(600);

      // Verify code block highlighting
      const codeTokens = await page.locator('pre code .token').count();
      const codeBlocks = await page.locator('pre code').count();
      if (codeBlocks > 0 && codeTokens === 0) {
        caughtErrors.push(`[Highlight Warning]: Code blocks found in ${topicId} but zero highlighted tokens`);
      }
    }

    // 3. Check deep link navigation & legacy aliases
    console.log('[smoke-test] Checking deep links & legacy aliases...');
    const navTests = [
      { path: '#saved', expectedTitleSubstr: '' },
      { path: '#progress', expectedTitleSubstr: '' },
      { path: '#topic-134', expectedTitleSubstr: 'Message' }, // topic-134 in Part 5: The Life of One Message Through a Flow
      { path: '#topic-76', expectedTitleSubstr: 'Security' },    // topic-76: Jakarta Web Security Essentials
      { path: '#topic-81', expectedTitleSubstr: 'Pool' }         // topic-81: JDBC Connection Pooling
    ];

    for (const t of navTests) {
      await page.goto(`${BASE_URL}/${t.path}`, { waitUntil: 'load' });
      await page.waitForTimeout(400);
      if (t.expectedTitleSubstr) {
        const bodyText = await page.innerText('body');
        if (!bodyText.toLowerCase().includes(t.expectedTitleSubstr.toLowerCase())) {
          caughtErrors.push(`[Navigation Warning]: ${t.path} did not resolve to expected content containing "${t.expectedTitleSubstr}"`);
        }
      }
    }

    // 4. Test Viewports (360px, 390px, 768px)
    console.log('[smoke-test] Testing mobile and tablet viewports (360px, 390px, 768px)...');
    for (const width of [360, 390, 768]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(`${BASE_URL}/#topic-124`, { waitUntil: 'load' });
      await page.waitForTimeout(400);
      // Verify no horizontal page blowup
      const bodyWidth = await page.evaluate(() => document.body.clientWidth);
      if (bodyWidth > width + 5) {
        caughtErrors.push(`[Viewport Error]: Page body width ${bodyWidth}px exceeds viewport width ${width}px on #topic-124`);
      }
    }

    await browser.close();

    if (caughtErrors.length > 0) {
      console.error('\n[smoke-test] FAILED with the following errors:');
      caughtErrors.forEach(e => console.error(' - ' + e));
      process.exit(1);
    } else {
      console.log('\n[smoke-test] SUCCESS: Production build verified cleanly with zero errors.');
      process.exit(0);
    }
  } finally {
    if (previewProcess.pid) {
      // Kill preview process on Windows
      spawn('taskkill', ['/pid', String(previewProcess.pid), '/f', '/t'], { shell: true });
    }
  }
}

runSmokeTest().catch(err => {
  console.error('[smoke-test] Unexpected failure:', err);
  process.exit(1);
});
