import { cx } from "../../../../internal/cx";

/**
 * The one ornament: an 8px tick scale under a measured value.
 *
 * **When to use:** to close a block that reports a measurement, such as a
 * `Figure` on a brand page or a report cover. **When not to:** a divider
 * between sections (space or a step in tone); under a heading or text.
 *
 * **Variants:** `thin` is a shorter tick, for a compact figure.
 *
 * **Accessibility:** decoration, hidden from screen readers.
 */
export function TickRule({ thin = false, className }: { thin?: boolean; className?: string }) {
  return <div className={cx("di-tick-rule", thin && "di-tick-rule-thin", className)} aria-hidden />;
}
