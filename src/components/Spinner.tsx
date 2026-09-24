import { cx } from "../cx";
import "./Spinner.css";

/**
 * For a wait too short to count. It carries a word, because a ring
 * turning on its own does not say what is being waited for.
 */
export function Spinner({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cx("di-spinner-row", className)} role="status">
      <span className="di-spinner" aria-hidden />
      <span className="di-spinner-label">{label}</span>
    </div>
  );
}
