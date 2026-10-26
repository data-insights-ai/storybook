import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { ConfirmDialog } from "./ConfirmDialog";

const meta = {
  title: "Blocks/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  args: {
    open: true,
    title: "Remove Jonas Brandt?",
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

/** Reversible enough: the consequence, then the question. Focus opens on Cancel. */
export const Remove: Story = {
  play: async ({ canvasElement }) => {
    const dialog = within(canvasElement.ownerDocument.body).getByRole("dialog");
    await waitFor(() => expect(within(dialog).getByRole("button", { name: "Cancel" })).toHaveFocus());
  },
};

/** Irreversible: the name has to be typed before the button acts. */
export const TypeToConfirm: Story = {
  args: {
    title: "Delete workspace Field Research?",
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
    await userEvent.type(within(dialog).getByLabelText("Type Field Research to confirm"), "Field Research");
    await expect(confirm).toBeEnabled();
    await userEvent.click(confirm);
    await expect(args.onConfirm).toHaveBeenCalled();
  },
};
