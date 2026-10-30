import type { Meta, StoryObj } from "@storybook/react-vite";
import { SocOverviewA } from "./SocOverviewA";
import { SocOverviewToday } from "./SocOverviewToday";

const meta = {
  title: "Direction A/Screens/SOC overview",
  component: SocOverviewA,
  tags: ["layer:screen", "!autodocs", "direction:a"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SocOverviewA>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Today's register: title, a lede about the interface, four equal tiles, panels of equal weight. */
export const Today: Story = { render: () => <SocOverviewToday /> };

/** Direction A: the claim, the ranked list of what needs you, one hero, the supporting figures. */
export const DirectionA: Story = { name: "Direction A", parameters: { direction: "a" }, render: () => <SocOverviewA /> };
