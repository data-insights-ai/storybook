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
  title: "Primitives/Distribution",
  component: Distribution,
  tags: ["autodocs"],
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
