import type { ReactNode } from "react";
import { cx } from "../../../internal/cx";
import "./Kbd.css";

/**
 * A keyboard shortcut, set in the mono track. `onControl` is the key a
 * button carries after its label: it takes the button's own ink instead of
 * a ground of its own.
 */
export function Kbd({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "onControl";
  className?: string;
}) {
  return <kbd className={cx("di-kbd", tone === "onControl" && "di-kbd-on-control", className)}>{children}</kbd>;
}
