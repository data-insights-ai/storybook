import type { Meta, StoryObj } from "@storybook/react-vite";
import { WatchlistScreen } from "./Watchlist";

const meta = {
  title: "Screens/Watchlist",
  tags: ["layer:screen"],
  component: WatchlistScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof WatchlistScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Monitor: Story = {};
