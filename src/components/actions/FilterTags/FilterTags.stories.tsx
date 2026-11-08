import type { Meta, StoryObj } from "@storybook/react-vite";
import { onPanel } from "../../../../.storybook/onPanel";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Tag } from "../../status/Tag";
import { FilterTags } from "./FilterTags";

const severities = ["Critical", "High", "Medium"];

const meta = {
  title: "Actions/FilterTags",
  component: FilterTags,
  tags: ["layer:block", "autodocs"],
  decorators: [onPanel("Findings")],
  args: { label: "Severity", children: null },
} satisfies Meta<typeof FilterTags>;

export default meta;
type Story = StoryObj<typeof meta>;

function Choices({ place }: { place?: "bar" | "sheet" }) {
  const [on, setOn] = useState<string[]>(["Critical"]);
  return (
    <FilterTags label="Severity" place={place}>
      {severities.map((s) => (
        <Tag
          key={s}
          pressed={on.includes(s)}
          onClick={() => setOn(on.includes(s) ? on.filter((x) => x !== s) : [...on, s])}
        >
          {s}
        </Tag>
      ))}
    </FilterTags>
  );
}

/** Toggle tags that filter together, one named group. */
export const Default: Story = {
  render: () => <Choices />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("group", { name: "Severity" })).toBeVisible();
    const high = canvas.getByRole("button", { name: "High" });
    await userEvent.click(high);
    await expect(high).toHaveAttribute("aria-pressed", "true");
  },
};

/** In the sheet the group shows its label and wraps. */
export const InTheSheet: Story = { render: () => <Choices place="sheet" /> };
