import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { WatchlistScreen } from "./Watchlist";

const meta = {
  title: "Patterns/Watchlist",
  tags: ["layer:screen", "!autodocs"],
  component: WatchlistScreen,
  parameters: { layout: "fullscreen" },
  args: { state: "ready" },
} satisfies Meta<typeof WatchlistScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The new matches are the one thing that needs the reader; the list is the record, each entry with its last
 * match and its actions in one menu.
 */
export const Monitor: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Watchlist" })).toBeVisible();
    await expect(canvas.getByRole("table", { name: "Watched entries" })).toBeVisible();
    const doc = canvasElement.ownerDocument;
    await expect(doc.documentElement.scrollWidth).toBeLessThanOrEqual(doc.documentElement.clientWidth);
  },
};

/** An entry's actions: pause or remove, the removal marked as danger. */
export const EntryActions: Story = {
  name: "Entry actions",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Actions for harthaus.example" }));
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByRole("menuitem", { name: "Remove from the watchlist" })).toBeVisible());
    await userEvent.keyboard("{Escape}");
  },
};

/** A workspace that watches nothing yet: one notice in place of the list, with the way in. */
export const Empty: Story = {
  name: "Nothing watched",
  args: { state: "empty" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("Nothing is watched yet");
    await expect(canvas.queryByRole("table")).toBeNull();
  },
};
