import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetch("https://college-app-vykr.onrender.com/colleges")
      .then((res) => res.json())
      .then((data) => setColleges(data))
      .catch((err) => console.error(err));
  }, []);

  const filtered = colleges.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (location === "" || c.location === location)
    );
  });

  const uniqueLocations = [
    ...new Set(colleges.map((c) => c.location)),
  ];

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <h2>🎓 CollegeFinder</h2>
        <div>Home | Compare | Predictor</div>
      </div>

      {/* Container */}
      <div className="container">
        <h1 className="title">🎓 College Explorer</h1>

        {/* Controls */}
        <div className="controls">
          <input
            placeholder="Search college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((loc, i) => (
              <option key={i} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Grid */}
        <div className="grid">
          {filtered.map((c) => (
            <div className="card" key={c.id}>
              <h3>{c.name}</h3>
              <p>📍 {c.location}</p>
              <p>💰 ₹{c.fees}</p>
              <p>⭐ {c.rating}</p>
              <p>🎯 Placement: {c.placement}%</p>

              <button className="btn">View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;