import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
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
  args: { rows, totalLabel: "Total", totalValue: "4,182" },
  argTypes: {
    rows: { control: false },
    totalLabel: { control: "text" },
    totalValue: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Distribution>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A ranked breakdown. Each row states its own value, so the bar is the
 * second channel rather than the only one.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("1,842")).toBeVisible();
  },
};

/** One row carrying nearly all of it. The bars still have to be readable. */
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
    const fills = canvasElement.querySelectorAll(".di-distribution-fill");
    await expect(fills[0]).toHaveClass("is-danger");
    await expect(fills[1]).toHaveClass("is-warn");
    await expect(fills[2]).toHaveClass("is-neutral");
  },
};
