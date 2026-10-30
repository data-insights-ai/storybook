import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { CoverageScreen } from "./Coverage";

const meta = {
  title: "Patterns/Coverage",
  tags: ["layer:screen", "!autodocs"],
  component: CoverageScreen,
  parameters: { layout: "fullscreen" },
  args: { state: "ready" },
} satisfies Meta<typeof CoverageScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The tables that stopped arriving come first, filtered by default, with
 * what each one leaves blind; the strip says what that costs in rules.
 */
export const Sources: Story = {
  name: "Tables",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Coverage" })).toBeVisible();
    await expect(canvas.getAllByRole("row")).toHaveLength(4);
    const doc = canvasElement.ownerDocument;
    await expect(doc.documentElement.scrollWidth).toBeLessThanOrEqual(doc.documentElement.clientWidth);
  },
};

/** The filter removed: every table, the arriving ones after the gaps. */
export const AllTables: Story = {
  name: "All tables",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Show every table" }));
    await waitFor(() => expect(canvas.getAllByRole("row")).toHaveLength(13));
  },
};

/** A search that finds nothing says so in place of the rows, with the way back. */
export const NoMatch: Story = {
  name: "No match",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("searchbox", { name: "Search tables" }), "kerberos");
    await waitFor(() => expect(canvas.getByRole("status")).toHaveTextContent("No table matches"));
  },
};

/** The tables are on their way: the table's shape holds the space. */
export const Loading: Story = {
  args: { state: "loading" },
  play: async ({ canvasElement }) => {
    const status = await within(canvasElement).findByRole("status", { name: "Loading the tables" });
    const frame = status.closest(".di-loading-table")!;
    await expect(within(frame as HTMLElement).getByRole("search")).toBeVisible();
    await expect(canvasElement.querySelectorAll(".di-loading-table")).toHaveLength(1);
  },
};
