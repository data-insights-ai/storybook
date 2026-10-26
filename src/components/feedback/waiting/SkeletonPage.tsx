import type { CSSProperties } from "react";
import { cx } from "../../../cx";
import { SkeletonTable } from "./SkeletonTable";
import { useDelayed } from "../useDelayed";
import "../Delayed.css";
import "./SkeletonPage.css";

export type SkeletonPageVariant = "list" | "detail" | "form";

/**
 * A page that is still loading, drawn in the shape it will have: the
 * header, then a register (`list`), the facts of one record (`detail`) or
 * a form's fields and its actions (`form`). It takes the place of the
 * page's content inside the shell, so the rail and the bar never leave.
 *
 * A page inside a layout that already drew the header (a tab of a page)
 * passes `heading={false}` and gets the body alone.
 *
 * Like `SkeletonTable`, only the bars breathe, and nothing appears for the
 * first `delay` ms; the space is reserved from the first frame.
 */
export function SkeletonPage({
  variant,
  label,
  rows = 6,
  heading = true,
  delay = 150,
  className,
}: {
  variant: SkeletonPageVariant;
  /** False when the surrounding layout already shows the page header. */
  heading?: boolean;
  /** What a screen reader hears while the page loads. */
  label: string;
  /** Rows of the register in the `list` variant. */
  rows?: number;
  /** Milliseconds before the skeleton appears; 0 shows it at once. */
  delay?: number;
  className?: string;
}) {
  const shown = useDelayed(delay);
  return (
    <div
      className={cx("di-skp", "di-delayed", className)}
      data-shown={shown}
      data-variant={variant}
      role="status"
      aria-live="polite"
    >
      <span className="di-sr">{label}</span>
      {heading && (
        <div className="di-skp-head" aria-hidden>
          <Bar className="is-title" />
          <Bar className="is-lede" step={1} />
        </div>
      )}
      <div className="di-skp-body" aria-hidden>
        {variant === "list" && <ListBody rows={rows} label={label} />}
        {variant === "detail" && <DetailBody />}
        {variant === "form" && <FormBody />}
      </div>
    </div>
  );
}

function Bar({ className, width, step = 0 }: { className?: string; width?: number | string; step?: number }) {
  return (
    <span
      className={cx("di-skp-bar", className)}
      style={{ width, "--di-skeleton-row": step } as CSSProperties}
    />
  );
}

function ListBody({ rows, label }: { rows: number; label: string }) {
  return (
    <>
      <div className="di-skp-toolbar">
        <span className="di-skp-control is-search" />
        <span className="di-skp-control is-button" />
      </div>
      <SkeletonTable rows={rows} label={label} delay={0} />
    </>
  );
}

const factWidths = [168, 112, 220, 136, 184];

function DetailBody() {
  return (
    <>
      <div className="di-skp-panel">
        <Bar className="is-heading" />
        <div className="di-skp-facts">
          {factWidths.map((width, i) => (
            <div className="di-skp-fact" key={i}>
              <Bar className="is-label" step={i + 1} />
              <Bar width={width} step={i + 1} />
            </div>
          ))}
        </div>
      </div>
      <div className="di-skp-panel">
        <Bar className="is-heading" step={2} />
        <Bar width="92%" step={3} />
        <Bar width="78%" step={4} />
        <Bar width="54%" step={5} />
      </div>
    </>
  );
}

function FormBody() {
  return (
    <div className="di-skp-panel">
      {[0, 1, 2, 3].map((i) => (
        <div className="di-skp-field" key={i}>
          <Bar className="is-label" step={i + 1} />
          <span className="di-skp-control" />
        </div>
      ))}
      <div className="di-skp-actions">
        <span className="di-skp-control is-button" />
      </div>
    </div>
  );
}
