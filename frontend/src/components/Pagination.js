import React from "react";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Pages">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className={`page-num ${page === n ? "active-page" : ""}`}
          onClick={() => onPageChange(n)}
          aria-current={page === n ? "page" : undefined}
        >
          {n}
        </button>
      ))}
    </nav>
  );
}

export default Pagination;
