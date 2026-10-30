import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductShell } from "../shell/ProductShell";
import { CoverageScreen } from "./Coverage";

const meta = {
  title: "Patterns/Coverage",
  tags: ["layer:screen"],
  component: CoverageScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <ProductShell area="workspace" active="coverage" crumbs={["Example Security GmbH", "Production", "Coverage"]}>
        <Story />
      </ProductShell>
    ),
  ],
} satisfies Meta<typeof CoverageScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sources: Story = {};
