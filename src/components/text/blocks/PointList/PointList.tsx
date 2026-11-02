import { createContext, useContext, type ReactNode } from "react";
import "./PointList.css";

type Heading = 2 | 3 | 4;

const PointHeading = createContext<Heading>(3);

/**
 * A brand page's named points: a short heading over a paragraph, several
 * side by side — the reasons to trust, what a release carries.
 *
 * **When to use:** a band of three to six points on a brand page, each
 * named in a few words and said in one or two sentences. **When not to:**
 * a term and its value (`FactList`, `layout="grid"` for stated facts); a
 * real sequence (`Steps`); a product screen.
 *
 * **Anatomy:** `PointList` (the `ul`) holding `Point`s, each a heading and
 * a paragraph. The points wrap at `--di-points-min` (240px) and a short last
 * row shares the width, so a phone reads one column and no cell is left
 * empty.
 *
 * **Size:** the heading runs 18 to 20px with the width of the list
 * (`--di-brand-point-title-size`), the paragraph is 16px
 * (`--di-brand-point-body-size`).
 *
 * **Accessibility:** a list, so a screen reader announces how many points
 * there are; each name is a heading at `heading`, the level the page's
 * outline asks for under the section that holds the list.
 */
export function PointList({
  heading = 3,
  label = "",
  children,
}: {
  /** Every point's heading level: 3 under a section's h2, 2 or 4 where the page outline asks. */
  heading?: Heading;
  /** The list's name for assistive technology, when the section heading above does not already name it. */
  label?: string;
  /** `Point`s. */
  children: ReactNode;
}) {
  return (
    <div className="di-points-frame">
      {/* role="list": Safari drops the list role from a <ul> whose markers are styled away. */}
      <ul className="di-points" role="list" aria-label={label === "" ? undefined : label}>
        <PointHeading.Provider value={heading}>{children}</PointHeading.Provider>
      </ul>
    </div>
  );
}

/** One named point: its name in a few words, the paragraph that says it as the child (inline content: text and links). */
export function Point({ title, children }: { title: string; children: ReactNode }) {
  const Title = `h${useContext(PointHeading)}` as "h2" | "h3" | "h4";
  return (
    <li className="di-point">
      <Title className="di-point-title">{title}</Title>
      <p className="di-point-body">{children}</p>
    </li>
  );
}
