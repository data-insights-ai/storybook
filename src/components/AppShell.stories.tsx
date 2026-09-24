import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleChrome } from "../sample/chrome";
import { Console, ConsoleFrame } from "./AppShell";

const meta = {
  title: "Patterns/AppShell",
  component: Console,
  parameters: { layout: "fullscreen" },
  argTypes: {
    chrome: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Console>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Chrome: Story = {
  args: {
    title: "Overview",
    crumb: ["Monitor", "Overview"],
    active: "overview",
    chrome: sampleChrome,
    children: (
      <>
        <h1 className="di-sr">Overview</h1>
        <p>The rail, the tenant, and the runtime stay on every page. The content below is what changes.</p>
      </>
    ),
  },
};

/**
 * The canvas and the window on their own. A product renders the window
 * full-bleed; these stories sit it on the dotted ground so the console
 * reads as one object rather than as the page itself.
 */
export const Frame: StoryObj = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ConsoleFrame title="Overview" lang="en">
      <div style={{ padding: 24 }}>
        <h1 className="di-sr">Console frame</h1>
        <p>Whatever a product puts in the window goes here.</p>
      </div>
    </ConsoleFrame>
  ),
};
