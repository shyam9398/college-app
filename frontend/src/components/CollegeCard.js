import React from "react";
import RatingTag from "./RatingTag";
import { isInCollegeList } from "../utils/college";

function CollegeCard({
  college,
  savedList,
  onDetails,
  onSave,
  onCompare,
  inCompare,
  compareFull,
}) {
  const isSaved = isInCollegeList(savedList, college);
  const compareDisabled = !inCompare && compareFull;

  return (
    <article className="card">
      <div className="card-body">
        <div className="card-title-row">
          <h3 className="card-title">{college.name}</h3>
          <RatingTag rating={college.rating} />
        </div>
        <ul className="card-meta">
          <li>{college.location}</li>
          <li>Fees: ₹{college.fees}</li>
          <li>Rating: {college.rating}</li>
          <li>Placement: {college.placement}%</li>
        </ul>
      </div>
      <div className="btn-group btn-group--card">
        <button type="button" className="btn btn-secondary" onClick={() => onDetails(college)}>
          Details
        </button>
        <button
          type="button"
          className={`btn ${isSaved ? "btn-saved" : "btn-primary"}`}
          onClick={() => onSave(college)}
        >
          {isSaved ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          className={`btn ${inCompare ? "btn-compare-on" : "btn-primary"}`}
          onClick={() => onCompare(college)}
          disabled={compareDisabled}
          title={
            compareDisabled ? "You can compare up to 3 colleges. Remove one to add another." : undefined
          }
        >
          {inCompare ? "Compare ✓" : "Compare"}
        </button>
      </div>
    </article>
  );
}

export default CollegeCard;
