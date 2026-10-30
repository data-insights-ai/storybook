import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, RefreshCw, Settings } from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Panel, PanelActions, PanelMeta } from "../../layout/page/Panel";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../data/table/DataTable";
import { StatusPill } from "../../marks/status/StatusPill";
import { Tooltip } from "./Tooltip";

/**
 * A short label for a control that has none.
 *
 * - **Use it** to name an icon-only button, a collapsed navigation item, or
 *   (through `TooltipTarget`) a code or abbreviation in running text.
 * - **Not** for a fact a reader needs (write it on the screen, or use
 *   `FactList`), for an explanation (`Notice` or a `PanelNote`), or for a
 *   value at a point of a chart (the chart's own readout).
 *
 * Anatomy: the trigger it wraps, then the label in a navy bubble, with an
 * optional count (`badge`). Content: the control's name in a word or three,
 * the same words as its `aria-label`; no sentence, no punctuation.
 * Accessibility: it opens on hover and on keyboard focus and closes on
 * Escape; the trigger keeps its own accessible name, so a screen reader
 * hears the control, not the tooltip.
 */
const meta = {
  title: "Feedback/Tooltip",
  component: Tooltip,
  tags: ["layer:block", "autodocs"],
  args: { label: "Export as CSV", side: "top", children: <span /> },
  argTypes: {
    side: { control: "radio", options: ["top", "right", "bottom", "left"] },
    children: { control: false },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const sources = [
  ["feed.example.io", "running"],
  ["beta.example.dev", "paused"],
  ["archive.example.net", "running"],
] as const;

/**
 * The icon actions in a panel's head name themselves on hover and on
 * focus. Both are the same quiet icon button, centred on the title's line;
 * the count is the head's meta. Hovered with the pointer, the control shows
 * its tooltip and no focus ring; the tooltip keeps 8px from the window's
 * edge and covers neither its own button nor the one beside it.
 */
export const OnAnIconButton: Story = {
  render: (args) => (
    <Panel title="Sources" heading={2} padded={false}>
      <PanelMeta>12 sources</PanelMeta>
      <PanelActions>
        <Tooltip label="Refresh">
          <Button variant="ghost" size="sm" iconOnly aria-label="Refresh">
            <RefreshCw />
          </Button>
        </Tooltip>
        <Tooltip label={args.label} side={args.side}>
          <Button variant="ghost" size="sm" iconOnly aria-label={args.label}>
            <Download />
          </Button>
        </Tooltip>
      </PanelActions>
      <DataTable caption="Source hosts and their state" indexed={false}>
        <TableHead>
          <TableColumn width="fill">Host</TableColumn>
          <TableColumn align="end">State</TableColumn>
        </TableHead>
        <TableBody>
          {sources.map(([host, state]) => (
            <TableRow key={host}>
              <TableCell mono>{host}</TableCell>
              <TableCell align="end">
                <StatusPill tone={state === "running" ? "ok" : "warn"}>{state}</StatusPill>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </Panel>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole("heading", { name: "Sources" }).getBoundingClientRect();
    const [refresh, exportButton] = [
      canvas.getByRole("button", { name: "Refresh" }),
      canvas.getByRole("button", { name: args.label }),
    ];
    const a = refresh.getBoundingClientRect();
    const b = exportButton.getBoundingClientRect();
    await expect([a.width, a.height]).toEqual([b.width, b.height]);
    await expect(refresh.className).toBe(exportButton.className);
    const middle = (r: DOMRect) => r.top + r.height / 2;
    await expect(Math.abs(middle(a) - middle(title))).toBeLessThanOrEqual(2);
    await expect(Math.abs(middle(b) - middle(title))).toBeLessThanOrEqual(2);
    await userEvent.hover(exportButton);
    const body = within(canvasElement.ownerDocument.body);
    const tip = await waitFor(() => body.getByText(args.label, { selector: ".di-tooltip" }));
    await waitFor(() => expect(tip).toBeVisible());
    const box = tip.getBoundingClientRect();
    const view = canvasElement.ownerDocument.documentElement.clientWidth;
    await expect(box.right).toBeLessThanOrEqual(view - 8);
    await expect(box.left).toBeGreaterThanOrEqual(8);
    const overlaps = (r: DOMRect) =>
      box.left < r.right && box.right > r.left && box.top < r.bottom && box.bottom > r.top;
    await expect([overlaps(a), overlaps(b)]).toEqual([false, false]);
    await expect(exportButton).not.toHaveFocus();
  },
};

/** Escape closes it and leaves focus on the control. */
export const ClosesOnEscape: Story = {
  render: (args) => (
    <Tooltip label={args.label}>
      <Button variant="ghost" iconOnly aria-label={args.label}>
        <Download />
      </Button>
    </Tooltip>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.tab();
    await waitFor(() => expect(body.getByText(args.label, { selector: ".di-tooltip" })).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByText(args.label, { selector: ".di-tooltip" })).toBeNull());
    await expect(canvas.getByRole("button", { name: args.label })).toHaveFocus();
  },
};

/** A count beside the label: a collapsed navigation item still says how much waits behind it. */
export const WithACount: Story = {
  args: { label: "Cases", side: "right" },
  render: (args) => (
    <Tooltip label={args.label} side={args.side} badge="3" badgeTone="alert">
      <Button variant="ghost" iconOnly aria-label={`${args.label}, 3 open`}>
        <Settings />
      </Button>
    </Tooltip>
  ),
  play: async ({ canvasElement, args }) => {
    await userEvent.tab();
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByText(args.label, { selector: ".di-tooltip" })).toBeVisible());
  },
};
