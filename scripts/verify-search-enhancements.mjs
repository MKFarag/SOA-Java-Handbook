import { chromium } from 'playwright';
import { spawn } from 'child_process';
import http from 'http';

const PORT = 4198;
const BASE_URL = `http://localhost:${PORT}`;

function waitForServer(url, timeoutMs = 20000) {
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

async function runSearchVerification() {
  console.log(`[search-test] Starting Vite preview on port ${PORT}...`);
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    stdio: 'pipe'
  });

  try {
    await waitForServer(BASE_URL);
    console.log(`[search-test] Server running at ${BASE_URL}`);

    const browser = await chromium.launch({ headless: true }).catch(() =>
      chromium.launch({ headless: true, channel: 'chrome' })
    );

    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/#home`, { waitUntil: 'load' });
    await page.waitForTimeout(600);

    // 1. Open Search Modal via Ctrl+K
    console.log('[search-test] Opening Search Modal with Ctrl+K...');
    await page.keyboard.press('Control+KeyK');
    await page.waitForSelector('input#search-modal-title');

    // 2. Test Multi-word Search: "Create node"
    console.log('[search-test] Typing "Create node"...');
    await page.fill('input#search-modal-title', 'Create node');
    await page.waitForTimeout(300);

    const resultTitles = await page.$$eval('[role="dialog"] .overflow-y-auto > div h4', elements => {
      return elements.map(el => el.textContent.trim());
    });
    console.log(`[search-test] Results for "Create node": count=${resultTitles.length}`);
    resultTitles.forEach((t, i) => console.log(`   ${i + 1}. ${t}`));

    if (resultTitles.length > 15) {
      throw new Error(`Expected clean focused results (<=15), but got ${resultTitles.length}`);
    }
    if (!resultTitles.some(t => t.includes('Compute Node'))) {
      throw new Error('Expected "The Compute Node Overview" in results');
    }
    // Check for Best Matches header and Related Topics divider
    const bestHeader = page.locator('[role="dialog"] :has-text("Best Matches")').first();
    const isBestVisible = await bestHeader.isVisible();
    if (!isBestVisible) {
      throw new Error('Expected "Best Matches" section header to be visible');
    }
    console.log('✅ "Best Matches" header is visible!');

    const relatedHeader = page.locator('[role="dialog"] :has-text("You Might Also Mean / Related Topics")').first();
    const isRelatedVisible = await relatedHeader.isVisible();
    if (!isRelatedVisible) {
      throw new Error('Expected "You Might Also Mean / Related Topics" divider to be visible');
    }
    console.log('✅ "You Might Also Mean / Related Topics" section divider is visible!');

    const bestPills = await page.locator('[role="dialog"] span:has-text("Best Match")').count();
    console.log(`✅ Found ${bestPills} item(s) tagged with "Best Match" badge!`);
    if (bestPills === 0) {
      throw new Error('Expected at least one topic with "Best Match" badge');
    }

    // 3. Test Part Filtering on "policy"
    console.log('[search-test] Clearing query and searching "policy"...');
    await page.fill('input#search-modal-title', 'policy');
    await page.waitForTimeout(300);

    const acePill = page.locator('[role="dialog"] button:has-text("ACE & MQ")').first();
    await acePill.click();
    await page.waitForTimeout(300);

    const aceResults = await page.$$eval('[role="dialog"] .overflow-y-auto > div h4', elements => {
      return elements.map(el => el.textContent.trim());
    });
    console.log(`[search-test] Filtered ACE results for "policy":`, aceResults);
    if (!aceResults.some(t => t.includes('Runtime Properties') || t.includes('Key Words'))) {
      throw new Error('Expected ACE policy topic in filtered results');
    }
    console.log('✅ Policy filter test passed!');

    // 4. Test Keyboard Arrow Navigation and Scrolling
    console.log('[search-test] Testing keyboard navigation (ArrowDown)...');
    const allPill = page.locator('[role="dialog"] button:has-text("All Topics")').first();
    await allPill.click();
    await page.waitForTimeout(200);

    const initialScrollTop = await page.$eval('[role="dialog"] .overflow-y-auto', el => el.scrollTop);
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(50);
    }
    const scrolledTop = await page.$eval('[role="dialog"] .overflow-y-auto', el => el.scrollTop);
    console.log(`[search-test] Container scroll: initial=${initialScrollTop}, after-arrows=${scrolledTop}`);
    if (scrolledTop <= initialScrollTop) {
      throw new Error('Expected list container to scroll automatically with arrow keys');
    }
    console.log('✅ Keyboard auto-scrolling test passed!');

    await browser.close();
    preview.kill();
    console.log('\n=============================================');
    console.log('🎉 ALL SEARCH ENGINE TESTS PASSED 100%!');
    console.log('=============================================');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Search test failed:', err);
    try { preview.kill(); } catch {}
    process.exit(1);
  }
}

runSearchVerification();
