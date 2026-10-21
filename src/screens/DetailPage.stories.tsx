import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { DetailPageScreen } from "./DetailPage";

const meta = {
  title: "Screens/Detail page",
  component: DetailPageScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DetailPageScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Organization: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("heading", { name: "Danger zone" })).toBeVisible();
  },
};
