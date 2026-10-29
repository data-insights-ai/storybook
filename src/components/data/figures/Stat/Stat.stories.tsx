import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Stat, StatRow } from "./Stat";
import { StatusPill } from "../../../marks/StatusPill";

const meta = {
  title: "Data/Figures/Stat",
  tags: ["layer:block"],
  component: Stat,
  args: { label: "Active entries", value: "08", suffix: " / 08" },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Figure: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Active entries")).toBeVisible();
    await expect(canvasElement.querySelector(".di-stat-value")).toHaveTextContent("08 / 08");
  },
};

export const BesideAStatus: Story = {
  render: (args) => (
    <StatRow>
      <Stat {...args} />
      <Stat label="System status">
        <StatusPill tone="ok" dot>
          Monitoring active
        </StatusPill>
      </Stat>
    </StatRow>
  ),
};
