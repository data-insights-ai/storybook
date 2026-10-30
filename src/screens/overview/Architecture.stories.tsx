import type { Meta, StoryObj } from "@storybook/react-vite";
import { Console } from "../../../.storybook/Console";
import { sampleChrome } from "../../../.storybook/chrome.sample";
import { ArchitectureScreen } from "./Architecture";

const meta = {
  title: "Patterns/Architecture",
  tags: ["layer:screen"],
  component: ArchitectureScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <Console title="Architecture" crumb={["Operate", "Architecture"]} active="architecture" chrome={sampleChrome}>
        <Story />
      </Console>
    ),
  ],
} satisfies Meta<typeof ArchitectureScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pipeline: Story = {};
