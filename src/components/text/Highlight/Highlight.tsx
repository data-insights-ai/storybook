import { cx } from "../../../internal/cx";
import "./Highlight.css";

/**
 * Marks the words inside a text that the reader is looking for: the term a
 * search matched in a result, or the few words a title or a claim turns on.
 *
 * **When to use:** a match inside a sentence, a name or a title, so the eye
 * finds why this line is here; the phrase a brand page title is about
 * (`passage`); the figure a sentence turns on (`figure`). **When not to:**
 * a state or a severity (`StatusPill`, `SeverityMark`); the one value that
 * matters in a view (gold, as a chart and `AttentionList` mark it); the
 * row or option that is selected (the row's own selection look).
 *
 * **Anatomy:** a native `<mark>` around a run of words or a figure.
 *
 * **Look:** the selection family, because a match is something picked out
 * for the reader, not a status and not the one gold thing: the selection
 * tint under ink at full strength (above 4.5:1 in both themes), held by a
 * cornflower hairline, which gives the mark the 3:1 against the surface
 * that the pale tint alone cannot. Not poppy or yellow: both read as a
 * warning.
 *
 * **Variants:** `passage` marks a run of words and is set in the sans band
 * face, so its tint cannot reach the line above in a tight display title;
 * `figure` marks one figure in the line's own font, with tabular figures.
 *
 * **Content:** a few words or one figure, never a whole sentence. Mark only
 * what matched; a line with every word marked marks nothing.
 *
 * **Accessibility:** `<mark>` is plain text to most screen readers; the
 * sentence must make sense without the mark.
 */
export function Highlight({ variant = "passage", children }: { variant?: "passage" | "figure"; children: string }) {
  return <mark className={cx("di-highlight", `di-highlight-${variant}`)}>{children}</mark>;
}
