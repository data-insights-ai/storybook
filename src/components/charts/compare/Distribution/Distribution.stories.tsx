import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Panel, PanelActions } from "../../../layout/page/Panel";
import { TextLink } from "../../../navigation/TextLink";
import { Distribution } from "./Distribution";

const rows = [
  { label: "Registry", value: "1,842", percent: 44 },
  { label: "Mirror", value: "1,109", percent: 27 },
  { label: "Feed", value: "744", percent: 18 },
  { label: "Archive", value: "487", percent: 11 },
];

const meta = {
  title: "Charts/Compare/Distribution",
  component: Distribution,
  tags: ["layer:primitive", "autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Purpose:** a ranked breakdown of one whole: each part with its count, its share as a bar, and the total.",
          "**When to use:** up to about seven parts of one total, read by rank. **When not to:** one value on a scale is a `LevelMeter`; parts over time are a `TrendChart` with stacked bars; a reference set with what was reached is a `CoverageMatrix`.",
          "**Anatomy:** per row the label and the value on one line, the bar beneath (a continuous `LevelMeter`); last, the total under a hairline.",
          "**Variants:** a row's `tone` (`warn`, `danger`) puts its bar on the status ramp, only when the rows are states (findings by state, open work by priority). Otherwise every bar is the series colour.",
          "**Content:** rows ranked largest first; the value formatted as people read it; `percent` the share of the total.",
          '**Accessibility:** each bar is a `meter` named by its label, its value text the count and the share ("1,842, 44%").',
        ].join("\n\n"),
      },
    },
  },
  args: { rows, totalLabel: "Total", totalValue: "4,182" },
  argTypes: {
    rows: { control: false },
    totalLabel: { control: "text" },
    totalValue: { control: "text" },
  },
  render: (args) => (
    <div style={{ maxWidth: "calc(var(--di-measure-form) / 2)" }}>
      <Panel title="Entries by source" heading={2}>
        <PanelActions>
          <TextLink href="#sources">Sources</TextLink>
        </PanelActions>
        <Distribution {...args} />
      </Panel>
    </div>
  ),
} satisfies Meta<typeof Distribution>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A ranked breakdown in its panel. Each row states its own value, so the
 * bar is the second channel rather than the only one.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("1,842")).toBeVisible();
    await expect(canvas.getByRole("meter", { name: "Registry" })).toHaveAttribute("aria-valuetext", "1,842, 44%");
  },
};

/** One row carrying nearly all of it. The small bars still show. */
export const Skewed: Story = {
  args: {
    rows: [
      { label: "Registry", value: "4,022", percent: 96 },
      { label: "Mirror", value: "104", percent: 3 },
      { label: "Feed", value: "56", percent: 1 },
    ],
    totalValue: "4,182",
  },
};

/**
 * Rows that are states. `tone` puts each bar on the status ramp; the label
 * still says which state it is, so the colour is a second channel.
 */
export const Toned: Story = {
  args: {
    rows: [
      { label: "Blocking", value: "3", percent: 25, tone: "danger" },
      { label: "Degraded", value: "4", percent: 33, tone: "warn" },
      { label: "Nominal", value: "5", percent: 42, tone: "neutral" },
    ],
    totalLabel: "Open",
    totalValue: "12",
  },
  play: async ({ canvasElement }) => {
    const fills = canvasElement.querySelectorAll(".di-level-fill");
    await expect(fills[0]).toHaveClass("is-danger");
    await expect(fills[1]).toHaveClass("is-warn");
    await expect(fills[2]).not.toHaveClass("is-warn");
  },
};

/** German labels: a long label wraps beside its value, which stays on the first line. */
export const German: Story = {
  args: {
    rows: [
      { label: "Unternehmensverzeichnis (Spiegelserver Frankfurt)", value: "1.842", percent: 44 },
      { label: "Bedrohungsdaten-Abonnement", value: "1.109", percent: 27 },
      { label: "Archivierte Ereignisprotokolle", value: "744", percent: 18 },
      { label: "Sonstige", value: "487", percent: 11 },
    ],
    totalLabel: "Gesamt",
    totalValue: "4.182",
  },
  play: async ({ canvasElement }) => {
    const label = canvasElement.querySelector(".di-distribution-label")!.getBoundingClientRect();
    const value = canvasElement.querySelector(".di-distribution-value")!.getBoundingClientRect();
    await expect(value.left).toBeGreaterThanOrEqual(label.right);
    await expect(Math.abs(value.top - label.top)).toBeLessThan(4);
  },
};
