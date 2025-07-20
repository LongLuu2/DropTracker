const express = require("express");
const fs = require('fs').promises;
const path = require("path");
const cors = require("cors");
const scrape = require("./scrape")

const app = express();
const PORT = process.env.PORT || 3000;

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



app.listen(PORT, () => console.log(`running on localhost:${PORT}`));
