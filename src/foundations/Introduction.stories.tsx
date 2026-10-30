import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { CodeBlock, Fact, FactList, Panel } from "../index";
import { Doc, DocSection, Rules } from "./guide/Doc";

const install = `import "@data-insights-ai/ui/styles.css";
import { Button, Panel, ThemeProvider, DensityProvider } from "@data-insights-ai/ui";`;

function IntroductionPage() {
  return (
    <Doc
      title="datAInsights UI"
      lede="The component library of the datAInsights products, and the place a designer reviews it. Everything a product can use is what the package root exports. The screens under Patterns are examples assembled from those components, not screens that ship."
    >
      <Panel title="How to read it" heading={2}>
        <FactList layout="columns">
          <Fact label="Foundations">
            Colour, type, scale and density, the rules of the Register, voice, page patterns.
          </Fact>
          <Fact label="Components">One group per job: Actions, Forms, Records, Feedback and the rest.</Fact>
          <Fact label="Patterns">Whole screens on the product shell. Copy from them.</Fact>
          <Fact label="Before handing back">pnpm check: format, lint, types, story tests, build.</Fact>
        </FactList>
      </Panel>

      <DocSection
        title="The API rule"
        lede="Only text is a prop. Anything that can hold a component is a slot: a named sub-component written as a child, such as PanelMeta or NoticeAction."
      >
        <Rules>
          <li>A variant is one union prop, never a family of booleans. tone means status and nothing else.</li>
          <li>Every visible string is a prop, in English; a product passes its own language in.</li>
          <li>
            Buttons, fields and tables stay native elements. Where a control needs more, the headless library is Base
            UI.
          </li>
          <li>Density and theme come from the root (DensityProvider, ThemeProvider), never from a prop.</li>
        </Rules>
        <CodeBlock label="Using the package">{install}</CodeBlock>
      </DocSection>

      <DocSection
        title="What keeps it consistent"
        lede="Three token layers: primitives have no job, semantic roles say what a thing is for and carry the dark theme, component slots let one control change without the others."
      >
        <Rules>
          <li>pnpm lint:tokens fails on a raw length, a hex in a component, or a component naming a primitive.</li>
          <li>
            The story tests run every story in light and dark, at desk and phone width, in comfortable and compact: axe,
            text contrast where it is painted, surfaces, edge clearance, underlines and one outline per object.
          </li>
          <li>Status is a word plus a mark, never colour alone. Visible text meets WCAG AA.</li>
        </Rules>
      </DocSection>

      <DocSection title="Sample content">
        <Rules>
          <li>
            Everything in these stories is invented. Sample people use <code>@data-insights.ai</code> addresses.
          </li>
          <li>The repository is public: nothing here names a real person, a customer or an unreleased project.</li>
        </Rules>
      </DocSection>
    </Doc>
  );
}

const meta = {
  title: "Introduction",
  tags: ["layer:foundation"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

/** The code samples wrap inside their frame on a phone; none runs past it. */
export const Introduction: StoryObj = {
  render: () => <IntroductionPage />,
  play: async ({ canvasElement }) => {
    for (const code of canvasElement.querySelectorAll<HTMLElement>(".di-codeblock-scroll")) {
      await expect(code.scrollWidth).toBeLessThanOrEqual(code.clientWidth + 1);
    }
  },
};
