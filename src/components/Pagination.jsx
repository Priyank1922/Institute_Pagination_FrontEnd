import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({
  currentPage,     // 0-based
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange
}) {
  // Standard option sizes for page size selection
  const pageSizeOptions = [5, 10, 20, 50];

  // Calculate item range text
  const startItem = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  // Generate page numbers with logic for ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(0, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);

      if (currentPage < 2) {
        end = 4;
      } else if (currentPage > totalPages - 3) {
        start = totalPages - 5;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing <span className="font-semibold">{startItem}</span> to{' '}
        <span className="font-semibold">{endItem}</span> of{' '}
        <span className="font-semibold">{totalElements}</span> entries
      </div>

      <div className="pagination-controls">
        {/* Page Size Selector */}
        <div className="page-size-selector">
          <label htmlFor="pageSizeSelect">Show</label>
          <select
            id="pageSizeSelect"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="select-input"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>

        {/* Navigation Buttons */}
        <div className="pagination-buttons">
          {/* First Page */}
          <button
            onClick={() => onPageChange(0)}
            disabled={currentPage === 0}
            className="pagination-btn icon-btn"
            title="First Page"
            aria-label="First page"
          >
            <ChevronsLeft size={16} />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="pagination-btn icon-btn"
            title="Previous Page"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page Numbers */}
          {totalPages > 5 && currentPage > 2 && (
            <>
              <button
                onClick={() => onPageChange(0)}
                className={`pagination-btn ${currentPage === 0 ? 'active' : ''}`}
              >
                1
              </button>
              {currentPage > 3 && <span className="pagination-ellipsis">...</span>}
            </>
          )}

          {pages.map((pageIndex) => {
            // Avoid duplicating page 1 or last page if they are handled by static bounds
            if (totalPages > 5) {
              if (pageIndex === 0 && currentPage > 2) return null;
              if (pageIndex === totalPages - 1 && currentPage < totalPages - 3) return null;
            }

            return (
              <button
                key={pageIndex}
                onClick={() => onPageChange(pageIndex)}
                className={`pagination-btn ${currentPage === pageIndex ? 'active' : ''}`}
              >
                {pageIndex + 1}
              </button>
            );
          })}

          {totalPages > 5 && currentPage < totalPages - 3 && (
            <>
              {currentPage < totalPages - 4 && <span className="pagination-ellipsis">...</span>}
              <button
                onClick={() => onPageChange(totalPages - 1)}
                className={`pagination-btn ${currentPage === totalPages - 1 ? 'active' : ''}`}
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1 || totalPages === 0}
            className="pagination-btn icon-btn"
            title="Next Page"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>

          {/* Last Page */}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage === totalPages - 1 || totalPages === 0}
            className="pagination-btn icon-btn"
            title="Last Page"
            aria-label="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
