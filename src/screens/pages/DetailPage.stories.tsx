import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { ProductShell } from "../shell/ProductShell";
import { DetailPageScreen } from "./DetailPage";

const meta = {
  title: "Patterns/Detail page",
  tags: ["layer:screen", "!autodocs"],
  component: DetailPageScreen,
  parameters: { layout: "fullscreen" },
  args: { editing: false, changed: false, confirming: false },
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

/**
 * The record reads: the header names it and its state, each section shows
 * its facts with one Edit, and the danger zone comes last. Leave is blocked,
 * and the reason says what would unblock it.
 */
export const Organization: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Northwind Survey" })).toBeVisible();
    await expect(canvas.getByRole("heading", { name: "Danger zone" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Leave" })).toBeDisabled();
    await expect(canvas.queryByRole("region", { name: "Unsaved changes" })).toBeNull();
  },
};

/** Edit pressed: only this section turns into its form, starting in its first field. */
export const Editing: Story = {
  args: { editing: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("textbox", { name: "Name" })).toHaveValue("Northwind Survey");
    await expect(canvas.getByRole("button", { name: "Save" })).toBeVisible();
  },
};

/** A rule switched: Save and Discard wait at the foot of the window until the change is kept or dropped. */
export const UnsavedChanges: Story = {
  name: "Unsaved changes",
  args: { changed: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("region", { name: "Unsaved changes" });
    await expect(bar).toBeVisible();
    await expect(within(bar).getByRole("button", { name: "Save changes" })).toHaveClass("di-btn-primary");
  },
};

/** Delete pressed: the dialog itself carries the danger, the consequences and the typed name before it acts. */
export const DeleteConfirm: Story = {
  name: "Delete confirm",
  args: { confirming: true },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole("dialog", { name: "Delete Northwind Survey?" });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(within(dialog).getByText("14 members lose access")).toBeVisible();
    await expect(within(dialog).getByRole("button", { name: "Delete organization" })).toBeDisabled();
  },
};
