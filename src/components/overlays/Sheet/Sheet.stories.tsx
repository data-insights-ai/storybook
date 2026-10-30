import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Fact, FactList } from "../../data/records/FactList";
import { Sheet, SheetFooter } from "./Sheet";

const meta = {
  title: "Overlays/Sheet",
  component: Sheet,
  tags: ["layer:block", "status:deprecated"],
  args: {
    open: false,
    title: "Jonas Brandt",
    lede: "jonas.brandt@data-insights.ai",
    eyebrow: "Member · WS-01",
    closeLabel: "Close",
    onClose: () => {},
    children: null,
  },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Deprecated: `Sheet` is `Dialog placement="side"` and draws exactly as it does. Use `Dialog`. */
export const Record: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open member
        </Button>
        <Sheet {...args} open={open} onClose={() => setOpen(false)}>
          <FactList layout="columns">
            <Fact label="Role">Administrator</Fact>
            <Fact label="Joined">3 Mar 2026</Fact>
          </FactList>
          <SheetFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Change role
            </Button>
          </SheetFooter>
        </Sheet>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Open member" }));
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("dialog", { name: "Jonas Brandt" });
    await waitFor(() => expect(dialog).toBeVisible());
    await waitFor(() => expect(within(dialog).getByRole("heading", { name: "Jonas Brandt" })).toHaveFocus());
  },
};
