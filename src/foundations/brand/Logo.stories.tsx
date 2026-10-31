import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import logo from "../../assets/logo.svg";
import logoInverse from "../../assets/logo-inverse.svg";
import logoMono from "../../assets/logo-mono.svg";
import mark from "../../assets/mark.svg";
import markInverse from "../../assets/mark-inverse.svg";
import markMono from "../../assets/mark-mono.svg";
import { CodeBlock, Fact, FactList, Grid, Panel, PanelNote, Stack } from "../../index";
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

const signature = `Nora Feld
Operator · datAInsights
datAInsights GmbH
data-insights.ai`;

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
        <CodeBlock label="Signature template">{signature}</CodeBlock>
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
