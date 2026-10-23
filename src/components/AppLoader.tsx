import { cx } from "../cx";
import { useDelayed } from "./useDelayed";
import "./Delayed.css";
import "./AppLoader.css";

/**
 * The application is starting: the mark, centred on the page, with its
 * three dots breathing one after the other until the seal lights last.
 * Shown before there is a shell to keep, and only then; a page change
 * inside the shell is `RouteProgress` plus a `SkeletonPage`.
 *
 * The mark is drawn inline so it takes the theme — navy on paper, ivory
 * after dark — and `prefers-reduced-motion` holds it still.
 */
export function AppLoader({
  label,
  delay = 150,
  className,
}: {
  /** The word under the mark, e.g. "Loading". */
  label: string;
  /** Milliseconds before the loader appears. */
  delay?: number;
  className?: string;
}) {
  const shown = useDelayed(delay);
  return (
    <div className={cx("di-app-loader", "di-delayed", className)} data-shown={shown} role="status" aria-live="polite">
      <svg className="di-app-loader-mark" viewBox="0 0 145 132.2" aria-hidden focusable="false">
        <g className="di-app-loader-strokes">
          <polyline points="58.2 3.2 3.7 34.7 3.7 97.5 58.2 129" />
          <polyline points="86.8 129 141.3 97.5 141.3 34.7 86.8 3.2" />
          <line x1="108.1" y1="40.6" x2="108.1" y2="87.5" />
          <polyline points="23.2 89.2 51.6 36.1 79.5 89.2" />
        </g>
        <circle className="di-app-loader-dot" cx="23.2" cy="92.2" r="7.9" />
        <circle className="di-app-loader-dot" cx="80.1" cy="92.2" r="7.9" />
        <circle className="di-app-loader-dot" cx="108.1" cy="92.2" r="7.9" />
        <circle className="di-app-loader-seal" cx="108.1" cy="33.9" r="7.9" />
      </svg>
      <span className="di-app-loader-label">{label}</span>
    </div>
  );
}
