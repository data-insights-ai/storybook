import type { HTMLAttributes } from "react";
import { cx } from "../../../../internal/cx";
import "./Card.css";

/**
 * A plain surface with a border, for content that stands on its own beside
 * other cards. `padded` gives it the card's inner spacing; turn it off when
 * what it holds brings its own. A titled, indexed block of a record is a
 * `Panel`.
 */
export function Card({
  className,
  padded = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & { padded?: boolean }) {
  return <div className={cx("di-card", padded && "di-card-pad", className)} {...props} />;
}
