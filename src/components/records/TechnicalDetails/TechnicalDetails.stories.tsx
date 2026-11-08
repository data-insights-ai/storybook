import type { Meta, StoryObj } from "@storybook/react-vite";
import { onPanel } from "../../../../.storybook/onPanel";
import { expect, userEvent, within } from "storybook/test";
import { TechnicalDetails } from "./TechnicalDetails";

const meta = {
  title: "Records/TechnicalDetails",
  component: TechnicalDetails,
  tags: ["layer:block", "autodocs"],
  decorators: [onPanel("Audit entry")],
  args: {
    id: "entry-technical",
    title: "Technical details",
    toggleLabel: "Show technical details",
    copyLabel: (label: string) => `Copy ${label}`,
    copiedLabel: "Copied",
    values: [
      { key: "actor", label: "Actor", value: "user:2f9c0e" },
      { key: "action", label: "Action", value: "key.created" },
      { key: "credential", label: "Credential", value: "" },
      { key: "requestId", label: "Request id", value: "req-7f3a99e0c1d2" },
    ],
  },
} satisfies Meta<typeof TechnicalDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Closed until asked for; each raw value is there to copy, empty ones are left out. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Show technical details" }));
    await expect(canvas.getByRole("button", { name: "Copy Request id" })).toBeVisible();
    await expect(canvas.queryByText("Credential")).toBeNull();
  },
};
