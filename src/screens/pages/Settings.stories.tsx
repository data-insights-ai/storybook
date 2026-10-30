import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ProductShell } from "../shell/ProductShell";
import { expectEndClearOfFootBand } from "./footBand.sample";
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

/**
 * Retention changed: the band at the foot of the content column holds Discard and Save until the change is kept
 * or dropped. Scrolled to the end, the last section ends above the band, and the sidebar's column runs the page's
 * full height.
 */
export const UnsavedChanges: Story = {
  name: "Unsaved changes",
  args: { changed: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("region", { name: "Unsaved changes" });
    await expect(bar).toBeVisible();
    await expect(within(bar).getByRole("button", { name: "Save changes" })).toHaveClass("di-btn-primary");
    await expect(within(bar).getByRole("button", { name: "Discard" })).toBeVisible();

    await expectEndClearOfFootBand(bar);
  },
};
