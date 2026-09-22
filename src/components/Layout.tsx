import type { CSSProperties, ReactNode } from "react";
import "./Layout.css";

export function Stack({ children }: { children: ReactNode }) {
  return <div className="di-stack">{children}</div>;
}

/** Wraps. A column never forces the story canvas wider than the preview. */
export function Grid({ min = "200px", children }: { min?: string; children: ReactNode }) {
  return (
    <div className="di-grid" style={{ "--di-grid-min": min } as CSSProperties}>
      {children}
    </div>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="di-toolbar">{children}</div>;
}

export function ToolbarEnd({ children }: { children: ReactNode }) {
  return <div className="di-toolbar-end">{children}</div>;
}

export function Numbered({ index, children }: { index: string; children: ReactNode }) {
  return (
    <section className="di-numbered">
      <span className="di-numbered-index">{index}</span>
      <div className="di-numbered-body">{children}</div>
    </section>
  );
}

export function Actions({ children }: { children: ReactNode }) {
  return <div className="di-inline-actions">{children}</div>;
}
