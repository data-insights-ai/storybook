import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cx } from "../cx";
import "./Chip.css";

/**
 * A filter, in two states. Unset it offers itself with a leading icon;
 * set it states the value and offers the way back out. `removeLabel`
 * names the filter being dropped, because "Remove" alone tells a screen
 * reader nothing about which one.
 */
export function Chip({
  children,
  active = false,
  onRemove,
  removeLabel,
  onClick,
  className,
}: {
  children: ReactNode;
  /** Set. The chip states a value rather than offering one. */
  active?: boolean;
  onRemove?: () => void;
  removeLabel: string;
  onClick?: () => void;
  className?: string;
}) {
  const body = (
    <>
      {children}
      {active && onRemove ? (
        <button type="button" className="di-chip-remove" aria-label={removeLabel} onClick={onRemove}>
          <X aria-hidden />
        </button>
      ) : null}
    </>
  );

  if (onClick && !active) {
    return (
      <button type="button" className={cx("di-chip", "di-chip-button", className)} onClick={onClick}>
        {body}
      </button>
    );
  }

  return <span className={cx("di-chip", active && "is-active", className)}>{body}</span>;
}
