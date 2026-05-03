import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Navbar, { SECTION_IDS } from "./components/Navbar";
import CollegeCard from "./components/CollegeCard";
import Pagination from "./components/Pagination";
import SavedSection from "./components/SavedSection";
import CompareSection from "./components/CompareSection";
import CollegeDetailPage from "./components/CollegeDetailPage";
import { dedupeColleges, isInCollegeList, sameCollege } from "./utils/college";
import { loadSaved, persistSaved } from "./utils/storage";

const API = "https://college-app-vykr.onrender.com/colleges";

function App() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(loadSaved);
  const [compareList, setCompareList] = useState([]);
  const [page, setPage] = useState(1);
  const [rank, setRank] = useState("");
  const [predicted, setPredicted] = useState([]);

  const itemsPerPage = 4;
  const compareFull = compareList.length >= 3;

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setColleges(Array.isArray(data) ? data : []))
      .catch(() => setColleges([]));
  }, []);

  const locations = useMemo(() => {
    const locs = colleges.map((c) => c.location).filter(Boolean);
    return ["All", ...new Set(locs)];
  }, [colleges]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return colleges.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const matchSearch = !q || name.includes(q);
      const matchLoc = location === "All" || c.location === location;
      return matchSearch && matchLoc;
    });
  }, [colleges, search, location]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  useEffect(() => {
    setPage((p) => (p > totalPages ? totalPages : p < 1 ? 1 : p));
  }, [totalPages, filtered.length]);

  useEffect(() => {
    setPage(1);
  }, [search, location]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [filtered, page, itemsPerPage]
  );

  const scrollToId = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onNav = useCallback(
    (section) => {
      const id = SECTION_IDS[section] || SECTION_IDS.explorer;
      scrollToId(id);
    },
    [scrollToId]
  );

  const toggleSave = useCallback((c) => {
    setSaved((prev) => {
      const exists = isInCollegeList(prev, c);
      const next = exists ? prev.filter((x) => !sameCollege(x, c)) : dedupeColleges([...prev, c]);
      return persistSaved(next);
    });
  }, []);

  const toggleCompare = useCallback((c) => {
    setCompareList((prev) => {
      if (isInCollegeList(prev, c)) {
        return prev.filter((x) => !sameCollege(x, c));
      }
      if (prev.length >= 3) return prev;
      return dedupeColleges([...prev, c]);
    });
  }, []);

  const removeFromCompare = useCallback((c) => {
    setCompareList((prev) => prev.filter((x) => !sameCollege(x, c)));
  }, []);

  const handlePredict = useCallback(() => {
    const r = parseInt(String(rank).replace(/\D/g, ""), 10);
    if (Number.isNaN(r) || r < 1) {
      setPredicted([]);
      return;
    }
    const result = colleges.filter((col) => {
      const rating = Number(col.rating) || 0;
      if (r < 2000) return rating >= 4.7;
      if (r < 5000) return rating >= 4.5;
      if (r < 10000) return rating >= 4.3;
      return rating >= 4.0;
    });
    setPredicted(result.slice(0, 8));
  }, [colleges, rank]);

  const closeDetail = useCallback((afterClose) => {
    setSelected(null);
    if (typeof afterClose === "function") {
      requestAnimationFrame(() => {
        requestAnimationFrame(afterClose);
      });
    }
  }, []);

  if (selected) {
    return (
      <CollegeDetailPage
        college={selected}
        onBack={closeDetail}
        savedList={saved}
        compareList={compareList}
        onSave={toggleSave}
        onCompare={toggleCompare}
        compareFull={compareFull}
      />
    );
  }

  return (
    <div className="app-shell">
      <Navbar onNav={onNav} />

      <main className="main">
        <section id="section-explorer" className="section explorer-section">
          <h1 className="page-title">College explorer</h1>
          <p className="page-subtitle">Search, filter, save, and compare institutions in one place.</p>

          <div className="controls">
            <label className="sr-only" htmlFor="search-colleges">
              Search colleges
            </label>
            <input
              id="search-colleges"
              className="input-rounded"
              placeholder="Search by college name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
            <label className="sr-only" htmlFor="filter-location">
              Filter by location
            </label>
            <select
              id="filter-location"
              className="input-rounded select-rounded"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l === "All" ? "All locations" : l}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="empty-hint">No colleges match your filters. Try clearing the search or location.</p>
          ) : (
            <>
              <div className="grid grid-responsive">
                {paginated.map((c) => (
                  <CollegeCard
                    key={String(c.id)}
                    college={c}
                    savedList={saved}
                    onDetails={setSelected}
                    onSave={toggleSave}
                    onCompare={toggleCompare}
                    inCompare={isInCollegeList(compareList, c)}
                    compareFull={compareFull}
                  />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </section>

        <SavedSection saved={saved} onUnsave={toggleSave} onDetails={setSelected} />

        <CompareSection compareList={compareList} onRemove={removeFromCompare} />

        <section id="section-predictor" className="section predictor-section">
          <h2 className="section-title">Rank predictor</h2>
          <p className="section-lead">Enter your entrance rank; we suggest colleges by rating bands.</p>
          <div className="predictor-controls">
            <label className="sr-only" htmlFor="rank-input">
              Your rank
            </label>
            <input
              id="rank-input"
              className="input-rounded"
              inputMode="numeric"
              placeholder="e.g. 4500"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
            />
            <button type="button" className="btn btn-primary" onClick={handlePredict}>
              Predict matches
            </button>
          </div>
          {predicted.length > 0 && (
            <div className="grid grid-responsive predictor-grid">
              {predicted.map((c) => (
                <CollegeCard
                  key={String(c.id)}
                  college={c}
                  savedList={saved}
                  onDetails={setSelected}
                  onSave={toggleSave}
                  onCompare={toggleCompare}
                  inCompare={isInCollegeList(compareList, c)}
                  compareFull={compareFull}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
