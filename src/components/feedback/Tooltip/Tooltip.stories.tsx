import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, RefreshCw, Settings } from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Panel } from "../../layout/page/Panel";
import { Toolbar, ToolbarEnd } from "../../actions/Toolbar";
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

/** The icon buttons at the end of a list's toolbar name themselves on hover and on focus. */
export const OnAnIconButton: Story = {
  render: (args) => (
    <Panel title="Sources">
      <Toolbar>
        <span>12 sources</span>
        <ToolbarEnd>
          <Tooltip label="Refresh">
            <Button variant="ghost" iconOnly aria-label="Refresh">
              <RefreshCw />
            </Button>
          </Tooltip>
          <Tooltip label={args.label} side={args.side}>
            <Button variant="ghost" iconOnly aria-label={args.label}>
              <Download />
            </Button>
          </Tooltip>
        </ToolbarEnd>
      </Toolbar>
    </Panel>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: args.label })).toHaveFocus();
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByText(args.label, { selector: ".di-tooltip" })).toBeVisible());
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
