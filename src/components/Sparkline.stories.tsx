import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Sparkline } from "./Sparkline";

const bars = [
  { percent: 38 },
  { percent: 46 },
  { percent: 41 },
  { percent: 52 },
  { percent: 49 },
  { percent: 61 },
  { percent: 74, tone: "ink" as const },
  { percent: 96, tone: "danger" as const },
];

const meta = {
  title: "Primitives/Sparkline",
  component: Sparkline,
  tags: ["autodocs"],
  args: {
    bars,
    label: "Unsealed entries over the last eight hours, rising sharply in the last two.",
  },
  argTypes: {
    bars: { control: false },
    label: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 260 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A bare column chart for a card. `label` describes the shape in words,
 * because a row of bars with no axis is not readable as data.
 */
export const Rising: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { name: /rising sharply/ })).toBeVisible();
  },
};

/** Nothing happening, which the words have to say as plainly as the bars. */
export const Flat: Story = {
  args: {
    bars: bars.map((bar) => ({ percent: bar.percent })),
    label: "Unsealed entries, flat over the last eight hours.",
  },
};
