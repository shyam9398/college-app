import React from "react";

const SECTION_IDS = {
  explorer: "section-explorer",
  saved: "section-saved",
  compare: "section-compare",
  predictor: "section-predictor",
};

function Navbar({ onNav = () => {}, compareCount = 0 }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button type="button" className="logo" onClick={() => onNav("explorer")}>
          <span className="logo-mark" aria-hidden="true">
            🎓
          </span>
          <span>College Explorer</span>
        </button>
        <nav className="nav-links" aria-label="Main">
          <button type="button" onClick={() => onNav("explorer")}>
            Browse
          </button>
          <button type="button" onClick={() => onNav("saved")}>
            Saved
          </button>
          <button 
            type="button" 
            className="compare-nav-badge"
            onClick={() => onNav("compare")}
          >
            Compare
            {compareCount > 0 && (
              <span className="compare-nav-pill">
                {compareCount}/3
              </span>
            )}
          </button>
          <button type="button" onClick={() => onNav("predictor")}>
            Rank Predictor
          </button>
          <button type="button" className="nav-auth-btn">
            Login
          </button>
          <button type="button" className="nav-auth-btn nav-auth-btn--solid">
            Sign Up
          </button>
        </nav>
      </div>
    </header>
  );
}


export { SECTION_IDS };
export default Navbar;
