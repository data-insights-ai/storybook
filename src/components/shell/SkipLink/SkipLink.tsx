import type { MouseEvent } from "react";
import "./SkipLink.css";

/**
 * The first stop for the keyboard: it jumps past the navigation to the page,
 * `AppShellContent`. Hidden until it has focus.
 *
 * It moves focus itself instead of following the fragment, so a client-side
 * router does not see a navigation.
 */
export function SkipLink({ label, target = "di-content" }: { label: string; target?: string }) {
  const skip = (event: MouseEvent<HTMLAnchorElement>) => {
    const content = document.getElementById(target);
    if (!content) return;
    event.preventDefault();
    content.focus();
    content.scrollIntoView({ block: "start" });
  };
  return (
    <a className="di-skip" href={`#${target}`} onClick={skip}>
      {label}
    </a>
  );
}
