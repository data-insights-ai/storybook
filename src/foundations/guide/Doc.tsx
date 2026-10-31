import type { ComponentProps, ReactNode } from "react";
import { Grid, Page, PageHeader, PageHeaderTitle, Panel, PanelNote, PanelStatus, StatusPill } from "../../index";
import "./Doc.css";

/*
 * A Foundations page shows; the written rules live in AGENTS.md and
 * .design-sync/conventions.md. A page is a heading, at most one line under
 * it, then sections of panels. No text stands on the canvas by itself.
 */
export function Doc({ title, lede, children }: { title: string; lede?: string; children: ReactNode }) {
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

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="di-doc-section">
      <PageHeader level={2}>
        <PageHeaderTitle>{title}</PageHeaderTitle>
      </PageHeader>
      {children}
    </section>
  );
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

type PanelLook = Pick<ComponentProps<typeof Panel>, "emphasis" | "tone">;

/** The same thing built right and built wrong, side by side; the caption says what went wrong. */
export function Pair({
  title,
  caption,
  good,
  bad,
  goodPanel,
  badPanel,
}: {
  title: string;
  caption: string;
  good: ReactNode;
  bad: ReactNode;
  goodPanel?: PanelLook;
  badPanel?: PanelLook;
}) {
  return (
    <Section title={title}>
      <Grid min="320px" gap={16}>
        <Panel title="Do" {...goodPanel}>
          <PanelStatus>
            <StatusPill tone="ok">right</StatusPill>
          </PanelStatus>
          {good}
        </Panel>
        <Panel title="Don't" {...badPanel}>
          <PanelStatus>
            <StatusPill tone="danger">wrong</StatusPill>
          </PanelStatus>
          {bad}
          <PanelNote>{caption}</PanelNote>
        </Panel>
      </Grid>
    </Section>
  );
}
