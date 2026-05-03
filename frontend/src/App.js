import React, { useEffect, useState } from "react";
import "./App.css";

const API = "https://college-app-vykr.onrender.com/colleges";

function App() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setColleges(data));
  }, []);

  const filtered = colleges.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // 👉 VIEW DETAILS PAGE
  if (selected) {
    return (
      <div className="detail-page">
        <button className="back" onClick={() => setSelected(null)}>
          ← Back
        </button>

        <h1>{selected.name}</h1>

        <div className="detail-box">
          <p><b>Location:</b> {selected.location}</p>
          <p><b>Fees:</b> ₹{selected.fees}</p>
          <p><b>Rating:</b> {selected.rating}</p>
          <p><b>Placement:</b> {selected.placement}%</p>
        </div>

        <p className="note">
          👉 You can extend this page with courses, reviews, cutoff, etc.
        </p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1 className="title">College Finder</h1>

      {/* SEARCH BAR */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search colleges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* COLLEGE LIST */}
      <div className="list">
        {filtered.map(c => (
          <div className="card" key={c.id}>
            <h3>{c.name}</h3>
            <p>{c.location}</p>

            <div className="info">
              <span>₹{c.fees}</span>
              <span>{c.rating}⭐</span>
              <span>{c.placement}%</span>
            </div>

            <button onClick={() => setSelected(c)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;