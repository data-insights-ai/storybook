import { Badge } from "../../status/Badge";
import "./TabStrip.css";

/** The count after a tab's label, in the quiet count badge. */
export function TabCount({ children }: { children: string }) {
  return (
    <span className="di-tab-badge">
      <Badge tone="quiet">{children}</Badge>
    </span>
  );
}
