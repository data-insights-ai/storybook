import type { Meta, StoryObj } from "@storybook/react-vite";
import { PortalHomeA } from "./PortalHomeA";
import { PortalHomeToday } from "./PortalHomeToday";

const meta = {
  title: "Direction A/Screens/Portal home",
  component: PortalHomeA,
  tags: ["layer:screen", "!autodocs", "direction:a"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PortalHomeA>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Today: the products in a panel holding one small button, then five equal cards with charts. */
export const Today: Story = { render: () => <PortalHomeToday /> };

/** Direction A: whether anything needs the owner, the products to open, the one decision in gold. */
export const DirectionA: Story = { name: "Direction A", parameters: { direction: "a" }, render: () => <PortalHomeA /> };
