import type { ReactNode } from "react";
import "./VersionTag.css";

/**
 * A version, a build or a short hash. Mono, quiet, no dot: it names a
 * thing rather than reporting a state.
 */
export function VersionTag({ children }: { children: ReactNode }) {
  return <span className="di-version-tag">{children}</span>;
}
