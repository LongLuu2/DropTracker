const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });

  console.log('Please log in manually in the browser window...');
  await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30s to log in

  // Save cookies after login
  const cookies = await page.cookies();
  fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));

  console.log('✅ Cookies saved to cookies.json');
  await browser.close();
})();
