import { Children, isValidElement, useId, type ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import "./Panel.css";

/**
 * A block of content, drawn by tone rather than by a line: the surface
 * lifts a step from the page ground. `inset` sinks a step instead, for a
 * group inside a surface; it is the deepest a region goes.
 *
 * The header is an optional mono `label` above the `title` and a
 * `PanelMeta` at its right. A `title` with a `heading` level is a
 * heading the page outline reads; without one it is the panel's name only.
 *
 * `emphasis` marks the one block that matters in the view with a gold
 * edge. One per view: the rule is the point.
 *
 * An `index` column holds an ordinal or a letter where sequence or record
 * identity matters, and nowhere else.
 */
export function Panel({
  index,
  indexSize = "md",
  indexTone = "neutral",
  indexRule = true,
  surface = "sheet",
  emphasis = false,
  label,
  title,
  heading,
  padded = true,
  className,
  children,
}: {
  /** The ordinal or letter in the index column. Omit for a panel with no index. */
  index?: string;
  indexSize?: "md" | "sm";
  indexTone?: "neutral" | "danger";
  /** The hairline running down from the mark. Off for a short tile. */
  indexRule?: boolean;
  /** `sheet` lifts from the ground; `inset` sinks inside a surface. */
  surface?: "sheet" | "inset";
  /** The one block that matters in the view: a gold edge. */
  emphasis?: boolean;
  /** A mono capital line above the title: a kind, a source, a period. */
  label?: string;
  title?: string;
  /** The title's level in the page outline. Without it the title is not a heading. */
  heading?: 2 | 3;
  /** Off when the child draws to the panel's edge, such as a list. */
  padded?: boolean;
  className?: string;
  /** The panel's content, and at most one `PanelMeta`. */
  children?: ReactNode;
}) {
  const id = useId();
  /*
   * `PanelMeta` is picked out of `children` by type, the way `ModalFrame`
   * does it: the header sits above the content area, so the slot cannot be
   * placed by writing it in source order.
   */
  const meta: ReactNode[] = [];
  const lead: ReactNode[] = [];
  const note: ReactNode[] = [];
  const footer: ReactNode[] = [];
  const body: ReactNode[] = [];
  /* Each slot goes where its docs say, whatever order the caller wrote. */
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) body.push(child);
    else if (child.type === PanelMeta) meta.push(child);
    else if (child.type === PanelLead) lead.push(child);
    else if (child.type === PanelNote) note.push(child);
    else if (child.type === PanelFooter) footer.push(child);
    else body.push(child);
  });

  return (
    <section
      className={cx("di-panel", `di-panel-${surface}`, emphasis && "is-emphasis", indexTone === "danger" && "is-danger", className)}
      aria-labelledby={title !== undefined && heading ? id : undefined}
    >
      {index === undefined ? null : (
        <div className={cx("di-panel-index", indexSize === "sm" && "di-panel-index-sm")}>
          <span className="di-panel-index-label">{index}</span>
          {indexRule ? <span className="di-panel-index-rule" aria-hidden /> : null}
        </div>
      )}
      <div className="di-panel-body">
        {title === undefined && label === undefined && meta.length === 0 ? null : (
          <div className="di-panel-header">
            <div className="di-panel-titles">
              {label === undefined ? null : <p className="di-panel-label">{label}</p>}
              {title === undefined ? null : <PanelTitle id={id} heading={heading} title={title} />}
            </div>
            {meta}
          </div>
        )}
        <div className={cx("di-panel-content", !padded && "di-panel-content-flush")}>
          {lead}
          {body}
          {note}
          {footer}
        </div>
      </div>
    </section>
  );
}

function PanelTitle({ id, heading, title }: { id: string; heading?: 2 | 3; title: string }) {
  if (heading === 2) return <h2 id={id} className="di-panel-title">{title}</h2>;
  if (heading === 3) return <h3 id={id} className="di-panel-title">{title}</h3>;
  return <span className="di-panel-title">{title}</span>;
}

/**
 * The trailing line in a panel's header: a count, a timestamp, a version,
 * a state. A slot rather than a string, because each of those is a value
 * the library already has a component for — `SealValue`, `StatusPill`,
 * `VersionTag` — and a bare string cannot carry the mono track or the mark.
 */
export function PanelMeta({ children }: { children: ReactNode }) {
  return <span className="di-panel-meta">{children}</span>;
}

/** The ruled strip under a panel's content: controls, a count, a source. */
export function PanelFooter({ children }: { children: ReactNode }) {
  return <div className="di-panel-footer">{children}</div>;
}

/**
 * What the block asks of the reader, as its lead line: "Isolate srv-fs-02
 * before the next upload." Placed first in the content, above the proof
 * and the actions, wherever it is written. In the `emphasis` block it is set in the one ink —
 * navy by day, gold after dark.
 */
export function PanelLead({ children }: { children: string }) {
  return <p className="di-panel-lead">{children}</p>;
}

/**
 * A quiet line under a panel's content: the caveat, the unit, the thing
 * the numbers above do not say. It is never where a fact lives.
 */
export function PanelNote({ children }: { children: ReactNode }) {
  return <p className="di-panel-note">{children}</p>;
}
