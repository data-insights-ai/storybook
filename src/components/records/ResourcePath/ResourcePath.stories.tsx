import type { Meta, StoryObj } from "@storybook/react-vite";
import { onPanel } from "../../../../.storybook/onPanel";
import { expect, within } from "storybook/test";
import { ResourcePath } from "./ResourcePath";

const meta = {
  title: "Records/ResourcePath",
  component: ResourcePath,
  tags: ["layer:block", "autodocs"],
  decorators: [onPanel("Audit entry")],
  args: {
    segments: [
      { label: "Northwind Labs", href: "#org" },
      { label: "Production", href: "#workspace" },
      { label: "Weekly report (deleted)" },
    ],
  },
} satisfies Meta<typeof ResourcePath>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Where a record lives, each part linked while it exists. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: "Production" })).toBeVisible();
    await expect(canvas.queryByRole("link", { name: /Weekly report/ })).toBeNull();
  },
};
