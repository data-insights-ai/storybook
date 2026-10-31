import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import type { CSSProperties } from "react";
import {
  Fact,
  FactList,
  Figure,
  FigureRow,
  Grid,
  Kbd,
  MetaLine,
  Panel,
  PanelNote,
  Stack,
  PanelStatus,
  StatusPill,
} from "../../index";
import { Doc, Section } from "../guide/Doc";
import { brokenTokenNames, TokenName, useResolved } from "../guide/Tokens";
import "./Type.css";

const display: CSSProperties = {
  fontFamily: "var(--di-font-display)",
  fontWeight: 700,
  letterSpacing: "var(--di-tracking-tight)",
};
const sans: CSSProperties = { fontFamily: "var(--di-font-ui)" };
const mono: CSSProperties = { fontFamily: "var(--di-font-code)", fontVariantNumeric: "tabular-nums" };
const label: CSSProperties = {
  ...mono,
  fontWeight: 500,
  letterSpacing: "var(--di-tracking-label)",
  textTransform: "uppercase",
  color: "var(--di-text-muted)",
};

const faces = [
  { name: "Space Grotesk", job: "Names a page, a block, a figure", style: display },
  { name: "IBM Plex Sans", job: "What a person reads", style: sans },
  { name: "IBM Plex Mono", job: "What a machine recorded", style: mono },
];

const ramp = [
  { token: "--di-font-size-700", face: "Grotesk 700", text: "Sources", style: display },
  { token: "--di-font-size-600", face: "Grotesk 700", text: "Delivery today", style: display },
  { token: "--di-font-size-500", face: "Grotesk 700", text: "Collector certificate", style: display },
  { token: "--di-font-size-400", face: "Plex Sans 400", text: "Paused after four rate limits.", style: sans },
  { token: "--di-font-size-300", face: "Plex Sans 400", text: "Sealed entries stay on record.", style: sans },
  { token: "--di-font-size-200", face: "Plex Mono 500", text: "Received", style: label },
  { token: "--di-font-size-100", face: "Plex Mono 500", text: "⌘K", style: { ...mono, fontWeight: 500 } },
];

function Ramp() {
  const { ref, values } = useResolved(ramp.map((step) => step.token));
  const px = (token: string) => (values[token] ? `${parseFloat(values[token]) * 16}px` : "");
  return (
    <div ref={ref} className="di-type-ramp">
      {ramp.map((step) => (
        <div key={step.token} className="di-doc-row">
          <span className="di-type-specimen" style={{ ...step.style, fontSize: `var(${step.token})` }}>
            {step.text}
          </span>
          <span className="di-type-spec">
            <TokenName token={step.token} />
            <span className="di-type-size">
              {px(step.token)} · {step.face}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

function TypePage() {
  return (
    <Doc title="Type" lede="Three faces, three jobs. The body is 14px in both densities.">
      <Grid min="220px" gap={16}>
        {faces.map((face) => (
          <Panel key={face.name} title={face.name} heading={2}>
            <span className="di-type-face" style={face.style} aria-hidden>
              Aa 09:12
            </span>
            <PanelNote>{face.job}</PanelNote>
          </Panel>
        ))}
      </Grid>
      <Panel title="The ramp" heading={2}>
        <Ramp />
      </Panel>
      <Section title="In use">
        <Grid min="320px" gap={16}>
          <Panel title="Collector certificate" heading={3}>
            <PanelStatus>
              <StatusPill tone="warn">expiring</StatusPill>
            </PanelStatus>
            <FactList layout="columns">
              <Fact label="Received" mono>
                2026-10-30T09:12Z
              </Fact>
              <Fact label="Key" mono>
                a4f9c21e
              </Fact>
            </FactList>
            <PanelNote>The certificate expires in 6 days. Rotate it before the next upload.</PanelNote>
          </Panel>
          <Panel title="Delivery today" heading={3}>
            <Stack gap={12}>
              <FigureRow label="Delivery today">
                <Figure label="Events" value="1,842" />
                <Figure label="Sources" value="14" />
                <Figure label="Late" value="2" tone="warn" />
              </FigureRow>
              <MetaLine items={["As of 09:12", "updates live"]} />
              <p className="di-type-keys">
                Press <Kbd>/</Kbd> to search, <Kbd>⌘K</Kbd> for commands.
              </p>
            </Stack>
          </Panel>
        </Grid>
      </Section>
    </Doc>
  );
}

const meta = {
  title: "Foundations/Type",
  tags: ["layer:foundation"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

/** Every step of the ramp names its token on one line, and no specimen runs out of its panel. */
export const Type: StoryObj = {
  render: () => <TypePage />,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll(".di-type-ramp .di-doc-row")).toHaveLength(ramp.length);
    await expect(brokenTokenNames(canvasElement)).toEqual([]);
    for (const specimen of canvasElement.querySelectorAll<HTMLElement>(".di-type-specimen")) {
      const row = specimen.closest<HTMLElement>(".di-doc-row")!;
      await expect(specimen.getBoundingClientRect().right).toBeLessThanOrEqual(row.getBoundingClientRect().right + 1);
    }
  },
};
