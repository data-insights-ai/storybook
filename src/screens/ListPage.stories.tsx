import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Console } from "../../.storybook/Console";
import { sampleChrome } from "../../.storybook/chrome.sample";
import { ListPageScreen } from "./ListPage";

const meta = {
  title: "Patterns/List page",
  tags: ["layer:screen"],
  component: ListPageScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <Console title="Members" crumb={["Organization", "Members"]} active="overview" chrome={sampleChrome}>
        <Story />
      </Console>
    ),
  ],
} satisfies Meta<typeof ListPageScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Members: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: "Invite people" })).toBeVisible();
  },
};
