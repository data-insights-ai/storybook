import type { ButtonHTMLAttributes } from "react";
import { cx } from "../cx";
import "./TextLink.css";

export function TextLink({
  quiet = false,
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { quiet?: boolean }) {
  return <button type={type} className={cx("di-textlink", quiet && "is-quiet", className)} {...props} />;
}
