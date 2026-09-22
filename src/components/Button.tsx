import type { ButtonHTMLAttributes } from "react";
import { cx } from "../cx";
import "./Button.css";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled = false,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cx("di-btn", `di-btn-${variant}`, `di-btn-${size}`, className)}
      {...props}
    >
      {children}
    </button>
  );
}
