import React from "react";

function CollegeDetailModal({ college, onClose }) {
  if (!college) return null;

  return (
    <div className="detail-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="detail-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${college.name} details`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="detail-modal__close" onClick={onClose} aria-label="Close details">
          ×
        </button>

        <h2 className="detail-modal__title">{college.name}</h2>
        <div className={`rating-tag ${college.tier === "Top Tier" ? "rating-tag--tier" : "rating-tag--good"}`}>{college.tier}</div>
        <p className="detail-modal__location">{college.location}</p>
        <p className="detail-modal__description">{college.description}</p>

        <section className="detail-modal__section">
          <h3>Overview</h3>
          <ul>
            <li>Location: {college.location}</li>
            <li>Fees: ₹{college.fees}</li>
            <li>Rating: {college.rating}</li>
            <li>Placement: {college.placement}%</li>
          </ul>
        </section>

        <section className="detail-modal__section">
          <h3>Courses</h3>
          <ul>
            {(college.courses || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="detail-modal__section">
          <h3>Facilities</h3>
          <p>Hostel, Library, Labs</p>
        </section>

        <section className="detail-modal__section">
          <h3>Admission Info</h3>
          <p>Admissions are generally based on entrance exams and basic eligibility criteria for the selected course.</p>
        </section>

        <a href={college.website} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Visit Website
        </a>
      </div>
    </div>
  );
}

export default React.memo(CollegeDetailModal);
