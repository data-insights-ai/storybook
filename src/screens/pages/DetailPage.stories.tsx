import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ProductShell } from "../shell/ProductShell";
import { DetailPageScreen } from "./DetailPage";

const meta = {
  title: "Patterns/Detail page",
  tags: ["layer:screen"],
  component: DetailPageScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <ProductShell area="organization" active="settings" crumbs={["Example Security GmbH", "Settings"]}>
        <Story />
      </ProductShell>
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
