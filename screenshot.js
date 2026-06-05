import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Take full screenshot
  await page.screenshot({ path: 'website-screenshot.png', fullPage: false });
  
  console.log('Screenshot saved');
  await browser.close();
})();