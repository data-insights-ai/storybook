import type { ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { SealMark } from "../../status/SealValue";
import "./Eyebrow.css";

/**
 * The caption a step above a title: what kind of thing the title names, or
 * where the reader is ("Coverage", "Last 7 days", "Delivery failed").
 *
 * **When to use:** above a page or section title, a dialog title, an empty
 * state, the sign-in card. Most of these render it from an `eyebrow` or
 * `label` prop: `PageHeader` (both levels), `Panel label`, `Dialog`,
 * `Notice`, `SignIn`. **When not to:** as a heading on its own (a caption
 * with no title under it is `PageHeader level={2}` or a `Panel` title); a
 * label above a value (`Figure`, `FactList`); a line of facts (`MetaLine`).
 *
 * **Anatomy:** for `sealed`, the seal, the label and a rule to the edge;
 * for `plain`, the label alone. The gap beneath it is `--di-eyebrow-gap`,
 * so a head can retune the distance without the eyebrow knowing which head
 * it is in.
 *
 * **Variants:** `sealed` is the one section on record in a view; `plain`
 * repeats over every section. One union prop, because the seal is a claim
 * and the rule is what carries it. `tone="quiet"` sets it in the label ink,
 * for a caption that must not compete with the value under it;
 * `tone="danger"` names a failure.
 *
 * **Content:** one to four words, sentence case in the source (it is set in
 * capitals); no numbering, a section number that is not a real sequence is
 * decoration.
 *
 * **Accessibility:** plain text read before the title; the seal and the
 * rule are hidden from screen readers.
 */
export function Eyebrow({
  children,
  variant = "sealed",
  tone = "default",
  className,
}: {
  children: ReactNode;
  /** `sealed` takes the dot and the rule — one per view. `plain` repeats. */
  variant?: "sealed" | "plain";
  tone?: "default" | "quiet" | "danger";
  className?: string;
}) {
  const sealed = variant === "sealed";
  return (
    <div className={cx("di-eyebrow", `di-eyebrow-${variant}`, tone !== "default" && `is-${tone}`, className)}>
      {sealed ? <SealMark state="sealed" /> : null}
      <span className="di-eyebrow-label">{children}</span>
      {sealed ? <span className="di-eyebrow-rule" aria-hidden /> : null}
    </div>
  );
}
