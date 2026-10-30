import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ProductShell } from "../shell/ProductShell";
import { ListPageScreen } from "./ListPage";

const meta = {
  title: "Patterns/List page",
  tags: ["layer:screen"],
  component: ListPageScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <ProductShell area="organization" active="members" crumbs={["Example Security GmbH", "Members"]}>
        <Story />
      </ProductShell>
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
