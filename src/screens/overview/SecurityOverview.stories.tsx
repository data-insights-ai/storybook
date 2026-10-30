import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { SecurityOverview } from "./SecurityOverview";

const meta = {
  title: "Patterns/Security overview",
  component: SecurityOverview,
  tags: ["layer:screen", "!autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SecurityOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The header orients, the attention list is the point, the one hero is the
 * detections chart with its figures as the footer, then the lists behind
 * the items. Gold marks one object: the first attention item.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Production" })).toBeVisible();
    const headings = canvas.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    await expect(headings[0]).toBe("3 things need you");
    await expect(canvasElement.querySelectorAll(".is-emphasis")).toHaveLength(1);
    await expect(canvas.getAllByRole("link", { name: "Open case 4" })).toHaveLength(1);
  },
};
