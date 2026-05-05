import React from "react";
import { COURSE_FILTER_OPTIONS, FEES_FILTER_OPTIONS, RATING_FILTER_OPTIONS } from "../utils/filterColleges";

function FilterBar({
  search,
  onSearchChange,
  location,
  onLocationChange,
  locations,
  feesRange,
  onFeesRangeChange,
  ratingMin,
  onRatingMinChange,
  course,
  onCourseChange,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__row filter-bar__row--compact">
        <label className="sr-only" htmlFor="search-colleges">
          Search colleges
        </label>
        <input
          id="search-colleges"
          className="input-rounded filter-bar__search"
          placeholder="Search colleges..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />

        <label className="sr-only" htmlFor="filter-location">
          Location
        </label>
        <select
          id="filter-location"
          className="input-rounded select-rounded filter-bar__compact-select"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
        >
          {locations.map((l) => (
            <option key={l} value={l}>
              {l === "All" ? "All locations" : l}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="filter-fees">
          Fees
        </label>
        <select
          id="filter-fees"
          className="input-rounded select-rounded filter-bar__compact-select"
          value={feesRange}
          onChange={(e) => onFeesRangeChange(e.target.value)}
        >
          {FEES_FILTER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="filter-rating">
          Min rating
        </label>
        <select
          id="filter-rating"
          className="input-rounded select-rounded filter-bar__compact-select"
          value={ratingMin}
          onChange={(e) => onRatingMinChange(e.target.value)}
        >
          {RATING_FILTER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="filter-course">
          Course
        </label>
        <select
          id="filter-course"
          className="input-rounded select-rounded filter-bar__compact-select"
          value={course}
          onChange={(e) => onCourseChange(e.target.value)}
        >
          {COURSE_FILTER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default React.memo(FilterBar);
