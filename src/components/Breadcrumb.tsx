import { cx } from "../cx";
import "./Breadcrumb.css";

/**
 * Where am I. Mono, lowercase, and it truncates with one ellipsis
 * segment rather than naming every ancestor.
 */
export function Breadcrumb({
  label,
  items,
  className,
}: {
  label: string;
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav aria-label={label} className={cx("di-breadcrumb", className)}>
      <ol className="di-breadcrumb-list">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="di-breadcrumb-item">
              {i > 0 ? <span className="di-breadcrumb-sep" aria-hidden>/</span> : null}
              {last ? (
                <span className="di-breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <a className="di-breadcrumb-link" href={item.href}>
                  {item.label}
                </a>
              ) : (
                <span className="di-breadcrumb-link">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
