const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const scrape = require("./scrape")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/img", express.static(path.join(__dirname, "imgs")));

app.post("/api/scrape", async (req, res) => {

    try {
        await scrape();

        const data = JSON.parse(fs.readFileSync(path.join(__dirname, "post.json")));
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "scrape failed"});
    }
})

app.listen(PORT, () => console.log(`running on https://localhost:${PORT}`));
