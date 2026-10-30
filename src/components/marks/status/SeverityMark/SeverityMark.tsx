import { cx } from "../../../../internal/cx";
import "./SeverityMark.css";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

const filledSteps: Record<Severity, number> = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };

/**
 * One severity on the one shared scale: critical, high, medium, low, info.
 * Every product and every chart draws severity with these five colours
 * (`--di-severity-*`), so "high" is the same red-orange in a case list, a
 * vulnerability record and a chart legend.
 *
 * The mark is never the only channel: four steps fill as the level rises,
 * and the word beside it, in text colour, carries the meaning. The colour
 * is never the text's own, so the word clears AA on any surface. `chip`
 * lays a tint under a critical item that has to stop the eye; `bare` keeps
 * the word for assistive technology only, for a dense column whose header
 * already says "Severity".
 */
export function SeverityMark({
  level,
  label,
  variant = "mark",
}: {
  level: Severity;
  /** The level as a word, in the reader's language. */
  label: string;
  variant?: "mark" | "chip" | "bare";
}) {
  const filled = filledSteps[level];
  return (
    <span className={cx("di-sev", `di-sev-${variant}`)} data-level={level}>
      <span className="di-sev-steps" aria-hidden>
        {[1, 2, 3, 4].map((step) => (
          <span key={step} className={cx("di-sev-step", step <= filled && "is-on")} />
        ))}
      </span>
      <span className={variant === "bare" ? "di-sr" : "di-sev-label"}>{label}</span>
    </span>
  );
}
