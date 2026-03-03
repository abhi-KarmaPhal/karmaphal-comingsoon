const puppeteer = require('puppeteer');

async function auditMobile() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // iPhone 14 User Agent and Viewport
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
  
  // Wait for preloader to finish (10s in code)
  await new Promise(resolve => setTimeout(resolve, 11000));
  
  const metrics = await page.evaluate(() => {
    const heroContent = document.querySelector('.relative.z-10.flex.flex-col.items-center.px-6');
    const computedStyle = window.getComputedStyle(heroContent);
    return {
      transform: computedStyle.transform,
      webkitTransform: computedStyle.webkitTransform,
      display: computedStyle.display,
      position: computedStyle.position,
      top: computedStyle.top,
      className: heroContent?.className
    };
  });
  
  console.log('--- iPhone 14 Audit Metrics ---');
  console.log(JSON.stringify(metrics, null, 2));
  
  await page.screenshot({ path: '/root/.openclaw/workspace/karmaphal/website/scripts/iphone14_hero_audit.png' });
  await browser.close();
}

auditMobile().catch(console.error);
