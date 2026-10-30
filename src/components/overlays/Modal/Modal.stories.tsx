import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Fact, FactList } from "../../data/records/FactList";
import { Download } from "lucide-react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalFrame, ModalIcon, ModalTitle } from "./Modal";

const meta = {
  title: "Overlays/Modal",
  component: Modal,
  tags: ["layer:block", "status:deprecated"],
  parameters: { docs: { story: { inline: false, height: "440px" } } },
  args: { open: true, labelledBy: "modal-title", onClose: fn(), children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Deprecated: `Modal` and its parts become `Dialog placement="center"`,
 * which takes the title, eyebrow and lede as props. The eyebrow is quiet
 * unless the dialog asks before something irreversible.
 */
export const Plain: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
    const close = () => setOpen(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Export register</Button>
        <Modal {...args} open={open} onClose={close}>
          <ModalFrame>
            <ModalIcon>
              <Download aria-hidden />
            </ModalIcon>
            <ModalContent>
              <ModalTitle id="modal-title" eyebrow="Register · WS-01">
                Export the register?
              </ModalTitle>
              <ModalBody>The export carries every seal, so a recipient can verify it offline.</ModalBody>
              <FactList>
                <Fact label="Format">JSON Lines, gzip</Fact>
                <Fact label="Size">≈ 84 MB</Fact>
              </FactList>
              <ModalFooter>
                <Button variant="secondary" onClick={close}>
                  Cancel
                </Button>
                <Button onClick={close}>Export</Button>
              </ModalFooter>
            </ModalContent>
          </ModalFrame>
        </Modal>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole("dialog", { name: "Export the register?" });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(within(dialog).getByText("Register · WS-01").closest(".di-eyebrow")).not.toHaveClass("is-danger");
  },
};
