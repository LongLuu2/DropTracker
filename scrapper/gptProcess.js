const fs = require('fs');
const path = require('path');
require('dotenv').config();
const OpenAI = require('openai');


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});


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
You are extracting item data from an Instagram post image that shows product listings.
Use the image primarily to extract product listings. If caption text is available, use it to double-check or fill in missing info
If there is no price in the img or name in the img, ignore and respond with "in valid"
For each item in the image:
- Extract the full product name.
- If the name contains a censored word (like **\***), guess and uncensor it.
- Extract the size (can be multiple sizes).
- Extract the item condition (e.g., BNIB, VNDS).
- Extract the price in this format: "IDR 1.999.000".
- give save the img exactly as ${post.img_id}
-save the acc exactly as ${post.acc}


Then, format the result as a JSON array using this structure for each item:
[
  {
    "name": "Air Jordan 1 Retro High OG Chicago",
    "size": "42",
    "condition": "BNIB",
    "price": "IDR 1.699.000",
    "acc": ${post.acc},
    "img": ${post.img_id}
  }
]
  
Return the results as a flat JSON array, not nested in another array.`,
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

    return JSON.parse(cleaned);

  } catch (err) {
    console.error(`❌ Error analyzing ${post.img_id}:`, err.message);
    return null;
  }
}

async function run() {
  const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
  const results = [];

  for (const post of posts) {

    const result = await analyzePost(post);
    if (result) {
      results.push(...result);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
}

run();
