import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

/**
 * Controlled. The caller owns `page` because it also owns which rows are
 * visible. Previous and next call `onPageChange` with the next page.
 */
export function Pagination({
  page,
  pages,
  onPageChange,
  label,
  previousLabel,
  nextLabel,
}: {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  label: string;
  previousLabel: string;
  nextLabel: string;
}) {
  return (
    <nav className="di-pages" aria-label={label}>
      <button
        type="button"
        className="di-page-btn"
        disabled={page <= 1}
        aria-label={previousLabel}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft aria-hidden />
      </button>
      <span className="di-page-current" aria-current="page">
        {page}
      </span>
      <button
        type="button"
        className="di-page-btn"
        disabled={page >= pages}
        aria-label={nextLabel}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight aria-hidden />
      </button>
    </nav>
  );
}
