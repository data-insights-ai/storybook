import type { Meta, StoryObj } from "@storybook/react-vite";
import { onPanel } from "../../../../../.storybook/onPanel";
import { useState } from "react";
import { expect, within } from "storybook/test";
import { type DateRangeValue, periodOf, periodSearch } from "../dateRange";
import { RangeFilter } from "./RangeFilter";

const meta = {
  title: "Forms/Dates/RangeFilter",
  component: RangeFilter,
  tags: ["layer:block", "autodocs"],
  decorators: [onPanel("Activity")],
  args: { id: "period", label: "Period", value: {}, onChange: () => undefined, timeZone: "UTC" },
} satisfies Meta<typeof RangeFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

const fallback: DateRangeValue = { preset: "7d" };

/** A list whose default is the last week keeps "Any time", once chosen, as range=all in the URL. */
export const Default: Story = {
  render: function Render(args) {
    const [search, setSearch] = useState<Record<string, string | undefined>>({});
    return (
      <>
        <RangeFilter
          {...args}
          value={periodOf(search, fallback)}
          onChange={(v) => setSearch(periodSearch(v, fallback))}
        />
        <p>
          <code>
            {new URLSearchParams(Object.entries(search).filter((e): e is [string, string] => !!e[1])).toString() ||
              "(default)"}
          </code>
        </p>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("(default)")).toBeVisible();
  },
};

/** In the filter sheet the label shows above the picker. */
export const InTheSheet: Story = {
  args: { place: "sheet" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("#period-sheet")).not.toBeNull();
  },
};
