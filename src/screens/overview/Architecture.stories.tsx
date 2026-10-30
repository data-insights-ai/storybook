import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductShell } from "../shell/ProductShell";
import { ArchitectureScreen } from "./Architecture";

const meta = {
  title: "Patterns/Architecture",
  tags: ["layer:screen"],
  component: ArchitectureScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <ProductShell area="workspace" active="settings" crumbs={["Example Security GmbH", "Production", "Architecture"]}>
        <Story />
      </ProductShell>
    ),
  ],
} satisfies Meta<typeof ArchitectureScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pipeline: Story = {};
