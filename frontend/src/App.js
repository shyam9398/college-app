import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const API = "https://college-app-vykr.onrender.com/colleges";

function App() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [selected, setSelected] = useState(null);

  // working states
  const [saved, setSaved] = useState(
    JSON.parse(localStorage.getItem("saved")) || []
  );
  const [compareList, setCompareList] = useState([]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setColleges(data));
  }, []);

  const locations = useMemo(
    () => ["All", ...new Set(colleges.map((c) => c.location))],
    [colleges]
  );

  const filtered = useMemo(() => {
    return colleges.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) &&
        (location === "All" || c.location === location)
    );
  }, [colleges, search, location]);

  // total pages
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  // keep page in range when filters change
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  // exactly 4 items per page
  const start = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  // ---- actions ----
  const toggleSave = (c) => {
    const exists = saved.find((x) => x.id === c.id);
    const updated = exists
      ? saved.filter((x) => x.id !== c.id)
      : [...saved, c];
    setSaved(updated);
    localStorage.setItem("saved", JSON.stringify(updated));
  };

  const toggleCompare = (c) => {
    const exists = compareList.find((x) => x.id === c.id);
    if (exists) {
      setCompareList(compareList.filter((x) => x.id !== c.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, c]);
    }
  };

  // ---- detail page ----
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

      {/* Search + Filter */}
      <div className="controls">
        <input
          placeholder="Search colleges..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setPage(1);
          }}
        >
          {locations.map((l, i) => (
            <option key={i}>{l}</option>
          ))}
        </select>
      </div>

      {/* Compare bar */}
      {compareList.length > 0 && (
        <div className="compare-bar">
          <span>Comparing: {compareList.map((c) => c.name).join(", ")}</span>
          <button onClick={() => setCompareList([])}>Clear</button>
        </div>
      )}

      {/* Cards */}
      <div className="grid">
        {paginated.map((c) => (
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

              <button
                className={
                  saved.find((x) => x.id === c.id) ? "active" : ""
                }
                onClick={() => toggleSave(c)}
              >
                {saved.find((x) => x.id === c.id) ? "Saved ✓" : "Save"}
              </button>

              <button
                className={
                  compareList.find((x) => x.id === c.id) ? "active" : ""
                }
                onClick={() => toggleCompare(c)}
              >
                {compareList.find((x) => x.id === c.id)
                  ? "Added ✓"
                  : "Compare"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Number Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "page-active" : ""}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Compare Table */}
      {compareList.length >= 2 && (
        <div className="compare-table">
          <h3>Compare Colleges</h3>
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
              <tr>
                <td>Location</td>
                {compareList.map((c) => (
                  <td key={c.id}>{c.location}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;