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
    await expectEyebrowGap(dialog.querySelector(".di-eyebrow")!);
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

/** The space from an eyebrow to the title under it: the one eyebrow gap, in every head. */
async function expectEyebrowGap(eyebrow: Element) {
  const probe = document.createElement("div");
  probe.style.width = "var(--di-gap-8)";
  eyebrow.parentElement!.append(probe);
  const gap = probe.getBoundingClientRect().width;
  probe.remove();
  const next = eyebrow.nextElementSibling!.getBoundingClientRect().top - eyebrow.getBoundingClientRect().bottom;
  await expect(Math.abs(next - gap)).toBeLessThan(1);
}

/** A token as the element's context paints it. */
function paintOf(within: Element, token: string) {
  const probe = document.createElement("span");
  probe.style.color = `var(${token})`;
  within.append(probe);
  const colour = getComputedStyle(probe).color;
  probe.remove();
  return colour;
}

/**
 * The danger reads in the dialog itself: the mark leads the title, and the commit, once it can act, is the filled
 * danger button (until then it is disabled like any other control).
 */
async function readsAsDanger(dialog: HTMLElement, confirm: HTMLElement) {
  const mark = dialog.querySelector(".di-dialog-mark");
  await expect(mark).not.toBeNull();
  const red = getComputedStyle(mark!).color;
  const title = dialog.querySelector(".di-dialog-title")!.getBoundingClientRect();
  const markBox = mark!.getBoundingClientRect();
  await expect(Math.abs(markBox.top + markBox.height / 2 - (title.top + title.height / 2))).toBeLessThanOrEqual(2);
  await expect(getComputedStyle(confirm).backgroundColor).not.toBe(getComputedStyle(dialog).backgroundColor);
  const ground = (confirm as HTMLButtonElement).disabled ? "--di-bg-disabled" : "--di-status-danger-dot";
  // The ground eases in with the theme and the state, so it is read once it has settled.
  const expected = paintOf(confirm, ground);
  await waitFor(() => expect(getComputedStyle(confirm).backgroundColor).toBe(expected));
  return red;
}

/**
 * Irreversible: the name has to be typed before the button acts. Until
 * then the button is disabled like any other control; the mark at the title
 * and the eyebrow say the dialog is destructive, and once the name is typed
 * the commit is the filled danger button.
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
    const filled = paintOf(confirm, "--di-status-danger-dot");
    await waitFor(() => expect(getComputedStyle(confirm).backgroundColor).toBe(filled));
    await userEvent.click(confirm);
    await expect(args.onConfirm).toHaveBeenCalled();
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe("1"));
  },
};
