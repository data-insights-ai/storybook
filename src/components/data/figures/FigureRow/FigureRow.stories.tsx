import type { Meta, StoryObj } from "@storybook/react-vite";
import { Figure, FigureRow } from "./FigureRow";

const meta = {
  title: "Data/Figures/FigureRow",
  component: FigureRow,
  tags: ["layer:block", "autodocs", "direction:a"],
  parameters: { direction: "a" },
  args: { label: "Supporting figures", children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof FigureRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <FigureRow {...args}>
      <Figure label="New in 24 h" value="1">1 escalated</Figure>
      <Figure label="Unassigned" value="2" tone="warn">of 3 open</Figure>
      <Figure label="Time to acknowledge" value="2.9 h">median, 7 days</Figure>
      <Figure label="Resolved in 7 days" value="1" />
    </FigureRow>
  ),
};
