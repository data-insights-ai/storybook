import type { ReactNode } from "react";
import { Button } from "../Button";

/**
 * An icon-only control that carries a count, such as unread notifications
 * in the app bar.
 *
 * @deprecated Removed in 0.12: use `<Button variant="ghost" iconOnly
 * aria-label="Notifications" badge={count} badgeLabel="3 unread">`. The
 * count now follows the icon instead of covering it.
 */
export function CountButton({
  label,
  count,
  countLabel,
  expanded,
  controls,
  onClick,
  children,
}: {
  /** The accessible name, with the count in words: "Notifications, 3 unread". */
  label: string;
  count: number;
  /** The count as drawn, such as "3" or "99+". */
  countLabel: string;
  /** Set when the button opens a panel: whether it is open. */
  expanded?: boolean;
  /** The id of the panel it opens. */
  controls?: string;
  onClick: () => void;
  /** One lucide icon. */
  children: ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      iconOnly
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controls}
      badge={count > 0 ? countLabel : undefined}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
