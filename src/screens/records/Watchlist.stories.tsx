import type { Meta, StoryObj } from "@storybook/react-vite";
import { Console } from "../../../.storybook/Console";
import { sampleChrome } from "../../../.storybook/chrome.sample";
import { WatchlistScreen } from "./Watchlist";

const meta = {
  title: "Patterns/Watchlist",
  tags: ["layer:screen"],
  component: WatchlistScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <Console title="Watchlist" crumb={["Monitor", "Watchlist"]} active="watchlist" chrome={sampleChrome}>
        <Story />
      </Console>
    ),
  ],
} satisfies Meta<typeof WatchlistScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Monitor: Story = {};
