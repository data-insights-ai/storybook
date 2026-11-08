import type { Meta, StoryObj } from "@storybook/react-vite";
import { onPanel } from "../../../../../.storybook/onPanel";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { StaleNotice } from "./StaleNotice";

const meta = {
  title: "Feedback/Recovery/StaleNotice",
  component: StaleNotice,
  tags: ["layer:block", "autodocs"],
  decorators: [onPanel("")],
  args: { stale: true, message: "New entries arrived.", actionLabel: "Show them", onRefresh: () => undefined },
} satisfies Meta<typeof StaleNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Announced once, shown once; reading again puts the reader on the list's heading. */
export const Default: Story = {
  render: function Render(args) {
    const [stale, setStale] = useState(true);
    return (
      <>
        <h2 id="stale-heading">Findings</h2>
        <StaleNotice
          {...args}
          stale={stale}
          onRefresh={() => setStale(false)}
          focusTarget={() => document.getElementById("stale-heading")}
        />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("New entries arrived.");
    await userEvent.click(canvas.getByRole("button", { name: "Show them" }));
    await expect(canvas.getByRole("heading", { name: "Findings" })).toHaveFocus();
    await expect(canvas.queryByRole("button", { name: "Show them" })).toBeNull();
  },
};
