import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Console } from "../../../.storybook/Console";
import { sampleChrome } from "../../../.storybook/chrome.sample";
import { DetailPageScreen } from "./DetailPage";

const meta = {
  title: "Patterns/Detail page",
  tags: ["layer:screen"],
  component: DetailPageScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <Console title="Northwind Survey" crumb={["Organization", "Overview"]} active="overview" chrome={sampleChrome}>
        <Story />
      </Console>
    ),
  ],
} satisfies Meta<typeof DetailPageScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Organization: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("heading", { name: "Danger zone" })).toBeVisible();
  },
};
