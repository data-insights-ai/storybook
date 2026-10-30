import type { ReactNode } from "react";
import { Badge } from "../../marks/Badge";
import "./PrivacyBadge.css";

const tones = { local: "ok", external: "warn", retention: "quiet" } as const;

/**
 * Where a query goes and how long it is kept. Both, or neither. Drawn on
 * `Badge`, the one pill: local is the safe tone, external the warning,
 * retention a quiet fact.
 */
export function PrivacyBadge({
  scope,
  children,
}: {
  /** Which privacy fact this states. */
  scope: "local" | "external" | "retention";
  /** The icon first, then the words — the same order `Button` takes. */
  children: ReactNode;
}) {
  return (
    <span className="di-privacy">
      <Badge tone={tones[scope]} track="record">
        {children}
      </Badge>
    </span>
  );
}
