import { cx } from "../../../internal/cx";
import "./SeverityMark.css";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

const STEPS: Record<Severity, number> = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };

/**
 * One severity on the one shared scale: critical, high, medium, low, info.
 * Every product and every chart draws severity with these five colours
 * (`--di-severity-*`), so "high" is the same red-orange in a case list, a
 * CVE record and a chart legend.
 *
 * The mark is never the only channel: four steps fill as the level rises,
 * and the word beside it, in text colour, carries the meaning. The colour
 * is never used for the text itself, so the word clears AA on any surface.
 * `chip` lays a tint under a critical item that has to stop the eye.
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
  const filled = STEPS[level];
  return (
    <span className={cx("di-sev", `di-sev-${variant}`)} data-level={level}>
      <span className="di-sev-steps" aria-hidden>
        {[1, 2, 3, 4].map((step) => (
          <span key={step} className={cx("di-sev-step", step <= filled && "is-on")} />
        ))}
      </span>
      {variant === "bare" ? <span className="di-sr">{label}</span> : <span className="di-sev-label">{label}</span>}
    </span>
  );
}
