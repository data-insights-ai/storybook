import { cx } from "../../../../internal/cx";
import { useDelayed } from "../../../../internal/useDelayed";
import { LoadingPage } from "./LoadingPage";
import { LoadingTable } from "./LoadingTable";
import "../../Delayed/Delayed.css";
import "./Loading.css";

export type LoadingShape = "inline" | "app" | "list" | "detail" | "form" | "table";

/**
 * Something is on its way and there is no count to give. One status
 * region in the shape of the wait: a turning ring with its word
 * (`inline`), the mark while the application starts (`app`), or the
 * page or table it will become (`list`, `detail`, `form`, `table`), with
 * bars standing in for the values.
 *
 * Nothing appears for the first `delay` ms, and the space is reserved
 * from the first frame, so a fast answer neither flashes nor shifts the
 * page. Only the bars and the dots breathe; nothing sweeps, and
 * `prefers-reduced-motion` holds everything still.
 */
export function Loading({
  label,
  shape = "inline",
  rows,
  heading = true,
  index = false,
  delay = 150,
  className,
}: {
  /** What is being waited for, as a short sentence: "Loading sources". Shown for `inline` and `app`, read out for the others. */
  label: string;
  shape?: LoadingShape;
  /** Rows of a `list` or `table`. */
  rows?: number;
  /** `list`, `detail` and `form`: false when the layout around already shows the page header. */
  heading?: boolean;
  /** `list` and `table`: the table has a `TableIndex` column, so the skeleton keeps its place. */
  index?: boolean;
  /** Milliseconds before anything appears; 0 shows it at once. */
  delay?: number;
  className?: string;
}) {
  const shown = useDelayed(delay);
  const visible = shape === "inline" || shape === "app";
  return (
    <div
      className={cx("di-loading", `di-loading-${shape}`, "di-delayed", className)}
      data-shown={shown}
      role="status"
      aria-live="polite"
    >
      {shape === "inline" ? <span className="di-loading-ring" aria-hidden /> : null}
      {shape === "app" ? <AppMark /> : null}
      <span className={visible ? "di-loading-label" : "di-sr"}>{label}</span>
      {shape === "table" ? <LoadingTable rows={rows ?? 5} index={index} /> : null}
      {shape === "list" || shape === "detail" || shape === "form" ? (
        <LoadingPage shape={shape} rows={rows ?? 6} heading={heading} index={index} />
      ) : null}
    </div>
  );
}

/** The mark drawn inline, so it takes the theme: navy on paper, ivory after dark. */
function AppMark() {
  return (
    <svg className="di-loading-mark" viewBox="0 0 145 132.2" aria-hidden focusable="false">
      <g className="di-loading-strokes">
        <polyline points="58.2 3.2 3.7 34.7 3.7 97.5 58.2 129" />
        <polyline points="86.8 129 141.3 97.5 141.3 34.7 86.8 3.2" />
        <line x1="108.1" y1="40.6" x2="108.1" y2="87.5" />
        <polyline points="23.2 89.2 51.6 36.1 79.5 89.2" />
      </g>
      <circle className="di-loading-dot" cx="23.2" cy="92.2" r="7.9" />
      <circle className="di-loading-dot" cx="80.1" cy="92.2" r="7.9" />
      <circle className="di-loading-dot" cx="108.1" cy="92.2" r="7.9" />
      <circle className="di-loading-seal" cx="108.1" cy="33.9" r="7.9" />
    </svg>
  );
}
