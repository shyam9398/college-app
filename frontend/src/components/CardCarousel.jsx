import React, { useCallback, useEffect, useRef } from "react";

function CardCarousel({ page, totalPages, onPageChange, children }) {
  const trackRef = useRef(null);

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [page]);

  const goPrev = useCallback(() => {
    if (page <= 1) return;
    onPageChange(page - 1);
  }, [page, onPageChange]);

  const goNext = useCallback(() => {
    if (page >= totalPages) return;
    onPageChange(page + 1);
  }, [page, totalPages, onPageChange]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="card-carousel">
      <button
        type="button"
        className="card-carousel__arrow card-carousel__arrow--prev"
        onClick={goPrev}
        disabled={!canPrev}
        aria-label="Previous page of colleges"
      >
        ‹
      </button>
      <div className="card-carousel__viewport">
        <div ref={trackRef} className="card-carousel__track">
          {children}
        </div>
      </div>
      <button
        type="button"
        className="card-carousel__arrow card-carousel__arrow--next"
        onClick={goNext}
        disabled={!canNext}
        aria-label="Next page of colleges"
      >
        ›
      </button>
    </div>
  );
}

export default React.memo(CardCarousel);
