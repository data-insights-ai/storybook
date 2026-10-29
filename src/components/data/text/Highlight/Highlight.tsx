import { cx } from "../../../../cx";
import "./Highlight.css";

/**
 * The marked place on a page, in poppy. `passage` lays the tint under a run
 * of words the page is about; `figure` sets a key figure in poppy ink.
 *
 * At most one accent per page, so a page marks one place, not several.
 * Poppy is not a status: it does not say a value is critical, and a failure
 * stays a `StatusPill` or a `Notice` in danger red, with the word.
 *
 * A native `<mark>`. A figure takes the line's font, because only the line
 * knows whether it is prose or a measured value. A passage is prose, and is
 * set in the sans band face so its tint cannot reach the line above.
 */
export function Highlight({
  variant = "passage",
  children,
}: {
  variant?: "passage" | "figure";
  children: string;
}) {
  return <mark className={cx("di-highlight", `di-highlight-${variant}`)}>{children}</mark>;
}
