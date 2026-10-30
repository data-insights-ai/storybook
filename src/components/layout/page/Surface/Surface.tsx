import { Children, isValidElement, useId, type ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import "./Surface.css";

/**
 * A block of content, drawn by tone rather than by a line. `surface` lifts
 * from the page ground; `inset` sinks inside a surface (a group, a table
 * head, code) and is the deepest a region goes — never a surface in a
 * surface in a surface. `hero` is the one luminous navy zone a page may
 * have, behind its signature visual, in both themes.
 *
 * `emphasis` marks the one block that matters in the view with a gold edge
 * and glow. One per view; the rule is the point.
 *
 * The header is a mono `label` above a block `title` (an h2, or h3 under a
 * section heading), with `SurfaceAside` at its right. `SurfaceTakeaway`
 * closes the block with the sentence the reader should leave with;
 * `SurfaceFooter` holds what belongs to the block's visual below a fine
 * rule, such as the figures that support a hero chart.
 */
export function Surface({
  level = "surface",
  emphasis = false,
  label,
  title,
  heading = 2,
  padded = true,
  className,
  children,
}: {
  level?: "surface" | "inset" | "hero";
  emphasis?: boolean;
  /** A mono capital line above the title: a kind, an ordinal, a source. */
  label?: string;
  title?: string;
  heading?: 2 | 3;
  /** Off when the child draws to the edge, such as a table. */
  padded?: boolean;
  className?: string;
  /** The content, and optionally `SurfaceAside`, `SurfaceTakeaway` and `SurfaceFooter`. */
  children?: ReactNode;
}) {
  const id = useId();
  const aside: ReactNode[] = [];
  const takeaway: ReactNode[] = [];
  const footer: ReactNode[] = [];
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === SurfaceAside) aside.push(child);
    else if (isValidElement(child) && child.type === SurfaceTakeaway) takeaway.push(child);
    else if (isValidElement(child) && child.type === SurfaceFooter) footer.push(child);
    else body.push(child);
  });
  const Heading = heading === 2 ? "h2" : "h3";
  const headed = title !== undefined || label !== undefined || aside.length > 0;
  return (
    <section
      className={cx("di-surface", `di-surface-${level}`, emphasis && "is-emphasis", !padded && "is-flush", className)}
      data-theme={level === "hero" ? "dark" : undefined}
      aria-labelledby={title === undefined ? undefined : id}
    >
      {headed ? (
        <div className="di-surface-head">
          <div className="di-surface-titles">
            {label === undefined ? null : <p className="di-surface-label">{label}</p>}
            {title === undefined ? null : (
              <Heading id={id} className="di-surface-title">
                {title}
              </Heading>
            )}
          </div>
          {aside}
        </div>
      ) : null}
      <div className="di-surface-body">{body}</div>
      {takeaway}
      {footer}
    </section>
  );
}

/** At the right of the header: a link to the full list, a count, one action. */
export function SurfaceAside({ children }: { children: ReactNode }) {
  return <div className="di-surface-aside">{children}</div>;
}

/** The sentence to leave with, at the foot of the block. */
export function SurfaceTakeaway({ children }: { children: ReactNode }) {
  return <p className="di-surface-takeaway">{children}</p>;
}

/** The block's foot, under a fine rule: on a hero, the figures that support its visual. */
export function SurfaceFooter({ children }: { children: ReactNode }) {
  return <div className="di-surface-footer">{children}</div>;
}
