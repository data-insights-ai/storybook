import type { Meta, StoryObj } from "@storybook/react-vite";
import { SettingsScreen } from "./Settings";

const meta = {
  title: "Screens/Settings",
  tags: ["layer:screen"],
  component: SettingsScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SettingsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Session: Story = {};
