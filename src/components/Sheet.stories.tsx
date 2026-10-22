import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "./Button";
import { Fact, FactList } from "./FactList";
import { Sheet, SheetFooter } from "./Sheet";

const meta = {
  title: "Blocks/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  args: {
    open: false,
    title: "Jonas Brandt",
    lede: "jonas.brandt@data-insights.ai",
    closeLabel: "Close",
    size: "md",
    onClose: () => {},
    children: null,
  },
  argTypes: { size: { control: "radio", options: ["md", "lg", "xl"] }, children: { control: false } },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

function Opener(args: { title: string; lede?: string; closeLabel: string; size?: "md" | "lg" | "xl" }) {
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
            Close
          </Button>
        </SheetFooter>
      </Sheet>
    </>
  );
}

/** Opens from the right edge; Escape or the close button returns focus to the opener. */
export const Record: Story = {
  render: (args) => <Opener {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const opener = canvas.getByRole("button", { name: "Open member" });
    await userEvent.click(opener);
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("dialog");
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(opener).toHaveFocus());
  },
};
