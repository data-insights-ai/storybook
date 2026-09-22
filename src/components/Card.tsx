import type { HTMLAttributes } from "react";
import { cx } from "../cx";
import "./Card.css";

export function Card({
  className,
  padded = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & { padded?: boolean }) {
  return <div className={cx("di-card", padded && "di-card-pad", className)} {...props} />;
}
