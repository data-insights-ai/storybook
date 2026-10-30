import logo from "../../../assets/logo.svg";
import logoInverse from "../../../assets/logo-inverse.svg";
import mark from "../../../assets/mark.svg";
import markInverse from "../../../assets/mark-inverse.svg";
import { useSidebarRail } from "./SidebarContext";
import "./SidebarBrand.css";

/**
 * The lockup at the sidebar's foot: the logo while the sidebar is open,
 * the mark alone once it collapses to icons. In daylight the sidebar is
 * paper and takes the daylight files; after dark it is navy and takes the
 * inverse ones. All four are the fixed brand files, never rebuilt from the
 * mark and a typeface.
 */
export function SidebarBrand({ label = "datAInsights" }: { label?: string }) {
  const rail = useSidebarRail();
  const shape = rail ? "di-sb-brand-mark" : "di-sb-brand-logo";
  return (
    <div className="di-sb-brand">
      <img className={`${shape} di-sb-brand-day`} src={rail ? mark : logo} alt={label} />
      <img className={`${shape} di-sb-brand-night`} src={rail ? markInverse : logoInverse} alt={label} />
    </div>
  );
}
