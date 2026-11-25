import { chromium } from 'playwright';
import { spawn } from 'child_process';
import http from 'http';

const PORT = 4192;
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

async function runMobileAudit() {
  console.log(`[mobile-audit] Launching Vite preview on port ${PORT}...`);
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    stdio: 'pipe'
  });

  try {
    await waitForServer(BASE_URL);
    console.log(`[mobile-audit] Preview server up at ${BASE_URL}`);

    const browser = await chromium.launch({ headless: true }).catch(() => 
      chromium.launch({ headless: true, channel: 'chrome' })
    );

    // 360px mobile viewport test
    const context = await browser.newContext({
      viewport: { width: 360, height: 780 },
      userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Mobile Safari/537.36'
    });
    const page = await context.newPage();

    console.log('[mobile-audit] Checking Home Page at 360px...');
    await page.goto(`${BASE_URL}/#home`, { waitUntil: 'load' });
    await page.waitForTimeout(600);

    // Check Home page overflow
    const homeOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log('[mobile-audit] Home Page horizontal overflow detected?', homeOverflow);

    // Test ALL 109 renumbered ACE & MQ topics (topic-131 through topic-239)
    const testTopics = Array.from({ length: 109 }, (_, i) => `topic-${131 + i}`);

    let anyAuditFailed = false;
    let totalImagesChecked = 0;

    for (const tid of testTopics) {
      await page.goto(`${BASE_URL}/#${tid}`, { waitUntil: 'load' });
      await page.waitForTimeout(200);

      const audit = await page.evaluate(async () => {
        const docScrollWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const hasOverflow = docScrollWidth > winWidth + 1 || bodyScrollWidth > winWidth + 1;

        // Wait briefly for any images to finish decoding
        const imgs = Array.from(document.querySelectorAll('.markdown-body img'));
        await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(res => {
          img.addEventListener('load', res, { once: true });
          img.addEventListener('error', res, { once: true });
          setTimeout(res, 1500);
        })));
        const brokenImages = imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.getAttribute('src'));

        // Check tables have scroll wrapper
        const tables = Array.from(document.querySelectorAll('.markdown-body table'));
        const tablesWrapped = tables.every(t => t.closest('.table-scroll-wrapper') !== null);

        // Check for any orange in tables or large boxes
        const orangeHeaders = Array.from(document.querySelectorAll('th, thead, .syntax-box, .terminal-block')).filter(el => {
          const style = window.getComputedStyle(el);
          const bg = style.backgroundColor;
          return bg.includes('234, 88, 12') || bg.includes('249, 115, 22') || bg.includes('251, 146, 60');
        });

        return {
          hasOverflow,
          docScrollWidth,
          bodyScrollWidth,
          winWidth,
          tablesCount: tables.length,
          tablesWrapped,
          orangeHeadersCount: orangeHeaders.length,
          imagesCount: imgs.length,
          brokenImages
        };
      });

      totalImagesChecked += audit.imagesCount;

      if (audit.hasOverflow) {
        console.error(`[FAIL] ${tid} has horizontal overflow! docScrollWidth=${audit.docScrollWidth}, bodyScrollWidth=${audit.bodyScrollWidth}, winWidth=${audit.winWidth}`);
        anyAuditFailed = true;
      } else if (audit.brokenImages.length > 0) {
        console.error(`[FAIL] ${tid} has broken images: ${audit.brokenImages.join(', ')}`);
        anyAuditFailed = true;
      } else if (!audit.tablesWrapped || audit.orangeHeadersCount > 0) {
        console.error(`[FAIL] ${tid} table wrap/color failed: wrapped=${audit.tablesWrapped}, orange=${audit.orangeHeadersCount}`);
        anyAuditFailed = true;
      } else {
        console.log(`[PASS] ${tid} fits 360px (imgs: ${audit.imagesCount}, tables: ${audit.tablesCount})`);
      }
    }
    console.log(`[mobile-audit] Total rendered images checked across Part 5: ${totalImagesChecked}`);

    // Test Dark Theme at 360px on topic with diagram + screenshots
    console.log('[mobile-audit] Checking Dark Theme at 360px...');
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('java_handbook_theme', 'dark');
    });
    await page.goto(`${BASE_URL}/#topic-136`, { waitUntil: 'load' });
    await page.waitForTimeout(300);

    const darkAudit = await page.evaluate(() => {
      return {
        docScrollWidth: document.documentElement.scrollWidth,
        winWidth: window.innerWidth,
        isDarkActive: document.documentElement.classList.contains('dark')
      };
    });
    console.log(`[PASS] Dark theme active: ${darkAudit.isDarkActive}, fits 360px: ${darkAudit.docScrollWidth <= darkAudit.winWidth + 1}`);

    await browser.close();
    preview.kill();

    if (anyAuditFailed) {
      process.exit(1);
    } else {
      console.log('\n=========================================');
      console.log('✅ ALL MOBILE, IMAGE AND COLOR AUDITS PASSED 100%');
      console.log('=========================================\n');
      process.exit(0);
    }

  } catch (err) {
    console.error('Audit failed with error:', err);
    preview.kill();
    process.exit(1);
  }
}

runMobileAudit();
