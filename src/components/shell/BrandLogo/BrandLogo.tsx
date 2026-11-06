import logo from "../../../assets/logo.svg";
import logoInverse from "../../../assets/logo-inverse.svg";
import mark from "../../../assets/mark.svg";
import markInverse from "../../../assets/mark-inverse.svg";
import "./BrandLogo.css";

export type BrandLogoShape = "logo" | "mark";
export type BrandLogoSize = "md" | "hero";

/**
 * The brand's fixed files outside the sidebar: the lockup (`logo`) at the
 * head of a public page, or the mark alone, as large as a hero column
 * allows (`size="hero"`). Daylight takes the daylight file, after dark the
 * inverse one; never rebuilt from the mark and a typeface.
 */
export function BrandLogo({
  shape = "logo",
  size = "md",
  label = "datAInsights",
  className,
}: {
  shape?: BrandLogoShape;
  size?: BrandLogoSize;
  label?: string;
  className?: string;
}) {
  const classes = ["di-brand-logo", `di-brand-logo-${shape}`, `di-brand-logo-${size}`, className]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={classes}>
      <img className="di-brand-logo-day" src={shape === "mark" ? mark : logo} alt={label} />
      <img className="di-brand-logo-night" src={shape === "mark" ? markInverse : logoInverse} alt={label} />
    </span>
  );
}
