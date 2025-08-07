# Drop Tracker

**Drop Tracker** is a full-stack application built for a clothing resale business to automate the scraping, 
processing, and display of product listings from Instagram. The tool collects product data and images using 
Puppeteer, stores the data, and exposes it via a RESTful API consumed by a dynamic React frontend.
Designed for internal use, it supports centralized inventory management and prepares for future mobile integration.

---

## Features

-  Scrapes product posts (image + caption) from Instagram accounts
-  Processes and deduplicates data into structured JSON format
-  Tracks source account (`acc`), image ID, and caption for each item
-  RESTful API built with Node.js and Express to serve listing data and images
- React frontend that fetches and displays posts in a responsive layout
-  Dynamic product catalog with image previews, captions, and source info
- Supports future database migration (e.g. MongoDB or PostgreSQL)

---

## Tech Stack

- **Backend:** Node.js, Express.js, Puppeteer, REST API
- **Frontend:** React, CSS Grid/Flexbox

---

## Starting

Start the Backend:
cd scrapper
npm install
node server.js

Start the Frontend:
cd frontend
npm install
npm start

##Future Plans

- Admin panel on the dashboard to track and visualize sales and product performance
- Migrate from JSON to MongoDB or PostgreSQL for scalable, persistent storage
- Integrate scheduled scraping with cron jobs or background workers
- Deploy frontend and backend as a full-stack service on AWS (EC2/S3) or Vercel + Render


