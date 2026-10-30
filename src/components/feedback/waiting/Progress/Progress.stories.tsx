import { useCallback, useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { Panel, PanelFooter } from "../../../layout/page/Panel";
import { Progress } from "./Progress";

const meta = {
  title: "Feedback/Waiting/Progress",
  component: Progress,
  tags: ["layer:primitive", "autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Purpose:** shows how far a counted wait has come: what is running, how many of how many, and the same share as a bar.",
          "**When to use:** an import, a sync, an upload or any job that knows its total. **When not to:** a wait with no count is `Loading`; a page change is `RouteProgress`; a share of a quota or a limit (“1 of 10 seats used”, storage used) is a measurement, `LevelMeter`.",
          "**Anatomy:** the label (what is running), the count at the end of the same line, the bar under both.",
          "**Variants:** none that change the meaning. `countTrack` is deprecated: a count in words was only ever a quota.",
          "**States:** running, nearly done, complete (the label says so: “Import complete”). On failure, replace it with a `Notice`.",
          "**Content rules:** the label names the job in a few words; the count is in figures with the unit implied by the label, “1,284 of 4,000”.",
          "**Accessibility:** a native `progress` (role progressbar) named by its visible label through `htmlFor`; the count is visible text, so the bar never carries the number alone.",
        ].join("\n\n"),
      },
    },
  },
  args: {
    id: "ingest",
    label: "Importing sources",
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
    countTrack: { table: { disable: true } },
  },
  render: (args) => (
    <Panel title="Import">
      <Progress {...args} />
    </Panel>
  ),
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A counted wait actually counting, in the panel that started it. The bar
 * and the number move together, because the bar alone does not say how
 * much is left.
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
      <Panel title="Import">
        <Progress
          id="counting"
          label={done === total ? "Import complete" : "Importing sources"}
          count={`${done.toLocaleString("en")} of ${total.toLocaleString("en")}`}
          value={(done / total) * 100}
        />
        <PanelFooter>
          <Button variant="secondary" size="sm" onClick={run}>
            Run again
          </Button>
        </PanelFooter>
      </Panel>
    );
  },
};

/** The label says what runs, the count how far it is. */
export const Counted: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("1,284 of 4,000")).toBeVisible();
    await expect(canvas.getByRole("progressbar", { name: "Importing sources" })).toBeInTheDocument();
  },
};

export const JustStarted: Story = {
  args: { value: 2, count: "84 of 4,000" },
};

export const NearlyDone: Story = {
  args: { value: 96, count: "3,842 of 4,000" },
};

export const Complete: Story = {
  args: { value: 100, count: "4,000 of 4,000", label: "Import complete" },
};

/** A long German label wraps; the count keeps its place at the end of the first line. */
export const German: Story = {
  args: { label: "Quellen werden aus dem Sicherheitsregister importiert", count: "1.284 von 4.000" },
};
