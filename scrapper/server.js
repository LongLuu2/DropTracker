const express = require("express");
const fs = require('fs').promises;
const path = require("path");
const cors = require("cors");
const scrape = require("./scrape")

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
})

// add a user to instagram to scrape
app.post("/api/addInsta", (req, res) => {
    const user = req.body.username;
    if(!username) {
        return res.status(400).json({error: "No name entered"});
    }
    fs.appendFile(path.join(__dirname, "IGaccounts.txt"), `${user}\n`, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({error: "something wrong in file"});
        } else {
            res.status(200).send("Successfully added")
        }
    })
})
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

// remove user from the q 
app.delete("/api/results/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const filePath = path.join(__dirname, 'results.json');
    const raw = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(raw);

    const updated = data.filter(entry => entry.acc !== username);
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2));

    res.json({ message: `Removed all entries for '${username}' from results.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove user from results.' });
  }
});

// delete user from the q
app.delete("/api/queue/:username", async (req, res) => {
  const username = req.params.username;

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
