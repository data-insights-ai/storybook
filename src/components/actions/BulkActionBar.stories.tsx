import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { BulkActionBar } from "./BulkActionBar";
import { Button } from "./Button";
import { Flyout, FlyoutFooter, FlyoutTrigger } from "../overlays/Flyout";
import { Menu, MenuItem } from "../navigation/Menu";
import { TextField } from "../forms/TextField";

function Actions() {
  const [level, setLevel] = useState(false);
  const [tags, setTags] = useState(false);
  const [tag, setTag] = useState("");
  return (
    <>
      <Menu
        open={level}
        onOpenChange={setLevel}
        align="end"
        label="Set criticality"
        trigger={(props) => (
          <Button {...props} variant="secondary" size="dense">
            Set criticality
            <ChevronDown aria-hidden />
          </Button>
        )}
      >
        <MenuItem onSelect={() => setLevel(false)}>Low</MenuItem>
        <MenuItem onSelect={() => setLevel(false)}>High</MenuItem>
        <MenuItem onSelect={() => setLevel(false)}>Crown jewel</MenuItem>
      </Menu>
      <Flyout id="bulk-tags" title="Tags" open={tags} onOpenChange={setTags}>
        <FlyoutTrigger>
          <Button variant="secondary" size="dense" onClick={() => setTags(!tags)} aria-expanded={tags} aria-controls="bulk-tags">
            Tags
            <ChevronDown aria-hidden />
          </Button>
        </FlyoutTrigger>
        <TextField id="bulk-tag" label="Tag" value={tag} onChange={(e) => setTag(e.target.value)} />
        <FlyoutFooter>
          <Button size="dense" disabled={tag === ""} onClick={() => setTags(false)}>
            Add
          </Button>
          <Button size="dense" variant="secondary" disabled={tag === ""} onClick={() => setTags(false)}>
            Remove
          </Button>
        </FlyoutFooter>
      </Flyout>
    </>
  );
}

const meta = {
  title: "Blocks/BulkActionBar",
  component: BulkActionBar,
  tags: ["layer:block", "autodocs"],
  args: {
    label: "Actions on the selected assets",
    selectedLabel: "2 selected",
    selectAllLabel: "Select all 140 matching",
    clearLabel: "Clear",
    onSelectAll: fn(),
    onClear: fn(),
    sticky: false,
    children: null,
  },
  argTypes: { children: { control: false } },
  render: (args) => (
    <BulkActionBar {...args}>
      <Actions />
    </BulkActionBar>
  ),
} satisfies Meta<typeof BulkActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** In the toolbar's place: the count and the ways out at the left, the actions at the right. */
export const Selected: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("toolbar", { name: /selected assets/ })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Clear" }));
    await expect(args.onClear).toHaveBeenCalled();
  },
};

/** Escape clears the selection, as it closes anything else. */
export const EscapeClears: Story = {
  play: async ({ canvasElement, args }) => {
    within(canvasElement).getByRole("toolbar");
    await userEvent.keyboard("{Escape}");
    await expect(args.onClear).toHaveBeenCalled();
  },
};
