const puppeteer = require('puppeteer');
const fs = require('fs');

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const results = []

async function scraper (page, user)  {
	
	// Go to profile page
	await page.goto(`https://www.instagram.com/${user}/`, {
		waitUntil: 'networkidle2'
	});

	await delay(3000); // Let the page hydrate

	// Scroll a bit to trigger layout render
	await page.evaluate(() => window.scrollBy(0, 300));
	await delay(2000);

	// Wait for post containers to load
	await page.waitForSelector('div._aagw', { timeout: 20000 });
	const postContainers = await page.$$('div._aagw');

	//check if containers are found
	if (!postContainers.length) {
	console.log('Not found');
	await browser.close();
	return;
	}
	// Click the first post
	await postContainers[0].click();
	console.log('post clicked');

	// Wait for modal
	await page.waitForSelector('div[role="dialog"]', { timeout: 10000 });

	let postCount = 0;

	while (postCount < 6) {
		try {
			await delay(2000); // Let post load

			const postData = await page.evaluate(() => {
				const img = document.querySelector('div[role="dialog"] img');
				const captionSpan = Array.from(document.querySelectorAll('div[role="dialog"] ul li div._a9zr'))
					.find(el => !el.closest('header'));
				return {
					link: img?.src || null,
					caption: captionSpan?.innerText || '',
					img_id: null
				};
			});

			console.log(`✅ Post ${postCount + 1}:`, postData);
			results.push(postData);
			postCount++;

			// Click next button if available
			const nextButton = await page.$('div[role="dialog"] svg[aria-label="Next"]');
			if (nextButton && postCount < 6) {
				await nextButton.click();
			} else {
				break;
			}
		} catch (err) {
			console.log('Error while scraping:', err.message);
			break;
		}
	}

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

	
	const usernames = fs.readFileSync('IGaccounts.txt', 'utf8').split('\n').map(u => u.trim()).filter(Boolean);

	for (const user of usernames) {
		await scraper(page, user);
	}

	// currently export to json
	fs.writeFileSync('posts.json', JSON.stringify(results, null, 2));
	await browser.close();
})();