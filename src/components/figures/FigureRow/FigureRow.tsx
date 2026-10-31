import { useLayoutEffect, useRef, type ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { InFigureList } from "../Figure";
import "./FigureRow.css";

/**
 * The supporting figures of a view: three or four `Figure`s in one row,
 * separated by space and a hairline between two figures, never boxed. Not
 * for figures that each need their own surface or actions (a `Grid` of
 * `Panel`s with a `Figure` each), nor for the facts of one record
 * (`FactList`).
 *
 * `footer` is the row's place under a hero `Panel` (`surface="hero"`), closing it in its `PanelFooter`.
 * Where a page has no hero, `strip` sets the row on a tonal band of its
 * own, a step below the ground, so it does not dissolve into the page.
 * `size="compact"` sets the values in the body size: a quiet health line
 * at the foot of a page ("2 of 2 active"), never a row of headline figures.
 *
 * The figures share one row in equal columns while every value fits on
 * one line and every label breaks only between words; otherwise an even
 * count takes two rows of equal columns, and any other count stacks. A row
 * never leaves one figure alone under the others (no 2 + 1).
 *
 * Accessibility: one description list named by `label`; each figure is
 * one term with its details.
 */
export function FigureRow({
  label,
  variant = "strip",
  size = "regular",
  children,
}: {
  /** The row's name for assistive technology: "Case figures". */
  label: string;
  variant?: "footer" | "strip";
  size?: "regular" | "compact";
  /** `Figure`s. */
  children: ReactNode;
}) {
  const list = useRef<HTMLDListElement>(null);
  useLayoutEffect(() => {
    const element = list.current;
    if (!element) return;
    let width = -1;
    const arrange = (force = false) => {
      if (!force && element.clientWidth === width) return;
      width = element.clientWidth;
      const figures = Array.from(element.children) as HTMLElement[];
      const count = figures.length;
      const options = count > 2 && count % 2 === 0 ? [count, count / 2] : [count];
      element.dataset.cols = "";
      for (const columns of [...options, 1]) {
        element.style.setProperty("--di-figure-cols", String(columns));
        if (columns === 1 || figures.every(fitsItsColumn)) return;
      }
    };
    arrange(true);
    const observer = new ResizeObserver(() => arrange());
    observer.observe(element);
    const fonts = element.ownerDocument.fonts;
    const again = () => arrange(true);
    fonts?.addEventListener("loadingdone", again);
    return () => {
      observer.disconnect();
      fonts?.removeEventListener("loadingdone", again);
    };
  }, [children]);
  return (
    <div className={cx("di-figure-row", `di-figure-row-${variant}`, size === "compact" && "is-compact")}>
      <dl ref={list} className="di-figure-list" aria-label={label}>
        <InFigureList.Provider value={true}>{children}</InFigureList.Provider>
      </dl>
    </div>
  );
}

/** The value stays on one line and the label breaks only between words. */
function fitsItsColumn(figure: HTMLElement) {
  const value = figure.querySelector<HTMLElement>(".di-figure-value");
  const label = figure.querySelector<HTMLElement>(".di-figure-label");
  let fits = true;
  if (value) {
    value.style.whiteSpace = "nowrap";
    fits = !overflows(value);
    value.style.whiteSpace = "";
  }
  if (fits && label) {
    label.style.overflowWrap = "normal";
    fits = !overflows(label);
    label.style.overflowWrap = "";
  }
  return fits;
}

/* In fractions of a pixel: scrollWidth and clientWidth round, and a value 0.7px wider than its column still wraps. */
function overflows(element: HTMLElement) {
  const text = element.ownerDocument.createRange();
  text.selectNodeContents(element);
  return text.getBoundingClientRect().width > element.getBoundingClientRect().width;
}
