import logoInverse from "../../../assets/logo-inverse.svg";
import markInverse from "../../../assets/mark-inverse.svg";
import { useSidebarRail } from "./SidebarContext";
import "./SidebarBrand.css";

/**
 * The lockup on the navy rail: the inverse logo while the sidebar is
 * open, the inverse mark alone once it collapses to icons. Both are the
 * fixed brand files, never rebuilt from the mark and a typeface.
 */
export function SidebarBrand({ label = "datAInsights" }: { label?: string }) {
  const rail = useSidebarRail();
  return (
    <div className="di-sb-brand">
      <img className={rail ? "di-sb-brand-mark" : "di-sb-brand-logo"} src={rail ? markInverse : logoInverse} alt={label} />
    </div>
  );
}
