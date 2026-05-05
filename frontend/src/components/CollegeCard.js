import React from "react";
import RatingTag from "./RatingTag";
import { isInCollegeList } from "../utils/college";

function CollegeCardInner({
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
<article className={`card ${isSaved ? 'card--saved' : ''} ${inCompare ? 'card--selected' : ''}`}>
      <div className="card-body">
        <div className="card-title-row">
          <h3 className="card-title">{college.name}</h3>
          <RatingTag rating={college.rating} />
        </div>
        <ul className="card-meta">
          <li>📍 {college.location}</li>
          <li>Fees: ₹{college.fees}</li>
          <li>⭐ {college.rating}</li>
          <li>Placement: {college.placement}%</li>
        </ul>
      </div>
      <div className="btn-group btn-group--card">
        <button type="button" className="btn btn-secondary" onClick={() => onDetails(college)}>
          View Details
        </button>
        <button
          type="button"
          className={`btn ${isSaved ? "btn-saved" : "btn-save"}`}
          onClick={() => onSave(college)}
        >
          {isSaved ? "💙 Saved" : "🤍 Save"}
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
          {inCompare ? "Selected" : "Compare"}
        </button>
      </div>
    </article>
  );
}

const CollegeCard = React.memo(CollegeCardInner);
export default CollegeCard;
