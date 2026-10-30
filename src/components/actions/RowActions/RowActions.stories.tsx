import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal, RotateCw } from "lucide-react";
import { expect, within } from "storybook/test";
import { Button } from "../Button";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../data/table/DataTable";
import { RowActions } from "./RowActions";

const meta = {
  title: "Actions/RowActions",
  component: RowActions,
  tags: ["layer:block", "status:deprecated"],
  args: { children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof RowActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Deprecated: renders `Toolbar variant="row"`; give the new one a `label`. */
export const InARow: Story = {
  render: () => (
    <DataTable caption="Invitations" indexed={false}>
      <TableHead>
        <TableColumn width="fill">Email</TableColumn>
        <TableColumn align="end">Actions</TableColumn>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell mono>mira.kern@northwind.example</TableCell>
          <TableCell align="end">
            <RowActions>
              <Button variant="ghost" size="sm" iconOnly aria-label="Resend to mira.kern@northwind.example">
                <RotateCw aria-hidden />
              </Button>
              <Button variant="ghost" size="sm" iconOnly aria-label="Actions for mira.kern@northwind.example">
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
