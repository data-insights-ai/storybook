import type { Meta, StoryObj } from "@storybook/react-vite";
import { onPanel } from "../../../../../.storybook/onPanel";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { PageFailure } from "../PageFailure";
import { RouteBoundary } from "./RouteBoundary";

function Broken(): never {
  throw new Error("unexpected data");
}

const failure = (
  <PageFailure
    title="This page could not be shown"
    body="Load a fresh copy; the rest of the app keeps working."
    reloadLabel="Reload"
  />
);

const meta = {
  title: "Feedback/Recovery/RouteBoundary",
  component: RouteBoundary,
  tags: ["layer:block", "autodocs"],
  decorators: [onPanel("Report")],
  args: { fallback: null, children: null },
} satisfies Meta<typeof RouteBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A page that fails while it renders leaves the shell usable; another page tries again. */
export const Default: Story = {
  render: function Render() {
    const [page, setPage] = useState("broken");
    return (
      <>
        <Button variant="secondary" onClick={() => setPage(page === "broken" ? "fine" : "broken")}>
          Go to the other page
        </Button>
        <RouteBoundary resetKey={page} fallback={failure}>
          {page === "broken" ? <Broken /> : <p>The other page.</p>}
        </RouteBoundary>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("This page could not be shown")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Go to the other page" }));
    await expect(canvas.getByText("The other page.")).toBeVisible();
  },
};
