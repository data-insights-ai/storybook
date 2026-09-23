import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { RegisterScreen } from "./Register";

const meta = {
  title: "Screens/Register",
  component: RegisterScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RegisterScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The flagship view: the extract, the tiles that measure it, and the
 * drawer that opens one row without hiding the rest.
 */
export const Sources: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("table", { name: "Sources on record" })).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 1, name: "Source register" })).toBeVisible();
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
