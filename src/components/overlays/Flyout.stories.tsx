import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell } from "lucide-react";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../actions/Button";
import { CountButton } from "../actions/CountButton";
import { CellStack, DataTable, TableBody, TableCell, TableRow } from "../data/table/DataTable";
import { Flyout, FlyoutFooter, FlyoutTrigger } from "./Flyout";
import { StatusPill } from "../data/marks/StatusPill";
import { TextLink } from "../navigation/TextLink";

const meta = {
  title: "Blocks/Flyout",
  component: Flyout,
  tags: ["autodocs"],
} satisfies Meta<typeof Flyout>;

export default meta;

const entries = [
  { title: "Source North hub stopped collecting", when: "09:12", tone: "danger" as const, state: "Unread" },
  { title: "Nora Feld granted Analyst on Operations", when: "08:47", tone: "neutral" as const, state: "Unread" },
  { title: "Workspace Lab renamed to Research", when: "Yesterday", tone: "ok" as const, state: "Read" },
];

function Notifications() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", minHeight: 420 }}>
      <Flyout id="latest" title="Notifications" open={open} onOpenChange={setOpen}>
        <FlyoutTrigger>
          <CountButton
            label="Notifications, 2 unread"
            count={2}
            countLabel="2"
            expanded={open}
            controls="latest"
            onClick={() => setOpen(!open)}
          >
            <Bell />
          </CountButton>
        </FlyoutTrigger>
        <DataTable caption="Latest notifications" indexed={false} narrow="stack">
          <TableBody>
            {entries.map((e) => (
              <TableRow key={e.title}>
                <TableCell>
                  <CellStack primary={e.title} secondary={e.when} />
                </TableCell>
                <TableCell align="end">
                  <StatusPill tone={e.tone}>{e.state}</StatusPill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
        <FlyoutFooter>
          <TextLink href="#all">All notifications</TextLink>
          <Button variant="secondary" size="dense">
            Mark all read
          </Button>
        </FlyoutFooter>
      </Flyout>
    </div>
  );
}

export const FromTheTopbar: StoryObj = {
  render: () => <Notifications />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bell = canvas.getByRole("button", { name: "Notifications, 2 unread" });
    await userEvent.click(bell);
    const panel = await canvas.findByRole("dialog", { name: "Notifications" });
    await expect(bell).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(panel).toHaveFocus());
    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByRole("dialog")).toBeNull();
    await expect(bell).toHaveFocus();
  },
};
