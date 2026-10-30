import type { ReactNode } from "react";
import { Badge } from "../Badge";

/**
 * A version, a build or a short hash. Mono, quiet, no dot: it names a
 * thing rather than reporting a state. Drawn on `Badge`, the one pill.
 */
export function VersionTag({ children }: { children: ReactNode }) {
  return (
    <Badge tone="quiet" track="record">
      {children}
    </Badge>
  );
}
