import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Navbar, { SECTION_IDS } from "./components/Navbar";
import CollegeCard from "./components/CollegeCard";
import Pagination from "./components/Pagination";
import SavedSection from "./components/SavedSection";
import CompareSection from "./components/CompareSection";
import FilterBar from "./components/FilterBar";
import CardCarousel from "./components/CardCarousel";
import Chatbot from "./components/Chatbot";
import CollegeDetailModal from "./components/CollegeDetailModal";
import GoalChips, { GOAL_OPTIONS } from "./components/GoalChips";

import {
  dedupeColleges,
  isInCollegeList,
  sameCollege,
  sortCollegesByRatingTier,
} from "./utils/college";
import { filterColleges } from "./utils/filterColleges";
import { loadSaved, persistSaved } from "./utils/storage";
import { enrichCollegeData } from "./utils/enrichCollegeData";
import { DEFAULT_COLLEGES } from "./data/collegeData";

function App() {
  const API = `${process.env.REACT_APP_API_URL}/colleges`;

  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [feesRange, setFeesRange] = useState("all");
  const [ratingMin, setRatingMin] = useState("all");
  const [course, setCourse] = useState("All");
  const [goal, setGoal] = useState("All");

  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(loadSaved);
  const [compareList, setCompareList] = useState([]);
  const [compareMessage, setCompareMessage] = useState("");

  const [page, setPage] = useState(1);
  const [rank, setRank] = useState("");
  const [predictedGroups, setPredictedGroups] = useState(null);
  const [predictCourse, setPredictCourse] = useState("B.Tech");

  const itemsPerPage = 4;
  const compareFull = compareList.length >= 3;

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        const apiList = Array.isArray(data) ? data : [];
        const merged = dedupeColleges([...DEFAULT_COLLEGES, ...apiList]);
        setColleges(enrichCollegeData(merged));
      })
      .catch(() => setColleges(enrichCollegeData(DEFAULT_COLLEGES)));
  }, [API]);

  const locations = useMemo(() => {
    const locs = colleges.map((c) => c.location).filter(Boolean);
    return ["All", ...new Set(locs)];
  }, [colleges]);

  const filtered = useMemo(
    () =>
      filterColleges(colleges, {
        search,
        location,
        feesRange,
        ratingMin,
        course,
        goal,
      }),
    [colleges, search, location, feesRange, ratingMin, course, goal]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / itemsPerPage)
  );

  const paginated = useMemo(
    () =>
      filtered.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
      ),
    [filtered, page]
  );

  useEffect(() => {
    setPage((p) =>
      p > totalPages ? totalPages : p < 1 ? 1 : p
    );
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [search, location, feesRange, ratingMin, course, goal]);

  const scrollToId = useCallback((id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const onNav = useCallback(
    (section) => {
      const id =
        SECTION_IDS[section] || SECTION_IDS.explorer;
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
        setCompareMessage(
          "You can compare up to 3 colleges only"
        );
        return prev;
      }
      setCompareMessage("");
      document.getElementById(SECTION_IDS.compare)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    const r = parseInt(
      String(rank).replace(/\D/g, ""),
      10
    );
    if (Number.isNaN(r) || r < 1) {
      setPredictedGroups(null);
      return;
    }

    const baseRating =
      r < 2000
        ? 4.7
        : r < 5000
        ? 4.5
        : r < 10000
        ? 4.3
        : 4.0;

    const sorted = colleges
      .filter((c) => c.course === predictCourse)
      .slice()
      .sort(sortCollegesByRatingTier);

    const dream = sorted
      .filter((c) => c.rating >= baseRating + 0.2)
      .slice(0, 4);

    const target = sorted
      .filter(
        (c) =>
          c.rating >= baseRating &&
          !dream.includes(c)
      )
      .slice(0, 4);

    const safe = sorted
      .filter(
        (c) =>
          c.rating >= baseRating - 0.3 &&
          !target.includes(c)
      )
      .slice(0, 4);

    setPredictedGroups({
      rank: r,
      dream,
      target,
      safe,
    });
  }, [colleges, rank, predictCourse]);

  const decisionAssistant = (
    <Chatbot
      colleges={colleges}
      onSelectCollege={setSelected}
    />
  );

  return (
    <>
      <div className="app-shell">
        <Navbar
          onNav={onNav}
          compareCount={compareList.length}
        />

        <main className="main">
          <section id={SECTION_IDS.explorer} className="section hero">
            <h1 className="hero__title">"Find the right college faster"</h1>
            <p className="hero__tagline">"Search, compare and decide — without the noise"</p>

            <GoalChips goal={goal} onGoalChange={setGoal} />

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

            <p className="compare-status">
              Selected for Compare ({compareList.length}/3)
            </p>
            {compareMessage ? (
              <p className="compare-limit-msg">{compareMessage}</p>
            ) : null}

            <CardCarousel
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            >
              {paginated.map((c) => (
                <div key={c.id} className="card-carousel__slide">
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

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />

            <SavedSection
              saved={saved}
              onUnsave={toggleSave}
              onDetails={setSelected}
            />

            <CompareSection
              compareList={compareList}
              onRemove={removeFromCompare}
            />

            <section id={SECTION_IDS.predictor} className="section section-panel">
              <h2 className="section-title">Rank Predictor</h2>
              <p className="section-lead">Get course-specific Dream, Target, and Safe college suggestions.</p>
              <div className="predictor-controls predictor-controls--centered">
                <input
                  className="input-rounded"
                  placeholder="Enter your rank"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                />
                <select className="input-rounded select-rounded" value={predictCourse} onChange={(e) => setPredictCourse(e.target.value)}>
                  {["B.Tech", "MBA", "B.Com", "MBBS", "LLB"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <button type="button" className="btn btn-primary" onClick={handlePredict}>
                  Predict
                </button>
              </div>

              {predictedGroups ? (
                <div className="predictor-buckets">
                  <p className="predictor-reason">
                    Results for rank {predictedGroups.rank} in {predictCourse}
                  </p>
                  {[
                    { label: "Dream", list: predictedGroups.dream },
                    { label: "Target", list: predictedGroups.target },
                    { label: "Safe", list: predictedGroups.safe },
                  ].map((bucket) => (
                    <div key={bucket.label} className="predictor-bucket">
                      <h3 className="predictor-bucket__title">{bucket.label}</h3>
                      <p className="predictor-bucket__hint">
                        {bucket.list.length ? bucket.list.map((c) => c.name).join(", ") : "No colleges in this bucket for current filters."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          </section>
        </main>
      </div>

      <CollegeDetailModal college={selected} onClose={() => setSelected(null)} />
      {decisionAssistant}
    </>
  );
}

export default App;