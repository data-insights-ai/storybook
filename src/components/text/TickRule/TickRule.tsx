import { cx } from "../../../internal/cx";

/**
 * The one ornament: an 8px tick scale. It closes a header, or any block
 * that reports a measured value.
 */
export function TickRule({ thin = false, className }: { thin?: boolean; className?: string }) {
  return <div className={cx("di-tick-rule", thin && "di-tick-rule-thin", className)} aria-hidden />;
}
