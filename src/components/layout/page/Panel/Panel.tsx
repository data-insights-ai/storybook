import { Children, isValidElement, useId, type ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { surfaceClass } from "../../../../internal/surface";
import { Eyebrow } from "../../../text/Eyebrow";
import "./Panel.css";

/**
 * A block of content, drawn by tone rather than by a line: the surface
 * lifts a step from the page ground. `inset` sinks a step instead, for a
 * group inside a surface; it is the deepest a region goes.
 *
 * One inset all round: the head, the content and the footer are rows
 * inside the surface, 16px apart, never bands of their own. The head is
 * an optional mono `label` above the `title` (set in the display face),
 * a `PanelStatus` beside the title it qualifies, and a `PanelMeta` at its
 * end. `PanelActions` sit at the end of the `PanelFooter` row, or at the
 * end of the head when the panel has no footer. A `title` with a
 * `heading` level is a heading the page outline reads; without one it is
 * the panel's name only.
 *
 * Only the title is bold: a lead, the body and a note are regular weight.
 *
 * `emphasis` marks the one block that matters in the view with a gold
 * edge. One per view: the rule is the point.
 */
export function Panel({
  surface = "sheet",
  emphasis = false,
  label,
  title,
  heading,
  padded = true,
  className,
  children,
}: {
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
  /** The panel's content, and at most one each of `PanelStatus`, `PanelMeta`, `PanelActions`, `PanelLead`, `PanelNote` and `PanelFooter`. */
  children?: ReactNode;
}) {
  const id = useId();
  /*
   * The slots are picked out of `children` by type, the way `ModalFrame`
   * does it: the head sits above the content and the footer below it, so
   * a slot cannot be placed by writing it in source order.
   */
  const slot = { status: [], meta: [], actions: [], lead: [], note: [], footer: [] } as Record<string, ReactNode[]>;
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) body.push(child);
    else if (child.type === PanelStatus) slot.status.push(child);
    else if (child.type === PanelMeta) slot.meta.push(child);
    else if (child.type === PanelActions) slot.actions.push(child);
    else if (child.type === PanelLead) slot.lead.push(child);
    else if (child.type === PanelNote) slot.note.push(child);
    else if (child.type === PanelFooter) slot.footer.push(child);
    else body.push(child);
  });
  const footed = slot.footer.length > 0;
  const headed =
    title !== undefined ||
    label !== undefined ||
    slot.status.length > 0 ||
    slot.meta.length > 0 ||
    (!footed && slot.actions.length > 0);

  return (
    <section
      className={cx(
        surfaceClass({ plane: surface, edge: emphasis ? "one" : "none" }),
        "di-panel",
        emphasis && "is-emphasis",
        className,
      )}
      aria-labelledby={title !== undefined && heading ? id : undefined}
    >
      {headed ? (
        <div className="di-panel-header">
          <div className="di-panel-titles">
            {label === undefined ? null : (
              <Eyebrow variant="plain" tone="quiet">
                {label}
              </Eyebrow>
            )}
            {title === undefined && slot.status.length === 0 ? null : (
              <div className="di-panel-title-row">
                {title === undefined ? null : <PanelTitle id={id} heading={heading} title={title} />}
                {slot.status}
              </div>
            )}
          </div>
          {slot.meta}
          {footed ? null : slot.actions}
        </div>
      ) : null}
      {body.length + slot.lead.length + slot.note.length === 0 ? null : (
        <div className={cx("di-panel-content", !padded && "di-panel-content-flush")}>
          {slot.lead}
          {body}
          {slot.note}
        </div>
      )}
      {footed ? (
        <div className="di-panel-foot">
          {slot.footer}
          {slot.actions}
        </div>
      ) : null}
    </section>
  );
}

function PanelTitle({ id, heading, title }: { id: string; heading?: 2 | 3; title: string }) {
  if (heading === 2)
    return (
      <h2 id={id} className="di-panel-title">
        {title}
      </h2>
    );
  if (heading === 3)
    return (
      <h3 id={id} className="di-panel-title">
        {title}
      </h3>
    );
  return <span className="di-panel-title">{title}</span>;
}

/**
 * The state of what the panel shows, beside its title: a `StatusPill`
 * ("expiring", "failed"). It sits with the title it qualifies, never far
 * from it in a footer.
 */
export function PanelStatus({ children }: { children: ReactNode }) {
  return <span className="di-panel-status">{children}</span>;
}

/**
 * The trailing line in a panel's header: a count, a timestamp, a version.
 * A slot rather than a string, because each of those is a value the
 * library already has a component for — `SealValue`, `VersionTag` — and a
 * bare string cannot carry the mono track or the mark.
 */
export function PanelMeta({ children }: { children: ReactNode }) {
  return <span className="di-panel-meta">{children}</span>;
}

/**
 * What a person can do with the panel: one `Button`, or a few. At the end
 * of the footer row when the panel has a `PanelFooter`, otherwise at the
 * end of the head.
 */
export function PanelActions({ children }: { children: ReactNode }) {
  return <div className="di-panel-actions">{children}</div>;
}

/**
 * The row under a panel's content, inside the same surface: a count, a
 * source, a link onward. `PanelActions` join it at its end.
 */
export function PanelFooter({ children }: { children: ReactNode }) {
  return <div className="di-panel-footer">{children}</div>;
}

/**
 * What the block asks of the reader, as its lead line: "Isolate srv-fs-02
 * before the next upload." Placed first in the content, above the proof
 * and the actions, wherever it is written. Regular weight, so the title
 * stays the one bold line; in the `emphasis` block it is set in the one
 * ink — navy by day, gold after dark.
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
