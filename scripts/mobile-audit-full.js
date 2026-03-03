const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const outDir = '/root/.openclaw/workspace/karmaphal/website/docs/mobile-audit';
  
  const viewports = [
    { name: 'se', width: 320, height: 568 },
    { name: 'i14', width: 390, height: 844 },
    { name: 'promax', width: 428, height: 926 },
  ];

  for (const vp of viewports) {
    console.log(`📱 ${vp.name} (${vp.width}px)...`);
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3002', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(12000);
    
    // Hero
    await page.screenshot({ path: path.join(outDir, `final-${vp.name}-hero.png`), fullPage: false });
    
    // Scroll to countdown
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, `final-${vp.name}-countdown.png`), fullPage: false });
    
    // Scroll to services
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, `final-${vp.name}-services.png`), fullPage: false });
    
    // Footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, `final-${vp.name}-footer.png`), fullPage: false });
    
    console.log(`  ✅ All sections captured`);
    await ctx.close();
  }

  await browser.close();
  console.log('✅ Full audit complete!');
})();
