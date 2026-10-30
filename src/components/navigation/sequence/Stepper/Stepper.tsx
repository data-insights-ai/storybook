import { Check } from "lucide-react";
import { cx } from "../../../../internal/cx";
import "./Stepper.css";

/**
 * A bounded process, and only that. A stepper never stands in for the
 * rail or the breadcrumb. `spread` spans the width of what it heads, the
 * steps spread evenly, each a bullet with its name beneath.
 * `inline` sets the steps in one line from the left edge, each name beside
 * its bullet, for a page wide enough that spread steps would drift apart.
 * The state never rests on colour alone: a done step shows a check in place
 * of its number, the current step a filled bullet and a heavier name, an
 * upcoming step an outlined bullet with its number, and each state is a word
 * for a screen reader. With `onStep` a completed step is a button that
 * returns to it.
 */
export function Stepper({
  label,
  steps,
  stateLabels,
  onStep,
  layout = "spread",
  className,
}: {
  label: string;
  steps: { label: string; state: "done" | "current" | "upcoming" }[];
  /** The word each state is announced as. */
  stateLabels: { done: string; current: string; upcoming: string };
  /** Called with a completed step's index when it is pressed. */
  onStep?: (index: number) => void;
  layout?: "spread" | "inline";
  className?: string;
}) {
  return (
    <ol className={cx("di-stepper", className)} data-layout={layout} aria-label={label}>
      {steps.map((step, i) => {
        const inner = (
          <>
            <span className={cx("di-step-bullet", `is-${step.state}`)} aria-hidden>
              {step.state === "done" ? <Check className="di-step-check" /> : i + 1}
            </span>
            <span className={cx("di-step-label", `is-${step.state}`)}>{step.label}</span>
            <span className="di-sr">{stateLabels[step.state]}</span>
          </>
        );
        return (
          <li key={step.label} className="di-step" aria-current={step.state === "current" ? "step" : undefined}>
            {onStep && step.state === "done" ? (
              <button type="button" className="di-step-button" onClick={() => onStep(i)}>
                {inner}
              </button>
            ) : (
              <span className="di-step-button">{inner}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
