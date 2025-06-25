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

  // Scroll a bit to trigger layout render
  await page.evaluate(() => window.scrollBy(0, 300));
  await delay(2000);

  // Coordinates to click the first post (adjust if needed)
  const clickX = 300;
  const clickY = 500;

  await page.mouse.move(clickX, clickY);
  await page.mouse.click(clickX, clickY);
  console.log(`✅ Clicked at (${clickX}, ${clickY})`);

  // Wait for modal
  await page.waitForSelector('div[role="dialog"]', { timeout: 10000 });

  const results = [];
  let postCount = 0;

  while (postCount < 5) {
    try {
      await delay(2000); // Let post load

      const postData = await page.evaluate(() => {
        const img = document.querySelector('div[role="dialog"] img');
        const captionSpan = Array.from(document.querySelectorAll('div[role="dialog"] ul li div._a9zr'))
          .find(el => !el.closest('header'));
        return {
          image: img?.src || null,
          caption: captionSpan?.innerText || ''
        };
      });

      console.log(`✅ Post ${postCount + 1}:`, postData);
      results.push(postData);
      postCount++;

      // Click next button if available
      const nextButton = await page.$('div[role="dialog"] svg[aria-label="Next"]');
      if (nextButton && postCount < 5) {
        await nextButton.click();
      } else {
        break;
      }
    } catch (err) {
      console.log('❌ Error scraping post:', err.message);
      break;
    }
  }

  // Save results
  fs.writeFileSync('posts.json', JSON.stringify(results, null, 2));
  console.log('💾 Saved results to posts.json');

  await browser.close();
})();
