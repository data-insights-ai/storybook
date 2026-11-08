import type { Meta, StoryObj } from "@storybook/react-vite";
import { onPanel } from "../../../../../.storybook/onPanel";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { Toasts } from "./Toasts";
import { toast } from "./toastStore";

const meta = {
  title: "Feedback/Toast/Toasts",
  component: Toasts,
  tags: ["layer:block", "autodocs"],
  decorators: [onPanel("Reports")],
  args: { dismissLabel: "Dismiss" },
} satisfies Meta<typeof Toasts>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `toast()` from anywhere, a mutation's success too; a new receipt replaces the last. */
export const Default: Story = {
  render: (args) => (
    <>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: "Report generated.",
            body: "It is ready to download.",
            download: { label: "Download", href: "#report.pdf" },
          })
        }
      >
        Generate report
      </Button>
      <Toasts {...args} />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Generate report" }));
    await waitFor(() => expect(canvas.getByText("Report generated.")).toBeVisible());
    await expect(canvas.getByRole("link", { name: "Download" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }));
    await expect(canvas.queryByText("Report generated.")).toBeNull();
  },
};
