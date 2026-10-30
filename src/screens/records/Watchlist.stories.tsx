import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductShell } from "../shell/ProductShell";
import { WatchlistScreen } from "./Watchlist";

const meta = {
  title: "Patterns/Watchlist",
  tags: ["layer:screen"],
  component: WatchlistScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <ProductShell area="workspace" active="actors" crumbs={["Example Security GmbH", "Production", "Watchlist"]}>
        <Story />
      </ProductShell>
    ),
  ],
} satisfies Meta<typeof WatchlistScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Monitor: Story = {};
