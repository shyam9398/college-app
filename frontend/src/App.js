import React, { useEffect, useState } from "react";
import "./App.css";

const API = "https://college-app-vykr.onrender.com/colleges";

function App() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);

  const itemsPerPage = 4;

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

  // 👉 DETAIL PAGE
  if (selected) {
    return (
      <div className="detail">
        <button className="back" onClick={() => setSelected(null)}>
          ← Back
        </button>

        <h2>{selected.name}</h2>

        <div className="detail-box">
          <p>📍 {selected.location}</p>
          <p>💰 ₹{selected.fees}</p>
          <p>⭐ {selected.rating}</p>
          <p>🎯 Placement: {selected.placement}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>🎓 College Explorer</h1>

      {/* SEARCH + FILTER */}
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

      {/* CARDS */}
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

            <button onClick={() => setSelected(c)}>
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))}>
          Prev
        </button>

        <span>Page {page}</span>

        <button
          onClick={() =>
            setPage(p =>
              start + itemsPerPage < filtered.length ? p + 1 : p
            )
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;