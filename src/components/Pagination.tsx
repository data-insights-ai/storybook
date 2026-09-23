import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "../cx";
import "./Pagination.css";

/**
 * Controlled. The caller owns `page` because it also owns which rows are
 * visible. Every control calls `onPageChange` with the page it wants.
 *
 * The numbers are buttons, not links: they change what this view shows
 * rather than navigating away from it.
 */
export function Pagination({
  page,
  pages,
  onPageChange,
  label,
  previousLabel,
  nextLabel,
  pageLabel,
  numbered = true,
}: {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  /** Names the whole control, e.g. "Register pages". */
  label: string;
  previousLabel: string;
  nextLabel: string;
  /** Prefixes each number for a screen reader, e.g. "Page". */
  pageLabel: string;
  /** Off leaves only the arrows and the current page. */
  numbered?: boolean;
}) {
  const numbers = Array.from({ length: pages }, (_, i) => i + 1);

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
      {numbered ? (
        numbers.map((n) => (
          <button
            key={n}
            type="button"
            className={cx("di-page-btn", "di-page-num", n === page && "is-current")}
            aria-label={`${pageLabel} ${n}`}
            aria-current={n === page ? "page" : undefined}
            onClick={() => onPageChange(n)}
          >
            {n}
          </button>
        ))
      ) : (
        <span className="di-page-current" aria-current="page">
          {page}
        </span>
      )}
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
