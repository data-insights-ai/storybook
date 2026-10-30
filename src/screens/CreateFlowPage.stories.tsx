import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Console } from "../../.storybook/Console";
import { sampleChrome } from "../../.storybook/chrome.sample";
import { CreateFlowPageScreen } from "./CreateFlowPage";

const meta = {
  title: "Patterns/Create flow",
  tags: ["layer:screen"],
  component: CreateFlowPageScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <Console title="New connection" crumb={["Sign-in", "New connection"]} active="settings" chrome={sampleChrome}>
        <Story />
      </Console>
    ),
  ],
} satisfies Meta<typeof CreateFlowPageScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewConnection: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("heading", { name: "Choose a type" })).toBeVisible();
  },
};
