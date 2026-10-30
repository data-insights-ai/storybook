import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import "./SealValue.css";

export type SealState = "sealed" | "inferred" | "absent";

/**
 * Sealed, inferred, absent. A filled gold dot means the value was
 * recorded and can be verified. A hollow gold ring means a model
 * inferred it and nothing has vouched for it yet. No mark at all is
 * also a statement, so it gets a shape of its own rather than nothing.
 *
 * The mark never carries the meaning alone: pair it with `SealValue`,
 * or name the state in the text beside it.
 *
 * The mark draws in `--di-mark`: neutral ink in an operational view, so
 * the one gold object stays alone, and the seal's gold inside a brand
 * moment (`data-brand` on a sign-in, onboarding, licence or certificate
 * surface). The shape carries the state either way.
 */
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
