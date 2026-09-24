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
 * A section mark in the mono track, a seal dot, and a rule that runs to
 * the edge. The § numbering is how a screen says where it sits in the
 * record.
 */
export function Eyebrow({
  children,
  dot = true,
  className,
}: {
  children: ReactNode;
  /** The gold dot. One per view. */
  dot?: boolean;
  className?: string;
}) {
  return (
    <div className={cx("di-mark", className)}>
      {dot ? <SealMark state="sealed" /> : null}
      <span className="di-mark-label">{children}</span>
      <span className="di-mark-rule" aria-hidden />
    </div>
  );
}

/** A keyboard shortcut, set in the mono track. */
export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="di-kbd">{children}</kbd>;
}
