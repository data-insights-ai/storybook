import { Children, isValidElement, useId, type ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { surfaceClass } from "../../../../internal/surface";
import { Eyebrow } from "../../../text/Eyebrow";
import "./Panel.css";

/**
 * A block of content, drawn by tone rather than by a line. Every card-like
 * block of a page is a Panel: a group of facts, a dashboard figure with its
 * chart, the page's one navy hero, the destructive actions at the end of a
 * record.
 *
 * Use it for one block a reader takes in as a whole. Not for a record that
 * reads and edits by section (`DetailSection`), a message about the page
 * (`Notice`), or a list of rows (`DataTable`, which sits in a Panel with
 * `padded={false}`).
 *
 * Anatomy, top to bottom: the head (an optional mono `label`, the `title`
 * in the display face, a `PanelStatus` beside it, a `PanelMeta` and, without
 * a footer, `PanelActions` at its end); then `PanelLead`; then the content,
 * or a `PanelFigure` beside a `PanelVisual`; then `PanelNote`; last the
 * `PanelFooter` row with `PanelActions` at its end. One inset all round,
 * the rows 16px apart (12 compact), never bands of their own. Slots may be
 * written in any order.
 *
 * Variants: `surface="sheet"` lifts from the ground, `"inset"` sinks inside
 * a surface, `"hero"` is the navy zone behind the page's signature visual
 * (dark in both themes, one per page, its actions stay in the head and its
 * footer, a `FigureRow variant="footer"`, sits under a fine rule).
 * `tone="danger"` draws the danger edge around the irreversible actions at
 * the end of a record, one `DangerAction` row each. `emphasis` is the gold
 * edge of the one block that matters in the view. `wide` spans every column
 * of the `Grid` it sits in.
 *
 * Content rules: only the title is bold; a lead, the body, a value and a
 * note are regular weight. A panel carries no number of its own.
 *
 * Accessibility: with a `heading` level the title is a heading and names the
 * panel's region; without one it is the panel's name only.
 */
export function Panel({
  surface = "sheet",
  tone = "neutral",
  emphasis = false,
  wide = false,
  label,
  title,
  heading,
  padded = true,
  className,
  children,
}: {
  /** `sheet` lifts from the ground; `inset` sinks inside a surface; `hero` is the navy zone of the page's signature visual. */
  surface?: "sheet" | "inset" | "hero";
  /** `danger` holds what cannot be taken back: the danger edge around `DangerAction` rows. */
  tone?: "neutral" | "danger";
  /** The one block that matters in the view: a gold edge. */
  emphasis?: boolean;
  /** Spans every column of the `Grid` it sits in, for a chart that needs the width. */
  wide?: boolean;
  /** A mono capital line above the title: a kind, a source, a period. */
  label?: string;
  title?: string;
  /** The title's level in the page outline. Without it the title is not a heading. */
  heading?: 2 | 3 | 4;
  /** Off when the child draws to the panel's edge, such as a list. */
  padded?: boolean;
  className?: string;
  /** The content, and at most one each of `PanelStatus`, `PanelMeta`, `PanelActions`, `PanelLead`, `PanelFigure`, `PanelVisual`, `PanelNote` and `PanelFooter`. */
  children?: ReactNode;
}) {
  const id = useId();
  /*
   * The slots are picked out of `children` by type: the head sits above the
   * content and the footer below it, so a slot cannot be placed by writing
   * it in source order.
   */
  const slot = {
    status: [],
    meta: [],
    actions: [],
    lead: [],
    figure: [],
    visual: [],
    note: [],
    footer: [],
  } as Record<string, ReactNode[]>;
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) body.push(child);
    else if (child.type === PanelStatus) slot.status.push(child);
    else if (child.type === PanelMeta) slot.meta.push(child);
    else if (child.type === PanelActions) slot.actions.push(child);
    else if (child.type === PanelLead) slot.lead.push(child);
    else if (child.type === PanelFigure) slot.figure.push(child);
    else if (child.type === PanelVisual) slot.visual.push(child);
    else if (child.type === PanelNote) slot.note.push(child);
    else if (child.type === PanelFooter) slot.footer.push(child);
    else body.push(child);
  });
  const hero = surface === "hero";
  const footed = slot.footer.length > 0;
  const actionsInFoot = footed && !hero;
  const headed =
    title !== undefined ||
    label !== undefined ||
    slot.status.length > 0 ||
    slot.meta.length > 0 ||
    (!actionsInFoot && slot.actions.length > 0);
  const staged = slot.figure.length + slot.visual.length > 0;

  return (
    <section
      className={cx(
        surfaceClass({ plane: surface, edge: emphasis ? "one" : tone === "danger" ? "danger" : "none" }),
        "di-panel",
        hero && "is-hero",
        emphasis && "is-emphasis",
        tone === "danger" && "is-danger",
        wide && "is-wide",
        className,
      )}
      data-theme={hero ? "dark" : undefined}
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
          {actionsInFoot ? null : slot.actions}
        </div>
      ) : null}
      {staged ? (
        <div className="di-panel-stage">
          {slot.figure}
          {slot.visual}
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
          {actionsInFoot ? slot.actions : null}
        </div>
      ) : null}
    </section>
  );
}

function PanelTitle({ id, heading, title }: { id: string; heading?: 2 | 3 | 4; title: string }) {
  const Heading = heading === undefined ? "span" : (`h${heading}` as const);
  return (
    <Heading id={id} className="di-panel-title">
      {title}
    </Heading>
  );
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
 * library already has a component for — `SealValue`, `Tag mono` — and a
 * bare string cannot carry the mono track or the mark.
 */
export function PanelMeta({ children }: { children: ReactNode }) {
  return <span className="di-panel-meta">{children}</span>;
}

/**
 * What a person can do with the panel: one `Button`, a `TextLink` to the
 * page behind a figure, or a few. At the end of the footer row when the
 * panel has a `PanelFooter`, otherwise (and always in the hero) at the end
 * of the head.
 */
export function PanelActions({ children }: { children: ReactNode }) {
  return <div className="di-panel-actions">{children}</div>;
}

/**
 * The row under a panel's content, inside the same surface: a count, a
 * source, a link onward. `PanelActions` join it at its end. In the hero it
 * holds the `FigureRow variant="footer"` under a fine rule.
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
 * The one figure the panel is about, in a column before its `PanelVisual`:
 * a `Figure size="hero"` in the hero, a `Figure` on a dashboard. On a narrow panel
 * it stacks above the visual.
 */
export function PanelFigure({ children }: { children: ReactNode }) {
  return <div className="di-panel-figure">{children}</div>;
}

/** The chart, timeline or map the panel exists to show. Without a `PanelFigure` it takes the whole width. */
export function PanelVisual({ children }: { children: ReactNode }) {
  return <div className="di-panel-visual">{children}</div>;
}

/**
 * A quiet line under a panel's content: the caveat, the unit, the thing
 * the numbers above do not say. It is never where a fact lives.
 */
export function PanelNote({ children }: { children: ReactNode }) {
  return <p className="di-panel-note">{children}</p>;
}
