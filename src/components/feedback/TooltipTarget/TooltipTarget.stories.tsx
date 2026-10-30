import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../data/table/DataTable";
import { Panel } from "../../layout/page/Panel";
import { TooltipTarget } from "./TooltipTarget";

/**
 * A term that names itself on hover and on keyboard focus, drawn by
 * `Tooltip`.
 *
 * - **Use it** for a code, an id or an abbreviation whose meaning a reader
 *   may not know: a technique id, a protocol.
 * - **Not** for a control (wrap the control in `Tooltip`), for a link (a
 *   `TextLink` opens something), or for the only place a fact lives.
 *
 * Accessibility: the term is a tab stop; a screen reader hears the label as
 * its description; Escape closes the label and leaves focus on the term.
 */
const meta = {
  title: "Feedback/TooltipTarget",
  component: TooltipTarget,
  tags: ["layer:primitive", "autodocs"],
  args: { text: "RFC 3161", label: "Trusted timestamp protocol" },
  argTypes: { text: { control: "text" }, label: { control: "text" } },
} satisfies Meta<typeof TooltipTarget>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Technique ids in a table cell name themselves; the scroll frame does not clip the label. */
export const InATableCell: Story = {
  render: () => (
    <Panel title="Techniques seen" padded={false}>
      <DataTable caption="Techniques seen" indexed={false}>
        <TableHead>
          <TableColumn>Technique</TableColumn>
          <TableColumn>Signals</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell mono>
              <TooltipTarget text="T1021.002" label="Remote services: SMB admin shares" />
            </TableCell>
            <TableCell>312</TableCell>
          </TableRow>
          <TableRow>
            <TableCell mono>
              <TooltipTarget text="T1550.002" label="Pass the hash" />
            </TableCell>
            <TableCell>111</TableCell>
          </TableRow>
        </TableBody>
      </DataTable>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const term = canvas.getByText("T1021.002");
    term.focus();
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() =>
      expect(body.getByText("Remote services: SMB admin shares", { selector: ".di-tooltip" })).toBeVisible(),
    );
  },
};

/** Focus opens the label; Escape closes it again without moving focus. */
export const Focused: Story = {
  play: async ({ canvas, canvasElement }) => {
    const term = canvas.getByText("RFC 3161");
    await expect(term).toHaveAccessibleDescription("Trusted timestamp protocol");
    await userEvent.tab();
    await expect(term).toHaveFocus();
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() =>
      expect(body.getByText("Trusted timestamp protocol", { selector: ".di-tooltip" })).toBeVisible(),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByText("Trusted timestamp protocol", { selector: ".di-tooltip" })).toBeNull());
    await expect(term).toHaveFocus();
  },
};

/** Inside a mono run, the term keeps the type around it. */
export const InMonoText: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p style={{ fontFamily: "var(--di-font-code)" }}>
      sealed under <TooltipTarget text="RFC 3161" label="Trusted timestamp protocol" />,{" "}
      <TooltipTarget text="SHA-256" label="Secure hash, 256 bits" />
    </p>
  ),
};
