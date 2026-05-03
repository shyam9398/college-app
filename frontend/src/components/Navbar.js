import React from "react";

const SECTION_IDS = {
  explorer: "section-explorer",
  saved: "section-saved",
  compare: "section-compare",
  predictor: "section-predictor",
};

function Navbar({ onNav = () => {} }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button type="button" className="logo" onClick={() => onNav("explorer")}>
          College Explorer
        </button>
        <nav className="nav-links" aria-label="Main">
          <button type="button" onClick={() => onNav("explorer")}>
            Browse
          </button>
          <button type="button" onClick={() => onNav("saved")}>
            Saved
          </button>
          <button type="button" onClick={() => onNav("compare")}>
            Compare
          </button>
          <button type="button" onClick={() => onNav("predictor")}>
            Rank predictor
          </button>
        </nav>
      </div>
    </header>
  );
}

export { SECTION_IDS };
export default Navbar;
