import type { Meta, StoryObj } from "@storybook/react-vite";
import logo from "../../assets/logo.svg";
import logoInverse from "../../assets/logo-inverse.svg";
import logoMono from "../../assets/logo-mono.svg";
import mark from "../../assets/mark.svg";
import markInverse from "../../assets/mark-inverse.svg";
import markMono from "../../assets/mark-mono.svg";
import { CodeBlock, Fact, FactList, Grid, Panel, PanelNote } from "../../index";
import { Doc, DocSection, Rules } from "../guide/Doc";

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
    <Doc
      title="Logo"
      lede="The mark, then the name. Six fixed files, and nothing else: a lockup is never rebuilt from the mark and a typeface, recoloured, stretched, rotated, shadowed, or set on gold or a photograph."
    >
      <DocSection
        title="What the mark means"
        lede="Every part carries a meaning, so the mark is never cropped or used as a frame."
      >
        <Panel title="Parts" heading={3}>
          <FactList layout="columns">
            <Fact label="Brackets">A time interval: the window in which a claim holds.</Fact>
            <Fact label="Peak">Two edges meeting: the A, and the simplest graph.</Fact>
            <Fact label="Stem">The I. Upright, unornamented.</Fact>
            <Fact label="Gold node">The one verified fact. A view gets only one.</Fact>
          </FactList>
        </Panel>
      </DocSection>

      <DocSection title="Lockups" lede="Each shown on the ground it is made for, whatever the page's theme.">
        <Grid min="300px" gap={16}>
          {lockups.map((item) => (
            <div key={item.title} data-theme={item.theme}>
              <Panel title={item.title} heading={3}>
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
      </DocSection>

      <DocSection title="Space and size">
        <Rules>
          <li>Clear space: at least the height of the mark's cap (1X) on all four sides.</li>
          <li>Smallest lockup: 20px high on screen, 10mm in print. Smallest mark: 16px or 6mm.</li>
        </Rules>
      </DocSection>

      <DocSection title="Beside another mark">
        <Rules>
          <li>Match the optical height, not the bounding box.</li>
          <li>Separate with a vertical rule. Not an ampersand, a slash, a plus or a ×.</li>
          <li>In a strip of three or more, use the monochrome logo; the other brands keep their colours.</li>
          <li>Order alphabetically or by the date of the announcement.</li>
        </Rules>
      </DocSection>

      <DocSection
        title="Email signature"
        lede="The name in Space Grotesk; role and company in IBM Plex Sans; the address, which a machine resolves, in IBM Plex Mono and underlined as a link. No second colour, no slogan, no photograph."
      >
        <CodeBlock label="Signature template">{signature}</CodeBlock>
      </DocSection>
    </Doc>
  );
}

const meta = {
  title: "Foundations/Logo",
  tags: ["layer:foundation"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

export const Logo: StoryObj = { render: () => <LogoPage /> };
