import { Children, isValidElement, type ReactNode } from "react";
import { cx } from "../cx";
import { SealMark } from "./Seal";
import { StatusPill } from "./StatusPill";
import "./LivingCard.css";

/**
 * An insight in place. It lives inside the card it concerns, above the
 * records it derives from, and never floats over them: a claim does not
 * get a plane of its own.
 *
 * The measurement stays the loudest thing on the card. The insight is
 * quieter than the number it is talking about, by design.
 */
export function LivingCard({
  title,
  insightLabel,
  className,
  children,
}: {
  title: string;
  /** The pill naming what the banner is, e.g. "ai insight". */
  insightLabel: string;
  className?: string;
  /** `LivingActions`, then `LivingBody` and `LivingInsight`. */
  children: ReactNode;
}) {
  return (
    <div className={cx("di-living", className)}>
      <div className="di-living-head">
        <span className="di-living-title">{title}</span>
        <StatusPill tone="inferred">{insightLabel}</StatusPill>
      </div>
      {children}
    </div>
  );
}

/** The card's own controls, at the top right. */
export function LivingActions({ children }: { children: ReactNode }) {
  return <div className="di-living-actions">{children}</div>;
}

export function LivingBody({ children }: { children: ReactNode }) {
  return <div className="di-living-body">{children}</div>;
}

/**
 * The banner: what a model read into the figures above it, the ground it
 * read it from, and the actions an operator may take on it. Each action
 * still goes through its own confirmation.
 */
export function LivingInsight({
  body,
  children,
}: {
  body: string;
  /** One `LivingBasis`, then the actions an operator may take. */
  children?: ReactNode;
}) {
  /* `LivingBasis` sits under the claim; everything else is an action. */
  const basis: ReactNode[] = [];
  const actions: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === LivingBasis) basis.push(child);
    else actions.push(child);
  });
  return (
    <div className="di-living-insight">
      <div className="di-living-insight-row">
        <SealMark state="inferred" size={7} />
        <div className="di-living-insight-copy">
          <p className="di-living-insight-body">{body}</p>
          {basis}
        </div>
      </div>
      <div className="di-living-insight-actions">{actions}</div>
    </div>
  );
}

/**
 * Where the claim comes from. A slot, not a string: a basis names the
 * sources and the confidence it rests on, and those are values the
 * library draws — a `SealValue`, a count — not prose.
 */
export function LivingBasis({ children }: { children: ReactNode }) {
  return <p className="di-living-insight-basis">{children}</p>;
}
