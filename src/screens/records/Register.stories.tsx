import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ProductShell } from "../shell/ProductShell";
import { RegisterScreen } from "./Register";

const meta = {
  title: "Patterns/Register",
  tags: ["layer:screen"],
  component: RegisterScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <ProductShell area="workspace" active="sources" crumbs={["Example Security GmbH", "Production", "Sources"]}>
        <Story />
      </ProductShell>
    ),
  ],
} satisfies Meta<typeof RegisterScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The flagship view: the extract and the tiles that measure it. A row
 * opens its detail in a sheet that keeps the row's ordinal.
 */
export const Sources: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("table", { name: "Sources on record" })).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 1, name: "Source register" })).toBeVisible();
  },
};

/** A row pressed: its detail opens in a sheet carrying the row's ordinal, and Esc closes it. */
export const OpenRow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("feed.example.io"));
    const body = within(canvasElement.ownerDocument.body);
    const title = await body.findByRole("heading", { level: 2, name: "feed.example.io" });
    await waitFor(() => expect(title).toBeVisible());
    await expect(body.getByText("Rate limit from the upstream host")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("heading", { level: 2, name: "feed.example.io" })).toBeNull());
  },
};

/**
 * The night sheet. Gold fills the committing control, because navy
 * cannot act against a navy ground — the one exception to the gold rule.
 */
export const Night: Story = {
  globals: { theme: "dark" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("table", { name: "Sources on record" })).toBeVisible();
  },
};
