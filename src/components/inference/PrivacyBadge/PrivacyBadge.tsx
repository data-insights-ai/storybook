import { Children, isValidElement, type ReactNode } from "react";
import { StatusPill } from "../../marks/status/StatusPill";

const tones = { local: "ok", external: "warn", retention: "neutral" } as const;

/**
 * Where a query goes and how long it is kept.
 *
 * @deprecated Removed in 0.12: use `StatusPill track="record" icon={…}` with
 * `tone="ok"` (local), `"warn"` (external) or `"neutral"` (retention).
 */
export function PrivacyBadge({ scope, children }: { scope: "local" | "external" | "retention"; children: ReactNode }) {
  const parts = Children.toArray(children);
  const icon = parts.find((part) => isValidElement(part));
  const words = parts.filter((part) => part !== icon);
  return (
    <StatusPill tone={tones[scope]} track="record" icon={icon}>
      {words}
    </StatusPill>
  );
}
