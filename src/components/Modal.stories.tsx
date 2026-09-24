import { useState } from "react";
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
 */
export const Confirm: Story = {
  render: (args) => (
    <Modal {...args}>
      <ModalFrame>
        <ModalIcon>
          <AlertTriangle aria-hidden />
        </ModalIcon>
        <ModalContent>
          <ModalTitle id="modal-title" eyebrow="Irreversible">
            Revoke four sources?
          </ModalTitle>
          <ModalBody>
            Revoking removes them from the register. Entries already sealed stay on record and keep
            citing them.
          </ModalBody>
          <FactList>
            <Fact label="Scope">4 sources · WS-01</Fact>
            <Fact label="Sealed">1,284 entries stay on record</Fact>
            <Fact label="Reversible">No</Fact>
          </FactList>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary">Cancel</Button>
          <Button variant="danger">Revoke</Button>
        </ModalFooter>
      </ModalFrame>
    </Modal>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() =>
      expect(body.getByRole("dialog", { name: "Revoke four sources?" })).toBeVisible(),
    );
  },
};

/** The most dangerous actions ask the operator to type the thing back. */
export const TypeToConfirm: Story = {
  render: (args) => (
    <Modal {...args}>
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
          <div style={{ marginTop: 14 }}>
            <TextField id="confirm-name" label="Type WS-01 to confirm" mono={true} placeholder="WS-01" />
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary">Cancel</Button>
          <Button variant="danger" disabled={true}>
            Erase record
          </Button>
        </ModalFooter>
      </ModalFrame>
    </Modal>
  ),
};

/** No icon column, for a modal that is not warning about anything. */
export const Plain: Story = {
  render: (args) => (
    <Modal {...args}>
      <ModalFrame>
        <ModalContent>
          <ModalTitle id="modal-title">Export the register?</ModalTitle>
          <ModalBody>The export carries every seal, so a recipient can verify it offline.</ModalBody>
          <FactList>
            <Fact label="Format">JSON Lines, gzip</Fact>
            <Fact label="Size">≈ 84 MB</Fact>
          </FactList>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Export</Button>
        </ModalFooter>
      </ModalFrame>
    </Modal>
  ),
};

/** Closed. The dialog is in the tree but nothing is shown. */
export const Closed: Story = {
  args: { open: false },
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
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
