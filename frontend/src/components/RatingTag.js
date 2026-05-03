import React from "react";

function RatingTag({ rating }) {
  const r = Number(rating);
  if (Number.isNaN(r)) return null;
  if (r > 4.7) {
    return <span className="rating-tag rating-tag--tier">Top Tier</span>;
  }
  if (r > 4.3) {
    return <span className="rating-tag rating-tag--good">Good Choice</span>;
  }
  return null;
}

export default RatingTag;
