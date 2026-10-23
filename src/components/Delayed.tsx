import type { ReactNode } from "react";
import { cx } from "../cx";
import { useDelayed } from "./useDelayed";
import "./Delayed.css";

/**
 * Holds a waiting indicator back for the first moments of a wait. A load
 * that finishes inside `delay` shows nothing at all, so a fast answer does
 * not flash a skeleton.
 *
 * The children are laid out from the first frame and only hidden, so the
 * space they take is already reserved when they appear: nothing shifts.
 */
export function Delayed({
  delay = 150,
  children,
  className,
}: {
  /** Milliseconds before the children appear. */
  delay?: number;
  children: ReactNode;
  className?: string;
}) {
  const shown = useDelayed(delay);
  return (
    <div className={cx("di-delayed", className)} data-shown={shown}>
      {children}
    </div>
  );
}
