import type { Meta, StoryObj } from "@storybook/react-vite";
import { Console } from "../../../.storybook/Console";
import { sampleChrome } from "../../../.storybook/chrome.sample";
import { CoverageScreen } from "./Coverage";

const meta = {
  title: "Patterns/Coverage",
  tags: ["layer:screen"],
  component: CoverageScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <Console title="Coverage" crumb={["Monitor", "Coverage"]} active="coverage" chrome={sampleChrome}>
        <Story />
      </Console>
    ),
  ],
} satisfies Meta<typeof CoverageScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sources: Story = {};
