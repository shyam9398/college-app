# college-app
# 🎓 College Discovery Platform

A full-stack college discovery and decision-making platform inspired by Careers360 and CollegeDunia.

🔗 **Live App:** https://college-app-eight.vercel.app/
📦 **GitHub Repo:** https://github.com/shyam9398/college-app

---

## 🚀 Features Implemented

### 1. 🔍 College Listing + Search

* Displays college cards with:

  * Name
  * Location
  * Fees
  * Rating
* Search by college name
* Filter by location
* Pagination for better performance

---

### 2. 🏫 College Detail Page

* Detailed view of selected college
* Includes:

  * Fees
  * Courses offered
  * Placement details
  * Reviews (mock data)
* Proper routing implemented

---

### 3. ⚖️ Compare Colleges (High Priority Feature)

* Select up to 3 colleges
* Compare:

  * Fees
  * Rating
  * Placement %
  * Location
* Helps users make decisions

---

### 4. 🧠 College Predictor Tool

* Input: Rank
* Output: Suggested colleges
* Rule-based logic

---

## 🛠️ Tech Stack

### Frontend

* React.js
* CSS

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL (Neon)

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 🗂️ Project Structure

```
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

### 1. Clone Repository

```
git clone https://github.com/shyam9398/college-app.git
cd college-app
```

---

### 2. Backend Setup

```
cd backend
npm install
node server.js
```

---

### 3. Frontend Setup

```
cd frontend
npm install
npm start
```

---

### 4. Environment Variables

Create a `.env` file in backend:

```
DATABASE_URL=your_postgresql_connection_string
```

---

## 📊 API Endpoint

```
GET /colleges
```

Returns list of colleges from PostgreSQL database.

---

## 🎯 Key Highlights

* Full-stack application
* Real database integration (PostgreSQL)
* REST API architecture
* Deployed and publicly accessible
* Clean UI with multiple features

---

## 📌 Future Improvements

* User authentication
* Save favorite colleges
* Q&A discussion system
* Advanced filters

---

## 👨‍💻 Author

**Syamala Rao**
📧 [burlasyamalarao99@gmail.com](mailto:burlasyamalarao99@gmail.com)

---
