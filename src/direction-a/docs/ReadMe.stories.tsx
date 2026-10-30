import type { Meta, StoryObj } from "@storybook/react-vite";
import { DocPage, DocSection } from "./DocKit";

const meta = {
  title: "Direction A/Read me",
  tags: ["layer:foundation", "!autodocs", "direction:a"],
  parameters: { direction: "a", layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** What this section is, and how to read it. */
export const Proposal: Story = {
  render: () => (
    <DocPage kicker="Direction A ·" title="Briefing" claim="A proposal to react to: every page reads like one slide of a briefing, scaled down for work.">
      <DocSection title="What changes" lede="Nothing here is released. Direction A is switched on per story with data-direction=&quot;a&quot; on the document root; today’s register stays the default, so each screen can be compared.">
        <ol className="doc-a-lede">
          <li>The claim comes first. A page names itself small and says its point large.</li>
          <li>Depth from tone, not from lines. At most two visible container levels.</li>
          <li>Gold means the one thing that matters in a view. Warn is amber, the dark primary button is paper-white, selection and focus are cornflower.</li>
          <li>One severity scale for every product.</li>
          <li>Seven type steps you can see: Sansation for display, IBM Plex for reading, mono capitals for labels.</li>
          <li>Navigation is never heavier than the content, in either theme.</li>
          <li>Cases and assets use a permanent list-and-detail split.</li>
        </ol>
      </DocSection>
      <DocSection title="Where to look">
        <ul className="doc-a-lede">
          <li>Foundations: colour, severity, type, surfaces, space and radius, each with a do and a don’t.</li>
          <li>Composition: page anatomy per page type, the surface model, emphasis levels, colour roles.</li>
          <li>Screens: the SOC overview, SOC cases and the portal home, each as Today and as Direction A. Switch the theme in the toolbar.</li>
          <li>New components: Briefing, Surface, AttentionList, HeroFigure, FigureRow, SeverityMark, ListDetail.</li>
        </ul>
      </DocSection>
    </DocPage>
  ),
};
