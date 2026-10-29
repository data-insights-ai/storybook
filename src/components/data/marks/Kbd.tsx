import type { ReactNode } from "react";
import "./Kbd.css";

/** A keyboard shortcut, set in the mono track. */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return <kbd className={className ? `di-kbd ${className}` : "di-kbd"}>{children}</kbd>;
}
