const fs = require('fs');
const path = require('path');
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Make sure it's set
});

// Only process these numeric IDs
const TEST_IDS = ['39', '40'];

function extractIdNumber(imgId) {
  const match = imgId.match(/\d+/);
  return match ? match[0] : null;
}

async function analyzePost(post) {
  const imagePath = path.join(__dirname, 'imgs', post.img_id);
  if (!fs.existsSync(imagePath)) {
    console.log(`❌ Image not found: ${post.img_id}`);
    return null;
  }

  const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `This is an Instagram post. Here's the caption:\n\n"${post.caption}"\n\n
- For each item, make your best guess at the SKU based on the brand, model, and colorway.
- Guess the item name using visible logos, color, and design.
- After guessing the item name, generate a plausible SKU based on the name.
-If you generate a full product name (e.g., "Yeezy Boost 700 Carbon Blue"), try to return the correct SKU if known.
If not, generate a plausible SKU in the brand's real-world style:
- Adidas: FW2499, GY3438
- Nike/Jordan: 555088-101, CT8532-105
- New Balance: ML2002RA, U9060MAC
- On Running: 46.99238, 61.98573
Do not return "Not visible" — always guess something realistic.
- If the name is specific enough, generate the most likely real-world SKU used by that brand for this product.
- Use the price from the image. If not visible, use the caption.
- Get the size and condition from caption if possible,.
- Output only a JSON array with no extra text, markdown, or code blocks.

Format:
[
  {
    "sku": "555088-101",
    "name": "Air Jordan 1 Retro High OG Chicago",
    "confidence": "90%",
	"size": ,
	"condition": ,
    "price": "IDR 1.699.000"
  }
]`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });
	const raw = response.choices[0].message.content.trim();	
	const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();

    return {
      img_id: post.img_id,
      caption: post.caption,
      analysis: JSON.parse(cleaned)
    };

  } catch (err) {
    console.error(`❌ Error analyzing ${post.img_id}:`, err.message);
    return null;
  }
}

async function run() {
  const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
  const results = [];

  for (const post of posts) {
    const idNum = extractIdNumber(post.img_id);
    if (!TEST_IDS.includes(idNum)) continue;

    const result = await analyzePost(post);
    if (result) {
      results.push(result);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
  console.log('✅ Saved selected results to results.json');
}

run();
