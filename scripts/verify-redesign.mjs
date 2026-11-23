import { chromium } from 'playwright';
import { spawn } from 'child_process';
import http from 'http';

const PORT = 4189;
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

async function runRedesignVerification() {
  console.log(`[verify-redesign] Starting preview server on port ${PORT}...`);
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    stdio: 'pipe'
  });

  try {
    await waitForServer(BASE_URL);
    console.log(`[verify-redesign] Preview server online at ${BASE_URL}`);

    const browser = await chromium.launch({
      headless: true,
      channel: 'chrome'
    }).catch(() => chromium.launch({ headless: true }));

    const page = await browser.newPage();
    const caughtErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('chrome-extension://')) {
        caughtErrors.push(`[Console Error]: ${msg.text()}`);
      }
    });

    page.on('pageerror', err => {
      caughtErrors.push(`[Page Error]: ${err.message}`);
    });

    // 1. Verify Desktop Top Navigation & Branding
    console.log('Test 1: Desktop Layout, Logo & Section Tabs...');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/#topic-01`, { waitUntil: 'load' });
    await page.waitForTimeout(600);

    // Check SVG logo exists
    const logoSvg = page.locator('header svg[viewBox="0 0 48 48"]');
    const isLogoVisible = await logoSvg.isVisible();
    if (!isLogoVisible) caughtErrors.push('Logo SVG is not visible in Header');

    // Check 4 Main Section Tabs exist in Header
    const sectionTabs = page.locator('header nav button');
    const tabCount = await sectionTabs.count();
    console.log(` - Main section tabs in desktop header: ${tabCount}`);
    if (tabCount < 4) caughtErrors.push(`Expected 4 main section tabs, found ${tabCount}`);

    // Verify section switching dynamically updates the sidebar
    console.log('Test 2: Dynamic Section Switching Updates Sidebar...');
    // Click Jakarta EE tab
    const eeTab = page.locator('header nav button:has-text("Jakarta EE")').first();
    await eeTab.click();
    await page.waitForTimeout(500);

    // Sidebar should now display Jakarta EE sections (e.g. Servlet API, Web Containers, etc.)
    const sidebarText = await page.locator('aside').innerText();
    if (!sidebarText.includes('Jakarta EE') && !sidebarText.includes('Servlet API')) {
      caughtErrors.push('Switching to Jakarta EE tab did not update sidebar to Jakarta EE sections');
    }

    // Click Spring Boot tab
    const springTab = page.locator('header nav button:has-text("Spring Boot")').first();
    await springTab.click();
    await page.waitForTimeout(500);
    const springSidebar = await page.locator('aside').innerText();
    if (!springSidebar.includes('Spring Boot') && !springSidebar.includes('Spring Core')) {
      caughtErrors.push('Switching to Spring Boot tab did not update sidebar to Spring Boot sections');
    }

    // Switch back to Java Core
    const javaTab = page.locator('header nav button:has-text("Java Core")').first();
    await javaTab.click();
    await page.waitForTimeout(500);

    // Test 3: Personal Utilities Menu
    console.log('Test 3: Personal Utilities Menu Dropdown...');
    const profileBtn = page.locator('button[title*="Personal utilities"]').first();
    await profileBtn.click();
    await page.waitForTimeout(400);

    // Check menu items
    const savedLink = page.locator('button:has-text("Saved Topics")');
    const progressLink = page.locator('button:has-text("Learning Progress")');
    const certLink = page.locator('button:has-text("Completion Certificate")');
    if (!(await savedLink.isVisible()) || !(await progressLink.isVisible()) || !(await certLink.isVisible())) {
      caughtErrors.push('Personal Utilities Menu did not display Saved, Progress, or Certificate options');
    }
    // Close menu by clicking outside
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    // Test 4: Cloud Sync Icon & Modal
    console.log('Test 4: Cloud Sync status & modal...');
    const syncBtn = page.locator('button[title*="Cloud Sync"]').first();
    if (!(await syncBtn.isVisible())) {
      caughtErrors.push('Dedicated Cloud Sync icon is not visible in Header');
    }
    await syncBtn.click();
    await page.waitForTimeout(400);
    const syncModalTitle = await page.locator('h3:has-text("Sync"), h2:has-text("Sync")').first().isVisible();
    if (!syncModalTitle) {
      caughtErrors.push('Clicking Cloud Sync did not open StudentSyncModal');
    }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Test 5: Verify Annotation Removal from the Interface
    console.log('Test 5: Verifying Annotation removal from interface...');
    await page.goto(`${BASE_URL}/#topic-03`, { waitUntil: 'load' });
    await page.waitForTimeout(600);

    const annotationBtn = page.locator('main button:has-text("Annotation")');
    const isAnnotationVisible = await annotationBtn.isVisible().catch(() => false);
    if (isAnnotationVisible) {
      caughtErrors.push('Annotation button should NOT be visible on TopicView per requirement 3');
    } else {
      console.log('  ✓ Annotation button is confirmed removed from TopicView interface');
    }

    // Test 6: Code Component & Wrap functionality
    console.log('Test 6: Code Component, Tabs, Copy & Wrap Fix...');
    await page.goto(`${BASE_URL}/#topic-30`, { waitUntil: 'load' }); // Topic with dual-tabs & long lines
    await page.waitForTimeout(800);

    const codeContainer = page.locator('.code-tab-container').first();
    if (!(await codeContainer.isVisible())) {
      caughtErrors.push('Code container not found on topic-30');
    }

    // Verify Line numbers exist
    const lineNums = codeContainer.locator('.line-num');
    const lineNumCount = await lineNums.count();
    console.log(` - Code block line numbers detected: ${lineNumCount}`);
    if (lineNumCount < 5) {
      caughtErrors.push(`Expected line numbers in code block, found ${lineNumCount}`);
    }

    // Verify Output Tab Switching
    const outputTabBtn = codeContainer.locator('button:has-text("Output")');
    if (await outputTabBtn.isVisible()) {
      await outputTabBtn.click();
      await page.waitForTimeout(300);
      const isOutputVisible = await codeContainer.locator('.tab-pane-output').isVisible();
      if (!isOutputVisible) caughtErrors.push('Clicking Output tab did not display output pane');

      const codeTabBtn = codeContainer.locator('button:has-text("Code")');
      await codeTabBtn.click();
      await page.waitForTimeout(300);
    }

    // Verify Copy button
    const copyBtn = codeContainer.locator('.copy-btn');
    await copyBtn.click();
    await page.waitForTimeout(200);
    const copyText = await copyBtn.innerText();
    if (!copyText.includes('Copied')) {
      caughtErrors.push('Clicking Copy did not trigger "Copied!" feedback');
    }

    // Test Wrap functionality!
    const wrapBtn = codeContainer.locator('.wrap-btn');
    // Initially un-wrapped
    let hasWrappedClass = await codeContainer.evaluate(el => el.classList.contains('code-wrapped'));
    console.log(` - Initially wrapped: ${hasWrappedClass}`);

    // Click Wrap
    await wrapBtn.click();
    await page.waitForTimeout(300);
    hasWrappedClass = await codeContainer.evaluate(el => el.classList.contains('code-wrapped'));
    const isLineContentWrapped = await codeContainer.locator('.line-content').first().evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.whiteSpace === 'pre-wrap';
    });
    console.log(` - After clicking Wrap: hasWrappedClass=${hasWrappedClass}, whiteSpace=${isLineContentWrapped}`);

    if (!hasWrappedClass || !isLineContentWrapped) {
      caughtErrors.push('Wrap button did not apply pre-wrap line wrapping to code lines');
    }

    // Test 7: Mobile Viewport & Responsiveness
    console.log('Test 7: Mobile Responsiveness (375px)...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/#topic-30`, { waitUntil: 'load' });
    await page.waitForTimeout(600);

    // Verify body width does not overflow 375px
    const mobileBodyWidth = await page.evaluate(() => document.body.clientWidth);
    console.log(` - Mobile body width: ${mobileBodyWidth}px (Viewport: 375px)`);
    if (mobileBodyWidth > 380) {
      caughtErrors.push(`Mobile horizontal overflow: body is ${mobileBodyWidth}px for viewport 375px`);
    }

    // Check Mobile Nav bar at bottom
    const mobileNav = page.locator('nav[aria-label="Mobile Navigation"]');
    if (!(await mobileNav.isVisible())) {
      caughtErrors.push('Mobile bottom navigation bar is not visible on 375px viewport');
    }

    // Check Mobile Sidebar Drawer opens
    const menuBtn = page.locator('header button[title*="drawer"]').first();
    await menuBtn.click();
    await page.waitForTimeout(400);
    const mobileDrawerVisible = await page.locator('aside[aria-label*="Sidebar"]').isVisible();
    if (!mobileDrawerVisible) {
      caughtErrors.push('Mobile menu button did not open sidebar drawer');
    }

    await browser.close();

    if (caughtErrors.length > 0) {
      console.error('\n[verify-redesign] FAILED with the following errors:');
      caughtErrors.forEach(e => console.error(' ❌ ' + e));
      process.exit(1);
    } else {
      console.log('\n[verify-redesign] ALL TESTS PASSED SUCCESSFULLY! ✅');
      process.exit(0);
    }
  } finally {
    previewProcess.kill();
  }
}

runRedesignVerification().catch(err => {
  console.error('[verify-redesign] Error running verification:', err);
  process.exit(1);
});
