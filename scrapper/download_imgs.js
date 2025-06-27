const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const INPUT_FILE = 'posts.json';
const OUTPUT_FILE = 'posts.json';
const IMAGE_DIR = 'imgs';

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

(async () => {
	const posts = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));

	for (let i = 0; i < posts.length; i++) {
	const post = posts[i];
	if (!post.link || post.img_id) continue; 

	const filename = `img_${startIndex}.jpg`;

	try {
	  await downloadImage(post.link, filename);
	  post.img_id = filename;
	  console.log(`downloaded ${filename}`);
	} catch (err) {
	  console.log(`Failed at (index ${i}):`, err.message);
	}

	startIndex++;
  }

	fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
	console.log(`saved`);
})();
