import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "../../../internal/cx";
import "./Pagination.css";

/**
 * Moves through the pages of one list: a register, a table, a search
 * result.
 *
 * - **Use it** under a list that loads a page at a time and where the
 *   reader may want to jump (page 3 of 40).
 * - **Not** for a list that grows as the reader scrolls (`InfiniteTable`),
 *   for steps of a process (`Steps`), or for the views of a record
 *   (`Tabs`).
 *
 * Anatomy: Previous, the page numbers, Next. With more than seven pages it
 * keeps the first, the last and the pages round the current one, and an
 * ellipsis stands for the rest, so the control never runs wider than seven
 * slots. `numbered={false}` leaves only the arrows and the current page,
 * for a footer with no room.
 *
 * Placement: under a table it sits at the end of the footer row, with the
 * count of what the page shows ("118–120 of 120") at its start: in a
 * `TableFooter` after the count, in a `Panel` as its `PanelActions` beside a
 * `PanelFooter` count. The arrows are as wide as their chevrons (the hover
 * plate and the target reach round them), so the chevrons, not quiet
 * buttons, land on the table's text edges.
 *
 * Controlled: the caller owns `page` because it also owns which rows are
 * visible; every control calls `onPageChange` with the page it wants. The
 * numbers are buttons, not links: they change what this view shows rather
 * than navigating away from it.
 *
 * Accessibility: a `nav` named by `label`; each number is announced with
 * `pageLabel` ("Page 3"), the current one with `aria-current="page"`;
 * the ellipsis is hidden from screen readers. On a touch screen each button
 * is 40px.
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
  return (
    <nav className="di-pages" aria-label={label}>
      <button
        type="button"
        className="di-page-btn di-page-arrow"
        disabled={page <= 1}
        aria-label={previousLabel}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft aria-hidden />
      </button>
      {numbered ? (
        pageSlots(page, pages).map((n, i) =>
          n === "gap" ? (
            <span key={`gap-${i}`} className="di-page-gap" aria-hidden>
              …
            </span>
          ) : (
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
          ),
        )
      ) : (
        <span className="di-page-current" aria-current="page">
          {page}
        </span>
      )}
      <button
        type="button"
        className="di-page-btn di-page-arrow"
        disabled={page >= pages}
        aria-label={nextLabel}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight aria-hidden />
      </button>
    </nav>
  );
}

/** At most seven slots: the first and last page, the current one with its neighbours, a gap for the rest. */
function pageSlots(page: number, pages: number): (number | "gap")[] {
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  if (pages <= 7) return range(1, pages);
  if (page <= 4) return [...range(1, 5), "gap", pages];
  if (page >= pages - 3) return [1, "gap", ...range(pages - 4, pages)];
  return [1, "gap", page - 1, page, page + 1, "gap", pages];
}
