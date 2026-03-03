const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const outDir = '/root/.openclaw/workspace/karmaphal/website/docs/mobile-audit';
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Wait for preloader to finish
  await page.waitForTimeout(12000);
  
  // Scroll to countdown section
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, 'iphone14-countdown.png'), fullPage: false });
  console.log('✅ Countdown section');
  
  // Scroll to services section
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, 'iphone14-services.png'), fullPage: false });
  console.log('✅ Services section');
  
  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, 'iphone14-footer.png'), fullPage: false });
  console.log('✅ Footer');
  
  await context.close();
  await browser.close();
  console.log('✅ Scrolled captures complete!');
})();
