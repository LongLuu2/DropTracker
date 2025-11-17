# Drop Tracker

**Drop Tracker** is a full-stack application built for a start up clothing resale business to automate the scraping, 
processing, and display of product listings from Instagram. The tool collects product data and images using 
Puppeteer, stores the data, and exposes it via a RESTful API consumed by a dynamic React frontend.
Designed for internal use, it supports centralized inventory management and prepares for future mobile integration.

---

## Features

-  Scrapes product posts (image + caption) from Instagram accounts
-  Processes and deduplicates data into structured JSON format
-  Tracks source account, image ID, and caption for each itemc
-  RESTful API built with Node.js and Express to serve listing data and images
- React frontend that fetches and displays posts in a responsive layout
-  Dynamic product catalog with image previews, captions, and source info

---

## Tech Stack

- **Backend:** Node.js, Express.js, Puppeteer, REST API
- **Frontend:** React, CSS 

---

### Short Demo Video

https://youtu.be/6CWKqNsIYc8




