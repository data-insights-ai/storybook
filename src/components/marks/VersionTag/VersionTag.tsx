import type { ReactNode } from "react";
import { Tag } from "../Tag";

/**
 * A version, a build or a short hash.
 *
 * @deprecated Removed in 0.12: use `Tag mono`.
 */
export function VersionTag({ children }: { children: ReactNode }) {
  return <Tag mono>{children}</Tag>;
}
