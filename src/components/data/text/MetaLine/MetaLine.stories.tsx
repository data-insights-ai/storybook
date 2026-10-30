import type { Meta, StoryObj } from "@storybook/react-vite";
import { MetaLine } from "./MetaLine";

const meta = {
  title: "Data/Text/MetaLine",
  component: MetaLine,
  tags: ["layer:primitive", "autodocs", "direction:a"],
  parameters: { direction: "a" },
  args: { items: "As of 12 Oct, 10:00 · 14 sources · 3 open cases · updates live" },
} satisfies Meta<typeof MetaLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Narrow: the line breaks between items, never inside one, never on a lone separator. */
export const Narrow: Story = {
  render: (args) => (
    <div style={{ maxWidth: 220, fontFamily: "var(--di-font-code)", fontSize: "var(--di-font-size-300)" }}>
      <MetaLine {...args} />
    </div>
  ),
};
