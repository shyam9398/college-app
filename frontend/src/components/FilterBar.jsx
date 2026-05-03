import React from "react";
import { FEES_FILTER_OPTIONS, RATING_FILTER_OPTIONS } from "../utils/filterColleges";

function FilterBar({ search, onSearchChange, location, onLocationChange, locations, feesRange, onFeesRangeChange, ratingMin, onRatingMinChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__row filter-bar__row--search">
        <label className="sr-only" htmlFor="search-colleges">
          Search colleges
        </label>
        <input
          id="search-colleges"
          className="input-rounded filter-bar__search"
          placeholder="Search by college name…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="filter-bar__row filter-bar__row--filters">
        <div className="filter-bar__field">
          <label className="filter-bar__label" htmlFor="filter-location">
            Location
          </label>
          <select
            id="filter-location"
            className="input-rounded select-rounded"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
          >
            {locations.map((l) => (
              <option key={l} value={l}>
                {l === "All" ? "All locations" : l}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-bar__field">
          <label className="filter-bar__label" htmlFor="filter-fees">
            Fees
          </label>
          <select
            id="filter-fees"
            className="input-rounded select-rounded"
            value={feesRange}
            onChange={(e) => onFeesRangeChange(e.target.value)}
          >
            {FEES_FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-bar__field">
          <label className="filter-bar__label" htmlFor="filter-rating">
            Min rating
          </label>
          <select
            id="filter-rating"
            className="input-rounded select-rounded"
            value={ratingMin}
            onChange={(e) => onRatingMinChange(e.target.value)}
          >
            {RATING_FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default React.memo(FilterBar);
