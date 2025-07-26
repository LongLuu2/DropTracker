const express = require("express");
const fs = require('fs').promises;
const path = require("path");
const cors = require("cors");
const scrape = require("./scrape")
const fsSync = require('fs'); 

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/img", express.static(path.join(__dirname, "imgs")));
// runs the scraper
app.post("/api/scrape", async (req, res) => {
    try {
        await scrape();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "scrape failed"});
    }
});

// add a user to instagram to scrape
app.post("/api/addInsta/:username", async (req, res) => {
    const username = req.params.username;

    if (!username) {
        return res.status(400).json({ error: "No username provided" });
    }
    try {
        const filePath = path.join(__dirname, "IgAccQ.txt");

        let currentQ = [];
        const fileData = await fs.readFile(filePath, "utf8");
        currentQ = fileData.split("\n").map(u => u.trim()).filter(Boolean);
        if (currentQ.includes(username)) {
            return res.status(409).json({ error: "Username already exists" });
        }
        fs.appendFile(filePath, `${username}\n`);
        res.status(200).json({ message: "user add to be scraped"})
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "something went wrong with file"})
    }
});

// get the json file containing data on other sellers
app.get("/api/otherSeller", async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'results.json');
        const rawData = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(rawData);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong getting file"})
    }
})

// get all the accounts in the database
app.get("/api/scrapedAccs", async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'scrapedAcc.txt');
        const rawData = await fs.readFile(filePath, 'utf8');
        const accounts = rawData.split('\n').map(a => a.trim()).filter(Boolean);
        res.json(accounts); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to read scrapedAcc" });
    }
});

app.get('/api/getImg/:imgID', async (req, res) => {

  try {
    const imgID = req.params.imgID;
    const imgPath = path.join(__dirname, '/imgs', imgID);
    await fs.access(imgPath);
    res.sendFile(imgPath)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something wrong with file system"});
  }
})

app.get("/api/getQ", async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'IgAccQ.txt');
        const rawData = await fs.readFile(filePath, 'utf8');
        const accounts = rawData
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean); // removes empty lines

        res.json(accounts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to read queue" });
    }
});

// remove user from the db
app.delete("/api/removeDB/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const filePath = path.join(__dirname, 'results.json');
    const accPath = path.join(__dirname, 'scrapedAcc.txt');
    const imgDir = path.join(__dirname, 'imgs');

    // Update scrapedAcc.txt
    const accRaw = await fs.readFile(accPath, 'utf8');
    const updatedAccs = accRaw
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line !== username);
    await fs.writeFile(accPath, updatedAccs.join('\n'));

    // Update results.json
    const raw = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(raw);
    const updated = data.filter(entry => entry.acc !== username);
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2));

    // Delete related images
    const files = fsSync.readdirSync(imgDir);
    const toDelete = files.filter(file => file.includes(username));
    await Promise.all(toDelete.map(file => fs.unlink(path.join(imgDir, file))));

    res.json({ message: `Removed all data and images for '${username}'.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove user from results and images.' });
  }
});

// delete user from the q
app.delete("/api/removeQ/:username", async (req, res) => {
  const username = req.params.username;
    console.log(username);
  try {
    const filePath = path.join(__dirname, 'IgAccQ.txt');
    const lines = (await fs.readFile(filePath, 'utf8'))
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    const updated = lines.filter(line => line !== username);
    await fs.writeFile(filePath, updated.join('\n'));
    res.json({ message: `Removed '${username}' from queue.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove user from queue.' });
  }
});


app.listen(PORT, () => console.log(`running on localhost:${PORT}`));
