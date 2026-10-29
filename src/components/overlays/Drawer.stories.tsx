import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../actions/Button";
import { Drawer, DrawerFooter } from "./Drawer";
import { SealValue } from "../data/marks/Seal";
import { StatusPill } from "../data/marks/StatusPill";
import { Fact, FactList } from "../data/FactList";

const meta = {
  title: "Blocks/Drawer",
  component: Drawer,
  tags: ["layer:block", "autodocs"],
  args: {
    index: "03",
    eyebrow: "Source · WS-01",
    title: "feed.example.io",
    titleId: "drawer-title",
    closeLabel: "Close the source detail",
    onClose: fn(),
    children: null,
  },
  argTypes: {
    index: { control: "text" },
    eyebrow: { control: "text" },
    title: { control: "text" },
    titleId: { control: "text" },
    closeLabel: { control: "text" },
    children: { control: false },

  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The detail keeps the row's ordinal, so the two are the same object. */
export const Default: Story = {
  render: (args) => (
    <Drawer {...args}>
      <FactList>
        <Fact label="Kind">Feed</Fact>
        <Fact label="Manifest">
          <SealValue state="sealed" stateLabel="Sealed">
            c18b70d4
          </SealValue>
        </Fact>
        <Fact label="Last seen">08:47:11Z</Fact>
        <Fact label="State">
          <StatusPill tone="warn">paused</StatusPill>
        </Fact>
      </FactList>
    </Drawer>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText("03")).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: "Close the source detail" }));
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
};

/** A dialog: focus moves in, Tab stays inside, Escape closes it and focus goes back to the opener. */
export const Keyboard: Story = {
  parameters: { controls: { disable: true } },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, minHeight: 320 }}>
        <Button variant="secondary" size="dense" onClick={() => setOpen(true)}>
          Open entry 03
        </Button>
        {open ? (
          <Drawer {...args} onClose={() => setOpen(false)}>
            <FactList>
              <Fact label="Kind">Feed</Fact>
            </FactList>
            <DrawerFooter>
              <Button variant="primary" size="dense">
                Resume
              </Button>
            </DrawerFooter>
          </Drawer>
        ) : null}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const opener = canvas.getByRole("button", { name: "Open entry 03" });
    await userEvent.click(opener);
    const dialog = canvas.getByRole("dialog", { name: "feed.example.io" });
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Close the source detail" })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Resume" })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Close the source detail" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByRole("dialog")).toBeNull();
    await expect(opener).toHaveFocus();
  },
};

/** With the actions this record allows, under its own rule. */
export const WithActions: Story = {
  render: (args) => (
    <Drawer {...args}>
      <FactList>
        <Fact label="Kind">Feed</Fact>
        <Fact label="Manifest">
          <SealValue state="sealed" stateLabel="Sealed">
            c18b70d4
          </SealValue>
        </Fact>
        <Fact label="Paused at">08:47:11Z</Fact>
        <Fact label="Reason">Rate limit from the upstream host</Fact>
      </FactList>
      <DrawerFooter>
        <Button variant="primary" size="dense">
          Resume
        </Button>
        <Button variant="secondary" size="dense">
          Open log
        </Button>
        <span style={{ marginLeft: "auto" }}>
          <Button variant="danger" size="dense">
            Revoke
          </Button>
        </span>
      </DrawerFooter>
    </Drawer>
  ),
};

/** A failed record: no manifest, and the reason stated rather than implied. */
export const Failed: Story = {
  args: { index: "04", title: "archive.example.com" },
  render: (args) => (
    <Drawer {...args}>
      <FactList>
        <Fact label="Kind">Archive</Fact>
        <Fact label="Manifest">
          <SealValue state="absent" stateLabel="Not recorded">
            none
          </SealValue>
        </Fact>
        <Fact label="Failed at">08:44:03Z</Fact>
        <Fact label="Reason">Connection reset after 2 of 14 batches</Fact>
        <Fact label="Written">Nothing</Fact>
      </FactList>
      <DrawerFooter>
        <Button variant="primary" size="dense">
          Retry ingest
        </Button>
      </DrawerFooter>
    </Drawer>
  ),
};


/**
 * Opening and closing. It arrives from the edge it lives on, in one move.
 * A second drawer replaces the first rather than stacking on it, so the
 * animation always runs against an empty slot.
 */
export const Transition: Story = {
  parameters: { controls: { disable: true } },
  render: function Render(args) {
    const [open, setOpen] = useState<string | null>("03");
    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, minHeight: 320 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Button variant="secondary" size="dense" onClick={() => setOpen("03")}>
            Open entry 03
          </Button>
          <Button variant="secondary" size="dense" onClick={() => setOpen("04")}>
            Open entry 04
          </Button>
          <Button variant="ghost" size="dense" onClick={() => setOpen(null)}>
            Close
          </Button>
        </div>
        {open === null ? null : (
          <Drawer
            {...args}
            modal={false}
            key={open}
            index={open}
            title={open === "03" ? "feed.example.io" : "archive.example.com"}
            onClose={() => setOpen(null)}
            closeLabel="Close the source detail"
          >
            <FactList>
              <Fact label="Kind">{open === "03" ? "Feed" : "Archive"}</Fact>
              <Fact label="Manifest">
                <SealValue
                  state={open === "03" ? "sealed" : "absent"}
                  stateLabel={open === "03" ? "Sealed" : "Not recorded"}
                >
                  {open === "03" ? "c18b70d4" : "none"}
                </SealValue>
              </Fact>
              <Fact label="State">
                <StatusPill tone={open === "03" ? "warn" : "danger"}>
                  {open === "03" ? "paused" : "failed"}
                </StatusPill>
              </Fact>
            </FactList>
          </Drawer>
        )}
      </div>
    );
  },
};
