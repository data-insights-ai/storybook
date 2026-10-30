import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ProductShell } from "../shell/ProductShell";
import { SettingsScreen } from "./Settings";

const meta = {
  title: "Patterns/Settings",
  tags: ["layer:screen", "!autodocs"],
  component: SettingsScreen,
  parameters: { layout: "fullscreen" },
  args: { changed: false },
  decorators: [
    (Story) => (
      <ProductShell area="workspace" active="settings" crumbs={["Example Security GmbH", "Production", "Settings"]}>
        <Story />
      </ProductShell>
    ),
  ],
} satisfies Meta<typeof SettingsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three sections, each named by what it governs; nothing to save while nothing changed. */
export const Workspace: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Settings" })).toBeVisible();
    await expect(canvas.getByRole("heading", { name: "Notification channels" })).toBeVisible();
    await expect(canvas.queryByRole("region", { name: "Unsaved changes" })).toBeNull();
  },
};

/** Retention changed: the bar at the foot holds Save and Discard until the change is kept or dropped. */
export const UnsavedChanges: Story = {
  name: "Unsaved changes",
  args: { changed: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("region", { name: "Unsaved changes" });
    await expect(bar).toBeVisible();
    await expect(within(bar).getByRole("button", { name: "Save changes" })).toHaveClass("di-btn-primary");
    await expect(within(bar).getByRole("button", { name: "Discard" })).toBeVisible();
  },
};
