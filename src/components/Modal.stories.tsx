import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertTriangle } from "lucide-react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Button } from "./Button";
import { Fact, FactList } from "./FactList";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalFrame,
  ModalIcon,
  ModalTitle,
} from "./Modal";
import { TextField } from "./TextField";

const meta = {
  title: "Blocks/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    /*
     * `showModal()` puts the dialog in the browser's top layer and makes the
     * rest of the document inert. Rendered inline, that document is the Docs
     * page itself: three open dialogs stack over the prose and nothing on the
     * page can be read or clicked. Each story gets its own frame instead, so
     * the top layer it takes over is only its own.
     */
    docs: { story: { inline: false, height: "440px" } },
  },
  args: {
    open: true,
    labelledBy: "modal-title",
    onClose: fn(),
    children: null,
  },
  argTypes: {
    open: { control: "boolean" },
    labelledBy: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Only an irreversible action earns a modal, and the confirmation states
 * the basis, the scope and whether it can be reversed before it runs.
 *
 * Cancel, Revoke and Escape all close it, and each reports through
 * `onClose`. The trigger behind the dialog reopens it: while the dialog is
 * up, the page behind is inert, so that button is unreachable by design.
 */
export const Confirm: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
    // Keeps the `open` control working after the story has closed itself.
    useEffect(() => setOpen(args.open), [args.open]);
    const close = () => setOpen(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Revoke sources
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={() => {
            args.onClose();
            setOpen(false);
          }}
        >
          <ModalFrame>
            <ModalIcon>
              <AlertTriangle aria-hidden />
            </ModalIcon>
            <ModalContent>
              <ModalTitle id="modal-title" eyebrow="Irreversible">
                Revoke four sources?
              </ModalTitle>
              <ModalBody>
                Revoking removes them from the register. Entries already sealed stay on record and
                keep citing them.
              </ModalBody>
              <FactList>
                <Fact label="Scope">4 sources · WS-01</Fact>
                <Fact label="Sealed">1,284 entries stay on record</Fact>
                <Fact label="Reversible">No</Fact>
              </FactList>
            </ModalContent>
            <ModalFooter>
              <Button variant="secondary" onClick={close}>
                Cancel
              </Button>
              <Button variant="danger" onClick={close}>
                Revoke
              </Button>
            </ModalFooter>
          </ModalFrame>
        </Modal>
      </>
    );
  },
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    // The dialog starts at opacity 0 and fades in, so the visibility check
    // belongs inside waitFor rather than after it.
    await waitFor(() =>
      expect(body.getByRole("dialog", { name: "Revoke four sources?" })).toBeVisible(),
    );

    // Cancel closes it, and says so.
    const dialog = body.getByRole("dialog", { name: "Revoke four sources?" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await expect(args.onClose).toHaveBeenCalled();

    // And the trigger behind it brings it back.
    await userEvent.click(body.getByRole("button", { name: "Revoke sources" }));
    await waitFor(() => expect(body.getByRole("dialog")).toBeVisible());

  },
};

/**
 * The most dangerous actions ask the operator to type the thing back. The
 * commit stays disabled until the workspace name matches exactly, and the
 * line under the field says which of the two states it is in.
 */
