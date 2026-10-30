import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Delayed } from "./Delayed";
import { Spinner } from "../waiting/Spinner";

const meta = {
  title: "Feedback/Delayed",
  component: Delayed,
  tags: ["layer:block", "autodocs"],
  args: { delay: 150, children: null },
  argTypes: { delay: { control: { type: "number" } }, children: { control: false } },
} satisfies Meta<typeof Delayed>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The indicator is laid out at once and shown after `delay`. The space is
 * held from the first frame, so the line below never moves.
 */
export const Appearing: Story = {
  render: function Render(args) {
    const [run, setRun] = useState(0);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <Button variant="secondary" size="sm" onClick={() => setRun((n) => n + 1)}>
            Wait again
          </Button>
        </div>
        <Delayed key={run} delay={args.delay}>
          <Spinner label="resolving hosts" />
        </Delayed>
        <p>This line stays where it is.</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText("resolving hosts")).toBeVisible());
  },
};
