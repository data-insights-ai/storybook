import type { ReactNode } from "react";
import { Page, PageHeader, PageHeaderTitle, Panel, PanelNote } from "../../index";
import "./Doc.css";

/*
 * A Foundations page is built like a product page: one PageHeader, sections
 * headed by PageHeader level 2, examples on the Panel they are used on. What
 * is private here is only the prose measure and the inline code.
 */
export function Doc({ title, lede, children }: { title: string; lede: string; children: ReactNode }) {
  return (
    <main className="di-doc">
      <Page width="full">
        <PageHeader lede={lede}>
          <PageHeaderTitle>{title}</PageHeaderTitle>
        </PageHeader>
        {children}
      </Page>
    </main>
  );
}

export function DocSection({ title, lede, children }: { title: string; lede?: string; children?: ReactNode }) {
  return (
    <section className="di-doc-section">
      <PageHeader level={2} lede={lede}>
        <PageHeaderTitle>{title}</PageHeaderTitle>
      </PageHeader>
      {children}
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="di-doc-prose">{children}</div>;
}

export function Rules({ children }: { children: ReactNode }) {
  return <ul className="di-doc-rules">{children}</ul>;
}

/** A live example on the surface it is used on, with one line saying what to look at. */
export function Example({
  title,
  note,
  padded = true,
  children,
}: {
  title: string;
  note?: string;
  padded?: boolean;
  children: ReactNode;
}) {
  return (
    <Panel title={title} heading={3} padded={padded}>
      {children}
      {note ? <PanelNote>{note}</PanelNote> : null}
    </Panel>
  );
}
