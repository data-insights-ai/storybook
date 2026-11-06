import { Children, isValidElement, useId, type CSSProperties, type ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { surfaceClass } from "../../../internal/surface";
import "./PlanGrid.css";

/**
 * The plans of one offer side by side, each a `PlanCard`. Every card has the
 * same rows — name, price, billing line, details, features, note, action —
 * and the grid lines them up across the cards of a row, so a badge, a
 * longer feature list or a missing line in one card never moves the price
 * or the action of another. Each card's action sits in the last row, at the
 * same height in every card.
 *
 * Up to four columns (fewer with fewer plans), two on a half-wide block,
 * one on a phone; the columns follow the width of the block, not the
 * window's, and never force it wider.
 *
 * Accessibility: a list named by `label`, one item per plan.
 */
export function PlanGrid({ label, children }: { label: string; children: ReactNode }) {
  const count = Children.toArray(children).length;
  const columns = {
    "--di-plan-wide": Math.max(1, Math.min(count, 4)),
    "--di-plan-half": Math.max(1, Math.min(count, 2)),
  } as CSSProperties;
  return (
    <div className="di-plan-frame">
      <ul className="di-plan-grid" aria-label={label} style={columns}>
        {children}
      </ul>
    </div>
  );
}

/**
 * One plan in a `PlanGrid`. `price` is the amount as the reader pays it
 * ("€9"), `period` what it is for ("a month"), `billing` the one line on how
 * it is billed or what a year costs. `details` are the plan's facts (seats,
 * what an extra seat costs); `note` is a small footnote, a limit or a
 * condition. Its slots, written as children in any order: a `PlanStatus`
 * beside the name, a `PlanFeature` for each thing the plan adds (under
 * `featuresLabel`) and one `PlanAction` at the foot.
 *
 * Only the name is bold; the price is set large in the display face, at
 * regular weight.
 */
export function PlanCard({
  name,
  heading = 3,
  price,
  period,
  billing,
  details = [],
  featuresLabel,
  note,
  children,
}: {
  name: string;
  /** The name's level in the page outline. */
  heading?: 2 | 3 | 4;
  price: string;
  period?: string;
  billing?: string;
  details?: string[];
  featuresLabel?: string;
  note?: string;
  /** At most one `PlanStatus` and one `PlanAction`, and the `PlanFeature`s. */
  children?: ReactNode;
}) {
  const id = useId();
  const Heading = `h${heading}` as const;
  const slot = { status: [], features: [], action: [] } as Record<string, ReactNode[]>;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === PlanStatus) slot.status.push(child);
    else if (child.type === PlanFeature) slot.features.push(child);
    else if (child.type === PlanAction) slot.action.push(child);
  });
  return (
    <li className={cx(surfaceClass(), "di-plan-card")} aria-labelledby={id}>
      <div className="di-plan-head">
        <Heading id={id} className="di-plan-name">
          {name}
        </Heading>
        {slot.status}
      </div>
      <p className="di-plan-price">
        <span className="di-plan-amount">{price}</span>
        {period === undefined ? null : <span className="di-plan-period">{period}</span>}
      </p>
      <p className="di-plan-billing">{billing}</p>
      {details.length === 0 ? (
        <div className="di-plan-details" />
      ) : (
        <ul className="di-plan-details">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
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

/** The plan's one action: a `Button`, disabled for a plan that cannot be had yet. */
export function PlanAction({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
