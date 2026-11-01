import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { SecretReveal } from "./SecretReveal";
import { onPanel } from "../../../../.storybook/onPanel";

const meta = {
  title: "Actions/SecretReveal",
  component: SecretReveal,
  tags: ["layer:primitive", "autodocs"],
  decorators: [onPanel("Ticket sync")],
  args: {
    title: "Copy the key now",
    body: "This is the only time the key is shown. Store it in a secret manager; datAInsights keeps only a fingerprint.",
    label: "API key",
    value: "dik_394713b0-47c6-4950-a9b7-44f8c7849f45_a368353a69564f9a952911b1e478f4cb",
    copyLabel: "Copy key",
    copiedLabel: "Copied",
  },
} satisfies Meta<typeof SecretReveal>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Right after a key is issued: why, the whole key, and the one button. */
export const AnIssuedKey: Story = {
  play: async ({ canvasElement }) => {
    const value = within(canvasElement).getByLabelText("API key");
    await expect(getComputedStyle(value).direction).toBe("ltr");
    await expect(value.textContent).toContain("a368353a69564f9a952911b1e478f4cb");
    await expect(within(canvasElement).getByRole("button", { name: "Copy key" })).toBeVisible();
  },
};
