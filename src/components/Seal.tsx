import type { ReactNode } from "react";
import { cx } from "../cx";
import "./Seal.css";

/**
 * Sealed, inferred, absent. A filled gold dot means the value was
 * recorded and can be verified. A hollow gold ring means a model
 * inferred it and nothing has vouched for it yet. No mark at all is
 * also a statement, so it gets a shape of its own rather than nothing.
 *
 * The mark never carries the meaning alone: pair it with `SealValue`,
 * or name the state in the text beside it.
 */
export type SealState = "sealed" | "inferred" | "absent";

export function SealMark({
  state = "sealed",
  size = 6,
  className,
}: {
  state?: SealState;
  /** 6 in a line of text, 20 in a legend. */
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cx("di-seal-mark", `di-seal-mark-${state}`, className)}
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}

/**
 * A seal mark and the value it vouches for. `stateLabel` is the word a
 * screen reader hears, because a dot and a ring look different but
 * announce the same without it.
 */
export function SealValue({
  state = "sealed",
  stateLabel,
  children,
}: {
  state?: SealState;
  stateLabel: string;
  children: ReactNode;
}) {
  return (
    <span className="di-seal">
      <SealMark state={state} />
      <span className="di-sr">{stateLabel}</span>
      <span className="di-seal-text">{children}</span>
    </span>
  );
}

/**
 * The hollow ring on its own, for a control or a row that a model
 * proposed. No gradient, no glow, no sparkle: the least certain output
 * in the system is never the most decorated one.
 */

/**
 * The one ornament: an 8px tick scale. It closes a header, or any block
 * that reports a measured value.
 */
export function TickRule({ thin = false, className }: { thin?: boolean; className?: string }) {
  return <div className={cx("di-tick-rule", thin && "di-tick-rule-thin", className)} aria-hidden />;
}

/**
 * The line above a title, in the mono track. One union prop, because the
 * gold dot is a claim and the rule is what carries it — `dot` as a
 * boolean left the rule drawn with nothing to anchor it.
 *
 * `sealed` is the § mark beside the seal, with a rule to the edge: this
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
    <div className={cx("di-mark", `di-mark-${variant}`, className)}>
      {sealed ? <SealMark state="sealed" /> : null}
      <span className="di-mark-label">{children}</span>
      {sealed ? <span className="di-mark-rule" aria-hidden /> : null}
    </div>
  );
}

/** A keyboard shortcut, set in the mono track. */
export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="di-kbd">{children}</kbd>;
}
