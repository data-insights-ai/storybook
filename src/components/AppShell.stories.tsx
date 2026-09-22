import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleChrome } from "../sample/chrome";
import { Console } from "./AppShell";

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
