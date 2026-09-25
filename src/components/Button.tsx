import type { ButtonHTMLAttributes } from "react";
import { cx } from "../cx";
import "./Button.css";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "seal" | "inferred";
type Size = "dense" | "md" | "comfort";

/**
 * Navy acts, paper waits. Solid navy is the only filled control on the
 * sheet, so there is never a question which button commits. After dark
 * the fill turns gold, because navy cannot act against a navy ground.
 *
 * The icon is the first child. An icon-only button needs `aria-label`.
 */
export function Button({
  variant = "primary",
  size = "md",
  iconOnly = false,
  loading = false,
  className,
  type = "button",
  disabled = false,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  /** A square control: a filter, a pagination arrow, a kebab. */
  iconOnly?: boolean;
  /** Swaps the icon for a spinner and blocks the press. */
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        "di-btn",
        `di-btn-${variant}`,
        `di-btn-${size}`,
        iconOnly && "di-btn-icon",
        loading && "di-btn-loading",
        className,
      )}
      {...props}
    >
      {loading ? <span className="di-btn-spinner" aria-hidden /> : null}
      {children}
    </button>
  );
}
