import React from "react";

function SavedSection({ saved, onUnsave, onDetails }) {
  return (
    <section id="section-saved" className="section saved-section">
      <h2 className="section-title">Saved colleges</h2>
      <p className="section-lead">Stored on this device ({saved.length} saved).</p>
      {saved.length === 0 ? (
        <p className="empty-hint">Save colleges from the grid to see them listed here.</p>
      ) : (
        <ul className="saved-vertical">
          {saved.map((c) => (
            <li key={String(c.id)} className="saved-vertical__item">
              <div className="saved-vertical__text">
                <span className="saved-vertical__name">{c.name}</span>
                <span className="saved-vertical__location">{c.location}</span>
              </div>
              <div className="saved-vertical__actions">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => onDetails(c)}>
                  Details
                </button>
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onUnsave(c)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default SavedSection;
