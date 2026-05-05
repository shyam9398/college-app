import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Navbar, { SECTION_IDS } from "./components/Navbar";
import CollegeCard from "./components/CollegeCard";
import Pagination from "./components/Pagination";
import SavedSection from "./components/SavedSection";
import CompareSection from "./components/CompareSection";
import CollegeDetailPage from "./components/CollegeDetailPage";
import FilterBar from "./components/FilterBar";
import CardCarousel from "./components/CardCarousel";
import Chatbot from "./components/Chatbot";

import { dedupeColleges, isInCollegeList, sameCollege, sortCollegesByRatingTier } from "./utils/college";
import { filterColleges } from "./utils/filterColleges";
import { loadSaved, persistSaved } from "./utils/storage";
import { enrichCollegeData } from "./utils/enrichCollegeData";

const API = "https://college-app-vykr.onrender.com/colleges";

function App() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [feesRange, setFeesRange] = useState("all");
  const [ratingMin, setRatingMin] = useState("all");
  const [course, setCourse] = useState("All");

  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(loadSaved);
  const [compareList, setCompareList] = useState([]);
  const [compareMessage, setCompareMessage] = useState("");

  const [page, setPage] = useState(1);
  const [rank, setRank] = useState("");
  const [predictedGroups, setPredictedGroups] = useState(null);

  const itemsPerPage = 4;
  const compareFull = compareList.length >= 3;

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setColleges(enrichCollegeData(Array.isArray(data) ? data : [])))
      .catch(() => setColleges([]));
  }, []);

  const locations = useMemo(() => {
    const locs = colleges.map((c) => c.location).filter(Boolean);
    return ["All", ...new Set(locs)];
  }, [colleges]);

  const filtered = useMemo(
    () => filterColleges(colleges, { search, location, feesRange, ratingMin, course }),
    [colleges, search, location, feesRange, ratingMin, course]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const paginated = useMemo(
    () => filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [filtered, page, itemsPerPage]
  );

  useEffect(() => {
    setPage((p) => (p > totalPages ? totalPages : p < 1 ? 1 : p));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [search, location, feesRange, ratingMin, course]);

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
      const next = exists
        ? prev.filter((x) => !sameCollege(x, c))
        : dedupeColleges([...prev, c]);
      return persistSaved(next);
    });
  }, []);

  const toggleCompare = useCallback((c) => {
    setCompareList((prev) => {
      if (isInCollegeList(prev, c)) {
        setCompareMessage("");
        return prev.filter((x) => !sameCollege(x, c));
      }
      if (prev.length >= 3) {
        setCompareMessage("You can compare up to 3 colleges only");
        return prev;
      }
      setCompareMessage("");
      return dedupeColleges([...prev, c]);
    });
  }, []);

  const removeFromCompare = useCallback((c) => {
    setCompareList((prev) => {
      const next = prev.filter((x) => !sameCollege(x, c));
      if (next.length < 3) setCompareMessage("");
      return next;
    });
  }, []);

  const handlePredict = useCallback(() => {
    const r = parseInt(String(rank).replace(/\D/g, ""), 10);
    if (Number.isNaN(r) || r < 1) {
      setPredictedGroups(null);
      return;
    }

    const baseRating = r < 2000 ? 4.7 : r < 5000 ? 4.5 : r < 10000 ? 4.3 : 4.0;
    const sorted = colleges.slice().sort(sortCollegesByRatingTier);
    const dream = sorted.filter((c) => Number(c.rating || 0) >= baseRating + 0.2).slice(0, 4);
    const dreamIds = new Set(dream.map((c) => String(c.id)));
    const target = sorted
      .filter((c) => Number(c.rating || 0) >= baseRating && !dreamIds.has(String(c.id)))
      .slice(0, 4);
    const usedIds = new Set([...dreamIds, ...target.map((c) => String(c.id))]);
    const safe = sorted
      .filter((c) => Number(c.rating || 0) >= Math.max(3.8, baseRating - 0.3) && !usedIds.has(String(c.id)))
      .slice(0, 4);

    setPredictedGroups({
      rank: r,
      reason: `Based on your rank and rating bands, these are grouped by ambition vs probability.`,
      dream,
      target,
      safe,
    });
  }, [colleges, rank]);

  const closeDetail = useCallback((afterClose) => {
    setSelected(null);
    if (typeof afterClose === "function") {
      requestAnimationFrame(() => requestAnimationFrame(afterClose));
    }
  }, []);

  const decisionAssistant = <Chatbot colleges={colleges} onSelectCollege={setSelected} activeCollege={selected} />;

  if (selected) {
    return (
      <>
        <CollegeDetailPage
          college={selected}
          onBack={closeDetail}
          savedList={saved}
          compareList={compareList}
          onSave={toggleSave}
          onCompare={toggleCompare}
          compareFull={compareFull}
        />
        {decisionAssistant}
      </>
    );
  }

  return (
    <>
      <div className="app-shell">
        <Navbar onNav={onNav} compareCount={compareList.length} />

        <main className="main">
          <section id="section-explorer" className="section explorer-section">
            <h1 className="page-title">College Explorer</h1>
            <p className="page-subtitle">Find colleges faster with filters, save favorites, and compare before decisions.</p>

            <FilterBar
              search={search}
              onSearchChange={setSearch}
              location={location}
              onLocationChange={setLocation}
              locations={locations}
              feesRange={feesRange}
              onFeesRangeChange={setFeesRange}
              ratingMin={ratingMin}
              onRatingMinChange={setRatingMin}
              course={course}
              onCourseChange={setCourse}
            />

            {filtered.length === 0 ? (
              <p className="empty-hint">No colleges match your filters. Try changing search, fees, or rating.</p>
            ) : (
              <>
                {compareMessage ? (
                  <p className="compare-limit-msg" role="alert">
                    {compareMessage}
                  </p>
                ) : null}
                <CardCarousel page={page} totalPages={totalPages} onPageChange={setPage}>
                  {paginated.map((c) => (
                    <div key={String(c.id)} className="card-carousel__slide">
                      <CollegeCard
                        college={c}
                        savedList={saved}
                        onDetails={setSelected}
                        onSave={toggleSave}
                        onCompare={toggleCompare}
                        inCompare={isInCollegeList(compareList, c)}
                        compareFull={compareFull}
                      />
                    </div>
                  ))}
                </CardCarousel>
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </section>

          <div className="decision-container">
            <div className="section-panel">
              <SavedSection saved={saved} onUnsave={toggleSave} onDetails={setSelected} />
            </div>

            <div className="section-panel">
              <CompareSection compareList={compareList} onRemove={removeFromCompare} />
            </div>

            <section id="section-predictor" className="section predictor-section section-panel">
              <h2 className="section-title">Rank Predictor</h2>
              <p className="section-lead">Enter your rank to get top, good, and fallback options by rating bands.</p>
              <div className="predictor-controls predictor-controls--centered">
                <input
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
              {predictedGroups ? (
                <div className="predictor-buckets">
                  <p className="predictor-reason">{predictedGroups.reason}</p>
                  {[
                    { key: "dream", title: "Dream", hint: "High aspiration picks if you can stretch for top outcomes." },
                    { key: "target", title: "Target", hint: "Balanced options with strong fit for your rank range." },
                    { key: "safe", title: "Safe", hint: "Reliable fallback options with stable admission chances." },
                  ].map((bucket) => {
                    const list = predictedGroups[bucket.key];
                    if (!list?.length) return null;
                    return (
                      <div key={bucket.key} className="predictor-bucket">
                        <h3 className="predictor-bucket__title">{bucket.title}</h3>
                        <p className="predictor-bucket__hint">{bucket.hint}</p>
                        <div className="grid grid-responsive predictor-grid">
                          {list.map((c) => (
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
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </section>
          </div>
        </main>
      </div>
      {decisionAssistant}
    </>
  );
}

export default App;