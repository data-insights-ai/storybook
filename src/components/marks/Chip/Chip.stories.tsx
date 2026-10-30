import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { fn } from "storybook/test";
import { Chip } from "./Chip";

const meta = {
  title: "Marks/Chip",
  component: Chip,
  tags: ["layer:primitive", "status:deprecated"],
  args: { children: "severity: high", removeLabel: "Remove the severity filter" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Deprecated: renders `Tag mono` (set: `pressed onRemove`; offered: `onClick`). */
export const Row: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      <Chip active onRemove={fn()} removeLabel="Remove the severity filter">
        severity: high
      </Chip>
      <Chip onClick={fn()} removeLabel="Add a source filter">
        <Plus aria-hidden />
        source
      </Chip>
    </div>
  ),
};
