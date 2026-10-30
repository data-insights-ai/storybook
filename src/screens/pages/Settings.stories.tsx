import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductShell } from "../shell/ProductShell";
import { SettingsScreen } from "./Settings";

const meta = {
  title: "Patterns/Settings",
  tags: ["layer:screen"],
  component: SettingsScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <ProductShell area="workspace" active="settings" crumbs={["Example Security GmbH", "Production", "Settings"]}>
        <Story />
      </ProductShell>
    ),
  ],
} satisfies Meta<typeof SettingsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Session: Story = {};
