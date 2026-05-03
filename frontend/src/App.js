import React, { useEffect, useState } from "react";
import "./App.css";

const API = "https://college-app-vykr.onrender.com/colleges";

function App() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [compareList, setCompareList] = useState([]);
  const [saved, setSaved] = useState(
    JSON.parse(localStorage.getItem("saved")) || []
  );

  // Fetch data
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setColleges(data));
  }, []);

  // Unique locations
  const locations = ["All", ...new Set(colleges.map((c) => c.location))];

  // Filter
  const filtered = colleges.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (location === "All" || c.location === location)
    );
  });

  // Save
  const toggleSave = (college) => {
    let updated;
    if (saved.find((c) => c.id === college.id)) {
      updated = saved.filter((c) => c.id !== college.id);
    } else {
      updated = [...saved, college];
    }
    setSaved(updated);
    localStorage.setItem("saved", JSON.stringify(updated));
  };

  // Compare
  const toggleCompare = (college) => {
    if (compareList.find((c) => c.id === college.id)) {
      setCompareList(compareList.filter((c) => c.id !== college.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, college]);
    }
  };

  return (
    <div className="container">
      <h1>🎓 Find the Best College for You</h1>

      {/* Search + Filter */}
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

      {/* College Cards */}
      <div className="grid">
        {filtered.map((c) => (
          <div className="card" key={c.id}>
            <h3>{c.name}</h3>
            <p>📍 {c.location}</p>
            <p>💰 ₹{c.fees}</p>
            <p>⭐ {c.rating}</p>
            <p>🎯 Placement: {c.placement}%</p>

            <p className="tag">
              {c.rating > 4.7 ? "🔥 Top Tier College" : "👍 Good Choice"}
            </p>

            <div className="buttons">
              <button onClick={() => toggleCompare(c)}>
                {compareList.find((x) => x.id === c.id)
                  ? "Remove Compare"
                  : "Compare"}
              </button>

              <button onClick={() => toggleSave(c)}>
                {saved.find((x) => x.id === c.id)
                  ? "Saved"
                  : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Compare Section */}
      {compareList.length > 0 && (
        <div className="compare">
          <h2>⚖️ Compare Colleges</h2>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                {compareList.map((c) => (
                  <th key={c.id}>{c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Location</td>
                {compareList.map((c) => (
                  <td key={c.id}>{c.location}</td>
                ))}
              </tr>
              <tr>
                <td>Fees</td>
                {compareList.map((c) => (
                  <td key={c.id}>₹{c.fees}</td>
                ))}
              </tr>
              <tr>
                <td>Rating</td>
                {compareList.map((c) => (
                  <td key={c.id}>{c.rating}</td>
                ))}
              </tr>
              <tr>
                <td>Placement</td>
                {compareList.map((c) => (
                  <td key={c.id}>{c.placement}%</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Saved Section */}
      {saved.length > 0 && (
        <div className="saved">
          <h2>⭐ Saved Colleges</h2>
          <ul>
            {saved.map((c) => (
              <li key={c.id}>{c.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;