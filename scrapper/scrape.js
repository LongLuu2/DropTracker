const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const INPUT_FILE = 'posts.json';
const OUTPUT_FILE = 'posts.json';
const IMAGE_DIR = 'imgs';

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

	// Wait for modal
	await page.waitForSelector('div[role="dialog"]', { timeout: 10000 });

	let postCount = 0;

	while (postCount < 20) {
		try {
			await delay(2000); // Let post load

			const postData = await page.evaluate((user) => {
				const img = document.querySelector('div[role="dialog"] img');
				const captionSpan = Array.from(document.querySelectorAll('div[role="dialog"] ul li div._a9zr'))
					.find(el => !el.closest('header'));
				return {
					link: img?.src || null,
					caption: captionSpan?.innerText || '',
					acc: user,
					img_id: null
				};
			}, user);

			results.push(postData);
			postCount++;

			// Click next button if available
			const nextButton = await page.$('div[role="dialog"] svg[aria-label="Next"]');
			if (nextButton && postCount < 20) {
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
// utils for downloads
if (!fs.existsSync(IMAGE_DIR)) {
	fs.mkdirSync(IMAGE_DIR);
}
	
// Get the last number used in existing image filenames
const existingFiles = fs.readdirSync(IMAGE_DIR)
	.filter(file => file.endsWith('.jpg'))
	.map(file => parseInt(file.match(/img_(\d+)\.jpg/)?.[1] || 0))
	.filter(num => !isNaN(num));

let startIndex = existingFiles.length ? Math.max(...existingFiles) + 1 : 1;

async function downloadImage(url, filename) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to download: ${url}`);
	const buffer = await res.buffer();
	fs.writeFileSync(path.join(IMAGE_DIR, filename), buffer);
}

// function to download
async function download () {
	const posts = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));

	for (let i = 0; i < posts.length; i++) {
	const post = posts[i];
	if (!post.link || post.img_id) continue; 

	const filename = `img_${startIndex}.jpg`;

	try {
	  await downloadImage(post.link, filename);
	  post.img_id = filename;
	} catch (err) {
	  console.log(`Failed at (index ${i}):`, err.message);
	}

	startIndex++;
  }

	fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
}

(async () => {
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: {
			width: 1280,
			height: 800
		}
	});

	const page = await browser.newPage();
	// Load cookies from save
	const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
	await page.setCookie(...cookies);

	
	const usernames = fs.readFileSync('IGaccounts.txt', 'utf8').split('\n').map(u => u.trim()).filter(Boolean);

	for (const user of usernames) {
		await scraper(page, user);
	}

	// currently export to json
	fs.writeFileSync('posts.json', JSON.stringify(results, null, 2));
	await download();
	await browser.close();
})();