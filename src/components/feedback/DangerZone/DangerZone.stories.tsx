import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { ConfirmDialog } from "../../overlays/ConfirmDialog";
import { DangerAction } from "../../layout/page/Panel";
import { DangerZone } from "./DangerZone";

const meta = {
  title: "Feedback/DangerZone",
  component: DangerZone,
  tags: ["layer:block", "autodocs", "status:deprecated"],
  args: { title: "Danger zone", lede: "These actions remove access and cannot be undone.", children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof DangerZone>;

export default meta;
type Story = StoryObj<typeof meta>;

function Zone(args: { title: string; lede?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DangerZone {...args}>
        <DangerAction
          title="Leave organization"
          body="You lose access to Northwind Survey and its products at once."
          note="You are the last owner. Make someone else an owner first."
        >
          <Button variant="danger" disabled>
            Leave
          </Button>
        </DangerAction>
        <DangerAction
          title="Delete organization"
          body="Members, invitations, connections and seats are removed. This cannot be undone."
        >
          <Button variant="danger" onClick={() => setOpen(true)}>
            Delete organization
          </Button>
        </DangerAction>
      </DangerZone>
      <ConfirmDialog
        open={open}
        title="Delete Northwind Survey?"
        body="The organization and everything in it is removed for everyone."
        consequences={["14 members lose access", "2 sign-in connections stop working", "Seats are released"]}
        confirmText="Northwind Survey"
        confirmTextLabel="Type Northwind Survey to confirm"
        confirmLabel="Delete organization"
        cancelLabel="Cancel"
        onConfirm={() => setOpen(false)}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

/**
 * Deprecated: removed in 0.12.0. Write `<Panel tone="danger">` with `DangerAction` rows
 * (`Layout/Page/Panel` → Danger); this wrapper renders exactly that.
 */
export const Organization: Story = {
  render: (args) => <Zone {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Danger zone" })).toBeVisible();
    await expect(canvas.getByText("You are the last owner. Make someone else an owner first.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Delete organization" }));
    const dialog = within(canvasElement.ownerDocument.body).getByRole("dialog");
    await expect(within(dialog).getByRole("button", { name: "Delete organization" })).toBeDisabled();
  },
};
