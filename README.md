# college-app

# 🎓 College Explorer

A full-stack web application that helps students **search, compare, and choose the best college** based on their preferences, rank, and key decision factors.

---

## 🌐 Live Demo

👉 https://college-app-eight.vercel.app/

---

## 🚀 Features

### 🔍 1. Discovery (Search + Filters)

* Search colleges by name
* Filter by:

  * Location
  * Fees range
  * Rating
  * Course (CSE, AI/ML, ECE, etc.)
* Pagination (4 colleges per page for performance)

---

### 🏫 2. College Detail Page

* Detailed information for each college:

  * Fees
  * Courses offered
  * Placement statistics
  * Facilities
* Clean UI with proper navigation

---

### ⚖️ 3. Compare Colleges (Core Feature)

* Select up to **3 colleges**
* Side-by-side comparison of:

  * Fees
  * Rating
  * Placement %
  * Location
* Visual feedback:

  * Selected cards highlighted
  * Compare limit enforced (max 3)

---

### ⭐ 4. Shortlisting (Save Feature)

* Save / Unsave colleges
* Saved list displayed separately
* Instant UI update with toggle feedback

---

### 🧠 5. Rank Predictor

* Input: Entrance rank
* Output: Suggested colleges categorized as:

  * Dream
  * Target
  * Safe
* Helps students make informed decisions

---

### 🤖 6. AI Chatbot (Decision Assistant)

* Suggests colleges based on:

  * Interest (CSE, AI, etc.)
  * Rank
* Provides:

  * College insights
  * Course explanations
  * Direct college website links
* Restricts responses to **education-related queries only**

---

## 🛠️ Tech Stack

### Frontend

* React.js
* CSS (custom styling)

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL (Render)

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 🗂️ Project Structure

```bash
college-app/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/shyam9398/college-app.git
cd college-app
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
node server.js
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

## 📊 API Endpoints

### GET /colleges

* Returns list of colleges from PostgreSQL database

---

## 🎯 Key Highlights

* Full-stack application
* Real database integration
* REST API architecture
* Production deployment (Vercel + Render)
* Clean and user-friendly UI
* Strong decision-support features (Compare + Predictor)

---

## ⚖️ Trade-offs & Decisions

* Used rule-based rank prediction for simplicity
* Limited compare to 3 for better UX clarity
* Lightweight UI instead of heavy animations for performance

---

## 📌 Future Improvements

* User authentication
* Advanced filtering (cutoffs, branches)
* Save to cloud (user accounts)
* Real reviews & ratings integration
* Discussion / Q&A system

---

## 👨‍💻 Author

**Syamala Rao Burla**
GitHub: https://github.com/shyam9398

---

## ✅ Status

🚀 **Production Ready & Deployed**

