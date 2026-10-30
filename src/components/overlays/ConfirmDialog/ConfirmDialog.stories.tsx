import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { ConfirmDialog } from "./ConfirmDialog";

const meta = {
  title: "Overlays/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["layer:block", "autodocs"],
  args: {
    open: true,
    title: "Remove Jonas Brandt?",
    eyebrow: "Member · Northwind",
    body: "Jonas Brandt loses access to this organization and its products.",
    consequences: [],
    confirmLabel: "Remove member",
    cancelLabel: "Cancel",
    confirmText: "",
    confirmTextLabel: "",
    tone: "danger",
    busy: false,
    error: "",
    onConfirm: fn(),
    onClose: fn(),
  },
  argTypes: { tone: { control: "radio", options: ["danger", "neutral"] } },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Removing access: the record above the title, the consequence, then the
 * question. The eyebrow takes the danger ink because `tone="danger"`.
 * Focus opens on Cancel, the choice that changes nothing.
 */
export const Remove: Story = {
  play: async ({ canvasElement }) => {
    const dialog = within(canvasElement.ownerDocument.body).getByRole("dialog");
    await waitFor(() => expect(within(dialog).getByRole("button", { name: "Cancel" })).toHaveFocus());
    await expect(within(dialog).getByText("Member · Northwind").closest(".di-eyebrow")).toHaveClass("is-danger");
    await expect(dialog.querySelector("svg.lucide-triangle-alert")).toBeNull();
    await readsAsDanger(dialog, within(dialog).getByRole("button", { name: "Remove member" }));
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe("1"));
  },
};

/** A weighty but ordinary step: `tone="neutral"`, a quiet eyebrow and a primary commit. */
export const Ordinary: Story = {
  args: {
    title: "Transfer ownership to Nora Feld?",
    eyebrow: "Organization · Northwind",
    body: "Nora Feld becomes the owner. You stay an administrator and can be made owner again by her.",
    confirmLabel: "Transfer ownership",
    tone: "neutral",
  },
  play: async ({ canvasElement }) => {
    const dialog = within(canvasElement.ownerDocument.body).getByRole("dialog");
    await expect(within(dialog).getByText("Organization · Northwind").closest(".di-eyebrow")).not.toHaveClass(
      "is-danger",
    );
    await expect(dialog.querySelector(".di-dialog-mark")).toBeNull();
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe("1"));
  },
};

/** The danger reads in the dialog itself: the mark leads the title, and the commit is filled in the danger colour. */
async function readsAsDanger(dialog: HTMLElement, confirm: HTMLElement) {
  const mark = dialog.querySelector(".di-dialog-mark");
  await expect(mark).not.toBeNull();
  const red = getComputedStyle(mark!).color;
  const title = dialog.querySelector(".di-dialog-title")!.getBoundingClientRect();
  const markBox = mark!.getBoundingClientRect();
  await expect(Math.abs(markBox.top + markBox.height / 2 - (title.top + title.height / 2))).toBeLessThanOrEqual(2);
  await expect(getComputedStyle(confirm).backgroundColor).not.toBe(getComputedStyle(dialog).backgroundColor);
  return red;
}

/**
 * Irreversible: the name has to be typed before the button acts. Until
 * then the button keeps a danger tint, not the grey of any disabled
 * control, so the dialog reads as destructive before anything is typed.
 */
export const TypeToConfirm: Story = {
  args: {
    title: "Delete workspace Field Research?",
    eyebrow: "Workspace · Northwind",
    body: "The workspace and its data are deleted for everyone.",
    consequences: ["All cases and reports in it are deleted", "Its API keys stop working"],
    confirmLabel: "Delete workspace",
    confirmText: "Field Research",
    confirmTextLabel: "Type Field Research to confirm",
  },
  play: async ({ args, canvasElement }) => {
    const dialog = within(canvasElement.ownerDocument.body).getByRole("dialog");
    const confirm = within(dialog).getByRole("button", { name: "Delete workspace" });
    await expect(confirm).toBeDisabled();
    const red = await readsAsDanger(dialog, confirm);
    const cancel = within(dialog).getByRole("button", { name: "Cancel" });
    await expect(getComputedStyle(confirm).borderTopColor).not.toBe(getComputedStyle(cancel).borderTopColor);
    await expect(getComputedStyle(confirm).color).not.toBe(getComputedStyle(cancel).color);
    await expect(red).not.toBe(getComputedStyle(within(dialog).getByRole("heading")).color);
    await userEvent.type(within(dialog).getByLabelText("Type Field Research to confirm"), "Field Research");
    await expect(confirm).toBeEnabled();
    await userEvent.click(confirm);
    await expect(args.onConfirm).toHaveBeenCalled();
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe("1"));
  },
};
