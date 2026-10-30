import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Figure, FigureRow } from "./FigureRow";

const meta = {
  title: "Data/Figures/FigureRow",
  component: FigureRow,
  tags: ["layer:block", "autodocs"],
  args: { label: "Case figures", variant: "strip", children: null },
  argTypes: {
    label: { control: "text" },
    variant: { control: "radio", options: ["footer", "strip"] },
    children: { control: false },
  },
  render: (args) => (
    <FigureRow {...args}>
      <Figure label="Signals" value="1,064">
        12 rules
      </Figure>
      <Figure label="Hosts" value="39" tone="danger">
        36 in finance
      </Figure>
      <Figure label="Accounts" value="4">
        svc-backup most active
      </Figure>
      <Figure label="Score" value="98">
        of 100
      </Figure>
    </FigureRow>
  ),
} satisfies Meta<typeof FigureRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figures without a hero sit on a strip a step below the ground. */
export const Strip: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("1,064")).toBeVisible();
    const first = canvasElement.querySelector(".di-figure") as HTMLElement;
    const list = canvasElement.querySelector(".di-figure-list") as HTMLElement;
    await expect(first.getBoundingClientRect().left).toBeLessThan(list.getBoundingClientRect().left);
  },
};

/** Under a hero the row is its footer: no band, the hero's rule above it. */
export const Footer: Story = {
  args: { variant: "footer" },
};
