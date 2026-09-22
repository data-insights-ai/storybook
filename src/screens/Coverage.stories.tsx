import type { Meta, StoryObj } from "@storybook/react-vite";
import { CoverageScreen } from "./Coverage";

const meta = {
  title: "Screens/Coverage",
  component: CoverageScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CoverageScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sources: Story = {};
