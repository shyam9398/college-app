import React, { useEffect, useState } from "react";
import "./App.css";

const API = "https://college-app-vykr.onrender.com/colleges";

function App() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(
    JSON.parse(localStorage.getItem("saved")) || []
  );

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setColleges(data));
  }, []);

  const locations = ["All", ...new Set(colleges.map(c => c.location))];

  const filtered = colleges.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    (location === "All" || c.location === location)
  );

  const toggleSave = (college) => {
    let updated;
    if (saved.find(c => c.id === college.id)) {
      updated = saved.filter(c => c.id !== college.id);
    } else {
      updated = [...saved, college];
    }
    setSaved(updated);
    localStorage.setItem("saved", JSON.stringify(updated));
  };

  // 🎯 DETAIL VIEW PAGE
  if (selected) {
    return (
      <div className="detail-page">
        <button className="back" onClick={() => setSelected(null)}>← Back</button>

        <h1>{selected.name}</h1>

        <div className="detail-grid">
          <div className="detail-card">
            <h3>Location</h3>
            <p>{selected.location}</p>
          </div>

          <div className="detail-card">
            <h3>Fees</h3>
            <p>₹{selected.fees}</p>
          </div>

          <div className="detail-card">
            <h3>Rating</h3>
            <p>{selected.rating}</p>
          </div>

          <div className="detail-card">
            <h3>Placement</h3>
            <p>{selected.placement}%</p>
          </div>
        </div>

        <div className="decision-box">
          <h2>Decision Insight</h2>
          <p>
            {selected.rating > 4.7
              ? "🔥 Top-tier college with excellent placement and reputation."
              : "👍 Good college with balanced fees and placement."}
          </p>
        </div>

        <button onClick={() => toggleSave(selected)}>
          {saved.find(c => c.id === selected.id) ? "Saved ✓" : "Save College"}
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>🎯 Find Your Best College</h1>

      {/* Search */}
      <div className="controls">
        <input
          placeholder="Search college..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setLocation(e.target.value)}>
          {locations.map((loc, i) => (
            <option key={i}>{loc}</option>
          ))}
        </select>
      </div>

      <h2>Top Colleges</h2>

      <div className="grid">
        {filtered.map(c => (
          <div className="card" key={c.id}>
            <h3>{c.name}</h3>
            <p>{c.location}</p>

            <div className="stats">
              <span>₹{c.fees}</span>
              <span>{c.rating}⭐</span>
              <span>{c.placement}%</span>
            </div>

            <div className="actions">
              <button onClick={() => setSelected(c)}>View Details</button>
              <button onClick={() => toggleSave(c)}>
                {saved.find(x => x.id === c.id) ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;