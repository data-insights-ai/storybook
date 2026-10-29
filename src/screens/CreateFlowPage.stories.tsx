import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CreateFlowPageScreen } from "./CreateFlowPage";

const meta = {
  title: "Screens/Create flow",
  tags: ["layer:screen"],
  component: CreateFlowPageScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CreateFlowPageScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewConnection: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("heading", { name: "Choose a type" })).toBeVisible();
  },
};
