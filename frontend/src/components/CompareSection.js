import React from "react";

function CompareSection({ compareList, onRemove }) {
  return (
    <section id="section-compare" className="section compare-section">
      <h2 className="section-title">Compare colleges</h2>
      <p className="section-lead">Compare fees, ratings, placement, and location side by side.</p>
      {compareList.length === 0 ? (
        <p className="empty-hint">Nothing selected yet. Use Compare on a card (or from details).</p>
      ) : (
        <div className="compare-wrap">
          <div className="compare-horizontal-scroll">
            <div className="compare-horizontal" role="table" aria-label="College comparison">
              <div className="compare-horizontal__row compare-horizontal__row--head" role="row">
                <div role="columnheader" className="compare-cell compare-cell--name">
                  Name
                </div>
                <div role="columnheader" className="compare-cell">
                  Fees
                </div>
                <div role="columnheader" className="compare-cell">
                  Rating
                </div>
                <div role="columnheader" className="compare-cell">
                  Placement
                </div>
                <div role="columnheader" className="compare-cell">
                  Location
                </div>
                <div role="columnheader" className="compare-cell compare-cell--action" aria-hidden="true" />
              </div>
              {compareList.map((c) => (
                <div key={String(c.id)} className="compare-horizontal__row" role="row">
                  <div role="cell" className="compare-cell compare-cell--name">
                    {c.name}
                  </div>
                  <div role="cell" className="compare-cell">
                    ₹{c.fees}
                  </div>
                  <div role="cell" className="compare-cell">
                    {c.rating}
                  </div>
                  <div role="cell" className="compare-cell">
                    {c.placement}%
                  </div>
                  <div role="cell" className="compare-cell">
                    {c.location}
                  </div>
                  <div role="cell" className="compare-cell compare-cell--action">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm compare-remove-btn"
                      onClick={() => onRemove(c)}
                      aria-label={`Remove ${c.name} from compare`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default React.memo(CompareSection);
