import type { Meta, StoryObj } from "@storybook/react-vite";
import { SocOverviewA } from "../screens/SocOverviewA";
import { SocCasesA } from "../screens/SocCasesA";
import { PortalHomeA } from "../screens/PortalHomeA";
import { decisionDue } from "../screens/portal.sample";
import { Compare, Variant } from "./Compare";

const meta = {
  title: "Direction A/Variants",
  tags: ["layer:screen", "!autodocs", "direction:a"],
  parameters: { direction: "a", layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** H-c (the default) against H-a and H-b on the SOC overview. */
export const HeaderWeight: Story = {
  name: "Compare · header",
  render: (_, { globals }) => (
    <Compare
      title="Header: H-c, H-a or H-b"
      lede="H-c, the default: the head only orients (the page name as a 28px heading, its state, as of when at the right) and the point is the attention list under its own heading, item 01 carrying the action. H-a: a 20px page name over a claim sentence up to 34px and a header button. H-b: a 28px name over a lighter 30px claim."
      theme={globals.theme ?? "light"}
      options={[
        { label: "H-c (default)", story: "header-hc" },
        { label: "H-a", story: "header-ha" },
        { label: "H-b", story: "header-hb" },
      ]}
    />
  ),
};

/** The same layouts with only the body face switched. */
export const BodyFont: Story = {
  name: "Compare · body font (decided: Plex)",
  render: (_, { globals }) => (
    <Compare
      title="Body font: IBM Plex Sans (decided) or Space Grotesk"
      lede="Decided: IBM Plex Sans, which pairs with Plex Mono and stays calmer at small sizes; at 14px the two hardly differ. Kept as the record. Same layout, only the reading face changes; the SOC case detail first, then the portal home."
      theme={globals.theme ?? "light"}
      options={[
        { label: "Case · IBM Plex Sans", story: "body-plex-case" },
        { label: "Case · Space Grotesk", story: "body-grotesk-case" },
        { label: "Portal · IBM Plex Sans", story: "body-plex-portal" },
        { label: "Portal · Space Grotesk", story: "body-grotesk-portal" },
      ]}
    />
  ),
};

/** The supporting figures as the hero's footer, or as a tonal strip of their own. */
export const FigureRowPlace: Story = {
  name: "Compare · figure row",
  render: (_, { globals }) => (
    <Compare
      title="Figure row: hero footer or tonal strip"
      lede="Both work. The rule: where a page has a hero, its figures are the hero's footer (A, the SOC overview); where there is none, they sit on a tonal strip (B, as on the portal home and the case detail). A rule only separates two figures, never stands before the first. Kept as the record."
      theme={globals.theme ?? "light"}
      options={[
        { label: "A · hero footer", story: "figures-hero-footer" },
        { label: "B · tonal strip", story: "figures-strip" },
      ]}
    />
  ),
};

/** Gold in daylight, light theme only. Decided: G-3, now the default. */
export const GoldInDaylight: Story = {
  name: "Compare · gold in daylight (decided: G-3)",
  render: () => (
    <Compare
      title="Gold in daylight: G-1, G-2 or G-3 (decided: G-3)"
      lede="Decided: G-3, the default. Daylight: gold marks an object, never text. Light mode only; after dark gold on navy stays text. G-1, the first proposal: cream paper, gold text darkened to #7a5c0e for contrast, which read as olive. G-2: cool paper, navy words with a highlighter bar under the one thing; it highlights but distracts. G-3: cool paper, navy words only; gold is item 01's edge and rank bar and the navy “Start here” on a gold pill. Kept as the record."
      theme="light"
      options={[
        { label: "G-1 · overview", story: "gold-g-1-overview" },
        { label: "G-2 · overview", story: "gold-g-2-overview" },
        { label: "G-3 · overview", story: "gold-g-3-overview" },
        { label: "G-1 · case", story: "gold-g-1-case" },
        { label: "G-2 · case", story: "gold-g-2-case" },
        { label: "G-3 · case", story: "gold-g-3-case" },
      ]}
    />
  ),
};

export const HeaderHC: Story = { name: "Header H-c", render: () => <SocOverviewA /> };
export const HeaderHA: Story = {
  name: "Header H-a",
  render: () => (
    <Variant header="a">
      <SocOverviewA header="claim" />
    </Variant>
  ),
};
export const HeaderHB: Story = {
  name: "Header H-b",
  render: () => (
    <Variant header="b">
      <SocOverviewA header="claim" />
    </Variant>
  ),
};

export const GoldG1Overview: Story = {
  name: "Gold G-1 overview",
  render: () => (
    <Variant gold="1">
      <SocOverviewA />
    </Variant>
  ),
};
export const GoldG2Overview: Story = {
  name: "Gold G-2 overview",
  render: () => (
    <Variant gold="2">
      <SocOverviewA />
    </Variant>
  ),
};
export const GoldG3Overview: Story = { name: "Gold G-3 overview", render: () => <SocOverviewA /> };
export const GoldG1Case: Story = {
  name: "Gold G-1 case",
  render: () => (
    <Variant gold="1">
      <SocCasesA showing="detail" />
    </Variant>
  ),
};
export const GoldG2Case: Story = {
  name: "Gold G-2 case",
  render: () => (
    <Variant gold="2">
      <SocCasesA showing="detail" />
    </Variant>
  ),
};
export const GoldG3Case: Story = { name: "Gold G-3 case", render: () => <SocCasesA showing="detail" /> };

export const BodyPlexCase: Story = { name: "Body Plex case", render: () => <SocCasesA showing="detail" /> };
export const BodyGroteskCase: Story = {
  name: "Body Grotesk case",
  render: () => (
    <Variant body="grotesk">
      <SocCasesA showing="detail" />
    </Variant>
  ),
};
export const BodyPlexPortal: Story = { name: "Body Plex portal", render: () => <PortalHomeA role="owner" state={decisionDue} /> };
export const BodyGroteskPortal: Story = {
  name: "Body Grotesk portal",
  render: () => (
    <Variant body="grotesk">
      <PortalHomeA role="owner" state={decisionDue} />
    </Variant>
  ),
};

export const FiguresHeroFooter: Story = { name: "Figures hero footer", render: () => <SocOverviewA figures="hero" /> };
export const FiguresStrip: Story = { name: "Figures strip", render: () => <SocOverviewA figures="strip" /> };
