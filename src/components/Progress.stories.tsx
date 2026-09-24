import { useCallback, useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "./Button";
import { Progress } from "./Progress";

const meta = {
  title: "Primitives/Waiting/Progress",
  component: Progress,
  tags: ["autodocs"],
  args: {
    id: "ingest",
    label: "Ingesting sources",
    count: "1,284 of 4,000",
    value: 32,
    max: 100,
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    count: { control: "text" },
    value: { control: { type: "range", min: 0, max: 100 } },
    max: { control: { type: "number" } },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Waiting is always counted. An endless bar tells an operator nothing. */
export const Counted: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("1,284 of 4,000")).toBeVisible();
  },
};

export const JustStarted: Story = {
  args: { value: 2, count: "84 of 4,000" },
};

export const NearlyDone: Story = {
  args: { value: 96, count: "3,842 of 4,000" },
};

export const Complete: Story = {
  args: { value: 100, count: "4,000 of 4,000", label: "Ingest complete" },
};

/**
 * A counted wait actually counting. The bar and the number move together,
 * because the bar alone does not say how much is left.
 */
export const Counting: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const total = 4000;
    const [done, setDone] = useState(0);
    const timer = useRef<ReturnType<typeof setInterval>>(undefined);

    const run = useCallback(() => {
      setDone(0);
      clearInterval(timer.current);
      timer.current = setInterval(() => {
        setDone((value) => {
          const next = value + 137;
          if (next >= total) {
            clearInterval(timer.current);
            return total;
          }
          return next;
        });
      }, 90);
    }, []);

    useEffect(() => {
      run();
      return () => clearInterval(timer.current);
    }, [run]);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Progress
          id="counting"
          label={done === total ? "Ingest complete" : "Ingesting sources"}
          count={`${done.toLocaleString("en")} of ${total.toLocaleString("en")}`}
          value={(done / total) * 100}
        />
        <div>
          <Button variant="secondary" size="dense" onClick={run}>
            Run again
          </Button>
        </div>
      </div>
    );
  },
};
