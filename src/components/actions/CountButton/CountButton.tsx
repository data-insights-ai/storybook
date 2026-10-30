import type { ReactNode } from "react";
import { Badge } from "../../marks/Badge";
import { Button } from "../Button";
import "./CountButton.css";

/**
 * An icon-only control that carries a count, such as unread notifications
 * in the topbar. The count is drawn on the icon and also part of `label`,
 * so a screen reader hears it once, in words.
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
      className="di-count-btn"
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onClick}
    >
      {children}
      {count > 0 ? (
        <span className="di-count-btn-count" aria-hidden>
          <Badge tone="neutral">{countLabel}</Badge>
        </span>
      ) : null}
    </Button>
  );
}
