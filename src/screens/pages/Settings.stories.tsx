import type { Meta, StoryObj } from "@storybook/react-vite";
import { Console } from "../../../.storybook/Console";
import { sampleChrome } from "../../../.storybook/chrome.sample";
import { SettingsScreen } from "./Settings";

const meta = {
  title: "Patterns/Settings",
  tags: ["layer:screen"],
  component: SettingsScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <Console title="Settings" crumb={["Operate", "Settings"]} active="settings" chrome={sampleChrome}>
        <Story />
      </Console>
    ),
  ],
} satisfies Meta<typeof SettingsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Session: Story = {};
