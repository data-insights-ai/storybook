import type { ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { SealMark } from "../../marks/status/SealValue";
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
 *
 * It is the one caption above a title: a dialog, a sheet, an empty state
 * and the sign-in card render it rather than setting mono capitals of
 * their own. `tone="danger"` names a failure, as an empty state after an
 * error does.
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
  tone?: "default" | "danger";
  className?: string;
}) {
  const sealed = variant === "sealed";
  return (
    <div className={cx("di-eyebrow", `di-eyebrow-${variant}`, tone === "danger" && "is-danger", className)}>
      {sealed ? <SealMark state="sealed" /> : null}
      <span className="di-eyebrow-label">{children}</span>
      {sealed ? <span className="di-eyebrow-rule" aria-hidden /> : null}
    </div>
  );
}
