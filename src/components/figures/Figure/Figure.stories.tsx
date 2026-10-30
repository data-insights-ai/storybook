import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Grid } from "../../layout/arrange/Grid";
import { Panel, PanelStatus } from "../../layout/page/Panel";
import { SeverityMark } from "../../status/SeverityMark";
import { StatusPill } from "../../status/StatusPill";
import { Sparkline } from "../Sparkline";
import { Figure, FigureNote } from "./Figure";

const meta = {
  title: "Figures/Figure",
  component: Figure,
  tags: ["layer:block", "autodocs"],
  args: { label: "Entries sealed", value: "4,182", unit: "", tone: "neutral", size: "regular", children: null },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    unit: { control: "text" },
    tone: { control: "radio", options: ["neutral", "warn", "danger"] },
    size: { control: "radio", options: ["compact", "regular", "hero"] },
    children: { control: false },
  },
} satisfies Meta<typeof Figure>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Figures on their own surfaces, read side by side: each in a `Panel`,
 * the note naming its direction in words.
 */
export const InPanels: Story = {
  name: "In panels",
  parameters: { controls: { disable: true } },
  render: () => (
    <Grid min="200px" gap={16}>
      <Panel>
        <Figure label="Entries sealed" value="4,182">
          <FigureNote tone="ok">up 112 since 09:00Z</FigureNote>
        </Figure>
      </Panel>
      <Panel>
        <Figure label="Coverage" value="86.4%">
          <FigureNote tone="warn">down 2.1 points</FigureNote>
        </Figure>
      </Panel>
      <Panel>
        <Figure label="Unsealed" value="1,284" tone="danger">
          <FigureNote tone="danger">up 940 since 08:00Z</FigureNote>
        </Figure>
      </Panel>
      <Panel>
        <Figure label="Sources" value="24">
          no earlier reading
        </Figure>
      </Panel>
    </Grid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("1,284")).toBeVisible();
    await expect(canvasElement.querySelectorAll("dl.di-figure")).toHaveLength(4);
  },
};

/** What the figure is read against need not be a word: a sparkline with its one marked reading. */
export const WithSparkline: Story = {
  name: "With sparkline",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Panel title="Sealing">
        <PanelStatus>
          <StatusPill tone="danger">over threshold</StatusPill>
        </PanelStatus>
        <Figure label="Unsealed" value="1,284" tone="danger" size="compact">
          <FigureNote tone="danger">up 940 since 08:00Z</FigureNote>
          <Sparkline
            values={[18, 22, 20, 34, 48, 74]}
            highlight={5}
            tone="danger"
            label="Unsealed entries over the last six hours, rising sharply in the last two."
          />
        </Figure>
      </Panel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { name: /rising sharply/ })).toBeVisible();
    await expect(canvasElement.querySelectorAll(".di-sparkline-bar.is-danger")).toHaveLength(1);
  },
};

/** The one number a view exists for, and the severities it is read against. */
export const Hero: Story = {
  args: { size: "hero", label: "Open cases", value: "3" },
  render: (args) => (
    <Figure {...args}>
      <SeverityMark level="critical" label="1 critical" />
      <SeverityMark level="high" label="1 high" />
      <SeverityMark level="medium" label="1 medium" />
    </Figure>
  ),
  play: async ({ canvasElement }) => {
    const value = within(canvasElement).getByText("3");
    await expect(parseFloat(getComputedStyle(value).fontSize)).toBeGreaterThan(40);
  },
};

/** A denominator after the value, regular weight and quieter, so the value stays the one bold line. */
export const WithUnit: Story = {
  name: "With unit",
  args: { size: "hero", label: "Seats in use", value: "4", unit: "of 5" },
  play: async ({ canvasElement }) => {
    const unit = canvasElement.querySelector(".di-figure-unit") as HTMLElement;
    await expect(getComputedStyle(unit).fontWeight).toBe("400");
  },
};

/** The three sizes on one line: a card's figure, a row's, and the view's one hero. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 32 }}>
      <Figure size="compact" label="Ingest rate" value="412" unit="per second" />
      <Figure size="regular" label="Ingest rate" value="412" unit="per second" />
      <Figure size="hero" label="Ingest rate" value="412" unit="per second" />
    </div>
  ),
};

/** A long German label wraps above its value; the value never breaks. */
export const LongLabel: Story = {
  name: "Long label",
  args: { label: "Nicht versiegelte Einträge seit Mitternacht", value: "1.284", tone: "warn" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 200 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Figure {...args}>
      <FigureNote tone="warn">940 mehr als um 08:00Z</FigureNote>
    </Figure>
  ),
};
