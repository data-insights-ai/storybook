import { isValidElement, useEffect, useId, type ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { unwrapped } from "../../../internal/slots";
import { surfaceClass } from "../../../internal/surface";
import "./PlanGrid.css";

/**
 * The plans of one offer side by side, each a `PlanCard`. Every card has the
 * same rows — name, lead, price, billing line, details, features, note, action —
 * and the grid lines them up across the cards of a row, so a badge, a
 * longer feature list or a missing line in one card never moves the price
 * or the action of another. Each card's action sits in the last row, at the
 * same height in every card.
 *
 * Up to four columns (fewer with fewer plans, counted from the cards the
 * list draws), two on a half-wide block, one on a phone; the columns follow
 * the width of the block, not the window's, and never force it wider.
 *
 * Accessibility: a list named by `label`, one item per plan.
 */
export function PlanGrid({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="di-plan-frame">
      <ul className="di-plan-grid" aria-label={label}>
        {children}
      </ul>
    </div>
  );
}

/**
 * One plan in a `PlanGrid`. `lead` is who the plan is for, one line under
 * its name. `price` is the amount as the reader pays it
 * ("€9"), `period` what it is for ("a month"), `billing` the one line on how
 * it is billed or what a year costs. `details` are the plan's facts (seats,
 * what an extra seat costs); `note` is a small footnote, a limit or a
 * condition. Its slots, written as children in any order (also inside
 * Fragments): a `PlanStatus` beside the name, a `PlanFeature` for each
 * thing the plan adds (under `featuresLabel`) and one `PlanAction` at the
 * foot. Anything else is not drawn, and a development build warns.
 *
 * Only the name is bold; the price is set large in the display face, at
 * regular weight.
 *
 * `emphasis` gives the gold edge to the one plan the page points a reader
 * to; name why in a `PlanStatus` beside its name ("Recommended").
 */
export function PlanCard({
  name,
  heading = 3,
  lead,
  price,
  period,
  billing,
  details = [],
  featuresLabel,
  note,
  emphasis = false,
  children,
}: {
  name: string;
  /** The name's level in the page outline. */
  heading?: 2 | 3 | 4;
  /** Who the plan is for, under its name. */
  lead?: string;
  price: string;
  period?: string;
  billing?: string;
  details?: string[];
  featuresLabel?: string;
  note?: string;
  /** The one plan the page points a reader to: the gold edge. */
  emphasis?: boolean;
  /** At most one `PlanStatus` and one `PlanAction`, and the `PlanFeature`s. */
  children?: ReactNode;
}) {
  const id = useId();
  const Heading = `h${heading}` as const;
  const slot = { status: [], features: [], action: [] } as Record<string, ReactNode[]>;
  let dropped = false;
  for (const child of unwrapped(children)) {
    if (isValidElement(child) && child.type === PlanStatus) slot.status.push(child);
    else if (isValidElement(child) && child.type === PlanFeature) slot.features.push(child);
    else if (isValidElement(child) && child.type === PlanAction) slot.action.push(child);
    else if (child !== null && child !== undefined && typeof child !== "boolean" && child !== "") dropped = true;
  }
  useEffect(() => {
    if (dropped && typeof process !== "undefined" && process.env.NODE_ENV !== "production")
      console.warn(`PlanCard "${name}": only PlanStatus, PlanFeature and PlanAction children are drawn.`);
  }, [dropped, name]);
  return (
    <li className={cx(surfaceClass({ edge: emphasis ? "one" : "none" }), "di-plan-card")} aria-labelledby={id}>
      <div className="di-plan-head">
        <Heading id={id} className="di-plan-name">
          {name}
        </Heading>
        {slot.status}
      </div>
      <p className="di-plan-lead">{lead}</p>
      <p className="di-plan-price">
        <span className="di-plan-amount">{price}</span>
        {period === undefined ? null : (
          <>
            {/* Read as "€9 a month", not "€9a month": the gap draws the space, the text carries it. */}{" "}
            <span className="di-plan-period">{period}</span>
          </>
        )}
      </p>
      <p className="di-plan-billing">{billing}</p>
      {details.length === 0 ? (
        <div className="di-plan-details" />
      ) : (
        <ul className="di-plan-details">
          {details.map((detail, i) => (
            // A detail may repeat another's words; its place keeps the key apart.
            <li key={`${i}:${detail}`}>{detail}</li>
          ))}
        </ul>
      )}
      <div className="di-plan-features">
        {slot.features.length === 0 ? null : (
          <>
            {featuresLabel === undefined ? null : <p className="di-plan-features-label">{featuresLabel}</p>}
            <ul className="di-plan-feature-list">{slot.features}</ul>
          </>
        )}
      </div>
      <p className="di-plan-note">{note}</p>
      <div className="di-plan-action">{slot.action}</div>
    </li>
  );
}

/** What sits beside a plan's name: one `Badge`, such as "Coming soon". */
export function PlanStatus({ children }: { children: ReactNode }) {
  return <span className="di-plan-status">{children}</span>;
}

/** One thing a plan adds: its words, and a `Badge` when it is not available yet. */
export function PlanFeature({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

/**
 * The plan's one action: a `Button`, disabled for a plan that cannot be had
 * yet. Several cards say the same words ("Subscribe", "Coming soon"), so the
 * button's name carries the plan: `aria-label="Team: Coming soon"`, the
 * visible words included.
 */
export function PlanAction({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
