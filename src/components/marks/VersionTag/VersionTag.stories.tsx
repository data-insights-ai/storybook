import type { Meta, StoryObj } from "@storybook/react-vite";
import { VersionTag } from "./VersionTag";

const meta = {
  title: "Marks/VersionTag",
  component: VersionTag,
  tags: ["layer:primitive", "status:deprecated"],
  args: { children: "v4.18.2" },
} satisfies Meta<typeof VersionTag>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Deprecated: renders `Tag mono`. */
export const Default: Story = {};
