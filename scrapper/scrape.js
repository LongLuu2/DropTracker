const puppeteer = require('puppeteer');
const fs = require('fs');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1280,
      height: 800
    }
  });

  const page = await browser.newPage();

  // Load cookies
  const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
  await page.setCookie(...cookies);

  // Go to profile page
  await page.goto('https://www.instagram.com/luckycat.sply/', {
    waitUntil: 'networkidle2'
  });

  await delay(3000); // Let the page hydrate

 // Scroll a little to trigger layout render
  await page.evaluate(() => window.scrollBy(0, 300));

  // Wait again to ensure rendering
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Coordinates to click the first post (adjust if needed)
  const clickX = 300;
  const clickY = 500;

  await page.mouse.move(clickX, clickY);
  await page.mouse.click(clickX, clickY);
  console.log(`✅ Clicked at (${clickX}, ${clickY})`);

  // Wait to see modal
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Wait for post modal to appear
  try {
    await page.waitForSelector('div[role="dialog"]', { timeout: 10000 });

    const postData = await page.evaluate(() => {
      const img = document.querySelector('div[role="dialog"] img');
      const caption = document.querySelector('div[role="dialog"] ul li div._a9zr');
      return {
        image: img?.src || null,
        caption: caption?.innerText || ''
      };
    });

    console.log('✅ Scraped:', postData);
  } catch (err) {
    console.log('❌ Failed to extract post:', err.message);
  }

  await browser.close();
})();
