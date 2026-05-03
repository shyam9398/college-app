import React, { useEffect, useState } from "react";
import "./App.css";

const API = "https://college-app-vykr.onrender.com/colleges";

function App() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [rank, setRank] = useState("");

  const itemsPerPage = 6;

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setColleges(data));
  }, []);

  const locations = ["All", ...new Set(colleges.map(c => c.location))];

  const filtered = colleges.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    (location === "All" || c.location === location)
  );

  const start = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  // 🎯 Rank Predictor Logic
  const predicted = colleges.filter(c => {
    if (!rank) return false;
    return c.rating >= 4.5 && c.fees <= 200000;
  });

  // 🎯 Detail Page
  if (selected) {
    return (
      <div className="detail">
        <button onClick={() => setSelected(null)}>← Back</button>
        <h2>{selected.name}</h2>

        <p>📍 {selected.location}</p>
        <p>💰 ₹{selected.fees}</p>
        <p>⭐ {selected.rating}</p>
        <p>🎯 Placement: {selected.placement}%</p>

        <p><b>Courses:</b> {selected.courses || "B.Tech, M.Tech"}</p>
        <p><b>Cutoff:</b> {selected.cutoff || "Top Rank Required"}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>🎓 College Explorer</h1>

      {/* Search + Filter */}
      <div className="controls">
        <input
          placeholder="Search colleges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setLocation(e.target.value)}>
          {locations.map((l, i) => (
            <option key={i}>{l}</option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <div className="grid">
        {paginated.map(c => (
          <div className="card" key={c.id}>
            <h3>{c.name}</h3>
            <p>📍 {c.location}</p>

            <div className="info">
              <span>₹{c.fees}</span>
              <span>⭐ {c.rating}</span>
              <span>{c.placement}%</span>
            </div>

            <div className="actions">
              <button onClick={() => setSelected(c)}>Details</button>
              <button>Save</button>
              <button>Compare</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))}>Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

      {/* Rank Predictor */}
      <div className="predictor">
        <h2>🎯 Rank Predictor</h2>

        <input
          placeholder="Enter your rank..."
          value={rank}
          onChange={(e) => setRank(e.target.value)}
        />

        {rank && (
          <div className="results">
            {predicted.map(c => (
              <p key={c.id}>{c.name}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;