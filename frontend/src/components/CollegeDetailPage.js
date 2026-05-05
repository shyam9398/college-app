import React from "react";
import Navbar, { SECTION_IDS } from "./Navbar";
import RatingTag from "./RatingTag";
import { getDetailExtras } from "../utils/detailExtras";
import { isInCollegeList } from "../utils/college";

function CollegeDetailPage({
  college,
  onBack,
  savedList,
  compareList,
  onSave,
  onCompare,
  compareFull,
}) {
  if (!college) return null;

  const { courses, facilities, admission } = getDetailExtras(college);
  const isSaved = isInCollegeList(savedList, college);
  const inCompare = isInCollegeList(compareList, college);
  const compareDisabled = !inCompare && compareFull;

  const scrollToSection = (key) => {
    const id = SECTION_IDS[key] || SECTION_IDS.explorer;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="app-shell">
      <Navbar
        onNav={(section) => {
          onBack(() => scrollToSection(section));
        }}
      />
      <main className="main detail-page detail-page--wide">
        <div className="detail-top">
          <button type="button" className="back btn btn-secondary" onClick={() => onBack()}>
            ← Back
          </button>
        </div>

        <div className="detail-hero-card">
          <div className="detail-hero-top">
            <h1 className="detail-title">{college.name}</h1>
            <RatingTag rating={college.rating} />
          </div>
          <p className="detail-sub">{college.location}</p>
        </div>

        <div className="detail-grid-cards">
          <section className="info-card">
            <h2 className="info-card__title">Overview</h2>
            <dl className="detail-dl">
              <div>
                <dt>Location</dt>
                <dd>{college.location}</dd>
              </div>
              <div>
                <dt>Fees</dt>
                <dd>₹{college.fees}</dd>
              </div>
              <div>
                <dt>Rating</dt>
                <dd>{college.rating}</dd>
              </div>
              <div>
                <dt>Placement</dt>
                <dd>{college.placement}%</dd>
              </div>
            </dl>
          </section>

          <section className="info-card">
            <h2 className="info-card__title">Courses</h2>
            <ul className="detail-list">
              {courses.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          <section className="info-card">
            <h2 className="info-card__title">Facilities</h2>
            <ul className="detail-list">
              {facilities.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          <section className="info-card info-card--wide">
            <h2 className="info-card__title">Admission info</h2>
            <p className="detail-admission">{admission}</p>
          </section>
        </div>

        <div className="detail-actions">
          <button type="button" className={`btn ${isSaved ? "btn-saved" : "btn-save"}`} onClick={() => onSave(college)}>
            {isSaved ? "💙 Saved" : "🤍 Save"}
          </button>
          <button
            type="button"
            className={`btn ${inCompare ? "btn-compare-on" : "btn-primary"}`}
            onClick={() => onCompare(college)}
            disabled={compareDisabled}
            title={
              compareDisabled
                ? "Compare is limited to 3 colleges. Remove one from the compare section first."
                : undefined
            }
          >
            {inCompare ? "Selected" : "Compare"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default CollegeDetailPage;
