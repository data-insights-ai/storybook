import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ProductShell } from "../shell/ProductShell";
import { CreateFlowPageScreen } from "./CreateFlowPage";

const meta = {
  title: "Patterns/Create flow",
  tags: ["layer:screen"],
  component: CreateFlowPageScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <ProductShell area="organization" active="signin" crumbs={["Example Security GmbH", "Sign-in", "New connection"]}>
        <Story />
      </ProductShell>
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