export const TypeToConfirm: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
    const [typed, setTyped] = useState("");
    useEffect(() => setOpen(args.open), [args.open]);
    const matches = typed === "WS-01";
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Erase record
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={() => {
            args.onClose();
            setOpen(false);
          }}
        >
          <ModalFrame>
            <ModalIcon>
              <AlertTriangle aria-hidden />
            </ModalIcon>
            <ModalContent>
              <ModalTitle id="modal-title" eyebrow="Irreversible">
                Erase the workspace record?
              </ModalTitle>
              <ModalBody>
                Every entry, seal and manifest in WS-01 is destroyed. No copy is kept.
              </ModalBody>
              <FactList>
                <Fact label="Scope">WS-01 · 24,918 entries</Fact>
                <Fact label="Reversible">No</Fact>
              </FactList>
              <TextField
                id="confirm-name"
                label="Type WS-01 to confirm"
                mono={true}
                placeholder="WS-01"
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
                hint={matches ? "Matches WS-01." : "The name has to match exactly."}
                hintTone={matches ? "sealed" : "neutral"}
              />
            </ModalContent>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" disabled={!matches} onClick={() => setOpen(false)}>
                Erase record
              </Button>
            </ModalFooter>
          </ModalFrame>
        </Modal>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByRole("dialog")).toBeVisible());
    const canvas = within(body.getByRole("dialog"));
    const commit = canvas.getByRole("button", { name: "Erase record" });
    await expect(commit).toBeDisabled();

    // A near miss is still a miss.
    const field = canvas.getByLabelText("Type WS-01 to confirm");
    await userEvent.type(field, "WS-0");
    await expect(commit).toBeDisabled();

    await userEvent.type(field, "1");
    await waitFor(() => expect(commit).toBeEnabled());
  },
};

/** No icon column, for a modal that is not warning about anything. */
export const Plain: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
    useEffect(() => setOpen(args.open), [args.open]);
    const close = () => setOpen(false);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Export register
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={() => {
            args.onClose();
            setOpen(false);
          }}
        >
          <ModalFrame>
            <ModalContent>
              <ModalTitle id="modal-title">Export the register?</ModalTitle>
              <ModalBody>
                The export carries every seal, so a recipient can verify it offline.
              </ModalBody>
              <FactList>
                <Fact label="Format">JSON Lines, gzip</Fact>
                <Fact label="Size">≈ 84 MB</Fact>
              </FactList>
            </ModalContent>
            <ModalFooter>
              <Button variant="secondary" onClick={close}>
                Cancel
              </Button>
              <Button variant="primary" onClick={close}>
                Export
              </Button>
            </ModalFooter>
          </ModalFrame>
        </Modal>
      </>
    );
  },
};

/** Closed. The dialog is in the tree but nothing is shown. */
export const Closed: Story = {
  args: { open: false },
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
    useEffect(() => setOpen(args.open), [args.open]);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Revoke sources
        </Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>
          <ModalFrame>
            <ModalIcon>
              <AlertTriangle aria-hidden />
            </ModalIcon>
            <ModalContent>
              <ModalTitle id="modal-title" eyebrow="Irreversible">
                Revoke four sources?
              </ModalTitle>
              <ModalBody>Entries already sealed stay on record.</ModalBody>
            </ModalContent>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Revoke
              </Button>
            </ModalFooter>
          </ModalFrame>
        </Modal>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(body.queryByRole("dialog")).toBeNull();
  },
};

/**
 * The transition, both ways. The dialog fades and settles down one step,
 * the scrim fades with it, and `allow-discrete` lets the native element
 * animate out as well as in — closing is seen, not cut.
 */
export const Transition: Story = {
  args: { open: false },
  parameters: { controls: { disable: true } },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Revoke sources
        </Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)} labelledBy="modal-title">
          <ModalFrame>
            <ModalIcon>
              <AlertTriangle aria-hidden />
            </ModalIcon>
            <ModalContent>
              <ModalTitle id="modal-title" eyebrow="Irreversible">
                Revoke four sources?
              </ModalTitle>
              <ModalBody>Entries already sealed stay on record and keep citing them.</ModalBody>
              <FactList>
                <Fact label="Scope">4 sources · WS-01</Fact>
                <Fact label="Reversible">No</Fact>
              </FactList>
            </ModalContent>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Revoke
              </Button>
            </ModalFooter>
          </ModalFrame>
        </Modal>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Revoke sources" }));
    await waitFor(() =>
      expect(body.getByRole("dialog", { name: "Revoke four sources?" })).toBeVisible(),
    );
  },
};
