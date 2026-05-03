import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const API = "https://college-app-vykr.onrender.com/colleges";

/* NAVBAR */
const Navbar = () => (
  <div className="navbar">
    <div className="logo">🎓 CollegeFinder</div>
    <div className="nav-links">Home | Compare | Predictor</div>
  </div>
);

function App() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [selected, setSelected] = useState(null);
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

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const start = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  /* COMPARE */
  const toggleCompare = (c) => {
    const exists = compareList.find((x) => x.id === c.id);
    if (exists) {
      setCompareList(compareList.filter((x) => x.id !== c.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, c]);
    }
  };

  /* DETAIL PAGE */
  if (selected) {
    return (
      <>
        <Navbar />
        <div className="detail">
          <button className="back" onClick={() => setSelected(null)}>
            ← Back
          </button>

          <h2>{selected.name}</h2>

          <div className="detail-box">
            <p>📍 {selected.location}</p>
            <p>💰 ₹{selected.fees}</p>
            <p>⭐ {selected.rating}</p>
            <p>📊 Placement: {selected.placement}%</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="app">
        <h1>🎓 College Explorer</h1>

        {/* SEARCH + FILTER */}
        <div className="controls">
          <input
            placeholder="Search college..."
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

        {/* GRID */}
        <div className="grid">
          {paginated.map((c) => (
            <div className="card" key={c.id}>
              <input
                type="checkbox"
                checked={compareList.find((x) => x.id === c.id)}
                onChange={() => toggleCompare(c)}
              />

              <h3>{c.name}</h3>

              <p>📍 {c.location}</p>
              <p>💰 ₹{c.fees}</p>
              <p>⭐ {c.rating}</p>
              <p>📊 Placement: {c.placement}%</p>

              <button onClick={() => setSelected(c)}>
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active-page" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* COMPARE TABLE */}
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
    </>
  );
}

export default App;