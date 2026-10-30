import type { CSSProperties } from "react";
import { cx } from "../../../internal/cx";
import { surfaceClass } from "../../../internal/surface";
import { LoadingTable } from "./LoadingTable";
import "./LoadingPage.css";

/** A page in the shape it will have: the header, then a register, a record's facts, or a form. */
export function LoadingPage({
  shape,
  rows,
  heading,
  index,
}: {
  shape: "list" | "detail" | "form";
  rows: number;
  heading: boolean;
  index: boolean;
}) {
  return (
    <div className="di-loading-page" aria-hidden>
      {heading ? (
        <div className="di-loading-page-head">
          <Bar className="is-title" />
          <Bar className="is-lede" step={1} />
        </div>
      ) : null}
      {shape === "list" ? (
        <>
          <div className="di-loading-page-toolbar">
            <span className="di-loading-control is-search" />
            <span className="di-loading-control is-button" />
          </div>
          <LoadingTable rows={rows} index={index} />
        </>
      ) : null}
      {shape === "detail" ? <Detail /> : null}
      {shape === "form" ? <Form /> : null}
    </div>
  );
}

function Bar({ className, width, step = 0 }: { className?: string; width?: number | string; step?: number }) {
  return (
    <span className={cx("di-loading-bar", className)} style={{ width, "--di-skeleton-row": step } as CSSProperties} />
  );
}

const factWidths = [168, 112, 220, 136, 184];

function Detail() {
  return (
    <>
      <div className={cx(surfaceClass(), "di-loading-page-panel")}>
        <Bar className="is-heading" />
        <div className="di-loading-page-facts">
          {factWidths.map((width, i) => (
            <div className="di-loading-page-fact" key={i}>
              <Bar className="is-label" step={i + 1} />
              <Bar width={width} step={i + 1} />
            </div>
          ))}
        </div>
      </div>
      <div className={cx(surfaceClass(), "di-loading-page-panel")}>
        <Bar className="is-heading" step={2} />
        <Bar width="92%" step={3} />
        <Bar width="78%" step={4} />
        <Bar width="54%" step={5} />
      </div>
    </>
  );
}

function Form() {
  return (
    <div className={cx(surfaceClass(), "di-loading-page-panel")}>
      {[0, 1, 2, 3].map((i) => (
        <div className="di-loading-page-fact" key={i}>
          <Bar className="is-label" step={i + 1} />
          <span className="di-loading-control" />
        </div>
      ))}
      <div className="di-loading-page-actions">
        <span className="di-loading-control is-button" />
      </div>
    </div>
  );
}
