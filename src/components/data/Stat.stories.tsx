import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stat, StatRow } from "./Stat";
import { StatusPill } from "./marks/StatusPill";

const meta = {
  title: "Blocks/Stat",
  tags: ["layer:block"],
  component: Stat,
  args: { label: "Active entries", value: "08", suffix: " / 08" },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Figure: Story = {};

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
