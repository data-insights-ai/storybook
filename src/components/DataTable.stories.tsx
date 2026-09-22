import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CellStack,
  DataTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
} from "./DataTable";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Components/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  args: {
    caption: "Watched identities",
  },
  argTypes: {
    children: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Identities: Story = {
  args: { children: null },
  render: (args) => (
    <DataTable {...args} footer="2 of 2 entries active">
      <TableHead>
        <TableColumn>Identity</TableColumn>
        <TableColumn>Status</TableColumn>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            <CellStack primary="nora feld" secondary="Normalized full name" />
          </TableCell>
          <TableCell>
            <StatusPill tone="ok">Active</StatusPill>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <CellStack primary="nora.feld@data-insights.ai" secondary="Verified mailbox" />
          </TableCell>
          <TableCell>
            <StatusPill tone="ok">Active</StatusPill>
          </TableCell>
        </TableRow>
      </TableBody>
    </DataTable>
  ),
};
