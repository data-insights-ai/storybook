import type { Meta, StoryObj } from "@storybook/react-vite";
import { SeverityMark } from "./SeverityMark";

const meta = {
  title: "Marks/SeverityMark",
  component: SeverityMark,
  tags: ["layer:primitive", "autodocs", "direction:a"],
  parameters: { direction: "a" },
  args: { level: "high", label: "High", variant: "mark" },
  argTypes: {
    level: { control: "radio", options: ["critical", "high", "medium", "low", "info"] },
    variant: { control: "radio", options: ["mark", "chip", "bare"] },
  },
} satisfies Meta<typeof SeverityMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The one shared scale, in the order a list sorts by. */
export const Scale: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
      <SeverityMark level="critical" label="Critical" />
      <SeverityMark level="high" label="High" />
      <SeverityMark level="medium" label="Medium" />
      <SeverityMark level="low" label="Low" />
      <SeverityMark level="info" label="Info" />
      <SeverityMark level="critical" label="Critical" variant="chip" />
    </div>
  ),
};
