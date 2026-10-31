import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import logo from "../../assets/logo.svg";
import logoInverse from "../../assets/logo-inverse.svg";
import logoMono from "../../assets/logo-mono.svg";
import mark from "../../assets/mark.svg";
import markInverse from "../../assets/mark-inverse.svg";
import markMono from "../../assets/mark-mono.svg";
import { Fact, FactList, Grid, Panel, PanelNote, Stack } from "../../index";
import { Doc } from "../guide/Doc";

const lockups = [
  { title: "Primary", src: logo, theme: "light", isMark: false, use: "The default, on paper, ivory or white." },
  {
    title: "Inverse",
    src: logoInverse,
    theme: "dark",
    isMark: false,
    use: "On navy: the sidebar after dark, a slide.",
  },
  {
    title: "Monochrome",
    src: logoMono,
    theme: "light",
    isMark: false,
    use: "Single-ink print. The gold node turns navy.",
  },
  { title: "Mark", src: mark, theme: "light", isMark: true, use: "A favicon, an avatar, an app tile." },
  { title: "Mark, inverse", src: markInverse, theme: "dark", isMark: true, use: "The mark on navy." },
  { title: "Mark, monochrome", src: markMono, theme: "light", isMark: true, use: "A stamp or an emboss." },
] as const;

const rule = (width: string): CSSProperties => ({
  inlineSize: width,
  borderBlockStart: "2px solid var(--di-text)",
  margin: 0,
});
const mono: CSSProperties = { fontFamily: "var(--di-font-code)", margin: 0 };

function Signature() {
  return (
    <div
      data-theme="light"
      data-signature
      style={{
        background: "#fff",
        padding: "var(--di-space-24)",
        display: "grid",
        gap: "var(--di-space-8)",
        color: "var(--di-text)",
      }}
    >
      <hr style={rule("var(--di-space-64)")} />
      <p style={{ margin: 0, fontFamily: "var(--di-font-ui)", fontSize: "var(--di-font-size-600)" }}>
        Firstname Lastname
      </p>
      <p style={{ margin: 0, fontFamily: "var(--di-font-ui)", fontSize: "var(--di-font-size-500)" }}>
        Role · datAInsights
      </p>
      <hr style={rule("var(--di-space-48)")} />
      <p style={{ ...mono, fontSize: "var(--di-font-size-500)" }}>
        firstname.lastname@data-insights.ai · +43 660 000 0000
      </p>
      <div
        style={{
          ...mono,
          display: "grid",
          gap: "var(--di-space-4)",
          fontSize: "var(--di-font-size-400)",
          color: "var(--di-text-subtle)",
        }}
      >
        <p style={mono}>datAInsights GmbH</p>
        <p style={mono}>Prinz-Eugen-Straße 76/12, AT-1040 Wien</p>
        <p style={{ ...mono, fontSize: "var(--di-font-size-300)" }}>FN 606605t | ATU79575247</p>
      </div>
      <p
        style={{
          ...mono,
          fontSize: "var(--di-font-size-400)",
          color: "var(--di-seal-ink)",
          marginBlockStart: "var(--di-space-8)",
        }}
      >
        data-insights.ai
      </p>
    </div>
  );
}

function LogoPage() {
  return (
    <Doc title="Logo" lede="The mark, then the name: six fixed files, never rebuilt or recoloured.">
      <Grid min="300px" gap={16}>
        {lockups.map((item) => (
          <div key={item.title} data-theme={item.theme}>
            <Panel title={item.title} heading={2}>
              <img
                src={item.src}
                alt={`datAInsights ${item.title.toLowerCase()}`}
                style={{ blockSize: item.isMark ? "var(--di-space-48)" : "var(--di-space-32)", inlineSize: "auto" }}
              />
              <PanelNote>{item.use}</PanelNote>
            </Panel>
          </div>
        ))}
      </Grid>
      <Grid min="300px" gap={16}>
        <Panel title="Parts" heading={2}>
          <FactList layout="columns">
            <Fact label="Brackets">The window in which a claim holds.</Fact>
            <Fact label="Peak">Two edges meeting: the A, the simplest graph.</Fact>
            <Fact label="Stem">The I. Upright, unornamented.</Fact>
            <Fact label="Gold node">The one verified fact.</Fact>
          </FactList>
        </Panel>
        <Panel title="Smallest" heading={2}>
          <Stack gap={16}>
            <img
              src={logo}
              alt="datAInsights at its smallest"
              style={{ blockSize: "20px", inlineSize: "auto", alignSelf: "start" }}
            />
            <img
              src={mark}
              alt="The mark at its smallest"
              style={{ blockSize: "16px", inlineSize: "auto", alignSelf: "start" }}
            />
          </Stack>
          <PanelNote>Lockup 20px or 10mm, mark 16px or 6mm. Clear space: one cap height.</PanelNote>
        </Panel>
      </Grid>
      <Panel title="Email signature" heading={2}>
        <Signature />
        <PanelNote>Sample person; the company lines are the real ones. Always on white, as in a mail.</PanelNote>
      </Panel>
    </Doc>
  );
}

const meta = {
  title: "Foundations/Logo",
  tags: ["layer:foundation"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

/** The code samples wrap inside their frame on a phone; none runs past it. */
export const Logo: StoryObj = {
  render: () => <LogoPage />,
  play: async ({ canvasElement }) => {
    for (const code of canvasElement.querySelectorAll<HTMLElement>(".di-codeblock-scroll")) {
      await expect(code.scrollWidth).toBeLessThanOrEqual(code.clientWidth + 1);
    }
  },
};
