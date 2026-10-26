import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal, RotateCw } from "lucide-react";
import { expect, within } from "storybook/test";
import { Button } from "./Button";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../data/table/DataTable";
import { RowActions } from "./RowActions";

const meta = {
  title: "Blocks/RowActions",
  component: RowActions,
  tags: ["autodocs"],
  args: { children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof RowActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Quick actions show on hover or focus; the row menu stays visible. */
export const InARow: Story = {
  render: () => (
    <DataTable caption="Invitations" indexed={false}>
      <TableHead>
        <TableColumn width="fill">Email</TableColumn>
        <TableColumn align="end">Actions</TableColumn>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell mono>mira.kern@data-insights.ai</TableCell>
          <TableCell align="end">
            <RowActions>
              <Button variant="ghost" size="dense" iconOnly aria-label="Resend to mira.kern@data-insights.ai">
                <RotateCw aria-hidden />
              </Button>
              <Button variant="ghost" size="dense" iconOnly aria-label="Actions for mira.kern@data-insights.ai">
                <MoreHorizontal aria-hidden />
              </Button>
            </RowActions>
          </TableCell>
        </TableRow>
      </TableBody>
    </DataTable>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: /Actions for/ })).toBeVisible();
  },
};
