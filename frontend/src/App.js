import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CollegeDetail from "./CollegeDetail";
import "./App.css";

function Home() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");

  const [selected, setSelected] = useState([]);
  const [rank, setRank] = useState("");
  const [predicted, setPredicted] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://college-app-vykr.onrender.com/colleges")
      .then(res => res.json())
      .then(data => setColleges(data));
  }, []);

  // 🔍 Search + Filter
  const filtered = colleges.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    (locationFilter === "All" || c.location === locationFilter)
  );

  // 🔢 Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentColleges = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // 🧠 Predictor
  const predict = () => {
    const r = parseInt(rank);
    if (isNaN(r)) return alert("Enter valid rank");

    const result = colleges.filter(c => {
      if (r < 1000) return c.rating >= 4.7;
      if (r < 5000) return c.rating >= 4.5;
      return c.rating >= 4.2;
    });

    setPredicted(result);
  };

  return (
    <div>

      {/* 🔵 Navbar */}
      <div className="navbar">
        <h2>🎓 CollegeFinder</h2>
        <div>Home | Compare | Predictor</div>
      </div>

      <div className="container">

        {/* Title */}
        <h1 className="title">🎓 College Explorer</h1>

        {/* Search + Filter */}
        <div className="controls">
          <input
            placeholder="Search college..."
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            onChange={(e) => {
              setLocationFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Locations</option>
            <option>Delhi</option>
            <option>Tamil Nadu</option>
            <option>Hyderabad</option>
            <option>Rajasthan</option>
          </select>
        </div>

        {/* Cards */}
        <div className="grid">
          {currentColleges.map((c, i) => (
            <div key={i} className="card">

              <input
                type="checkbox"
                checked={selected.some(s => s.name === c.name)}
                onChange={(e) => {
                  if (e.target.checked) {
                    if (selected.length < 3) {
                      setSelected([...selected, c]);
                    } else {
                      alert("Max 3 colleges only");
                    }
                  } else {
                    setSelected(selected.filter(s => s.name !== c.name));
                  }
                }}
              />

              <h3>{c.name}</h3>
              <p>📍 {c.location}</p>
              <p>💰 ₹{c.fees}</p>
              <p>⭐ {c.rating}</p>
              <p>📊 Placement: {c.placement}%</p>

              <button
                className="btn"
                onClick={() => navigate("/college", { state: c })}
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className="btn"
              style={{
                margin: "5px",
                background: currentPage === i + 1 ? "#2563eb" : "#e5e7eb",
                color: currentPage === i + 1 ? "white" : "black"
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Compare */}
        {selected.length > 0 && (
          <div className="section">
            <h2>⚖️ Compare Colleges</h2>

            <table style={{ width: "100%", textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Feature</th>
                  {selected.map((c, i) => (
                    <th key={i}>{c.name}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Fees</td>
                  {selected.map((c, i) => <td key={i}>₹{c.fees}</td>)}
                </tr>
                <tr>
                  <td>Rating</td>
                  {selected.map((c, i) => <td key={i}>{c.rating}</td>)}
                </tr>
                <tr>
                  <td>Placement</td>
                  {selected.map((c, i) => <td key={i}>{c.placement}%</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Predictor */}
        <div className="section">
          <h2>🎯 College Predictor</h2>

          <input
            type="number"
            placeholder="Enter Rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
          />

          <button className="btn" onClick={predict}>
            Predict
          </button>

          <div>
            {predicted.map((c, i) => (
              <p key={i}>{c.name} ⭐ {c.rating}</p>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/college" element={<CollegeDetail />} />
      </Routes>
    </Router>
  );
}

export default App;