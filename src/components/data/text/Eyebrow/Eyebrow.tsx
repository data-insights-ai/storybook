import type { ReactNode } from "react";
import { cx } from "../../../../cx";
import { SealMark } from "../../marks/SealValue";
import "./Eyebrow.css";

/**
 * The line above a title, in the mono track. One union prop, because the
 * gold dot is a claim and the rule is what carries it — `dot` as a
 * boolean left the rule drawn with nothing to anchor it.
 *
 * `sealed` is the section label beside the seal, with a rule to the edge: this
 * is the section on record, and there is one of those per view. `plain`
 * is the label on its own, which is what sits above every section of a
 * brand page — repeatable, because it says where you are rather than
 * what has been vouched for.
 *
 * The gap beneath it is `--di-eyebrow-gap`, so a head can retune the
 * distance without the eyebrow knowing which head it is in.
 */
export function Eyebrow({
  children,
  variant = "sealed",
  className,
}: {
  children: ReactNode;
  /** `sealed` takes the dot and the rule — one per view. `plain` repeats. */
  variant?: "sealed" | "plain";
  className?: string;
}) {
  const sealed = variant === "sealed";
  return (
    <div className={cx("di-eyebrow", `di-eyebrow-${variant}`, className)}>
      {sealed ? <SealMark state="sealed" /> : null}
      <span className="di-eyebrow-label">{children}</span>
      {sealed ? <span className="di-eyebrow-rule" aria-hidden /> : null}
    </div>
  );
}
