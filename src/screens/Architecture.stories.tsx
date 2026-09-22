import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArchitectureScreen } from "./Architecture";

const meta = {
  title: "Screens/Architecture",
  component: ArchitectureScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ArchitectureScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pipeline: Story = {};
