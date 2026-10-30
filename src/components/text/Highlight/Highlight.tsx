import { cx } from "../../../internal/cx";
import "./Highlight.css";

/**
 * The one marked place on a page, in poppy: the words the page is about, or
 * its key figure.
 *
 * **When to use:** once per page, in a brand page title or a claim
 * (`passage`), or on the figure a sentence turns on (`figure`). **When
 * not to:** a state or a severity (`StatusPill`, `SeverityMark`, a
 * `Notice` in danger red with the word: poppy is not a status); a search
 * match in a list; a second place on the same page.
 *
 * **Anatomy:** a native `<mark>` around a run of words or a figure.
 *
 * **Variants:** `passage` lays the tint under a run of words; `figure`
 * sets a figure in poppy ink with no tint. A figure takes the line's font,
 * because only the line knows whether it is prose or a measured value. A
 * passage is set in the sans band face so its tint cannot reach the line
 * above.
 *
 * **Content:** a few words or one figure, never a whole sentence; at most
 * one per page, so a page marks one place, not several.
 *
 * **Accessibility:** `<mark>` is plain text to most screen readers; the
 * sentence must make sense without the colour.
 */
export function Highlight({ variant = "passage", children }: { variant?: "passage" | "figure"; children: string }) {
  return <mark className={cx("di-highlight", `di-highlight-${variant}`)}>{children}</mark>;
}
