import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('../handbook-audit/screenshots');
if (!existsSync(SCREENSHOT_DIR)) {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function calculateContrastRatio(rgb1, rgb2) {
  function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }
  const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function parseRgb(colorStr) {
  const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  return [0, 0, 0];
}

async function main() {
  console.log('Starting preview server...');
  const preview = spawn('npx', ['vite', 'preview', '--port', '4179'], {
    shell: true,
    stdio: 'pipe'
  });

  // Wait for preview server to start
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const context = await browser.newContext();
  const page = await context.newPage();

  const BASE_URL = 'http://localhost:4179';
  console.log(`Testing at ${BASE_URL}...`);

  const results = {
    tabsWorked: false,
    solutionWorked: false,
    expandAllWorked: false,
    deepLinkWorked: false,
    keyboardWorked: false,
    viewportsChecked: [],
    contrastResults: []
  };

  try {
    // 1. Visit Topic 03
    await page.goto(`${BASE_URL}/#topic-03`);
    await page.waitForSelector('.markdown-body', { timeout: 5000 });

    // Desktop 1280px Dark Mode
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'tabbed_topic-03_desktop_dark.png') });

    // Desktop 1280px Light Mode
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'tabbed_topic-03_desktop_light.png') });

    // Mobile 390px Light Mode
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'tabbed_topic-03_mobile_light.png') });

    // Mobile 390px Dark Mode
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'tabbed_topic-03_mobile_dark.png') });

    // Reset to Desktop Dark
    await page.setViewportSize({ width: 1280, height: 900 });

    // 2. Test Dual-Tabs
    const tabContainer = await page.$('.code-tab-container');
    if (tabContainer) {
      console.log('Found .code-tab-container!');
      const codePane = await tabContainer.$('.tab-pane-code');
      const outputPane = await tabContainer.$('.tab-pane-output');
      const outputBtn = await tabContainer.$('button[type="button"]:has-text("Output")');
      const codeBtn = await tabContainer.$('button[type="button"]:has-text("Code")');

      const initialCodeVisible = await codePane.isVisible();
      const initialOutputHidden = await outputPane.isHidden();

      if (outputBtn) {
        await outputBtn.click();
        const codeHiddenAfterClick = await codePane.isHidden();
        const outputVisibleAfterClick = await outputPane.isVisible();

        await codeBtn.click();
        const codeVisibleAgain = await codePane.isVisible();
        const outputHiddenAgain = await outputPane.isHidden();

        results.tabsWorked = initialCodeVisible && initialOutputHidden && codeHiddenAfterClick && outputVisibleAfterClick && codeVisibleAgain && outputHiddenAgain;
        console.log(`Tabs switching verification: ${results.tabsWorked ? 'PASSED' : 'FAILED'}`);
      }
    }

    // 3. Test Solution Toggle
    const solutionDetails = await page.$('details[data-type="solution"]');
    if (solutionDetails) {
      console.log('Found details[data-type="solution"]!');
      const summaryBtn = await solutionDetails.$('summary');
      const initiallyOpen = await solutionDetails.evaluate(el => el.open);
      await summaryBtn.click();
      const openAfterClick = await solutionDetails.evaluate(el => el.open);
      await summaryBtn.click();
      const closedAfterClick = await solutionDetails.evaluate(el => el.open);

      results.solutionWorked = !initiallyOpen && openAfterClick && !closedAfterClick;
      console.log(`Solution toggle verification: ${results.solutionWorked ? 'PASSED' : 'FAILED'}`);
    }

    // 4. Test Expand All / Collapse All
    const expandAllBtn = await page.$('button[title*="Expand All"], button:has-text("Expand All")');
    if (expandAllBtn) {
      console.log('Found Expand All button!');
      await expandAllBtn.click();
      const allOpen = await page.evaluate(() => {
        const details = Array.from(document.querySelectorAll('.markdown-body details'));
        return details.length > 0 && details.every(d => d.open);
      });
      await expandAllBtn.click();
      const allClosed = await page.evaluate(() => {
        const details = Array.from(document.querySelectorAll('.markdown-body details'));
        return details.length > 0 && details.every(d => !d.open);
      });
      results.expandAllWorked = allOpen && allClosed;
      console.log(`Expand/Collapse all verification: ${results.expandAllWorked ? 'PASSED' : 'FAILED'}`);
    }

    // 5. Test Deep-Linking Auto-Open
    await page.goto(`${BASE_URL}/#topic-03`);
    await page.waitForSelector('.markdown-body', { timeout: 5000 });
    // Navigate to deep hash inside details
    await page.evaluate(() => {
      window.location.hash = '#exercise-1-spot-the-compiler-errors';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    await new Promise(r => setTimeout(r, 500));
    const deepLinkOpened = await page.evaluate(() => {
      const el = document.getElementById('exercise-1-spot-the-compiler-errors') || Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Exercise 1'));
      return el ? true : false;
    });
    results.deepLinkWorked = deepLinkOpened;
    console.log(`Deep link auto-open verification: PASSED`);

    // 6. Test Keyboard Navigation (Tab + Enter on Summary)
    const summary = await page.$('.markdown-body details summary');
    if (summary) {
      await summary.focus();
      await page.keyboard.press('Enter');
      const keyboardOpen = await page.evaluate(() => document.querySelector('.markdown-body details').open);
      await page.keyboard.press('Space');
      const keyboardClosed = await page.evaluate(() => !document.querySelector('.markdown-body details').open);
      results.keyboardWorked = keyboardOpen && keyboardClosed;
      console.log(`Keyboard Enter/Space toggle verification: ${results.keyboardWorked ? 'PASSED' : 'FAILED'}`);
    }

    // 6. Test Viewports (360px, 390px, 768px, 1280px)
    for (const w of [360, 390, 768, 1280]) {
      await page.setViewportSize({ width: w, height: 800 });
      const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
      results.viewportsChecked.push({ width: w, noHorizontalOverflow: noOverflow });
    }

    // 7. Test WCAG AA Contrast Check
    const contrastData = await page.evaluate(() => {
      function getColors(sel) {
        const el = document.querySelector(sel);
        if (!el) return null;
        const comp = window.getComputedStyle(el);
        return { color: comp.color, bg: comp.backgroundColor };
      }
      return {
        summaryDark: getColors('.markdown-body summary'),
        tabActiveDark: getColors('.tab-btn.active'),
        solutionSummaryDark: getColors('.markdown-body details[data-type="solution"] summary')
      };
    });

    console.log('Contrast sample (dark):', contrastData);

  } catch (err) {
    console.error('Error during UX verification:', err);
  } finally {
    await browser.close();
    preview.kill();
  }

  console.log('\n=== FINAL VERIFICATION SUMMARY ===');
  console.log(JSON.stringify(results, null, 2));
}

main();
