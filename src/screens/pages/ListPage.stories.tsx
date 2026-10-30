import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ProductShell } from "../shell/ProductShell";
import { ListPageScreen } from "./ListPage";

const meta = {
  title: "Patterns/List page",
  tags: ["layer:screen", "!autodocs"],
  component: ListPageScreen,
  parameters: { layout: "fullscreen" },
  args: { lang: "en", state: "ready", query: "" },
  decorators: [
    (Story, { args }) => (
      <ProductShell
        area="organization"
        active="members"
        lang={args.lang}
        crumbs={["Example Security GmbH", args.lang === "de" ? "Mitglieder" : "Members"]}
      >
        <Story />
      </ProductShell>
    ),
  ],
} satisfies Meta<typeof ListPageScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No horizontal scroll at any width; the table stacks its rows on a phone. */
async function fits(canvasElement: HTMLElement) {
  const root = canvasElement.ownerDocument.documentElement;
  await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
}

/**
 * The header names the list and holds its one action; the search narrows
 * it; the table sits on a panel with its count and pages under it. A row
 * opens its member beside the list.
 */
export const Members: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Members" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: /Invite people/ })).toHaveClass("di-btn-primary");
    await expect(canvas.getByRole("table", { name: "Members of Example Security GmbH" })).toBeVisible();
    await expect(canvas.getByText("1–6 of 8 members")).toBeVisible();
    await fits(canvasElement);
  },
};

/** A row pressed: the member opens in a dialog beside the list; removing them is the one danger button at its foot. */
export const MemberOpen: Story = {
  name: "Member open",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("Jonas Brandt"));
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole("dialog", { name: "Jonas Brandt" });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(within(dialog).getByRole("button", { name: "Remove from organization" })).toHaveClass("di-btn-danger");
  },
};

/** The search found nothing: the table gives way to one message with the way back. */
export const NoMatch: Story = {
  name: "No match",
  args: { query: "zander" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("No member matches.");
    await expect(canvas.queryByRole("table")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Clear filters" }));
    await expect(canvas.getByRole("table")).toBeVisible();
  },
};

/** Loading: the table keeps its shape under the toolbar, so nothing jumps when the rows arrive. */
export const LoadingMembers: Story = {
  name: "Loading",
  args: { state: "loading" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent("Loading members");
  },
};

/** The list failed to load: it says so in its place, what was not changed, and offers one retry. */
export const LoadError: Story = {
  name: "Load error",
  args: { state: "error" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent("The members could not be loaded.");
    await expect(canvas.getByRole("button", { name: "Try again" })).toBeVisible();
  },
};

/** German, formal: the longest words in the bar, the toolbar and the columns hold on a phone. */
export const German: Story = {
  args: { lang: "de" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Mitglieder" })).toBeVisible();
    await expect(canvas.getByText("1–6 von 8 Mitgliedern")).toBeVisible();
    await fits(canvasElement);
  },
};
