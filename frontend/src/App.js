import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const API = "https://college-app-vykr.onrender.com/colleges";

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

  const [saved, setSaved] = useState(
    JSON.parse(localStorage.getItem("saved")) || []
  );
  const [compareList, setCompareList] = useState([]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const [rank, setRank] = useState("");
  const [predicted, setPredicted] = useState([]);

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
  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  /* SAVE */
  const toggleSave = (c) => {
    const exists = saved.find((x) => x.id === c.id);
    const updated = exists
      ? saved.filter((x) => x.id !== c.id)
      : [...saved, c];

    setSaved(updated);
    localStorage.setItem("saved", JSON.stringify(updated));
  };

  /* COMPARE */
  const toggleCompare = (c) => {
    const exists = compareList.find((x) => x.id === c.id);
    if (exists) {
      setCompareList(compareList.filter((x) => x.id !== c.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, c]);
    }
  };

  /* PREDICTOR */
  const handlePredict = () => {
    const r = parseInt(rank);

    let result = colleges.filter((c) => {
      if (r < 2000) return c.rating >= 4.7;
      if (r < 5000) return c.rating >= 4.5;
      if (r < 10000) return c.rating >= 4.3;
      return c.rating >= 4.0;
    });

    setPredicted(result.slice(0, 4));
  };

  /* DETAILS PAGE */
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

        {/* SEARCH */}
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
            {locations.map((l, i) => (
              <option key={i}>{l}</option>
            ))}
          </select>
        </div>

        {/* CARDS */}
        <div className="grid">
          {paginated.map((c) => (
            <div className="card" key={c.id}>
              <h3>{c.name}</h3>

              <p>📍 {c.location}</p>
              <p>💰 ₹{c.fees}</p>
              <p>⭐ {c.rating}</p>
              <p>📊 Placement: {c.placement}%</p>

              <div className="btn-group">
                <button onClick={() => setSelected(c)}>Details</button>
                <button onClick={() => toggleSave(c)}>
                  {saved.find((x) => x.id === c.id) ? "Saved" : "Save"}
                </button>
                <button onClick={() => toggleCompare(c)}>Compare</button>
              </div>
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

        {/* SAVED */}
        {saved.length > 0 && (
          <div className="saved">
            <h3>⭐ Saved Colleges</h3>
            {saved.map((c) => (
              <p key={c.id}>{c.name}</p>
            ))}
          </div>
        )}

        {/* PREDICTOR */}
        <div className="predictor">
          <h3>🎯 Rank Predictor</h3>
          <input
            placeholder="Enter your rank..."
            value={rank}
            onChange={(e) => setRank(e.target.value)}
          />
          <button onClick={handlePredict}>Predict</button>

          <div className="grid">
            {predicted.map((c) => (
              <div className="card" key={c.id}>
                <h4>{c.name}</h4>
                <p>⭐ {c.rating}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;